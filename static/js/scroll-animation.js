document.addEventListener('DOMContentLoaded', () => {
    // Select all elements that should be animated on scroll
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    // If there are no elements to animate, do nothing
    if (animatedElements.length === 0) {
        return;
    }

    // Create an observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // If the element is in the viewport
            if (entry.isIntersecting) {
                // Add the 'visible' class to trigger the animation
                entry.target.classList.add('visible');
                // Stop observing the element so the animation only happens once
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1 // Trigger when 10% of the element is visible
    });

    // Tell the observer to watch each of the animated elements
    animatedElements.forEach(element => {
        observer.observe(element);
    });

    // --- Logic for the sticky header ---
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
});