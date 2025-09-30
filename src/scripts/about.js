import { gsap } from "gsap";

export function initAboutPage() {
  console.log('About page JS loaded!');
  // Add about page specific GSAP code here
}

window.initPageTransitions = function() {
  // Your page-specific GSAP intro animation here
  console.log('Project Page transition animation triggered');
};

export function cleanupAboutPage() {
  // No-op cleanup for about page; placeholder for symmetry with other pages
}