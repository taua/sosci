
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { SplitText } from "gsap/SplitText";
import grainEffect from "./grainEffect";
import barba from '@barba/core';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

// Centralized timing constants for nav animations
const NAV_CLOSE_OVERLAP = .8; // seconds to overlap the nav-bottom fade when closing

// Silence console.log calls while keeping console.error/warn intact.
// Toggle ENABLE_LOGS to true to re-enable logs during debugging.
const ENABLE_LOGS = false;
if (typeof ENABLE_LOGS !== 'undefined' && !ENABLE_LOGS) {
  try {
    if (typeof console !== 'undefined' && console && typeof console.log === 'function') {
      // preserve original in case we want to restore later
      try { console._origLog = console._origLog || console.log; } catch (e) {}
      console.log = function() {};
    }
  } catch (e) {}
}

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
  const videos = document.querySelectorAll('video');
  if (!videos.length) return;
  videos.forEach((video) => {
    video.muted = true;
    video.playsInline = true;
    video.loop = true;

    // Safe play/pause wrappers: suppress benign AbortError logs when a
    // play() is immediately interrupted by pause(). Only log unexpected errors.
    const safePlay = () => {
      try {
        return video.play().catch(err => {
          try {
            const name = err && err.name;
            const msg = err && err.message;
            if (name === 'AbortError' || (msg && msg.includes('interrupted'))) {
              return; // ignore common benign error
            }
          } catch (e) {}
          console.error(err);
        });
      } catch (e) {
        try {
          if (e && e.name === 'AbortError') return;
        } catch (ee) {}
        console.error(e);
      }
    };

    const safePause = () => { try { video.pause(); } catch (e) { /* ignore */ } };

    const trigger = ScrollTrigger.create({
      trigger: video.parentElement,
      start: 'top bottom',
      end: 'bottom top',
      onEnter: safePlay,
      onLeave: safePause,
      onEnterBack: safePlay,
      onLeaveBack: safePause,
      onRefresh: (self) => {
        // On refresh, check if video is in view and play if so
        if (self.isActive) {
          safePlay();
        } else {
          safePause();
        }
      }
    });
    videoScrollTriggers.push(trigger);
    
    // Check initial state - if video is already in viewport, play it
    requestAnimationFrame(() => {
      if (trigger.isActive) {
        safePlay();
      }
    });
  });
}

