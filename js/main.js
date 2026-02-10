/* ============================================
   TravelVaticanCity.com - Main JavaScript
   Smooth interactions, scroll animations, nav
   ============================================ */

(function () {
    'use strict';

    // =============================================
    // NAVIGATION
    // =============================================
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');

    // Scroll-based nav background
    function handleNavScroll() {
        if (window.scrollY > 80) {
            navbar.classList.add('nav--scrolled');
        } else {
            navbar.classList.remove('nav--scrolled');
        }
    }

    // Mobile menu toggle
    function toggleMobileMenu() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';

        const isOpen = navMenu.classList.contains('active');
        navToggle.setAttribute('aria-expanded', isOpen);
    }

    // Close mobile menu when a link is clicked
    function closeMobileMenu() {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
        navToggle.setAttribute('aria-expanded', 'false');
    }

    if (navToggle) {
        navToggle.addEventListener('click', toggleMobileMenu);
    }

    navLinks.forEach(function (link) {
        link.addEventListener('click', closeMobileMenu);
    });

    // Close menu on Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // =============================================
    // SCROLL REVEAL ANIMATIONS
    // =============================================
    function setupRevealAnimations() {
        var revealElements = document.querySelectorAll(
            '.world-card, .featured-place, .timeline-item, .access-card, ' +
            '.itinerary-card, .symbol-card, .faq__item, .stat, ' +
            '.intro__content, .silence__content, .newsletter__content'
        );

        revealElements.forEach(function (el) {
            el.classList.add('reveal');
        });

        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );

        revealElements.forEach(function (el) {
            observer.observe(el);
        });
    }

    // =============================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // =============================================
    function setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
            anchor.addEventListener('click', function (e) {
                var targetId = this.getAttribute('href');
                if (targetId === '#') return;

                var target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    var navHeight = navbar ? navbar.offsetHeight : 0;
                    var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // =============================================
    // PARALLAX EFFECT ON HERO & SILENCE IMAGES
    // =============================================
    function setupParallax() {
        var heroImg = document.querySelector('.hero__bg-img');
        var silenceImg = document.querySelector('.silence__bg-img');

        if (!heroImg && !silenceImg) return;

        // Only run parallax on larger screens
        var mediaQuery = window.matchMedia('(min-width: 768px)');
        if (!mediaQuery.matches) return;

        var ticking = false;

        function updateParallax() {
            var scrollTop = window.pageYOffset;

            if (heroImg) {
                var heroSection = heroImg.closest('.hero');
                if (heroSection) {
                    var heroBottom = heroSection.offsetHeight;
                    if (scrollTop < heroBottom) {
                        heroImg.style.transform = 'translateY(' + (scrollTop * 0.3) + 'px) scale(1.05)';
                    }
                }
            }

            if (silenceImg) {
                var silenceSection = silenceImg.closest('.silence');
                if (silenceSection) {
                    var rect = silenceSection.getBoundingClientRect();
                    if (rect.top < window.innerHeight && rect.bottom > 0) {
                        var offset = (rect.top / window.innerHeight) * 40;
                        silenceImg.style.transform = 'translateY(' + offset + 'px) scale(1.05)';
                    }
                }
            }

            ticking = false;
        }

        window.addEventListener('scroll', function () {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }, { passive: true });
    }

    // =============================================
    // STAGGER REVEAL FOR GRID ITEMS
    // =============================================
    function setupStaggerReveal() {
        var grids = document.querySelectorAll(
            '.four-worlds__grid, .access__grid, .itineraries__grid, .art-symbols__grid, .timeline-band__items'
        );

        grids.forEach(function (grid) {
            var observer = new IntersectionObserver(
                function (entries) {
                    entries.forEach(function (entry) {
                        if (entry.isIntersecting) {
                            var children = entry.target.children;
                            Array.prototype.forEach.call(children, function (child, index) {
                                child.style.transitionDelay = (index * 0.1) + 's';
                            });
                            observer.unobserve(entry.target);
                        }
                    });
                },
                { threshold: 0.1 }
            );

            observer.observe(grid);
        });
    }

    // =============================================
    // COUNTER ANIMATION FOR STATS
    // =============================================
    function animateCounter(element, target, suffix) {
        var duration = 2000;
        var startTime = null;
        var startValue = 0;

        function easeOutQuart(t) {
            return 1 - Math.pow(1 - t, 4);
        }

        function update(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            var easedProgress = easeOutQuart(progress);
            var currentValue = Math.floor(startValue + (target - startValue) * easedProgress);

            if (target >= 1000) {
                element.textContent = currentValue.toLocaleString();
            } else if (target < 1) {
                element.textContent = (startValue + (target - startValue) * easedProgress).toFixed(2);
            } else {
                element.textContent = currentValue;
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                // Restore original text including suffix
                element.textContent = element.dataset.original;
            }
        }

        requestAnimationFrame(update);
    }

    function setupCounterAnimations() {
        var stats = document.querySelectorAll('.stat__number');

        stats.forEach(function (stat) {
            stat.dataset.original = stat.textContent;
        });

        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        var el = entry.target;
                        var text = el.dataset.original;
                        var numericValue = parseFloat(text.replace(/[^0-9.]/g, ''));

                        if (!isNaN(numericValue)) {
                            animateCounter(el, numericValue, '');
                        }

                        observer.unobserve(el);
                    }
                });
            },
            { threshold: 0.5 }
        );

        stats.forEach(function (stat) {
            observer.observe(stat);
        });
    }

    // =============================================
    // NEWSLETTER FORM HANDLING
    // =============================================
    function setupNewsletterForm() {
        var form = document.querySelector('.newsletter__form');
        if (!form) return;

        form.addEventListener('submit', function (e) {
            // Allow the form to navigate to coming-soon.html
            // In production, this would be replaced with actual form submission
        });
    }

    // =============================================
    // INITIALIZE
    // =============================================
    function init() {
        // Set up scroll handler with passive listener
        window.addEventListener('scroll', handleNavScroll, { passive: true });
        handleNavScroll(); // Check on load

        setupRevealAnimations();
        setupSmoothScroll();
        setupParallax();
        setupStaggerReveal();
        setupCounterAnimations();
        setupNewsletterForm();
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
