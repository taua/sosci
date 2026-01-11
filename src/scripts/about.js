import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import horizontalLoop from "./horizontalLoop";

gsap.registerPlugin(ScrollTrigger, SplitText);

export function initAboutPage() {
  console.log('About page JS loaded!');

  try {
    const aboutTickerCleanups = [];
    document.querySelectorAll('.formula-scroll-txt-shell').forEach((shell, index) => {
      // try the common ticker item selectors used elsewhere
      let txts = shell.querySelectorAll('.home-project-txt, .science-project-txt, [data-ticker-item]');
      if (!txts || txts.length === 0) {
        const children = Array.from(shell.children || []);
        const candidates = children.filter(el => {
          try {
            const tag = (el.tagName || '').toLowerCase();
            if (tag === 'script' || tag === 'svg' || tag === 'canvas') return false;
            const txt = (el.textContent || '').trim();
            return txt.length > 0 || el.querySelector && el.querySelector('img,svg');
          } catch (e) { return false; }
        });
        if (candidates.length) txts = candidates;
      }
      if (!txts || txts.length === 0) {
        try { console.debug('[about] no ticker items found in shell:', shell); } catch (e) {}
        return;
      }

      const initialDirection = index % 2 === 0 ? 1 : -1;
      const cleanup = introTicker(txts, shell, initialDirection);
      if (typeof cleanup === 'function') aboutTickerCleanups.push(cleanup);
    });

    // expose cleanup for the about page so page transitions can remove them
    window._aboutTickerCleanup = () => {
      try { aboutTickerCleanups.forEach(fn => { try { fn(); } catch (e) {} }); } catch (e) {}
    };
  } catch (e) { /* ignore */ }

  // Animate manifesto text words on scroll using GSAP SplitText (same as home)
  const manifesto = document.querySelector('.manifesto-txt');
  if (manifesto) {
    // Only split once
    if (!manifesto.classList.contains('split')) {
      try {
        const split = new SplitText(manifesto, { type: 'words' });
        manifesto.classList.add('split');
        // Animate words
        gsap.set(split.words, { color: '#2f2f2fff', display: 'inline', whiteSpace: 'normal' });
        gsap.to(split.words, {
          color: '#fff',
          stagger: 0.05,
          duration: 0.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.manifesto-shell',
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: true,
          }
        });
      } catch (e) {
        // If SplitText isn't available or errors, fail silently
        try { console.warn('manifesto split failed', e); } catch (ee) {}
      }
    }
  }

  // Number pillars blocks (format: "01 /", "02 /")
  try {
    const elems = Array.from(document.querySelectorAll('.pillars-num-txt'));
    if (elems && elems.length) {
      const total = elems.length;
      const padLen = Math.max(2, String(total).length);
      elems.forEach((el, i) => {
        try {
          const n = String(i + 1).padStart(padLen, '0');
          // set as number + space + slash (match example)
          el.innerHTML = `${n} /`;
        } catch (e) {}
      });
    }
  } catch (e) {}

  // Animate experience logo shells on scroll (triggered by parent)
  const logoGridParents = document.querySelectorAll('.logos-grid-parent');
  if (logoGridParents && logoGridParents.length) {
    logoGridParents.forEach((parent) => {
      const childLogos = parent.querySelectorAll('.experience-logo-shell');
      const leftShells = parent.querySelectorAll('.experience-left-shell');
      
      // Set initial state for all elements
      gsap.set([...childLogos, ...leftShells], { yPercent: 100, opacity: 0 });
      
      // Animate left shells first
      if (leftShells && leftShells.length) {
        gsap.to(leftShells, {
          yPercent: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'expo.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: parent,
            start: 'top 75%',
            once: true
          }
        });
      }
      
      // Then animate logos with a delay
      if (childLogos && childLogos.length) {
        gsap.to(childLogos, {
          yPercent: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'expo.out',
          stagger: 0.1,
          delay: 0.3,
          scrollTrigger: {
            trigger: parent,
            start: 'top 75%',
            once: true
          }
        });
      }
    });
  }
}

window.initPageTransitions = function() {
  // Your page-specific GSAP intro animation here
  console.log('Project Page transition animation triggered');
};

export function cleanupAboutPage() {
  // cleanup any tickers created here
  try {
    if (typeof window._aboutTickerCleanup === 'function') {
      try { window._aboutTickerCleanup(); } catch (e) {}
      window._aboutTickerCleanup = null;
    }
  } catch (e) {}
}

// Ticker function adapted from home/formula
function introTicker(txtNodes, shell, initialDirection = 1) {
  const baseSpeed = 1.2;
  const maxSpeed = 8;
  const velocityMult = 0.005;

  const heroLoop = horizontalLoop(txtNodes, {
    repeat: -1,
    speed: baseSpeed,
    reversed: initialDirection < 0
  });

  const absBaseSpeed = Math.abs(baseSpeed);
  heroLoop.timeScale(absBaseSpeed);

  let scrollTimeout;
  let currentDirection = initialDirection;

  const pauseLoop = () => {
    gsap.killTweensOf(heroLoop);
    heroLoop.pause();
  };

  const resumeLoop = () => {
    heroLoop.resume();
    heroLoop.timeScale(absBaseSpeed);
  };

  const st = ScrollTrigger.create({
    trigger: shell,
    start: "top+=20% bottom",
    end: "bottom-=20% top",
    onUpdate: ({ isActive, getVelocity }) => {
      if (!isActive) {
        pauseLoop();
        return;
      }

      gsap.killTweensOf(heroLoop);

      const scrollVelocity = getVelocity();
      if (Math.abs(scrollVelocity) > 0.5) {
        const scrollDirection = Math.sign(scrollVelocity);
        const effectiveDirection = initialDirection < 0 ? -scrollDirection : scrollDirection;
        currentDirection = effectiveDirection;

        const boostAmount = Math.min(Math.abs(scrollVelocity * velocityMult), maxSpeed);
        const effectiveSpeed = absBaseSpeed + (Math.abs(effectiveDirection) * boostAmount);

        heroLoop.timeScale(effectiveSpeed * Math.sign(effectiveDirection));
      }

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        gsap.to(heroLoop, {
          timeScale: absBaseSpeed * Math.sign(currentDirection),
          duration: 0.5,
          ease: "power1.out",
          overwrite: true
        });
      }, 150);
    },
    onLeave: pauseLoop,
    onEnter: resumeLoop,
    onLeaveBack: pauseLoop,
    onEnterBack: resumeLoop
  });

  return () => {
    clearTimeout(scrollTimeout);
    try { st && st.kill && st.kill(); } catch (e) {}
    gsap.killTweensOf(heroLoop);
    try { heroLoop.kill && heroLoop.kill(); } catch (e) {}
  };
}