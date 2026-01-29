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

// --- 3D INFINITE CAROUSEL LOGIC ---

// Start with a middle index, but it works from anywhere now
let activeIndex = 0; 
const items = document.querySelectorAll('.carousel-item');
const totalItems = items.length;

function updateCarousel(newIndex) {
    activeIndex = newIndex;

    items.forEach((item, index) => {
        // Reset all classes
        item.className = 'carousel-item';
        
        // Calculate the "circular distance"
        // This math figures out the shortest path to the active item
        let offset = index - activeIndex;

        // If the item is too far ahead, wrap it around to the back
        if (offset > totalItems / 2) {
            offset -= totalItems;
        }
        // If the item is too far behind, wrap it around to the front
        else if (offset < -totalItems / 2) {
            offset += totalItems;
        }

        // Apply classes based on the circular offset
        if (offset === 0) {
            item.classList.add('active');
        } else if (offset === -1) {
            item.classList.add('prev-1');
        } else if (offset === 1) {
            item.classList.add('next-1');
        } else if (offset === -2) {
            item.classList.add('prev-2');
        } else if (offset === 2) {
            item.classList.add('next-2');
        } else {
            // Hide everything else
            item.classList.add('hidden');
        }
    });
}

// Run once on load
updateCarousel(activeIndex);