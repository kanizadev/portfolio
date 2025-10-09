// Smooth scroll for nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        target.scrollIntoView({ behavior: 'smooth' });
    });
});

// Hamburger menu toggle
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("show");
});

// EmailJS integration for contact form
(function () {
    emailjs.init("2HcyjXrWoH_pkVI8W"); // Replace with your public key
})();

document.getElementById("contactForm").addEventListener("submit", function (e) {
    e.preventDefault();

    emailjs.sendForm('service_yq4fpnq', 'template_vhy0wju', this)
        .then(() => {
            document.getElementById("formResponse").innerText = "Message sent!";
            this.reset();
        }, (err) => {
            document.getElementById("formResponse").innerText = "Error sending.";
            console.error("EmailJS error:", err);
        });
});

// Matrix digital rain effect
const canvas = document.getElementById("matrix");
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
