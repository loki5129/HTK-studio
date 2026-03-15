const starCanvas = document.getElementById('starfield');
const starCtx = starCanvas.getContext('2d');

function resizeStarfield() {
    starCanvas.width = window.innerWidth;
    starCanvas.height = window.innerHeight;
}
resizeStarfield();
window.addEventListener('resize', resizeStarfield);

const STAR_COUNT = 120;
const stars = [];

for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: Math.random() * 1.2 + 0.2,
        speed: Math.random() * 0.3 + 0.05,
        opacity: Math.random() * 0.5 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleDir: Math.random() > 0.5 ? 1 : -1
    });
}

function drawStars() {
    starCtx.clearRect(0, 0, starCanvas.width, starCanvas.height);

    for (const star of stars) {
        star.opacity += star.twinkleSpeed * star.twinkleDir;
        if (star.opacity >= 0.7) { star.opacity = 0.7; star.twinkleDir = -1; }
        if (star.opacity <= 0.1) { star.opacity = 0.1; star.twinkleDir = 1; }

        star.y += star.speed;
        if (star.y > starCanvas.height) {
            star.y = 0;
            star.x = Math.random() * starCanvas.width;
        }

        starCtx.beginPath();
        starCtx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        starCtx.fillStyle = `rgba(180, 210, 255, ${star.opacity})`;
        starCtx.fill();
    }

    requestAnimationFrame(drawStars);
}

drawStars();
