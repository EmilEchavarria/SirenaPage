/**
 * SirenaMap - Mobile-First JavaScript
 * Optimized for responsive design and touch interactions
 */

// ==========================================
// GLOBAL STATE MANAGEMENT
// ==========================================

const SirenaMap = {
    state: {
        isMobileMenuOpen: false,
        currentSection: 'hero',
        isScrolling: false,
        touchStartY: 0
    },
    
    // Mobile-optimized demo scripts
    demos: {
        demo: [
            'Iniciando SirenaMap...',
            'Conectando con supermercado...',
            'Cargando mapa interactivo...',
            'Sistema listo para usar!'
        ],
        process: [
            'Mostrando proceso de desarrollo...',
            'Diseño de experiencia usuario',
            'Desarrollo de la aplicación',
            'Pruebas con usuarios reales'
        ]
    }
};

// ==========================================
// INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    initializeMobileNavigation();
    initializeScrollEffects();
    initializeTouchInteractions();
    initializeVideoPlaceholders();
    initializeAnimations();
});

// ==========================================
// MOBILE NAVIGATION
// ==========================================

function initializeMobileNavigation() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileOverlay = document.getElementById('mobile-overlay');
    const closeMenuBtn = document.getElementById('close-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    if (!mobileMenuBtn || !mobileMenu) return;

    // Open mobile menu
    mobileMenuBtn.addEventListener('click', function() {
        openMobileMenu();
    });

    // Close mobile menu
    closeMenuBtn?.addEventListener('click', function() {
        closeMobileMenu();
    });

    // Close on overlay click
    mobileOverlay?.addEventListener('click', function() {
        closeMobileMenu();
    });

    // Close on nav link click and scroll to section
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            
            closeMobileMenu();
            
            // Scroll to section after menu animation
            setTimeout(() => {
                if (href.startsWith('#')) {
                    scrollToSection(href.substring(1));
                }
            }, 300);
        });
    });

    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && SirenaMap.state.isMobileMenuOpen) {
            closeMobileMenu();
        }
    });
}

function openMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileOverlay = document.getElementById('mobile-overlay');
    
    if (!mobileMenu) return;
    
    SirenaMap.state.isMobileMenuOpen = true;
    mobileMenu.classList.add('open');
    mobileOverlay?.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    // Focus first menu item for accessibility
    const firstLink = mobileMenu.querySelector('.mobile-nav-link');
    if (firstLink) {
        setTimeout(() => firstLink.focus(), 300);
    }
}

function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileOverlay = document.getElementById('mobile-overlay');
    
    if (!mobileMenu) return;
    
    SirenaMap.state.isMobileMenuOpen = false;
    mobileMenu.classList.remove('open');
    mobileOverlay?.classList.add('hidden');
    document.body.style.overflow = '';
}

// ==========================================
// SCROLL FUNCTIONALITY
// ==========================================

function initializeScrollEffects() {
    // Smooth scrolling for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });

    // Optimized scroll handler for mobile
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (!SirenaMap.state.isScrolling) {
            SirenaMap.state.isScrolling = true;
            updateScrollEffects();
        }
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            SirenaMap.state.isScrolling = false;
        }, 150);
    }, { passive: true });

    // Hide floating arrow on scroll
    window.addEventListener('scroll', hideFloatingArrowOnScroll, { passive: true });
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;
    
    const headerHeight = 64; // Fixed header height
    const targetPosition = section.offsetTop - headerHeight;
    
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
    
    SirenaMap.state.currentSection = sectionId;
}

function updateScrollEffects() {
    const scrolled = window.pageYOffset;
    const nav = document.querySelector('nav');
    
    // Update navigation background
    if (nav) {
        if (scrolled > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }
}

function hideFloatingArrowOnScroll() {
    const floatingArrow = document.querySelector('.floating-arrow');
    if (!floatingArrow) return;
    
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 100) {
        floatingArrow.style.opacity = '0';
        floatingArrow.style.pointerEvents = 'none';
    } else {
        floatingArrow.style.opacity = '1';
        floatingArrow.style.pointerEvents = 'auto';
    }
}

// ==========================================
// TOUCH INTERACTIONS
// ==========================================

