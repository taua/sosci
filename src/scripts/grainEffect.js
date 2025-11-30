export default function grainEffect(config = {}) {
    // Customizable settings
    const settings = {
        opacity: config.opacity || 1,      // Overall canvas opacity
        grainAlpha: config.grainAlpha || 32,  // Grain transparency (0-255)
        grainScale: config.grainScale || 3.4, // Resolution scale (0-1)
        fps: config.fps || 10,                // Animation speed (ms between frames)
        blendMode: config.blendMode || 'hard-light', // Blend mode ('overlay', 'multiply', etc)
        greyness: 90, // Middle grey base for better visibility on all backgrounds
        patterns: config.patterns || 10,        // Number of pre-calculated patterns
        ...config
    };

    // Create canvas and add to DOM
    const canvas = document.createElement('canvas');
    Object.assign(canvas.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: '999999',
        opacity: settings.opacity,
        mixBlendMode: settings.blendMode
    });
    document.body.appendChild(canvas);

    // Set up canvas context
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    let frameRequest;
    let patterns = [];

    // Generate noise patterns at current canvas size
    function generatePatterns() {
        patterns = Array.from({ length: settings.patterns }, () => {
            const pattern = ctx.createImageData(canvas.width, canvas.height);
            const data = pattern.data;
            for (let i = 0; i < data.length; i += 16) {
                // Add variation around middle grey
                const noise = Math.floor(settings.greyness + (Math.random() - 0.5) * 255);
                for (let j = 0; j < 4; j++) {
                    const idx = i + (j * 4);
                    data[idx] = noise;
                    data[idx + 1] = noise;
                    data[idx + 2] = noise;
                    data[idx + 3] = settings.grainAlpha;
                }
            }
            return pattern;
        });
    }

    // Handle resize - debounced to avoid regenerating patterns too frequently
    let resizeTimeout;
    function resize() {
        canvas.width = Math.floor(window.innerWidth * settings.grainScale);
        canvas.height = Math.floor(window.innerHeight * settings.grainScale);
        
        // Debounce pattern regeneration
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            generatePatterns();
        }, 150);
    }
    window.addEventListener('resize', resize);
    resize();
    
    // Initial pattern generation
    generatePatterns();

    let patternIndex = 0;
    // Animation loop
    function animate() {
        if (patterns.length > 0) {
            ctx.putImageData(patterns[patternIndex], 0, 0);
            patternIndex = (patternIndex + 1) % patterns.length;
        }
        frameRequest = setTimeout(() => requestAnimationFrame(animate), settings.fps);
    }

    // Start animation
    animate();

    // Return cleanup function
    return () => {
        clearTimeout(frameRequest);
        clearTimeout(resizeTimeout);
        canvas.remove();
        window.removeEventListener('resize', resize);
    };
}