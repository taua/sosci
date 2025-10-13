import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import horizontalLoop from "./horizontalLoop";

gsap.registerPlugin(ScrollTrigger);

let _vennSVG = null;
let _vennTL = null;
let _vennClonedVideo = null;
let _vennCanvas = null;
let _vennCanvasRAF = null;

export function initSciencePage() {
  console.log('Formula page JS loaded!');
  try {
    createVennCircles();
  } catch (e) {
    console.error('Failed to init venn circles:', e);
  }

  // Initialize project tickers on the science page using the same behavior
  // as the homepage. Targets use the same class `.home-project-scroll-txt-shell`.
  try {
    const scienceTickerCleanups = [];
    document.querySelectorAll('.home-project-scroll-txt-shell, .science-scroll-txt-shell').forEach((shell, index) => {
      // Try common selectors first (homepage naming and the science page naming)
      let txts = shell.querySelectorAll('.home-project-txt, .science-project-txt, [data-ticker-item]');
      // Fallback: if no explicit items found, use direct children that look like ticker items
      if (!txts || txts.length === 0) {
        const children = Array.from(shell.children || []);
        // Filter out elements that are clearly not visual/text items (e.g., script, svg, empty)
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
        // No ticker items found — log for debugging and skip
        try { console.debug('[formula] no ticker items found in shell:', shell); } catch (e) {}
        return;
      }

      const initialDirection = index % 2 === 0 ? 1 : -1;
      const cleanup = introTicker(txts, shell, initialDirection);
      if (typeof cleanup === 'function') scienceTickerCleanups.push(cleanup);
    });
    // expose cleanup so cleanupSciencePage can remove effects when navigating away
    window._scienceTickerCleanup = () => {
      try {
        scienceTickerCleanups.forEach(fn => { try { fn(); } catch (e) {} });
      } catch (e) {}
    };
  } catch (e) { /* ignore */ }
}

window.initPageTransitions = function() {
  // Your page-specific GSAP intro animation here
  console.log('Science Page transition animation triggered');
};

export function cleanupSciencePage() {
  // Remove SVG and kill timeline/scrolltrigger
  try {
    if (_vennTL) {
      try { _vennTL.scrollTrigger && _vennTL.scrollTrigger.kill(); } catch (e) {}
      try { _vennTL.kill(); } catch (e) {}
      _vennTL = null;
    }
    if (_vennSVG && _vennSVG.parentNode) {
      _vennSVG.parentNode.removeChild(_vennSVG);
      _vennSVG = null;
    }
    if (_vennClonedVideo && _vennClonedVideo.parentNode) {
      try { _vennClonedVideo.parentNode.removeChild(_vennClonedVideo); } catch (e) {}
      _vennClonedVideo = null;
    }
    if (_vennCanvas) {
      try { cancelAnimationFrame(_vennCanvasRAF); } catch (e) {}
      try { _vennCanvas.parentNode && _vennCanvas.parentNode.removeChild(_vennCanvas); } catch (e) {}
      _vennCanvas = null;
      _vennCanvasRAF = null;
    }
  } catch (e) { console.warn('cleanupSciencePage failed', e); }

  // Cleanup any project tickers initialized for the science page
  try {
    if (typeof window._scienceTickerCleanup === 'function') {
      try { window._scienceTickerCleanup(); } catch (e) {}
      window._scienceTickerCleanup = null;
    }
  } catch (e) {}
}

// Ticker function copied/adapted from home.js so science page tickers behave the same
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

