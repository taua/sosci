import { gsap } from "gsap";

export function initWorkPage() {
    // Pause all videos on work page
    document.querySelectorAll('video').forEach(video => {
        video.pause();
    });

    const workImgShell = document.querySelector('.work-img-shell');
    const workLinksShell = document.querySelector('.work-links-shell');
    const workLinks = document.querySelectorAll('.work-links-item');
    const workImgMasks = document.querySelectorAll('.work-img-mask');
    let currentIndex = 1000; // Starting z-index
    let currentVideo = null; // Track currently playing video
    let currentMask = null; // Track currently visible mask

    // Add debug info
    console.log('Work init:', {
        shellExists: !!workImgShell,
        shellDisplay: workImgShell?.style.display,
        shellPosition: workImgShell?.style.position,
        shellParent: workImgShell?.parentElement
    });

    if (!workImgShell || !workLinksShell) return;

    // Set initial state for first mask immediately
    if (workImgMasks.length > 0) {
        const firstMask = workImgMasks[0];
        gsap.set(firstMask, { zIndex: currentIndex });
        
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
            currentMask = firstMask;

            // Play first video if exists
            const firstVideo = firstMask.querySelector('video');
            if (firstVideo) {
                firstVideo.play();
                currentVideo = firstVideo;
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

    // Mouse move handler using content-shell position
    window.addEventListener("mousemove", e => {
        const shellYoffset = document.querySelector('.content-shell').getBoundingClientRect().top;
        xTo(e.clientX);
        yTo(e.clientY - shellYoffset);
    });

    // Container hover handling for both shells
    const handleContainerHover = (enter) => {
        gsap.killTweensOf(workImgShell, "opacity");
        gsap.to(workImgShell, {
            opacity: enter ? 1 : 0,
            scale: enter ? 1 : 0.8,
            duration: enter ? 0.6 : 0.3,
            ease: "expo.out"
        });

        if (enter && currentMask) {
            const video = currentMask.querySelector('video');
            if (video) {
                video.play();
                currentVideo = video;
            }
        } else if (!enter && currentVideo) {
            currentVideo.pause();
            currentVideo = null;
        }
    };

    workLinksShell.addEventListener('mouseenter', () => handleContainerHover(true));
    workLinksShell.addEventListener('mouseleave', () => handleContainerHover(false));
    workImgShell.addEventListener('mouseenter', () => handleContainerHover(true));
    workImgShell.addEventListener('mouseleave', () => handleContainerHover(false));

    // Add mouse position tracking
    let lastMouseY = 0;
    window.addEventListener('mousemove', e => {
        lastMouseY = e.clientY;
    });

    // Handle matching z-index updates and video control
    workLinks.forEach((link, index) => {
        link.addEventListener('mouseenter', (e) => {
            currentIndex++;
            
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
            if (index === 0 && currentMask === workImgMasks[0]) {
                return;
            }
            
            // Pause current video if exists
            if (currentVideo) {
                currentVideo.pause();
            }
            
            const correspondingMask = workImgMasks[index];
            if (correspondingMask && correspondingMask !== currentMask) {
                currentMask = correspondingMask; // Update current mask
                gsap.set(correspondingMask, { zIndex: currentIndex });
                
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
                    currentVideo = video;
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
            currentIndex++;
            gsap.set(link, { zIndex: currentIndex });
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
    document.addEventListener('mousemove', checkInitialCursor);
}