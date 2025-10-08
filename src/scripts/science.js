import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let _vennSVG = null;
let _vennTL = null;

export function initSciencePage() {
  console.log('Science page JS loaded!');
  try {
    createVennCircles();
  } catch (e) {
    console.error('Failed to init venn circles:', e);
  }
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
  } catch (e) { console.warn('cleanupSciencePage failed', e); }
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
      if (darkBg) {
        return { fill: 'rgba(255,255,255,0.06)', stroke: '#ffffff', lensFill: 'rgba(255,255,255,0.08)', strokeDash: '8 8', strokeW: 4 };
      }
      return { fill: 'rgba(0,100,255,0.12)', stroke: '#0366d6', lensFill: 'rgba(255,0,0,0.12)', strokeDash: '6 6', strokeW: 3 };
    } catch (e) {
      return { fill: 'rgba(0,100,255,0.12)', stroke: '#0366d6', lensFill: 'rgba(255,0,0,0.12)', strokeDash: '6 6', strokeW: 3 };
    }
  };
  const colors = pickColors(bgColor);
  left.setAttribute('fill', colors.fill);
  left.setAttribute('stroke', colors.stroke);
  left.setAttribute('stroke-dasharray', colors.strokeDash);
  left.setAttribute('stroke-width', colors.strokeW);

  right.setAttribute('cx', cxRight);
  right.setAttribute('cy', cy);
  right.setAttribute('r', targetR);
  right.setAttribute('fill', colors.fill);
  right.setAttribute('stroke', colors.stroke);
  right.setAttribute('stroke-dasharray', colors.strokeDash);
  right.setAttribute('stroke-width', colors.strokeW);

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
  svg.appendChild(defs);

  // Ensure the shell is positioned so the absolute SVG overlays correctly
  const prevPosition = window.getComputedStyle(shell).position;
  if (prevPosition === 'static' || !prevPosition) {
    try { shell.style.position = 'relative'; } catch (e) {}
  }

  // Append svg to shell
  shell.appendChild(svg);
  _vennSVG = svg;

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

  const updateShapes = () => {
    try {
      left.setAttribute('cx', Math.round(params.lx));
      left.setAttribute('cy', Math.round(params.cy));
      left.setAttribute('r', Math.round(params.lr));
      right.setAttribute('cx', Math.round(params.rx));
      right.setAttribute('cy', Math.round(params.cy));
      right.setAttribute('r', Math.round(params.rr));

      // compute lens path and set it on lensPath
      const d = lensPathForCircles(params.lx, params.cy, params.lr, params.rx, params.cy, params.rr);
      lensPath.setAttribute('d', d || '');

      // apply clipPath to the .venn-video-shell parent (more robust with background-cover videos)
      const videoEl = document.querySelector('.venn-video-shell video');
      const videoShellEl = document.querySelector('.venn-video-shell');
      if (videoShellEl) {
        try { videoShellEl.style.clipPath = 'url(#venn-clip)'; videoShellEl.style.webkitClipPath = 'url(#venn-clip)'; videoShellEl.style.overflow = 'hidden'; } catch (e) {}
      } else if (videoEl) {
        try { videoEl.style.clipPath = 'url(#venn-clip)'; videoEl.style.webkitClipPath = 'url(#venn-clip)'; } catch (e) {}
      }
    } catch (e) {}
  };

  // Animate params so circles slide horizontally toward each other while the
  // container is pinned. We want a 20% overlap of the circles' diameter.
  // For equal radii r, overlap_distance = 0.2 * (2r) = 0.4r
  // center_distance = 2r - overlap_distance = 1.6r
  const finalCenterDistance = 1.6 * targetR;
  const centerX = width / 2;
  const finalLx = Math.round(centerX - (finalCenterDistance / 2));
  const finalRx = Math.round(centerX + (finalCenterDistance / 2));

  tl.to(params, { lx: finalLx, duration: 1.2, ease: 'power2.out', onUpdate: updateShapes }, 0);
  tl.to(params, { rx: finalRx, duration: 1.2, ease: 'power2.out', onUpdate: updateShapes }, 0);

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