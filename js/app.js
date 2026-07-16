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
            tags: ["AI Recruiting", "Aviation Industry", "MERN Stack", "Apache Solr"],
            stack: ["React.js", "Node.js", "Express.js", "MySQL", "Apache Solr", "Google Gemini API", "OpenAI API", "Vector Embeddings", "Semantic Search"],
            overview: "SmartMatch is an AI-powered recruitment and talent intelligence platform developed specifically for the aviation industry. The platform enables recruiters to manage a centralized talent pool, parse candidate CVs, and identify the most relevant candidates based on job descriptions, skills, experience, qualifications, and keyword queries.",
            features: [
                "Automated CV parsing transforming unstructured documents into structured candidate database records.",
                "AI-generated vector embeddings indexed in Apache Solr to support semantic candidate retrieval.",
                "Dynamic relevance scoring matching candidates against job descriptions and highlight gaps.",
                "Recruiter collaboration boards, advanced filtering dashboards, and candidate shortlist pipelines."
            ],
            contribution: [
                "Led full-stack architecture design and feature implementation using React.js and Node.js.",
                "Configured Apache Solr vector-indexing patterns for low-latency semantic search matching.",
                "Integrated multi-model AI workflows, using Google Gemini for extraction and OpenAI for scoring.",
                "Built role-based dashboards and candidate filter grids to streamline recruiter workflow workflows."
            ]
        },
        talentvista: {
            title: "TalentVista",
            tags: ["Talent Acquisition", "SaaS Platform", "LLM Ranking", "RAG"],
            stack: ["React.js", "Node.js", "Express.js", "MySQL", "Apache Solr", "OpenAI Models", "Vector Search", "REST APIs", "RAG Workflows"],
            overview: "TalentVista is an enterprise-scale, AI-first talent acquisition portal designed to ingest high volumes of CV applications, construct reusable talent pools, and rank suitable candidates dynamically for target openings.",
            features: [
                "Dual CV-JD parsing extracting experience levels, education, technical stack, and industry specialties.",
                "RAG-based scoring framework providing clean, written justifications explaining candidate matching strengths.",
                "Configurable talent pools allowing recruiters to source matching candidates internally for new openings.",
                "Automated screening generator producing interview scoring guides customized per candidate profile."
            ],
            contribution: [
                "Engineered the full-stack system and AI integration layer using React, Node, and MySQL.",
                "Architected the semantic database model using vector embeddings for candidate matching.",
                "Designed and tested advanced API prompts to avoid Hallucinations in candidate scoring explanations.",
                "Built multi-stage feedback dashboards and interviewer scorecard consolidation forms."
            ]
        },
        hellofriday: {
            title: "helloFriday",
            tags: ["HR Tech", "Employee Experience", "Enterprise SaaS", "Full-Stack Workflows"],
            stack: ["React.js", "Vue.js", "Node.js", "Express.js", "PHP", "Laravel", "MySQL", "REST APIs", "Analytics Dashboards"],
            overview: "helloFriday is a comprehensive, AI-assisted all-in-one HR operations and employee engagement portal designed to automate administrative tasks, track performance, and run corporate channels.",
            features: [
                "Full employee lifecycle modules covering ATS recruitment, onboarding workflows, records, and payroll.",
                "Advanced performance module supporting 360 feedback, configurable 1-on-1s, and OKR progress metrics.",
                "Interactive engagement engine featuring announcements, social feeds, event schedules, and recognition.",
                "Flexible time-management panel including shift rotas, clock-in, and leave approval workflows."
            ],
            contribution: [
                "Delivered scalable core workflows and dashboard interfaces for employees and administrators.",
                "Architected unified database tables in MySQL handling permissions, structures, and logs.",
                "Optimized backend REST APIs to handle high concurrent user traffic during check-in spikes.",
                "Mentored mid-level developers, unblocked frontend-backend integrations, and implemented code reviews."
            ]
        },
        humanjot: {
            title: "HumanJot",
            tags: ["AI Content Assistant", "Writing Workflows", "Brand Voice Engine", "FastAPI"],
            stack: ["Node.js", "Python", "FastAPI", "OpenAI APIs", "Prompt Workflows", "Vector Databases", "Tailored Output Logic"],
            overview: "HumanJot is a generative AI content drafting assistant that refines topics and campaigns into highly optimized articles tailored for specific channels (LinkedIn, X, Blogs, landing pages).",
            features: [
                "Brand voice profiling: learns writing styles and tone preferences from previous user articles.",
                "Single-source multi-channel drafting: transforms a single concept draft into optimized social formats.",
                "Interactive inline writing buddy allowing users to rewrite, expand, or summarize sections.",
                "Workflow tracking, hashtag optimization, and custom formatting presets."
            ],
            contribution: [
                "Developed the core full-stack application and custom OpenAI prompt workflows.",
                "Engineered the brand-voice parser in Python/FastAPI using style analysis vectors.",
                "Created responsive editing interfaces allowing rapid drafting, side-by-side previews, and publishing exports.",
                "Optimized concurrent API generation queues to prevent API timeouts during document creation."
            ]
        },
        zenbench: {
            title: "ZenBench",
            tags: ["Zendesk Automation", "Customer Support", "Data Modeling"],
            stack: ["Vue.js", "Laravel", "MySQL", "Zendesk API", "REST APIs"],
            overview: "ZenBench is an enterprise customer support enhancement and workflow automation platform extending Zendesk's native ticketing functionality with custom objects and marketplaces.",
            features: [
                "Custom Zendesk object modeling, automated data deduplication, and normalisation workflows.",
                "Advanced ticketing search filters, bulk operations, workflow automation tools, and a data model marketplace.",
                "Seamless synchronization engine syncing local client databases with Zendesk's cloud endpoints."
            ],
            contribution: [
                "Architected the custom data integration flow matching Zendesk's dynamic custom objects schema.",
                "Developed the responsive frontend dashboard in Vue.js with drag-and-drop workflow builders.",
                "Built high-performance PHP/Laravel background workers resolving API rate limit conflicts."
            ]
        },
        toolszip: {
            title: "ToolsZip",
            tags: ["Productivity Suite", "Online Utilities", "Toolbox Engine"],
            stack: ["Laravel", "JavaScript", "MySQL", "PDF Utilities", "Image Processing"],
            overview: "ToolsZip is a comprehensive online developer and consumer productivity dashboard offering simultaneous multi-tool usage for document manipulation, converters, and SEO checks.",
            features: [
                "PDF management utilities including merging, splitting, compressing, and encryption overrides.",
                "Client-side image processing, format converters, and metadata inspectors.",
                "SEO analysis scraping reports, layout checking tools, and code formatters."
            ],
            contribution: [
                "Designed the core client-side worker system in JavaScript enabling multiple operations concurrently without UI lockups.",
                "Integrated PHP image and document processing libraries with cached server delivery.",
                "Developed a clean, modern user dashboard optimized for quick drop-and-convert workflows."
            ]
        },
        ishopeco: {
            title: "IShopEco",
            tags: ["E-Commerce", "Eco-Friendly Portal", "Mobile Ready"],
            stack: ["Vue.js", "Quasar Framework", "Laravel", "MySQL", "Stripe API", "REST APIs"],
            overview: "IShopEco is an eco-friendly e-commerce platform offering a responsive catalog, checkout procedures, and administrative order tracking dashboards.",
            features: [
                "High-performance catalog with faceted filtering, tags, real-time search, and rating controls.",
                "Smooth shopping cart, guest checkouts, user authentication, and Stripe payment gateway integrations.",
                "Admin portal for order fulfillments, product catalogs, vendor channels, and discount configurations."
            ],
            contribution: [
                "Developed the responsive, mobile-ready SPA frontend using Vue.js and Quasar Framework.",
                "Designed Laravel RESTful APIs handling cart state synchronization and order operations.",
                "Integrated payment webhooks and structured catalog search optimization in MySQL."
            ]
        },
        gerdentusa: {
            title: "GerDentUSA & GerVetUSA",
            tags: ["B2B E-Commerce", "Medical Devices", "Product Catalogs"],
            stack: ["PHP", "Laravel", "MySQL", "JavaScript", "Order Pipelines", "B2B Accounts"],
            overview: "GerDentUSA and GerVetUSA are two prominent B2B surgical instrument e-commerce applications built for dental and veterinary surgical tool distribution.",
            features: [
                "Multi-category catalog management representing thousands of German-forged surgical instruments.",
                "Complex B2B account hierarchies, purchase orders, credit balances, and special custom pricing tiers.",
                "Enterprise checkout workflows, invoice generations, shipment tracking, and backend admin controls."
            ],
            contribution: [
                "Engineered database schema designs, custom Laravel migrations, and query speedups for medical tool catalogs.",
                "Coded Eloquent models, Blade layouts, and JavaScript dynamic cart details.",
                "Collaborated on MySQL search query optimizations, reducing catalog load times by over 40%."
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
    // CONTACT FORM INTERACTION & SUCCESS SIMULATION
    // ==========================================================================
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');
    const btnSubmit = document.getElementById('btn-submit-form');
    const btnReset = document.getElementById('btn-reset-form');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Basic Client validation check
            const nameInput = document.getElementById('form-name');
            const emailInput = document.getElementById('form-email');
            const subjectInput = document.getElementById('form-subject');
            const messageInput = document.getElementById('form-message');
            
            if (!nameInput.value || !emailInput.value || !subjectInput.value || !messageInput.value) {
                return;
            }

            // Simulate form submission status
            btnSubmit.disabled = true;
            btnSubmit.textContent = "Sending Message...";
            btnSubmit.style.opacity = "0.7";
            
            setTimeout(() => {
                // Success state layout transition
                contactForm.style.display = "none";
                formSuccess.classList.add('active');
                
                // Reset form fields
                contactForm.reset();
                btnSubmit.disabled = false;
                btnSubmit.textContent = "Send Message";
                btnSubmit.style.opacity = "1";
            }, 1500);
        });
    }

    if (btnReset) {
        btnReset.addEventListener('click', () => {
            formSuccess.classList.remove('active');
            setTimeout(() => {
                contactForm.style.display = "flex";
            }, 100);
        });
    }
});
