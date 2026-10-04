/**
 * SANATH KUMAR - PORTFOLIO INTERACTION ENGINE
 * High-performance, zero-dependency animations, canvas, and micro-interactions
 */

document.addEventListener('DOMContentLoaded', () => {

    const isMobile = window.innerWidth < 768;

    /* ==========================================================================
       1. Ambient Interactive Particle Canvas
       ========================================================================== */
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        let particles = [];
        const particleCount = isMobile ? 35 : 75;
        const maxDistance = isMobile ? 85 : 125;

        let mouse = {
            x: null,
            y: null,
            radius: 120
        };

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        window.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initParticles();
        });

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.45;
                this.vy = (Math.random() - 0.5) * 0.45;
                this.size = Math.random() * 1.8 + 0.8;
                this.baseAlpha = Math.random() * 0.4 + 0.2;
                this.alpha = this.baseAlpha;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Screen boundaries bounce
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;

                // Mouse interaction
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < mouse.radius) {
                        const force = (mouse.radius - dist) / mouse.radius;
                        this.x -= (dx / dist) * force * 1.5;
                        this.y -= (dy / dist) * force * 1.5;
                        this.alpha = Math.min(1, this.baseAlpha + 0.4);
                    } else {
                        this.alpha = this.baseAlpha;
                    }
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(160, 213, 133, ${this.alpha})`;
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        let animationFrameId;
        function animateParticles() {
            ctx.clearRect(0, 0, width, height);

            // Draw connecting lines
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < maxDistance) {
                        const opacity = (1 - dist / maxDistance) * 0.22;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(105, 132, 169, ${opacity})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            }

            // Update & draw particles
            particles.forEach(p => {
                p.update();
                p.draw();
            });

            animationFrameId = requestAnimationFrame(animateParticles);
        }

        // Pause animation when tab is not active to save battery
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                cancelAnimationFrame(animationFrameId);
            } else {
                animationFrameId = requestAnimationFrame(animateParticles);
            }
        });

        initParticles();
        animateParticles();
    }


    /* ==========================================================================
       3. Typewriter Effect
       ========================================================================== */
    const typewriterEl = document.getElementById('typewriter');
    if (typewriterEl) {
        const phrases = [
            "Real-Time Systems",
            "Scalable APIs",
            "Modern Web Apps"
        ];

        let phraseIdx = 0;
        let charIdx = 0;
        let isDeleting = false;
        let typeSpeed = 90;

        function typeLoop() {
            const currentPhrase = phrases[phraseIdx];

            if (isDeleting) {
                typewriterEl.textContent = currentPhrase.substring(0, charIdx - 1);
                charIdx--;
                typeSpeed = 40;
            } else {
                typewriterEl.textContent = currentPhrase.substring(0, charIdx + 1);
                charIdx++;
                typeSpeed = 85;
            }

            if (!isDeleting && charIdx === currentPhrase.length) {
                typeSpeed = 2200; // Pause at full word
                isDeleting = true;
            } else if (isDeleting && charIdx === 0) {
                isDeleting = false;
                phraseIdx = (phraseIdx + 1) % phrases.length;
                typeSpeed = 400; // Pause before typing next word
            }

            setTimeout(typeLoop, typeSpeed);
        }

        setTimeout(typeLoop, 500);
    }

    /* ==========================================================================
       4. Hero Code Window Tabs
       ========================================================================== */
    const codeTabs = document.querySelectorAll('.window-tab');
    codeTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = `tab-${tab.getAttribute('data-tab')}`;
            codeTabs.forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));

            tab.classList.add('active');
            const targetPane = document.getElementById(targetId);
            if (targetPane) targetPane.classList.add('active');
        });
    });

    /* ==========================================================================
       5. Interactive Terminal Playground in About Section
       ========================================================================== */
    const termInput = document.getElementById('terminal-input');
    const termOutput = document.getElementById('terminal-output');
    const cmdChips = document.querySelectorAll('.cmd-chip');

    const commands = {
        help: () => `
Available Commands:
  • <span class="term-highlight">projects</span>  - List flagship engineering projects
  • <span class="term-highlight">skills</span>    - View key technical stack & expertise
  • <span class="term-highlight">contact</span>   - Get email, socials, and contact endpoints
  • <span class="term-highlight">whoami</span>    - Learn about the creator
  • <span class="term-highlight">date</span>      - Show live time & timezone
  • <span class="term-highlight">sudo hire</span> - Special easter egg command 😉
  • <span class="term-highlight">clear</span>     - Clear terminal buffer
        `,
        projects: () => `
<span class="term-success">🚀 Featured Works:</span>
1. <span class="term-highlight">PulseGuard</span>: Real-time SaaS uptime monitor with sub-second WebSockets & Redis.
   ↳ Live: <a href="https://pulse-guard-flame.vercel.app" target="_blank" style="color:#a0d585; text-decoration:underline;">pulse-guard-flame.vercel.app</a>
