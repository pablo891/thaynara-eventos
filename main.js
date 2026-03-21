/* ==========================================
   THAYNARA EVENTOS — Main JavaScript
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initMobileMenu();
    initScrollReveal();
    initTestimonialCarousel();
    initSmoothScroll();
    initCategoryArrows();
});

/* --- Category Arrows --- */
function initCategoryArrows() {
    const scrollArea = document.querySelector('.categories__scroll');
    const prevBtn = document.getElementById('catPrev');
    const nextBtn = document.getElementById('catNext');

    if (!scrollArea || !prevBtn || !nextBtn) return;

    const scrollAmount = 260;

    nextBtn.addEventListener('click', () => {
        scrollArea.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });

    prevBtn.addEventListener('click', () => {
        scrollArea.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });
}

/* --- Navbar Scroll Effect --- */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        if (currentScroll > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Active link highlight
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar__link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

/* --- Mobile Menu --- */
function initMobileMenu() {
    const toggle = document.getElementById('navToggle');
    const nav = document.getElementById('navMenu');

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);

    function openMenu() {
        nav.classList.add('open');
        toggle.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        nav.classList.remove('open');
        toggle.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    toggle.addEventListener('click', () => {
        if (nav.classList.contains('open')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    overlay.addEventListener('click', closeMenu);

    // Close on link click
    nav.querySelectorAll('.navbar__link, .navbar__cta-mobile').forEach(link => {
        link.addEventListener('click', closeMenu);
    });
}

/* --- Smooth Scroll --- */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                const offset = 80;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* --- Scroll Reveal --- */
function initScrollReveal() {
    const elements = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger animation for grid items
                const parent = entry.target.parentElement;
                const siblings = parent ? parent.querySelectorAll('.reveal') : [];
                let delay = 0;

                if (siblings.length > 1) {
                    const idx = Array.from(siblings).indexOf(entry.target);
                    delay = idx * 100;
                }

                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);

                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach(el => observer.observe(el));
}

/* --- Testimonial Carousel --- */
function initTestimonialCarousel() {
    const track = document.getElementById('testimonialTrack');
    const dotsContainer = document.getElementById('testimonialDots');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (!track) return;

    const slides = track.querySelectorAll('.testimonial');
    let currentIndex = 0;
    let autoPlayTimer;

    // Create dots
    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = `testimonials__dot ${i === 0 ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Ir para depoimento ${i + 1}`);
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    });

    function goToSlide(index) {
        currentIndex = index;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;

        // Update dots
        dotsContainer.querySelectorAll('.testimonials__dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });

        resetAutoPlay();
    }

    function nextSlide() {
        goToSlide((currentIndex + 1) % slides.length);
    }

    function prevSlide() {
        goToSlide((currentIndex - 1 + slides.length) % slides.length);
    }

    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // Auto-play
    function startAutoPlay() {
        autoPlayTimer = setInterval(nextSlide, 5000);
    }

    function resetAutoPlay() {
        clearInterval(autoPlayTimer);
        startAutoPlay();
    }

    startAutoPlay();

    // Pause on hover
    track.addEventListener('mouseenter', () => clearInterval(autoPlayTimer));
    track.addEventListener('mouseleave', startAutoPlay);

    // Touch support
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        clearInterval(autoPlayTimer);
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
        startAutoPlay();
    }, { passive: true });
}
