/**
 * HTML templates for project and blog cards, shared by the browser (window.Render)
 * and the build script (require('./js/render.js')) so pre-rendered pages and
 * JavaScript-rendered pages always produce identical markup.
 */
(function (root, factory) {
    if (typeof module === 'object' && module.exports) module.exports = factory();
    else root.Render = factory();
})(typeof self !== 'undefined' ? self : this, function () {
    const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));

    // Fixed timezone so the build server and every visitor show the same date.
    const formatDate = (iso) => new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC'
    });

    const projectUrl = (p) => `/projects/${encodeURIComponent(p.slug)}`;
    const postUrl = (post) => `/blog/${encodeURIComponent(post.slug)}`;

    // The card is a real link to the project page (crawlable); on the home and
    // projects pages JavaScript opens the quick-view popup instead.
    const renderProjectCard = (p) => `
        <article class="project-card" data-project="${escapeHtml(p.slug)}">
            <div class="project-card-content">
                <div class="project-meta">
                    ${p.cardTags.map(tag => `<span class="project-tag">${escapeHtml(tag)}</span>`).join('')}
                </div>
                <h3 class="project-card-title">${escapeHtml(p.title)}</h3>
                <p class="project-card-excerpt">${escapeHtml(p.excerpt)}</p>
                <div class="project-card-tech">
                    ${p.cardTech.map(tech => `<span>${escapeHtml(tech)}</span>`).join('')}
                </div>
                <a class="project-btn btn-link" href="${projectUrl(p)}">Explore Details<span class="visually-hidden"> about ${escapeHtml(p.title)}</span> &rarr;</a>
            </div>
        </article>`;

    const projectDetailsHtml = (p, headingTag = 'h3') => `
        <${headingTag} class="modal-project-title">${escapeHtml(p.title)}</${headingTag}>
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

    const renderBlogCard = (post) => `
        <a class="blog-card" href="${postUrl(post)}">
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

    // Newest first; posts dated in the future, or marked draft, stay hidden.
    const publishedPosts = (posts, today = new Date().toISOString().slice(0, 10)) =>
        posts.filter(p => !p.draft && p.date <= today).sort((a, b) => b.date.localeCompare(a.date));

    return {
        escapeHtml, formatDate, projectUrl, postUrl,
        renderProjectCard, projectDetailsHtml, renderBlogCard, publishedPosts
    };
});
