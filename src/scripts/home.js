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
    // Wait for all resources (images, fonts, etc.) to load
    window.addEventListener('load', () => {
        // Only run imgTrailEffect when hero is in view
        let imgTrailCleanup = null;
        let imgTrailActive = false;
        let manualCheckDone = false;
        ScrollTrigger.create({
            trigger: '.img-trail-hero-shell',
            start: 'top bottom',
            end: 'bottom 50%',
            onEnter: () => {
                if (!imgTrailActive) {
                    imgTrailCleanup = imgTrailEffect();
                    imgTrailActive = true;
                }
            },
            onLeave: () => {
                if (imgTrailActive) {
                    if (typeof imgTrailCleanup === 'function') imgTrailCleanup();
                    imgTrailCleanup = null;
                    imgTrailActive = false;
                }
            },
            onEnterBack: () => {
                if (!imgTrailActive) {
                    imgTrailCleanup = imgTrailEffect();
                    imgTrailActive = true;
                }
            },
            onLeaveBack: () => {
                if (imgTrailActive) {
                    if (typeof imgTrailCleanup === 'function') imgTrailCleanup();
                    imgTrailCleanup = null;
                    imgTrailActive = false;
                }
            }
        });
        // Ensure ScrollTrigger is refreshed and check hero in view after layout is stable (only once)
        ScrollTrigger.refresh();
        if (!manualCheckDone) {
            requestAnimationFrame(() => {
                const heroShell = document.querySelector('.img-trail-hero-shell');
                if (heroShell) {
                    const rect = heroShell.getBoundingClientRect();
                    if (rect.top <= window.innerHeight && rect.bottom >= 0) {
                        if (!imgTrailActive) {
                            imgTrailCleanup = imgTrailEffect();
                            imgTrailActive = true;
                        }
                    }
                }
                manualCheckDone = true;
            });
        }

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