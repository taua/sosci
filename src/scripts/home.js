import { gsap } from "gsap";
import imgTrailEffect from "./imgTrailEffect";
import horizontalLoop from "./horizontalLoop";
import { Observer } from "gsap/Observer";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { initScrollReset } from './utils/scrollReset';


gsap.registerPlugin(Observer, ScrollTrigger, SplitText);

let homeScrollTriggers = [];

// Track the last real mouse position globally
window._lastRealMousePos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
window.addEventListener('mousemove', function(e) {
    window._lastRealMousePos = { x: e.pageX, y: e.pageY };
});

// Entry point for home page JS
export function initHomePage() {
    initScrollReset();
    window.scrollTo(0, 0);
    ScrollTrigger.refresh();

    // Set initial state of hero image
    gsap.set('.hero-img', { 
        opacity: 0, 
        scale: 1.3,
        filter: 'blur(20px)',
        transformOrigin: 'center center'
    });

    // Add scroll CTA line animation (only if element exists)
    const ctaLineEl = document.querySelector('.scroll-cta-line');
    const ctaShellEl = document.querySelector('.scroll-cta-shell');
    let scrollCtaTimeline = null;
    if (ctaLineEl) {
        gsap.set(ctaLineEl, {
            scaleY: 0,
            transformOrigin: 'top center'
        });

        scrollCtaTimeline = gsap.timeline({
            repeat: -1,
            defaults: {
                duration: 1,
                ease: "expo.inOut"
            }
        });

        scrollCtaTimeline
            .to(ctaLineEl, {
                scaleY: 1,
                transformOrigin: 'top center'
            })
            .set(ctaLineEl, {
                transformOrigin: 'bottom center'
            })
            .to(ctaLineEl, {
                scaleY: 0
            });
    } else {
        // .scroll-cta-line not found; skipping CTA animation
    }

    // Control scroll CTA visibility based on hero section (fade the whole .scroll-cta-shell when available)
    const heroTickerExists = !!document.querySelector('.hero-ticker-shell');
    const fadeTarget = ctaShellEl || ctaLineEl; // prefer shell, fallback to line
    if (fadeTarget && heroTickerExists) {
        ScrollTrigger.create({
            trigger: '.hero-ticker-shell',
            start: 'top bottom', // Triggers as soon as the section enters viewport
            onEnter: () => {
                if (scrollCtaTimeline) scrollCtaTimeline.pause();
                gsap.to(fadeTarget, {
                    opacity: 0,
                    duration: 0.3
                });
            },
            onLeaveBack: () => {
                if (scrollCtaTimeline) scrollCtaTimeline.play();
                gsap.to(fadeTarget, {
                    opacity: 1,
                    duration: 0.3
                });
            }
        });
    }


    // Create opacity and scale animations only if both elements exist
    const heroImg = document.querySelector('.hero-img');
    const heroTickerShell = document.querySelector('.hero-ticker-shell');
    if (heroImg && heroTickerShell) {
        const opacityTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: heroTickerShell,
                start: 'top bottom',
                end: 'bottom -50%',
                scrub: 1,
                onUpdate: (self) => {
                    const progress = self.progress;
                    if (progress <= 0.25) {
                        gsap.to(heroImg, { 
                            opacity: progress * 4, 
                            filter: `blur(${20 - (progress * 80)}px)`,
                            duration: 0.1 
                        });
                    } else if (progress >= 0.35) {
                        gsap.to(heroImg, { opacity: 1 - ((progress - 0.35) * 4), duration: 0.1 });
                    }
                }
            }
        });
        homeScrollTriggers.push(opacityTimeline.scrollTrigger);

        const scaleTween = gsap.to(heroImg, {
            scale: 1,
            scrollTrigger: {
                trigger: heroTickerShell,
                start: 'top bottom',
                end: 'center center',
                scrub: true
            }
        });
        homeScrollTriggers.push(scaleTween.scrollTrigger);
    }

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

        // Store effect cleanup on window so cleanupHomePage can access them if needed
        window._homeImgTrailCleanup = () => {
            try { disableEffect(); } catch (e) { /* ignore */ }
        };

    // Loop through each ticker group container on the page with alternating directions
    document.querySelectorAll('.home-project-scroll-txt-shell').forEach((shell, index) => {
        const txts = shell.querySelectorAll('.home-project-txt');
        if (txts.length > 0) {
            // Alternate direction based on index (even = normal, odd = reversed)
            const initialDirection = index % 2 === 0 ? 1 : -1;
            introTicker(txts, shell, initialDirection);
        }
    });

    // Updated ticker function with proper direction handling
    function introTicker(txtNodes, shell, initialDirection = 1) {
        const baseSpeed = 1.2;
        const maxSpeed = 8;
        const velocityMult = 0.005;

        // Create horizontal loop with proper reversed setting
        const heroLoop = horizontalLoop(txtNodes, {
            repeat: -1,
            speed: baseSpeed,
            reversed: initialDirection < 0 // This is crucial - set reversed based on initial direction
        });

        // Always use positive timeScale regardless of direction
        const absBaseSpeed = Math.abs(baseSpeed);
        heroLoop.timeScale(absBaseSpeed);

        let scrollTimeout;
        let currentDirection = initialDirection;
        
        const pauseLoop = () => {
            gsap.killTweensOf(heroLoop);
            heroLoop.pause();
        };
        
        const resumeLoop = () => {
            heroLoop.resume();
            heroLoop.timeScale(absBaseSpeed);
        };

        ScrollTrigger.create({
            trigger: shell,
            start: "top+=20% bottom",
            end: "bottom-=20% top",
            onUpdate: ({ isActive, getVelocity }) => {
                if (!isActive) {
                    pauseLoop();
                    return;
                }
                
                gsap.killTweensOf(heroLoop);
                
                const scrollVelocity = getVelocity();
                // Only consider significant movement
                if (Math.abs(scrollVelocity) > 0.5) {
                    const scrollDirection = Math.sign(scrollVelocity);
                    // Flip the scroll direction if this is a reversed ticker
                    const effectiveDirection = initialDirection < 0 ? -scrollDirection : scrollDirection;
                    currentDirection = effectiveDirection;
                    
                    const boostAmount = Math.min(Math.abs(scrollVelocity * velocityMult), maxSpeed);
                    const effectiveSpeed = absBaseSpeed + (Math.abs(effectiveDirection) * boostAmount);
                    
                    heroLoop.timeScale(effectiveSpeed * Math.sign(effectiveDirection));
                }
                
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    // When scrolling stops, normalize speed but keep direction
                    gsap.to(heroLoop, {
                        timeScale: absBaseSpeed * Math.sign(currentDirection),
                        duration: 0.5,
                        ease: "power1.out",
                        overwrite: true
                    });
                }, 150);
            },
            onLeave: pauseLoop,
            onEnter: resumeLoop,
            onLeaveBack: pauseLoop,
            onEnterBack: resumeLoop
        });

        return () => {
            clearTimeout(scrollTimeout);
            gsap.killTweensOf(heroLoop);
            heroLoop.kill();
        };
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

    // Add hover animations for featured projects
    document.querySelectorAll('.home-featured-proj-img').forEach(container => {
        const shell = container.querySelector('.home-featured-pj-shell');
        const children = shell.children;
        let isAnimating = false;
        
        container.addEventListener('mouseenter', () => {
            gsap.killTweensOf([shell, children]);
            
            gsap.to(shell, {
                width: '93%',
                height: '93%',
                duration: 0.6,
                ease: 'power4.out'
            });
            
            gsap.to(children, {
                scale: 1.2,
                duration: 0.6,
                ease: 'power4.out'
            });
        });

        container.addEventListener('mouseleave', () => {
            gsap.killTweensOf([shell, children]);
            
            gsap.to(shell, {
                width: '100%',
                height: '100%',
                duration: 0.6,
                ease: 'power4.out'
            });
            
            gsap.to(children, {
                scale: 1,
                duration: 0.4,
                ease: 'power4.out'
            });
        });
    });
}

export function cleanupHomePage() {
    // Kill home-specific ScrollTriggers
    if (Array.isArray(homeScrollTriggers)) {
        homeScrollTriggers.forEach(st => {
            try { if (st && typeof st.kill === 'function') st.kill(); } catch (e) { /* ignore */ }
        });
        homeScrollTriggers = [];
    }

    // Clear any img-trail effect
    try {
        if (typeof window._homeImgTrailCleanup === 'function') {
            window._homeImgTrailCleanup();
            window._homeImgTrailCleanup = null;
        }
    } catch (e) { /* ignore */ }

    // Kill any ScrollTrigger animations attached to elements used here (best-effort)
    try { ScrollTrigger.refresh(); } catch (e) { /* ignore */ }
}

window.initPageTransitions = function() {
  // Your page-specific GSAP intro animation here
    // Home Page transition animation triggered
  // Animate main-shell translateY from 30% to 0% using translate3d
  const mainShell = document.querySelector('.main-shell');
  if (mainShell) {
    gsap.fromTo(
      mainShell,
      { transform: "translate3d(0, 30%, 0)" },
      {
        transform: "translate3d(0, 0, 0)",
        duration: 1,
        ease: "expo.inOut"
      }
    );
  }
};
