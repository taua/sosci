import { gsap } from "gsap";
import { createWorkLinksModule } from "./utils/workLinksModule";

// Create work-links module instance
let workLinksModule = null;

export function initWorkPage() {
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