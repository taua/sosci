
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { SplitText } from "gsap/SplitText";
import grainEffect from "./grainEffect";
import barba from '@barba/core';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

export function greet(page) {
  // Remove console.log
}

// Remove console.log Global JS loaded


// --- Barba.js Integration ---
// Track the current grain cleanup so we don't create multiple canvases
let _grainCleanup = null;
function initGrain() {
  // Initialize the grain effect only once on the first full page load.
  // If a grain instance already exists, do nothing.
  try {
    if (typeof _grainCleanup === 'function') {
      // Already initialized — no-op
      return;
    }

    _grainCleanup = grainEffect({
      opacity: 1,
      grainAlpha: 32,
      grainScale: 3.4,
      fps: 6,
      blendMode: 'hard-light',
      greyness: 90
    });

    // Intentionally do not install an unload listener here so the grain canvas
    // persists across Barba transitions and remains until the browser fully
    // unloads the page. The browser will clean up DOM/CSS/JS on full reload.
  } catch (error) {
    console.error('Failed to initialize grain effect:', error);
  }
}

let videoScrollTriggers = [];
function initVideoVisibility() {
  // Kill only video-specific ScrollTriggers
  if (Array.isArray(videoScrollTriggers)) {
    videoScrollTriggers.forEach(trigger => {
      if (trigger && typeof trigger.kill === 'function') trigger.kill();
    });
    videoScrollTriggers = [];
  }
  if (window.location.pathname.includes('work')) return;
  const videos = document.querySelectorAll('.bg-proj-video video');
  if (!videos.length) return;
  videos.forEach((video) => {
    video.muted = true;
    video.playsInline = true;
    video.loop = true;
    const trigger = ScrollTrigger.create({
      trigger: video.parentElement,
      start: 'top bottom',
      end: 'bottom top',
      onEnter: () => video.play().catch(console.error),
      onLeave: () => video.pause(),
      onEnterBack: () => video.play().catch(console.error),
      onLeaveBack: () => video.pause()
    });
    videoScrollTriggers.push(trigger);
  });
}

let smootherInstance = null;
function initScrollSmoother() {
  // Kill previous ScrollSmoother instance if it exists
  if (smootherInstance && typeof smootherInstance.kill === 'function') {
    console.log('[ScrollSmoother] Killing previous instance');
    smootherInstance.kill();
    smootherInstance = null;
  }
  const wrapper = document.querySelector('.main-shell');
  const content = document.querySelector('.content-shell');
  const mainShells = document.querySelectorAll('.main-shell');
  const contentShells = document.querySelectorAll('.content-shell');
  console.log('[ScrollSmoother] wrapper:', wrapper, 'content:', content);
  console.log(`[ScrollSmoother] .main-shell count: ${mainShells.length}, .content-shell count: ${contentShells.length}`);
  if (wrapper && content) {
    smootherInstance = ScrollSmoother.create({
      wrapper: ".main-shell",
      content: ".content-shell",
      smooth: 1.2,
      effects: true
    });
    console.log('[ScrollSmoother] Initialized!');
    // Force GSAP to recalculate layout
    if (typeof ScrollSmoother.refresh === 'function') {
      ScrollSmoother.refresh();
      console.log('[ScrollSmoother] Refreshed!');
    }
  } else {
    console.warn('ScrollSmoother: .main-shell or .content-shell not found in DOM.');
  }
}

