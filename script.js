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
}

// Footer year
const yearEl = document.getElementById("year");
if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
}

// Scroll reveal animations
(() => {
    const candidates = [
        ".intro",
        "section h2",
        "#about .about-card",
        "#contact .contact-card",
        ".project",
        ".site-footer .footer-inner > *",
        ".site-footer .footer-bottom",
    ];

    const elements = document.querySelectorAll(candidates.join(","));
    if (!elements.length) return;

    // Add base reveal class and optional staggering
    elements.forEach((el) => {
        el.classList.add("reveal");
        if (el.matches(".intro, #about .about-card, #contact .contact-card")) {
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

    elements.forEach((el) => io.observe(el));
})();

// Profile photo parallax tilt (desktop only)
(() => {
    const photo = document.querySelector(".about-photo");
    if (!photo) return;

    const prefersReduced =
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isCoarse =
        window.matchMedia &&
        window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    if (prefersReduced || isCoarse) return;

    function clamp(n, min, max) {
        return Math.max(min, Math.min(max, n));
    }

    function setNeutral() {
        photo.style.setProperty("--rx", "0deg");
        photo.style.setProperty("--ry", "0deg");
        photo.style.setProperty("--mx", "50%");
        photo.style.setProperty("--my", "40%");
    }

    setNeutral();

    photo.addEventListener("pointermove", (e) => {
        const rect = photo.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        const dx = clamp(x * 2 - 1, -1, 1);
        const dy = clamp(y * 2 - 1, -1, 1);

        const rx = (-dy * 8).toFixed(2);
        const ry = (dx * 10).toFixed(2);

        photo.style.setProperty("--rx", `${rx}deg`);
        photo.style.setProperty("--ry", `${ry}deg`);
        photo.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
        photo.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
    });

    photo.addEventListener("pointerleave", () => {
        setNeutral();
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