function createVennCircles() {
  const shell = document.querySelector('.venn-shell');
  if (!shell) {
    console.warn('.venn-shell not found — skipping venn init');
    return;
  }

  // Get shell bounds to size SVG
  const bounds = shell.getBoundingClientRect();
  const width = Math.max(300, Math.round(bounds.width));
  const height = Math.max(200, Math.round(bounds.height));

  // Create SVG overlay positioned absolutely inside the shell
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.style.position = 'absolute';
  svg.style.left = '0';
  svg.style.top = '0';
  // ensure svg overlays above any canvas/video we insert
  svg.style.zIndex = '2';
  svg.style.pointerEvents = 'none';
  svg.style.overflow = 'visible';

  // Two circles: left and right
  const left = document.createElementNS(svgNS, 'circle');
  const right = document.createElementNS(svgNS, 'circle');

  // Starting positions (percent-based inside viewBox) - push them further to the edges
  const cxLeft = Math.round(width * 0.12);
  const cxRight = Math.round(width * 0.88);
  const cy = Math.round(height * 0.5);

  // Compute base and target radius (make circles 15% smaller than base)
  const baseR = Math.round(Math.min(width, height) * 0.38);
  const targetR = Math.round(baseR * 0.85);

  // Initial radius (debug = set to target so circles are visible immediately)
  left.setAttribute('cx', cxLeft);
  left.setAttribute('cy', cy);
  left.setAttribute('r', targetR);
  // pick colors based on shell/background luminance so debug visuals are visible
  const bgColor = window.getComputedStyle(shell).backgroundColor || window.getComputedStyle(document.body).backgroundColor || 'rgb(255,255,255)';
  const pickColors = (bg) => {
    // parse `rgb(a)?(...)`
    try {
      const nums = bg.replace(/[^0-9.,]/g, '').split(',').map(n => parseFloat(n));
      const r = nums[0] || 255, g = nums[1] || 255, b = nums[2] || 255;
      // relative luminance approximation
      const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
      const darkBg = lum < 0.5;
      // Use white outlines and a dotted stroke for both light and dark backgrounds.
      // Small dots are achieved with a short dash length and spacing, plus round line caps.
      if (darkBg) {
  return { fill: 'rgba(255,255,255,0.06)', stroke: '#ffffff', lensFill: 'rgba(255,255,255,0.08)', strokeDash: '1 7', strokeW: 2 };
      }
  return { fill: 'rgba(0,100,255,0.12)', stroke: '#ffffff', lensFill: 'rgba(255,0,0,0.12)', strokeDash: '1 7', strokeW: 2 };
    } catch (e) {
  return { fill: 'rgba(0,100,255,0.12)', stroke: '#0366d6', lensFill: 'rgba(255,0,0,0.12)', strokeDash: '6 6', strokeW: 2 };
    }
  };
  const colors = pickColors(bgColor);
  // Do not fill the circles so they don't block the video — keep stroke for visual guide
  left.setAttribute('fill', 'none');
  left.setAttribute('stroke', colors.stroke);
  left.setAttribute('stroke-dasharray', colors.strokeDash);
  left.setAttribute('stroke-width', colors.strokeW);
  // round caps make short dash lengths look like dots
  left.setAttribute('stroke-linecap', 'round');
  // make the outline 50% opaque
  left.setAttribute('stroke-opacity', '0.8');

  right.setAttribute('cx', cxRight);
  right.setAttribute('cy', cy);
  right.setAttribute('r', targetR);
  right.setAttribute('fill', 'none');
  right.setAttribute('stroke', colors.stroke);
  right.setAttribute('stroke-dasharray', colors.strokeDash);
  right.setAttribute('stroke-width', colors.strokeW);
  // round caps make short dash lengths look like dots
  right.setAttribute('stroke-linecap', 'round');
  // make the outline 50% opaque
  right.setAttribute('stroke-opacity', '0.8');

  svg.appendChild(left);
  svg.appendChild(right);

  // Create defs & clipPath for the lens intersection and a path to hold it
  const defs = document.createElementNS(svgNS, 'defs');
  const clipPath = document.createElementNS(svgNS, 'clipPath');
  clipPath.setAttribute('id', 'venn-clip');
  clipPath.setAttribute('clipPathUnits', 'userSpaceOnUse');
  const lensPath = document.createElementNS(svgNS, 'path');
  lensPath.setAttribute('d', '');
  // visible for debug; set to '#000' or 'none' for production
  lensPath.setAttribute('fill', colors.lensFill || 'rgba(255,0,0,0.12)');
  clipPath.appendChild(lensPath);
  defs.appendChild(clipPath);
  // Also create an SVG mask as a fallback — masks sometimes render where clipPath does not
  const maskEl = document.createElementNS(svgNS, 'mask');
  maskEl.setAttribute('id', 'venn-mask');
  maskEl.setAttribute('maskUnits', 'userSpaceOnUse');
  // a black rect background (masked-out area)
  const maskBg = document.createElementNS(svgNS, 'rect');
  maskBg.setAttribute('x', '0');
  maskBg.setAttribute('y', '0');
  maskBg.setAttribute('width', String(width));
  maskBg.setAttribute('height', String(height));
  maskBg.setAttribute('fill', '#000');
  const maskPath = document.createElementNS(svgNS, 'path');
  maskPath.setAttribute('d', '');
  // white path shows through the mask
  maskPath.setAttribute('fill', '#fff');
  maskEl.appendChild(maskBg);
  maskEl.appendChild(maskPath);
  defs.appendChild(maskEl);
  svg.appendChild(defs);

  // Ensure the shell is positioned so the absolute SVG overlays correctly
  const prevPosition = window.getComputedStyle(shell).position;
  if (prevPosition === 'static' || !prevPosition) {
    try { shell.style.position = 'relative'; } catch (e) {}
  }

  // Append svg to shell
  shell.appendChild(svg);
  _vennSVG = svg;

  // Locate user-provided label shells (prefer existing DOM nodes created in Webflow)
  let leftLabel = null;
  let rightLabel = null;
  try {
    leftLabel = shell.querySelector('.venn-txt-shell-left');
    rightLabel = shell.querySelector('.venn-txt-shell-right');
    [leftLabel, rightLabel].forEach(el => {
      if (!el) return;
      try {
        // ensure centering transform so (left,top) map the element's center to the coord
        el.style.position = el.style.position || 'absolute';
        el.style.transform = el.style.transform || 'translate(-50%,-50%)';
        el.style.pointerEvents = 'none';
        el.style.zIndex = el.style.zIndex || '3';
      } catch (e) {}
    });
  } catch (e) {}

  // Clone a page video into the shell (if present) to ensure we can apply clip/mask
  try {
    const pageVideo = document.querySelector('video');
    if (pageVideo && !pageVideo.closest('.venn-shell')) {
  const clone = pageVideo.cloneNode(true);
  // Ensure autoplay will be permitted (muted) and attributes are explicit
  try { clone.muted = true; } catch (e) {}
  try { clone.setAttribute('muted', ''); } catch (e) {}
  try { clone.autoplay = true; } catch (e) {}
  try { clone.setAttribute('autoplay', ''); } catch (e) {}
  try { clone.loop = true; } catch (e) {}
  try { clone.setAttribute('loop', ''); } catch (e) {}
  try { clone.playsInline = true; } catch (e) {}
  try { clone.setAttribute('playsinline', ''); } catch (e) {}
  try { clone.setAttribute('preload', 'auto'); } catch (e) {}
  clone.style.position = 'absolute';
  clone.style.left = '0';
  clone.style.top = '0';
  clone.style.width = '100%';
  clone.style.height = '100%';
  clone.style.objectFit = 'cover';
  clone.style.zIndex = '1';
  clone.style.pointerEvents = 'none';
  clone.style.opacity = '1';
  try { shell.insertBefore(clone, svg); } catch (e) { shell.appendChild(clone); }
  // Try to start playback; some browsers require play() call even if autoplay attribute present
  try { const p = clone.play(); if (p && p.catch) p.catch(() => {}); } catch (e) {}
  _vennClonedVideo = clone;
      // Try to start the original page video as well (may be the source)
      try {
        const p = pageVideo.play();
        if (p && p.catch) p.catch(() => {
          // try muting and playing again
          try { pageVideo.muted = true; pageVideo.setAttribute('muted',''); } catch (e) {}
          try { pageVideo.play().catch(() => {}); } catch (e) {}
        });
      } catch (e) {}
      // ensure the clone plays
      try { const p2 = clone.play(); if (p2 && p2.catch) p2.catch(() => {}); } catch (e) {}
      // if autoplay is blocked, resume on first user interaction
      const ensurePlay = (v) => {
        try { v.play().catch(() => {}); } catch (e) {}
      };
      const resumeOnGesture = () => {
        try { ensurePlay(pageVideo); ensurePlay(clone); } catch (e) {}
      };
      document.addEventListener('click', resumeOnGesture, { once: true });
    }
  } catch (e) {}

  // Canvas fallback: draw frames from an existing video (inside shell) into a canvas
  try {
  const pageVid = shell.querySelector('video');
    if (pageVid) {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.style.position = 'absolute';
      canvas.style.left = '0';
      canvas.style.top = '0';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.zIndex = '1';
      canvas.style.pointerEvents = 'none';
      try { shell.insertBefore(canvas, svg); } catch (e) { shell.appendChild(canvas); }
      _vennCanvas = canvas;
      const ctx = canvas.getContext('2d');
      // Ensure the shell video is playing; try to play and fallback to muting if blocked
      try {
        const playPromise = pageVid.play();
        if (playPromise && playPromise.catch) playPromise.catch(() => {
          try { pageVid.muted = true; pageVid.setAttribute('muted',''); } catch (e) {}
          try { pageVid.play().catch(() => {}); } catch (e) {}
        });
      } catch (e) {}
      document.addEventListener('click', () => { try { pageVid.play().catch(() => {}); } catch (e) {} }, { once: true });
      // draw loop: compute a minimal scale so the drawn video fully covers the lens
      const draw = () => {
        try {
          if (pageVid && pageVid.readyState >= 2) {
            ctx.clearRect(0,0,canvas.width,canvas.height);
            const vw = pageVid.videoWidth || pageVid.clientWidth || canvas.width;
            const vh = pageVid.videoHeight || pageVid.clientHeight || canvas.height;
            // compute minimal scale from lens polygon bbox so we don't reveal edges
            let autoScale = 0.75; // fallback default
            try {
              const poly = lensPolygonPoints(params.lx, params.cy, params.lr, params.rx, params.cy, params.rr, 28);
              if (poly && poly.length) {
                let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
                for (let p of poly) {
                  if (p.x < minX) minX = p.x;
                  if (p.y < minY) minY = p.y;
                  if (p.x > maxX) maxX = p.x;
                  if (p.y > maxY) maxY = p.y;
                }
                const bboxW = Math.max(1, (maxX - minX));
                const bboxH = Math.max(1, (maxY - minY));
                const minScaleW = bboxW / canvas.width;
                const minScaleH = bboxH / canvas.height;
                const minScale = Math.max(minScaleW, minScaleH);
                // add a small safety margin to avoid crisp-edge reveals
                autoScale = Math.min(1, minScale * 1.03);
                // ensure not tiny
                autoScale = Math.max(autoScale, 0.2);
              }
            } catch (e) {
              autoScale = 0.75;
            }
            const destW = Math.round(canvas.width * autoScale);
            const destH = Math.round(canvas.height * autoScale);
            const dx = Math.round((canvas.width - destW) / 2);
            const dy = Math.round((canvas.height - destH) / 2);
            try {
              ctx.drawImage(pageVid, 0, 0, vw, vh, dx, dy, destW, destH);
            } catch (e) {
              // fallback to simple draw if dimension mapping fails
              try { ctx.drawImage(pageVid, dx, dy, destW, destH); } catch (e) {}
            }
          }
        } catch (e) {}
        _vennCanvasRAF = requestAnimationFrame(draw);
      };
      _vennCanvasRAF = requestAnimationFrame(draw);
    }
  } catch (e) {}

  // Visible debug overlay (helps when console is muted globally)
  const DEBUG_OVLY = false; // set true to enable
  let debugEl = null;
  if (DEBUG_OVLY) {
    debugEl = document.createElement('div');
    debugEl.style.position = 'absolute';
  debugEl.style.right = '12px';
  // move below the site's nav/header so text isn't obscured
  debugEl.style.top = '80px';
  debugEl.style.padding = '6px 8px';
  debugEl.style.background = 'rgba(0,0,0,0.65)';
  debugEl.style.color = '#fff';
  debugEl.style.fontFamily = 'monospace';
  debugEl.style.fontSize = '11px';
  debugEl.style.zIndex = 9999;
  debugEl.style.pointerEvents = 'none';
  debugEl.style.whiteSpace = 'pre-wrap';
  debugEl.style.maxWidth = 'calc(100% - 160px)';
  debugEl.style.overflow = 'hidden';
  debugEl.textContent = 'venn: initializing...';
    // append to shell (not svg) so HTML can render
    try { shell.appendChild(debugEl); } catch (e) {}
  }

  // Target radius is computed above (baseR/targetR) and used for params

  // Build a timeline controlled by scroll
  // Since the shell is full-viewport (100vh), when its top reaches the top of the
  // viewport it is fully visible. Pin it there and run the animation while pinned.
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: shell,
      start: 'top top',    // start when shell is fully in view (top aligned)
      end: '+=100%',       // pin for one viewport worth of scrolling
      pin: true,
      // Scrub the timeline so the animation progress follows the user's scroll
      scrub: 0.6,
      markers: false
    }
  });
  // Param object we will animate (and use to update circles + lens)
  // We'll keep radii constant and animate only horizontal positions so circles slide toward each other
  const params = {
    lx: cxLeft,
    rx: cxRight,
    cy: cy,
    lr: targetR,
    rr: targetR
  };

  // distance in pixels between the visible stroke and the video mask
  const maskCushion = 2;

  const updateShapes = () => {
    try {
      left.setAttribute('cx', Math.round(params.lx));
      left.setAttribute('cy', Math.round(params.cy));
      left.setAttribute('r', Math.round(params.lr));
      right.setAttribute('cx', Math.round(params.rx));
      right.setAttribute('cy', Math.round(params.cy));
      right.setAttribute('r', Math.round(params.rr));

      // Position HTML labels (if present) to the circle centers. We map viewBox
      // coordinates -> percent so absolutely-positioned divs inside `shell` align.
      try {
        if (leftLabel) {
          leftLabel.style.left = `${(params.lx / width * 100).toFixed(4)}%`;
          leftLabel.style.top = `${(params.cy / height * 100).toFixed(4)}%`;
        }
        if (rightLabel) {
          rightLabel.style.left = `${(params.rx / width * 100).toFixed(4)}%`;
          rightLabel.style.top = `${(params.cy / height * 100).toFixed(4)}%`;
        }
      } catch (e) {}

  // compute lens path and set it on lensPath
  // shrink the radii by half the stroke width plus a small cushion so the dotted
  // stroke does not overlap the revealed video area.
  const insetLr = Math.max(0, params.lr - ((colors && colors.strokeW ? colors.strokeW : 2) / 2) - maskCushion);
  const insetRr = Math.max(0, params.rr - ((colors && colors.strokeW ? colors.strokeW : 2) / 2) - maskCushion);
  const d = lensPathForCircles(params.lx, params.cy, insetLr, params.rx, params.cy, insetRr);
      lensPath.setAttribute('d', d || '');

      // apply clipPath to the .venn-video-shell parent (more robust with background-cover videos)
      const videoShellEl = document.querySelector('.venn-video-shell');
      const videoEl = videoShellEl ? videoShellEl.querySelector('video') : null;
      // find the deepest visible element that likely contains the visual (video or background-image)
      const findVisualTarget = (root) => {
        if (!root) return null;
        // prefer an actual video element
        const vid = root.querySelector('video');
        if (vid) return vid;
        // if the root itself has a background image, use it
        try {
          const csRoot = getComputedStyle(root);
          if (csRoot && csRoot.backgroundImage && csRoot.backgroundImage !== 'none') return root;
        } catch (e) {}
        // otherwise search children for a background image
        const walker = root.querySelectorAll('*');
        for (let i = 0; i < walker.length; i++) {
          try {
            const el = walker[i];
            const cs = getComputedStyle(el);
            if (cs && cs.backgroundImage && cs.backgroundImage !== 'none') return el;
          } catch (e) {}
        }
        return root;
      };
  // Prefer the canvas as the visual target if it exists (we draw frames there)
  const visualTarget = _vennCanvas || findVisualTarget(videoShellEl) || videoShellEl;
      // prefer a full-URL reference which is more reliable across browsers
      const frag = '#venn-clip';
      const localRef = `url(${frag})`;
      const fullRef = (() => {
        try { return `url(${location.href.replace(/#.*$/, '')}${frag})`; } catch (e) { return localRef; }
      })();

      const applyRef = (el) => {
        try {
          el.style.clipPath = fullRef;
          el.style.webkitClipPath = fullRef;
          // also try the local ref as a fallback
          // some browsers accept one or the other
          // (setting both is fine)
          el.style.clipPath = el.style.clipPath || localRef;
          el.style.webkitClipPath = el.style.webkitClipPath || localRef;
          el.style.overflow = 'hidden';
        } catch (e) {}
      };

      // Apply clip/mask to the visual target (video element or background element)
      if (visualTarget) {
        applyRef(visualTarget);
      }

      // Update the mask path so we can apply an SVG mask as a fallback
      try {
        const dStr = lensPath.getAttribute('d') || '';
        // set mask path
        try { maskPath.setAttribute('d', dStr || ''); } catch (e) {}
        if (dStr) {
          // also try CSS path() fallback for clipPath
          const cssPath = `path('${dStr.replace(/'/g, "\\'")}')`;
          if (videoShellEl) {
            try { videoShellEl.style.clipPath = cssPath; videoShellEl.style.webkitClipPath = cssPath; } catch (e) {}
          }
          if (videoEl) {
            try { videoEl.style.clipPath = cssPath; videoEl.style.webkitClipPath = cssPath; } catch (e) {}
          }
        }
      } catch (e) {}

      // As an additional, highly-compatible fallback: approximate the lens with a polygon
      // and apply via CSS `clip-path: polygon(...)` which you noted worked from Webflow.
      try {
        // use the inset radii so the polygon mask sits inside the stroke by maskCushion
        const polyLr = Math.max(0, params.lr - ((colors && colors.strokeW ? colors.strokeW : 2) / 2) - maskCushion);
        const polyRr = Math.max(0, params.rr - ((colors && colors.strokeW ? colors.strokeW : 2) / 2) - maskCushion);
        const polygonPoints = lensPolygonPoints(params.lx, params.cy, polyLr, params.rx, params.cy, polyRr, 24);
        if (polygonPoints && polygonPoints.length) {
          // convert to percent coordinates relative to the svg/viewBox width/height
              const polyStr = polygonPoints.map(p => `${(p.x / width * 100).toFixed(3)}% ${(p.y / height * 100).toFixed(3)}%`).join(', ');
          try { visualTarget.style.clipPath = `polygon(${polyStr})`; visualTarget.style.webkitClipPath = `polygon(${polyStr})`; } catch (e) {}
        }
      } catch (e) {}

      // Apply the SVG mask (url) as a final fallback — some browsers support masks better
      try {
        const maskFrag = '#venn-mask';
        const fullMaskRef = `url(${location.href.replace(/#.*$/, '')}${maskFrag})`;
        if (videoShellEl) {
          try { videoShellEl.style.mask = fullMaskRef; videoShellEl.style.webkitMask = fullMaskRef; } catch (e) {}
        }
        if (videoEl) {
          try { videoEl.style.mask = fullMaskRef; videoEl.style.webkitMask = fullMaskRef; } catch (e) {}
        }
      } catch (e) {}

      // Update visible debug overlay (useful if console logs are muted)
      try {
        if (debugEl) {
          const dStr = lensPath.getAttribute('d') || '';
          const shellClip = videoShellEl ? (getComputedStyle(videoShellEl).clipPath || getComputedStyle(videoShellEl).webkitClipPath || 'none') : 'n/a';
          const vidClip = videoEl ? (getComputedStyle(videoEl).clipPath || getComputedStyle(videoEl).webkitClipPath || 'none') : 'n/a';
          const newText = `lens:${dStr? 'yes':'no'} len:${dStr.length}\nclipShell:${shellClip}\nclipVideo:${vidClip}\nfullRef:${fullRef}\nvideoEl:${!!videoEl}\nclone:${!!_vennClonedVideo}`;
          if (newText !== lastDebugText) {
            debugEl.textContent = newText;
            lastDebugText = newText;
          }
        }
      } catch (e) {}
    } catch (e) {}
  };

  // Animate params so circles slide horizontally toward each other while the
  // container is pinned. We want a 22% overlap of the circles' diameter.
  // For equal radii r, overlap_distance = 0.22 * (2r) = 0.44r
  // center_distance = 2r - overlap_distance = 1.56r
  const finalCenterDistance = 1.56 * targetR;
  const centerX = width / 2;
  const finalLx = Math.round(centerX - (finalCenterDistance / 2));
  const finalRx = Math.round(centerX + (finalCenterDistance / 2));

  tl.to(params, { lx: finalLx, duration: 1.2, ease: 'power2.out', onUpdate: updateShapes }, 0);
  tl.to(params, { rx: finalRx, duration: 1.2, ease: 'power2.out', onUpdate: updateShapes }, 0);

  // If the page includes an element that should appear on top of the video
  // inside the lens (class `.venn-vid-txt`), animate its blur from 20px -> 0
  // starting when the circles first begin to overlap. We compute the relative
  // fraction of the params animation where overlap starts and insert a scrubbed
  // tween into the same timeline so it follows the scroll scrub.
  try {
    const vidTxt = shell.querySelector('.venn-vid-txt');
    if (vidTxt) {
      // use GSAP to set initial state (clean and performant)
      try { gsap.set(vidTxt, { filter: 'blur(20px)', opacity: 0, willChange: 'filter,opacity' }); } catch (e) {}
      // compute fraction where the circles begin to overlap (center distance < sum of radii)
      const initialDist = cxRight - cxLeft;
      const finalDist = finalRx - finalLx;
      const rSum = params.lr + params.rr;
      if (Math.abs(finalDist - initialDist) > 0.0001) {
        let frac = (rSum - initialDist) / (finalDist - initialDist);
        frac = Math.max(0, Math.min(1, frac));
        const tlDur = tl.duration() || 1.2;
  // start slightly earlier so the reveal begins before overlap; tweakable
  const earlyFraction = 0.45; // start 70% of timeline earlier
        let startTime = frac * tlDur - (earlyFraction * tlDur);
        startTime = Math.max(0, startTime);
        const remaining = Math.max(0.001, tlDur - startTime);
        try {
          // use fromTo so both filter and opacity are driven together and rendered by GSAP
          tl.fromTo(vidTxt,
            { filter: 'blur(20px)', opacity: 0 },
            { filter: 'blur(0px)', opacity: 1, duration: remaining, ease: 'none' },
            startTime
          );
        } catch (e) {}
      }
    }
  } catch (e) {}

  // initialize
  updateShapes();

  _vennTL = tl;
}

