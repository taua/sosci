import { gsap } from "gsap";

export function initHomePage() {
  console.log('Home page JS loaded!');
  // Example GSAP animation for the home page
  gsap.from(".home-animate", {
    y: 100,
    opacity: 0,
    duration: 1.2,
    ease: "power2.out"
  });
}