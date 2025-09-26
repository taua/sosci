import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { SplitText } from "gsap/SplitText";
import grainEffect from "./grainEffect";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

export function greet(page) {
  // Remove console.log
}

// Remove console.log Global JS loaded

window.addEventListener('DOMContentLoaded', () => {
  try {
    const grainCleanup = grainEffect({
      // Visual settings
      opacity: 1,         // Full strength to see pattern
      grainAlpha: 32,     // Lower alpha for finer grain
      grainScale: 3.4,    // Higher scale for more density
      fps: 8,            // Slightly slower for better performance
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
    // Skip video control on work page
    if (window.location.pathname.includes('work')) return;

    const videos = document.querySelectorAll('.bg-proj-video video');
    if (!videos.length) return;

    videos.forEach((video) => {
      video.muted = true;
      video.playsInline = true;
      video.loop = true;

      ScrollTrigger.create({
        trigger: video.parentElement,
        start: 'top bottom',
        end: 'bottom top',
        onEnter: () => video.play().catch(console.error),
        onLeave: () => video.pause(),
        onEnterBack: () => video.play().catch(console.error),
        onLeaveBack: () => video.pause()
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

  initVideoVisibility();

  // Add click listener for all sosci-links
  document.addEventListener('click', (e) => {
    const link = e.target.closest('.sosci-link');
    if (link) {
      const url = link.getAttribute('link-url');
      if (url) {
        navigateToUrl(url);
      }
    }
  });
});

// Add navigation state and functionality
let navOpen = false;
let navAnimating = false;

function openNav() {
  if (navAnimating) return;
  navAnimating = true;
  
  const navElement = document.querySelector('.global-nav-takeover');
  const mainShell = document.querySelector('.main-shell');
  
  if (!navElement) {
    navAnimating = false;
    return;
  }
  
  if (!navOpen) {
    // Opening the navigation
    const tl = gsap.timeline({
      onComplete: () => {
        navOpen = true;
        navAnimating = false;
      }
    });
    
    tl.to(navElement, {
      height: '100vh',
      duration: 1,
      ease: 'expo.inOut'
    });
    
    if (mainShell) {
      tl.to(mainShell, {
        transform: 'translate3d(0, 30%, 0)',
        duration: 1,
        ease: 'expo.inOut'
      }, 0); // Start at the same time
    }
  } else {
    // Closing the navigation
    const tl = gsap.timeline({
      onComplete: () => {
        navOpen = false;
        navAnimating = false;
      }
    });
    
    tl.to(navElement, {
      height: '0',
      duration: 1,
      ease: 'expo.inOut'
    });
    
    if (mainShell) {
      tl.to(mainShell, {
        transform: 'translate3d(0, 0, 0)',
        duration: 1,
        ease: 'expo.inOut'
      }, 0); // Start at the same time
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  // Setup nav click handler
  document.addEventListener('click', (e) => {
    const navTrigger = e.target.closest('.nav-hover');
    if (navTrigger) {
      openNav();
      e.preventDefault();
    }
  });
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

function navigateToUrl(url) {
    console.log('Navigating to:', url);
}