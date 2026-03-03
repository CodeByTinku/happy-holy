/* 
  Configuration
*/
const COLORS = [
    '#ec4899', /* Pink */
    '#f59e0b', /* Yellow/Amber */
    '#10b981', /* Green */
    '#3b82f6', /* Blue */
    '#a855f7', /* Purple */
    '#ef4444', /* Red */
    '#14b8a6'  /* Teal */
];

/* 
  Canvas Details - Confetti Implementation
*/
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');

let vpWidth = window.innerWidth;
let vpHeight = window.innerHeight;

canvas.width = vpWidth;
canvas.height = vpHeight;

window.addEventListener('resize', () => {
    vpWidth = window.innerWidth;
    vpHeight = window.innerHeight;
    canvas.width = vpWidth;
    canvas.height = vpHeight;
});

/* Confetti Particle Entity */
class Confetti {
    constructor() {
        this.x = Math.random() * vpWidth;
        this.y = Math.random() * vpHeight - vpHeight; /* Start falling from above */
        this.size = Math.random() * 8 + 4;
        this.speedY = Math.random() * 3 + 1.5; /* Vertical descent varying speed */
        this.speedX = Math.random() * 2 - 1; /* Slight horizontal drift */
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 10 - 5;
    }

    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotationSpeed;

        /* Reset particle to top when they fall off screen */
        if (this.y > vpHeight) {
            this.y = -10;
            this.x = Math.random() * vpWidth;
        }
        
        /* Slight wrap-around for X axis borders limit */
        if (this.x > vpWidth) this.x = 0;
        if (this.x < 0) this.x = vpWidth;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.fillStyle = this.color;
        
        /* Soft depth effect */
        ctx.shadowBlur = 2;
        ctx.shadowColor = 'rgba(0,0,0,0.15)';
        
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
    }
}

const particles = [];
/* Dynamic density based on available width */
const particleCount = Math.min(Math.floor(vpWidth / 10), 120);

for (let i = 0; i < particleCount; i++) {
    particles.push(new Confetti());
}

function animateConfetti() {
    ctx.clearRect(0, 0, vpWidth, vpHeight);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animateConfetti);
}

// Kick off
animateConfetti();


/*
  Click / Tap Splashes Implementation 
*/

document.addEventListener('click', (e) => {
    handleSplashEvent(e.clientX, e.clientY);
});

/* Listen defensively for mobile taps to ensure no delay */
document.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches.length > 0) {
        handleSplashEvent(e.touches[0].clientX, e.touches[0].clientY);
    }
}, {passive: true});

function handleSplashEvent(x, y) {
    const mainColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    
    // Large main focal splash
    createDropNode(x, y, Math.random() * 150 + 100, mainColor, 0);

    // Minor scattering droplets
    const dropletsCount = Math.floor(Math.random() * 6) + 5; // 5 to 10
    
    for (let i = 0; i < dropletsCount; i++) {
        // Disperse droplets in random radius
        const offsetX = (Math.random() - 0.5) * 220;
        const offsetY = (Math.random() - 0.5) * 220;
        
        const dropX = x + offsetX;
        const dropY = y + offsetY;
        
        const dropSize = Math.random() * 30 + 10;
        const dropDelay = Math.random() * 100; // brief delay gives pop stagger
        
        createDropNode(dropX, dropY, dropSize, mainColor, dropDelay);
    }
}

function createDropNode(x, y, size, color, delayMs) {
    const splash = document.createElement('div');
    splash.classList.add('splash');
    
    /* Apply dimensions and mapping */
    splash.style.left = `${x}px`;
    splash.style.top = `${y}px`;
    splash.style.width = `${size}px`;
    splash.style.height = `${size}px`;
    
    /* Paint radial fade to look slightly messy rather than perfect circle */
    splash.style.background = `radial-gradient(circle, ${color} 15%, transparent 75%)`;
    
    if (delayMs > 0) {
        splash.style.animationDelay = `${delayMs}ms`;
    }
    
    document.body.appendChild(splash);
    
    /* Garbage collection aligned with CSS keyframes */
    setTimeout(() => {
        if (document.body.contains(splash)) {
            splash.remove();
        }
    }, 1200 + delayMs);
}
