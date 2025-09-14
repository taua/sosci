import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { SplitText } from "gsap/SplitText";
gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

export function greet(page) {
  console.log(`Welcome to the ${page} page of Soul Science Studio!`);
}

console.log('Global JS loaded');

window.addEventListener('DOMContentLoaded', () => {
  const wrapper = document.querySelector('.main-shell');
  const content = document.querySelector('.content-shell');
  if (wrapper && content) {
    ScrollSmoother.create({
      wrapper: ".main-shell",
      content: ".content-shell",
      smooth: 1.2, // Adjust smoothness as needed
      effects: true
    });
  } else {
    console.warn('ScrollSmoother: .main-shell or .content-shell not found in DOM.');
  }
});

if (window.location.pathname === '/' || window.location.pathname.includes('home')) {
  import('./home.js').then(module => {
    module.initHomePage();
  });
} else if (window.location.pathname.includes('about')) {
  import('./about.js').then(module => {
    module.initAboutPage();
  });
} else if (window.location.pathname.includes('work')) {
  import('./work.js').then(module => {
    module.initWorkPage();
  });
} else {
  // Home or default page logic
  console.log('Home page logic here');
}