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

// Store split text instances for cleanup
let splitTextInstances = [];

function openNav() {
  if (navAnimating) return;
  navAnimating = true;
  
  const navElement = document.querySelector('.global-nav-takeover');
  const mainShell = document.querySelector('.main-shell');
  const logoNav = document.querySelector('.logo-nav');
  
  // Improved text element selection for nav and footer
  const navTextElements = [];
  
  // Add global-nav-shell text elements - using more specific selectors
  document.querySelectorAll('.nav-copy-txt, .nav-copy-txt *, .nav-hover, .global-nav-shell a, .global-nav-shell span, .global-nav-shell div:not(.nav-hover):not(.logo-nav)').forEach(el => {
    // Skip empty elements and elements without text
    if (el.textContent.trim() !== '' && !el.querySelector('*')) {
      navTextElements.push(el);
    }
  });
  
  // Add footer text elements
  document.querySelectorAll('.global-footer-shell *').forEach(el => {
    if (el.childNodes.length === 1 && 
        el.firstChild.nodeType === 3 && 
        el.textContent.trim() !== '') {
      navTextElements.push(el);
    }
  });
  
  if (!navElement) {
    navAnimating = false;
    return;
  }
  
  if (!navOpen) {
    // Cleanup any existing split text instances first
    splitTextInstances.forEach(splitText => {
      splitText.revert();
    });
    splitTextInstances = [];
    
    // Opening the navigation
    const tl = gsap.timeline({
      onComplete: () => {
        navOpen = true;
        navAnimating = false;
      }
    });
    
    // First, open the nav and slide the main shell
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
    
    // Animate logo to black
    if (logoNav) {
      tl.to(logoNav, {
        color: '#000000',
        duration: 0.5,
        ease: 'power2.inOut'
      }, 0.2);
    }
    
    // Animate all text elements to black
    if (navTextElements.length) {
      tl.to(navTextElements, {
        color: '#000000',
        duration: 0.5,
        ease: 'power2.inOut'
      }, 0.2);
      
      // Debug log to see what's being selected
      console.log("Selected text elements:", navTextElements.length);
    }
    
    // Once the nav is mostly open, animate the text
    const navLinks = document.querySelectorAll('.takeover-nav-link-txt');
    
    navLinks.forEach((navLink, index) => {
      // Create split text for each link
      const splitText = new SplitText(navLink, { 
        type: "chars",
        position: "relative"
      });
      
      // Store for later cleanup
      splitTextInstances.push(splitText);
      
      // Set initial state
      gsap.set(splitText.chars, { 
        y: -150,
        //opacity: 0
      });
      
      // Animate chars with a slight delay after main animation starts
      tl.to(splitText.chars, {
        y: 0,
        //opacity: 1,
        duration: 1.2,
        ease: "power4.out",
        stagger: 0.02,
        overwrite: "auto"
      }, 0.32 + index * 0.1); // Start when the nav is already opening
    });
    
  } else {
    // Closing the navigation
    const tl = gsap.timeline({
      onComplete: () => {
        navOpen = false;
        navAnimating = false;
      }
    });
    
    // Hide nav link text first
    const navLinks = document.querySelectorAll('.takeover-nav-link-txt');
    tl.to(navLinks, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in'
    }, 0);
    
    // Animate logo back to white
    if (logoNav) {
      tl.to(logoNav, {
        color: '#ffffff',
        duration: 0.5,
        ease: 'power2.inOut'
      }, 0);
    }
    
    // Animate all text elements back to white
    if (navTextElements.length) {
      tl.to(navTextElements, {
        color: '#ffffff',
        duration: 0.5,
        ease: 'power2.inOut'
      }, 0);
    }
    
    // Then close the nav
    tl.to(navElement, {
      height: '0',
      duration: 1,
      ease: 'expo.inOut',
      onComplete: () => {
        // Clean up split text only after animation completes
        splitTextInstances.forEach(splitText => {
          splitText.revert();
        });
        splitTextInstances = [];
        
        // Reset opacity
        navLinks.forEach(link => {
          gsap.set(link, { opacity: 1 });
        });
      }
    }, 0.0);
    
    if (mainShell) {
      tl.to(mainShell, {
        transform: 'translate3d(0, 0, 0)',
        duration: 1,
        ease: 'expo.inOut'
      }, 0.0);
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