function initializeTouchInteractions() {
    // Add touch feedback to buttons
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, button');
    
    buttons.forEach(button => {
        // Touch start
        button.addEventListener('touchstart', function(e) {
            this.style.transform = 'scale(0.98)';
            this.style.transition = 'transform 0.1s ease';
        }, { passive: true });
        
        // Touch end
        button.addEventListener('touchend', function(e) {
            setTimeout(() => {
                this.style.transform = '';
                this.style.transition = 'transform 0.3s ease';
            }, 100);
        }, { passive: true });
        
        // Touch cancel (if finger moves off button)
        button.addEventListener('touchcancel', function(e) {
            this.style.transform = '';
            this.style.transition = 'transform 0.3s ease';
        }, { passive: true });
    });

    // Add touch interactions to cards
    const cards = document.querySelectorAll('.feature-card, .bg-white');
    
    cards.forEach(card => {
        card.addEventListener('touchstart', function(e) {
            SirenaMap.state.touchStartY = e.touches[0].clientY;
            this.style.transform = 'translateY(-2px)';
            this.style.transition = 'transform 0.2s ease';
        }, { passive: true });
        
        card.addEventListener('touchend', function(e) {
            this.style.transform = '';
        }, { passive: true });
    });
}

// ==========================================
// VIDEO FUNCTIONALITY
// ==========================================

function initializeVideoPlaceholders() {
    // Video placeholder functionality is handled by the existing playVideo function
    // Just ensure it works well on mobile
}

// Global function for video placeholders (called from HTML)
function playVideo(type) {
    const messages = {
        'demo': 'Aquí se reproduciría el video demo de SirenaMap mostrando la navegación paso a paso por el supermercado.',
        'process': 'Este video mostraría todo nuestro proceso de desarrollo durante el Hackathon de Grupo Ramos 2025.'
    };
    
    const message = messages[type] || 'Video próximamente disponible.';
    
    // Show mobile-optimized notification
    showMobileNotification('Video Demo', message);
}

function showMobileNotification(title, message) {
    // Remove any existing notifications
    const existing = document.querySelector('.mobile-notification');
    if (existing) {
        existing.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'mobile-notification';
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        border-radius: 16px;
        padding: 24px;
        max-width: 320px;
        width: 90vw;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        z-index: 10000;
        text-align: center;
        animation: slideUp 0.3s ease-out;
    `;
    
    notification.innerHTML = `
        <h3 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 700; color: #1f2937;">${title}</h3>
        <p style="margin: 0 0 20px 0; color: #6b7280; font-size: 14px; line-height: 1.5;">${message}</p>
        <button onclick="this.parentElement.remove()" style="
            background: linear-gradient(135deg, #02B0D5, #0284c7);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 25px;
            font-weight: 600;
            font-size: 14px;
            cursor: pointer;
            width: 100%;
        ">Entendido</button>
    `;
    
    // Add overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.5);
        z-index: 9999;
        animation: fadeIn 0.3s ease-out;
    `;
    overlay.onclick = () => {
        notification.remove();
        overlay.remove();
    };
    
    // Add animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideUp {
            from { opacity: 0; transform: translate(-50%, -40%); }
            to { opacity: 1; transform: translate(-50%, -50%); }
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(overlay);
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
            overlay.remove();
        }
    }, 5000);
}

// ==========================================
// ANIMATIONS
// ==========================================

function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all animatable elements
    document.querySelectorAll('.feature-card, .story-step, .bg-white, .mockup-container').forEach(el => {
        // Set initial state
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        observer.observe(el);
    });
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

// Global function for smooth scrolling (called from HTML)
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;
    
    const headerHeight = 64;
    const targetPosition = section.offsetTop - headerHeight;
    
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
}

// Handle window resize
window.addEventListener('resize', function() {
    // Close mobile menu on desktop resize
    if (window.innerWidth > 1024 && SirenaMap.state.isMobileMenuOpen) {
        closeMobileMenu();
    }
});

// Prevent zoom on iOS safari double tap
document.addEventListener('touchend', function(e) {
    const now = new Date().getTime();
    const timeSince = now - SirenaMap.lastTouchEnd;
    
    if (timeSince < 300 && timeSince > 0) {
        e.preventDefault();
    }
    
    SirenaMap.lastTouchEnd = now;
}, false);

// Performance optimization: reduce animations on low-end devices
if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) {
    document.documentElement.style.setProperty('--animation-duration', '0.2s');
} else {
    document.documentElement.style.setProperty('--animation-duration', '0.6s');
}

// Console welcome message
console.log(`
🚀 SirenaMap - Hackathon Grupo Ramos 2025
📱 Optimizado para móviles y tablets
✨ Creado por ShelfHackers

Equipo:
- Emil Echavarria (Desarrollo)
- Luis Alburquerque (UI/UX)  
- Israel Gomez (UI/UX)
- Alan Tubert (IA)
`);


 function scrollToSection(sectionId) {
        document.getElementById(sectionId)?.scrollIntoView({ 
            behavior: 'smooth' 
        });
    }


