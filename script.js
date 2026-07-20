// ===================================
// Fold IT Group — Main JavaScript
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    initI18n();
    initNavigation();
    initScrollAnimations();
    initSmoothScroll();
});

// ===================================
// i18n — EN / UA language switcher
// ===================================
const LANG_KEY = 'fold-lang';

function safeGetLang() {
    try { return localStorage.getItem(LANG_KEY); } catch (e) { return null; }
}

function safeSetLang(lang) {
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) { /* private mode / file:// */ }
}

function setLang(lang) {
    const dict = window.FOLD_I18N && window.FOLD_I18N[lang];
    if (!dict) return;

    document.documentElement.lang = lang === 'uk' ? 'uk' : 'en';

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const value = dict[el.dataset.i18n];
        if (value == null) return;
        if (el.tagName === 'TITLE') {
            el.textContent = value.replace(/<[^>]*>/g, '');
        } else {
            el.innerHTML = value;
        }
    });

    document.querySelectorAll('.lang-switch button').forEach(btn => {
        const active = btn.dataset.lang === lang;
        btn.classList.toggle('active', active);
        btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    safeSetLang(lang);
}

function initI18n() {
    document.querySelectorAll('.lang-switch button').forEach(btn => {
        btn.addEventListener('click', () => setLang(btn.dataset.lang));
    });

    const saved = safeGetLang();
    setLang(saved === 'uk' ? 'uk' : 'en');
}

// ===================================
// Navigation
// ===================================
function initNavigation() {
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }, { passive: true });

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
}

// ===================================
// Scroll Animations
// ===================================
function initScrollAnimations() {
    const animateElements = document.querySelectorAll(
        '.section-header, .about-text, .stat-card, .company-card, ' +
        '.service-item, .project-card, .channel-card, ' +
        '.feature-card, .process-item, .meta-card, .footer-grid > *'
    );

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { root: null, rootMargin: '0px 0px -80px 0px', threshold: 0.1 });

    animateElements.forEach((el, index) => {
        el.classList.add('animate-on-scroll');
        el.style.transitionDelay = `${index % 4 * 0.08}s`;
        observer.observe(el);
    });

    const style = document.createElement('style');
    style.textContent = `
        .animate-on-scroll {
            opacity: 0;
            transform: translateY(28px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .animate-on-scroll.animate-visible {
            opacity: 1;
            transform: translateY(0);
        }
        @media (prefers-reduced-motion: reduce) {
            .animate-on-scroll { opacity: 1; transform: none; transition: none; }
        }
    `;
    document.head.appendChild(style);
}

// ===================================
// Smooth Scroll
// ===================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();
            const navHeight = document.getElementById('nav').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        });
    });
}
