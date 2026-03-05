// Hamburger menu toggle
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("show");
});

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
