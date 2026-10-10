// /blog page: every published post from data/blog.json, with search and topic filters.
document.addEventListener('DOMContentLoaded', async () => {
    const grid = document.getElementById('blog-grid');
    try {
        const posts = Site.publishedPosts(await Site.loadJSON('/data/blog.json'));
        Site.initListing({
            items: posts,
            grid,
            search: document.getElementById('blog-search'),
            filters: document.getElementById('blog-filters'),
            count: document.getElementById('blog-count'),
            getTags: p => p.tags || [],
            getText: p => [p.title, p.excerpt, ...(p.tags || [])].join(' '),
            render: shown => { grid.innerHTML = shown.map(Site.renderBlogCard).join(''); },
            noun: 'articles'
        });
    } catch (err) {
        console.error(err);
        grid.innerHTML = '<p class="content-empty">Articles could not be loaded. Please refresh the page.</p>';
    }
});