// Compute SVG path string for the lens (intersection) of two circles
function lensPathForCircles(x1, y1, r1, x2, y2, r2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const d = Math.hypot(dx, dy);
  if (d <= 0.0001) return '';
  // no intersection
  if (d >= r1 + r2) return '';
  // one circle inside another -> return the smaller circle path
  if (d <= Math.abs(r1 - r2)) {
    const r = Math.min(r1, r2);
    const cx = r1 < r2 ? x1 : x2;
    const cy = r1 < r2 ? y1 : y2;
    return circlePath(cx, cy, r);
  }

  // intersection points
  const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(0, r1 * r1 - a * a));
  const xm = x1 + (a * dx) / d;
  const ym = y1 + (a * dy) / d;
  const rx = -dy * (h / d);
  const ry = dx * (h / d);
  const xi1 = xm + rx;
  const yi1 = ym + ry;
  const xi2 = xm - rx;
  const yi2 = ym - ry;

  // Build path: arc on circle1 from P1 to P2, then arc on circle2 from P2 back to P1
  const largeArc1 = 0;
  const sweep1 = 1;
  const largeArc2 = 0;
  const sweep2 = 1;

  // Use absolute coords
  const path = `M ${xi1} ${yi1} ` +
    `A ${r1} ${r1} 0 ${largeArc1} ${sweep1} ${xi2} ${yi2} ` +
    `A ${r2} ${r2} 0 ${largeArc2} ${sweep2} ${xi1} ${yi1} Z`;
  return path;
}

