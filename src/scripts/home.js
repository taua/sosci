import { gsap } from "gsap";
import imgTrailEffect from "./imgTrailEffect";
import horizontalLoop from "./horizontalLoop";
import { Observer } from "gsap/Observer";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(Observer, ScrollTrigger);

// Track the last real mouse position globally
window._lastRealMousePos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
window.addEventListener('mousemove', function(e) {
    window._lastRealMousePos = { x: e.pageX, y: e.pageY };
});

// Entry point for home page JS
export function initHomePage() {
    // Wait for all resources (images, fonts, etc.) to load
    window.addEventListener('load', () => {
        // Initialize image trail effect and store cleanup function
        let imgTrailCleanup = imgTrailEffect();

        // Set up ScrollTrigger for the hero section to enable/disable imgTrailEffect
        ScrollTrigger.create({
            trigger: '.img-trail-hero-shell', // Change to your hero section selector
            start: 'top top',
            end: '50% top',
            onLeave: () => {
                // Kill or disable imgTrailEffect when leaving hero
                console.log('Disabling imgTrailEffect');
                if (typeof imgTrailCleanup === 'function') imgTrailCleanup();
            },
            onEnterBack: () => {
                console.log('Re-enabling imgTrailEffect');
                // Re-enable imgTrailEffect when re-entering hero
                imgTrailCleanup = imgTrailEffect();
            }
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
    });
}