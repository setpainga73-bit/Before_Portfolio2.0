/**
 * js/main.js — Portfolio Interactivity
 *
 * Modules (each is an IIFE for clean scope isolation):
 *  1. ThemeManager         — dark/light toggle, localStorage persistence
 *  2. NavManager           — sticky navbar, active-section highlight (IntersectionObserver)
 *  3. MobileMenuManager    — hamburger toggle, keyboard trap, close on link click
 *  4. TypingAnimation      — typewriter cycling through roles
 *  5. RevealManager        — scroll reveal via IntersectionObserver
 *  6. CounterManager       — animated stat counters via IntersectionObserver
 *  7. TiltManager          — subtle 3-D card tilt on pointer-capable desktop devices
 *  8. ProjectFilter        — data-category based filtering (no hardcoded project logic)
 *  9. ClipboardManager     — Copy Email button with toast notification
 * 10. BackToTopManager     — floating back-to-top button
 * 11. SmoothAnchorManager  — smooth scrolling for all in-page anchor links
 */

'use strict';

/* ═══════════════════════════════════════
   1. THEME MANAGER
   ═══════════════════════════════════════ */
const ThemeManager = (() => {
  const STORAGE_KEY = 'portfolio-theme';

  function getCurrent() {
    return document.documentElement.getAttribute('data-theme') || 'dark';
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);

    /* Update aria-label for the toggle button */
    const btn = document.getElementById('themeToggle');
    if (btn) {
      btn.setAttribute('aria-label',
        theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
      );
    }
  }

  function toggle() {
    setTheme(getCurrent() === 'dark' ? 'light' : 'dark');
  }

  function init() {
    const btn = document.getElementById('themeToggle');
    if (btn) {
      btn.addEventListener('click', toggle);

      /* Allow keyboard activation via Enter or Space */
      btn.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle();
        }
      });
    }
  }

  return { init };
})();

/* ═══════════════════════════════════════
   2. NAV MANAGER
   Active section is tracked via IntersectionObserver on each section.
   ═══════════════════════════════════════ */
const NavManager = (() => {
  function init() {
    const navLinks = document.querySelectorAll('.nav-link[data-section]');
    const sections = document.querySelectorAll('section[id]');

    if (!navLinks.length || !sections.length) return;

    /* Mark the nav link whose section is most visible */
    function setActive(id) {
      navLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.section === id);
      });
    }

    /* Use IntersectionObserver with a generous rootMargin so the active
       state switches as the section enters the middle of the viewport. */
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    }, {
      rootMargin: '-40% 0px -55% 0px',
      threshold: 0
    });

    sections.forEach(sec => observer.observe(sec));
  }

  return { init };
})();

/* ═══════════════════════════════════════
   3. MOBILE MENU MANAGER
   ═══════════════════════════════════════ */
const MobileMenuManager = (() => {
  let isOpen = false;

  function open(btn, menu) {
    isOpen = true;
    menu.hidden = false;
    btn.setAttribute('aria-expanded', 'true');
    btn.setAttribute('aria-label', 'Close navigation menu');
    /* Allow the browser to paint hidden=false, then trigger CSS transition */
    requestAnimationFrame(() => menu.classList.add('in-view'));
    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('click', handleOutsideClick, true);
  }

  function close(btn, menu) {
    isOpen = false;
    menu.classList.remove('in-view');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Open navigation menu');
    /* Hide after transition */
    menu.addEventListener('transitionend', () => { menu.hidden = true; }, { once: true });
    document.removeEventListener('keydown', handleKeydown);
    document.removeEventListener('click', handleOutsideClick, true);
  }

  function handleKeydown(e) {
    if (e.key === 'Escape') {
      const btn  = document.getElementById('menuToggle');
      const menu = document.getElementById('mobileMenu');
      if (btn && menu) {
        close(btn, menu);
        btn.focus();
      }
    }
  }

  function handleOutsideClick(e) {
    const btn  = document.getElementById('menuToggle');
    const menu = document.getElementById('mobileMenu');
    const nav  = document.querySelector('.navbar');
    if (nav && !nav.contains(e.target)) {
      if (btn && menu) close(btn, menu);
    }
  }

  function init() {
    const btn  = document.getElementById('menuToggle');
    const menu = document.getElementById('mobileMenu');
    if (!btn || !menu) return;

    btn.addEventListener('click', () => {
      isOpen ? close(btn, menu) : open(btn, menu);
    });

    /* Close menu when any mobile nav link is clicked */
    menu.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (isOpen) close(btn, menu);
      });
    });
  }

  return { init };
})();

/* ═══════════════════════════════════════
   4. TYPING ANIMATION
   Respects prefers-reduced-motion.
   ═══════════════════════════════════════ */
