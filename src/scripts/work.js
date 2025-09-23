import { gsap } from "gsap";

export function initWorkPage() {
    const workImgShell = document.querySelector('.work-img-shell');
    const workLinksShell = document.querySelector('.work-links-shell');
    const workLinks = document.querySelectorAll('.work-links-item');
    const workImgMasks = document.querySelectorAll('.work-img-mask');
    let currentIndex = 1000; // Starting z-index

    // Add debug info
    console.log('Work init:', {
        shellExists: !!workImgShell,
        shellDisplay: workImgShell?.style.display,
        shellPosition: workImgShell?.style.position,
        shellParent: workImgShell?.parentElement
    });

    if (!workImgShell || !workLinksShell) return;

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

    // Mouse move handler using content-shell position offset
    window.addEventListener("mousemove", e => {
        const shellYoffset = document.querySelector('.content-shell').getBoundingClientRect().top;
        xTo(e.clientX);
        yTo(e.clientY - shellYoffset);
    });

    // Container hover handling
    workLinksShell.addEventListener('mouseenter', () => {
        gsap.killTweensOf(workImgShell, "opacity");
        gsap.to(workImgShell, {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: "expo.out"
        });
    });

    // Handle matching z-index updates
    workLinks.forEach((link, index) => {
        link.addEventListener('mouseenter', () => {
            currentIndex++;
            
            // Find matching mask and update its z-index
            const correspondingMask = workImgMasks[index];
            if (correspondingMask) {
                //console.log(`Link ${index} hovered, updating mask z-index to ${currentIndex}`);
                gsap.set(correspondingMask, { zIndex: currentIndex });
            }
        });
    });

    workLinksShell.addEventListener('mouseleave', () => {
        gsap.killTweensOf(workImgShell, "opacity");
        gsap.to(workImgShell, {
            opacity: 0,
            scale: 0.8,
            duration: 0.3,
            ease: "expo.out"
        });
    });

    // Handle z-index updates for individual links
    workLinks.forEach((link, index) => {
        link.addEventListener('mouseenter', () => {
            currentIndex++;
            gsap.set(link, { zIndex: currentIndex });
        });
    });
}