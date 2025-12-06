/* KAIZU EDITS - JS */

// ... [Previous variables stay the same] ... 
const cardContainer = document.getElementById('card-container');
const card = document.getElementById('card');
const boomBox = document.getElementById('boom-box');
const mainEmoji = document.getElementById('main-emoji');
const subtitle = document.getElementById('dynamic-text');
const linkItems = document.querySelectorAll('.link-item');
const modal = document.getElementById('welcome-modal'); // New Modal Variable

// Sounds
const sfxHover = document.getElementById('sfx-hover');
const sfxClick = document.getElementById('sfx-click');
const sfxMagic = document.getElementById('sfx-magic');
const sfxSwitch = document.getElementById('sfx-switch');

if(sfxHover) sfxHover.volume = 0.2;
if(sfxClick) sfxClick.volume = 0.3;
if(sfxMagic) sfxMagic.volume = 0.4;
if(sfxSwitch) sfxSwitch.volume = 0.3;

function playSound(audio) {
    if(audio) {
        audio.currentTime = 0;
        audio.play().catch(e=>{});
    }
}

// --- NEW: ON LOAD CELEBRATION ---
window.onload = function() {
    // 1. Show Modal with animation
    setTimeout(() => {
        modal.classList.add('show');
        playSound(sfxMagic); // Play magic sound for the pop up
        fireConfetti(); // Trigger confetti
    }, 500); // Small delay for smoothness
};

// --- NEW: CLOSE MODAL FUNCTION ---
window.closeModal = function() {
    playSound(sfxClick);
    modal.classList.remove('show');
    // Optional: Fire small confetti again when closing
    fireConfetti();
}

// --- NEW: CONFETTI LOGIC ---
function fireConfetti() {
    var duration = 3 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 2000 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    var interval = setInterval(function() {
      var timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      var particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
}


// ... [KEEP ALL PREVIOUS JS LOGIC BELOW (3D Tilt, Themes, etc.)] ...

const defaultText = "Video Editor • Anime • Vibes";
let isBooming = false;

// 1. 3D Tilt
if (window.matchMedia("(min-width: 768px)").matches) {
    cardContainer.addEventListener('mousemove', (e) => {
        const xAxis = (window.innerWidth / 2 - e.pageX) / 30;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 30;
        card.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    });
    cardContainer.addEventListener('mouseleave', () => {
        card.style.transform = `rotateY(0deg) rotateX(0deg)`;
    });
}

// 2. Boom Effect
function triggerBoom() {
    if (isBooming) return;
    isBooming = true;
    boomBox.classList.add('boom-active');
    playSound(sfxMagic);

    const flash = document.createElement('div');
    flash.style.position = 'absolute';
    flash.style.top = '50%'; left = '50%';
    flash.style.transform = 'translate(-50%, -50%)';
    flash.style.width = '20px'; flash.style.height = '20px';
    flash.style.borderRadius = '50%';
    flash.style.background = 'radial-gradient(circle, rgba(255,255,220,1) 0%, rgba(255,215,0,0.8) 40%, rgba(255,215,0,0) 70%)';
    flash.style.transition = 'all 0.5s ease-out';
    flash.style.zIndex = '-1';
    boomBox.appendChild(flash);

    requestAnimationFrame(() => {
        flash.style.transform = 'translate(-50%, -50%) scale(20)';
        flash.style.opacity = '0';
    });

    setTimeout(() => {
        boomBox.classList.remove('boom-active');
        flash.remove();
        isBooming = false;
    }, 500);
}
boomBox.addEventListener('click', triggerBoom);
boomBox.addEventListener('touchstart', triggerBoom, {passive: true});

// 3. Theme & Text & Logo Swap
function activateLink(element) {
    playSound(sfxHover);
    const newEmoji = element.getAttribute('data-emoji');
    const newText = element.getAttribute('data-text');
    const themeClass = element.getAttribute('data-theme');

    document.body.classList.add(themeClass);

    subtitle.innerText = newText;
    subtitle.style.color = "var(--accent-color)";
    subtitle.style.transform = "scale(1.05)";

    mainEmoji.innerText = newEmoji;

    if (!isBooming) {
        boomBox.classList.add('swapped');
    }
}

function deactivateLink() {
    document.body.classList.remove('theme-youtube', 'theme-instagram', 'theme-whatsapp');

    subtitle.innerText = defaultText;
    subtitle.style.color = "var(--text-color)";
    subtitle.style.transform = "scale(1)";

    if (!isBooming) {
        boomBox.classList.remove('swapped');
    }
}

linkItems.forEach(link => {
    link.addEventListener('mouseenter', () => activateLink(link));
    link.addEventListener('mouseleave', deactivateLink);
    link.addEventListener('touchstart', (e) => activateLink(link), {passive: true});
    link.addEventListener('touchend', () => setTimeout(deactivateLink, 800));
    link.addEventListener('click', () => playSound(sfxClick));
});

// 4. Global Theme Toggle
function toggleGlobalTheme() {
    playSound(sfxSwitch);
    const body = document.body;
    if (body.classList.contains('light-mode')) {
        body.classList.remove('light-mode');
    } else {
        body.classList.add('light-mode');
    }
}

// 5. Ripple
function createRipple(event) {
    const button = event.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    const rect = button.getBoundingClientRect();
    let clientX = event.clientX; let clientY = event.clientY;
    if(event.touches && event.touches.length > 0) { clientX = event.touches[0].clientX; clientY = event.touches[0].clientY; }
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${clientX - rect.left - radius}px`;
    circle.style.top = `${clientY - rect.top - radius}px`;
    circle.classList.add("ripple");
    const ripple = button.getElementsByClassName("ripple")[0];
    if (ripple) { ripple.remove(); }
    button.appendChild(circle);
}
const buttons = document.getElementsByClassName("ripple-btn");
for (const button of buttons) {
    button.addEventListener("click", createRipple);
    button.addEventListener("touchstart", createRipple, {passive: true});
}

// 6. Particles
const particleContainer = document.getElementById('particles');
function createStar() {
    const star = document.createElement('div');
    const size = Math.random() * 3 + 1;
    star.style.width = size + 'px';
    star.style.height = size + 'px';
    star.style.background = 'var(--particle-color)';
    star.style.position = 'absolute';
    star.style.left = Math.random() * 100 + 'vw';
    star.style.top = Math.random() * 100 + 'vh';
    star.style.borderRadius = '50%';
    star.style.opacity = Math.random() * 0.5 + 0.2;
    star.style.animation = `pulse ${Math.random() * 4 + 2}s infinite alternate`;
    star.style.transition = 'background 1s ease';
    particleContainer.appendChild(star);
}
for(let i=0; i<40; i++) { createStar(); }
