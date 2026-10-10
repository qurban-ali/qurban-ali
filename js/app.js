/**
 * Qurban Ali - Professional Portfolio Interactive Script
 * Home page only: typewriter, About "read more", featured projects,
 * latest blog posts, contact form and recommendations carousel.
 * Shared behaviour (navbar, modal, cards) lives in js/site.js.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // TYPEWRITER EFFECT (HERO HEADLINE)
    // ==========================================================================
    const typewriterEl = document.getElementById('typewriter');
    const phrases = [
        "Engineering Team Lead",
        "Full-Stack Developer (MERN, MEVN & LEMP)",
        "AI, RAG & LLM Solutions Expert",
        "SaaS & FinTech Products Architect"
    ];
    
    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function type() {
        const currentPhrase = phrases[phraseIdx];
        
        if (isDeleting) {
            typewriterEl.textContent = currentPhrase.substring(0, charIdx - 1);
            charIdx--;
            typingSpeed = 50; // Deleting is faster
        } else {
            typewriterEl.textContent = currentPhrase.substring(0, charIdx + 1);
            charIdx++;
            typingSpeed = 100; // Normal typing speed
        }
        
        if (!isDeleting && charIdx === currentPhrase.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause at completion of phrase
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            phraseIdx = (phraseIdx + 1) % phrases.length;
            typingSpeed = 500; // Pause before typing next phrase
        }
        
        setTimeout(type, typingSpeed);
    }
    
    // Start typewriter loop if element exists
    if (typewriterEl) {
        setTimeout(type, 1000);
    }

    // ==========================================================================
    // HOME CONTENT: About "read more", featured projects, latest blog posts
    // ==========================================================================
    const aboutMoreBtn = document.getElementById('btn-about-more');
    const aboutFull = document.getElementById('about-full-template');
    if (aboutMoreBtn && aboutFull) {
        aboutMoreBtn.addEventListener('click', () => Site.openModal(aboutFull.innerHTML));
    }

    const featuredGrid = document.getElementById('featured-projects-grid');
    if (featuredGrid) {
        Site.loadJSON('/data/projects.json')
            .then(projects => {
                Site.renderProjects(featuredGrid, projects.filter(p => p.featured).slice(0, 6));
                const count = document.getElementById('projects-total');
                if (count) count.textContent = projects.length;
            })
            .catch(err => {
                console.error(err);
                featuredGrid.innerHTML = '<p class="content-empty">Projects could not be loaded. Please refresh the page.</p>';
            });
    }

    const latestPostsGrid = document.getElementById('latest-posts-grid');
    if (latestPostsGrid) {
        Site.loadJSON('/data/blog.json')
            .then(posts => {
                const latest = Site.publishedPosts(posts).slice(0, 3);
                latestPostsGrid.innerHTML = latest.length
                    ? latest.map(Site.renderBlogCard).join('')
                    : '<p class="content-empty">New articles are on the way.</p>';
            })
            .catch(err => {
                console.error(err);
                latestPostsGrid.innerHTML = '<p class="content-empty">Articles could not be loaded. Please refresh the page.</p>';
            });
    }

    // ==========================================================================
    // CONTACT FORM INTERACTION & EMAIL SUBMISSION (Vercel /api/contact + Resend)
    // ==========================================================================
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');
    const formError = document.getElementById('form-error');
    const btnSubmit = document.getElementById('btn-submit-form');
    const btnReset = document.getElementById('btn-reset-form');

    // Searchable service dropdown (with "Other" free-text option)
    const SERVICE_GROUPS = [
        {
            label: 'AI & LLM Solutions',
            items: [
                'Generative AI / LLM Integration',
                'RAG & Semantic Search Solutions',
                'AI Chatbot / Assistant Development',
                'Prompt Engineering & AI Consulting'
            ]
        },
        {
            label: 'Development',
            items: [
                'Full-Stack Web Development',
                'MERN / MEVN Stack Development',
                'Laravel / PHP Development',
                'Python Backend (FastAPI / Flask)',
                'REST API Design & Integration',
                'SaaS Product Development',
                'FinTech Solutions',
                'E-commerce Development'
            ]
        },
        {
            label: 'Leadership & Consulting',
            items: [
                'Technical Leadership / Team Lead Role',
                'Software Architecture Consulting',
                'DevOps & CI/CD Setup',
                'Code Review & Performance Optimization',
                'Job Opportunity / Hiring'
            ]
        },
        {
            label: 'Something else',
            items: ['Other']
        }
    ];

    const serviceSelect = document.getElementById('service-select');
    const serviceInput = document.getElementById('form-service');
    const serviceValue = document.getElementById('form-service-value');
    const serviceList = document.getElementById('service-list');
    const otherServiceGroup = document.getElementById('other-service-group');
    const otherServiceInput = document.getElementById('form-other-service');
    let activeOptionIndex = -1;

    const escapeHtml = (str) => str.replace(/[&<>"']/g, (c) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));

    const highlightMatch = (text, query) => {
        if (!query) return escapeHtml(text);
        const i = text.toLowerCase().indexOf(query.toLowerCase());
        if (i === -1) return escapeHtml(text);
        return escapeHtml(text.slice(0, i)) +
            '<mark>' + escapeHtml(text.slice(i, i + query.length)) + '</mark>' +
            escapeHtml(text.slice(i + query.length));
    };

    const getOptions = () => Array.from(serviceList.querySelectorAll('.service-option'));

    const setActiveOption = (index) => {
        const options = getOptions();
        options.forEach(opt => opt.classList.remove('active'));
        activeOptionIndex = index;
        if (index >= 0 && options[index]) {
            options[index].classList.add('active');
            options[index].scrollIntoView({ block: 'nearest' });
            serviceInput.setAttribute('aria-activedescendant', options[index].id);
        } else {
            serviceInput.removeAttribute('aria-activedescendant');
        }
    };

    const renderServiceList = (query = '') => {
        const q = query.trim().toLowerCase();
        let html = '';
        let count = 0;
        SERVICE_GROUPS.forEach(group => {
            // "Other" is always offered so visitors can describe something not listed
            const items = group.items.filter(item => item === 'Other' || item.toLowerCase().includes(q));
            if (!items.length) return;
            html += `<li class="service-list-group" role="presentation">${escapeHtml(group.label)}</li>`;
            items.forEach(item => {
                const selected = serviceValue.value === item;
                html += `<li class="service-option" role="option" id="service-option-${count}" ` +
                    `data-value="${escapeHtml(item)}" aria-selected="${selected}">${highlightMatch(item, q)}</li>`;
                count++;
            });
        });
        serviceList.innerHTML = html || '<li class="service-empty">No matching services</li>';
        setActiveOption(q && count ? 0 : -1);
    };

    const openServiceList = () => {
        serviceSelect.classList.add('open');
        serviceInput.setAttribute('aria-expanded', 'true');
    };

    const closeServiceList = () => {
        serviceSelect.classList.remove('open');
        serviceInput.setAttribute('aria-expanded', 'false');
        setActiveOption(-1);
    };

    const selectService = (value) => {
        serviceValue.value = value;
        serviceInput.value = value;
        serviceInput.setCustomValidity('');
        const isOther = value === 'Other';
        otherServiceGroup.hidden = !isOther;
        otherServiceInput.required = isOther;
        if (!isOther) otherServiceInput.value = '';
        closeServiceList();
        if (isOther) otherServiceInput.focus();
    };

    const resetServiceSelect = () => {
        serviceValue.value = '';
        serviceInput.value = '';
        serviceInput.setCustomValidity('');
        otherServiceGroup.hidden = true;
        otherServiceInput.required = false;
        otherServiceInput.value = '';
        closeServiceList();
    };

    if (serviceSelect) {
        renderServiceList();

        serviceInput.addEventListener('focus', () => {
            renderServiceList(serviceInput.value === serviceValue.value ? '' : serviceInput.value);
            openServiceList();
        });

        serviceInput.addEventListener('click', openServiceList);

        serviceInput.addEventListener('input', () => {
            // Typing clears the previous choice until a new option is picked
            serviceValue.value = '';
            otherServiceGroup.hidden = true;
            otherServiceInput.required = false;
            serviceInput.setCustomValidity('');
            renderServiceList(serviceInput.value);
            openServiceList();
        });

        serviceInput.addEventListener('keydown', (e) => {
            const options = getOptions();
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                openServiceList();
                setActiveOption(Math.min(activeOptionIndex + 1, options.length - 1));
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActiveOption(Math.max(activeOptionIndex - 1, 0));
            } else if (e.key === 'Enter' && serviceSelect.classList.contains('open')) {
                e.preventDefault();
                if (options[activeOptionIndex]) selectService(options[activeOptionIndex].dataset.value);
            } else if (e.key === 'Escape') {
                closeServiceList();
            }
        });

        // mousedown (not click) so the choice lands before the input blurs
        serviceList.addEventListener('mousedown', (e) => {
            const option = e.target.closest('.service-option');
            if (!option) return;
            e.preventDefault();
            selectService(option.dataset.value);
        });

        serviceInput.addEventListener('blur', () => {
            closeServiceList();
            if (serviceValue.value) {
                serviceInput.value = serviceValue.value;
                return;
            }
            // Accept an exact (case-insensitive) typed match without clicking
            const typed = serviceInput.value.trim().toLowerCase();
            const match = SERVICE_GROUPS.flatMap(g => g.items).find(item => item.toLowerCase() === typed);
            if (match) selectService(match);
        });
    }

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Basic Client validation check
            const nameInput = document.getElementById('form-name');
            const emailInput = document.getElementById('form-email');
            const messageInput = document.getElementById('form-message');

            if (!serviceValue.value) {
                serviceInput.setCustomValidity('Please select a service from the list.');
                serviceInput.reportValidity();
                return;
            }

            if (!nameInput.value || !emailInput.value || !messageInput.value ||
                (serviceValue.value === 'Other' && !otherServiceInput.value.trim())) {
                return;
            }

            // Clear previous errors
            if (formError) {
                formError.classList.remove('active');
                formError.textContent = '';
            }

            // Submission loading state
            btnSubmit.disabled = true;
            btnSubmit.textContent = "Sending Message...";
            btnSubmit.style.opacity = "0.7";
            
            try {
                const formData = new FormData(contactForm);
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    body: JSON.stringify(Object.fromEntries(formData)),
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Success state layout transition
                    contactForm.style.display = "none";
                    formSuccess.classList.add('active');
                    contactForm.reset();
                    resetServiceSelect();
                } else {
                    const data = await response.json().catch(() => null);
                    let errorMsg = "Oops! There was a problem submitting your message. Please try again.";
                    if (data && data.errors && data.errors.length > 0) {
                        errorMsg = data.errors.map(err => err.message).join(", ");
                    }
                    if (formError) {
                        formError.textContent = errorMsg;
                        formError.classList.add('active');
                    }
                }
            } catch (err) {
                console.error("Form submission error:", err);
                if (formError) {
                    formError.textContent = "Network error while sending message. Please check your internet connection.";
                    formError.classList.add('active');
                }
            } finally {
                btnSubmit.disabled = false;
                btnSubmit.textContent = "Send Message";
                btnSubmit.style.opacity = "1";
            }
        });
    }

    if (btnReset) {
        btnReset.addEventListener('click', () => {
            if (formError) {
                formError.classList.remove('active');
                formError.textContent = '';
            }
            formSuccess.classList.remove('active');
            setTimeout(() => {
                contactForm.style.display = "flex";
            }, 100);
        });
    }

    // ==========================================================================
    // RECOMMENDATIONS CAROUSEL CONTROLLER
    // ==========================================================================
    const track = document.getElementById('carousel-track');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const dotsContainer = document.getElementById('carousel-dots');

    if (track) {
        const slides = Array.from(track.children);
        let currentIndex = 0;
        let autoPlayTimer = null;

        function getSlidesPerView() {
            return window.innerWidth >= 992 ? 2 : 1;
        }

        function getMaxIndex() {
            const perView = getSlidesPerView();
            return Math.max(0, slides.length - perView);
        }

        function updateCarousel(index) {
            const maxIdx = getMaxIndex();
            currentIndex = Math.max(0, Math.min(index, maxIdx));
            
            const perView = getSlidesPerView();
            const slideWidthPercent = 100 / perView;
            const amountToMove = -(currentIndex * slideWidthPercent);
            
            track.style.transform = `translateX(${amountToMove}%)`;

            // Update dots
            if (dotsContainer) {
                const dots = Array.from(dotsContainer.children);
                dots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === currentIndex);
                });
            }
        }

        function setupDots() {
            if (!dotsContainer) return;
            dotsContainer.innerHTML = '';
            const maxIdx = getMaxIndex();
            for (let i = 0; i <= maxIdx; i++) {
                const dot = document.createElement('button');
                dot.className = `carousel-dot ${i === 0 ? 'active' : ''}`;
                dot.setAttribute('data-slide', i);
                dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
                dot.addEventListener('click', () => {
                    updateCarousel(i);
                    resetAutoPlay();
                });
                dotsContainer.appendChild(dot);
            }
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                const maxIdx = getMaxIndex();
                const newIndex = currentIndex === 0 ? maxIdx : currentIndex - 1;
                updateCarousel(newIndex);
                resetAutoPlay();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const maxIdx = getMaxIndex();
                const newIndex = currentIndex >= maxIdx ? 0 : currentIndex + 1;
                updateCarousel(newIndex);
                resetAutoPlay();
            });
        }

        function startAutoPlay() {
            clearInterval(autoPlayTimer);
            autoPlayTimer = setInterval(() => {
                const maxIdx = getMaxIndex();
                const nextIndex = currentIndex >= maxIdx ? 0 : currentIndex + 1;
                updateCarousel(nextIndex);
            }, 5000);
        }

        function resetAutoPlay() {
            clearInterval(autoPlayTimer);
            startAutoPlay();
        }

        const wrapper = document.querySelector('.carousel-wrapper');
        if (wrapper) {
            wrapper.addEventListener('mouseenter', () => clearInterval(autoPlayTimer));
            wrapper.addEventListener('mouseleave', startAutoPlay);
        }

        // Touch Swipe Support
        let startX = 0;
        let isSwiping = false;

        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isSwiping = true;
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            if (!isSwiping) return;
            const endX = e.changedTouches[0].clientX;
            const diffX = startX - endX;
            const maxIdx = getMaxIndex();

            if (Math.abs(diffX) > 40) {
                if (diffX > 0) {
                    const nextIndex = currentIndex >= maxIdx ? 0 : currentIndex + 1;
                    updateCarousel(nextIndex);
                } else {
                    const prevIndex = currentIndex === 0 ? maxIdx : currentIndex - 1;
                    updateCarousel(prevIndex);
                }
                resetAutoPlay();
            }
            isSwiping = false;
        }, { passive: true });

        window.addEventListener('resize', () => {
            setupDots();
            updateCarousel(currentIndex);
        });

        // Initialize
        setupDots();
        updateCarousel(0);
        startAutoPlay();
    }
});
