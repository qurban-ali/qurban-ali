/**
 * Shared behaviour for every page: sticky navbar, scroll progress, mobile menu,
 * scroll reveal, modal and listing filters. Card templates come from js/render.js
 * (load it first). Exposed as window.Site.
 */
(function () {
    // Content lives in /data and /content so it can be edited without touching code.
    async function loadJSON(path) {
        const response = await fetch(path, { cache: 'no-cache' });
        if (!response.ok) throw new Error(`Could not load ${path} (${response.status})`);
        return response.json();
    }

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
    // PROJECT CARDS & DETAILS (templates live in js/render.js)
    // ==========================================================================
    const { escapeHtml, formatDate, renderProjectCard, projectDetailsHtml, renderBlogCard, publishedPosts } = window.Render;

    // Render cards into a container. Each card links to its own project page;
    // a plain click opens the quick-view popup instead (Ctrl/Cmd-click still opens the page).
    function renderProjects(container, projects) {
        container.innerHTML = projects.map(renderProjectCard).join('');
        const bySlug = Object.fromEntries(projects.map(p => [p.slug, p]));
        container.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
                e.preventDefault();
                openModal(projectDetailsHtml(bySlug[card.dataset.project]) +
                    `<p class="modal-permalink"><a class="btn-link" href="${window.Render.projectUrl(bySlug[card.dataset.project])}">Open full project page &rarr;</a></p>`);
            });
        });
    }

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
