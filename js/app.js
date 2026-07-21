/**
 * Qurban Ali - Professional Portfolio Interactive Script
 * Implements: Typewriter, Skills Tabs, Interactive Project Modals,
 * Scroll Reveal, Form Submission Simulation, and Scroll Tracking.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // DATA DEFINITIONS (Projects details for dynamic modal rendering)
    // ==========================================================================
    const projectDetails = {
        smartmatch: {
            title: "SmartMatch",
            tags: ["AI Recruiting", "Aviation Industry", "Solr Search", "RAG Engine"],
            stack: ["React.js", "Node.js", "Express.js", "MySQL", "Apache Solr", "OpenAI API", "Google Gemini API", "Vector Embeddings", "Semantic Search"],
            overview: "SmartMatch is an AI-powered recruitment and talent intelligence platform developed specifically for the aviation industry. The platform enables recruiters to manage a centralized talent pool, process candidate CVs, and identify the most relevant candidates based on job descriptions, skills, experience, qualifications, and recruiter-provided keywords.",
            features: [
                "Automated CV parsing transforming unstructured documents into structured candidate database records containing professional experience, technical skills, certifications, and aviation roles.",
                "AI-generated vector embeddings indexed in Apache Solr to support low-latency semantic search matching rather than only exact keywords.",
                "Dynamic relevance scoring matching candidates against job descriptions, highlighting matching strengths and potential gaps.",
                "Centralized talent-pool management, advanced filtering dashboards, and candidate shortlist pipelines."
            ],
            contribution: [
                "Contributed to the full-stack development of the application using React.js for the frontend and Node.js for the backend.",
                "Designed and implemented MySQL schemas for structured candidate, recruiter, and application data.",
                "Configured Apache Solr vector-indexing patterns for high-performance candidate retrieval.",
                "Integrated Google Gemini for structured CV parsing/extraction and OpenAI embeddings/language models for scoring and ranking explanations."
            ]
        },
        talentvista: {
            title: "TalentVista",
            tags: ["Talent Acquisition", "SaaS Platform", "LLM Ranking", "RAG Workflows"],
            stack: ["React.js", "Node.js", "Express.js", "MySQL", "Apache Solr", "REST APIs", "Vector Embeddings", "Semantic Search", "LLM Integrations"],
            overview: "TalentVista is an AI-powered talent acquisition platform designed to help recruiters process large volumes of applications, build reusable talent pools, and identify the most relevant candidates for each job opportunity.",
            features: [
                "Dual CV-JD parsing extracting experience levels, education, technical stacks, certifications, and industry specialties.",
                "Vector embeddings generation and Apache Solr indexing for semantic candidate retrieval and advanced filtering.",
                "RAG-based scoring framework providing candidates evaluation, relevance scores, and written matching explanations.",
                "Reusable categorized talent pools and multi-stage interview tracking with automated screening question generation."
            ],
            contribution: [
                "Contributed to the full-stack development and AI architecture design using React.js, Node.js, and MySQL.",
                "Implemented semantic search matching and relevance scoring explanations using vector embeddings and Apache Solr.",
                "Designed API prompts and integrated multiple LLM APIs for structured extraction, CV/JD parsing, and interview question generation.",
                "Built dashboard analytics, screening scorecards, and candidate comparative reporting tools."
            ]
        },
        hellofriday: {
            title: "helloFriday",
            tags: ["HR Tech", "Employee Experience", "Enterprise SaaS", "Full-Stack Workflows"],
            stack: ["React.js", "Vue.js", "Node.js", "Express.js", "PHP", "Laravel", "MySQL", "REST APIs", "Analytics Dashboards"],
            overview: "helloFriday is an AI-first, all-in-one HR and employee experience platform designed to simplify people operations, automate administrative workflows, and help organisations build engaged, productive, and aligned teams.",
            features: [
                "Complete employee lifecycle management including applicant tracking, recruitment, onboarding, leave requests, attendance, and payroll.",
                "Advanced performance module supporting 360-degree feedback, OKR objectives, leave approvals, and review cycles.",
                "Employee engagement panel featuring social feeds, announcements, communities, pulse surveys, and recognition.",
                "Responsive web and mobile applications enabling self-service tasks, approvals, and workforce notifications."
            ],
            contribution: [
                "Contributed to the full-stack delivery of scalable HR workflows, dashboards, and APIs.",
                "Developed role-based user experiences and responsive interfaces for employees and administrators.",
                "Built backend integrations, reporting modules, and data visualization analytics.",
                "Created and optimized database tables in MySQL handling permissions, records, and system logs."
            ]
        },
        humanjot: {
            title: "HumanJot",
            tags: ["AI Content Assistant", "Writing Workflows", "Brand Voice Engine", "FastAPI"],
            stack: ["Node.js", "Python", "FastAPI", "OpenAI APIs", "Prompt Workflows", "Personalized Logic", "Web Editing"],
            overview: "HumanJot is an AI-powered content creation and writing-assistance platform designed for marketers, creators, agencies, entrepreneurs, and professionals who need high-quality content for multiple digital channels.",
            features: [
                "Multi-platform generation tailoring length, tone, formatting, and hashtags for LinkedIn, X/Twitter, and blogs.",
                "Personalized content engine learning writing preferences, brand voice, and tone patterns from previous articles.",
                "Interactive inline writing assistant to brainstorm ideas, edit drafts, and rewrite sections.",
                "Unified multi-platform workflows to draft one core message and generate optimized platform variations concurrently."
            ],
            contribution: [
                "Contributed to the full-stack development, user management, and prompt workflows.",
                "Implemented personalized content generation logic and brand voice learning systems using style analysis vectors.",
                "Built responsive web editing interfaces allowing rapid drafting, side-by-side previews, and exports.",
                "Optimized concurrent API generation queues in FastAPI to prevent timeouts during document creation."
            ]
        },
        zenbench: {
            title: "ZenBench",
            tags: ["Zendesk Automation", "Customer Support", "Data Modeling"],
            stack: ["Vue.js", "Laravel", "MySQL", "Zendesk API", "REST APIs", "Background Workers"],
            overview: "ZenBench is a Zendesk reporting, automation, and data-management platform designed to extend Zendesk's native capabilities and help organisations manage support data more efficiently.",
            features: [
                "Zendesk account connection syncing ticket, performance, and support data to a local database.",
                "Reporting tools transforming data into dashboards for monitoring support operations and service trends.",
                "Advanced data management including custom object modeling, data normalization, and bulk operations.",
                "Reusable data-model marketplace for applying preconfigured support structures and workflows."
            ],
            contribution: [
                "Contributed to the full-stack development of ZenBench using Vue.js for the frontend and Laravel for the backend.",
                "Integrated Zendesk APIs and created MySQL database schemas to handle support data.",
                "Developed responsive user interfaces, API reporting workflows, data-management modules, and custom objects.",
                "Built high-performance PHP/Laravel background workers resolving API rate limit conflicts."
            ]
        },
        ishopeco: {
            title: "iShopEco",
            tags: ["E-Commerce", "Eco-Friendly Portal", "Vue.js", "Laravel"],
            stack: ["Vue.js", "Quasar Framework", "Laravel", "MySQL", "Stripe API", "E-commerce Workflows"],
            overview: "iShopEco is a sustainable-living search, review, and e-commerce platform designed to help people discover vetted businesses, products, and services that meet published environmental sustainability criteria.",
            features: [
                "Eco-friendly business directory spanning over 300 categories for comparing green living options.",
                "Complete e-commerce features: product catalogue management, customer accounts, cart, and checkout workflows.",
                "Secure payment integrations using Stripe and administrative order tracking dashboards."
            ],
            contribution: [
                "Contributed to the full-stack development of iShopEco using Vue.js and Quasar Framework for the frontend and Laravel for the backend.",
                "Developed responsive e-commerce interfaces, customer workflows, and shopping checkout steps.",
                "Designed MySQL database models for product catalogues and customer profiles and integrated payment webhooks."
            ]
        },
        gerdentusa: {
            title: "GerDentUSA & GerVetUSA",
            tags: ["B2B E-Commerce", "Medical Tools", "Laravel", "Product Catalogs"],
            stack: ["PHP", "Laravel", "MySQL", "B2B Catalogs", "E-commerce Workflows", "Query Optimization"],
            overview: "GerDentUSA and GerVetUSA are e-commerce platforms designed to help customers and professionals across the United States purchase dental, veterinary, and surgical instruments through a convenient online shopping experience.",
            features: [
                "Specialized B2B and B2C product catalogues serving thousands of medical and surgical instruments.",
                "Dynamic product catalog variations, customer accounts, and order-processing workflows.",
                "Custom B2B accounts supporting purchase orders, credit hierarchies, and tier pricing."
            ],
            contribution: [
                "Contributed to the development and maintenance of these platforms using PHP, Laravel, and MySQL.",
                "Programmed product-catalogue modules, user accounts, cart, order workflows, and admin controls.",
                "Optimized MySQL search database queries, reducing catalog load times by over 40%."
            ]
        },
        toolszip: {
            title: "ToolsZip",
            tags: ["Productivity Suite", "Online Utilities", "Toolbox Engine"],
            stack: ["Laravel", "JavaScript", "MySQL", "File Processing", "Stripe API", "SEO Tools"],
            overview: "ToolsZip is an all-in-one online productivity platform designed for SEO professionals, developers, content creators, website owners, and general users who need fast and accessible browser-based utilities.",
            features: [
                "PDF tools including Word-to-PDF, text-to-PDF, merging, compression, and image conversion.",
                "Image tools supporting conversions (PNG-to-JPG, JPG-to-PNG), resizing, and compression.",
                "Developer utilities including UUID generators, JSON formatters, and XML converters.",
                "SEO tools including SEO checks, screenshots, redirects, domain lookups, and SSL tests."
            ],
            contribution: [
                "Contributed to the full-stack development of ToolsZip using Laravel, JavaScript, and MySQL.",
                "Developed and integrated multiple browser-based tools, file-processing tasks, and API workflows.",
                "Supported user subscription systems, payment configurations, and Stripe integrations.",
                "Optimized platform performance for simultaneous tool usage and large file uploads."
            ]
        },
        pharmacyauditpro: {
            title: "Pharmacy Audit Pro",
            tags: ["Pharmacy Tech", "Reconciliation", "Ledger System", "AI Assistant"],
            stack: ["React.js", "TypeScript", "Node.js", "Express.js", "Python", "MySQL", "AI Integration", "Ledger Architecture"],
            overview: "Pharmacy Audit Pro is a pharmacy audit, reconciliation, and revenue-integrity platform designed for pharmacy owners, compliance teams, and operations professionals in the United States. It helps pharmacies reduce manual audit work, identify billing issues, and maintain clear, traceable financial records.",
            features: [
                "Invoice and billing file-processing reconciliation engine that detects discrepancy and unmatched transaction exceptions.",
                "Comprehensive financial ledger system recording adjusting entries, transaction histories, and audit logs.",
                "Interactive analytics dashboards, billing pattern reports, email alerts, and revenue integrity views.",
                "AI-assisted summaries highlighting billing trends and high-priority reconciliation issues."
            ],
            contribution: [
                "Contributed to the platform's development, including file-processing workflows and vendor/billing reconciliation.",
                "Implemented discrepancy management, ledger functionality, and financial tracking logic.",
                "Built responsive dashboards, audit reports, and analytical views.",
                "Integrated AI assistant modules to summarize findings and highlight key trends."
            ]
        }
    };

    // ==========================================================================
    // STICKY NAVBAR & SCROLL PROGRESS
    // ==========================================================================
    const navbar = document.getElementById('navbar');
    const scrollProgress = document.getElementById('scroll-progress');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        // Sticky class
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Scroll Progress Bar
        const scrollPercent = (scrollTop / docHeight) * 100;
        scrollProgress.style.width = scrollPercent + '%';
    });

    // ==========================================================================
    // MOBILE NAVIGATION MENU
    // ==========================================================================
    const menuToggle = document.getElementById('menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    
    function toggleMobileMenu() {
        menuToggle.classList.toggle('active');
        mobileNav.classList.toggle('active');
        document.body.classList.toggle('overflow-hidden'); // Disable background scrolling when open
    }
    
    menuToggle.addEventListener('click', toggleMobileMenu);
    
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            mobileNav.classList.remove('active');
            document.body.classList.remove('overflow-hidden');
        });
    });

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
    // SKILLS TAB FILTERING
    // ==========================================================================
    const tabButtons = document.querySelectorAll('.tab-btn');
    const skillCards = document.querySelectorAll('.skill-card');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Toggle active class on buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const category = button.getAttribute('data-category');
            
            // Filter skill cards
            skillCards.forEach(card => {
                const cardCat = card.getAttribute('data-category');
                if (category === 'all' || cardCat === category) {
                    card.style.opacity = '0';
                    card.classList.remove('hidden');
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // ==========================================================================
    // DYNAMIC PROJECT DETAILS MODAL
    // ==========================================================================
    const modal = document.getElementById('project-modal');
    const modalClose = document.getElementById('modal-close');
    const modalContent = document.getElementById('modal-body-content');
    const projectTriggerButtons = document.querySelectorAll('.project-btn');
    const projectCards = document.querySelectorAll('.project-card');

    function openModal(projectId) {
        const details = projectDetails[projectId];
        if (!details) return;

        // Render HTML content inside modal dynamically
        modalContent.innerHTML = `
            <h3 class="modal-project-title">${details.title}</h3>
            <div class="modal-project-meta">
                ${details.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
            </div>
            
            <h4 class="modal-section-title">Overview</h4>
            <p>${details.overview}</p>
            
            <h4 class="modal-section-title">Key Core Features</h4>
            <ul class="modal-list">
                ${details.features.map(feat => `<li>${feat}</li>`).join('')}
            </ul>
            
            <h4 class="modal-section-title">Team Leadership & Engineering Contribution</h4>
            <ul class="modal-list">
                ${details.contribution.map(contrib => `<li>${contrib}</li>`).join('')}
            </ul>
            
            <h4 class="modal-section-title">Technology & AI Stack</h4>
            <div class="modal-project-tech">
                ${details.stack.map(tech => `<span>${tech}</span>`).join('')}
            </div>
        `;

        modal.classList.add('active');
        document.body.classList.add('overflow-hidden');
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.classList.remove('overflow-hidden');
        // Clear modal content shortly after animations
        setTimeout(() => {
            modalContent.innerHTML = '';
        }, 300);
    }

    // Trigger on details link click
    projectTriggerButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Avoid triggering card click handler
            const card = btn.closest('.project-card');
            const projectId = card.getAttribute('data-project');
            openModal(projectId);
        });
    });

    // Trigger on whole card click for better user experience
    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            const projectId = card.getAttribute('data-project');
            openModal(projectId);
        });
    });

    modalClose.addEventListener('click', closeModal);
    
    // Close modal when clicking overlay bg
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal on Escape key press
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // ==========================================================================
    // SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
    // ==========================================================================
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target); // Reveal only once
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // ==========================================================================
    // CONTACT FORM INTERACTION & FORMSPREE EMAIL SUBMISSION
    // ==========================================================================
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');
    const formError = document.getElementById('form-error');
    const btnSubmit = document.getElementById('btn-submit-form');
    const btnReset = document.getElementById('btn-reset-form');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Basic Client validation check
            const nameInput = document.getElementById('form-name');
            const emailInput = document.getElementById('form-email');
            const subjectInput = document.getElementById('form-subject');
            const messageInput = document.getElementById('form-message');
            
            if (!nameInput.value || !emailInput.value || !subjectInput.value || !messageInput.value) {
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
                const response = await fetch(contactForm.action || 'https://formspree.io/f/mzdnvdro', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Success state layout transition
                    contactForm.style.display = "none";
                    formSuccess.classList.add('active');
                    contactForm.reset();
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
});
