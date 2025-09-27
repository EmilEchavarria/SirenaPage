/**
 * ShelfHackers - SirenaMap | Hackathon 2025
 * Interactive JavaScript functionality
 * Clean, modern, and accessible
 */

// ==========================================
// GLOBAL VARIABLES AND STATE
// ==========================================

const SirenaMap = {
    // DOM Elements
    elements: {
        mobileMenuBtn: document.getElementById('mobile-menu-btn'),
        mobileMenu: document.getElementById('mobile-menu'),
        demoBtn: document.getElementById('demo-btn'),
        detailsBtn: document.getElementById('details-btn'),
        terminalContent: document.getElementById('terminal-content'),
        demoModal: document.getElementById('demo-modal'),
        closeModal: document.getElementById('close-modal'),
        contactSales: document.getElementById('contact-sales'),
        githubRepo: document.getElementById('github-repo'),
        // Demo buttons
        demoNavigate: document.getElementById('demo-navigate'),
        demoLocate: document.getElementById('demo-locate'),
        demoList: document.getElementById('demo-list'),
        demoOffers: document.getElementById('demo-offers')
    },

    // Application state
    state: {
        currentSection: 'hero',
        isMenuOpen: false,
        isDemoRunning: false,
        hasVisitedSections: new Set(),
        animationQueue: []
    },

    // Demo scripts for terminal
    demoScripts: {
        navigate: [
            '$ sirenamap navigate --product=leche',
            '🗺️ Generando ruta al producto...',
            '📍 Ubicación: Pasillo 5, Estante B',
            '➡️ Sigue recto 10 metros, gira a la izquierda',
            '✅ Ruta optimizada generada (15 segundos)',
            '🎯 Distancia total: 25 metros'
        ],
        locate: [
            '$ sirenamap locate --user=cliente123',
            '📶 Conectando con beacons Bluetooth...',
            '📍 Ubicación actual: Entrada principal',
            '🔄 Actualizando posición en tiempo real...',
            '✅ Posición detectada con precisión de 1 metro'
        ],
        list: [
            '$ sirenamap list --manage',
            '📋 Cargando lista de compras...',
            '🛒 Productos: Leche, Pan, Huevos',
            '✅ Leche marcada como encontrada',
            '➡️ Siguiente producto: Pan (Pasillo 3)',
            '✨ Lista sincronizada con el mapa'
        ],
        offers: [
            '$ sirenamap offers --personalized',
            '🎁 Buscando ofertas relevantes...',
            '🏷️ Oferta: 2x1 en leche (Pasillo 5)',
            '🏷️ Descuento: 20% en pan integral',
            '✅ Ofertas enviadas a la app del usuario'
        ]
    }
};

// ==========================================
// INITIALIZATION
// ==========================================

/**
 * Initialize the application when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando SirenaMap...');
    
    // Initialize core functionality
    initializeEventListeners();
    initializeAnimations();
    initializeScrollEffects();
    initializeAccessibility();
    
    // Start welcome animation
    startHeroAnimation();
    
    console.log('✅ SirenaMap inicializado correctamente');
});

/**
 * Set up all event listeners
 */
function initializeEventListeners() {
    // Mobile menu toggle
    SirenaMap.elements.mobileMenuBtn?.addEventListener('click', toggleMobileMenu);
    
    // Hero buttons
    SirenaMap.elements.demoBtn?.addEventListener('click', showDemoModal);
    SirenaMap.elements.detailsBtn?.addEventListener('click', () => scrollToSection('about'));
    
    // Demo terminal buttons
    SirenaMap.elements.demoNavigate?.addEventListener('click', () => runTerminalDemo('navigate'));
    SirenaMap.elements.demoLocate?.addEventListener('click', () => runTerminalDemo('locate'));
    SirenaMap.elements.demoList?.addEventListener('click', () => runTerminalDemo('list'));
    SirenaMap.elements.demoOffers?.addEventListener('click', () => runTerminalDemo('offers'));
    
    // Modal controls
    SirenaMap.elements.closeModal?.addEventListener('click', closeDemoModal);
    SirenaMap.elements.demoModal?.addEventListener('click', handleModalBackdropClick);
    
    // Contact buttons
    SirenaMap.elements.contactSales?.addEventListener('click', showContactForm);
    SirenaMap.elements.githubRepo?.addEventListener('click', () => window.open('https://github.com/shelfhackers/sirenamap', '_blank'));
    
    // Navigation links
    setupNavigationLinks();
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Window events
    window.addEventListener('scroll', throttle(handleScroll, 16)); // 60fps
    window.addEventListener('resize', debounce(handleResize, 250));
    
    // Intersection observer for scroll animations
    setupScrollAnimations();
}

