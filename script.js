AOS.init();

// Main Canvas (Visible)
const canvas = document.getElementById('treeCanvas');
const ctx = canvas.getContext('2d');
const container = document.getElementById('treeContainer');

// Off-screen Canvas (Invisible "Cache")
// We draw the tree here ONCE, then copy it to the main screen.
const staticCanvas = document.createElement('canvas');
const staticCtx = staticCanvas.getContext('2d');

let w, h;

// Colors: Pinks, Reds, Yellows
const heartColors = ['#ff4d6d', '#ff758f', '#ffb3c1', '#ff0000', '#ffd60a'];

function resize() {
    w = container.offsetWidth;
    h = container.offsetHeight;
    
    // Resize both canvases
    canvas.width = w;
    canvas.height = h;
    staticCanvas.width = w;
    staticCanvas.height = h;
    
    // Re-draw the static tree immediately after resizing
    generateStaticTree();
}

window.addEventListener('resize', resize);

// Helper: Draw a Heart shape
function drawHeart(context, x, y, size, color, angle) {
    context.save();
    context.translate(x, y);
    context.rotate(angle);
    context.fillStyle = color;
    context.beginPath();
    context.moveTo(0, 0);
    context.bezierCurveTo(0, -size/2, -size, -size/2, -size, 0);
    context.bezierCurveTo(-size, size/2, 0, size, 0, size * 1.5);
    context.bezierCurveTo(0, size, size, size/2, size, 0);
    context.bezierCurveTo(size, -size/2, 0, -size/2, 0, 0);
    context.fill();
    context.restore();
}

// --- TREE GENERATION (RUNS ONCE) ---
// This function draws onto the 'staticCtx', NOT the main screen.
function drawBranch(context, startX, startY, len, angle, branchWidth, depth) {
    context.beginPath();
    context.save();
    
    context.translate(startX, startY);
    context.rotate(angle * Math.PI / 150);
    context.moveTo(0, 0);
    
    // Draw Branch
    context.strokeStyle = "#1a0b00"; 
    context.fillStyle = "#1a0b00";
    context.lineWidth = branchWidth;
    context.lineCap = "round";
    context.lineTo(0, -len);
    context.stroke();

    // Draw Leaves (Hearts)
    if (depth < 1) {
        const leafCount = (depth < 1) ? 19 : 1; 
        
        for (let i = 0; i < leafCount; i++) {
            // Because this runs once, these random positions are "frozen" forever
            const range = (depth < 1) ? 150 : 50; 
            const leafX = (Math.random() * range) - (range/2); 
            const leafY = -len + (Math.random() * range) - (range/2);
            const size = Math.random() * 12 + 6; 
            const color = heartColors[Math.floor(Math.random() * heartColors.length)];
            const leafAngle = (Math.random() * 90 - 45) * Math.PI / 180;
            
            drawHeart(context, leafX, leafY, size, color, leafAngle);
        }
    }

    if (depth < 1) {
        context.restore();
        return;
    }

    drawBranch(context, 0, -len, len * 0.75, 25, branchWidth * 0.7, depth - 1);
    drawBranch(context, 0, -len, len * 0.75, -25, branchWidth * 0.7, depth - 1);

    context.restore();
}

function generateStaticTree() {
    // Clear the memory canvas
    staticCtx.clearRect(0, 0, w, h);
    
    // Draw the tree into memory ONE TIME
    // 150 = Size, 11 = Detail/Depth
    drawBranch(staticCtx, w / 2, h, 150, 0, 30, 11);
}

// --- FALLING PETALS SYSTEM (ANIMATED) ---
let fallingPetals = [];
let time = 0; 

class Petal {
    constructor() {
        this.reset();
        this.y = Math.random() * h; 
    }
    
    reset() {
        this.x = w / 2 + (Math.random() * 500 - 250); 
        this.y = -50;
        this.size = Math.random() * 8 + 4;
        this.speedY = Math.random() * 0.5 + 0.2; 
        this.swayOffset = Math.random() * Math.PI * 2;
        this.color = heartColors[Math.floor(Math.random() * heartColors.length)];
    }
    
    update() {
        this.y += this.speedY; 
        this.x += Math.sin(time * 0.002 + this.swayOffset) * 0.5;
        if (this.y > h) this.reset();
    }
    
    draw() {
        // Draw onto the MAIN context, because these move
        ctx.save();
        ctx.globalAlpha = 0.8;
        drawHeart(ctx, this.x, this.y, this.size, this.color, 0);
        ctx.restore();
    }
}

// Initialize Falling Petals
for (let i = 0; i < 60; i++) fallingPetals.push(new Petal());

// First run initialization
resize();

// --- MAIN ANIMATION LOOP ---
function animate() {
    // 1. Clear the screen
    ctx.clearRect(0, 0, w, h);
    
    time++; 
    
    // 2. Draw the Frozen Tree Image (Just copying the picture)
    // Since we are copying an image, NO calculations happen, so NO flickering possible.
    ctx.drawImage(staticCanvas, 0, 0);
    
    // 3. Draw Falling Petals (Animated)
    fallingPetals.forEach(p => {
        p.update();
        p.draw();
    });
    
    requestAnimationFrame(animate);
}

animate();

// --- MATRIX "NO" BUTTON ---
const noHand = document.getElementById('noHand');
noHand.addEventListener('mouseover', () => {
    const x = (Math.random() * 300) - 150;
    const y = (Math.random() * 300) - 150;
    noHand.style.transform = `translate(${x}px, ${y}px)`;
});