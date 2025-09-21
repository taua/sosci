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
      // Visual settings
      opacity: 1,         // Full strength to see pattern
      grainAlpha: 32,     // Lower alpha for finer grain
      grainScale: 3.4,    // Higher scale for more density
      fps: 10,            // Slightly slower for better performance
      blendMode: 'hard-light', // Sharp contrast like the image
      greyness: 90        // Mid-grey like the reference
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

  // Initialize video visibility control
  function initVideoVisibility() {
    const videos = document.querySelectorAll('.bg-proj-video video');
    if (!videos.length) return;

    console.log('Initializing video visibility control for', videos.length, 'videos');

    videos.forEach((video, index) => {
      // Configure video
      video.muted = true;
      video.playsInline = true;
      video.loop = true;

      // Create ScrollTrigger for each video
      ScrollTrigger.create({
        trigger: video.parentElement,
        start: 'top bottom',
        end: 'bottom top',
        onEnter: () => {
          console.log(`Video ${index} entered view`);
          video.play().catch(console.error);
        },
        onLeave: () => {
          console.log(`Video ${index} left view`);
          video.pause();
        },
        onEnterBack: () => {
          console.log(`Video ${index} entered view (scrolling up)`);
          video.play().catch(console.error);
        },
        onLeaveBack: () => {
          console.log(`Video ${index} left view (scrolling up)`);
          video.pause();
        }
      });
    });
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

  // Initialize video control after ScrollTrigger setup
  initVideoVisibility();
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