// ==========================================
// NAVIGATION FUNCTIONALITY
// ==========================================

/**
 * Toggle mobile menu visibility
 */
function toggleMobileMenu() {
    SirenaMap.state.isMenuOpen = !SirenaMap.state.isMenuOpen;
    
    const menu = SirenaMap.elements.mobileMenu;
    const btn = SirenaMap.elements.mobileMenuBtn;
    const icon = btn?.querySelector('i');
    
    if (menu) {
        menu.classList.toggle('hidden', !SirenaMap.state.isMenuOpen);
        
        // Animate icon change
        if (icon) {
            icon.style.transform = 'rotate(180deg)';
            setTimeout(() => {
                icon.className = SirenaMap.state.isMenuOpen ? 'fas fa-times' : 'fas fa-bars';
                icon.style.transform = 'rotate(0deg)';
            }, 150);
        }
    }
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = SirenaMap.state.isMenuOpen ? 'hidden' : 'auto';
    
    trackEvent('mobile_menu_toggle', { isOpen: SirenaMap.state.isMenuOpen });
}

/**
 * Scroll to a specific section smoothly
 */
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;
    
    // Close mobile menu if open
    if (SirenaMap.state.isMenuOpen) {
        toggleMobileMenu();
    }
    
    // Smooth scroll to section
    const headerHeight = 64; // Fixed header height
    const targetPosition = section.offsetTop - headerHeight;
    
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
    
    // Update active state
    updateActiveNavLink(sectionId);
    SirenaMap.state.currentSection = sectionId;
    
    trackEvent('section_navigate', { section: sectionId });
}

/**
 * Setup navigation link event listeners
 */
function setupNavigationLinks() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
}

/**
 * Update active navigation link
 */
