// /projects page: every project from data/projects.json, with search and category filters.
document.addEventListener('DOMContentLoaded', async () => {
    const grid = document.getElementById('projects-grid');
    try {
        const projects = await Site.loadJSON('/data/projects.json');
        Site.initListing({
            items: projects,
            grid,
            search: document.getElementById('projects-search'),
            filters: document.getElementById('projects-filters'),
            count: document.getElementById('projects-count'),
            getTags: p => p.categories || [],
            getText: p => [p.title, p.excerpt, ...p.cardTags, ...p.stack].join(' '),
            render: shown => Site.renderProjects(grid, shown),
            noun: 'projects'
        });
    } catch (err) {
        console.error(err);
        grid.innerHTML = '<p class="content-empty">Projects could not be loaded. Please refresh the page.</p>';
    }
});
