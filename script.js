/* =========================================
   PART 1: THE PERFECT TREE (Fuller & Falling Leaves)
   ========================================= */
const canvas = document.getElementById('treeCanvas');
const ctx = canvas.getContext('2d');

let treeData = null; 
let fallingLeaves = []; // Array to store the falling leaves

// Configuration
const branchColor = "#1a0505"; 
const leafColors = ["#ff4d6d", "#ff758f", "#c9184a", "#ffccd5", "#ff8fa3"]; 

// 1. GENERATE THE TREE DATA (Run Once)
function buildBranch(depth, length, width) {
    const branch = {
        length: length,
        width: width,
        leaves: [],
        left: null,
        right: null
    };

    // TIP ZONE: Add LOTS of static leaves here for that "Heart Shape" density
    if (length < 20) {
        // INCREASED DENSITY: Changed from 18 to 35 leaves per tip
        for (let i = 0; i < 35; i++) {
            branch.leaves.push({
                x: (Math.random() - 0.5) * 60, // Wider spread (60px)
                y: (Math.random() - 0.5) * 50 - length, 
                size: Math.random() * 9 + 8,
                color: leafColors[Math.floor(Math.random() * leafColors.length)],
                angle: (Math.random() - 0.5) * Math.PI 
            });
        }
        return branch; 
    }

    // Recursion: Standard "Stable" Angles (25 degrees)
    branch.left = buildBranch(depth + 1, length * 0.75, width * 0.7);
    branch.right = buildBranch(depth + 1, length * 0.75, width * 0.7);

    return branch;
}

// 2. RESIZE & REBUILD
function initTree() {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
    
    // Stable Trunk: 20% height, 50px width
    const trunkHeight = canvas.height * 0.20;
    treeData = buildBranch(0, trunkHeight, 50);
}

window.addEventListener('resize', initTree);
initTree(); 

// 3. DRAW HELPER
function drawHeart(x, y, size, color, angle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle); 
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-size / 2, -size / 2, -size, size / 3, 0, size);
    ctx.bezierCurveTo(size, size / 3, size / 2, -size / 2, 0, 0);
    ctx.fill();
    ctx.restore();
}

// 4. DRAW STATIC TREE
function drawTree(branch, angleOffset, time) {
    if (!branch) return;

    ctx.save();
    
    // Gentle Sway for branches
    const sway = Math.sin(time * 0.002 + branch.length) * (20 / branch.length); 
    const finalAngle = angleOffset + sway;
    
    ctx.rotate(finalAngle * Math.PI / 180);
    ctx.lineWidth = branch.width;
    ctx.lineCap = "round";
    ctx.strokeStyle = branchColor;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -branch.length);
    ctx.stroke();

    // Draw Static Leaves
    if (branch.leaves.length > 0) {
        for (let leaf of branch.leaves) {
            drawHeart(leaf.x, leaf.y, leaf.size, leaf.color, leaf.angle);
        }
    }

    ctx.translate(0, -branch.length);
    drawTree(branch.left, 25, time);
    drawTree(branch.right, -25, time);

    ctx.restore();
}

// 5. ANIMATION LOOP (Includes Falling Leaves)
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const time = Date.now();

    // A. Draw the Static Tree
    if (treeData) {
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height);
        drawTree(treeData, 0, time);
        ctx.restore();
    }

    // B. Spawn New Falling Leaves (The "From Tree" Effect)
    // We spawn them in the general area of the tree crown
    if (Math.random() < 0.05) { // 5% chance per frame to spawn a leaf
        fallingLeaves.push({
            // Spawn x: Center +/- 150px
            x: canvas.width / 2 + (Math.random() - 0.5) * 300, 
            // Spawn y: Top area (10% to 50% of screen height)
            y: canvas.height * 0.1 + Math.random() * (canvas.height * 0.4),
            size: Math.random() * 8 + 6,
            color: leafColors[Math.floor(Math.random() * leafColors.length)],
            speedY: Math.random() * 1 + 1, // Fall speed
            speedX: Math.random() * 2 - 1, // Drift speed
            opacity: 1,
            angle: Math.random() * Math.PI
        });
    }

    // C. Update & Draw Falling Leaves
    for (let i = 0; i < fallingLeaves.length; i++) {
        let leaf = fallingLeaves[i];
        
        ctx.globalAlpha = leaf.opacity;
        drawHeart(leaf.x, leaf.y, leaf.size, leaf.color, leaf.angle);
        ctx.globalAlpha = 1.0;

        // Physics
        leaf.y += leaf.speedY;
        leaf.x += leaf.speedX;
        leaf.angle += 0.02; // Rotate while falling
        leaf.opacity -= 0.003; // Fade out slowly

        // Remove if invisible
        if (leaf.opacity <= 0) {
            fallingLeaves.splice(i, 1);
            i--;
        }
    }
    
    requestAnimationFrame(animate);
}

animate();


/* =========================================
   PART 2: SCROLL & MATRIX LOGIC
   ========================================= */
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('scroll-visible');
        }
    });
});

const hiddenElements = document.querySelectorAll('.scroll-hidden');
hiddenElements.forEach((el) => observer.observe(el));

const bluePill = document.getElementById('bluePillWrapper');
if(bluePill){
    bluePill.addEventListener('click', (e) => {
        alert("System Error: Love is inevitable. Try the Red Pill.");
    });
    bluePill.addEventListener('mouseover', () => {
        const x = Math.random() * 100 - 50;
        const y = Math.random() * 100 - 50;
        bluePill.style.transform = `translate(${x}px, ${y}px)`;
    });
}