let smootherInstance = null;
function initScrollSmoother() {
  // Kill previous ScrollSmoother instance if it exists
  if (smootherInstance && typeof smootherInstance.kill === 'function') {
    smootherInstance.kill();
    smootherInstance = null;
  }
  const wrapper = document.querySelector('.main-shell');
  const content = document.querySelector('.content-shell');
  const mainShells = document.querySelectorAll('.main-shell');
  const contentShells = document.querySelectorAll('.content-shell');
  // Debug info removed
  if (wrapper && content) {
    smootherInstance = ScrollSmoother.create({
      wrapper: ".main-shell",
      content: ".content-shell",
      smooth: 1.2,
      effects: true
    });
    console.log('[smoother] ScrollSmoother created');
  // ScrollSmoother initialized
    // Force GSAP to recalculate layout
    if (typeof ScrollSmoother.refresh === 'function') {
      ScrollSmoother.refresh();
  // ScrollSmoother refreshed
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
  } else if (window.location.pathname.includes('science') || window.location.pathname.includes('formula')) {
    import('./formula.js').then(module => {
      if (typeof module.initSciencePage === 'function') module.initSciencePage();
      if (typeof module.cleanupSciencePage === 'function') currentPageCleanup = module.cleanupSciencePage;
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

// Track if a page transition is in progress
let isTransitioning = false;

// Force full page reload on browser back/forward instead of Barba transitions
window.addEventListener('popstate', (e) => {
  e.preventDefault();
  window.location.reload();
});

// Barba.js initialization
barba.init({
  prevent: ({ el, href }) => {
    // Prevent navigation if a transition is already in progress
    if (isTransitioning) {
      return true;
    }
    return false;
  },
  transitions: [{
    name: 'default-transition',
    async leave(data) {
  // Barba leave: page cleanup (if any)
      // Mark transition as in progress
      isTransitioning = true;
      
      // Disable all navigation links to prevent rapid clicking
      const barbaWrapper = document.querySelector('[data-barba="wrapper"]');
      if (barbaWrapper) {
        barbaWrapper.style.pointerEvents = 'none';
      }
      // Call page-specific cleanup if available before removing the container
      try {
        if (typeof currentPageCleanup === 'function') {
          // invoking currentPageCleanup
          await Promise.resolve(currentPageCleanup());
          // currentPageCleanup finished
        }
      } catch (e) {
        console.warn('Error running page cleanup:', e);
      }
      // Optionally animate out old content
      if (navOpen) {
        // If nav is open, skip the transition animation
        return;
      }
      const tl = gsap.timeline();
      tl.fromTo(
        document.querySelector('.global-transition'),
        { y: '100%' },
        { y: '0%', duration: 0.8, ease: 'expo.inOut', force3D: true }
      );
      tl.to(
        document.querySelector('.main-shell'),
        { y: '-30%', duration: 0.8, ease: 'expo.inOut', force3D: true },
        0 // start at the same time as the global-transition animation
      );
      const logoLetters = document.querySelectorAll('.split-logo-shell .logo-letter-svg');
      const splitLogoShell = document.querySelector('.split-logo-shell');
      const copyrightSymbol = document.querySelector('.split-logo-shell .copyright-symbol');
      if (splitLogoShell) {
        splitLogoShell.style.visibility = 'visible';
      }
      if (logoLetters.length) {
        gsap.set(logoLetters, { transform: 'translate3d(0,110%,0)' });
        gsap.set(copyrightSymbol, { transform: 'translate3d(0,-100%,0)' });
        tl.to(logoLetters, {
          transform: 'translate3d(0,0%,0)',
          duration: 1,
          ease: 'expo.inOut',
          stagger: 0.05,
          overwrite: 'auto'
        }, 0.16); // start slightly after transition begins
        tl.to(copyrightSymbol, {
          transform: 'translate3d(0,0%,0)',
          duration: .6,
          ease: 'expo.inOut',
          overwrite: 'auto'
        }, "<.45"); // start slightly after letters begin
      }
      return tl;
    },
    async enter(data) {
  // Barba enter: scheduling smoother init + page scripts
      // Animate in new content
    // Determine which animation to play based on the page
    if (window.location.pathname === '/' || window.location.pathname.includes('home')) {
      if (typeof window.playHomeEnterAnimation === 'function') {
        window.playHomeEnterAnimation(data);
      }
    } else if (window.location.pathname.includes('about')) {
      if (typeof window.playAboutEnterAnimation === 'function') {
        window.playAboutEnterAnimation(data);
      }
    } else if (window.location.pathname.includes('work')) {
      if (typeof window.playWorkEnterAnimation === 'function') {
        window.playWorkEnterAnimation(data);
      }
    } else if (window.location.pathname.includes('formula')) {
      if (typeof window.playFormulaEnterAnimation === 'function') {
        window.playFormulaEnterAnimation(data);
      }
    } else if (window.location.pathname.includes('projects')) {
      if (typeof window.playProjectEnterAnimation === 'function') {
        window.playProjectEnterAnimation(data);
      }
    } else {
      // Default animation or no-op
    }
  
      
      //gsap.from(data.next.container, { opacity: 0, duration: 0.4 });
      // Initialize ScrollSmoother for all page transitions
      if (!navOpen) {
        // For nav closed: init smoother and page scripts immediately
        requestAnimationFrame(() => {
          initScrollSmoother();
          requestAnimationFrame(() => {
            initVideoVisibility();
            initPageScripts();
            ScrollTrigger.refresh();
            // Refresh again after a short delay to catch any images that load
            setTimeout(() => ScrollTrigger.refresh(), 100);
          });
        });
      } else {
        // For nav open: init smoother and page scripts now since closeNav will handle the animation
        requestAnimationFrame(() => {
          initScrollSmoother();
          requestAnimationFrame(() => {
            initVideoVisibility();
            initPageScripts();
            ScrollTrigger.refresh();
            // Refresh again after a short delay to catch any images that load
            setTimeout(() => ScrollTrigger.refresh(), 100);
          });
        });
      }
    },
    async after() {
  // Barba after — transition complete
  let tl;
  if (!navOpen) {
    tl = gsap.timeline({
      onComplete: () => {
        // Ensure ScrollSmoother is unpaused after the entire transition completes
        if (smootherInstance && typeof smootherInstance.paused === 'function') {
          try {
            smootherInstance.paused(false);
          } catch (e) {}
        }
        // Refresh ScrollTrigger after mainShell animation completes to fix positions
        try {
          ScrollTrigger.refresh();
        } catch (e) {}
      }
    });
    
    const mainShellEl = document.querySelector('.main-shell');
    if (mainShellEl) {
      // Pause ScrollSmoother (if it exists) to prevent scroll during animation
      if (smootherInstance && typeof smootherInstance.paused === 'function') {
        try {
          smootherInstance.paused(true);
        } catch (e) {}
      }
      
      // Don't kill ScrollSmoother - let it continue running
      
      // Animate from current position (don't set starting position)
      tl.fromTo(mainShellEl, {
        y: '30%',
        force3D: true
      }, {
        y: '0%',
        duration: 0.8,
        ease: 'expo.inOut',
        force3D: true,
        onComplete: () => {
          // Unpause ScrollSmoother after animation
          if (smootherInstance && typeof smootherInstance.paused === 'function') {
            try {
              smootherInstance.paused(false);
            } catch (e) {}
          }
          
          // Removed scrollTo(0) - let scroll position remain as is
        }
      }, 0.2);
    }
    
    tl.fromTo(
      document.querySelector('.global-transition'),
      { y: '0%' },
      { y: '-100%', duration: 0.8, ease: 'expo.inOut', force3D: true },
      0.2
    );
  } else {
    console.log('Nav is open, closing nav without main-shell animation');
    // Removed main-shell translate animation when navigating with nav open
    
    // Wait for both the active underline animation (in) and inactive animation (out) to complete, then close the nav
    (async () => {
      try {
        // Wait for underline animations to complete:
        // - Out animation: 0.55s (scale collapse)
        // Delay adjusted to match new animation duration
        await new Promise(res => setTimeout(res, 650));
      } catch (e) {}
      try { if (typeof closeNav === 'function') closeNav(); } catch (e) {}
    })();
  }
  return tl;
      
      // Re-attach global listeners if needed
      //initGlobalListeners();
    }
  }]
});



// Helper: ensure ScrollTrigger/ScrollSmoother are aware of the current layout
// and clear any temporary transforms that can block pointer/scroll behavior.
function restoreScrolling() {
  try { ScrollTrigger.refresh(); } catch (e) {}
  try {
    if (smootherInstance && typeof smootherInstance.refresh === 'function') {
      try { smootherInstance.refresh(); } catch (e) {}
    }
  } catch (e) {}
  try {
    const main = document.querySelector('.main-shell');
    if (main) main.style.transform = '';
  } catch (e) {}
}

// Centralized robust scroll reset used across pages. Tries smoother.scrollTo when
// available and falls back to window.scrollTo. Uses multiple attempts (immediate,
// double rAF, timeout, and load event) to cover timing races with browser
// restoration or smoother initialization.
function robustScrollReset() {
  let originalSmooth = null;
  let smoothDisabled = false;
  
  const tryReset = () => {
    try {
      if (smootherInstance && typeof smootherInstance.scrollTo === 'function') {
        try {
          // Only disable smooth once on first call
          if (!smoothDisabled && typeof smootherInstance.smooth === 'function') {
            originalSmooth = smootherInstance.smooth();
            if (originalSmooth) {
              smootherInstance.smooth(0);
              smoothDisabled = true;
            }
          }
          smootherInstance.scrollTo(0, false);
        } catch (e) {}
        return true;
      }
    } catch (e) {}
    try { window.scrollTo(0, 0); return true; } catch (e) { return false; }
  };

  try {
    tryReset();
    requestAnimationFrame(() => requestAnimationFrame(() => tryReset()));
    setTimeout(() => tryReset(), 120);
    const onLoad = () => { tryReset(); window.removeEventListener('load', onLoad); };
    try { window.addEventListener('load', onLoad); } catch (e) {}
    
    // Restore smooth scrolling after all reset attempts complete
    if (smoothDisabled && originalSmooth) {
      setTimeout(() => {
        try { 
          if (smootherInstance && typeof smootherInstance.smooth === 'function') {
            smootherInstance.smooth(originalSmooth);
          }
        } catch (e) {}
      }, 400);
    }
  } catch (e) {}
}

// Run restore on initial load too (safeguard for direct page loads)
requestAnimationFrame(() => requestAnimationFrame(() => restoreScrolling()));
// Mark that the page is bootstrapping (initial load/refresh). Pages can skip
// first-load entrance animations until this is cleared.
try { window._pageBootstrapping = true; } catch (e) {}

// Initial load
initGrain();
initVideoVisibility();
initScrollSmoother();
// Ensure page starts at top using robust reset (covers all pages)
try { robustScrollReset(); } catch (e) {}
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
      try { robustScrollReset(); } catch (e) {}
      // Refresh again after short delays to catch any images that load
      setTimeout(() => ScrollTrigger.refresh(), 100);
      setTimeout(() => ScrollTrigger.refresh(), 500);
      // Clear bootstrapping after a short delay so per-page logic has time to
      // measure layout and set initial states. 150ms is generous but small.
      setTimeout(() => { try { window._pageBootstrapping = false; } catch (e) {} }, 150);
    });
  });
});
// Ensure Barba lifecycle uses the same robust reset on first load and after navigation
try {
  if (barba && barba.hooks) {
    barba.hooks.once(() => {
      try { robustScrollReset(); } catch (e) {}
      // Reset nav hover state on initial load
      isNavHoverActive = false;
    });

    barba.hooks.afterEnter(() => {
      // run after paint/layout and let ScrollTrigger refresh first
      requestAnimationFrame(() => requestAnimationFrame(() => {
        try { ScrollTrigger.refresh(); } catch (e) {}
        try { robustScrollReset(); } catch (e) {}
          try { updateActiveFromLocation(); } catch (e) {}
          // Reset nav hover state on page transition
          isNavHoverActive = false;
          // Reset char transforms to default state
          if (navHoverSplit?.chars?.length) {
            gsap.set(navHoverSplit.chars, { transform: 'translate3d(0, 0, 0)' });
          }
          // Re-enable navigation links now that page is ready
          const barbaWrapper = document.querySelector('[data-barba="wrapper"]');
          if (barbaWrapper) {
            barbaWrapper.style.pointerEvents = 'auto';
          }
          // Mark transition as complete
          isTransitioning = false;
          if (navBtmSplit?.chars?.length) {
            gsap.set(navBtmSplit.chars, { transform: 'translate3d(0, 0, 0)' });
          }
      }));
    });
  }
} catch (e) {}
//initGlobalListeners();