2. <span class="term-highlight">Tabflow</span>: AI browser extension workspace with client-side AES-256 vault encryption.
   ↳ Live: <a href="https://tabflow-extension.vercel.app/" target="_blank" style="color:#a0d585; text-decoration:underline;">tabflow-extension.vercel.app</a>
3. <span class="term-highlight">sentinel-cli</span>: Autonomous smart terminal assistant for automated code error patching.
   ↳ GitHub: <a href="https://github.com/sanathkmr14/sentinel-cli" target="_blank" style="color:#a0d585; text-decoration:underline;">github.com/sanathkmr14/sentinel-cli</a>
        `,
        skills: () => `
<span class="term-success">⚡ Core Tech Stack:</span>
  • Languages: Python, JavaScript (ES6+), TypeScript, SQL, Bash
  • Frontend:  React, Redux Toolkit, Tailwind CSS, Vite
  • Backend:   Node.js, Express, Django REST, FastAPI, WebSockets
  • Data:      Redis, MongoDB, MySQL, BullMQ, Pandas, NumPy
  • DevOps:    Docker, Kubernetes, Linux, Git & GitHub, CI/CD
        `,
        contact: () => `
<span class="term-success">📬 Get in Touch:</span>
  • Email:    <span class="term-highlight">sanathkumar.job@gmail.com</span>
  • GitHub:   <a href="https://github.com/sanathkmr14" target="_blank" style="color:#a0d585;">github.com/sanathkmr14</a>
  • LinkedIn: <a href="https://www.linkedin.com/in/sanathkumar14/" target="_blank" style="color:#a0d585;">linkedin.com/in/sanathkumar14/</a>
  • Twitter:  <a href="https://x.com/sanathp14" target="_blank" style="color:#a0d585;">x.com/sanathp14</a>
        `,
        whoami: () => `
<span class="term-success">👨‍💻 Sanath Kumar</span>
Full-Stack Developer passionate about engineering performant, resilient systems and intuitive tools.
Currently available for high-impact opportunities!
        `,
        date: () => `
Current IST Time: <span class="term-highlight">${new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })} (UTC +5:30)</span>
        `,
        'sudo hire': () => `
