// Hamburger menu toggle
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("show");
        hamburger.setAttribute("aria-expanded", isOpen);
        hamburger.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    });

    // Close menu when a link is clicked (mobile)
    navLinks.addEventListener("click", (e) => {
        const target = e.target;
        if (!(target instanceof Element)) return;
        if (!target.closest("a")) return;
        if (!navLinks.classList.contains("show")) return;

        navLinks.classList.remove("show");
        hamburger.setAttribute("aria-expanded", "false");
        hamburger.setAttribute("aria-label", "Open menu");
    });

    // Close menu on Escape
    window.addEventListener("keydown", (e) => {
        if (e.key !== "Escape") return;
        if (!navLinks.classList.contains("show")) return;
        navLinks.classList.remove("show");
        hamburger.setAttribute("aria-expanded", "false");
        hamburger.setAttribute("aria-label", "Open menu");
    });

    // Close menu when clicking outside (mobile)
    document.addEventListener("pointerdown", (e) => {
        if (!navLinks.classList.contains("show")) return;
        const target = e.target;
        if (!(target instanceof Element)) return;
        const nav = hamburger.closest("nav");
        if (nav && nav.contains(target)) return;
        navLinks.classList.remove("show");
        hamburger.setAttribute("aria-expanded", "false");
        hamburger.setAttribute("aria-label", "Open menu");
    });
}

// Footer year
const yearEl = document.getElementById("year");
if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
}

function isNfcMode() {
    return new URLSearchParams(window.location.search).get("nfc") === "true";
}

function initNfcMode() {
    if (!isNfcMode()) return;

    document.body.classList.add("nfc-mode");

    const banner = document.createElement("div");
    banner.className = "nfc-banner";
    banner.textContent = "NFC mode activated 🌿";
    document.body.prepend(banner);

    requestAnimationFrame(() => {
        document.body.classList.add("nfc-mode-active");
    });
}

initNfcMode();

// Scroll reveal animations
(() => {
    const candidates = [
        ".intro",
        "section h2",
        "#about .about-card",
        "#contact .contact-form",
        ".project",
    ];

    const elements = document.querySelectorAll(candidates.join(","));
    if (!elements.length) return;

    // Add base reveal class and optional staggering
    elements.forEach((el) => {
        el.classList.add("reveal");
        if (el.matches(".intro, #about .about-card, #contact .contact-form")) {
            el.classList.add("reveal-scale");
        }
    });

    const projectCards = document.querySelectorAll(".project-list .project");
    projectCards.forEach((card, idx) => {
        card.style.setProperty("--reveal-delay", `${Math.min(idx * 70, 420)}ms`);
    });

    const prefersReduced =
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
        elements.forEach((el) => el.classList.add("is-visible"));
        return;
    }

    const io = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-visible");
                io.unobserve(entry.target);
            });
        },
        { threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
    );

    // If an element is already in view on load (like the contact card),
    // show it immediately to avoid a "jump" feeling.
    const viewportH = window.innerHeight || 0;
    elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const inView = rect.top < viewportH * 0.9 && rect.bottom > 0;
        if (inView) {
            el.classList.add("is-visible");
            return;
        }
        io.observe(el);
    });
})();

// EmailJS integration for contact form (only on pages that have it)
if (typeof emailjs !== "undefined") {
    (function () {
        emailjs.init("2HcyjXrWoH_pkVI8W"); // Replace with your public key
    })();

    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", function (e) {
            e.preventDefault();

            emailjs.sendForm("service_yq4fpnq", "template_vhy0wju", this)
                .then(() => {
                    const responseEl = document.getElementById("formResponse");
                    if (responseEl) {
                        responseEl.innerText = "Message sent!";
                    }
                    this.reset();
                }, (err) => {
                    const responseEl = document.getElementById("formResponse");
                    if (responseEl) {
                        responseEl.innerText = "Error sending.";
                    }
                    console.error("EmailJS error:", err);
                });
        });
    }
}

// Matrix digital rain effect (only if canvas exists)
const canvas = document.getElementById("matrix");
if (canvas) {
    const ctx = canvas.getContext("2d");

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();

    let columns = Math.floor(canvas.width / 20);
    let drops = Array(columns).fill(1);

    function drawMatrix() {
        ctx.fillStyle = "rgba(14,15,17,0.1)";  // fade effect
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#00ffae"; // accent color
        ctx.font = "15px monospace";

        for (let i = 0; i < drops.length; i++) {
            const char = String.fromCharCode(0x30A0 + Math.random() * 96);
            const x = i * 20;
            const y = drops[i] * 20;

            ctx.fillText(char, x, y);

            if (y > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }

            drops[i]++;
        }
    }

    setInterval(drawMatrix, 50);

    window.addEventListener("resize", () => {
        resizeCanvas();
        columns = Math.floor(canvas.width / 20);
        drops = Array(columns).fill(1);
    });
}

