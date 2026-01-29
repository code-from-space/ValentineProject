// Simple scroll animation observer
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        } 
    });
});

// Select all elements you want to animate on scroll
const hiddenElements = document.querySelectorAll('.card, .service-item, .project-card, h2, form');

// Add the 'hidden' class to them initially and observe them
hiddenElements.forEach((el) => {
    el.classList.add('hidden');
    observer.observe(el);
});

// Button ripple effect
const buttons = document.querySelectorAll('button, .btn-primary, .btn-large');

buttons.forEach(btn => {
    btn.addEventListener('mouseenter', function(e) {
        let x = e.clientX - e.target.offsetLeft;
        let y = e.clientY - e.target.offsetTop;
        // You can add more complex JS effects here if needed
    });
});


// --- SCROLLING GALLERY ANIMATION ---

const row1 = document.querySelector('.row-1');
const row2 = document.querySelector('.row-2');

// We listen for the scroll event on the window
window.addEventListener('scroll', () => {
    // Get the current scroll position
    const scrollPosition = window.scrollY;

    // Determine speed. Lower number = slower movement.
    const speed = 0.2; 

    // Move Row 1 to the LEFT based on scroll amount
    row1.style.transform = `translateX(-${scrollPosition * speed}px)`;

    // Move Row 2 to the RIGHT. 
    // We add an initial offset of -20% (matching CSS) so it starts shifted left and moves right.
    row2.style.transform = `translateX(calc(-20% + ${scrollPosition * speed}px))`;
});