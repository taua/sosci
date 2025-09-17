import { gsap } from "gsap";
import imgTrailEffect from "./imgTrailEffect";
import horizontalLoop from "./horizontalLoop";
import grainEffect from "./grainEffect";
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
    // Initialize grain effect with custom settings
    const grainCleanup = grainEffect({
        opacity: 1,         // Full strength to see pattern
        grainAlpha: 32,     // Lower alpha for finer grain
        grainScale: 3.4,      // Higher scale for more density
        fps: 13,            // Slightly slower for better performance
        blendMode: 'hard-light',  // Sharp contrast like the image
        greyness: 90       // Mid-grey like the reference
    });

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

        // Sets up a horizontal ticker effect and Observer for a group of text nodes
        function introTicker(txtNodes, shell) {
            // Create the horizontal loop animation for the text nodes
            const heroLoop = horizontalLoop(txtNodes, {
                repeat: -1,
                speed: 1,
            });

            let tl;
            let observerInstance = null;

            // Use ScrollTrigger to activate Observer only when the section is in view
            ScrollTrigger.create({
                trigger: shell,
                start: "0% 100%", // When top of shell hits bottom of viewport
                end: "100% 0%",    // When 100% of shell hits top of viewport
                //markers: true,     // Show GSAP markers for debugging
                onEnter: () => {
                    // Create Observer to listen for wheel events on this shell
                    //console.log('Observer ACTIVE for', shell);
                    observerInstance = Observer.create({
                        target: shell,
                        type: 'wheel',
                        onChangeY: (self) => {
                            tl && tl.kill();
                            const factor = self.deltaY > 0 ? 1 : -1;
                            tl = gsap
                                .timeline()
                                .to(heroLoop, { timeScale: speed * factor, duration: 0.25 })
                                .to(heroLoop, { timeScale: 1 * factor, duration: 1 });
                        },
                    });
                },
                onLeave: () => {
                    // Kill Observer when section leaves viewport
                    if (observerInstance) {
                        observerInstance.kill();
                        //console.log('Observer KILLED for', shell);
                    }
                },
                onEnterBack: () => {
                    // Re-create Observer when scrolling back into view
                    //console.log('Observer ACTIVE (back) for', shell);
                    observerInstance = Observer.create({
                        target: shell,
                        type: 'wheel',
                        onChangeY: (self) => {
                            tl && tl.kill();
                            const factor = self.deltaY > 0 ? 1 : -1;
                            tl = gsap
                                .timeline()
                                .to(heroLoop, { timeScale: speed * factor, duration: 0.25 })
                                .to(heroLoop, { timeScale: 1 * factor, duration: 1 });
                        },
                    });
                },
                onLeaveBack: () => {
                    // Kill Observer when section leaves viewport (scrolling up)
                    if (observerInstance) {
                        observerInstance.kill();
                        //console.log('Observer KILLED (back) for', shell);
                    }
                }
            });
        }

        // Animate manifesto text words on scroll using GSAP SplitText
        const manifesto = document.querySelector('.manifesto-txt');
        if (manifesto) {
            // Only split once
            if (!manifesto.classList.contains('split')) {
                const split = new SplitText(manifesto, { type: 'words' });
                manifesto.classList.add('split');
                // Animate words
                gsap.set(split.words, { color: '#222', display: 'inline', whiteSpace: 'normal' });
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