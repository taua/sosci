
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { createWorkLinksModule } from "./utils/workLinksModule";

let projectScrollTriggers = [];
let scrollCtaTimeline = null;
let workLinksModule = null;

function cleanupProjectPage() {
  // Kill any ScrollTrigger instances for this page
  projectScrollTriggers.forEach(t => t && t.kill && t.kill());
  projectScrollTriggers = [];

  // Kill CTA timeline if it exists to avoid duplicate timelines after navigation
  if (scrollCtaTimeline) {
    try { scrollCtaTimeline.kill && scrollCtaTimeline.kill(); } catch (e) {}
    try { scrollCtaTimeline.pause && scrollCtaTimeline.pause(); } catch (e) {}
    scrollCtaTimeline = null;
  }

  // Cleanup work-links module
  if (workLinksModule) {
    workLinksModule.cleanup();
    workLinksModule = null;
  }
}

gsap.registerPlugin(ScrollTrigger, SplitText);


function initProjectPage() {
  // initProjectPage called
  const run = () => {
    cleanupProjectPage();
    // Ensure page is at top on initial run (fix preserved scroll on refresh)
    try {
      const tryReset = () => {
        try {
          if (typeof window !== 'undefined' && window._smootherInstance && typeof window._smootherInstance.scrollTo === 'function') {
            window._smootherInstance.scrollTo(0, false);
            return true;
          }
        } catch (e) {}
        try {
          window.scrollTo(0, 0);
          return true;
        } catch (e) { return false; }
      };

      // immediate attempt
      tryReset();
      // after paint (double rAF)
      requestAnimationFrame(() => requestAnimationFrame(() => tryReset()));
      // short timeout in case smoother initializes slightly later
      setTimeout(() => {
        tryReset();
        // After scroll reset, aggressively hide indicators
        const indicatorShells = document.querySelectorAll('.indicator-item-shell');
        if (indicatorShells.length) {
          try {
            gsap.killTweensOf(indicatorShells);
            gsap.set(indicatorShells, { x: -150, autoAlpha: 0 });
          } catch (e) {}
        }
      }, 120);
      // final attempt on full load (once)
      const onLoad = () => { 
        tryReset();
        // After scroll reset on load, aggressively hide indicators
        const indicatorShells = document.querySelectorAll('.indicator-item-shell');
        if (indicatorShells.length) {
          try {
            gsap.killTweensOf(indicatorShells);
            gsap.set(indicatorShells, { x: -150, autoAlpha: 0 });
          } catch (e) {}
        }
        window.removeEventListener('load', onLoad); 
      };
      try { window.addEventListener('load', onLoad); } catch (e) {}
    } catch (e) {}
    const isProjectPage = window.location.pathname.includes('/projects');
    if (!isProjectPage) return;

    // Set initial states separately (only if elements exist to avoid GSAP warnings)
    const preCtaLine = document.querySelector('.scroll-cta-line');
    const preCtaTxt = document.querySelector('.scroll-cta-txt');
    if (preCtaTxt) {
      gsap.set(preCtaTxt, { opacity: 1 });
    }
    if (preCtaLine) {
      gsap.set(preCtaLine, {
        opacity: 1,
        scaleY: 0,
        transformOrigin: 'top center'
      });
    }

    // Delay creation to ensure DOM is ready and element exists
    setTimeout(() => {
      const ctaLine = document.querySelector('.scroll-cta-line');
      const ctaTxt = document.querySelector('.scroll-cta-txt');
      if (!ctaLine || !ctaTxt) {
  // CTA elements not found; skipping CTA timeline
        return;
      }
      // create/replace module-scoped CTA timeline
      scrollCtaTimeline = gsap.timeline({
        repeat: -1,
        defaults: { duration: 1, ease: "expo.inOut" }
      });
      
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

      // Control visibility using enter/back handlers similar to the Home page CTA logic.
      // Choose a sensible trigger element: prefer projects section, fall back to content shell or body.
      const triggerEl = document.querySelector('.projects-section-shell') || document.querySelector('.content-shell') || document.body;
      const ctaTrigger = ScrollTrigger.create({
        trigger: triggerEl,
        start: 'top bottom',
        // When the trigger enters the viewport (i.e., page scrolled down), hide/pause CTA
        onEnter: () => {
          // Avoid pausing on transient refreshes when user is effectively at top
          const sc = (window.scrollY || window.pageYOffset || 0);
          // CTA onEnter - scrolly
          if (sc <= 20) {
            // CTA onEnter - near top, skip pause
            return;
          }
          if (scrollCtaTimeline) {
            // CTA - pause() called
            scrollCtaTimeline.pause();
          }
          const hideTargets = Array.from(document.querySelectorAll('.scroll-cta-line, .scroll-cta-txt'));
          if (hideTargets.length) {
            gsap.to(hideTargets, { opacity: 0, duration: 0.3, stagger: 0.1 });
          }
        },
        // When leaving back to the top (entering back), show/play CTA
        onLeaveBack: () => {
          // CTA onLeaveBack - playing CTA
          if (scrollCtaTimeline) {
            // CTA - play() called
            scrollCtaTimeline.play();
          }
          const showTargets = Array.from(document.querySelectorAll('.scroll-cta-line, .scroll-cta-txt'));
          if (showTargets.length) {
            gsap.to(showTargets, { opacity: 1, duration: 0.3, stagger: 0.1 });
          }
        },
        // Re-evaluate CTA state on ScrollTrigger refresh (important when ScrollSmoother re-inits)
        onRefresh: (self) => {
          try {
            const rect = triggerEl.getBoundingClientRect();
            const entered = rect.top <= window.innerHeight;
            // CTA onRefresh rect.top
            const refreshTargets = Array.from(document.querySelectorAll('.scroll-cta-line, .scroll-cta-txt'));
            if (entered) {
              if (scrollCtaTimeline) scrollCtaTimeline.pause();
              if (refreshTargets.length) gsap.set(refreshTargets, { opacity: 0 });
            } else {
              if (scrollCtaTimeline) scrollCtaTimeline.play();
              if (refreshTargets.length) gsap.set(refreshTargets, { opacity: 1 });
            }
          } catch (e) { console.warn('[Project] CTA onRefresh error', e); }
        }
      });
  projectScrollTriggers.push(ctaTrigger);

  // Schedule a delayed refresh so ScrollTrigger recalculates once ScrollSmoother/Barba settle.
  // This helps the CTA initial visibility on first landing.
  setTimeout(() => { try { ScrollTrigger.refresh(true); } catch (e) { /* ignore */ } }, 120);

  // Ensure initial CTA state matches current element position AFTER layout settles.
  // Using getBoundingClientRect gives a reliable viewport-relative position even when
  // ScrollSmoother applies transforms. Run inside rAF to ensure layout is ready.
  requestAnimationFrame(() => {
        try {
          const rect = triggerEl.getBoundingClientRect();
          const entered = rect.top <= window.innerHeight; // matches `start: 'top bottom'`
          if (entered) {
            if (scrollCtaTimeline) { scrollCtaTimeline.pause(); }
            gsap.set(['.scroll-cta-line', '.scroll-cta-txt'], { opacity: 0 });
          } else {
            if (scrollCtaTimeline) { scrollCtaTimeline.play(); }
            gsap.set(['.scroll-cta-line', '.scroll-cta-txt'], { opacity: 1 });
          }
        } catch (e) {
          /* ignore */
        }
      });
    }, 50);

    // Control visibility based on scroll position (moved inside setTimeout)

    // Add indicator items animation only if element exists
    const indicatorShells = document.querySelectorAll('.indicator-item-shell');
    const projectsSectionShell = document.querySelector('.projects-section-shell');
    const linksIntroShell = document.querySelector('.links-intro-shell');
    
    if (indicatorShells.length && projectsSectionShell) {
      // Force them hidden with inline style AND GSAP, with transform
      indicatorShells.forEach(shell => {
        shell.style.visibility = 'hidden';
        shell.style.opacity = '0';
        shell.style.transform = 'translate3d(-300px, 0, 0)';
      });
      gsap.set(indicatorShells, { x: -300, autoAlpha: 0 });

      let projectsSectionTrigger = null;
      let linksIntroTrigger = null;
      let triggersEnabled = false;

      // Wait for actual user interaction before enabling triggers
      const enableTriggers = () => {
        if (triggersEnabled) return;
        triggersEnabled = true;
        
        // Remove inline styles so GSAP can control, but keep them hidden
        indicatorShells.forEach(shell => {
          shell.style.visibility = '';
          shell.style.opacity = '';
          shell.style.transform = '';
        });
        
        // Ensure they stay hidden with GSAP until ScrollTrigger shows them
        gsap.set(indicatorShells, { x: -300, autoAlpha: 0 });
        
        window.removeEventListener('wheel', enableTriggers);
        window.removeEventListener('touchmove', enableTriggers);
      };
      
      // Listen for wheel/touch - these are actual user scroll interactions
      window.addEventListener('wheel', enableTriggers, { passive: true, once: true });
      window.addEventListener('touchmove', enableTriggers, { passive: true, once: true });

      // Use guarded gsap.to calls and kill overlapping tweens to avoid snapping/popping
      projectsSectionTrigger = ScrollTrigger.create({
        trigger: projectsSectionShell,
        start: 'top 35%',
        onEnter: () => {
          if (!triggersEnabled) return;
          // Also check if links intro has been passed
          if (linksIntroTrigger && linksIntroTrigger.isActive) return;
          
          gsap.killTweensOf(indicatorShells);
          gsap.to(indicatorShells, {
            x: 0,
            autoAlpha: 1,
            duration: 1,
            stagger: 0.15,
            ease: "expo.out",
            overwrite: 'auto'
          });
        },
        onLeaveBack: () => {
          if (!triggersEnabled) return;
          gsap.killTweensOf(indicatorShells);
          gsap.to(indicatorShells, {
            x: -300,
            autoAlpha: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "expo.in",
            overwrite: 'auto'
          });
        }
      });
      projectScrollTriggers.push(projectsSectionTrigger);

      // Add trigger to hide indicators when links-intro-shell enters viewport
      if (linksIntroShell) {
        linksIntroTrigger = ScrollTrigger.create({
          trigger: linksIntroShell,
          start: 'top bottom+=500',
          onEnter: () => {
            if (!triggersEnabled) return;
            gsap.killTweensOf(indicatorShells);
            gsap.to(indicatorShells, {
              x: -300,
              autoAlpha: 0,
              duration: 0.5,
              stagger: 0.1,
              ease: "expo.in",
              overwrite: 'auto'
            });
          },
          onLeaveBack: () => {
            if (!triggersEnabled) return;
            gsap.killTweensOf(indicatorShells);
            gsap.to(indicatorShells, {
              x: 0,
              autoAlpha: 1,
              duration: 1,
              stagger: 0.15,
              ease: "expo.out",
              overwrite: 'auto'
            });
          }
        });
        projectScrollTriggers.push(linksIntroTrigger);
      }
    }

    // Ensure ScrollTrigger recalculates after DOM is ready
    setTimeout(() => {
      ScrollTrigger.refresh(true);
    }, 50);

    // Initialize work-links functionality
    workLinksModule = createWorkLinksModule();
    workLinksModule.init();
  }




  // If DOM is already loaded (Barba transition), run immediately; otherwise, wait for DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
}

export { initProjectPage, cleanupProjectPage };