function initPageScripts() {
  // Page-specific imports
  // Run any existing cleanup first
  if (typeof currentPageCleanup === 'function') {
    try { currentPageCleanup(); } catch (e) { console.warn('currentPageCleanup failed', e); }
    currentPageCleanup = null;
  }

  if (window.location.pathname === '/' || window.location.pathname.includes('home')) {
    import('./home.js').then(module => {
      if (typeof module.initHomePage === 'function') module.initHomePage();
      if (typeof module.cleanupHomePage === 'function') currentPageCleanup = module.cleanupHomePage;
    });
  } else if (window.location.pathname.includes('about')) {
    import('./about.js').then(module => {
      if (typeof module.initAboutPage === 'function') module.initAboutPage();
      if (typeof module.cleanupAboutPage === 'function') currentPageCleanup = module.cleanupAboutPage;
    });
  } else if (window.location.pathname.includes('work')) {
    import('./work.js').then(module => {
      if (typeof module.initWorkPage === 'function') module.initWorkPage();
      if (typeof module.cleanupWorkPage === 'function') currentPageCleanup = module.cleanupWorkPage;
    });
  } else if (window.location.pathname.includes('projects')) {
    import('./project.js').then(module => {
      if (typeof module.initProjectPage === 'function') module.initProjectPage();
      if (typeof module.cleanupProjectPage === 'function') currentPageCleanup = module.cleanupProjectPage;
    });
  } else {
    // default
  }
}

// current page cleanup reference (set by page modules when they export a cleanup)
let currentPageCleanup = null;

/*
function initGlobalListeners() {
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
}
  */

// Barba.js initialization
barba.init({
  transitions: [{
    name: 'default-transition',
    async leave(data) {
      console.log('[Barba] leave — running page cleanup (if any)');
      // Call page-specific cleanup if available before removing the container
      try {
        if (typeof currentPageCleanup === 'function') {
          console.log('[Barba] invoking currentPageCleanup');
          await Promise.resolve(currentPageCleanup());
          console.log('[Barba] currentPageCleanup finished');
        }
      } catch (e) {
        console.warn('Error running page cleanup:', e);
      }
      // Optionally animate out old content
      return gsap.to(data.current.container, { opacity: 0, duration: 0.4 });
    },
    async enter(data) {
      console.log('[Barba] enter — scheduling smoother init + page scripts');
      // Animate in new content
      gsap.from(data.next.container, { opacity: 0, duration: 0.4 });
      // Ensure ScrollSmoother is created/refreshed before page scripts run.
      // Use two frames: one to run/refresh the smoother, next to initialize video triggers and page scripts
      requestAnimationFrame(() => {
        console.log('[Barba] Running initScrollSmoother after transition');
        initScrollSmoother();
        requestAnimationFrame(() => {
          console.log('[Barba] Running initVideoVisibility + initPageScripts after smoother init');
          // Initialize video visibility triggers after smoother is ready
          initVideoVisibility();
          initPageScripts();
          // Give GSAP a moment to register triggers
          ScrollTrigger.refresh();
        });
      });
    },
    async after() {
      // Re-attach global listeners if needed
      //initGlobalListeners();
    }
  }]
});

// Initial load
initGrain();
initVideoVisibility();
initScrollSmoother();
// Initialize page scripts after the smoother has initialized so ScrollTrigger
// and other scroll-driven plugins can bind correctly on first load.
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    // Ensure smoother is initialized first
    initScrollSmoother();
    requestAnimationFrame(() => {
      initVideoVisibility();
      initPageScripts();
      ScrollTrigger.refresh();
    });
  });
});
//initGlobalListeners();

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

// Remove this function from global.js

