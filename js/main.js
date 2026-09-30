/**
 * Aung Set Paing - Junior Full-Stack Developer Portfolio
 * Vanilla JavaScript Implementation
 * Features:
 * - Theme toggle (Dark / Light with system preference & localStorage)
 * - Language switcher (English / Burmese Unicode with dictionary in lang.js)
 * - Typing effect for hero roles with reduced-motion support
 * - IntersectionObserver active link highlighting & animated stat counters
 * - 3D Card tilt effect (Desktop only with pointer check)
 * - Category filter tabs for projects (data-category driven)
 * - Clipboard copy with toast notification
 * - Back to top button (>400px scroll)
 * - Mobile hamburger menu
 */

if (!window.location.hash) {
  window.history.replaceState(null, "", "#contact");
}

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // --------------------------------------------------------------------------
  // Check Accessibility / Motion Preferences
  // --------------------------------------------------------------------------
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const isFinePointer = window.matchMedia(
    "(hover: hover) and (pointer: fine)",
  ).matches;

  // --------------------------------------------------------------------------
  // 1. Theme Management (Dark / Light)
  // --------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById("theme-toggle");
  const themeColorMeta = document.getElementById("theme-color-meta");

  function getCurrentTheme() {
    return document.documentElement.getAttribute("data-theme") || "dark";
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("portfolio_theme", theme);

    if (themeColorMeta) {
      themeColorMeta.setAttribute(
        "content",
        theme === "dark" ? "#0b1020" : "#eef1f8",
      );
    }

    if (themeToggleBtn) {
      const nextThemeLabel =
        theme === "dark" ? "Switch to light theme" : "Switch to dark theme";
      themeToggleBtn.setAttribute("aria-label", nextThemeLabel);
    }
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const currentTheme = getCurrentTheme();
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      applyTheme(newTheme);
    });
  }

  // Listen to OS theme changes if user hasn't explicitly set a preference
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      if (!localStorage.getItem("portfolio_theme")) {
        applyTheme(e.matches ? "dark" : "light");
      }
    });

  // --------------------------------------------------------------------------
  // 2. Language Management & i18n
  // --------------------------------------------------------------------------
  const langToggleBtn = document.getElementById("lang-toggle");
  const langLabel = document.getElementById("lang-label");
  let currentLang = localStorage.getItem("portfolio_lang") || "en";

  function updateTexts(lang) {
    const dict =
      typeof translations !== "undefined" ? translations[lang] : null;
    if (!dict) return;

    // Update inner text of all data-i18n elements
    const i18nElements = document.querySelectorAll("[data-i18n]");
    i18nElements.forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });

    // Update aria labels
    const ariaElements = document.querySelectorAll("[data-i18n-aria]");
    ariaElements.forEach((el) => {
      const key = el.getAttribute("data-i18n-aria");
      if (dict[key]) {
        el.setAttribute("aria-label", dict[key]);
      }
    });

    // Update language switch button display label
    if (langLabel) {
      langLabel.textContent = lang === "en" ? "MY" : "EN";
    }
    if (langToggleBtn) {
      langToggleBtn.setAttribute(
        "aria-label",
        dict.lang_toggle_label || "Switch language",
      );
    }

    // Update document HTML lang attribute
    document.documentElement.setAttribute("lang", lang);

    // Restart typing effect with localized roles
    if (typeof restartTyping === "function") {
      restartTyping();
    }
  }

  function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem("portfolio_lang", lang);
    updateTexts(lang);
  }

  if (langToggleBtn) {
    langToggleBtn.addEventListener("click", () => {
      const newLang = currentLang === "en" ? "my" : "en";
      setLanguage(newLang);
    });
  }

  // Initial text hydration
  updateTexts(currentLang);

  // --------------------------------------------------------------------------
  // 3. Typing Effect (Hero Section)
  // --------------------------------------------------------------------------
  const typedRoleEl = document.getElementById("typed-role");
  let typingTimeout = null;
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function getRoles() {
    if (
      typeof translations !== "undefined" &&
      translations[currentLang] &&
      translations[currentLang].hero_roles
    ) {
      return translations[currentLang].hero_roles;
    }
    return [
      "Junior Full-Stack Developer",
      "C# / .NET & Web Builder",
      "UI & Frontend Enthusiast",
    ];
  }

  function typeTick() {
    const roles = getRoles();
    const currentRole = roles[roleIndex % roles.length];

    if (prefersReducedMotion) {
      if (typedRoleEl) typedRoleEl.textContent = currentRole;
      return;
    }

    if (isDeleting) {
      charIndex--;
      if (typedRoleEl)
        typedRoleEl.textContent = currentRole.substring(0, charIndex);
    } else {
      charIndex++;
      if (typedRoleEl)
        typedRoleEl.textContent = currentRole.substring(0, charIndex);
    }

    let delay = isDeleting ? 38 : 75;

    if (!isDeleting && charIndex === currentRole.length) {
      delay = 1800; // Pause at full word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 400; // Pause before typing next word
    }

    typingTimeout = setTimeout(typeTick, delay);
  }

  function restartTyping() {
    clearTimeout(typingTimeout);
    charIndex = 0;
    isDeleting = false;
    typeTick();
  }

  // Initialize typing
  restartTyping();

  // --------------------------------------------------------------------------
  // 4. Sticky Navbar, Active Link Highlighting & Smooth Scrolling
  // --------------------------------------------------------------------------
  const navLinks = document.querySelectorAll(
    ".nav-desktop .nav-link, .mobile-nav-link",
  );
  const sections = document.querySelectorAll("section[id]");

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            const href = link.getAttribute("href");
            if (href === `#${id}`) {
              link.classList.add("active");
            } else {
              link.classList.remove("active");
            }
          });
        }
      });
    },
    {
      threshold: 0.35,
      rootMargin: "-80px 0px -40% 0px",
    },
  );

  sections.forEach((sec) => sectionObserver.observe(sec));

  // --------------------------------------------------------------------------
  // 5. Mobile Hamburger Navigation
  // --------------------------------------------------------------------------
  const menuToggle = document.getElementById("menu-toggle");
  const mobileDrawer = document.getElementById("mobile-drawer");

  function closeMobileMenu() {
    if (menuToggle && mobileDrawer) {
      menuToggle.setAttribute("aria-expanded", "false");
      mobileDrawer.classList.remove("open");
      mobileDrawer.setAttribute("aria-hidden", "true");
    }
  }

  if (menuToggle && mobileDrawer) {
    menuToggle.addEventListener("click", () => {
      const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isExpanded));
      mobileDrawer.classList.toggle("open", !isExpanded);
      mobileDrawer.setAttribute("aria-hidden", String(isExpanded));
    });

    // Close on mobile link click
    document.querySelectorAll(".mobile-nav-link").forEach((link) => {
      link.addEventListener("click", closeMobileMenu);
    });

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && mobileDrawer.classList.contains("open")) {
        closeMobileMenu();
      }
    });

    // Close when clicking outside drawer
    document.addEventListener("click", (e) => {
      if (
        mobileDrawer.classList.contains("open") &&
        !mobileDrawer.contains(e.target) &&
        !menuToggle.contains(e.target)
      ) {
        closeMobileMenu();
      }
    });
  }

  // --------------------------------------------------------------------------
  // 6. Animated Stat Counters (Real Numbers Only)
  // --------------------------------------------------------------------------
  const countersSection = document.getElementById("counters-section");
  let countersAnimated = false;

  function runCounters() {
    const counterElements = document.querySelectorAll(".counter-number");
    counterElements.forEach((counter) => {
      const target = parseInt(counter.getAttribute("data-target"), 10) || 0;
      const suffix = counter.getAttribute("data-suffix") || "";

      if (prefersReducedMotion) {
        counter.textContent = target + suffix;
        return;
      }

      let current = 0;
      const duration = 1800; // ms
      const steps = 60;
      const stepTime = duration / steps;
      const increment = target / steps;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.textContent = target + suffix;
          clearInterval(timer);
        } else {
          counter.textContent = Math.floor(current) + suffix;
        }
      }, stepTime);
    });
  }

  if (countersSection) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !countersAnimated) {
            countersAnimated = true;
            runCounters();
          }
        });
      },
      { threshold: 0.3 },
    );

    counterObserver.observe(countersSection);
  }

  // --------------------------------------------------------------------------
  // 7. 3D Tilt on Hover for Skills Cards (Desktop Only)
  // --------------------------------------------------------------------------
  if (isFinePointer && !prefersReducedMotion) {
    const tiltCards = document.querySelectorAll(".js-tilt-card");

    tiltCards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const cardWidth = rect.width;
        const cardHeight = rect.height;

        // Mouse position relative to center of the card
        const mouseX = e.clientX - rect.left - cardWidth / 2;
        const mouseY = e.clientY - rect.top - cardHeight / 2;

        // Calculate rotation degrees (max 10 deg)
        const rotateX = -(mouseY / (cardHeight / 2)) * 8;
        const rotateY = (mouseX / (cardWidth / 2)) * 8;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform =
          "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
        card.style.transition = "transform 0.4s ease";
      });

      card.addEventListener("mouseenter", () => {
        card.style.transition = "transform 0.1s ease-out";
      });
    });
  }

  // --------------------------------------------------------------------------
  // 8. Projects Filter Tabs (Driven by data-category)
  // --------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });

      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");

      const filter = btn.getAttribute("data-filter");

      projectCards.forEach((card) => {
        const cardCategory = card.getAttribute("data-category");
        if (filter === "all" || cardCategory === filter) {
          card.classList.remove("hidden");
          card.style.opacity = "0";
          card.style.transform = "translateY(15px)";
          setTimeout(() => {
            card.style.transition = "opacity 0.35s ease, transform 0.35s ease";
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
          }, 30);
        } else {
          card.classList.add("hidden");
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 9. Copy Email Button with Clipboard API & Toast Notification
  // --------------------------------------------------------------------------
  const copyEmailBtn = document.getElementById("copy-email-btn");
  const toast = document.getElementById("toast");
  let toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    const toastText = document.getElementById("toast-text");
    if (toastText && message) {
      toastText.textContent = message;
    }

    toast.classList.add("show");
    toast.setAttribute("aria-hidden", "false");

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
      toast.setAttribute("aria-hidden", "true");
    }, 3200);
  }

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener("click", async () => {
      const email = "setpainga73@gmail.com";
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(email);
        } else {
          // Fallback for non-https or older browsers
          const textArea = document.createElement("textarea");
          textArea.value = email;
          textArea.style.position = "fixed";
          textArea.style.left = "-999999px";
          textArea.style.top = "-999999px";
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand("copy");
          textArea.remove();
        }

        const dict =
          typeof translations !== "undefined"
            ? translations[currentLang]
            : null;
        const msg = dict
          ? dict.toast_copied
          : "Email address copied to clipboard!";
        showToast(msg);
      } catch (err) {
        console.error("Failed to copy email:", err);
        window.location.href = `mailto:${email}`;
      }
    });
  }

  // --------------------------------------------------------------------------
  // 10. Back to Top Button (> 400px Scroll)
  // --------------------------------------------------------------------------
  const backToTopBtn = document.getElementById("back-to-top");

  window.addEventListener(
    "scroll",
    () => {
      if (backToTopBtn) {
        if (window.scrollY > 400) {
          backToTopBtn.classList.add("visible");
        } else {
          backToTopBtn.classList.remove("visible");
        }
      }
    },
    { passive: true },
  );

  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    });
  }
});
