export function initScrollReset() {
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }

    if (window.scrollY !== 0) {
        window.location.reload();
        return;
    }

    document.body.style.overflow = 'hidden';
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
    });

    requestAnimationFrame(() => {
        window.scrollTo(0, 0);
        document.body.style.overflow = '';
    });
}
