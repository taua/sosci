export function initScrollReset() {
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }

    // Don't reload on scroll position - this causes infinite loops and scroll issues
    // Just reset scroll position directly
    
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
    });

    requestAnimationFrame(() => {
        window.scrollTo(0, 0);
    });
}