function playLoadingAnimation() {
  const transLogoShell = document.querySelector('.trans-logo-shell');
  const transMainShell = document.querySelector('.main-shell');
  const transSpacer = document.querySelector('.trans-spacer');
  const transImgShell = document.querySelector('.trans-img-shell');
  const transImgs = transImgShell ? Array.from(transImgShell.querySelectorAll('.trans-img')).reverse() : [];
  const globalTransition = document.querySelector('.global-transition');

  const tl = gsap.timeline();

  // Wait 1 second before starting transLogoShell animation
  //tl.to({}, { duration: .1 }); // dummy tween for delay

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
    width: '7.8vw',
    duration: 0.8,
    ease: "expo.inOut"
  }, "-=0.3");

  tl.to(transImgShell, {
    width: '6.6vw',
    duration: 0.8,
    ease: "expo.inOut"
  }, "<");

  // Animate all but the last .trans-img height from 100% to 0% with stagger, bottom to top
  if (transImgs.length > 1) {
    tl.to(transImgs.slice(0, -1), {
      height: '0%',
      duration: .8,
      ease: "expo.inOut",
      stagger: 0.22,
    }, "-=0.4"); // starts 0.3s before previous tween ends
  }

  // Scale transSpacer and transImgShell back to 0vw after images animate
  tl.to([transSpacer, transImgShell], {
    width: '0vw',
    duration: 0.7,
    ease: "expo.inOut"
  }, ">");
  
 

  if (globalTransition) {
    tl.to(globalTransition, {
      transform: 'translate3d(0, -100%, 0)', 
      duration: 1.2,
      ease: "expo.inOut",
      onStart: () => {
        // Call a global hook for page intro animation
        if (typeof window.initPageTransitions === 'function') {
          //window.initPageTransitions();
        }
      }
    }, ">");
  }
  if (transMainShell) {
    tl.from(transMainShell, {
      transform: 'translate3d(0, 40%, 0)', 
      duration: 1.2,
      ease: "expo.inOut",
      onStart: () => {
        // Call a global hook for page intro animation
        if (typeof window.initPageTransitions === 'function') {
          //window.initPageTransitions();
        }
      }
    }, "<");
  }
  const soulScienceTxt = document.querySelector('.soul-science-txt');
  if (soulScienceTxt) {
    // Create a wrapper parent with overflow hidden for bottom-up animation
    const wrapper = document.createElement('span');
    wrapper.style.overflow = 'hidden';
    wrapper.style.marginLeft = '-.5vw';
    wrapper.style.mixBlendMode = 'difference';
    wrapper.style.zIndex = '2';
    //wrapper.style.display = 'inline-block';
    //wrapper.style.position = 'relative'; // Adjust as needed based on font size

    // Insert wrapper before the text element and move the text inside
    soulScienceTxt.parentNode.insertBefore(wrapper, soulScienceTxt);
    wrapper.appendChild(soulScienceTxt);

    let soulSplit = null;
    try {
      soulSplit = new SplitText(soulScienceTxt, { type: "chars", position: "relative" });
    } catch (error) {
      console.error('SplitText error (soul-science-txt):', error);
    }
    if (soulSplit?.chars?.length) {
      gsap.set(soulSplit.chars, { y: 100 });
      tl.to(soulSplit.chars, {
        y: 0,
        duration: 1.2,
        ease: "power3.out",
        stagger: 0.02,
        overwrite: "auto"
      }, "-=.85");
    }
  }


  





   // Blur fade out transLogoShell and animate global-transition height to 0vh simultaneously
  tl.to(transLogoShell, {
    opacity: 0,
    delay: 0.4,
    filter: 'blur(20px)',
    duration: .4,
    ease: "power2.inOut"
  }, "<");

  // GSAP will animate vw values using decimals, not just whole numbers.
// For example, animating width from '7.7vw' to '0vw' will interpolate with decimal precision.
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

// Page scripts are initialized via initPageScripts() after ScrollSmoother is ready.
/*
function navigateToUrl(url) {
  const mainShell = document.querySelector('.main-shell');
  const globalTransition = document.querySelector('.global-transition');

  // Ensure url is absolute (starts with "/") to avoid relative navigation
  if (url && !url.startsWith("/")) {
    url = "/" + url.replace(/^\/+/, "");
  }

  if (globalTransition) {
    globalTransition.style.left = "0";
    globalTransition.style.right = "0";
    globalTransition.style.bottom = "0";
    globalTransition.style.top = "auto";

    gsap.set(globalTransition, { height: "0vh" });

    gsap.to(globalTransition, {
      height: "100vh",
      duration: 1,
      ease: "expo.inOut",
      onComplete: () => {
        window.location.href = url;
      }
    });
    gsap.to(mainShell, {
      transform: 'translate3d(0, -30%, 0)',
      duration: 1,
      ease: 'expo.inOut'
    });
  } else {
    window.location.href = url;
  }
} */