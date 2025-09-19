// Main JavaScript file for Figma Coding Challenge - Updated for smooth scrolling

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
    // Add mobile menu toggle functionality
    addMobileMenuToggle();
    
    // Add button click state handling
    addButtonClickHandling();
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
                
                // Get the header height to offset the scroll position
                const header = document.querySelector('.header');
                const headerHeight = header ? header.offsetHeight : 0;
                
                // Calculate the target position with header offset
                let targetPosition;
                
                // Special handling for contact section - scroll to bottom of screen
                if (targetId === '#contact') {
                    // Scroll to the bottom of the document to show the full contact section
                    targetPosition = document.documentElement.scrollHeight - window.innerHeight;
                } else {
                    targetPosition = targetElement.offsetTop - headerHeight - 20; // 20px extra padding for other sections
                }
                
                // Use a more reliable smooth scrolling approach
                const startPosition = window.pageYOffset;
                const distance = targetPosition - startPosition;
                const duration = 800; // 800ms animation
                let start = null;
                
                function animation(currentTime) {
                    if (start === null) start = currentTime;
                    const timeElapsed = currentTime - start;
                    const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
                    window.scrollTo(0, run);
                    if (timeElapsed < duration) requestAnimationFrame(animation);
                }
                
                // Easing function for smooth animation
                function easeInOutQuad(t, b, c, d) {
                    t /= d / 2;
                    if (t < 1) return c / 2 * t * t + b;
                    t--;
                    return -c / 2 * (t * (t - 2) - 1) + b;
                }
                
                requestAnimationFrame(animation);
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
    addMobileMenuToggle,
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

/**
 * Add mobile menu toggle functionality
 */
function addMobileMenuToggle() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');
    
    if (!navToggle || !navMenu) {
        console.log('Mobile menu elements not found');
        return;
    }
    
    // Toggle menu when hamburger is clicked
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 1024) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    console.log('Mobile menu toggle initialized');
}

/**
 * Add proper button click state handling
 */
function addButtonClickHandling() {
    // Get all buttons
    const buttons = document.querySelectorAll('button, .btn, .contact__button, .hero__cta');
    
    buttons.forEach(button => {
        // Add click event listener
        button.addEventListener('click', function(e) {
            // Remove any existing active classes
            this.classList.remove('active', 'clicked');
            
            // Add temporary clicked class for visual feedback
            this.classList.add('clicked');
            
            // Remove clicked class after a short delay
            setTimeout(() => {
                this.classList.remove('clicked');
                // Also remove focus to prevent persistent active state
                this.blur();
            }, 150);
        });
        
        // Handle mouse leave to ensure button returns to normal state
        button.addEventListener('mouseleave', function() {
            this.classList.remove('active', 'clicked');
            this.blur();
        });
        
        // Handle touch end for mobile devices
        button.addEventListener('touchend', function(e) {
            e.preventDefault();
            this.classList.remove('active', 'clicked');
            
            // Trigger the click event
            this.click();
            
            // Remove focus after click
            setTimeout(() => {
                this.blur();
            }, 100);
        });
    });
    
    console.log('Button click handling initialized');
}
