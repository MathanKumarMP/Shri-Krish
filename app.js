// Always begin a fresh visit at the hero/banner so the first scroll trigger is predictable.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.addEventListener('pageshow', () => {
    window.scrollTo(0, 0);
});

document.addEventListener('DOMContentLoaded', () => {

    // --- MOBILE MENU TOGGLE ---
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');

    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        mobileToggle.classList.toggle('active');
        
        // Animated bars
        const bars = mobileToggle.querySelectorAll('.bar');
        if (mobileToggle.classList.contains('active')) {
            bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
        } else {
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        }
    });

    // Close menu when clicking nav links
    const navLinks = document.querySelectorAll('.nav-link, .nav-btn');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            mobileToggle.classList.remove('active');
            const bars = mobileToggle.querySelectorAll('.bar');
            bars.forEach(bar => bar.style.transform = 'none');
            bars[1].style.opacity = '1';
        });
    });


    // --- STICKY NAVBAR SCROLL EFFECT ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });


    // --- INTERSECTION OBSERVER FOR SCROLL ANIMATIONS ---
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active-reveal');
                observer.unobserve(entry.target); // Trigger only once
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });


    // --- ACTIVE NAVIGATION LINK UPDATE ---
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });


    // --- ACCORDION FOR HIGHLIGHTS ---
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const content = item.querySelector('.accordion-content');
            const isActive = item.classList.contains('active');

            // Close all items
            document.querySelectorAll('.accordion-item').forEach(accItem => {
                accItem.classList.remove('active');
                accItem.querySelector('.accordion-content').style.maxHeight = null;
            });

            // If not active, open clicked item
            if (!isActive) {
                item.classList.add('active');
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });

    // Initialize first accordion item as open
    const firstActiveContent = document.querySelector('.accordion-item.active .accordion-content');
    if (firstActiveContent) {
        firstActiveContent.style.maxHeight = firstActiveContent.scrollHeight + 'px';
    }


    // --- STATS COUNTER ANIMATION ---
    const counterElements = document.querySelectorAll('.counter');
    const animateCounters = (element) => {
        const target = parseInt(element.getAttribute('data-target'), 10);
        let count = 0;
        const duration = 2000; // 2 seconds
        const stepTime = Math.max(Math.floor(duration / target), 15);
        
        const timer = setInterval(() => {
            count += Math.ceil(target / (duration / stepTime));
            if (count >= target) {
                element.innerText = target.toLocaleString();
                clearInterval(timer);
            } else {
                element.innerText = count.toLocaleString();
            }
        }, stepTime);
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    counterElements.forEach(counter => {
        counterObserver.observe(counter);
    });


    // --- FORM VALIDATION & INTERACTIVITY ---
    const leadForm = document.getElementById('leadForm');
    const successAlert = document.getElementById('successAlert');

    const validateInput = (input) => {
        const group = input.parentElement;
        let isValid = true;

        if (input.required && !input.value.trim()) {
            isValid = false;
        }

        if (input.type === 'email' && input.value.trim()) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(input.value.trim())) {
                isValid = false;
            }
        }

        if ((input.id === 'name' || input.id === 'enquiryName') && input.value.trim()) {
            if (!/^[A-Za-z ]{2,}$/.test(input.value.trim())) isValid = false;
        }

        if (input.type === 'tel' && input.value.trim()) {
            const phonePattern = /^\d{10}$/;
            if (!phonePattern.test(input.value.trim())) {
                isValid = false;
            }
        }

        if (!isValid) {
            group.classList.add('invalid');
        } else {
            group.classList.remove('invalid');
        }

        return isValid;
    };

    const inputs = leadForm.querySelectorAll('input, select');
    inputs.forEach(input => {
        if (input.id === 'name') {
            input.addEventListener('input', () => {
                input.value = input.value.replace(/[^A-Za-z ]/g, '');
            });
        }
        if (input.type === 'tel') {
            input.setAttribute('inputmode', 'numeric');
            input.setAttribute('maxlength', '10');
            input.addEventListener('input', () => {
                input.value = input.value.replace(/\D/g, '').slice(0, 10);
            });
        }
        input.addEventListener('blur', () => validateInput(input));
        input.addEventListener('input', () => {
            if (input.parentElement.classList.contains('invalid')) {
                validateInput(input);
            }
        });
    });

    leadForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isFormValid = true;

        inputs.forEach(input => {
            if (!validateInput(input)) {
                isFormValid = false;
            }
        });

        if (isFormValid) {
            // Simulated submission success
            const submitBtn = leadForm.querySelector('.submit-btn');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';

            setTimeout(() => {
                successAlert.classList.add('show');
                leadForm.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Send and Download Brochure <i class="fa-solid fa-arrow-right"></i>';
            }, 1500);
        }
    });

    // Scroll-triggered plot enquiry popup
    const enquiryModal = document.getElementById('enquiryModal');
    const enquiryForm = document.getElementById('enquiryForm');
    const enquiryStatus = document.getElementById('enquiryStatus');
    let enquiryDismissed = false;

    const closeEnquiry = () => {
        enquiryModal.classList.remove('is-open');
        enquiryModal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
        enquiryDismissed = true;
    };

    const openEnquiry = (force = false) => {
        if ((enquiryDismissed && !force) || !enquiryModal) return;
        enquiryModal.classList.add('is-open');
        enquiryModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
        window.removeEventListener('scroll', openOnScroll);
    };

    const openOnScroll = () => {
        // Open on the first meaningful scroll down from the hero/banner.
        if (window.scrollY > 12) openEnquiry();
    };

    if (enquiryModal && enquiryForm) {
        document.querySelectorAll('[data-open-enquiry]').forEach(trigger => {
            trigger.addEventListener('click', (event) => {
                event.preventDefault();
                openEnquiry(true);
            });
        });
        enquiryModal.querySelectorAll('[data-close-enquiry]').forEach(button => button.addEventListener('click', closeEnquiry));
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && enquiryModal.classList.contains('is-open')) closeEnquiry();
        });
        window.addEventListener('scroll', openOnScroll, { passive: true });

        const setEnquiryError = (field, show, message) => {
            const error = enquiryForm.querySelector(`[data-error-for="${field}"]`);
            const group = error?.closest('.enquiry-field, .enquiry-question');
            if (error) {
                if (message) error.textContent = message;
                error.classList.toggle('is-visible', show);
            }
            group?.classList.toggle('has-error', show);
        };

        let enquiryAttempted = false;
        const validateEnquiry = (forceShow = false) => {
            const name = document.getElementById('enquiryName');
            const phone = document.getElementById('enquiryPhone');
            const email = document.getElementById('enquiryEmail');
            const plotSize = enquiryForm.querySelector('input[name="plotSize"]:checked');
            const interest = enquiryForm.querySelector('input[name="plotInterest"]:checked');
            const nameValid = /^[A-Za-z ]{2,}$/.test(name.value.trim());
            const phoneValid = /^\d{10}$/.test(phone.value.trim());
            const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
            const showErrors = enquiryAttempted || forceShow;
            setEnquiryError('plotInterest', showErrors && !interest);
            setEnquiryError('enquiryPlotSize', showErrors && !plotSize);
            setEnquiryError('enquiryName', showErrors && !nameValid);
            setEnquiryError('enquiryPhone', showErrors && !phoneValid);
            setEnquiryError('enquiryEmail', showErrors && !emailValid);
            return Boolean(interest && plotSize && nameValid && phoneValid && emailValid);
        };

        enquiryForm.querySelectorAll('input, select').forEach(field => {
            if (field.id === 'enquiryName') {
                field.addEventListener('input', () => {
                    field.value = field.value.replace(/[^A-Za-z ]/g, '');
                });
            }
            if (field.id === 'enquiryPhone') {
                field.addEventListener('input', () => {
                    field.value = field.value.replace(/\D/g, '').slice(0, 10);
                });
            }
            field.addEventListener('input', validateEnquiry);
            field.addEventListener('change', validateEnquiry);
        });

        enquiryForm.addEventListener('submit', (event) => {
            event.preventDefault();
            enquiryAttempted = true;
            if (!validateEnquiry(true)) return;
            enquiryStatus.textContent = 'Thank you! Our plot advisor will contact you shortly.';
            enquiryForm.reset();
            setTimeout(closeEnquiry, 2200);
        });
    }
});
