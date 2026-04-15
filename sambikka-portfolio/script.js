document.addEventListener('DOMContentLoaded', () => {
    const loader = document.querySelector('.loader');
    const navbar = document.querySelector('.navbar');
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const contactForm = document.getElementById('contactForm');
    const statNumbers = document.querySelectorAll('.stat-number');
    const skillFills = document.querySelectorAll('.skill-fill');
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');
    const canvas = document.getElementById('particleCanvas');

    let statsAnimated = false;
    let skillsAnimated = false;

    // Loader
    setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }, 2500);

    // Particle Canvas
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: null, y: null };

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.5 + 0.1;
                this.color = Math.random() > 0.5 ? '233, 30, 140' : '139, 92, 246';
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x > canvas.width) this.x = 0;
                if (this.x < 0) this.x = canvas.width;
                if (this.y > canvas.height) this.y = 0;
                if (this.y < 0) this.y = canvas.height;

                if (mouse.x !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 150) {
                        const force = (150 - distance) / 150;
                        this.x -= dx * force * 0.02;
                        this.y -= dy * force * 0.02;
                    }
                }
            }

            draw() {
                ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            const count = Math.min(100, Math.floor((canvas.width * canvas.height) / 15000));
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        }

        function connectParticles() {
            for (let a = 0; a < particles.length; a++) {
                for (let b = a + 1; b < particles.length; b++) {
                    const dx = particles[a].x - particles[b].x;
                    const dy = particles[a].y - particles[b].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 120) {
                        const opacity = (1 - distance / 120) * 0.15;
                        ctx.strokeStyle = `rgba(233, 30, 140, ${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            connectParticles();
            requestAnimationFrame(animateParticles);
        }

        initParticles();
        animateParticles();

        canvas.addEventListener('mousemove', (e) => {
            mouse.x = e.x;
            mouse.y = e.y;
        });

        canvas.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });
    }

    // Custom Cursor
    if (cursorDot && cursorRing) {
        document.addEventListener('mousemove', (e) => {
            cursorDot.style.left = e.clientX + 'px';
            cursorDot.style.top = e.clientY + 'px';

            setTimeout(() => {
                cursorRing.style.left = e.clientX + 'px';
                cursorRing.style.top = e.clientY + 'px';
            }, 80);
        });

        document.querySelectorAll('a, button, .social-btn, .project-card, .skill-category, .contact-card').forEach(el => {
            el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
        });
    }

    // Navbar scroll
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
        updateActiveNav();
        animateStats();
        animateSkillBars();
        animateOnScroll();
    });

    // Mobile menu
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Project filter
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            projectCards.forEach((card, index) => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.classList.remove('hidden');
                    card.style.animation = `fadeInUp 0.6s ease ${index * 0.1}s forwards`;
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // Contact form
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');

        if (name && email && subject && message) {
            const submitBtn = contactForm.querySelector('.btn-submit');
            const originalContent = submitBtn.innerHTML;

            submitBtn.innerHTML = '<span class="btn-text">Sending...</span><span class="btn-icon"><i class="fas fa-spinner fa-spin"></i></span>';
            submitBtn.disabled = true;

            setTimeout(() => {
                submitBtn.innerHTML = '<span class="btn-text">Message Sent!</span><span class="btn-icon"><i class="fas fa-check"></i></span>';
                submitBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';

                contactForm.reset();

                setTimeout(() => {
                    submitBtn.innerHTML = originalContent;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);
            }, 1500);
        }
    });

    // Magnetic buttons
    document.querySelectorAll('.btn-magnetic').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });

    // Tilt effect on project cards
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            const tiltX = (y - 0.5) * 10;
            const tiltY = (x - 0.5) * -10;
            card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-12px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

    // Functions
    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    function animateStats() {
        if (statsAnimated) return;

        const statsSection = document.querySelector('.about-stats');
        if (!statsSection) return;

        const rect = statsSection.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            statsAnimated = true;

            statNumbers.forEach(stat => {
                const target = parseInt(stat.dataset.count);
                const duration = 2000;
                const step = target / (duration / 16);
                let current = 0;

                const updateCount = () => {
                    current += step;
                    if (current < target) {
                        stat.textContent = Math.floor(current);
                        requestAnimationFrame(updateCount);
                    } else {
                        stat.textContent = target;
                    }
                };

                updateCount();
            });
        }
    }

    function animateSkillBars() {
        if (skillsAnimated) return;

        const skillsSection = document.querySelector('.skills');
        if (!skillsSection) return;

        const rect = skillsSection.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            skillsAnimated = true;

            skillFills.forEach((fill, index) => {
                const width = fill.dataset.width;
                setTimeout(() => {
                    fill.style.width = `${width}%`;
                    fill.classList.add('animated');
                }, index * 150);
            });
        }
    }

    function animateOnScroll() {
        document.querySelectorAll('[data-animate]').forEach(el => {
            const rect = el.getBoundingClientRect();
            const delay = el.dataset.delay || 0;

            if (rect.top < window.innerHeight - 80) {
                setTimeout(() => {
                    el.classList.add('visible');
                }, delay);
            }
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Parallax on mouse move for hero orbs
    document.querySelector('.hero')?.addEventListener('mousemove', (e) => {
        const orbs = document.querySelectorAll('.orb');
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;

        orbs.forEach((orb, index) => {
            const speed = (index + 1) * 15;
            orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
        });
    });

    // Dynamic CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(40px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);

    // Trigger initial scroll check
    animateOnScroll();

    console.log('Sambikka Portfolio loaded!');
});
