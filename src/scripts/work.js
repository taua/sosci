import { gsap } from "gsap";
import { createWorkLinksModule } from "./utils/workLinksModule";

// Create work-links module instance
let workLinksModule = null;

export function initWorkPage() {
    // Immediate scroll reset before anything else
    window.scrollTo(0, 0);
    
    // Ensure ScrollSmoother is not paused
    if (window._smootherInstance && typeof window._smootherInstance.paused === 'function') {
        try {
            window._smootherInstance.paused(false);
        } catch (e) {}
    }
    
    // Ensure body overflow is not stuck
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    
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
        // Ensure smoother is unpaused after scroll reset
        if (window._smootherInstance && typeof window._smootherInstance.paused === 'function') {
            try {
                window._smootherInstance.paused(false);
            } catch (e) {}
        }
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
    
    // Additional failsafe for scroll functionality
    setTimeout(() => {
        // Ensure body/html can scroll
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        // Ensure smoother is running
        if (window._smootherInstance && typeof window._smootherInstance.paused === 'function') {
            try {
                window._smootherInstance.paused(false);
            } catch (e) {}
        }
    }, 500);
    
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