// Custom cursor follower
const cursorDot = document.querySelector(".cursor-dot");
if (cursorDot) {
    let currentX = window.innerWidth / 2;
    let currentY = window.innerHeight / 2;
    let targetX = currentX;
    let targetY = currentY;

    window.addEventListener("mousemove", (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
        cursorDot.style.opacity = 1;
        cursorDot.classList.remove("hidden");
    });

    window.addEventListener("mouseleave", () => {
        cursorDot.classList.add("hidden");
    });

    function animateCursor() {
        currentX += (targetX - currentX) * 0.18;
        currentY += (targetY - currentY) * 0.18;
        cursorDot.style.transform = `translate(${currentX}px, ${currentY}px)`;
        requestAnimationFrame(animateCursor);
    }

    animateCursor();
}

const projectDetailsData = [
    {
        slug: "sage-green-calculator",
        title: "Sage Green Calculator",
        subtitle: "A focused Flutter calculator app with a calm sage green palette and glassmorphism UI, crafted for distraction-free everyday use.",
        description: "This Flutter app delivers a calm calculator experience focused on everyday math tasks. The interface combines a sage green palette with glassmorphism cards for a polished, readable layout.",
        meta: [
            "Tech: Flutter, Dart",
            "Role: Solo designer & developer",
            "Focus: Clean UX and responsive keypad interactions"
        ],
        highlights: [
            "Glassmorphism card UI with soft glow accents",
            "Custom calculator logic and large-friendly buttons",
            "Responsive layout for phones and tablets",
            "Subtle input animations and haptics-ready polish"
        ],
        code: "https://github.com/kanizadev/p001",
        demo: null
    },
    {
        slug: "cube-clock-3d-flip-clock",
        title: "Cube Clock – 3D Flip Clock",
        subtitle: "A 3D flip-style digital clock built with HTML, CSS, and JavaScript, featuring smooth cube transitions and a clean, futuristic desk-clock feel.",
        description: "This clock uses CSS 3D transforms and JavaScript timing to create a mesmerising flip animation. The design remains minimalist while the cubes feel tactile and responsive.",
        meta: [
            "Tech: HTML, CSS, JavaScript",
            "Highlights: CSS 3D transforms, smooth flip animations, responsive layout",
            "Use case: Ambient time display for landing pages and dashboards"
        ],
        highlights: [
            "Interactive cube-style time cards",
            "Smooth flip animations driven by JavaScript intervals",
            "Responsive layout built for desktop and mobile",
            "A crisp, futuristic visual language"
        ],
        code: "https://github.com/kanizadev/p-1",
        demo: "https://kanizadev.github.io/p-1/"
    },
    {
        slug: "gradient-palette-generator",
        title: "Gradient Palette Generator",
        subtitle: "A gradient palette generator that helps you explore, tweak, and save modern color combinations directly in the browser.",
        description: "This browser-based tool lets users create and refine gradient palettes with instant previews. It includes randomization, custom controls, and clipboard-friendly color copy features.",
        meta: [
            "Tech: HTML, CSS, JavaScript",
            "Highlights: Random and custom gradients, copy-to-clipboard, saved favorites",
            "Use case: Fast visual exploration for UI and branding ideas"
        ],
        highlights: [
            "Instant gradient previews across multiple card layouts",
            "Copy-to-clipboard support for CSS and color tokens",
            "Save favorite palettes for later reuse",
            "Clean, creative tooling interface"
        ],
        code: "https://github.com/kanizadev/p-2",
        demo: "https://kanizadev.github.io/p-2/"
    },
    {
        slug: "advanced-tic-tac-toe-game",
        title: "Advanced Tic Tac Toe Game",
        subtitle: "A modern Flutter take on Tic Tac Toe with multiple board sizes, AI opponents, and timed challenges for more replayability.",
        description: "This app expands classic Tic Tac Toe with variable grid sizes and built-in AI opponents, offering a polished board experience and score tracking.",
        meta: [
            "Tech: Flutter, Dart",
            "Highlights: AI difficulty levels, 3×3 and larger boards, match history, animations",
            "Focus: Game architecture, state management, and polished UX"
        ],
        highlights: [
            "Flexible board sizes for varied gameplay",
            "AI opponents with configurable difficulty",
            "Animated win and move feedback",
            "Match history and replay-friendly flow"
        ],
        code: "https://github.com/kanizadev/p002",
        demo: null
    },
    {
        slug: "weather-app",
        title: "Weather App",
        subtitle: "A beautiful, modern weather app that surfaces real-time conditions and forecasts with a soft, friendly Flutter UI.",
        description: "This weather experience delivers current conditions and multi-day forecasts through a calm card-based interface. API error handling and responsive layout keep the experience smooth.",
        meta: [
            "Tech: Flutter, Dart, REST APIs",
            "Highlights: Current weather, multi-day forecast, icon-driven UI, responsive cards",
            "Focus: API integration, error handling, and clean information hierarchy"
        ],
        highlights: [
            "Real-time weather conditions and forecasts",
            "Responsive, layered cards for readability",
            "Icon-driven weather states and details",
            "Graceful API error and loading states"
        ],
        code: "https://github.com/kanizadev/p003",
        demo: null
    },
    {
        slug: "advanced-bmi-calculator",
        title: "Advanced BMI Calculator",
        subtitle: "A modern Flutter BMI and body-composition calculator with a calm glassmorphism design and sage green color system.",
        description: "This calculator provides body mass index and category feedback in an elegant interface. It prioritizes quick entry, validation, and clear health context.",
        meta: [
            "Tech: Flutter, Dart",
            "Highlights: BMI and category feedback, input validation, responsive layout",
            "Focus: UX for data input and clear, human-readable health feedback"
        ],
        highlights: [
            "Sage green glassmorphism interface",
            "Contextual BMI feedback and categories",
            "Accessible input validation and layout",
            "Smooth transitions between results and entry"
        ],
        code: "https://github.com/kanizadev/p004",
        demo: null
    },
    {
        slug: "kaniza-personal-portfolio",
        title: "Kaniza's Personal Portfolio",
        subtitle: "A responsive portfolio built with Flutter to showcase skills, projects, and a simple contact flow for clients and recruiters.",
        description: "This personal branding app highlights projects, experience, and contact pathways with reusable components and a polished section-based layout.",
        meta: [
            "Tech: Flutter, Dart",
            "Highlights: Multi-section layout, reusable UI components, responsive design",
            "Focus: Personal branding and clean presentation of work"
        ],
        highlights: [
            "Sectioned portfolio and about views",
            "Reusable card and text components",
            "Responsive mobile-first layout",
            "Clean presentation for recruiters and clients"
        ],
        code: "https://github.com/kanizadev/p005",
        demo: null
    },
    {
        slug: "quiz-app",
        title: "Quiz App",
        subtitle: "A playful Flutter quiz app with multiple-choice questions, scoring, and a clear results screen.",
        description: "This quiz app delivers questions, tracks scores, and presents a clean summary screen, all in a lightweight, friendly UI.",
        meta: [
            "Tech: Flutter, Dart",
            "Highlights: Question navigation, score tracking, simple state management",
            "Use case: Lightweight learning and trivia experiences"
        ],
        highlights: [
            "Multiple-choice quizzes with instant feedback",
            "Score tracking and results screen",
            "Clear, approachable typography",
            "Simple state-driven quiz flow"
        ],
        code: "https://github.com/kanizadev/p006",
        demo: null
    },
    {
        slug: "multi-step-registration-form",
        title: "Multi-Step Registration Form",
        subtitle: "A feature-rich multi-step Flutter form that guides users through a smooth, low-stress sign-up journey.",
        description: "This registration flow breaks data capture into manageable steps, with progress guidance and validation to keep users moving forward.",
        meta: [
            "Tech: Flutter, Dart",
            "Highlights: Stepper flow, validation per step, progress indication, sage green theme",
            "Focus: Form UX, error states, and micro-interactions"
        ],
        highlights: [
            "Stepped registration with progress indicators",
            "Field validation and friendly error handling",
            "Calm sage green brand styling",
            "Focused onboarding for higher completion rates"
        ],
        code: "https://github.com/kanizadev/p007",
        demo: null
    },
    {
        slug: "flutter-examples-app",
        title: "Flutter Examples App",
        subtitle: "A comprehensive Flutter playground with 38+ interactive examples from basic widgets to more advanced patterns.",
        description: "This reference app collects dozens of Flutter examples into one place, making it easy to explore UI patterns and component behavior.",
        meta: [
            "Tech: Flutter, Dart",
            "Highlights: Categorised demos, live previews, clean code organization",
            "Use case: Learning companion and reference for Flutter newcomers"
        ],
        highlights: [
            "38+ widget and UI examples",
            "Organised examples for easy discovery",
            "Live preview-style interaction demos",
            "Clear code structure for learning"
        ],
        code: "https://github.com/kanizadev/p008",
        demo: null
    },
    {
        slug: "snake-game",
        title: "Snake Game",
        subtitle: "A classic Snake game re-imagined in Flutter with smooth controls and a minimal, modern grid UI.",
        description: "This game brings the nostalgia of Snake into a modern app experience, with responsive controls and a clean board layout.",
        meta: [
            "Tech: Flutter, Dart",
            "Highlights: Real-time game loop, collision detection, increasing difficulty",
            "Focus: Game mechanics and responsive canvas layout"
        ],
        highlights: [
            "Classic Snake mechanics with smooth movement",
            "Collision logic and increasing challenge",
            "Minimal grid-based visuals",
            "Simple restart and scoring flow"
        ],
        code: "https://github.com/kanizadev/p009",
        demo: null
    },
    {
        slug: "flutter-audio-player",
        title: "Flutter Audio Player",
        subtitle: "A tiny, polished multi-platform music player that keeps the UI calm while the audio engine does the hard work underneath.",
        description: "This audio player combines minimal controls, track progress, and cross-platform compatibility for a refined listening interface.",
        meta: [
            "Tech: Flutter, Dart",
            "Highlights: Play / pause controls, track progress, minimal player chrome",
            "Focus: Audio APIs and cross-platform behavior"
        ],
        highlights: [
            "Play, pause, and track progress controls",
            "Minimalistic audio interface",
            "Cross-platform playback support",
            "Smooth transitions between tracks"
        ],
        code: "https://github.com/kanizadev/p010",
        demo: null
    },
    {
        slug: "language-translator-app",
        title: "Language Translator App",
        subtitle: "A neat Flutter language translator that keeps the interface simple while supporting multiple languages.",
        description: "This translator app offers quick input and output areas, with clean controls and async translation flow.",
        meta: [
            "Tech: Flutter, Dart, translation APIs",
            "Highlights: Text translation, clear input/output areas, minimal UI",
            "Focus: Working with external APIs and async UX states"
        ],
        highlights: [
            "Simple translation input and output",
            "Clean, accessible presentation",
            "Async state handling for API requests",
            "Minimal design that keeps users focused"
        ],
        code: "https://github.com/kanizadev/p011",
        demo: null
    },
    {
        slug: "advanced-todo-list-app",
        title: "Advanced Todo List App",
        subtitle: "A glassmorphism Todo app in sage green that turns daily task management into a calmer experience.",
        description: "This task manager app helps users organize lists with a polished interface, motion, and helpful completion states.",
        meta: [
            "Tech: Flutter, Dart",
            "Highlights: Task creation and completion, sections, animated cards",
            "Focus: List management UX and visual hierarchy"
        ],
        highlights: [
            "Animated glassmorphism task cards",
            "Task creation, editing, and completion",
            "Organized sections for better workflow",
            "Calming color system with clear hierarchy"
        ],
        code: "https://github.com/kanizadev/p012",
        demo: null
    },
    {
        slug: "news-app",
        title: "News App",
        subtitle: "A Flutter news reader that brings headlines and articles into a clean, scroll-first reading experience.",
        description: "This reader app delivers article headlines and details with a focus on readability and clear navigation.",
        meta: [
            "Tech: Flutter, Dart, REST APIs",
            "Highlights: Latest headlines, article details, loading and error states",
            "Focus: Consuming APIs and structuring content for readability"
        ],
        highlights: [
            "Headline feed with article detail views",
            "Loading and error handling for API content",
            "Clean reading layout for long-form text",
            "A calm app experience for news consumption"
        ],
        code: "https://github.com/kanizadev/p013",
        demo: null
    },
    {
        slug: "advanced-color-palette-generator",
        title: "Advanced Color Palette Generator",
        subtitle: "A Flutter color-palette generator with multiple color-scheme types and a soft glassmorphism aesthetic.",
        description: "This design tool lets users create palettes with multiple modes, copyable values, and a polished UI for color exploration.",
        meta: [
            "Tech: Flutter, Dart",
            "Highlights: Multiple palette modes, randomization, copyable color values",
            "Focus: Design tooling UI and color handling"
        ],
        highlights: [
            "Multiple palette generation modes",
            "Color value copy and share-ready formats",
            "Randomization for fast exploration",
            "Soft glassmorphism interface for designers"
        ],
        code: "https://github.com/kanizadev/p014",
        demo: null
    },
    {
        slug: "pixel-art-studio",
        title: "Pixel Art Studio",
        subtitle: "A Flutter pixel-art editor with a nostalgic 8-bit feel and simple drawing tools.",
        description: "This app provides a grid-based drawing surface, color selection, and clear controls for creating pixel art.",
        meta: [
            "Tech: Flutter, Dart",
            "Highlights: Tap-to-draw grid, color picker, clear canvas actions",
            "Focus: Custom drawing surfaces and interaction design"
        ],
        highlights: [
            "8-bit pixel grid drawing tool",
            "Color palette picker for fast switching",
            "Clear and reset canvas controls",
            "Nostalgic, pixel-focused UI design"
        ],
        code: "https://github.com/kanizadev/p015",
        demo: null
    },
    {
        slug: "fortune-wheel",
        title: "Fortune Wheel",
        subtitle: "A minimal-yet-cute Flutter fortune wheel with a sage green theme and glassmorphism accents.",
        description: "This app turns decision-making into a playful experience using a spinning wheel and configurable outcome segments.",
        meta: [
            "Tech: Flutter, Dart",
            "Highlights: Spin animations, random selection, configurable wheel segments",
            "Focus: Animation curves and playful micro-interactions"
        ],
        highlights: [
            "Smooth wheel spin animations",
            "Randomized segment selection",
            "Configurable options for quick input",
            "Playful, calming design language"
        ],
        code: "https://github.com/kanizadev/p016",
        demo: null
    },
    {
        slug: "sudoku-master",
        title: "Sudoku Master",
        subtitle: "A Flutter Sudoku app that keeps the board clean and readable while the puzzles get harder.",
        description: "This puzzle app delivers a crisp Sudoku board, number inputs, and move feedback in a modern layout.",
        meta: [
            "Tech: Flutter, Dart",
            "Highlights: Grid-based board, number input, feedback for moves",
            "Focus: Game layout and rule-driven UX"
        ],
        highlights: [
            "Readable Sudoku grid and cell selection",
            "Number input support and candidate notes",
            "Move validation and guidance",
            "A calm layout for puzzle solving"
        ],
        code: "https://github.com/kanizadev/p017",
        demo: null
    },
    {
        slug: "kids-crossword-fun",
        title: "Kids Crossword Fun!",
        subtitle: "A Flutter crossword app for kids with simple words, big tiles, and friendly visuals.",
        description: "This app makes crossword puzzles approachable for young learners through large tiles, simple clues, and playful visuals.",
        meta: [
            "Tech: Flutter, Dart",
            "Highlights: Child-friendly grid, easy clues, playful color palette",
            "Focus: Designing for younger users and accessibility"
        ],
        highlights: [
            "Large grid tiles and simple interactions",
            "Bright, playful UI for kids",
            "Easier clues designed for early puzzlers",
            "Accessible game flow and friendly feedback"
        ],
        code: "https://github.com/kanizadev/p018",
        demo: null
    }
];

