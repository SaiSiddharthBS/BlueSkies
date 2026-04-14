// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Initialize Lenis Smooth Scrolling
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Integrate Lenis with GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time)=>{
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// --- Animation Logistics ---

const initAnimations = () => {

    // 1. Initial Loader
    const tlLoader = gsap.timeline();
    tlLoader.to('.loader', {
        yPercent: -100,
        duration: 1.2,
        ease: 'power4.inOut',
        delay: 0.5
    })
    .from('.title-word', {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out'
    }, "-=0.5")
    .from('.hero-subtitle', {
        opacity: 0,
        y: 20,
        duration: 1,
        ease: 'power2.out'
    }, "-=0.5");

    // 2. Custom Cursor
    const cursor = document.querySelector('.cursor');
    document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.1,
            ease: "power2.out"
        });
    });

    // 3. Hero Parallax Background Effect
    gsap.to('.hero-bg', {
        yPercent: 30, // move up relative to scroll
        ease: "none",
        scrollTrigger: {
            trigger: '.hero',
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });

    // 4. Horizontal Scroll Section
    const horizontalSections = gsap.utils.toArray('.horizontal-panel, .panel-img');
    const totalScrollWidth = 100 * (horizontalSections.length - 1);
    
    gsap.to(horizontalSections, {
        xPercent: -100 * (horizontalSections.length - 1),
        ease: "none",
        scrollTrigger: {
            trigger: '.horizontal-scroll-wrapper',
            pin: true,
            scrub: 1,
            snap: 1 / (horizontalSections.length - 1),
            start: "top top",
            end: () => "+=" + document.querySelector('.horizontal-scroll-container').offsetWidth
        }
    });

    // 5. Immersive Text Reveal Section
    const lines = gsap.utils.toArray('.line:not(.glow)');
    lines.forEach(line => {
        gsap.to(line, {
            opacity: 1,
            scrollTrigger: {
                trigger: '.data-impact',
                start: "top 70%",
                end: "center 40%",
                scrub: true
            }
        });
    });

    // 6. Magnetic Button Effect (Hover interaction)
    const btn = document.querySelector('.magnetic-btn');
    if (btn) {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(btn, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.5,
                ease: 'power3.out'
            });
        });
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    }
};

// Start animations directly since window load often takes time and CDN script might be sync/defer. Wait slightly for DOM font drawing.
setTimeout(() => {
    initAnimations();
}, 600);
