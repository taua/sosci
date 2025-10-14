import { gsap } from "gsap";

// Module-scoped references so cleanup can remove listeners and stop effects
let _workState = {
  workImgShell: null,
  workLinksShell: null,
  workLinks: null,
  workImgMasks: null,
  currentIndex: 1000,
  currentVideo: null,
  currentMask: null,
  xTo: null,
  yTo: null,
  onMouseMovePos: null,
  onMouseMoveLastY: null,
  onLinksMouseEnterLeave: [],
  onWorkShellEnter: null,
  onWorkShellLeave: null,
  onInitialMouseMove: null
};

export function initWorkPage() {
    // Pause all videos on work page
    document.querySelectorAll('video').forEach(video => {
        video.pause();
    });

    const workImgShell = document.querySelector('.work-img-shell');
    const workLinksShell = document.querySelector('.work-links-shell');
    const workLinks = document.querySelectorAll('.work-links-item');
    const workImgMasks = document.querySelectorAll('.work-img-mask');
    _workState.workImgShell = workImgShell;
    _workState.workLinksShell = workLinksShell;
    _workState.workLinks = workLinks;
    _workState.workImgMasks = workImgMasks;

        // Number work link blocks (format: "01 /", "02 /")
        try {
            const elems = Array.from(document.querySelectorAll('.work-link-num-txt'));
            if (elems && elems.length) {
                const total = elems.length;
                const padLen = Math.max(2, String(total).length);
                elems.forEach((el, i) => {
                    try {
                        const n = String(i + 1).padStart(padLen, '0');
                        el.innerHTML = `${n} /`;
                    } catch (e) {}
                });
            }
        } catch (e) {}

    // Debug info removed for cleaner console output

    if (!workImgShell || !workLinksShell) return;

    // Set initial state for first mask immediately
    if (workImgMasks.length > 0) {
        const firstMask = workImgMasks[0];
        gsap.set(firstMask, { zIndex: _workState.currentIndex });
        
        const firstAnimeElement = firstMask.querySelector('.work-img-mask-anime');
        if (firstAnimeElement) {
            gsap.set(firstAnimeElement, { 
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '100%',
                overflow: 'hidden'
            });
            _workState.currentMask = firstMask;

            // Play first video if exists
            const firstVideo = firstMask.querySelector('video');
            if (firstVideo) {
                firstVideo.play();
                _workState.currentVideo = firstVideo;
            }
        }
    }

    // Reset and set initial state
    workImgShell.style.cssText = ''; // Clear any existing styles
    gsap.set(workImgShell, {
        opacity: 0,
        xPercent: -50,
        yPercent: -50,
        position: 'fixed',
        top: '0',
        left: '0',
        //width: '400px',
        //height: '300px',
        //background: 'red', // Debug color
        zIndex: 9999,
        pointerEvents: 'none'
    });

    // Create quickTo animations
    const xTo = gsap.quickTo(workImgShell, "x", {duration: 1.2, ease: "expo.out"});
    const yTo = gsap.quickTo(workImgShell, "y", {duration: 1.2, ease: "expo.out"});
    _workState.xTo = xTo;
    _workState.yTo = yTo;

    // Mouse move handler using content-shell position
    const onMouseMovePos = (e) => {
        const shellYoffset = document.querySelector('.content-shell').getBoundingClientRect().top;
        xTo(e.clientX);
        yTo(e.clientY - shellYoffset);
    };
    _workState.onMouseMovePos = onMouseMovePos;
    window.addEventListener("mousemove", onMouseMovePos);

    // Container hover handling for both shells
    const handleContainerHover = (enter) => {
        gsap.killTweensOf(workImgShell, "opacity");
        gsap.to(workImgShell, {
            opacity: enter ? 1 : 0,
            scale: enter ? 1 : 0.8,
            duration: enter ? 0.6 : 0.3,
            ease: "expo.out"
        });

        if (enter && _workState.currentMask) {
            const video = _workState.currentMask.querySelector('video');
            if (video) {
                video.play();
                _workState.currentVideo = video;
            }
        } else if (!enter && _workState.currentVideo) {
            _workState.currentVideo.pause();
            _workState.currentVideo = null;
        }
    };

    _workState.onWorkShellEnter = () => handleContainerHover(true);
    _workState.onWorkShellLeave = () => handleContainerHover(false);
    workLinksShell.addEventListener('mouseenter', _workState.onWorkShellEnter);
    workLinksShell.addEventListener('mouseleave', _workState.onWorkShellLeave);
    workImgShell.addEventListener('mouseenter', _workState.onWorkShellEnter);
    workImgShell.addEventListener('mouseleave', _workState.onWorkShellLeave);

    // Add mouse position tracking
    let lastMouseY = 0;
    const onMouseMoveLastY = (e) => { lastMouseY = e.clientY; };
    _workState.onMouseMoveLastY = onMouseMoveLastY;
    window.addEventListener('mousemove', onMouseMoveLastY);

    // Handle matching z-index updates and video control
    workLinks.forEach((link, index) => {
        link.addEventListener('mouseenter', (e) => {
            _workState.currentIndex++;
            
            // Animate links-bg with directional scale
            const linksBg = link.querySelector('.links-bg');
            if (linksBg) {
                const rect = link.getBoundingClientRect();
                const elementCenter = rect.top + (rect.height / 2);
                const fromTop = lastMouseY < elementCenter;
                
                gsap.killTweensOf(linksBg);
                gsap.set(linksBg, {
                    transformOrigin: fromTop ? 'top center' : 'bottom center',
                    scaleY: 0
                });
                gsap.to(linksBg, {
                    scaleY: 1,
                    duration: 0.6,
                    ease: "expo.out"
                });
            }

            // Skip animation if it's the first item and we're just starting
            if (index === 0 && _workState.currentMask === workImgMasks[0]) {
                return;
            }
            
            // Pause current video if exists
            if (_workState.currentVideo) {
                _workState.currentVideo.pause();
            }
            
            const correspondingMask = workImgMasks[index];
            if (correspondingMask && correspondingMask !== _workState.currentMask) {
                _workState.currentMask = correspondingMask; // Update current mask
                gsap.set(correspondingMask, { zIndex: _workState.currentIndex });
                
                const animeElement = correspondingMask.querySelector('.work-img-mask-anime');
                if (animeElement) {
                    // Kill all tweens
                    const children = animeElement.children;
                    gsap.killTweensOf([animeElement, children]);
                    
                    // Get position and direction
                    const rect = correspondingMask.getBoundingClientRect();
                    const elementCenter = rect.top + (rect.height / 2);
                    const fromTop = lastMouseY < elementCenter;
                    
                    // Setup and animate only if it's a new mask
                    gsap.set(animeElement, { 
                        position: 'absolute',
                        top: fromTop ? 'auto' : 0,
                        bottom: fromTop ? 0 : 'auto',
                        left: 0,
                        right: 0,
                        height: '0%',
                        overflow: 'hidden'
                    });

                    gsap.timeline()
                        .to(animeElement, {
                            height: '100%',
                            duration: 1.1,
                            ease: "expo.out"
                        });
                }
                
                // Find and play video if exists
                    const video = correspondingMask.querySelector('video');
                    if (video) {
                        video.play();
                        _workState.currentVideo = video;
                    }
            }
        });

    link.addEventListener('mouseleave', (e) => {
            const linksBg = link.querySelector('.links-bg');
            if (linksBg) {
                const rect = link.getBoundingClientRect();
                const elementCenter = rect.top + (rect.height / 2);
                const fromTop = e.clientY < elementCenter;
                
                gsap.killTweensOf(linksBg);
                gsap.set(linksBg, {
                    transformOrigin: fromTop ? 'top center' : 'bottom center'
                });
                gsap.to(linksBg, {
                    scaleY: 0,
                    duration: 0.6,
                    ease: "expo.out"
                });
            }
        });
    });
    /*
    // Handle z-index updates for individual links
    workLinks.forEach((link, index) => {
        link.addEventListener('mouseenter', () => {
            _workState.currentIndex++;
            gsap.set(link, { zIndex: _workState.currentIndex });
        });
    });
    */

    // Add function to check if cursor is over element
    const isCursorOverElement = (element, x, y) => {
        const rect = element.getBoundingClientRect();
        return (
            x >= rect.left &&
            x <= rect.right &&
            y >= rect.top &&
            y <= rect.bottom
        );
    };

    // Check initial cursor position
    const checkInitialCursor = (e) => {
        if (isCursorOverElement(workLinksShell, e.clientX, e.clientY)) {
            handleContainerHover(true);
        }
        document.removeEventListener('mousemove', checkInitialCursor);
    };

        // Add one-time mousemove listener for initial position
        const onInitialMouseMove = checkInitialCursor;
        _workState.onInitialMouseMove = onInitialMouseMove;
        document.addEventListener('mousemove', onInitialMouseMove);
}

