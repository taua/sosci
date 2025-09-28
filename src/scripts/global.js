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
      fps: 6,            // Slightly slower for better performance
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

// Declare missing tracking variables at the top of the file
let navHoverSplit = null;
let isNavHoverActive = false;

// Add navigation state and functionality
let navOpen = false;
let navAnimating = false;

// Store split text instances for cleanup
let splitTextInstances = [];
//let closeTxtSplit = null; // Add variable for close-txt split

function openNav() {
  if (navAnimating) return;
  navAnimating = true;
  
  const navElement = document.querySelector('.global-nav-takeover');
  const mainShell = document.querySelector('.main-shell');
  const logoNav = document.querySelector('.logo-nav');
  const navNumbers = document.querySelectorAll('.takeover-nav-num-txt');
  
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
    navOpen = true;
    
    // Cleanup any existing split text instances first
    splitTextInstances.forEach(splitText => {
      splitText.revert();
    });
    splitTextInstances = [];
    
    // Opening the navigation
    const tl = gsap.timeline({
      onComplete: () => {
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
    }
    
    // Animate nav numbers opacity without stagger
    if (navNumbers.length) {
      tl.to(navNumbers, {
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out'
      }, 0.5); // Start after nav begins to open
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
    
    // Animate .x-top scaleX from 0 to 1
    const xTopEl = document.querySelector('.x-top');
    const xBtmEl = document.querySelector('.x-bottom');
    if (xTopEl) {
      gsap.set(xTopEl, { scaleX: 0 });
      tl.to(xTopEl, {
        scaleX: 1,
        duration: .8,
        delay: 0.4,
        ease: "power3.out"
      }, 0);
    }
    if (xBtmEl) {
      gsap.set(xBtmEl, { scaleX: 0 });
      tl.to(xBtmEl, {
        scaleX: 1,
        duration: .8,
        delay: .7,
        ease: "power3.out"
      }, 0);
    }

    // Fade opacity of .nav-wht-btm when nav opens
    const navHoverEl = document.querySelector('.nav-hover');
    const navBtmText = navHoverEl ? navHoverEl.querySelector('.nav-wht-btm') : null;
    if (navBtmText) {
      tl.to(navBtmText, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.out"
      }, 0.2);
    }
  } else {
    // Set navOpen to false immediately when animation starts
    navOpen = false;
    
    // Closing the navigation
    const tl = gsap.timeline({
      onComplete: () => {
        navAnimating = false; // Only set animating to false when complete
      }
    });
    
    // Hide nav link text and numbers first
    const navLinks = document.querySelectorAll('.takeover-nav-link-txt');
    tl.to(navLinks, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in'
    }, 0);
    
    // Animate nav numbers to hidden without stagger
    tl.to(navNumbers, {
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
      }, .5);
    }
    
    // Animate all text elements back to white
    if (navTextElements.length) {
      tl.to(navTextElements, {
        color: '#ffffff',
        duration: 0.5,
        ease: 'power2.inOut'
      }, .5);
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
    
    // Reverse .x-top and .x-bottom animations when nav closes
    const xTopEl = document.querySelector('.x-top');
    const xBtmEl = document.querySelector('.x-bottom');
    if (xTopEl) {
      tl.to(xTopEl, {
        scaleX: 0,
        duration: .5,
        ease: "power3.in"
      }, 0);
    }
    if (xBtmEl) {
      tl.to(xBtmEl, {
        scaleX: 0,
        duration: .5,
        ease: "power3.in"
      }, 0);
    }

    // Fade opacity of .nav-wht-btm back in when nav closes
    const navHoverEl = document.querySelector('.nav-hover');
    const navBtmText = navHoverEl ? navHoverEl.querySelector('.nav-wht-btm') : null;
    if (navBtmText) {
      tl.to(navBtmText, {
        opacity: 1,
        duration: 0.4,
        ease: "power2.out"
      }, 0.7); // Start at the beginning of the timeline
    }
  }
}

function playLoadingAnimation() {
  const transLogoShell = document.querySelector('.trans-logo-shell');
  const transSpacer = document.querySelector('.trans-spacer');
  const transImgShell = document.querySelector('.trans-img-shell');
  const transImgs = transImgShell ? Array.from(transImgShell.querySelectorAll('.trans-img')).reverse() : [];

  const tl = gsap.timeline();

  // Fade and blur in trans-logo-shell
  if (transLogoShell) {
    tl.fromTo(transLogoShell, {
      opacity: 0,
      filter: 'blur(40px)'
    }, {
      opacity: 1,
      filter: 'blur(0px)',
      duration: 1.4,
      ease: "power4.out"
    });
  }

  // Animate spacer and img-shell widths in parallel, after logo anim
  tl.to(transSpacer, {
    width: '7.7vw',
    duration: 0.9,
    ease: "expo.inOut"
  }, 1);

  tl.to(transImgShell, {
    width: '6.6vw',
    duration: 0.9,
    ease: "expo.inOut"
  }, "<");

  // Animate all but the last .trans-img height from 100% to 0% with stagger, bottom to top
  if (transImgs.length > 1) {
    tl.to(transImgs.slice(0, -1), {
      height: '0%',
      duration: .7,
      ease: "power4.inOut",
      stagger: 0.35, // Use flat stagger, not stagger object
    }, ">");
  }

  // If only one image, animate it directly
  if (transImgs.length === 1) {
    tl.to(transImgs[0], {
      height: '0%',
      duration: 1,
      ease: "expo.inOut"
    }, ">");
  }

  // ...existing code...
}