function updateActiveNavLink(activeSection) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${activeSection}`) {
            link.classList.add('active');
        }
    });
}

// ==========================================
// DEMO FUNCTIONALITY
// ==========================================

/**
 * Run terminal demo animation
 */
function runTerminalDemo(type) {
    if (SirenaMap.state.isDemoRunning) return;
    
    const script = SirenaMap.demoScripts[type];
    if (!script) return;
    
    SirenaMap.state.isDemoRunning = true;
    const terminal = SirenaMap.elements.terminalContent;
    
    // Clear terminal
    terminal.innerHTML = '';
    
    // Add loading state
    showTerminalLoading(terminal);
    
    setTimeout(() => {
        terminal.innerHTML = '';
        typewriterEffect(terminal, script, () => {
            SirenaMap.state.isDemoRunning = false;
        });
    }, 1000);
    
    trackEvent('demo_run', { type });
}

/**
 * Show loading animation in terminal
 */
function showTerminalLoading(terminal) {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'terminal-line';
    loadingDiv.innerHTML = '<span class="prompt">$</span> Ejecutando comando<span class="loading-dots">...</span>';
    terminal.appendChild(loadingDiv);
    
    // Animate loading dots
    let dotCount = 0;
    const dotsInterval = setInterval(() => {
        const dots = '.'.repeat((dotCount % 3) + 1);
        loadingDiv.querySelector('.loading-dots').textContent = dots;
        dotCount++;
    }, 500);
    
    setTimeout(() => clearInterval(dotsInterval), 1000);
}

/**
 * Typewriter effect for terminal output
 */
function typewriterEffect(container, lines, callback) {
    let lineIndex = 0;
    let charIndex = 0;
    
    function typeNextChar() {
        if (lineIndex >= lines.length) {
            if (callback) callback();
            return;
        }
        
        const currentLine = lines[lineIndex];
        
        if (charIndex === 0) {
            const lineDiv = document.createElement('div');
            lineDiv.className = 'terminal-line';
            lineDiv.style.animationDelay = '0s';
            container.appendChild(lineDiv);
        }
        
        const lineDiv = container.lastElementChild;
        
        if (charIndex < currentLine.length) {
            lineDiv.textContent += currentLine[charIndex];
            charIndex++;
            
            // Scroll to bottom
            container.scrollTop = container.scrollHeight;
            
            setTimeout(typeNextChar, 30 + Math.random() * 20); // Variable speed
        } else {
            lineIndex++;
            charIndex = 0;
            setTimeout(typeNextChar, 400); // Pause between lines
        }
    }
    
    typeNextChar();
}

// ==========================================
// MODAL FUNCTIONALITY
// ==========================================

/**
 * Show the demo modal
 */
function showDemoModal() {
    const modal = SirenaMap.elements.demoModal;
    if (!modal) return;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus management for accessibility
    const closeButton = SirenaMap.elements.closeModal;
    if (closeButton) {
        setTimeout(() => closeButton.focus(), 100);
    }
    
    // Load demo content
    loadModalDemoContent();
    
    trackEvent('demo_modal_open');
}

/**
 * Close the demo modal
 */
function closeDemoModal() {
    const modal = SirenaMap.elements.demoModal;
    if (!modal) return;
    
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    // Return focus to trigger button
    if (SirenaMap.elements.demoBtn) {
        SirenaMap.elements.demoBtn.focus();
    }
    
    trackEvent('demo_modal_close');
}

/**
 * Handle modal backdrop clicks
 */
function handleModalBackdropClick(e) {
    if (e.target === SirenaMap.elements.demoModal) {
        closeDemoModal();
    }
}

/**
 * Load demo content in modal
 */
function loadModalDemoContent() {
    const demoContent = document.getElementById('modal-demo-content');
    if (!demoContent) return;
    
    const demoLines = [
        '$ sirenamap demo --interactive --full',
        '🎬 Cargando demostración completa...',
        '✨ Todos los módulos activados',
        '🎯 Modo interactivo habilitado',
        '🔧 Configuración: Supermercado simulado',
        '✅ Sistema listo para explorar'
    ];
    
    typewriterEffect(demoContent, demoLines);
}

// ==========================================
// CONTACT FORMS
// ==========================================

/**
 * Show contact form
 */
function showContactForm() {
    showNotification(
        '💬 ¡Gracias por tu interés!', 
        'En la versión final, aquí se abriría un formulario para compartir tus comentarios sobre SirenaMap.',
        'info'
    );
    trackEvent('contact_form_request');
}

// ==========================================
// ANIMATIONS AND EFFECTS
// ==========================================

/**
 * Initialize animation system
 */
function initializeAnimations() {
    // Preload animation states
    document.querySelectorAll('[data-animate]').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
    });
}

/**
 * Start hero section animation
 */
function startHeroAnimation() {
    const heroContent = document.querySelector('.hero-content');
    if (!heroContent) return;
    
    // Trigger hero animation
    setTimeout(() => {
        heroContent.style.opacity = '1';
        heroContent.style.transform = 'translateY(0)';
        heroContent.classList.add('reveal');
    }, 300);
}

/**
 * Setup scroll-triggered animations
 */
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateElement(entry.target);
                SirenaMap.state.hasVisitedSections.add(entry.target.id);
            }
        });
    }, observerOptions);
    
    // Observe sections and animated elements
    document.querySelectorAll('section[id], .value-card, .feature-card, .team-card').forEach(el => {
        observer.observe(el);
    });
}

/**
 * Animate element when it comes into view
 */
function animateElement(element) {
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
    element.classList.add('reveal');
}

// ==========================================
// SCROLL EFFECTS
// ==========================================

/**
 * Initialize scroll-based effects
 */
function initializeScrollEffects() {
    // Add scroll progress indicator
    createScrollProgress();
}

/**
 * Create scroll progress indicator
 */
function createScrollProgress() {
    const progress = document.createElement('div');
    progress.className = 'scroll-progress';
    progress.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #02B0D5, #FFD100);
        z-index: 1000;
        transition: width 0.1s ease-out;
    `;
    document.body.appendChild(progress);
}

/**
 * Update scroll progress indicator
 */
function updateScrollProgress() {
    const progress = document.querySelector('.scroll-progress');
    if (!progress) return;
    
    const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    progress.style.width = Math.min(scrolled, 100) + '%';
}

