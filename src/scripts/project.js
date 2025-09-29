import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

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

window.initPageTransitions = function() {
  // Animate "project-info-header" one character at a time sliding in from the bottom using GSAP SplitText
  const header = document.querySelector('.project-info-header');
  if (header) {
    const split = new SplitText(header, { type: "chars" });
    gsap.fromTo(split.chars,
      {transform: 'translate3d(0, 100%, 0)' },
      {
        transform: 'translate3d(0, 0%, 0)',
        duration: 1.2,
        ease: "expo.out",
        delay: 0.4,
        stagger: 0.02
      }
    );
  }

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

  console.log('Project Page transition animation triggered');
};


