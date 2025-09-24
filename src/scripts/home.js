import { gsap } from "gsap";
import imgTrailEffect from "./imgTrailEffect";
import horizontalLoop from "./horizontalLoop";
import { Observer } from "gsap/Observer";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(Observer, ScrollTrigger, SplitText);

// Track the last real mouse position globally
window._lastRealMousePos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
window.addEventListener('mousemove', function(e) {
    window._lastRealMousePos = { x: e.pageX, y: e.pageY };
});

// Entry point for home page JS
export function initHomePage() {
    // Remove grain effect initialization
    
    // Wait for all resources (images, fonts, etc.) to load
    window.addEventListener('load', () => {
        // Ensure we start at the top of the page
        window.scrollTo(0, 0);

        // Set initial state of hero image
        gsap.set('.hero-img', { 
            opacity: 0, 
            scale: 1.3,
            filter: 'blur(20px)',
            transformOrigin: 'center center'
        });

        // Add scroll CTA line animation
        gsap.set('.scroll-cta-line', {
            scaleY: 0,
            transformOrigin: 'top center'
        });

        const scrollCtaTimeline = gsap.timeline({
            repeat: -1,
            defaults: {
                duration: 1,
                ease: "expo.inOut"
            }
        });

        scrollCtaTimeline
            .to('.scroll-cta-line', {
                scaleY: 1,
                transformOrigin: 'top center'
            })
            .set('.scroll-cta-line', {
                transformOrigin: 'bottom center'
            })
            .to('.scroll-cta-line', {
                scaleY: 0
            });

        // Control scroll CTA visibility based on hero section
        ScrollTrigger.create({
            trigger: '.hero-ticker-shell',
            start: 'top bottom', // Triggers as soon as the section enters viewport
            onEnter: () => {
                scrollCtaTimeline.pause();
                gsap.to('.scroll-cta-line', {
                    opacity: 0,
                    duration: 0.3
                });
            },
            onLeaveBack: () => {
                scrollCtaTimeline.play();
                gsap.to('.scroll-cta-line', {
                    opacity: 1,
                    duration: 0.3
                });
            }
        });

        // Create opacity animation
        const opacityTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: '.hero-ticker-shell',
                start: 'top bottom',
                end: 'bottom -50%',
                scrub: 1,
                onUpdate: (self) => {
                    const progress = self.progress;
                    if (progress <= 0.25) {
                        // Quick fade in and unblur during first 25%
                        gsap.to('.hero-img', { 
                            opacity: progress * 4, 
                            filter: `blur(${20 - (progress * 80)}px)`,
                            duration: 0.1 
                        });
                    } else if (progress >= 0.35) {
                        // Very quick fade out starting at 35%
                        gsap.to('.hero-img', { opacity: 1 - ((progress - 0.35) * 4), duration: 0.1 });
                    }
                }
            }
        });

        // Create scale animation
        gsap.to('.hero-img', {
            scale: 1,
            scrollTrigger: {
                trigger: '.hero-ticker-shell',
                start: 'top bottom',
                end: 'center center',
                scrub: true
            }
        });

        // Only run imgTrailEffect when hero is in view
        let imgTrailCleanup = null;
        let activationTimeout = null;

        function enableEffect() {
            clearTimeout(activationTimeout);
            activationTimeout = setTimeout(() => {
                if (typeof imgTrailCleanup === 'function') {
                    imgTrailCleanup();
                    imgTrailCleanup = null;
                }
                imgTrailCleanup = imgTrailEffect();
            }, 100);
        }

        function disableEffect() {
            clearTimeout(activationTimeout);
            if (typeof imgTrailCleanup === 'function') {
                imgTrailCleanup();
                imgTrailCleanup = null;
            }
        }

        ScrollTrigger.create({
            trigger: '.img-trail-hero-shell',
            start: 'top bottom',
            end: 'bottom 75%',
            //markers: true,
            onEnter: enableEffect,
            onLeave: disableEffect,
            onEnterBack: enableEffect,
            onLeaveBack: disableEffect
        });

        const speed = 5;

        // Loop through each ticker group container on the page
        document.querySelectorAll('.home-project-scroll-txt-shell').forEach((shell) => {
            const txts = shell.querySelectorAll('.home-project-txt');
            if (txts.length > 0) {
                introTicker(txts, shell);
            }
        });

        // Simplified ticker function
        function introTicker(txtNodes, shell) {
            const baseSpeed = 1.2;
            const maxSpeed = 8;
            const velocityMult = 0.005;

            const heroLoop = horizontalLoop(txtNodes, {
                repeat: -1,
                speed: 0 // Start paused
            });

            let scrollTimeout;
            let isInView = false;

            // Create intersection observer
            const observer = new IntersectionObserver(
                (entries) => {
                    isInView = entries[0].isIntersecting;
                    if (!isInView) {
                        gsap.killTweensOf(heroLoop);
                        heroLoop.pause();
                    } else {
                        heroLoop.resume();
                        heroLoop.timeScale(baseSpeed);
                    }
                },
                { threshold: 0.1 }
            );

            // Observe the shell
            observer.observe(shell);

            ScrollTrigger.create({
                trigger: shell,
                start: "top bottom",
                end: "bottom top",
                onUpdate: ({ getVelocity }) => {
                    if (!isInView) return;
                    
                    gsap.killTweensOf(heroLoop);
                    
                    const scrollVelocity = getVelocity();
                    const direction = Math.sign(scrollVelocity);
                    const boostSpeed = direction * Math.min(Math.abs(scrollVelocity * velocityMult), maxSpeed);
                    
                    heroLoop.timeScale(baseSpeed * direction + boostSpeed);
                    
                    clearTimeout(scrollTimeout);
                    scrollTimeout = setTimeout(() => {
                        gsap.to(heroLoop, {
                            timeScale: baseSpeed * direction,
                            duration: 0.8,
                            ease: "power2.out"
                        });
                    }, 150);
                },
                onLeave: () => {
                    gsap.killTweensOf(heroLoop);
                    heroLoop.pause();
                },
                onEnter: () => {
                    heroLoop.resume();
                    heroLoop.timeScale(baseSpeed);
                },
                onLeaveBack: () => {
                    gsap.killTweensOf(heroLoop);
                    heroLoop.pause();
                },
                onEnterBack: () => {
                    heroLoop.resume();
                    heroLoop.timeScale(-baseSpeed);
                }
            });

            // Cleanup
            return () => observer.disconnect();
        }

        // Animate manifesto text words on scroll using GSAP SplitText
        const manifesto = document.querySelector('.manifesto-txt');
        if (manifesto) {
            // Only split once
            if (!manifesto.classList.contains('split')) {
                const split = new SplitText(manifesto, { type: 'words' });
                manifesto.classList.add('split');
                // Animate words
                gsap.set(split.words, { color: '#2f2f2fff', display: 'inline', whiteSpace: 'normal' });
                gsap.to(split.words, {
                    color: '#fff',
                    stagger: 0.05,
                    duration: 0.5,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: '.manifesto-shell',
                        start: 'top 80%',
                        end: 'bottom 20%',
                        scrub: true,
                    }
                });
            }
        }
    });
}