// ...existing code...

window.addEventListener('DOMContentLoaded', () => {
  playLoadingAnimation();
  // Setup nav click handler
  document.addEventListener('click', (e) => {
    const navTrigger = e.target.closest('.nav-hover');
    if (navTrigger) {
      openNav();
      e.preventDefault();
    }
  });
  
  // Add hover animation for nav-hover element after fonts are loaded
  const navHoverEl = document.querySelector('.nav-hover');
  
  if (navHoverEl) {
    // Find both nav-wht-top and nav-wht-btm elements inside nav-hover
    const navTopText = navHoverEl.querySelector('.nav-wht-top');
    const navBtmText = navHoverEl.querySelector('.nav-wht-btm');
    
    // Wait for fonts to load before applying SplitText
    document.fonts.ready.then(() => {
      // Handle top text if it exists
      if (navTopText) {
        // Create parent container with overflow hidden if needed
        const parentTop = navTopText.parentElement;
        if (parentTop) {
          parentTop.style.overflow = 'hidden';
          parentTop.style.display = 'block'; 
        }
        
        // Split the text into characters for animation
        try {
          navHoverSplit = new SplitText(navTopText, { 
            type: "chars",
            position: "relative"
          });
        } catch (error) {
          console.error('SplitText error (top):', error);
        }
      }
      
      // Handle bottom text if it exists
      let navBtmSplit = null;
      if (navBtmText) {
        // Create parent container with overflow hidden if needed
        const parentBtm = navBtmText.parentElement;
        if (parentBtm) {
          parentBtm.style.overflow = 'hidden';
          parentBtm.style.display = 'block'; 
        }
        
        // Split the bottom text into characters
        try {
          navBtmSplit = new SplitText(navBtmText, { 
            type: "chars",
            position: "relative"
          });
        } catch (error) {
          console.error('SplitText error (bottom):', error);
        }
      }
      
      // Set up hover listeners only if at least one split was successful
      if (navHoverSplit?.chars?.length || navBtmSplit?.chars?.length) {
        // Set up hover in animation
        navHoverEl.addEventListener('mouseenter', () => {
          // Skip if nav is open or animation is already active
          if (navOpen || isNavHoverActive) return;
          
          isNavHoverActive = true;
          
          // Animate top text characters if they exist
          if (navHoverSplit?.chars?.length) {
            gsap.killTweensOf(navHoverSplit.chars);
            gsap.to(navHoverSplit.chars, {
              transform: 'translate3d(0, -100%, 0)', 
              duration: 0.3,
              ease: "power3.out",
              stagger: 0.01,
              overwrite: true
            });
          }
          
          // Animate bottom text characters if they exist
          if (navBtmSplit?.chars?.length) {
            gsap.killTweensOf(navBtmSplit.chars);
            gsap.to(navBtmSplit.chars, {
              transform: 'translate3d(0, -100%, 0)', 
              duration: 0.3,
              ease: "power3.out",
              stagger: 0.01,
              overwrite: true
            });
          }
        });
        
        // Set up hover out animation
        navHoverEl.addEventListener('mouseleave', () => {
          // Skip if nav is open or animation is not active
          if (navOpen || !isNavHoverActive) return;
          
          isNavHoverActive = false;
          
          // Animate top text characters back if they exist
          if (navHoverSplit?.chars?.length) {
            gsap.killTweensOf(navHoverSplit.chars);
            gsap.to(navHoverSplit.chars, {
              transform: 'translate3d(0, 0, 0)',
              duration: 0.4,
              ease: "power3.out",
              stagger: 0.015,
              overwrite: true
            });
          }
          
          // Animate bottom text characters back if they exist
          if (navBtmSplit?.chars?.length) {
            gsap.killTweensOf(navBtmSplit.chars);
            gsap.to(navBtmSplit.chars, {
              transform: 'translate3d(0, 0, 0)',
              duration: 0.4,
              ease: "power3.out",
              stagger: 0.015,
              overwrite: true
            });
          }
        });
      }
    }).catch(error => {
      console.error('Font loading error:', error);
    });
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

function navigateToUrl(url) {
    console.log('Navigating to:', url);
}