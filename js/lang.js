/**
 * js/lang.js — Translation System
 *
 * Responsibilities:
 *  - Store all UI strings in 'en' and 'my' locales
 *  - Apply translations via [data-i18n] attributes
 *  - Persist selected language in localStorage
 *  - Update <html lang=""> for accessibility and correct font rendering
 *  - Keep names, tech terms, links and email unchanged regardless of locale
 */

/* ─── Translation strings ─── */
const translations = {
  en: {
    /* Navbar */
    "nav.home":       "Home",
    "nav.about":      "About",
    "nav.skills":     "Skills",
    "nav.projects":   "Projects",
    "nav.education":  "Education",
    "nav.contact":    "Contact",

    /* Hero */
    "hero.badge":       "Open to Internships",
    "hero.intro":       "A junior developer passionate about building clean, performant web experiences. Focused on full-stack development with an eye for design and a love for great user experiences.",
    "hero.cta.projects": "View Projects",
    "hero.cta.cv":       "Download CV",
    "hero.cta.contact":  "Contact Me",

    /* Typing roles (used by main.js) */
    "typing.roles": ["Full-stack Developer", "Frontend Developer", "Software Developer"],

    /* About */
    "about.eyebrow":  "About Me",
    "about.heading":  "A developer who enjoys building useful things.",
    "about.bio1":     "I'm Aung Set Paing, a junior developer based in Myanmar with a strong foundation in both front-end and back-end technologies. I hold an NCC Education Level 4 Diploma in Computing, where I developed skills in programming, web development and software engineering principles.",
    "about.bio2":     "I enjoy creating responsive, accessible web interfaces and have a growing interest in full-stack development — connecting well-designed front ends to robust back-end systems with C#/.NET and SQL databases. Currently seeking an internship or junior developer role to grow my skills in a real-world environment.",
    "about.fact1":    "NCC Level 4 Computing",
    "about.fact2":    "Full-stack Focus",
    "about.fact3":    "Open to Internships",
    "about.stat1":    "Diploma",
    "about.stat2":    "Core Technologies",
    "about.stat3":    "Featured Project",
    "about.stat4":    "Years Professional Exp.",

    /* Skills */
    "skills.eyebrow":          "What I Work With",
    "skills.heading":          "Skills & Technologies",
    "skills.frontend.title":   "Frontend",
    "skills.frontend.responsive": "Responsive Design",
    "skills.frontend.uiux":    "UI / UX",
    "skills.backend.title":    "Backend",
    "skills.backend.serverside": "Server-side Dev",
    "skills.database.title":   "Database",
    "skills.database.design":  "Database Design",
    "skills.database.mgmt":    "Data Management",

    /* Projects */
    "projects.eyebrow":       "What I've Built",
    "projects.heading":       "Projects",
    "projects.filter.all":    "All",
    "projects.filter.frontend":  "Frontend",
    "projects.filter.fullstack": "Full-stack",
    "projects.featured":      "Featured",
    "projects.bean.desc":     "A multi-page coffee shop website focused on responsive design, interactive UI and polished user experience. Features a discount modal, feature carousel, shopping cart, BrewMatch mood-based coffee finder, Google Maps embed and light/dark themes.",
    "projects.link.github":   "GitHub",
    "projects.link.demo":     "Live Demo ↗",
    "projects.comingsoon":    "Coming Soon",
    "projects.cs1.title":     "Full-stack Application",
    "projects.cs1.desc":      "A full-stack web application currently in planning. Will incorporate a C#/.NET back end with a dynamic JavaScript front end and SQL database.",
    "projects.cs2.title":     "Developer Tool",
    "projects.cs2.desc":      "A browser-based developer utility focused on productivity and clean UI. In early design phase.",

    /* Education */
    "education.eyebrow":           "Academic Background",
    "education.heading":           "Education",
    "education.ncc.title":         "NCC Education Level 4 Diploma in Computing",
    "education.ncc.institution":   "NCC Education",
    "education.ncc.level":         "Level 4",
    "education.ncc.desc":          "An internationally recognised qualification covering core computing and software development principles. Curriculum included programming fundamentals, web development, database management, systems analysis and software engineering — providing a strong academic foundation for a career in technology.",
    "education.ncc.tag4":          "Software Engineering",

    /* Contact */
    "contact.eyebrow":      "Get in Touch",
    "contact.heading":      "Let's build something together.",
    "contact.subtext":      "I'm currently looking for web development internship and junior developer opportunities. If you have a role, project or just want to say hello — feel free to reach out.",
    "contact.email.label":  "Email",
    "contact.copy":         "Copy Email",
    "contact.visit":        "Visit ↗",
    "contact.send":         "Send me an email",

    /* Footer */
    "footer.title":  "Junior Developer",
    "footer.copy":   "© 2026 Aung Set Paing",

    /* Toast */
    "toast.copied":  "Copied!",
  },

  my: {
    /* Navbar */
    "nav.home":       "ပင်မ",
    "nav.about":      "အကြောင်း",
    "nav.skills":     "ကျွမ်းကျင်မှု",
    "nav.projects":   "ပရောဂျက်",
    "nav.education":  "ပညာရေး",
    "nav.contact":    "ဆက်သွယ်ရန်",

    /* Hero */
    "hero.badge":       "အလုပ်သင် ဆောင်ရွက်ရန် အဆင်သင့်",
    "hero.intro":       "ခေတ်မီပြီး လုပ်ဆောင်ချက်ကောင်းသော ဝဘ်အပလီကေးရှင်းများ တည်ဆောက်ရန် စိတ်အားထက်သန်သော junior developer တစ်ဦး ဖြစ်ပါသည်။ full-stack ဖွံ့ဖြိုးမှုနှင့် အသုံးပြုသူ အတွေ့အကြုံကောင်းများကို ဖန်တီးခြင်းကို အာရုံစိုက်ပါသည်။",
    "hero.cta.projects": "ပရောဂျက်များ ကြည့်ရှုရန်",
    "hero.cta.cv":       "CV ဒေါင်းလုဒ်",
    "hero.cta.contact":  "ဆက်သွယ်ရန်",

    /* Typing roles */
    "typing.roles": ["Full-stack Developer", "Frontend Developer", "Software Developer"],

    /* About */
    "about.eyebrow":  "ကျွန်တော့်အကြောင်း",
    "about.heading":  "အသုံးဝင်သောအရာများ တည်ဆောက်ရန် ကြိုက်နှစ်သက်သော developer တစ်ဦး။",
    "about.bio1":     "ကျွန်တော်က Aung Set Paing ဖြစ်ပြီး မြန်မာနိုင်ငံတွင် နေထိုင်သော junior developer တစ်ဦး ဖြစ်ပါသည်။ front-end နှင့် back-end နည်းပညာနှစ်ရပ်စလုံးတွင် အခိုင်အမာ အခြေခံအတတ်ပညာ ရှိပါသည်။ NCC Education Level 4 Diploma in Computing ဒီဂရီ ရရှိထားပြီး ပရိုဂရမ်မင်း၊ ဝဘ်ဖွံ့ဖြိုးမှုနှင့် ဆော့ဖ်ဝဲအင်ဂျင်နီယာ မူရင်းများကို လေ့လာ ဆည်းပူးခဲ့ပါသည်။",
    "about.bio2":     "responsive၊ accessible ဝဘ် interface များကို ဖန်တီးရသည်ကို နှစ်သက်ပြီး C#/.NET နှင့် SQL database ဖြင့် full-stack ဖွံ့ဖြိုးမှုကို တဖြည်းဖြည်း စိတ်ဝင်တစားဖြစ်လာသည်။ လက်တွေ့ ပတ်ဝန်းကျင်တွင် ကျွမ်းကျင်မှုများ တိုးမြှင့်ရန် အလုပ်သင် သို့မဟုတ် junior developer ရာထူးကို ရှာဖွေနေပါသည်။",
    "about.fact1":    "NCC Level 4 Computing",
    "about.fact2":    "Full-stack အာရုံစိုက်မှု",
    "about.fact3":    "အလုပ်သင် ရှာဖွေနေသည်",
    "about.stat1":    "ဒီပလိုမာ",
    "about.stat2":    "အဓိက နည်းပညာများ",
    "about.stat3":    "ပင်မ ပရောဂျက်",
    "about.stat4":    "နှစ် လုပ်ငန်းအတွေ့အကြုံ",

    /* Skills */
    "skills.eyebrow":          "ကျွန်တော် အသုံးပြုသောအရာများ",
    "skills.heading":          "ကျွမ်းကျင်မှုများနှင့် နည်းပညာများ",
    "skills.frontend.title":   "Frontend",
    "skills.frontend.responsive": "Responsive Design",
    "skills.frontend.uiux":    "UI / UX",
    "skills.backend.title":    "Backend",
    "skills.backend.serverside": "Server-side ဖွံ့ဖြိုးမှု",
    "skills.database.title":   "ဒေတာဘေ့စ်",
    "skills.database.design":  "ဒေတာဘေ့စ် ဒီဇိုင်း",
    "skills.database.mgmt":    "ဒေတာ စီမံခန့်ခွဲမှု",

    /* Projects */
    "projects.eyebrow":       "ကျွန်တော် တည်ဆောက်ခဲ့သောအရာများ",
    "projects.heading":       "ပရောဂျက်များ",
    "projects.filter.all":    "အားလုံး",
    "projects.filter.frontend":  "Frontend",
    "projects.filter.fullstack": "Full-stack",
    "projects.featured":      "ပင်မ",
    "projects.bean.desc":     "Responsive design၊ interactive UI နှင့် ကောင်းမွန်သော user experience ကို အာရုံစိုက်ထားသော ကော်ဖီဆိုင် ဝဘ်ဆိုဒ် တစ်ခု ဖြစ်ပါသည်။ လျှော့ဈေး modal၊ carousel၊ shopping cart၊ BrewMatch coffee finder၊ Google Maps embed နှင့် light/dark theme များ ပါဝင်သည်။",
    "projects.link.github":   "GitHub",
    "projects.link.demo":     "Live Demo ↗",
    "projects.comingsoon":    "မကြာမီ လာမည်",
    "projects.cs1.title":     "Full-stack Application",
    "projects.cs1.desc":      "အစီအစဉ်ဆွဲနေသော full-stack ဝဘ် အပလီကေးရှင်း တစ်ခု ဖြစ်ပါသည်။ C#/.NET back end နှင့် JavaScript front end၊ SQL database ချိတ်ဆက်မည်ဖြစ်သည်။",
    "projects.cs2.title":     "Developer Tool",
    "projects.cs2.desc":      "ကုတ်ရေးသူများအတွက် browser-based tool တစ်ခု ဖြစ်ပြီး productivity နှင့် clean UI ကို အာရုံစိုက်သည်။ ဒီဇိုင်း အဆင့်တွင် ရှိနေဆဲ ဖြစ်သည်။",

    /* Education */
    "education.eyebrow":           "ပညာရေး နောက်ခံ",
    "education.heading":           "ပညာရေး",
    "education.ncc.title":         "NCC Education Level 4 Diploma in Computing",
    "education.ncc.institution":   "NCC Education",
    "education.ncc.level":         "Level 4",
    "education.ncc.desc":          "ပရိုဂရမ်မင်း မူရင်းများ၊ ဝဘ်ဖွံ့ဖြိုးမှု၊ ဒေတာဘေ့စ် စီမံခန့်ခွဲမှု၊ system analysis နှင့် software engineering ပါဝင်သော နိုင်ငံတကာ အသိအမှတ်ပြု ဒီဂရီ တစ်ခု ဖြစ်ပါသည်။ နည်းပညာ နယ်ပယ်တွင် အသက်မွေးဝမ်းကျောင်းရေးအတွက် ခိုင်မာသော ပညာရပ် အခြေခံ ပေးစွမ်းသည်။",
    "education.ncc.tag4":          "Software Engineering",

    /* Contact */
    "contact.eyebrow":      "ဆက်သွယ်ရန်",
    "contact.heading":      "အတူ တည်ဆောက်ကြပါစို့။",
    "contact.subtext":      "ကျွန်တော်သည် ယခုလက်ရှိ ဝဘ်ဖွံ့ဖြိုးမှု အလုပ်သင် နှင့် junior developer ရာထူးများကို ရှာဖွေနေပါသည်။ ရာထူး၊ ပရောဂျက် သို့မဟုတ် မင်္ဂလာပါ ပြောချင်ရင်လည်း ဆက်သွယ်နိုင်ပါသည်။",
    "contact.email.label":  "အီးမေးလ်",
    "contact.copy":         "Email ကူးယူရန်",
    "contact.visit":        "ဝင်ရောက်ကြည့်ရှုရန် ↗",
    "contact.send":         "Email ပို့ပါ",

    /* Footer */
    "footer.title":  "Junior Developer",
    "footer.copy":   "© ၂၀၂၆ Aung Set Paing",

    /* Toast */
    "toast.copied":  "ကူးယူပြီးပါပြီ!",
  }
};