export function cleanupWorkPage() {
    try {
        // Pause all videos on page
        document.querySelectorAll('video').forEach(video => { try { video.pause(); } catch (e) {} });

        // Remove named window listeners
        if (_workState.onMouseMovePos) window.removeEventListener('mousemove', _workState.onMouseMovePos);
        if (_workState.onMouseMoveLastY) window.removeEventListener('mousemove', _workState.onMouseMoveLastY);

        // Remove initial mousemove
        if (_workState.onInitialMouseMove) document.removeEventListener('mousemove', _workState.onInitialMouseMove);

        // Remove shell listeners
        if (_workState.workLinksShell) {
            _workState.workLinksShell.removeEventListener('mouseenter', _workState.onWorkShellEnter);
            _workState.workLinksShell.removeEventListener('mouseleave', _workState.onWorkShellLeave);
        }
        if (_workState.workImgShell) {
            _workState.workImgShell.removeEventListener('mouseenter', _workState.onWorkShellEnter);
            _workState.workImgShell.removeEventListener('mouseleave', _workState.onWorkShellLeave);
        }

        // Remove per-link listeners and clear arrays (best-effort)
        if (_workState.workLinks && _workState.workLinks.length) {
            _workState.workLinks.forEach(link => {
                // We don't have direct references to the exact anonymous handlers on links; attempt to clone to clear listeners
                try {
                    const clone = link.cloneNode(true);
                    link.parentNode.replaceChild(clone, link);
                } catch (e) { /* ignore */ }
            });
        }

        // Kill tweens related to workImgShell
        try { gsap.killTweensOf(_workState.workImgShell); } catch (e) {}
        try { gsap.killTweensOf(_workState.workImgShell && _workState.workImgShell.children); } catch (e) {}

        // Clear state
        _workState = {
            workImgShell: null,
            workLinksShell: null,
            workLinks: null,
            workImgMasks: null,
            currentIndex: 1000,
            currentVideo: null,
            currentMask: null,
            xTo: null,
            yTo: null,
            onMouseMovePos: null,
            onMouseMoveLastY: null,
            onLinksMouseEnterLeave: [],
            onWorkShellEnter: null,
            onWorkShellLeave: null,
            onInitialMouseMove: null
        };
    } catch (e) {
        console.warn('cleanupWorkPage error', e);
    }
}

window.initPageTransitions = function() {
  // Your page-specific GSAP intro animation here
  // Animate main-shell translateY from 30% to 0% using translate3d
  const mainShell = document.querySelector('.main-shell');
  if (mainShell) {
    gsap.fromTo(
      mainShell,
      { transform: "translate3d(0, 30%, 0)" },
      {
        transform: "translate3d(0, 0, 0)",
        duration: 1,
        ease: "expo.inOut"
      }
    );
  }
};