// Declare missing tracking variables at the top of the file
let navHoverSplit = null;
let navBtmSplit = null;
let isNavHoverActive = false;

// Add navigation state and functionality
let navOpen = false;
let navAnimating = false;

// Store split text instances for cleanup
let splitTextInstances = [];
//let closeTxtSplit = null; // Add variable for close-txt split

// Helper: animate underline in/out for a .strike-through-line element
function animateUnderlineIn(line) {
  if (!line) return;
  try { gsap.killTweensOf(line); } catch (e) {}
  try { gsap.set(line, { transformOrigin: 'left center' }); } catch (e) {}
  try {
    // Create a tween and store a promise that resolves when the tween completes
    const tween = gsap.to(line, { scaleX: 1, opacity: 1, duration: 0.45, ease: 'expo.out' });
    try {
      // expose the tween and a completion promise so other code (e.g. Barba hooks)
      // can wait for the active-line animation to finish before closing the nav
      window._navActiveLineTween = tween;
      window._navActiveLinePromise = new Promise((resolve) => {
        tween.eventCallback('onComplete', () => {
          try { resolve(); } catch (e) {}
        });
      });
    } catch (e) {}
    return tween;
  } catch (e) {}
}

function animateUnderlineOut(line, options) {
  // options: { mode: 'fade' | 'scale', origin: 'left' | 'right' }
  if (!line) return;
  try { gsap.killTweensOf(line); } catch (e) {}
  
  const mode = options && options.mode ? options.mode : 'fade';
  const origin = options && options.origin ? options.origin : 'left';
  
  // Set transform origin based on the origin option
  try { gsap.set(line, { transformOrigin: origin + ' center' }); } catch (e) {}
  
  try {
    if (mode === 'scale') {
      // Collapse using scaleX (visual width collapse) while keeping opacity at 1
      // Use expo.inOut for all scale animations for consistency
      const tween = gsap.to(line, { scaleX: 0, opacity: 1, duration: 0.55, ease: 'expo.inOut' });
      // Track this animation so closeNav can wait for it
      try {
        window._navInactiveLineTween = tween;
        window._navInactiveLinePromise = new Promise((resolve) => {
          tween.eventCallback('onComplete', () => {
            try { resolve(); } catch (e) {}
          });
        });
      } catch (e) {}
      return tween;
    } else {
      // Default: fade out then ensure scale is reset
      gsap.to(line, { opacity: 0, duration: 0.25, ease: 'power2.in', onComplete: () => { try { gsap.set(line, { scaleX: 0 }); } catch (e) {} } });
    }
  } catch (e) {}
}