function getProjectSlug() {
    return new URLSearchParams(window.location.search).get("slug");
}

function renderProjectDetailPage() {
    const projectContainer = document.getElementById("projectContent");
    if (!projectContainer) return;

    const slug = getProjectSlug();
    const project = projectDetailsData.find((item) => item.slug === slug);

    if (!project) {
        projectContainer.innerHTML = `
            <h3>Project not found</h3>
            <p>The project you're looking for doesn't exist yet or the link is incorrect.</p>
            <div class="project-actions">
                <a class="btn-chip demo" href="projects.html">Back to projects ↗</a>
            </div>
        `;
        return;
    }

    const metaHtml = project.meta
        .map((metaItem) => `<li>${metaItem}</li>`)
        .join("");

    const highlightsHtml = project.highlights
        .map((item) => `<li>${item}</li>`)
        .join("");

    const detailLinks = [];
    if (project.demo) {
        detailLinks.push(`<a class="btn-chip demo" href="${project.demo}" target="_blank" rel="noopener noreferrer">live demo ↗</a>`);
    }
    detailLinks.push(`<a class="btn-chip code" href="${project.code}" target="_blank" rel="noopener noreferrer">view code ↗</a>`);
    detailLinks.push(`<a class="btn-chip" href="projects.html">back to projects ↗</a>`);

    projectContainer.innerHTML = `
        <h3>${project.title}</h3>
        <p>${project.subtitle}</p>
        <p>${project.description}</p>
        <ul class="project-meta">
            ${metaHtml}
        </ul>
        <div class="project-actions">
            ${detailLinks.join("")}
        </div>
        <div style="margin-top:1.5rem;">
            <h4>Highlights</h4>
            <ul class="project-meta">
                ${highlightsHtml}
            </ul>
        </div>
    `;
}

renderProjectDetailPage();
