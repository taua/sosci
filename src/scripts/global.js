import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { SplitText } from "gsap/SplitText";
import grainEffect from "./grainEffect";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

export function greet(page) {
  console.log(`Welcome to the ${page} page of Soul Science Studio!`);
}

console.log('Global JS loaded');

window.addEventListener('DOMContentLoaded', () => {
  try {
    console.log('Initializing grain effect...');
    const grainCleanup = grainEffect({
      // Performance settings
      fps: 15,           // Decrease if CPU usage is high
      grainScale: 1.5,   // Increase if grain is too fine (max 3.0)
      useRAF: true,      // Keep true for modern browsers
      
      // Visual settings
      opacity: 0.8,      // Range 0.6-0.9 is ideal
      grainAlpha: 24,    // Range 20-30 works best
      blendMode: 'overlay', // Try 'soft-light' for subtler effect
      greyness: 85,      // Adjust 80-90 for different contrasts
      colored: false
    });

    // Cleanup on page unload
    window.addEventListener('unload', () => {
      if (typeof grainCleanup === 'function') {
        grainCleanup();
      }
    });
  } catch (error) {
    console.error('Failed to initialize grain effect:', error);
  }

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

// Page-specific imports
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
} else if (window.location.pathname.includes('projects')) {
  import('./project.js').then(module => {
    module.initProjectPage();
  });
} else {
  // Home or default page logic
  console.log('Home page logic here');
}