import { gsap } from "gsap";

// Shared work-links functionality that can be used by multiple pages
export function createWorkLinksModule() {
  // Module-scoped state
  const state = {
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
    onWorkShellEnter: null,
    onWorkShellLeave: null,
    onInitialMouseMove: null
  };

  function init() {
    // Pause all videos
    document.querySelectorAll('video').forEach(video => {
      video.pause();
    });

    const workImgShell = document.querySelector('.work-img-shell');
    const workLinksShell = document.querySelector('.work-links-shell');
    const workLinks = document.querySelectorAll('.work-links-item');
    const workImgMasks = document.querySelectorAll('.work-img-mask');
    
    state.workImgShell = workImgShell;
    state.workLinksShell = workLinksShell;
    state.workLinks = workLinks;
    state.workImgMasks = workImgMasks;

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

    if (!workImgShell || !workLinksShell) return;

    // Set initial state for first mask immediately
    if (workImgMasks.length > 0) {
      const firstMask = workImgMasks[0];
      gsap.set(firstMask, { zIndex: state.currentIndex });
      
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
        state.currentMask = firstMask;

        // Play first video if exists
        const firstVideo = firstMask.querySelector('video');
        if (firstVideo) {
          firstVideo.play();
          state.currentVideo = firstVideo;
        }
      }
    }

    // Reset and set initial state
    workImgShell.style.cssText = '';
    gsap.set(workImgShell, {
      opacity: 0,
      xPercent: -50,
      yPercent: -50,
      position: 'fixed',
      top: '0',
      left: '0',
      zIndex: 9999,
      pointerEvents: 'none'
    });

    // Create quickTo animations
    const xTo = gsap.quickTo(workImgShell, "x", {duration: 1.2, ease: "expo.out"});
    const yTo = gsap.quickTo(workImgShell, "y", {duration: 1.2, ease: "expo.out"});
    state.xTo = xTo;
    state.yTo = yTo;

    // Mouse move handler using content-shell position
    const onMouseMovePos = (e) => {
      const shellYoffset = document.querySelector('.content-shell').getBoundingClientRect().top;
      xTo(e.clientX);
      yTo(e.clientY - shellYoffset);
    };
    state.onMouseMovePos = onMouseMovePos;
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

      if (enter && state.currentMask) {
        const video = state.currentMask.querySelector('video');
        if (video) {
          video.play();
          state.currentVideo = video;
        }
      } else if (!enter && state.currentVideo) {
        state.currentVideo.pause();
        state.currentVideo = null;
      }
    };

    state.onWorkShellEnter = () => handleContainerHover(true);
    state.onWorkShellLeave = () => handleContainerHover(false);
    workLinksShell.addEventListener('mouseenter', state.onWorkShellEnter);
    workLinksShell.addEventListener('mouseleave', state.onWorkShellLeave);
    workImgShell.addEventListener('mouseenter', state.onWorkShellEnter);
    workImgShell.addEventListener('mouseleave', state.onWorkShellLeave);

    // Add mouse position tracking
    let lastMouseY = 0;
    const onMouseMoveLastY = (e) => { lastMouseY = e.clientY; };
    state.onMouseMoveLastY = onMouseMoveLastY;
    window.addEventListener('mousemove', onMouseMoveLastY);

    // Check current project URL and disable matching links
    const currentPath = window.location.pathname;
    const projectMatch = currentPath.match(/projects\/([^\/]+)/);
    const currentProjectSlug = projectMatch ? projectMatch[1] : null;

    // Handle matching z-index updates and video control
    workLinks.forEach((link, index) => {
      // Check if this link matches the current project
      let isCurrentProject = false;
      
      if (currentProjectSlug) {
        // Check href for match
        const href = link.getAttribute('href');
        if (href && href.includes(`projects/${currentProjectSlug}`)) {
          isCurrentProject = true;
        }
        
        // Also check headline text for match (normalize both strings)
        if (!isCurrentProject) {
          const headlineEl = link.querySelector('.work-link-headline-txt');
          if (headlineEl) {
            const headlineText = headlineEl.textContent.trim().toLowerCase().replace(/\s+/g, '-');
            if (headlineText === currentProjectSlug.toLowerCase()) {
              isCurrentProject = true;
            }
          }
        }
      }
      
      // If this is the current project, disable click and add visual indicator
      if (isCurrentProject) {
        link.style.pointerEvents = 'none';
        link.style.opacity = '0.5';
        link.setAttribute('data-current-project', 'true');
        return; // Skip adding event listeners for this link
      }
      
      link.addEventListener('mouseenter', (e) => {
        state.currentIndex++;
        
        // Animate text color to black
        const textElements = link.querySelectorAll('*');
        if (textElements.length) {
          gsap.to(textElements, {
            color: '#000000',
            duration: 0.4,
            ease: "power2.out"
          });
        }
        
        // Animate work-link-num to the right
        const workLinkNum = link.querySelector('.work-link-num');
        if (workLinkNum) {
          gsap.to(workLinkNum, {
            x: 30,
            duration: 0.4,
            ease: "power2.out"
          });
        }
        
        // Animate work-link-client to the left
        const workLinkClient = link.querySelector('.work-link-client');
        if (workLinkClient) {
          gsap.to(workLinkClient, {
            x: -30,
            duration: 0.4,
            ease: "power2.out"
          });
        }
        
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
        if (index === 0 && state.currentMask === workImgMasks[0]) {
          return;
        }
        
        // Pause current video if exists
        if (state.currentVideo) {
          state.currentVideo.pause();
        }
        
        const correspondingMask = workImgMasks[index];
        if (correspondingMask && correspondingMask !== state.currentMask) {
          state.currentMask = correspondingMask;
          gsap.set(correspondingMask, { zIndex: state.currentIndex });
          
          const animeElement = correspondingMask.querySelector('.work-img-mask-anime');
          if (animeElement) {
            const children = animeElement.children;
            gsap.killTweensOf([animeElement, children]);
            
            const rect = correspondingMask.getBoundingClientRect();
            const elementCenter = rect.top + (rect.height / 2);
            const fromTop = lastMouseY < elementCenter;
            
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
          
          const video = correspondingMask.querySelector('video');
          if (video) {
            video.play();
            state.currentVideo = video;
          }
        }
      });

      link.addEventListener('mouseleave', (e) => {
        // Animate text color back to white
        const textElements = link.querySelectorAll('*');
        if (textElements.length) {
          gsap.to(textElements, {
            color: '#FFFFFF',
            duration: 0.4,
            ease: "power2.out"
          });
        }
        
        // Animate work-link-num back to original position
        const workLinkNum = link.querySelector('.work-link-num');
        if (workLinkNum) {
          gsap.to(workLinkNum, {
            x: 0,
            duration: 0.4,
            ease: "power2.out"
          });
        }
        
        // Animate work-link-client back to original position
        const workLinkClient = link.querySelector('.work-link-client');
        if (workLinkClient) {
          gsap.to(workLinkClient, {
            x: 0,
            duration: 0.4,
            ease: "power2.out"
          });
        }
        
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

    // Check if cursor is over element
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

    const onInitialMouseMove = checkInitialCursor;
    state.onInitialMouseMove = onInitialMouseMove;
    document.addEventListener('mousemove', onInitialMouseMove);
  }

  function cleanup() {
    try {
      // Pause all videos
      document.querySelectorAll('video').forEach(video => { try { video.pause(); } catch (e) {} });

      // Remove window listeners
      if (state.onMouseMovePos) window.removeEventListener('mousemove', state.onMouseMovePos);
      if (state.onMouseMoveLastY) window.removeEventListener('mousemove', state.onMouseMoveLastY);
      if (state.onInitialMouseMove) document.removeEventListener('mousemove', state.onInitialMouseMove);

      // Remove shell listeners
      if (state.workLinksShell) {
        state.workLinksShell.removeEventListener('mouseenter', state.onWorkShellEnter);
        state.workLinksShell.removeEventListener('mouseleave', state.onWorkShellLeave);
      }
      if (state.workImgShell) {
        state.workImgShell.removeEventListener('mouseenter', state.onWorkShellEnter);
        state.workImgShell.removeEventListener('mouseleave', state.onWorkShellLeave);
      }

      // Remove per-link listeners
      if (state.workLinks && state.workLinks.length) {
        state.workLinks.forEach(link => {
          try {
            const clone = link.cloneNode(true);
            link.parentNode.replaceChild(clone, link);
          } catch (e) {}
        });
      }

      // Kill tweens
      try { gsap.killTweensOf(state.workImgShell); } catch (e) {}
      try { gsap.killTweensOf(state.workImgShell && state.workImgShell.children); } catch (e) {}

      // Clear state
      Object.keys(state).forEach(key => {
        state[key] = null;
      });
      state.currentIndex = 1000;
    } catch (e) {
      console.warn('workLinksModule cleanup error', e);
    }
  }

  return {
    init,
    cleanup
  };
}