<span class="term-success">🎉 ACCESS GRANTED!</span>
Sanath would love to collaborate on your team! Let's build something exceptional.
Shoot an email right away to: <span class="term-highlight">sanathkumar.job@gmail.com</span>
        `
    };

    function executeCommand(rawCmd) {
        const cmd = rawCmd.trim().toLowerCase();
        if (!cmd) return;

        // Create command echo
        const echoLine = document.createElement('div');
        echoLine.className = 'term-line';
        echoLine.innerHTML = `<span class="term-prompt">guest@portfolio:~$</span> <span class="term-highlight">${escapeHtml(rawCmd)}</span>`;
        termOutput.appendChild(echoLine);

        if (cmd === 'clear') {
            termOutput.innerHTML = '';
        } else if (commands[cmd]) {
            const respLine = document.createElement('div');
            respLine.className = 'term-line';
            respLine.innerHTML = commands[cmd]();
            termOutput.appendChild(respLine);
        } else {
            const errorLine = document.createElement('div');
            errorLine.className = 'term-line term-muted';
            errorLine.innerHTML = `command not found: "${escapeHtml(rawCmd)}". Type <span class="term-highlight">help</span> for a list of commands.`;
            termOutput.appendChild(errorLine);
        }

        termOutput.scrollTop = termOutput.scrollHeight;
    }

    if (termInput) {
        termInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const val = termInput.value;
                termInput.value = '';
                executeCommand(val);
            }
        });
    }

    cmdChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const cmd = chip.getAttribute('data-cmd');
            if (termInput) termInput.value = cmd;
            executeCommand(cmd);
            if (termInput) termInput.value = '';
        });
    });

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /* ==========================================================================
       6. Live Clock (Bangalore / IST)
       ========================================================================== */
    const liveClockEl = document.getElementById('live-clock');
    function updateClock() {
        if (!liveClockEl) return;
        const now = new Date();
        const options = {
            timeZone: 'Asia/Kolkata',
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
        liveClockEl.textContent = new Intl.DateTimeFormat('en-GB', options).format(now);
    }
    updateClock();
    setInterval(updateClock, 1000);

    /* ==========================================================================
       7. Spotlight Card Glow & 3D Tilt
       ========================================================================== */
    const spotlightCards = document.querySelectorAll('.spotlight-card');
    spotlightCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    const tiltCards = document.querySelectorAll('[data-tilt]');
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && !isMobile) {
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = ((y - centerY) / centerY) * -6;
                const rotateY = ((x - centerX) / centerX) * 6;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
            });
        });
    }

    /* ==========================================================================
       8. Filterable Skills Matrix
       ========================================================================== */
    const filterBtns = document.querySelectorAll('.skill-filter-btn');
    const skillCards = document.querySelectorAll('.skill-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.getAttribute('data-category');

            skillCards.forEach(card => {
                const cardCat = card.getAttribute('data-category');
                if (category === 'all' || cardCat === category) {
                    card.style.display = 'flex';
                    card.style.animation = 'fadeIn 0.35s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    /* ==========================================================================
       9. 1-Click Copy Email with Toast System
       ========================================================================== */
    const toastContainer = document.getElementById('toast-container');

    function showToast(message, type = 'info', icon = 'bx-info-circle') {
        if (!toastContainer) return;
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `<i class='bx ${icon}'></i> <span>${message}</span>`;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('hiding');
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }

    const copyEmailBtns = document.querySelectorAll('.copy-email-btn');
    copyEmailBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            const email = btn.getAttribute('data-email') || 'sanathkumar.job@gmail.com';
            try {
                await navigator.clipboard.writeText(email);
                showToast(`Copied to clipboard: ${email}`, 'success', 'bx-check-circle');
            } catch (err) {
                // Fallback for older browsers
                const tempInput = document.createElement('input');
                tempInput.value = email;
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand('copy');
                document.body.removeChild(tempInput);
                showToast(`Copied to clipboard: ${email}`, 'success', 'bx-check-circle');
            }
        });
    });

    /* ==========================================================================
       10. Scroll Reveal Animation via IntersectionObserver
       ========================================================================== */
    const revealElements = document.querySelectorAll('[data-reveal]');
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback
        revealElements.forEach(el => el.classList.add('revealed'));
    }

    /* ==========================================================================
       11. Navbar Scroll Blur & Mobile Drawer
       ========================================================================== */
    const navbar = document.getElementById('navbar');
    const menuBtn = document.getElementById('menu-btn');
    const navLinks = document.getElementById('nav-links');
    const navLinkItems = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        updateActiveNavLink();
        updateBackToTop();
    }, { passive: true });

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        navLinkItems.forEach(link => {
            link.addEventListener('click', () => {
                menuBtn.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section');
        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 160;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinkItems.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    /* ==========================================================================
       12. Back To Top Button & Progress Ring
       ========================================================================== */
    const backToTopBtn = document.getElementById('back-to-top');
    const progressCircle = document.querySelector('.progress-ring-circle');
    const circumference = progressCircle ? 2 * Math.PI * progressCircle.r.baseVal.value : 0;

    if (progressCircle) {
        progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
        progressCircle.style.strokeDashoffset = circumference;
    }

    function updateBackToTop() {
        if (!backToTopBtn) return;
        const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
        const scrollCurrent = window.scrollY;

        if (scrollCurrent > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }

        if (progressCircle && scrollTotal > 0) {
            const progress = scrollCurrent / scrollTotal;
            const offset = circumference - (progress * circumference);
            progressCircle.style.strokeDashoffset = offset;
        }
    }

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ==========================================================================
       13. Contact Form AJAX Submission
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const formStatusMsg = document.getElementById('form-status-msg');

    if (contactForm && submitBtn) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const originalContent = submitBtn.innerHTML;

            // Clear previous message
            if (formStatusMsg) {
                formStatusMsg.className = 'form-status-msg';
                formStatusMsg.textContent = '';
            }

            // Loading state
            submitBtn.innerHTML = `<span>Sending Message...</span> <i class='bx bx-loader-alt bx-spin'></i>`;
            submitBtn.disabled = true;

            const formData = new FormData(contactForm);

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    submitBtn.innerHTML = `<span>Message Sent!</span> <i class='bx bx-check'></i>`;
                    submitBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
                    
                    if (formStatusMsg) {
                        formStatusMsg.className = 'form-status-msg success';
                        formStatusMsg.innerHTML = `<i class='bx bx-check-double'></i> <span>Thank you! Message sent successfully.</span>`;
                    }
                    contactForm.reset();

                    setTimeout(() => {
                        submitBtn.innerHTML = originalContent;
                        submitBtn.style.background = '';
                        submitBtn.disabled = false;
                        if (formStatusMsg) {
                            formStatusMsg.className = 'form-status-msg';
                            formStatusMsg.innerHTML = '';
                        }
                    }, 4500);
                } else {
                    throw new Error('Form submission failed.');
                }
            } catch (error) {
                submitBtn.innerHTML = `<span>Error Sending</span> <i class='bx bx-error'></i>`;
                submitBtn.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
                
                if (formStatusMsg) {
                    formStatusMsg.className = 'form-status-msg error';
                    formStatusMsg.innerHTML = `<i class='bx bx-error-circle'></i> Could not deliver message. Please email directly to <a href="mailto:sanathkmr96@gmail.com" style="color:inherit;text-decoration:underline;">sanathkmr96@gmail.com</a>`;
                }

                setTimeout(() => {
                    submitBtn.innerHTML = originalContent;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                    if (formStatusMsg) {
                        formStatusMsg.className = 'form-status-msg';
                        formStatusMsg.innerHTML = '';
                    }
                }, 4500);
            }
        });
    }
});
