import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initProjectPage() {
    const isProjectPage = window.location.pathname.includes('/projects');
    if (!isProjectPage) return;

    // Initialize scroll CTA animation
    window.addEventListener('load', () => {
        // Set initial states separately
        gsap.set('.scroll-cta-txt', { opacity: 1 });
        gsap.set('.scroll-cta-line', {
            opacity: 1,
            scaleY: 0,
            transformOrigin: 'top center'
        });

        // Create looping animation
        const scrollCtaTimeline = gsap.timeline({
            repeat: -1,
            defaults: { duration: 1, ease: "expo.inOut" }
        });

        scrollCtaTimeline
            .to('.scroll-cta-line', {
                scaleY: 1,
                duration: 1,
                ease: "expo.inOut"
            })
            .set('.scroll-cta-line', {
                transformOrigin: 'bottom center',
                immediateRender: false
            })
            .to('.scroll-cta-line', {
                scaleY: 0,
                duration: 1,
                ease: "expo.inOut"
            });

        // Control visibility based on scroll position
        ScrollTrigger.create({
            start: 1, // Trigger as soon as scrolling starts
            end: 'max',
            onUpdate: (self) => {
                if (self.progress === 0) {
                    // At the top - show and play animation
                    scrollCtaTimeline.play();
                    gsap.to(['.scroll-cta-line', '.scroll-cta-txt'], {
                        opacity: 1,
                        duration: 0.3,
                        stagger: 0.1
                    });
                } else {
                    // Any scroll - hide and pause animation
                    scrollCtaTimeline.pause();
                    gsap.to(['.scroll-cta-line', '.scroll-cta-txt'], {
                        opacity: 0,
                        duration: 0.2,
                        stagger: 0.1
                    });
                }
            }
        });

        // Add indicator items animation
        gsap.set('.indicator-item-shell', {
            x: -150
        });

        ScrollTrigger.create({
            trigger: '.projects-section-shell',
            start: 'top 35%',
            onEnter: () => {
                gsap.killTweensOf('.indicator-item-shell');
                gsap.to('.indicator-item-shell', {
                    x: 0,
                    duration: 1,
                    stagger: 0.15,
                    ease: "expo.out"
                });
            },
            onLeaveBack: () => {
                gsap.killTweensOf('.indicator-item-shell');
                gsap.to('.indicator-item-shell', {
                    x: -150,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: "expo.in"
                });
            }
        });
    });
}