// Set active container: animate old active out, new active in, toggle classes and aria-current
function setActiveContainer(newContainer, options) {
  if (!newContainer) return;
  const prev = document.querySelector('.takeover-nav-link.active');
  if (prev === newContainer) return;
  try {
    if (prev) {
      prev.classList.remove('active');
      const prevAnchor = prev.matches && prev.matches('a[href]') ? prev : prev.querySelector && prev.querySelector('a[href]');
      if (prevAnchor && prevAnchor.setAttribute) prevAnchor.removeAttribute('aria-current');
      const prevLine = prev.querySelector && prev.querySelector('.strike-through-line');
      // Propagate options (e.g., { mode: 'scale' }) so clicks can collapse by scale
      animateUnderlineOut(prevLine, options);
    }
  } catch (e) {}

  try {
    newContainer.classList.add('active');
    const newAnchor = newContainer.matches && newContainer.matches('a[href]') ? newContainer : newContainer.querySelector && newContainer.querySelector('a[href]');
    if (newAnchor && newAnchor.setAttribute) newAnchor.setAttribute('aria-current', 'page');
    const newLine = newContainer.querySelector && newContainer.querySelector('.strike-through-line');
    animateUnderlineIn(newLine);
  } catch (e) {}
}

// Update active based on current location (same matching logic used earlier)
function updateActiveFromLocation() {
  try {
    let currentPath = (window.location && window.location.pathname) ? window.location.pathname.replace(/\/+$/, '') : '';
    if (!currentPath) currentPath = '/';
    const linkContainers = document.querySelectorAll('.takeover-nav-link');
    // If we're on an individual project detail (e.g. /projects/some-slug), do not underline any nav item.
    // Only allow matching when currentPath is exactly '/projects'.
    if (currentPath.startsWith('/projects') && currentPath !== '/projects') {
      // Clear any existing active state
      const prev = document.querySelector('.takeover-nav-link.active');
      if (prev) {
        prev.classList.remove('active');
        const prevAnchor = prev.matches && prev.matches('a[href]') ? prev : prev.querySelector && prev.querySelector('a[href]');
        if (prevAnchor && prevAnchor.removeAttribute) prevAnchor.removeAttribute('aria-current');
        const prevLine = prev.querySelector && prev.querySelector('.strike-through-line');
        animateUnderlineOut(prevLine);
      }
      return;
    }
    for (let i = 0; i < linkContainers.length; i++) {
      const container = linkContainers[i];
      let anchor = null;
      try { anchor = (container.matches && container.matches('a[href]')) ? container : container.querySelector('a[href]'); } catch (e) { anchor = container.querySelector ? container.querySelector('a[href]') : null; }
      if (!anchor) continue;
      let anchorPath = '';
      try { anchorPath = new URL(anchor.href, window.location.origin).pathname.replace(/\/+$/, ''); } catch (e) { anchorPath = anchor.getAttribute('href') || '/'; }
      if (!anchorPath) anchorPath = '/';
      let isMatch = false;
      if (anchorPath === '/') {
        isMatch = (currentPath === '/');
      } else {
        isMatch = (currentPath === anchorPath) || currentPath.startsWith(anchorPath + '/') || anchorPath.startsWith(currentPath + '/');
      }
      if (isMatch) { setActiveContainer(container); return; }
    }
  } catch (e) { console.warn('updateActiveFromLocation failed', e); }
}

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
        // navAnimating is now set to false earlier when text animations complete
      }
    });
    
    // First, open the nav using a scaleY reveal on .global-nav-bg (better GPU perf)
    const navBg = document.querySelector('.global-nav-bg');
    const linksShell = document.querySelector('.takeover-nav-links-shell');
    const xShell = document.querySelector('.x-shell');
    // Ensure links container and x-shell are visible before the nav opens (helps prevent FOUC)
    if (linksShell) gsap.set(linksShell, { visibility: 'visible' });
    if (xShell) gsap.set(xShell, { visibility: 'visible' });
    // Collapse all underline lines so the active one can animate in as part of the open timeline
    try {
      const allLines = document.querySelectorAll('.strike-through-line');
      if (allLines && allLines.length) gsap.set(allLines, { transformOrigin: 'left center', scaleX: 0, opacity: 1, force3D: true });
    } catch (e) {}

    if (!navBg) {
      // If the required background element is missing, abort the nav open and reset flags
      console.warn('openNav: .global-nav-bg element not found — aborting nav open');
  // hide linksShell and xShell again since we aborted
  if (linksShell) gsap.set(linksShell, { visibility: 'hidden' });
  if (xShell) gsap.set(xShell, { visibility: 'hidden' });
      navOpen = false;
      navAnimating = false;
      return;
    }
    // ensure origin and start state
    gsap.set(navBg, { transformOrigin: 'top center', scaleY: 0, force3D: true });
    
    // Animate takeover logo opacity to 1 (ensure it starts at 0)
    const takeoverLogo = document.querySelector('.global-nav-takeover-logo');
    if (takeoverLogo) {
      gsap.set(takeoverLogo, { opacity: 0 });
    }
    
    tl.to(navBg, {
      scaleY: 1,
      duration: 1,
      ease: 'expo.inOut'
    });
    
    if (takeoverLogo) {
      tl.to(takeoverLogo, {
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out'
      }, 0.4); // Start shortly after nav begins opening
    }
    
    if (mainShell) {
      tl.to(mainShell, {
        transform: 'translate3d(0, 30%, 0)',
        duration: 1,
        ease: 'expo.inOut'
      }, 0); // Start at the same time
    }
    /*
    // Animate logo to black
    if (logoNav) {
      tl.to(logoNav, {
        color: '#000000',
        duration: 0.5,
        ease: 'power2.inOut'
  }, "-=0.4");
    }
      
    
    // Animate all text elements to black
    if (navTextElements.length) {
      tl.to(navTextElements, {
        color: '#000000',
        duration: 0.5,
        ease: 'power2.inOut'
  }, "-=0.4");
    }
      */
    
    // Animate nav numbers opacity without stagger
    if (navNumbers.length) {
      tl.to(navNumbers, {
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out'
      }, 0.7); // Start after nav begins to open
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

      // Set initial state using translate3d
      gsap.set(splitText.chars, { 
        transform: 'translate3d(0, -150%, 0)'
      });

      // Animate chars with a slight delay after main animation starts
      tl.to(splitText.chars, {
        transform: 'translate3d(0, 0%, 0)',
        duration: .8,
        ease: "power3.out",
        stagger: 0.018,
        overwrite: "auto"
      }, 0.36 + index * 0.1); // Start when the nav is already opening
    });
    
    // Enable hover interactions early - right after first link starts animating
    tl.call(() => {
      navAnimating = false;
    }, null, 0.5);

  // After the text animation completes, underline the active nav link and disable its hover
  // Run this call 0.3s earlier so the underline starts sooner when the nav opens
  tl.call(() => {
      try {
  // Normalize current path: prefer '/' for root instead of empty string
  let currentPath = (window.location && window.location.pathname) ? window.location.pathname.replace(/\/+$/, '') : '';
  if (!currentPath) currentPath = '/';
  // nav-active debug logs removed
        const linksShellEl = document.querySelector('.takeover-nav-links-shell');
  // nav-active debug logs removed
        const linkContainers = document.querySelectorAll('.takeover-nav-link');
  // nav-active debug logs removed
        linkContainers.forEach((container, idx) => {
          try { /* nav-active debug log removed */ } catch (e) {}
          try {
            // The .takeover-nav-link may be the anchor itself (an <a>), or a container that contains an <a>.
            let anchor = null;
            try {
              anchor = (container.matches && container.matches('a[href]')) ? container : container.querySelector('a[href]');
            } catch (e) {
              anchor = container.querySelector ? container.querySelector('a[href]') : null;
            }
            if (!anchor) {
              // nav-active debug log removed
              return;
            }
            let anchorPath = '';
            try {
              anchorPath = new URL(anchor.href, window.location.origin).pathname.replace(/\/+$/, '');
            } catch (e) {
              anchorPath = anchor.getAttribute('href') || '';
            }
            if (!anchorPath) anchorPath = '/';
            // nav-active debug log removed
            // Strict matching rules:
            // - If anchor is root '/', only match when currentPath is '/'.
            // - Otherwise match exact path or prefix match where the prefix boundary is a slash (to avoid '/' matching everything).
            let isMatch = false;
            if (anchorPath === '/') {
              isMatch = (currentPath === '/');
            } else {
              isMatch = (currentPath === anchorPath) || currentPath.startsWith(anchorPath + '/') || anchorPath.startsWith(currentPath + '/');
            }
            if (isMatch) {
              // nav-active debug log removed
              container.classList.add('active');
              // disable pointer events for hover interactions (hover handlers check .active)
              const line = container.querySelector('.strike-through-line');
              if (line) {
                try { gsap.killTweensOf(line); } catch (e) {}
                try {
                  // nav-active debug log removed
                } catch (e) {}
                gsap.set(line, { transformOrigin: 'left center' });
                gsap.to(line, { scaleX: 1, opacity: 1, duration: 0.5, ease: 'expo.out', onComplete: () => {
                  try { /* nav-active debug log removed */ } catch (e) {}
                } });
              }
            }
          } catch (e) {}
        });
      } catch (e) { console.warn('active nav underline failed', e); }
  }, null, '-=0.48');
    
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

    // Fade opacity of .global-nav-links when nav opens
    const globalNavLinks = document.querySelector('.global-nav-links');
    
    if (globalNavLinks) {
      gsap.killTweensOf(globalNavLinks); // Kill any existing tweens before animating
      tl.fromTo(globalNavLinks, 
        { opacity: gsap.getProperty(globalNavLinks, "opacity") }, // Start from current opacity
        {
          opacity: 0,
          duration: 0.3,
          ease: "power2.out",
          onComplete: () => {
            try {
              // onComplete callback
            } catch (e) {}
          }
        }, 0);
    }

    // Fade opacity of .global-footer-shell when nav opens
    const globalFooterShell = document.querySelector('.global-footer-shell');
    
    if (globalFooterShell) {
      gsap.killTweensOf(globalFooterShell); // Kill any existing tweens before animating
      tl.fromTo(globalFooterShell, 
        { opacity: gsap.getProperty(globalFooterShell, "opacity") }, // Start from current opacity
        {
          opacity: 0,
          duration: 0.3,
          ease: "power2.out",
          onComplete: () => {
            try {
              // onComplete callback
            } catch (e) {}
          }
        }, 0);
    }
  }
}

