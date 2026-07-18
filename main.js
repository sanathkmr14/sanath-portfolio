// Navigation
const navbar = document.getElementById('navbar');
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');

// Sticky Navbar on Scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Update active nav link
    updateActiveNavLink();
});

// Mobile Menu Toggle
menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    
    // Toggle icon
    const icon = menuBtn.querySelector('i');
    if (navLinks.classList.contains('active')) {
        icon.classList.remove('bx-menu');
        icon.classList.add('bx-x');
    } else {
        icon.classList.remove('bx-x');
        icon.classList.add('bx-menu');
    }
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = menuBtn.querySelector('i');
        icon.classList.remove('bx-x');
        icon.classList.add('bx-menu');
    });
});

// Scroll Reveal Animation
const revealElements = document.querySelectorAll('.reveal');

function reveal() {
    const windowHeight = window.innerHeight;
    const revealPoint = 100;
    
    revealElements.forEach(element => {
        const revealTop = element.getBoundingClientRect().top;
        if (revealTop < windowHeight - revealPoint) {
            element.classList.add('active');
        }
    });
}

// Trigger initial reveal
reveal();

// Trigger on scroll
window.addEventListener('scroll', reveal);

// Active Nav Link Update based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });
    
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${current}`) {
            item.classList.add('active');
        }
    });
}

// Contact Form Submission Handling
const contactForm = document.querySelector('.premium-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<span>Sending...</span> <i class="bx bx-loader-alt bx-spin"></i>';
        submitBtn.disabled = true;

        const formData = new FormData(contactForm);

        try {
            const response = await fetch(contactForm.action, {
                method: contactForm.method,
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Show modern success message
                submitBtn.innerHTML = '<span>Message Sent!</span> <i class="bx bx-check"></i>';
                submitBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
                submitBtn.style.boxShadow = '0 10px 20px rgba(16, 185, 129, 0.2)';
                contactForm.reset();
                
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                    submitBtn.style.boxShadow = '';
                    submitBtn.disabled = false;
                }, 4000);
            } else {
                // Show error
                submitBtn.innerHTML = '<span>Oops! Error</span> <i class="bx bx-error"></i>';
                submitBtn.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
                
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 4000);
            }
        } catch (error) {
            submitBtn.innerHTML = '<span>Network Error</span> <i class="bx bx-wifi-off"></i>';
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 4000);
        }
    });
}
