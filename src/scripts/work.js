import { gsap } from "gsap";
import { createWorkLinksModule } from "./utils/workLinksModule";
import { initScrollReset } from "./utils/scrollReset";

// Create work-links module instance
let workLinksModule = null;

export function initWorkPage() {
    // Use the same scroll reset as home page - handles browser scroll restoration
    initScrollReset();
    
    // Immediate scroll reset before anything else
    window.scrollTo(0, 0);
    
    // Robust scroll reset with smooth scrolling temporarily disabled
    let originalSmooth = null;
    let smoothDisabled = false;
    
    const tryReset = () => {
        try {
            if (typeof window !== 'undefined' && window._smootherInstance && typeof window._smootherInstance.scrollTo === 'function') {
                // Only disable smooth once on first call
                if (!smoothDisabled && typeof window._smootherInstance.smooth === 'function') {
                    originalSmooth = window._smootherInstance.smooth();
                    if (originalSmooth) {
                        window._smootherInstance.smooth(0);
                        smoothDisabled = true;
                    }
                }
                window._smootherInstance.scrollTo(0, false);
                return true;
            }
        } catch (e) {}
        try {
            window.scrollTo(0, 0);
            return true;
        } catch (e) {
            return false;
        }
    };
    
    // Multiple reset attempts to handle timing issues
    tryReset();
    requestAnimationFrame(() => {
        window.scrollTo(0, 0);
        requestAnimationFrame(() => {
            window.scrollTo(0, 0);
            tryReset();
        });
    });
    setTimeout(() => {
        window.scrollTo(0, 0);
        tryReset();
    }, 120);
    
    // Restore smooth scrolling after all reset attempts complete
    if (smoothDisabled && originalSmooth) {
        setTimeout(() => {
            try {
                if (window._smootherInstance && typeof window._smootherInstance.smooth === 'function') {
                    window._smootherInstance.smooth(originalSmooth);
                }
            } catch (e) {}
        }, 400);
    }
    
    // Initialize the shared work-links module
    workLinksModule = createWorkLinksModule();
    workLinksModule.init();
}

export function cleanupWorkPage() {
    if (workLinksModule) {
        workLinksModule.cleanup();
        workLinksModule = null;
    }
}

window.initPageTransitions = function() {
  // Your page-specific GSAP intro animation here
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