import { gsap } from "gsap";

export function initSciencePage() {
  console.log('Science page JS loaded!');
  // Add science page specific GSAP code here
}

window.initPageTransitions = function() {
  // Your page-specific GSAP intro animation here
  console.log('Science Page transition animation triggered');
};

export function cleanupSciencePage() {
  // No-op cleanup for science page; placeholder for symmetry with other pages
}