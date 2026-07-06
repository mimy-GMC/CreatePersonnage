// VARIABLE D'ÉTAT
let currentExpression = 'smile';
let isLaughing = false;
let laughTimeout = null;

// SUIVI DES YEUX
document.addEventListener('mousemove', function(e) {
    const headRect = document.getElementById('head').getBoundingClientRect();
    const headX = headRect.left + headRect.width / 2;
    const headY = headRect.top + headRect.height / 2;
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    const maxMove = 6;
    const dx = (mouseX - headX) / 30;
    const dy = (mouseY - headY) / 30;
    const clampedX = Math.max(-maxMove, Math.min(maxMove, dx));
    const clampedY = Math.max(-maxMove, Math.min(maxMove, dy));

    document.getElementById('pupilL').style.transform =
        `translate(calc(-50% + ${clampedX}px), calc(-50% + ${clampedY}px))`;
    document.getElementById('pupilR').style.transform =
        `translate(calc(-50% + ${clampedX}px), calc(-50% + ${clampedY}px))`;
});

// CHANGEMENT D'EXPRESSION
function changeExpression(type) {
    if (isLaughing) return;

    const mouth = document.getElementById('mouth');
    // Retirer toutes les classes et styles inline
    mouth.classList.remove('smile', 'surprise', 'neutral', 'speak', 'laugh-mouth');
    mouth.style.animation = '';
    mouth.style.transform = '';
    mouth.style.borderRadius = '';
    mouth.style.width = '';
    mouth.style.height = '';
    mouth.style.bottom = '';
    mouth.style.background = '';
    mouth.style.left = '50%';

    // Appliquer la nouvelle expression
    if (type === 'smile') {
        mouth.classList.add('smile');
    } else if (type === 'surprise') {
        mouth.classList.add('surprise');
    } else if (type === 'neutral') {
        mouth.classList.add('neutral');
    } else if (type === 'speak') {
        mouth.classList.add('speak');
    }
    currentExpression = type;
}

// ─── CHANGEMENT DE COULEUR ───
let colorIndex = 0;
const colors = ['#e74c6f', '#3498db', '#2ecc71', '#f1c40f', '#9b59b6', '#e67e22'];

function changeColor() {
    colorIndex = (colorIndex + 1) % colors.length;
    const newColor = colors[colorIndex];
    document.getElementById('topClothing').style.background =
        `linear-gradient(180deg, ${newColor}, ${adjustColor(newColor, -20)})`;
    const skirt = document.getElementById('skirt');
    const skirtColor = colors[(colorIndex + 2) % colors.length];
    skirt.style.background =
        `linear-gradient(180deg, ${skirtColor}, ${adjustColor(skirtColor, -30)})`;
}

function adjustColor(hex, percent) {
    const num = parseInt(hex.slice(1), 16);
    const r = Math.max(0, Math.min(255, (num >> 16) + percent));
    const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + percent));
    const b = Math.max(0, Math.min(255, (num & 0x0000FF) + percent));
    return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
}

// ─── FONCTION RIRE ───
function triggerLaugh() {
    if (isLaughing) return;
    isLaughing = true;

    const savedExpression = currentExpression;

    const character = document.getElementById('character');
    const head = document.getElementById('head');
    const mouth = document.getElementById('mouth');
    const browL = document.getElementById('browL');
    const browR = document.getElementById('browR');
    const eyeL = document.getElementById('eyeL');
    const eyeR = document.getElementById('eyeR');
    const cheekL = document.getElementById('cheekL');
    const cheekR = document.getElementById('cheekR');
    const armL = document.getElementById('armL');
    const armR = document.getElementById('armR');
    const bubble = document.getElementById('laughBubble');
    const hint = document.getElementById('clickHint');

    hint.classList.add('hidden');

    character.classList.add('laughing');
    head.classList.add('laugh-head');

    mouth.classList.remove('smile', 'surprise', 'neutral', 'speak');
    mouth.classList.add('laugh-mouth');
    mouth.style.animation = 'laughMouth 0.3s ease-in-out 5';
    mouth.style.left = '50%';

    browL.classList.add('laugh-brow-left');
    browR.classList.add('laugh-brow-right');

    eyeL.classList.add('laugh-eye');
    eyeR.classList.add('laugh-eye');
    eyeL.style.animation = 'none';
    eyeR.style.animation = 'none';

    cheekL.classList.add('laugh-cheek');
    cheekR.classList.add('laugh-cheek');

    armL.classList.add('laugh-arm');
    armR.classList.add('laugh-arm');

    bubble.classList.add('show');

    clearTimeout(laughTimeout);
    laughTimeout = setTimeout(function() {
        character.classList.remove('laughing');
        head.classList.remove('laugh-head');
        mouth.classList.remove('laugh-mouth');
        mouth.style.animation = '';
        browL.classList.remove('laugh-brow-left');
        browR.classList.remove('laugh-brow-right');
        eyeL.classList.remove('laugh-eye');
        eyeR.classList.remove('laugh-eye');
        eyeL.style.animation = '';
        eyeR.style.animation = '';
        cheekL.classList.remove('laugh-cheek');
        cheekR.classList.remove('laugh-cheek');
        armL.classList.remove('laugh-arm');
        armR.classList.remove('laugh-arm');
        bubble.classList.remove('show');

        changeExpression(savedExpression);
        isLaughing = false;
    }, 2000);
}

// ─── ÉVÉNEMENTS ───
document.getElementById('torso').addEventListener('click', triggerLaugh);
document.getElementById('torso').addEventListener('touchstart', function(e) {
    e.preventDefault();
    triggerLaugh();
});

document.getElementById('head').addEventListener('click', function(e) {
    if (isLaughing) return;
    const expr = ['smile', 'surprise', 'neutral', 'speak'];
    let idx = expr.indexOf(currentExpression);
    idx = (idx + 1) % expr.length;
    changeExpression(expr[idx]);
});

// INITIALISATION
document.addEventListener('DOMContentLoaded', function() {
    changeExpression('smile');
});