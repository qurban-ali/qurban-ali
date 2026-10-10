// /blog/<slug> page: loads the post's details from data/blog.json and its
// Markdown from content/blog/<slug>.md, then renders it with marked.
document.addEventListener('DOMContentLoaded', async () => {
    const titleEl = document.getElementById('article-title');
    const bodyEl = document.getElementById('article-body');

    // Vercel rewrites /blog/<slug> to this page; ?slug= also works for local previews.
    const slug = new URLSearchParams(location.search).get('slug') ||
        decodeURIComponent(location.pathname.replace(/\/+$/, '').split('/').pop());

    const notFound = () => {
        document.title = 'Article not found | Qurban Ali';
        titleEl.textContent = 'Article not found';
        bodyEl.innerHTML = '<p>This article doesn\'t exist or has been moved. <a href="/blog">Browse all articles</a>.</p>';
    };

    try {
        const posts = Site.publishedPosts(await Site.loadJSON('/data/blog.json'));
        const post = posts.find(p => p.slug === slug);
        if (!post) return notFound();

        const response = await fetch(`/content/blog/${encodeURIComponent(post.slug)}.md`, { cache: 'no-cache' });
        if (!response.ok) return notFound();
        const markdown = await response.text();

        document.title = `${post.title} | Qurban Ali`;
        document.querySelector('meta[name="description"]').setAttribute('content', post.excerpt);
        document.querySelector('link[rel="canonical"]').setAttribute('href', `https://qurbanali.me/blog/${post.slug}`);

        titleEl.textContent = post.title;
        document.getElementById('article-meta').innerHTML = `
            <time datetime="${Site.escapeHtml(post.date)}">${Site.formatDate(post.date)}</time>
            <span aria-hidden="true">&middot;</span>
            <span>${Number(post.readingTime) || 1} min read</span>
            <span aria-hidden="true">&middot;</span>
            <span>Qurban Ali</span>`;
        document.getElementById('article-tags').innerHTML = (post.tags || [])
            .map(tag => `<a class="project-tag" href="/blog?tag=${encodeURIComponent(tag)}">${Site.escapeHtml(tag)}</a>`)
            .join('');
        if (post.cover) {
            const cover = document.getElementById('article-cover');
            cover.src = post.cover;
            cover.alt = post.coverAlt || post.title;
            cover.hidden = false;
            document.querySelector('meta[property="og:image"]')
                .setAttribute('content', `https://qurbanali.me${post.cover}`);
        }
        bodyEl.innerHTML = marked.parse(markdown);
        bodyEl.querySelectorAll('img').forEach(img => { img.loading = 'lazy'; img.decoding = 'async'; });
    } catch (err) {
        console.error(err);
        titleEl.textContent = 'Something went wrong';
        bodyEl.innerHTML = '<p>The article could not be loaded. Please refresh the page.</p>';
    }
});