function circlePath(cx, cy, r) {
  // draw a full circle as path
  return `M ${cx - r} ${cy} ` +
    `a ${r} ${r} 0 1 0 ${r * 2} 0 ` +
    `a ${r} ${r} 0 1 0 ${-r * 2} 0 Z`;
}

// Approximate the lens intersection area by sampling points along both arcs
function lensPolygonPoints(x1, y1, r1, x2, y2, r2, segments = 24) {
  // if no intersection, return empty
  const dx = x2 - x1; const dy = y2 - y1; const d = Math.hypot(dx, dy);
  if (d <= 0.0001) return [];
  if (d >= r1 + r2) return [];
  if (d <= Math.abs(r1 - r2)) {
    // return circle approximated
    const r = Math.min(r1, r2);
    const cx = r1 < r2 ? x1 : x2;
    const cy = r1 < r2 ? y1 : y2;
    const pts = [];
    for (let i = 0; i < segments; i++) {
      const a = (i / segments) * Math.PI * 2;
      pts.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r });
    }
    return pts;
  }

  // compute intersection arc endpoints (reuse math from lensPathForCircles)
  const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(0, r1 * r1 - a * a));
  const xm = x1 + (a * dx) / d; const ym = y1 + (a * dy) / d;
  const rx = -dy * (h / d); const ry = dx * (h / d);
  const xi1 = xm + rx; const yi1 = ym + ry;
  const xi2 = xm - rx; const yi2 = ym - ry;

  // angles for arcs
  const ang1 = Math.atan2(yi1 - y1, xi1 - x1);
  const ang2 = Math.atan2(yi2 - y1, xi2 - x1);
  const ang3 = Math.atan2(yi2 - y2, xi2 - x2);
  const ang4 = Math.atan2(yi1 - y2, xi1 - x2);

  // normalize sweep from ang1 -> ang2 on circle1, and ang3 -> ang4 on circle2
  const pts = [];
  const segHalf = Math.ceil(segments / 2);
  // circle1 arc from ang1 to ang2
  for (let i = 0; i <= segHalf; i++) {
    const t = i / segHalf;
    // interpolate angle on shorter arc
    let a1 = ang1 + shortestAngleDiff(ang1, ang2) * t;
    pts.push({ x: x1 + Math.cos(a1) * r1, y: y1 + Math.sin(a1) * r1 });
  }
  // circle2 arc from ang3 to ang4
  for (let i = 0; i <= segHalf; i++) {
    const t = i / segHalf;
    let a2 = ang3 + shortestAngleDiff(ang3, ang4) * t;
    pts.push({ x: x2 + Math.cos(a2) * r2, y: y2 + Math.sin(a2) * r2 });
  }
  return pts;
}

function shortestAngleDiff(a, b) {
  let diff = b - a;
  while (diff < -Math.PI) diff += Math.PI * 2;
  while (diff > Math.PI) diff -= Math.PI * 2;
  return diff;
}