const TypingAnimation = (() => {
  const TYPE_SPEED   = 70;   /* ms per character typed */
  const DELETE_SPEED = 40;   /* ms per character deleted */
  const PAUSE_AFTER  = 2200; /* ms pause before deleting */
  const PAUSE_BEFORE = 400;  /* ms pause before typing next */

  function init() {
    const target = document.getElementById('typingText');
    if (!target) return;

    /* When reduced motion is preferred, show the first role statically */
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      /* LangManager.t() resolves to the correct locale's roles array */
      const roles = LangManager.t('typing.roles');
      target.textContent = Array.isArray(roles) ? roles[0] : 'Junior Developer';
      return;
    }

    let roleIndex   = 0;
    let charIndex   = 0;
    let isDeleting  = false;
    let timeoutId   = null;

    function getRoles() {
      const roles = LangManager.t('typing.roles');
      return Array.isArray(roles) ? roles : ['Junior Developer'];
    }

    function tick() {
      const roles       = getRoles();
      const currentRole = roles[roleIndex % roles.length];

      if (!isDeleting) {
        /* Typing forward */
        target.textContent = currentRole.slice(0, charIndex + 1);
        charIndex++;

        if (charIndex === currentRole.length) {
          /* Finished typing — pause then start deleting */
          isDeleting = true;
          timeoutId = setTimeout(tick, PAUSE_AFTER);
          return;
        }
      } else {
        /* Deleting */
        target.textContent = currentRole.slice(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
          /* Finished deleting — move to next role */
          isDeleting = false;
          roleIndex++;
          timeoutId = setTimeout(tick, PAUSE_BEFORE);
          return;
        }
      }

      timeoutId = setTimeout(tick, isDeleting ? DELETE_SPEED : TYPE_SPEED);
    }

    tick();
  }

  return { init };
})();

/* ═══════════════════════════════════════
   5. REVEAL MANAGER
   Triggers .in-view on elements with .reveal as they enter the viewport.
   ═══════════════════════════════════════ */
const RevealManager = (() => {
  function init() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* When reduced motion is on, CSS already forces them visible.
       We still run the observer to avoid them staying opacity:0 in
       browsers that may not honour the media query in CSS. */
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    if (reducedMotion) {
      elements.forEach(el => el.classList.add('in-view'));
      return;
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target); /* Animate only once */
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px'
    });

    elements.forEach(el => observer.observe(el));
  }

  return { init };
})();

/* ═══════════════════════════════════════
   6. COUNTER MANAGER
   Animates stat numbers from 0 to their data-target value.
   ═══════════════════════════════════════ */
const CounterManager = (() => {
  const DURATION = 1400; /* ms total animation */

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    if (isNaN(target)) return;

    /* Skip animation if reduced motion */
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      el.textContent = target;
      return;
    }

    const start   = performance.now();
    const initial = 0;

    function step(timestamp) {
      const elapsed  = timestamp - start;
      const progress = Math.min(elapsed / DURATION, 1);
      /* Ease-out cubic */
      const eased    = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(initial + eased * (target - initial));

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target; /* Ensure exact final value */
      }
    }

    requestAnimationFrame(step);
  }

  function init() {
    const counterEls = document.querySelectorAll('.stat-num[data-target]');
    if (!counterEls.length) return;

    /* Trigger each counter when its parent card enters the viewport */
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counterEls.forEach(el => observer.observe(el));
  }

  return { init };
})();

/* ═══════════════════════════════════════
   7. TILT MANAGER
   Subtle 3-D card tilt on desktop pointer devices only.
   ═══════════════════════════════════════ */
