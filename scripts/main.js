// Main JavaScript file for Figma Coding Challenge

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Opportunity Week - Figma Coding Challenge loaded successfully!');
    
    // Initialize any interactive elements here
    initializeApp();
});

/**
 * Initialize the application
 */
function initializeApp() {
    // Add any initialization logic here
    console.log('App initialized');
    
    // Example: Add smooth scrolling for anchor links
    addSmoothScrolling();
    
    // Add navbar scroll behavior
    addNavbarScrollBehavior();
    
    // Add typing animation to hero headline and subtext
    const headlineEl = document.querySelector('.hero__headline');
    if (headlineEl) {
        typeTextIntoElement(headlineEl, { typingSpeedMs: 50, startDelayMs: 300, endHoldMs: 1200, loop: false });
    }
    // Example: Add mobile menu toggle if needed
    // addMobileMenuToggle();
}

/**
 * Add smooth scrolling behavior for anchor links
 */
function addSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    console.log('Found anchor links:', links.length);
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            console.log('Clicked link:', this.textContent, 'Target ID:', targetId);
            console.log('Target element found:', targetElement);
            
            if (targetElement) {
                console.log('Scrolling to element...');
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            } else {
                console.log('Target element not found for:', targetId);
            }
        });
    });
}

/**
 * Add navbar scroll behavior - shrink navbar when scrolling
 */
function addNavbarScrollBehavior() {
    const header = document.querySelector('.header');
    
    console.log('Header element found:', header);
    
    if (!header) {
        console.log('No header element found!');
        return;
    }
    
    // Debounced scroll handler for better performance
    const handleScroll = debounce(() => {
        const scrollY = window.scrollY;
        console.log('Scroll position:', scrollY);
        
        // Add scrolled class when scrolled down more than 20px
        if (scrollY > 20) {
            header.classList.add('scrolled');
            console.log('Navbar scrolled - class added, classes:', header.className);
        } else {
            header.classList.remove('scrolled');
            console.log('Navbar at top - class removed, classes:', header.className);
        }
    }, 10);
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    console.log('Scroll event listener added');
}

/**
 * Utility function to debounce function calls
 * Useful for scroll events, resize events, etc.
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Utility function to check if element is in viewport
 * Useful for animations and lazy loading
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Export functions for use in other modules if needed
window.FigmaChallenge = {
    initializeApp,
    addSmoothScrolling,
    addNavbarScrollBehavior,
    debounce,
    isInViewport
};

/**
 * Generic typing effect for any element
 */
function typeTextIntoElement(element, {
    typingSpeedMs = 50,
    startDelayMs = 300,
    endHoldMs = 1000,
    loop = false
} = {}) {
    if (!element) return;
    const originalText = element.textContent.trim();
    if (!originalText) return;
    if (element.dataset.typingInitialized === 'true') return;
    element.dataset.typingInitialized = 'true';

    const contentSpan = document.createElement('span');
    contentSpan.className = 'typing__content';
    contentSpan.setAttribute('aria-label', originalText);
    contentSpan.textContent = '';

    element.textContent = '';
    element.appendChild(contentSpan);
    element.classList.add('typing-active');

    const characters = Array.from(originalText);
    let index = 0;

    function typeNext() {
        if (index < characters.length) {
            contentSpan.textContent += characters[index];
            index += 1;
            setTimeout(typeNext, typingSpeedMs);
        } else {
            setTimeout(() => {
                element.classList.remove('typing-active');
                if (loop) {
                    setTimeout(() => {
                        index = 0;
                        contentSpan.textContent = '';
                        element.classList.add('typing-active');
                        setTimeout(typeNext, typingSpeedMs);
                    }, 300);
                }
            }, endHoldMs);
        }
    }

    setTimeout(typeNext, startDelayMs);
}
