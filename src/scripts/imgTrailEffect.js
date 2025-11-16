import imagesLoaded from "imagesloaded";
import gsap from 'gsap';
import {Power4} from "gsap";
//import colorCombos from "./colorCombos";


// ********************************************************//
// **     Image Mouse trail effect for hero section     ** //
// ********************************************************//
export default function imgTrailEffect() {
    // body element
    const body = document.body;
    //let handleMouseMove;
    // helper functions
    const MathUtils = {
        // linear interpolation
        lerp: (a, b, n) => (1 - n) * a + n * b,
        // distance between two points
        distance: (x1,y1,x2,y2) => Math.hypot(x2-x1, y2-y1)
    }

    // get the mouse position
    const getMousePos = (ev) => {
        let posx = window.innerWidth / 2;
        let posy = window.innerHeight / 2;
        if (ev) {
            if (ev.pageX || ev.pageY) {
                posx = ev.pageX;
                posy = ev.pageY;
            }
            else if (ev.clientX || ev.clientY) 	{
                posx = ev.clientX + body.scrollLeft + docEl.scrollLeft;
                posy = ev.clientY + body.scrollTop + docEl.scrollTop;
            }
        }
        return {x: posx, y: posy};
    }

    // mousePos: current mouse position
    // cacheMousePos: previous mouse position
    // lastMousePos: last last recorded mouse position (at the time the last image was shown)
    const lastReal = window._lastRealMousePos || getMousePos();
    let mousePos = lastMousePos = cacheMousePos = { x: lastReal.x, y: lastReal.y };

    // Update mousePos on every mousemove
    function handleMouseMove(ev) {
        mousePos = getMousePos(ev);
    }
    window.addEventListener('mousemove', handleMouseMove);

    // gets the distance from the current mouse position to the last recorded mouse position
    const getMouseDistance = () => MathUtils.distance(mousePos.x,mousePos.y,lastMousePos.x,lastMousePos.y);

    class Image {
        constructor(el) {
            this.DOM = {el: el};
            // image deafult styles
            this.defaultStyle = {
                scale: 1,
                x: 0,
                y: 0,
                opacity: 0
            };
            this.isLoaded = false;
            // get sizes/position
            this.getRect();
            // init/bind events
            this.initEvents();
        }
        initEvents() {
            // on resize get updated sizes/position
            window.addEventListener('resize', () => this.resize());
        }
        resize() {
            // reset styles
            gsap.set(this.DOM.el, this.defaultStyle);
            // get sizes/position
            this.getRect();
        }
        getRect() {
            this.rect = this.DOM.el.getBoundingClientRect();
            // Check if image has valid dimensions (loaded)
            this.isLoaded = this.rect.width > 0 && this.rect.height > 0;
        }
        isActive() {
            // check if image is animating or if it's visible
            return gsap.isTweening(this.DOM.el) || this.DOM.el.style.opacity != 0;
        }
    }

    let imageTrailInstance = null;
    let animationFrameId = null;

    class ImageTrail {
        constructor() {
            this.DOM = {content: document.querySelector('.content')};
            this.images = [];
            [...this.DOM.content.querySelectorAll('img')].forEach(img => this.images.push(new Image(img)));
            this.imagesTotal = this.images.length;
            this.imgPosition = 0;
            this.zIndexVal = 1;
            this.threshold = 100;
            // Force recalc of all image rects on creation
            this.images.forEach(img => img.resize());
            animationFrameId = requestAnimationFrame(() => this.render());
        }
        render() {
            let distance = getMouseDistance();
            cacheMousePos.x = MathUtils.lerp(cacheMousePos.x || mousePos.x, mousePos.x, 0.1);
            cacheMousePos.y = MathUtils.lerp(cacheMousePos.y || mousePos.y, mousePos.y, 0.1);
            if ( distance > this.threshold ) {
                this.showNextImage();
                ++this.zIndexVal;
                this.imgPosition = this.imgPosition < this.imagesTotal-1 ? this.imgPosition+1 : 0;
                lastMousePos = mousePos;
            }
            let isIdle = true;
            for (let img of this.images) {
                if ( img.isActive() ) {
                    isIdle = false;
                    break;
                }
            }
            if ( isIdle && this.zIndexVal !== 1 ) {
                this.zIndexVal = 1;
            }
            animationFrameId = requestAnimationFrame(() => this.render());
        }
        showNextImage() {
            // show image at position [this.imgPosition]
            const img = this.images[this.imgPosition];
            
            // Don't show image if it's not loaded yet
            if (!img.isLoaded) {
                return;
            }
            
            // kill any tween on the image
            gsap.killTweensOf(img.DOM.el);
            let theIndex = $(img.DOM.el).index();
            //let theTextColor = colorCombos[theIndex].text_color;
            //let theBgColor = colorCombos[theIndex].background_color;
            //let theDelay = .15;
            //let theDuration = 4;
            //gsap.killTweensOf(['.bg-color' , '.menu-top-bar' , '.menu-bottom-bar' , '.home-body' ]);
            //gsap.to('.bg-color', {duration: theDuration, ease:Power4.easeOut, backgroundColor:theBgColor , delay: theDelay})
            //gsap.to(['.menu-top-bar' , '.menu-bottom-bar'], {duration: theDuration, ease:Power4.easeOut, color:theTextColor , delay: theDelay});
            //gsap.to('.home-body', {duration: theDuration, ease:Power4.easeOut, color:theTextColor, textStrokeColor:theTextColor , delay: theDelay});

            gsap.timeline()
            // show the image
            .fromTo(img.DOM.el,{ zIndex: this.zIndexVal, scale:0, opacity: 0 , x: cacheMousePos.x - img.rect.width/2 , y: cacheMousePos.y - img.rect.height/2 } , {
                //startAt: {opacity: 0, scale: 1},
                opacity: 1,
                scale: .6,
                duration: .15,
                //ease: "expo",
                zIndex: this.zIndexVal,
                x: cacheMousePos.x - img.rect.width/2,
                y: cacheMousePos.y - img.rect.height/2
            }, 0)
            // animate position
            .to(img.DOM.el, {
                duration: 1,
                ease: "expo",
                x: mousePos.x - img.rect.width/2,
                y: mousePos.y - img.rect.height/2
            }, "<")
            // then make it disappear
            .to(img.DOM.el, {
                duration:.3,  
                ease: "power4",
                opacity: 0
            }, 1.1)
            // scale down the image
            .to(img.DOM.el, {
                duration:.3,  
                ease: "quint",
                scale: 0.2
            }, 1.1);
        }
        destroy() {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
            // Animate all images out with the same scale down effect as in showNextImage
            const tl = gsap.timeline();
            this.images.forEach(img => {
                tl.to(img.DOM.el, {
                    opacity: 0,
                    scale: 0.2,
                    duration: 0.3,
                    ease: "quint"
                }, 0); // All at once
            });
            // After animation, reset styles
            tl.add(() => {
                this.images.forEach(img => {
                    gsap.set(img.DOM.el, img.defaultStyle);
                });
            });
            // Remove resize listeners as before
            this.images.forEach(img => {
                window.removeEventListener('resize', () => img.resize());
            });
        }
    }

    // Preload images
    const preloadImages = () => {
        return new Promise((resolve, reject) => {
            const images = document.querySelectorAll('.content__img');
            if (images.length === 0) {
                resolve();
                return;
            }
            
            // Use imagesLoaded with background option to ensure all images are truly loaded
            imagesLoaded(images, { background: true }, resolve);
        });
    };

    // And then..
    preloadImages().then(() => {
        // Remove the loader
        document.body.classList.remove('loading');
        // Immediately update all mouse position variables to the current mouse position on (re)activation
        const currentMouse = getMousePos();
        mousePos = lastMousePos = cacheMousePos = {x: currentMouse.x, y: currentMouse.y};
        imageTrailInstance = new ImageTrail();
        
        // Double-check all images are loaded and have valid dimensions
        imageTrailInstance.images.forEach(img => {
            img.getRect();
            if (!img.isLoaded) {
                console.warn('Image not fully loaded:', img.DOM.el);
            }
        });
    });

    // Return a cleanup function to remove the event listener
    return function cleanup() {
        window.removeEventListener('mousemove', handleMouseMove);
        if (imageTrailInstance && typeof imageTrailInstance.destroy === 'function') {
            imageTrailInstance.destroy();
            imageTrailInstance = null;
        }
        // Add any other cleanup logic here (timeouts, DOM changes, etc.)
    };
}
