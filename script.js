// Register JS Plugins
gsap.registerPlugin(ScrollTrigger);

// Initialize Smooth Scroll
const lenis = new Lenis({
    duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
    direction: 'vertical', gestureDirection: 'vertical', smooth: true, mouseMultiplier: 1,
});
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);

// Lenis + GSAP sync
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);

// Random number utility for telemetry
const getRandom = (min, max) => (Math.random() * (max - min) + min).toFixed(2);

const initAnimations = () => {
    // 1. Loader Exit
    gsap.timeline()
        .to('.loader', { yPercent: -100, duration: 1.2, ease: 'power4.inOut', delay: 0.5 })
        .from('.title-word', { y: 100, opacity: 0, duration: 1, stagger: 0.2, ease: 'power3.out' }, "-=0.5")
        .from('.hero-subtitle', { opacity: 0, y: 20, duration: 1, ease: 'power2.out' }, "-=0.5");

    // 2. Trailing Plasma Cursor
    const cursor = document.querySelector('.cursor');
    const trails = gsap.utils.toArray('.cursor-trail');
    const mouse = { x: window.innerWidth/2, y: window.innerHeight/2 };
    
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        gsap.to(cursor, { x: mouse.x, y: mouse.y, duration: 0.1, ease: "power2.out" });
        // Delay each trail dot sequentially to create the "snake" or "plasma" effect
        trails.forEach((trail, i) => {
            gsap.to(trail, { x: mouse.x, y: mouse.y, duration: 0.4, delay: i * 0.05, ease: "power2.out" });
        });
    });

    // 3. Hero Parallax
    gsap.to('.hero-bg', {
        yPercent: 30, ease: "none",
        scrollTrigger: { trigger: '.hero', start: "top top", end: "bottom top", scrub: true }
    });

    // 4. Horizontal Scroll
    const horizontalSections = gsap.utils.toArray('.horizontal-panel, .panel-img');
    gsap.to(horizontalSections, {
        xPercent: -100 * (horizontalSections.length - 1), ease: "none",
        scrollTrigger: {
            trigger: '.horizontal-scroll-wrapper', pin: true, scrub: 1,
            snap: 1 / (horizontalSections.length - 1),
            start: "top top", end: () => "+=" + document.querySelector('.horizontal-scroll-container').offsetWidth,
            onUpdate: (self) => {
                // Show telemetry widget aggressively during horizontal scroll
                const telemetry = document.querySelector('.telemetry-widget');
                if (self.progress > 0 && self.progress < 1) telemetry.classList.add('active');
                else telemetry.classList.remove('active');
            }
        }
    });

    // 5. Live Telemetry Random Data Injector
    setInterval(() => {
        const widget = document.querySelector('.telemetry-widget');
        if (widget.classList.contains('active')) {
            document.getElementById('stat-nodes').innerText = Math.floor(getRandom(14000, 14500)).toLocaleString();
            document.getElementById('stat-latency').innerText = getRandom(0.9, 1.3);
            document.getElementById('stat-bw').innerText = Math.floor(getRandom(400, 500));
        }
    }, 200); // 5 FPS fluctuations for tech feel

    // 6. SVG Laser Node Map Connection (Simulating DrawSVG)
    const lasers = gsap.utils.toArray('.laser-line');
    lasers.forEach(laser => {
        // Calculate exact length of the SVG path
        const length = laser.getTotalLength();
        gsap.set(laser, { strokeDasharray: length, strokeDashoffset: length });
        
        gsap.to(laser, {
            strokeDashoffset: 0,
            scrollTrigger: { trigger: '.map-section', start: "top 60%", end: "center center", scrub: true }
        });
    });

    // 7. Immersive Text Reveal
    const lines = gsap.utils.toArray('.line:not(.glow)');
    lines.forEach(line => {
        gsap.to(line, {
            opacity: 1,
            scrollTrigger: { trigger: '.data-impact', start: "top 70%", end: "center 40%", scrub: true }
        });
    });

    // 8. Magnetic Footer Button
    const btn = document.querySelector('.magnetic-btn');
    if(btn) {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            gsap.to(btn, { x: (e.clientX - rect.left - rect.width/2) * 0.3, y: (e.clientY - rect.top - rect.height/2) * 0.3, duration: 0.5, ease: 'power3.out' });
        });
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
        });
    }

    // 9. Initialize Vanilla-Tilt programmatically
    VanillaTilt.init(document.querySelectorAll(".tier-card"), {
        max: 15,
        speed: 400,
        glare: true,
        "max-glare": 0.4,
    });
};

setTimeout(initAnimations, 600);