const TiltManager = (() => {
  const MAX_ROTATION = 6;    /* degrees */
  const TRANSITION   = '0ms';
  const RETURN_TRANSITION = '400ms';

  function applyTilt(card, e) {
    const rect   = card.getBoundingClientRect();
    const cx     = rect.left + rect.width  / 2;
    const cy     = rect.top  + rect.height / 2;
    const dx     = (e.clientX - cx) / (rect.width  / 2);
    const dy     = (e.clientY - cy) / (rect.height / 2);

    const rotX = -dy * MAX_ROTATION;
    const rotY =  dx * MAX_ROTATION;

    card.style.transition = `transform ${TRANSITION}`;
    card.style.transform  = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02, 1.02, 1.02)`;
  }

  function resetTilt(card) {
    card.style.transition = `transform ${RETURN_TRANSITION} cubic-bezier(0.16, 1, 0.3, 1)`;
    card.style.transform  = 'perspective(800px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
  }

  function init() {
    /* Only run on pointer-capable (non-touch) desktop devices */
    const isPointerDevice = window.matchMedia('(pointer: fine)').matches;
    const reducedMotion   = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!isPointerDevice || reducedMotion) return;

    const cards = document.querySelectorAll('.tilt-card');

    cards.forEach(card => {
      card.addEventListener('mousemove', e => applyTilt(card, e));
      card.addEventListener('mouseleave', () => resetTilt(card));
      card.addEventListener('mouseenter', () => {
        card.style.transition = `transform ${TRANSITION}`;
      });
    });
  }

  return { init };
})();

/* ═══════════════════════════════════════
   8. PROJECT FILTER
   Filters .project-card elements by [data-category].
   No project-specific logic — works for any number of projects.
   ═══════════════════════════════════════ */
const ProjectFilter = (() => {
  function init() {
    const filterBtns = document.querySelectorAll('.filter-btn[data-filter]');
    const cards      = document.querySelectorAll('.project-card[data-category]');

    if (!filterBtns.length || !cards.length) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        /* Update active state on buttons */
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        /* Show / hide cards */
        cards.forEach(card => {
          const category = card.getAttribute('data-category');
          const visible  = filter === 'all' || category === filter;
          card.classList.toggle('hidden', !visible);
        });
      });
    });
  }

  return { init };
})();

/* ═══════════════════════════════════════
   9. CLIPBOARD MANAGER
   Copies the email address and shows a Liquid Glass toast.
   ═══════════════════════════════════════ */
const ClipboardManager = (() => {
  const EMAIL = 'setpainga73@gmail.com';
  let toastTimer = null;

  function showToast() {
    const toast = document.getElementById('toast');
    if (!toast) return;

    /* Clear any pending hide timer */
    if (toastTimer) clearTimeout(toastTimer);

    /* Update text from current locale */
    const msgEl = document.getElementById('toastMsg');
    if (msgEl) {
      msgEl.textContent = LangManager.t('toast.copied');
    }

    toast.hidden = false;
    /* Small delay so the browser renders hidden=false before adding the class */
    requestAnimationFrame(() => toast.classList.add('toast-show'));

    toastTimer = setTimeout(() => {
      toast.classList.remove('toast-show');
      toast.addEventListener('transitionend', () => {
        toast.hidden = true;
      }, { once: true });
    }, 2800);
  }

  function init() {
    const btn = document.getElementById('copyEmailBtn');
    if (!btn) return;

    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(EMAIL);
        showToast();
      } catch {
        /* Fallback: select the email link text */
        const link = document.querySelector('a[href="mailto:' + EMAIL + '"]');
        if (link) {
          const range = document.createRange();
          range.selectNode(link);
          window.getSelection().removeAllRanges();
          window.getSelection().addRange(range);
        }
        showToast();
      }
    });
  }

  return { init };
})();

/* ═══════════════════════════════════════
   10. BACK TO TOP MANAGER
   ═══════════════════════════════════════ */
const BackToTopManager = (() => {
  const SCROLL_THRESHOLD = 400;

  function init() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    /* Show / hide on scroll */
    window.addEventListener('scroll', () => {
      const shouldShow = window.scrollY > SCROLL_THRESHOLD;
      btn.hidden = !shouldShow;
      /* We use a separate .visible class for the opacity/transform transition
         so the hidden attribute can still be toggled for accessibility. */
      btn.classList.toggle('visible', shouldShow);
    }, { passive: true });

    /* Scroll to top on click */
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  return { init };
})();

/* ═══════════════════════════════════════
   11. SMOOTH ANCHOR MANAGER
   Overrides default jump behaviour for all in-page # links.
   Accounts for the fixed navbar height.
   ═══════════════════════════════════════ */
const SmoothAnchorManager = (() => {
  function init() {
    document.addEventListener('click', e => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      const targetId = link.getAttribute('href').slice(1);
      if (!targetId) return;

      const target = document.getElementById(targetId);
      if (!target) return;

      e.preventDefault();

      const navbarHeight = document.querySelector('.navbar')?.offsetHeight ?? 80;
      const top = target.getBoundingClientRect().top + window.scrollY - navbarHeight - 24;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  }

  return { init };
})();

/* ═══════════════════════════════════════
   BOOT — initialise all modules on DOMContentLoaded
   ═══════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  /* lang.js registers its own DOMContentLoaded listener (runs first because
     lang.js is loaded before main.js). By the time we reach here, translations
     are already applied. */

  ThemeManager.init();
  NavManager.init();
  MobileMenuManager.init();
  TypingAnimation.init();
  RevealManager.init();
  CounterManager.init();
  TiltManager.init();
  ProjectFilter.init();
  ClipboardManager.init();
  BackToTopManager.init();
  SmoothAnchorManager.init();
});
