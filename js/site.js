/**
 * Shared behaviour for every page (home, projects, blog, blog post):
 * sticky navbar, scroll progress, mobile menu, scroll reveal, modal,
 * and the project / blog card renderers. Exposed as window.Site.
 */
(function () {
    const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));

    // Content lives in /data and /content so it can be edited without touching code.
    async function loadJSON(path) {
        const response = await fetch(path, { cache: 'no-cache' });
        if (!response.ok) throw new Error(`Could not load ${path} (${response.status})`);
        return response.json();
    }

    const formatDate = (iso) => new Date(`${iso}T00:00:00`).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric'
    });

    // ==========================================================================
    // STICKY NAVBAR & SCROLL PROGRESS
    // ==========================================================================
    function initNavbar() {
        const navbar = document.getElementById('navbar');
        const scrollProgress = document.getElementById('scroll-progress');
        if (!navbar) return;

        const update = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            navbar.classList.toggle('scrolled', scrollTop > 50 || navbar.dataset.solid === 'true');
            if (scrollProgress) {
                scrollProgress.style.width = (docHeight > 0 ? (scrollTop / docHeight) * 100 : 0) + '%';
            }
        };
        window.addEventListener('scroll', update, { passive: true });
        update();
    }

    // ==========================================================================
    // MOBILE NAVIGATION MENU
    // ==========================================================================
    function initMobileMenu() {
        const menuToggle = document.getElementById('menu-toggle');
        const mobileNav = document.getElementById('mobile-nav');
        if (!menuToggle || !mobileNav) return;

        const close = () => {
            menuToggle.classList.remove('active');
            mobileNav.classList.remove('active');
            document.body.classList.remove('overflow-hidden');
        };

        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mobileNav.classList.toggle('active');
            document.body.classList.toggle('overflow-hidden');
        });
        mobileNav.querySelectorAll('.mobile-link').forEach(link => link.addEventListener('click', close));
    }

    // ==========================================================================
    // SCROLL REVEAL ANIMATIONS
    // ==========================================================================
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    const observeReveal = (root = document) => {
        root.querySelectorAll('.scroll-reveal:not(.revealed)').forEach(el => revealObserver.observe(el));
    };

    // ==========================================================================
    // MODAL (project details, About Me full story)
    // ==========================================================================
    let modal, modalContent;

    function openModal(html) {
        if (!modal) return;
        modalContent.innerHTML = html;
        modal.classList.add('active');
        document.body.classList.add('overflow-hidden');
        modal.querySelector('.modal-card').scrollTop = 0;
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.remove('active');
        document.body.classList.remove('overflow-hidden');
        setTimeout(() => { modalContent.innerHTML = ''; }, 300);
    }

    function initModal() {
        modal = document.getElementById('site-modal');
        if (!modal) return;
        modalContent = document.getElementById('modal-body-content');
        document.getElementById('modal-close').addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
        });
    }

    // ==========================================================================
    // PROJECT CARDS & DETAILS
    // ==========================================================================
    const renderProjectCard = (p) => `
        <article class="project-card" data-project="${escapeHtml(p.slug)}" tabindex="0" role="button"
                 aria-label="View details for ${escapeHtml(p.title)}">
            <div class="project-card-content">
                <div class="project-meta">
                    ${p.cardTags.map(tag => `<span class="project-tag">${escapeHtml(tag)}</span>`).join('')}
                </div>
                <h3 class="project-card-title">${escapeHtml(p.title)}</h3>
                <p class="project-card-excerpt">${escapeHtml(p.excerpt)}</p>
                <div class="project-card-tech">
                    ${p.cardTech.map(tech => `<span>${escapeHtml(tech)}</span>`).join('')}
                </div>
                <span class="project-btn btn-link">Explore Details &rarr;</span>
            </div>
        </article>`;

    const projectModalHtml = (p) => `
        <h3 class="modal-project-title">${escapeHtml(p.title)}</h3>
        <div class="modal-project-meta">
            ${p.tags.map(tag => `<span class="project-tag">${escapeHtml(tag)}</span>`).join('')}
        </div>

        <h4 class="modal-section-title">Overview</h4>
        <p>${escapeHtml(p.overview)}</p>

        <h4 class="modal-section-title">Key Core Features</h4>
        <ul class="modal-list">
            ${p.features.map(f => `<li>${escapeHtml(f)}</li>`).join('')}
        </ul>

        <h4 class="modal-section-title">Team Leadership & Engineering Contribution</h4>
        <ul class="modal-list">
            ${p.contribution.map(c => `<li>${escapeHtml(c)}</li>`).join('')}
        </ul>

        <h4 class="modal-section-title">Technology & AI Stack</h4>
        <div class="modal-project-tech">
            ${p.stack.map(t => `<span>${escapeHtml(t)}</span>`).join('')}
        </div>`;

    // Render cards into a container and open the details modal on click / Enter.
    function renderProjects(container, projects) {
        container.innerHTML = projects.map(renderProjectCard).join('');
        const bySlug = Object.fromEntries(projects.map(p => [p.slug, p]));
        const open = (card) => openModal(projectModalHtml(bySlug[card.dataset.project]));
        container.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('click', () => open(card));
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(card); }
            });
        });
    }

    // ==========================================================================
    // BLOG CARDS
    // ==========================================================================
    const renderBlogCard = (post) => `
        <a class="blog-card" href="/blog/${encodeURIComponent(post.slug)}">
            ${post.cover ? `<img class="blog-card-cover" src="${escapeHtml(post.cover)}" alt="${escapeHtml(post.coverAlt || post.title)}"
                 width="1200" height="630" loading="lazy" decoding="async">` : ''}
            <div class="blog-card-meta">
                <time datetime="${escapeHtml(post.date)}">${formatDate(post.date)}</time>
                <span aria-hidden="true">&middot;</span>
                <span>${Number(post.readingTime) || 1} min read</span>
            </div>
            <h3 class="blog-card-title">${escapeHtml(post.title)}</h3>
            <p class="blog-card-excerpt">${escapeHtml(post.excerpt)}</p>
            <div class="blog-card-footer">
                <div class="blog-card-tags">
                    ${post.tags.map(tag => `<span class="project-tag">${escapeHtml(tag)}</span>`).join('')}
                </div>
                <span class="btn-link">Read &rarr;</span>
            </div>
        </a>`;

    // Newest first; posts dated in the future stay hidden until that day.
    const publishedPosts = (posts) => {
        const today = new Date().toISOString().slice(0, 10);
        return posts.filter(p => !p.draft && p.date <= today).sort((a, b) => b.date.localeCompare(a.date));
    };

    // ==========================================================================
    // LISTING PAGES: search box + filter chips (used by /projects and /blog)
    // ==========================================================================
    function initListing({ items, grid, search, filters, count, getTags, getText, render, noun }) {
        const tags = [...new Set(items.flatMap(getTags))].sort();
        let activeTag = new URLSearchParams(location.search).get('tag') || 'All';
        if (!tags.includes(activeTag)) activeTag = 'All';

        filters.innerHTML = ['All', ...tags].map(tag =>
            `<button type="button" class="filter-chip${tag === activeTag ? ' active' : ''}" ` +
            `data-tag="${escapeHtml(tag)}" aria-pressed="${tag === activeTag}">${escapeHtml(tag)}</button>`
        ).join('');

        const update = () => {
            const q = search.value.trim().toLowerCase();
            const shown = items.filter(item =>
                (activeTag === 'All' || getTags(item).includes(activeTag)) &&
                (!q || getText(item).toLowerCase().includes(q))
            );
            render(shown);
            count.textContent = `Showing ${shown.length} of ${items.length} ${noun}`;
            if (!shown.length) {
                grid.innerHTML = `<p class="content-empty">No ${noun} match your search.</p>`;
            }
        };

        filters.addEventListener('click', (e) => {
            const chip = e.target.closest('.filter-chip');
            if (!chip) return;
            activeTag = chip.dataset.tag;
            filters.querySelectorAll('.filter-chip').forEach(c => {
                const on = c === chip;
                c.classList.toggle('active', on);
                c.setAttribute('aria-pressed', on);
            });
            const url = new URL(location.href);
            if (activeTag === 'All') url.searchParams.delete('tag'); else url.searchParams.set('tag', activeTag);
            history.replaceState(null, '', url);
            update();
        });
        search.addEventListener('input', update);
        update();
    }

    document.addEventListener('DOMContentLoaded', () => {
        initNavbar();
        initMobileMenu();
        initModal();
        observeReveal();
        const year = document.getElementById('footer-year');
        if (year) year.textContent = new Date().getFullYear();
    });

    window.Site = {
        escapeHtml, loadJSON, formatDate, observeReveal, openModal, closeModal,
        renderProjects, renderBlogCard, publishedPosts, initListing
    };
})();
