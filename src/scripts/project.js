
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

let projectScrollTriggers = [];

function cleanupProjectPage() {
  projectScrollTriggers.forEach(t => t && t.kill && t.kill());
  projectScrollTriggers = [];
}

gsap.registerPlugin(ScrollTrigger, SplitText);


function initProjectPage() {
  console.log('[Project] initProjectPage called');
  const run = () => {
    cleanupProjectPage();
    const isProjectPage = window.location.pathname.includes('/projects');
    if (!isProjectPage) return;

    // Set initial states separately
    gsap.set('.scroll-cta-txt', { opacity: 1 });
    gsap.set('.scroll-cta-line', {
      opacity: 1,
      scaleY: 0,
      transformOrigin: 'top center'
    });

    // Delay creation to ensure DOM is ready and element exists
    let scrollCtaTimeline = null;
    setTimeout(() => {
      const ctaLine = document.querySelector('.scroll-cta-line');
      const ctaTxt = document.querySelector('.scroll-cta-txt');
      if (!ctaLine || !ctaTxt) {
        console.log('[Project] CTA elements not found; skipping CTA timeline');
        return;
      }
      scrollCtaTimeline = gsap.timeline({
        repeat: -1,
        defaults: { duration: 1, ease: "expo.inOut" }
      });
      console.log('[Project] CTA timeline created');
      scrollCtaTimeline
        .to(ctaLine, {
          scaleY: 1,
          duration: 1,
          ease: "expo.inOut"
        })
        .set(ctaLine, {
          transformOrigin: 'bottom center',
          immediateRender: false
        })
        .to(ctaLine, {
          scaleY: 0,
          duration: 1,
          ease: "expo.inOut"
        });

      // Control visibility based on scroll position
      projectScrollTriggers.push(
        ScrollTrigger.create({
          start: 1, // Trigger as soon as scrolling starts
          end: 'max',
          onUpdate: (self) => {
            if (self.progress === 0) {
              if (scrollCtaTimeline) scrollCtaTimeline.play();
              gsap.to(['.scroll-cta-line', '.scroll-cta-txt'], {
                opacity: 1,
                duration: 0.3,
                stagger: 0.1
              });
            } else {
              if (scrollCtaTimeline) scrollCtaTimeline.pause();
              gsap.to(['.scroll-cta-line', '.scroll-cta-txt'], {
                opacity: 0,
                duration: 0.2,
                stagger: 0.1
              });
            }
          }
        })
      );
    }, 50);

    // Control visibility based on scroll position (moved inside setTimeout)

    // Add indicator items animation only if element exists
    const indicatorShells = document.querySelectorAll('.indicator-item-shell');
    const projectsSectionShell = document.querySelector('.projects-section-shell');
    if (indicatorShells.length && projectsSectionShell) {
      gsap.set(indicatorShells, { x: -150 });
      projectScrollTriggers.push(
        ScrollTrigger.create({
          trigger: projectsSectionShell,
          start: 'top 35%',
          onEnter: () => {
            gsap.killTweensOf(indicatorShells);
            gsap.to(indicatorShells, {
              x: 0,
              duration: 1,
              stagger: 0.15,
              ease: "expo.out"
            });
          },
          onLeaveBack: () => {
            gsap.killTweensOf(indicatorShells);
            gsap.to(indicatorShells, {
              x: -150,
              duration: 0.6,
              stagger: 0.1,
              ease: "expo.in"
            });
          }
        })
      );
    }

    // Ensure ScrollTrigger recalculates after DOM is ready
    setTimeout(() => {
      ScrollTrigger.refresh(true);
    }, 50);
    // Attach to window for global access
    // No need to attach to window; use ES module exports
  }




  // If DOM is already loaded (Barba transition), run immediately; otherwise, wait for DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
}

export { initProjectPage, cleanupProjectPage };