/* ─── Language manager ─── */
const LangManager = (() => {
  const STORAGE_KEY = 'portfolio-lang';
  let currentLang = 'en';

  /**
   * Get the active locale from storage or browser preference.
   * Falls back to 'en' if the preferred language is not supported.
   */
  function getInitialLang() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && translations[saved]) return saved;
    const browser = navigator.language.slice(0, 2);
    return translations[browser] ? browser : 'en';
  }

  /**
   * Walk every [data-i18n] element and replace its textContent
   * with the matching translation string. Does NOT touch
   * technology names, names, email or links.
   */
  function applyTranslations(lang) {
    const dict = translations[lang];
    if (!dict) return;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined && typeof dict[key] === 'string') {
        el.textContent = dict[key];
      }
    });

    /* Update <html lang> for screen readers and font rendering */
    document.documentElement.setAttribute('lang', lang === 'my' ? 'my' : 'en');

    /* Add Burmese line-height class to body when in Myanmar locale */
    if (lang === 'my') {
      document.body.setAttribute('lang', 'my');
    } else {
      document.body.removeAttribute('lang');
    }
  }

  /**
   * Update the navbar language toggle UI to reflect the active language.
   */
  function updateToggleUI(lang) {
    const labelEl = document.getElementById('langLabel');
    const altEl   = document.getElementById('langAlt');
    if (!labelEl || !altEl) return;

    if (lang === 'en') {
      labelEl.textContent = 'EN';
      altEl.textContent   = 'MY';
      labelEl.classList.add('active-lang');
      altEl.classList.remove('active-lang');
    } else {
      labelEl.textContent = 'MY';
      altEl.textContent   = 'EN';
      labelEl.classList.add('active-lang');
      altEl.classList.remove('active-lang');
    }
  }

  /** Switch to the given locale and persist the choice. */
  function setLang(lang) {
    if (!translations[lang]) return;
    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    applyTranslations(lang);
    updateToggleUI(lang);
  }

  /** Toggle between 'en' and 'my'. */
  function toggle() {
    setLang(currentLang === 'en' ? 'my' : 'en');
  }

  /** Expose a translation getter for use by main.js (e.g. typing roles). */
  function t(key) {
    const val = translations[currentLang]?.[key];
    return val !== undefined ? val : (translations['en']?.[key] ?? key);
  }

  /** Initialize the language system. */
  function init() {
    const lang = getInitialLang();
    setLang(lang);

    const btn = document.getElementById('langToggle');
    if (btn) {
      btn.addEventListener('click', toggle);
    }
  }

  return { init, toggle, setLang, t, getCurrent: () => currentLang };
})();

/* Auto-initialize once DOM is ready */
document.addEventListener('DOMContentLoaded', LangManager.init);