// Remove this function from global.js

// Close the navigation with the same sequence used in the openNav() close branch.
// Returns a Promise that resolves when the close animation completes. Idempotent.
// @param {boolean} skipScrollRefresh - If true, skip ScrollTrigger refresh (used for manual close via x-shell)
function closeNav(skipScrollRefresh = false) {
  // If already animating, return a resolved promise to avoid re-entrancy
  if (navAnimating) return Promise.resolve();
  // If already closed, no-op
  if (!navOpen) return Promise.resolve();

  // Pause ScrollSmoother immediately when closing nav to prevent scroll jumps
  if (smootherInstance && typeof smootherInstance.paused === 'function') {
    try {
      smootherInstance.paused(true);
    } catch (e) {}
  }

  navAnimating = true;
  navOpen = false;

  return new Promise((resolve) => {
    // Hide nav link text and numbers first
    const navLinks = document.querySelectorAll('.takeover-nav-link-txt');
    const navNumbers = document.querySelectorAll('.takeover-nav-num-txt');

    const tl = gsap.timeline({
      onComplete: () => {
        navAnimating = false;
        // Unpause ScrollSmoother after nav closes
        if (smootherInstance && typeof smootherInstance.paused === 'function') {
          try {
            smootherInstance.paused(false);
          } catch (e) {}
        }
        // Refresh ScrollTrigger after nav closes to fix positions (skip if manually closed)
        if (!skipScrollRefresh) {
          requestAnimationFrame(() => {
            try {
              ScrollTrigger.refresh();
            } catch (e) {}
          });
        }
        resolve();
      }
    });

    if (navLinks && navLinks.length) {
      tl.to(navLinks, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in'
      }, 0);
    }

    if (navNumbers && navNumbers.length) {
      tl.to(navNumbers, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in'
      }, 0);
    }

    // Animate takeover logo opacity to 0
    const takeoverLogoClose = document.querySelector('.global-nav-takeover-logo');
    if (takeoverLogoClose) {
      tl.to(takeoverLogoClose, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in'
      }, 0);
    }

    // Fade out any visible underlines at the start of nav close
    const allLines = document.querySelectorAll('.strike-through-line');
    if (allLines && allLines.length) {
      tl.to(allLines, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in'
      }, 0);
    }

    // Then close the nav using the same .global-nav-bg scaleY approach
    const navBgClose = document.querySelector('.global-nav-bg');

    const closeComplete = () => {
      // Clean up split text only after animation completes
      try {
        splitTextInstances.forEach(splitText => {
          splitText.revert();
        });
      } catch (e) {}
      splitTextInstances = [];

      // Reset opacity for nav link text
      try {
        navLinks.forEach(link => {
          gsap.set(link, { opacity: 1 });
        });
      } catch (e) {}
      
      // Ensure takeover logo is set to opacity 0
      const takeoverLogoReset = document.querySelector('.global-nav-takeover-logo');
      if (takeoverLogoReset) {
        gsap.set(takeoverLogoReset, { opacity: 0 });
      }

      // Ensure header nav trigger and its split text are visible after the takeover
      try {
        const headerNavHover = document.querySelector('.nav-hover');
        if (headerNavHover) {
          // Reset nav-hover state and animations
          try {
            // Reset the hover state flag
            isNavHoverActive = false;
            
            // Reset top text characters to default position
            if (navHoverSplit?.chars?.length) {
              gsap.killTweensOf(navHoverSplit.chars);
              gsap.set(navHoverSplit.chars, {
                transform: 'translate3d(0, 0, 0)'
              });
            }
            
            // Reset bottom text characters to default position
            if (navBtmSplit?.chars?.length) {
              gsap.killTweensOf(navBtmSplit.chars);
              gsap.set(navBtmSplit.chars, {
                transform: 'translate3d(0, 0, 0)'
              });
            }
          } catch (e) {}
        }
      } catch (e) {}

      // Hide link shell and x-shell after nav closes to prevent interaction/FOUC
      const linksShellClose = document.querySelector('.takeover-nav-links-shell');
      if (linksShellClose) gsap.set(linksShellClose, { visibility: 'hidden' });
      const xShellClose = document.querySelector('.x-shell');
      if (xShellClose) gsap.set(xShellClose, { visibility: 'hidden' });
    };

    if (!navBgClose) {
      console.warn('closeNav: .global-nav-bg element not found — running cleanup');
      try { closeComplete(); } catch (e) { console.warn('closeComplete failed', e); }
    } else {
      tl.to(navBgClose, {
        scaleY: 0,
        duration: 1,
        ease: 'expo.inOut',
        onComplete: () => {
          // Run the closeComplete
          closeComplete();
        }
      }, 0.0);

      // Fade opacity of .global-nav-links back in as navBgClose animates
      const globalNavLinks = document.querySelector('.global-nav-links');
      if (globalNavLinks) {
        gsap.killTweensOf(globalNavLinks); // Kill any existing tweens before animating
        tl.to(globalNavLinks, {
          opacity: 1,
          duration: 0.6,
          ease: "power2.inOut",
          overwrite: true,
          delay: 0.4
        }, 0); // Start at the same time as navBgClose
      }

      // Fade opacity of .global-footer-shell back in as navBgClose animates
      const globalFooterShell = document.querySelector('.global-footer-shell');
      if (globalFooterShell) {
        gsap.killTweensOf(globalFooterShell); // Kill any existing tweens before animating
        tl.to(globalFooterShell, {
          opacity: 1,
          duration: 0.6,
          ease: "power2.inOut",
          overwrite: true,
          delay: 0.4
        }, 0); // Start at the same time as navBgClose
      }

      // Reset all underline lines when nav closes - just set scaleX to 0, no animations
      try {
        const allLines = document.querySelectorAll('.strike-through-line');
        if (allLines && allLines.length) {
          tl.call(() => {
            allLines.forEach(line => {
              try { gsap.set(line, { scaleX: 0, opacity: 1 }); } catch (e) {}
            });
          }, null, '>');
        }
      } catch (e) {}
    }

    const mainShell = document.querySelector('.main-shell');
    if (mainShell) {
      // Don't kill ScrollSmoother - let it continue running
      
      // Animate from current position (don't set starting position)
      tl.fromTo(mainShell, {
        y: '30%',
        force3D: true
      }, {
        y: '0%',
        duration: 1,
        ease: 'expo.inOut',
        force3D: true
        // Removed clearProps to prevent image jump
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
  });
}