/**
 * Update active section based on scroll position
 */
function updateActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        
        if (scrollPos >= top && scrollPos < top + height) {
            const sectionId = section.getAttribute('id');
            if (sectionId !== SirenaMap.state.currentSection) {
                SirenaMap.state.currentSection = sectionId;
                updateActiveNavLink(sectionId);
            }
        }
    });
}

/**
 * Update navigation style based on scroll
 */
function updateNavigationStyle() {
    const nav = document.querySelector('nav');
    if (!nav) return;
    
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
}

/**
 * Handle scroll events
 */
function handleScroll() {
    updateScrollProgress();
    updateActiveSection();
    updateNavigationStyle();
}

// ==========================================
// ACCESSIBILITY
// ==========================================

/**
 * Initialize accessibility features
 */
function initializeAccessibility() {
    // Keyboard navigation
    setupKeyboardNavigation();
    
    // ARIA labels and live regions
    setupAriaLabels();
    
    // Focus management
    setupFocusManagement();
}

/**
 * Setup keyboard navigation
 */
function setupKeyboardNavigation() {
    // Allow keyboard navigation of cards
    document.querySelectorAll('.value-card, .feature-card, .team-card').forEach(card => {
        card.setAttribute('tabindex', '0');
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click();
            }
        });
    });
}

/**
 * Setup ARIA labels
 */
function setupAriaLabels() {
    // Add ARIA labels to interactive elements
    const demoButtons = document.querySelectorAll('.demo-btn');
    demoButtons.forEach((btn, index) => {
        btn.setAttribute('aria-describedby', `demo-description-${index}`);
    });
    
    // Add live region for announcements
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'visually-hidden';
    liveRegion.id = 'live-announcements';
    document.body.appendChild(liveRegion);
}

/**
 * Setup focus management
 */
function setupFocusManagement() {
    // Trap focus in modal
    SirenaMap.elements.demoModal?.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            trapFocus(e, SirenaMap.elements.demoModal);
        }
    });
}

/**
 * Trap focus within an element
 */
function trapFocus(e, container) {
    const focusableElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
            lastFocusable.focus();
            e.preventDefault();
        }
    } else {
        if (document.activeElement === lastFocusable) {
            firstFocusable.focus();
            e.preventDefault();
        }
    }
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Handle keyboard shortcuts
 */
function handleKeyboardShortcuts(e) {
    // ESC key - close modals
    if (e.key === 'Escape') {
        closeDemoModal();
        if (SirenaMap.state.isMenuOpen) {
            toggleMobileMenu();
        }
    }
    
    // Number keys for quick demo access
    if (e.key >= '1' && e.key <= '4' && e.ctrlKey) {
        e.preventDefault();
        const demoTypes = ['navigate', 'locate', 'list', 'offers'];
        const demoIndex = parseInt(e.key) - 1;
        if (demoTypes[demoIndex]) {
            runTerminalDemo(demoTypes[demoIndex]);
        }
    }
}

/**
 * Handle window resize
 */
function handleResize() {
    // Close mobile menu on desktop
    if (window.innerWidth > 768 && SirenaMap.state.isMenuOpen) {
        toggleMobileMenu();
    }
    
    // Update any size-dependent calculations
    updateScrollProgress();
}

/**
 * Show notification to user
 */
function showNotification(title, message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        max-width: 400px;
        background: white;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        border-left: 4px solid ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#02B0D5'};
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    notification.innerHTML = `
        <h4 style="margin: 0 0 8px 0; font-weight: 600; color: #1f2937;">${title}</h4>
        <p style="margin: 0; color: #6b7280; font-size: 14px;">${message}</p>
        <button onclick="this.parentElement.remove()" style="
            position: absolute;
            top: 10px;
            right: 10px;
            background: none;
            border: none;
            font-size: 18px;
            color: #9ca3af;
            cursor: pointer;
        ">×</button>
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

/**
 * Throttle function to limit event frequency
 */
function throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function() {
        const context = this;
        const args = arguments;
        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(function() {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    };
}

/**
 * Debounce function to delay event handling
 */
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

/**
 * Track events for analytics (placeholder)
 */
function trackEvent(eventName, properties) {
    console.log(`Event: ${eventName}`, properties);
    // In a production environment, this could integrate with an analytics service
}