// 1. Scroll-Triggered Animations for Gallery
// This watches the screen to see when photos appear
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('scroll-visible'); // Add CSS class to show it
        }
    });
});

// Grab all elements with 'scroll-hidden' class
const hiddenElements = document.querySelectorAll('.scroll-hidden');
hiddenElements.forEach((el) => observer.observe(el));


// 2. The Blue Pill Trick (Optional Fun)
// When they try to click the Blue Pill (NO), it says "Try Again"
const bluePill = document.getElementById('bluePillWrapper');

bluePill.addEventListener('click', (e) => {
    alert("System Error: You can't say no to this interface. Try the Red Pill.");
});

// Optional: Make Blue Pill move slightly away if they get too close (Matrix Glitch)
bluePill.addEventListener('mouseover', () => {
    const x = Math.random() * 50 - 25; // Random move left/right
    const y = Math.random() * 50 - 25; // Random move up/down
    bluePill.style.transform = `translate(${x}px, ${y}px)`;
});