function playLoadingAnimation() {
  console.log('[loader] playLoadingAnimation start');
  
  // Hide project indicators immediately to prevent flashing during initial load
  const indicatorShells = document.querySelectorAll('.indicator-item-shell');
  if (indicatorShells.length) {
    try {
      gsap.killTweensOf(indicatorShells);
      gsap.set(indicatorShells, { x: -150, autoAlpha: 0 });
    } catch (e) {}
  }
  
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
    tl.fromTo(
      transLogoShell,
      {
        opacity: 0,
        filter: 'blur(40px)'
      },
      {
        opacity: 1,
        filter: 'blur(0px)',
        duration: 1.4,
        ease: "power4.out",
        onComplete: () => {
          console.log('[loader] logo animation complete — resetting scroll');
          // Use smoother if available; fallback to native scrollTo
          try {
            if (smootherInstance && typeof smootherInstance.scrollTo === 'function') {
              try { smootherInstance.scrollTo(0, false); } catch (e) {}
            } else {
              try { window.scrollTo(0, 0); } catch (e) {}
            }
          } catch (e) {}
        }
      }
    );
  }

  tl.call(() => console.log('[loader] playLoadingAnimation timeline running'));

  // Animate spacer and img-shell widths in parallel, after logo anim
  tl.to(transSpacer, {
    width: '8vw',
    duration: 0.8,
    ease: "expo.inOut"
  }, "-=0.3");

  tl.to(transImgShell, {
    width: '6.8vw',
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
        // Determine which animation to play based on the page
        if (window.location.pathname === '/' || window.location.pathname.includes('home')) {
          if (typeof window.playHomeEnterAnimation === 'function') {
            window.playHomeEnterAnimation();
          }
        } else if (window.location.pathname.includes('about')) {
          if (typeof window.playAboutEnterAnimation === 'function') {
            window.playAboutEnterAnimation();
          }
        } else if (window.location.pathname.includes('work')) {
          if (typeof window.playWorkEnterAnimation === 'function') {
            window.playWorkEnterAnimation();
          }
        } else if (window.location.pathname.includes('projects')) {
          if (typeof window.playProjectEnterAnimation === 'function') {
            window.playProjectEnterAnimation();
          }
        } else {
          // Default animation or no-op
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
    
    // Setup close nav handler for x-shell
    const closeButton = e.target.closest('.x-shell');
    if (closeButton) {
      closeNav(true); // Skip ScrollTrigger refresh when manually closing
      e.preventDefault();
    }
  });
  // Add hover/focus interactions for takeover nav links: animate the strike-through line
  try {
    const takeoverLinks = document.querySelectorAll('.takeover-nav-link');
    if (takeoverLinks && takeoverLinks.length) {
      takeoverLinks.forEach(link => {
        const line = link.querySelector('.strike-through-line');
        
        // Only setup hover/focus for links with strike-through lines
        if (line) {
          // start collapsed with full opacity
          gsap.set(line, { transformOrigin: 'left center', scaleX: 0, opacity: 1, force3D: true });

          const enter = () => {
            try {
              // Don't trigger hover if nav is animating
              if (navAnimating) return;
              
              // If this link's container is already marked active, skip hover animation
              const container = link.closest('.takeover-nav-link');
              if (container && container.classList.contains('active')) return;
              gsap.killTweensOf(line);
              gsap.set(line, { transformOrigin: 'left center' });
              gsap.to(line, { scaleX: 1, duration: 0.4, ease: 'expo.out' });
            } catch (e) {}
          };

          const leave = () => {
            try {
              // Don't trigger hover if nav is animating
              if (navAnimating) return;
              
              // If this link's container is marked active, don't collapse the underline
              const container = link.closest('.takeover-nav-link');
              if (container && container.classList.contains('active')) return;
              gsap.killTweensOf(line);
              // keep the same transform origin (left) when collapsing
              gsap.set(line, { transformOrigin: 'left center' });
              gsap.to(line, { scaleX: 0, duration: 1, ease: 'expo.in' });
            } catch (e) {}
          };

          link.addEventListener('mouseenter', enter);
          link.addEventListener('mouseleave', leave);
          // keyboard accessibility
          link.addEventListener('focus', enter);
          link.addEventListener('blur', leave);
        }
        
        // Click handler applies to ALL takeover-nav-link elements (with or without strike-through)
        // This allows the logo to trigger page transitions
        link.addEventListener('click', async (ev) => {
          try {
            const container = link.closest('.takeover-nav-link');
            if (!container) return;
            
            // Get the href to check if we're already on that page
            const anchor = container.matches('a[href]') ? container : container.querySelector('a[href]');
            if (!anchor) return;
            
            let targetPath = '';
            try {
              targetPath = new URL(anchor.href, window.location.origin).pathname.replace(/\/+$/, '');
            } catch (e) {
              targetPath = anchor.getAttribute('href') || '';
            }
            if (!targetPath) targetPath = '/';
            
            let currentPath = window.location.pathname.replace(/\/+$/, '');
            if (!currentPath) currentPath = '/';
            
            // If we're already on the target page, prevent navigation and close nav
            if (currentPath === targetPath) {
              try { 
                ev.preventDefault(); 
                ev.stopImmediatePropagation(); 
                closeNav(); // Close the nav when clicking current page
              } catch (e) {}
              return;
            }
            
            // For all links (including logo), mark the target as active
            // Find the actual nav link that matches the target path
            const allNavLinks = document.querySelectorAll('.takeover-nav-link');
            let targetContainer = null;
            
            allNavLinks.forEach(navLink => {
              const navAnchor = navLink.matches('a[href]') ? navLink : navLink.querySelector('a[href]');
              if (!navAnchor) return;
              
              let navPath = '';
              try {
                navPath = new URL(navAnchor.href, window.location.origin).pathname.replace(/\/+$/, '');
              } catch (e) {
                navPath = navAnchor.getAttribute('href') || '';
              }
              if (!navPath) navPath = '/';
              
              if (navPath === targetPath) {
                targetContainer = navLink;
              }
            });
            
            // Mark the target container as active (this will animate underlines)
            // If we're clicking on a link that has an underline, we need custom handling
            if (targetContainer && line && container === targetContainer) {
              // This is a direct click on a nav link with an underline
              // Manually handle the animation so the clicked link collapses from right
              const prev = document.querySelector('.takeover-nav-link.active');
              
              if (prev && prev !== targetContainer) {
                // Animate the old active link out from left (normal)
                prev.classList.remove('active');
                const prevAnchor = prev.matches('a[href]') ? prev : prev.querySelector('a[href]');
                if (prevAnchor) prevAnchor.removeAttribute('aria-current');
                const prevLine = prev.querySelector('.strike-through-line');
                animateUnderlineOut(prevLine, { mode: 'scale', origin: 'left' });
              }
              
              // Animate the clicked link out from right (opposite direction)
              targetContainer.classList.add('active');
              const newAnchor = targetContainer.matches('a[href]') ? targetContainer : targetContainer.querySelector('a[href]');
              if (newAnchor) newAnchor.setAttribute('aria-current', 'page');
              animateUnderlineOut(line, { mode: 'scale', origin: 'right' });
            } else if (targetContainer) {
              // For logo clicks or other cases, use normal setActiveContainer
              setActiveContainer(targetContainer, { mode: 'scale' });
            }
          } catch (e) {}
        });
      });
    }
  } catch (e) { console.warn('takeover link hover init failed', e); }
  
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
  navBtmSplit = null;
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




window.playProjectEnterAnimation = function(data) {
    console.log('Project Page enter animation triggered');
    
    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      const projectInfoHeader = document.querySelector('.proj-rich-headline-shell');
      
      if (!projectInfoHeader) {
        console.log('proj-rich-headline-shell not found, skipping animation');
        return;
      }
      
      // Check if element is already wrapped (from previous navigation)
      const existingWrapper = projectInfoHeader.parentElement;
      const isAlreadyWrapped = existingWrapper && 
                               existingWrapper.tagName === 'SPAN' && 
                               existingWrapper.style.overflow === 'hidden';
      
      if (!isAlreadyWrapped) {
        // Create a wrapper parent with overflow hidden for bottom-up animation
        const txtWrapper = document.createElement('span');
        txtWrapper.style.overflow = 'hidden';
        txtWrapper.style.width = '100%';
        txtWrapper.style.display = 'inline-block';
        txtWrapper.style.verticalAlign = 'bottom';
        // Insert txtWrapper before the text element and move the text inside
        projectInfoHeader.parentNode.insertBefore(txtWrapper, projectInfoHeader);
        txtWrapper.appendChild(projectInfoHeader);
      }

      let projectSplit = null;
      try {
        projectSplit = new SplitText(projectInfoHeader, { type: "chars", position: "relative" });
      } catch (error) {
        console.error('SplitText error (proj-rich-headline-shell):', error);
      }
      if (projectSplit?.chars?.length) {
        gsap.set(projectSplit.chars, { transform: 'translate3d(0,100%,0)'});
        gsap.to(projectSplit.chars, {
          transform: 'translate3d(0,0%,0)',
          duration: 1,
          ease: "expo.out",
          stagger: 0.015,
          delay: 0.5,
          overwrite: "auto"
        });
      }
    });
  };
  window.playWorkEnterAnimation = function(data) {
    console.log('Work Page enter animation triggered');
    
    // Determine delay based on whether this is a Barba transition or initial page load
    const isBarbaTransition = data !== undefined;
    const animationDelay = isBarbaTransition ? 0.95 : 0.5;
    const wordStagger = 0.05;
    
    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      const workHeader = document.querySelector('.proj-rich-headline-shell');
      
      if (!workHeader) {
        console.log('proj-rich-headline-shell not found, skipping animation');
        return;
      }
      
      // Target the child element (h2, p, etc.) within the rich text, not the rich text wrapper itself
      const richTextChild = workHeader.querySelector('h1, h2, h3, h4, h5, h6, p');
      
      if (!richTextChild) {
        console.log('No child element found in proj-rich-headline-shell, skipping animation');
        return;
      }
      
      // Check if element is already wrapped (from previous navigation)
      const existingWrapper = richTextChild.parentElement;
      const isAlreadyWrapped = existingWrapper && 
                               existingWrapper.tagName === 'SPAN' && 
                               existingWrapper.style.overflow === 'hidden';
      
      if (!isAlreadyWrapped) {
        // Create a wrapper parent with overflow hidden for bottom-up animation
        const txtWrapper = document.createElement('span');
        txtWrapper.style.overflow = 'hidden';
        txtWrapper.style.width = '100%';
        txtWrapper.style.display = 'inline-block';
        txtWrapper.style.verticalAlign = 'bottom';
        // Insert txtWrapper before the text element and move the text inside
        richTextChild.parentNode.insertBefore(txtWrapper, richTextChild);
        txtWrapper.appendChild(richTextChild);
      }

      let workSplit = null;
      try {
        workSplit = new SplitText(richTextChild, { 
          type: "words"
        });
      } catch (error) {
        console.error('SplitText error (proj-rich-headline-shell):', error);
      }
      if (workSplit?.words?.length) {
        gsap.set(workSplit.words, { 
          transform: 'translate3d(0,100%,0)'
        });
        gsap.to(workSplit.words, {
          transform: 'translate3d(0,0%,0)',
          duration: 1,
          ease: "expo.out",
          stagger: wordStagger,
          delay: animationDelay,
          overwrite: "auto"
        });
      }
    });
  };
  window.playHomeEnterAnimation = function(data) {
    console.log('Home Page enter animation triggered');
    
  };
  window.playFormulaEnterAnimation = function(data) {
    console.log('Formula Page enter animation triggered');
    // Scaffold: implement page-specific enter animation for the formula page here.
    // Example: find header and animate chars using SplitText similar to work/project pages.
  };