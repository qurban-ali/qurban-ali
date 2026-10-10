// Static site build (run by Vercel via `npm run build`, output in dist/).
//
// Search engines and AI crawlers get complete HTML without running JavaScript:
//   - every page gets its title, description, canonical, Open Graph, Twitter and JSON-LD tags
//   - home, /projects and /blog get their cards pre-rendered
//   - /projects/<slug> and /blog/<slug> are generated as full static pages
//   - sitemap.xml, robots.txt, rss.xml, llms.txt and llms-full.txt are generated from the data
//
// Content lives in data/*.json and content/blog/*.md; see README "Managing Content".

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { Marked } from 'marked';

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const R = require(path.join(ROOT, 'js/render.js'));
const { escapeHtml: esc } = R;

const SITE = 'https://www.qurbanali.me';
const TODAY = new Date().toISOString().slice(0, 10);
const PERSON_ID = `${SITE}/#person`;
const WEBSITE_ID = `${SITE}/#website`;
const DEFAULT_IMAGE = '/assets/og/og-home.jpg';

const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const readJSON = (p) => JSON.parse(read(p));
const write = (p, content) => {
    const file = path.join(DIST, p);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, content);
};
const abs = (url) => (url.startsWith('http') ? url : SITE + url);

const projects = readJSON('data/projects.json');
const posts = R.publishedPosts(readJSON('data/blog.json'), TODAY);
const faq = readJSON('data/faq.json');

// --------------------------------------------------------------------------
// Copy static files (only what the site needs: no notes, sources or tooling)
// --------------------------------------------------------------------------
fs.rmSync(DIST, { recursive: true, force: true });
for (const dir of ['assets', 'css', 'js', 'data']) {
    fs.cpSync(path.join(ROOT, dir), path.join(DIST, dir), { recursive: true });
}

// --------------------------------------------------------------------------
// Image size lookup (JPEG/PNG/WebP headers) for width/height attributes
// --------------------------------------------------------------------------
function imageSize(urlPath) {
    try {
        const b = fs.readFileSync(path.join(ROOT, decodeURIComponent(urlPath)));
        if (b[0] === 0x89 && b.toString('ascii', 1, 4) === 'PNG') return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
        if (b[0] === 0xff && b[1] === 0xd8) {
            let i = 2;
            while (i < b.length) {
                const marker = b[i + 1];
                const len = b.readUInt16BE(i + 2);
                if (marker >= 0xc0 && marker <= 0xc3) return { h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7) };
                i += 2 + len;
            }
        }
    } catch { /* fall through */ }
    return null;
}

// --------------------------------------------------------------------------
// <head> SEO block
// --------------------------------------------------------------------------
const PERSON = {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: 'Qurban Ali',
    url: `${SITE}/`,
    image: `${SITE}/assets/avatar-720.webp`,
    jobTitle: 'Engineering Team Lead & Senior Full-Stack Developer',
    description: 'Engineering Team Lead and Senior Full-Stack Developer with 7+ years of experience building AI-powered platforms, FinTech systems and SaaS products.',
    email: 'mailto:info@qurbanali.me',
    worksFor: { '@type': 'Organization', name: 'Friday Media Group Pakistan' },
    address: { '@type': 'PostalAddress', addressLocality: 'Lahore', addressRegion: 'Punjab', addressCountry: 'PK' },
    sameAs: ['https://www.linkedin.com/in/qurbanali-pro/', 'https://github.com/qurban-ali'],
    knowsAbout: [
        'Technical Leadership', 'Software Architecture', 'Full-Stack Development', 'Generative AI',
        'Large Language Models', 'Retrieval-Augmented Generation', 'Semantic Search', 'Apache Solr',
        'FinTech', 'NetSuite ERP Integration', 'Accounts Payable Automation', 'SaaS Development',
        'React.js', 'Vue.js', 'Node.js', 'Laravel', 'PHP', 'Python', 'MySQL', 'PostgreSQL'
    ]
};

const WEBSITE = {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: `${SITE}/`,
    name: 'Qurban Ali',
    alternateName: 'Qurban Ali Portfolio',
    inLanguage: 'en',
    publisher: { '@id': PERSON_ID }
};

const breadcrumb = (items) => ({
    '@type': 'BreadcrumbList',
    itemListElement: items.map(([name, url], i) => ({ '@type': 'ListItem', position: i + 1, name, item: abs(url) }))
});

const breadcrumbNav = (items) => `
                <nav class="breadcrumbs" aria-label="Breadcrumb">
                    <ol>
                        ${items.map(([name, url], i) => i === items.length - 1
        ? `<li><span aria-current="page">${esc(name)}</span></li>`
        : `<li><a href="${url}">${esc(name)}</a></li>`).join('\n                        ')}
                    </ol>
                </nav>`;

function seoHead({ title, description, url, image = DEFAULT_IMAGE, imageAlt, type = 'website', article, jsonld, noindex }) {
    const img = imageSize(image) || { w: 1200, h: 630 };
    const tags = [
        `<title>${esc(title)}</title>`,
        `<meta name="description" content="${esc(description)}">`,
        `<meta name="author" content="Qurban Ali">`,
        `<meta name="robots" content="${noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'}">`,
        `<link rel="canonical" href="${abs(url)}">`,
        `<meta name="theme-color" content="#080c14">`,
        `<link rel="alternate" type="application/rss+xml" title="Qurban Ali — Blog" href="${SITE}/rss.xml">`,
        `<meta property="og:type" content="${type}">`,
        `<meta property="og:site_name" content="Qurban Ali">`,
        `<meta property="og:locale" content="en_US">`,
        `<meta property="og:url" content="${abs(url)}">`,
        `<meta property="og:title" content="${esc(title)}">`,
        `<meta property="og:description" content="${esc(description)}">`,
        `<meta property="og:image" content="${abs(image)}">`,
        `<meta property="og:image:width" content="${img.w}">`,
        `<meta property="og:image:height" content="${img.h}">`,
        `<meta property="og:image:alt" content="${esc(imageAlt || title)}">`,
        ...(article ? [
            `<meta property="article:published_time" content="${article.published}">`,
            `<meta property="article:modified_time" content="${article.modified}">`,
            `<meta property="article:author" content="${SITE}/">`,
            ...article.tags.map(t => `<meta property="article:tag" content="${esc(t)}">`)
        ] : []),
        `<meta name="twitter:card" content="summary_large_image">`,
        `<meta name="twitter:title" content="${esc(title)}">`,
        `<meta name="twitter:description" content="${esc(description)}">`,
        `<meta name="twitter:image" content="${abs(image)}">`,
        `<meta name="twitter:image:alt" content="${esc(imageAlt || title)}">`,
        `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': jsonld })
            .replace(/</g, '\\u003c')}</script>`
    ];
    return tags.map(t => '    ' + t).join('\n');
}

// Replace the hand-written SEO tags of a source page with the generated block.
function applyHead(html, head) {
    let out = html
        .replace(/\s*<!--[^>]*(SEO|Canonical|Open Graph|Twitter|JSON-LD)[^>]*-->/g, '')
        .replace(/\s*<title>[\s\S]*?<\/title>/, '')
        .replace(/\s*<meta\s+name="(description|keywords|author|robots|theme-color)"[\s\S]*?>/g, '')
        .replace(/\s*<meta\s+(property|name)="(og|twitter|article):[^"]*"[^>]*>/g, '')
        .replace(/\s*<link rel="(canonical|alternate)"[^>]*>/g, '')
        .replace(/\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '');
    return out.replace(/(<meta name="viewport"[^>]*>)/, `$1\n${head}`);
}

const fill = (html, id, inner) => {
    const re = new RegExp(`(<div[^>]*id="${id}"[^>]*>)(</div>)`);
    if (!re.test(html)) throw new Error(`Placeholder #${id} not found`);
    return html.replace(re, `$1${inner}\n                $2`);
};

const replaceMain = (shell, main) => shell.replace(/<main>[\s\S]*<\/main>/, `<main>\n${main}\n    </main>`);

// Page scripts: shared ones only (page-specific scripts are re-added where needed).
const withScripts = (shell, extra = '') => shell.replace(
    /(\s*<script src="\/js\/render\.js" defer><\/script>[\s\S]*?)(\s*<\/body>)/,
    `\n    <script src="/js/render.js" defer></script>\n    <script src="/js/site.js" defer></script>\n    <script src="/js/mascot.js" defer></script>${extra}$2`);

const sitemap = [];
const addToSitemap = (url, lastmod, priority, image) => sitemap.push({ url, lastmod, priority, image });

const latestDate = posts[0]?.updated || posts[0]?.date || TODAY;

// --------------------------------------------------------------------------
// Home page
// --------------------------------------------------------------------------
{
    let html = read('index.html');
    const featured = projects.filter(p => p.featured).slice(0, 6);
    html = fill(html, 'featured-projects-grid', featured.map(R.renderProjectCard).join(''));
    html = fill(html, 'latest-posts-grid', posts.slice(0, 3).map(R.renderBlogCard).join(''));
    html = html.replace(/(<span id="projects-total">)\d+(<\/span>)/, `$1${projects.length}$2`);

    const description = 'Qurban Ali is an Engineering Team Lead and Senior Full-Stack Developer in Lahore, Pakistan, with 7+ years building AI (LLM, RAG), FinTech and SaaS products.';
    html = applyHead(html, seoHead({
        title: 'Qurban Ali | Engineering Team Lead & Full-Stack AI Developer',
        description,
        url: '/',
        imageAlt: 'Qurban Ali, Engineering Team Lead and Senior Full-Stack Developer',
        jsonld: [
            PERSON,
            WEBSITE,
            {
                '@type': 'ProfilePage',
                '@id': `${SITE}/#profile`,
                url: `${SITE}/`,
                name: 'Qurban Ali — Engineering Team Lead & Senior Full-Stack Developer',
                description,
                isPartOf: { '@id': WEBSITE_ID },
                mainEntity: { '@id': PERSON_ID },
                dateModified: latestDate
            },
            {
                '@type': 'FAQPage',
                '@id': `${SITE}/#faq`,
                mainEntity: faq.map(([q, a]) => ({
                    '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a }
                }))
            }
        ]
    }));
    write('index.html', html);
    addToSitemap('/', latestDate, '1.0', DEFAULT_IMAGE);
}

// --------------------------------------------------------------------------
// /projects and /projects/<slug>
// --------------------------------------------------------------------------
const shell = read('projects.html');
{
    let html = fill(shell, 'projects-grid', projects.map(R.renderProjectCard).join(''));
    html = html.replace(/(<p class="listing-count" id="projects-count"[^>]*>)(<\/p>)/,
        `$1Showing ${projects.length} of ${projects.length} projects$2`);
    html = applyHead(html, seoHead({
        title: 'Projects: AI, FinTech & SaaS Case Studies | Qurban Ali',
        description: `${projects.length} production systems led and built by Qurban Ali: AI recruitment and RAG search, NetSuite finance automation, HR tech, SaaS and e-commerce.`,
        url: '/projects',
        image: '/assets/og/og-projects.jpg',
        jsonld: [
            PERSON, WEBSITE,
            {
                '@type': 'CollectionPage',
                '@id': `${SITE}/projects#page`,
                url: `${SITE}/projects`,
                name: 'Projects by Qurban Ali',
                isPartOf: { '@id': WEBSITE_ID },
                author: { '@id': PERSON_ID },
                mainEntity: {
                    '@type': 'ItemList',
                    itemListElement: projects.map((p, i) => ({
                        '@type': 'ListItem', position: i + 1, url: abs(R.projectUrl(p)), name: p.title
                    }))
                }
            },
            breadcrumb([['Home', '/'], ['Projects', '/projects']])
        ]
    }));
    write('projects.html', html);
    addToSitemap('/projects', TODAY, '0.8', '/assets/og/og-projects.jpg');
}

for (const p of projects) {
    const url = R.projectUrl(p);
    const related = projects
        .filter(o => o.slug !== p.slug && o.categories.some(c => p.categories.includes(c)))
        .slice(0, 3);
    const main = `
        <section class="page-hero project-page">
            <div class="container">
${breadcrumbNav([['Home', '/'], ['Projects', '/projects'], [p.title, url]])}
                <article class="project-page-body">
                    ${R.projectDetailsHtml(p, 'h1')}
                </article>

                <aside class="article-cta">
                    <h2>Need something similar?</h2>
                    <p>I help teams design and ship AI-powered, FinTech and SaaS products, and lead the engineering
                        teams that build them.</p>
                    <a href="/#contact" class="btn btn-primary">Discuss your project</a>
                </aside>
${related.length ? `
                <section class="related-section" aria-labelledby="related-projects">
                    <h2 id="related-projects">Related projects</h2>
                    <div class="projects-grid">${related.map(R.renderProjectCard).join('')}</div>
                </section>` : ''}
            </div>
        </section>`;
    let html = withScripts(replaceMain(shell, main));
    const description = p.overview.length > 158 ? p.overview.slice(0, p.overview.lastIndexOf(' ', 155)) + '…' : p.overview;
    html = applyHead(html, seoHead({
        title: `${p.seoTitle || `${p.title}: ${p.cardTags.join(' & ')} Project`} | Qurban Ali`,
        description,
        url,
        image: '/assets/og/og-projects.jpg',
        jsonld: [
            PERSON, WEBSITE,
            {
                '@type': 'CreativeWork',
                '@id': `${abs(url)}#project`,
                name: p.title,
                url: abs(url),
                description: p.overview,
                abstract: p.excerpt,
                creator: { '@id': PERSON_ID },
                keywords: [...p.tags, ...p.stack].join(', '),
                about: p.categories.map(c => ({ '@type': 'Thing', name: c }))
            },
            breadcrumb([['Home', '/'], ['Projects', '/projects'], [p.title, url]])
        ]
    }));
    write(`projects/${p.slug}.html`, html);
    addToSitemap(url, TODAY, '0.7');
}

// --------------------------------------------------------------------------
// /blog and /blog/<slug>
// --------------------------------------------------------------------------
const slugify = (text) => text.toLowerCase().replace(/<[^>]+>/g, '').replace(/&[a-z]+;/g, '')
    .replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').slice(0, 80);

function renderMarkdown(md) {
    const toc = [];
    const used = new Set();
    const marked = new Marked({
        renderer: {
            heading(text, level) {
                let id = slugify(text) || `section-${used.size + 1}`;
                while (used.has(id)) id += '-x';
                used.add(id);
                if (level === 2) toc.push({ id, text });
                return `<h${level} id="${id}">${text}</h${level}>\n`;
            },
            image(href, title, text) {
                const size = href.startsWith('/') ? imageSize(href) : null;
                const dims = size ? ` width="${size.w}" height="${size.h}"` : '';
                return `<img src="${href}" alt="${esc(text)}"${dims} loading="lazy" decoding="async"${title ? ` title="${esc(title)}"` : ''}>`;
            },
            link(href, title, text) {
                const external = /^https?:\/\//.test(href) && !href.startsWith(SITE);
                return `<a href="${href}"${title ? ` title="${esc(title)}"` : ''}${external ? ' target="_blank" rel="noopener noreferrer"' : ''}>${text}</a>`;
            }
        }
    });
    return { html: marked.parse(md), toc };
}

const blogShell = read('blog.html');
{
    let html = fill(blogShell, 'blog-grid', posts.map(R.renderBlogCard).join(''));
    html = html.replace(/(<p class="listing-count" id="blog-count"[^>]*>)(<\/p>)/,
        `$1Showing ${posts.length} of ${posts.length} articles$2`);
    html = applyHead(html, seoHead({
        title: 'Blog: AI, LLM Search & Engineering Leadership | Qurban Ali',
        description: 'Practical articles by Qurban Ali on Generative AI, GEO and LLM search, AI agents, MCP, LLM evals, FinTech and engineering leadership.',
        url: '/blog',
        image: '/assets/og/og-blog.jpg',
        jsonld: [
            PERSON, WEBSITE,
            {
                '@type': 'Blog',
                '@id': `${SITE}/blog#blog`,
                url: `${SITE}/blog`,
                name: 'Qurban Ali — Blog',
                description: 'Notes on AI, software architecture and engineering leadership.',
                inLanguage: 'en',
                isPartOf: { '@id': WEBSITE_ID },
                author: { '@id': PERSON_ID },
                blogPost: posts.map(p => ({
                    '@type': 'BlogPosting',
                    headline: p.title,
                    url: abs(R.postUrl(p)),
                    datePublished: p.date,
                    dateModified: p.updated || p.date,
                    image: p.cover ? abs(p.cover) : undefined,
                    author: { '@id': PERSON_ID }
                }))
            },
            breadcrumb([['Home', '/'], ['Blog', '/blog']])
        ]
    }));
    write('blog.html', html);
    addToSitemap('/blog', latestDate, '0.8', '/assets/og/og-blog.jpg');
}

const fullTextForLlms = [];

for (const post of posts) {
    const url = R.postUrl(post);
    const md = read(`content/blog/${post.slug}.md`);
    const { html: body, toc } = renderMarkdown(md);
    const words = md.split(/\s+/).filter(Boolean).length;
    const modified = post.updated || post.date;
    const related = posts
        .filter(o => o.slug !== post.slug)
        .map(o => ({ o, score: o.tags.filter(t => post.tags.includes(t)).length }))
        .sort((a, b) => b.score - a.score || b.o.date.localeCompare(a.o.date))
        .slice(0, 3).map(x => x.o);

    const main = `
        <section class="page-hero">
            <div class="container">
                <article class="article">
${breadcrumbNav([['Home', '/'], ['Blog', '/blog'], [post.title, url]])}
                    <header class="article-header">
                        <div class="article-meta">
                            <span>By <a href="/#about" rel="author">Qurban Ali</a></span>
                            <span aria-hidden="true">&middot;</span>
                            <span>Published <time datetime="${post.date}">${R.formatDate(post.date)}</time></span>
                            ${modified !== post.date ? `<span aria-hidden="true">&middot;</span>
                            <span>Updated <time datetime="${modified}">${R.formatDate(modified)}</time></span>` : ''}
                            <span aria-hidden="true">&middot;</span>
                            <span>${post.readingTime} min read</span>
                        </div>
                        <h1 class="article-title">${esc(post.title)}</h1>
                        <p class="article-lead">${esc(post.excerpt)}</p>
                        <div class="blog-card-tags">
                            ${post.tags.map(t => `<a class="project-tag" href="/blog?tag=${encodeURIComponent(t)}">${esc(t)}</a>`).join('')}
                        </div>
                        ${post.cover ? `<img class="article-cover" src="${post.cover}" alt="${esc(post.coverAlt || post.title)}"
                             width="1200" height="630" fetchpriority="high" decoding="async">` : ''}
                    </header>
${toc.length >= 3 ? `
                    <nav class="article-toc" aria-labelledby="toc-title">
                        <h2 id="toc-title">In this article</h2>
                        <ol>
                            ${toc.map(t => `<li><a href="#${t.id}">${t.text}</a></li>`).join('\n                            ')}
                        </ol>
                    </nav>` : ''}
                    <div class="article-body">
${body}
                    </div>

                    <aside class="author-box" aria-label="About the author">
                        <img src="/assets/avatar-360.webp" alt="Qurban Ali" width="72" height="72" loading="lazy">
                        <div>
                            <div class="author-name">Qurban Ali</div>
                            <p>Engineering Team Lead and Senior Full-Stack Developer in Lahore, Pakistan, with 7+ years
                                building AI-powered, FinTech and SaaS products.
                                <a href="/">Portfolio</a> &middot;
                                <a href="https://www.linkedin.com/in/qurbanali-pro/" target="_blank" rel="noopener noreferrer">LinkedIn</a></p>
                        </div>
                    </aside>

                    <aside class="article-cta">
                        <h2>Have a project in mind?</h2>
                        <p>I help teams build AI-powered products, scalable SaaS platforms and strong engineering
                            teams.</p>
                        <a href="/#contact" class="btn btn-primary">Get in touch</a>
                    </aside>
${related.length ? `
                    <section class="related-section" aria-labelledby="related-posts">
                        <h2 id="related-posts">Related articles</h2>
                        <div class="blog-grid">${related.map(R.renderBlogCard).join('')}</div>
                    </section>` : ''}
                </article>
            </div>
        </section>`;

    let html = withScripts(replaceMain(blogShell, main));
    html = applyHead(html, seoHead({
        title: `${post.seoTitle || post.title} | Qurban Ali`,
        description: post.excerpt,
        url,
        image: post.cover || '/assets/og/og-blog.jpg',
        imageAlt: post.coverAlt,
        type: 'article',
        article: { published: post.date, modified, tags: post.tags },
        jsonld: [
            PERSON, WEBSITE,
            {
                '@type': 'BlogPosting',
                '@id': `${abs(url)}#article`,
                headline: post.title,
                description: post.excerpt,
                url: abs(url),
                mainEntityOfPage: abs(url),
                image: post.cover ? { '@type': 'ImageObject', url: abs(post.cover), width: 1200, height: 630 } : undefined,
                datePublished: post.date,
                dateModified: modified,
                author: { '@id': PERSON_ID },
                publisher: { '@id': PERSON_ID },
                isPartOf: { '@id': `${SITE}/blog#blog` },
                inLanguage: 'en',
                keywords: post.tags.join(', '),
                articleSection: post.tags[0],
                wordCount: words,
                timeRequired: `PT${post.readingTime}M`
            },
            breadcrumb([['Home', '/'], ['Blog', '/blog'], [post.title, url]])
        ]
    }));
    write(`blog/${post.slug}.html`, html);
    addToSitemap(url, modified, '0.7', post.cover);
    fullTextForLlms.push(`# ${post.title}\n\nURL: ${abs(url)}\nPublished: ${post.date}${modified !== post.date ? ` (updated ${modified})` : ''}\nAuthor: Qurban Ali\nTags: ${post.tags.join(', ')}\n\n${md.trim()}\n`);
}

// --------------------------------------------------------------------------
// 404 page
// --------------------------------------------------------------------------
{
    const main = `
        <section class="page-hero">
            <div class="container">
                <h1 class="section-title"><span class="title-number">404</span> Page not found</h1>
                <p class="section-subtitle">The page you're looking for doesn't exist or has moved.</p>
                <div class="hero-ctas">
                    <a href="/" class="btn btn-primary">Go to homepage</a>
                    <a href="/projects" class="btn btn-secondary">View projects</a>
                    <a href="/blog" class="btn btn-secondary">Read the blog</a>
                </div>
            </div>
        </section>`;
    let html = withScripts(replaceMain(shell, main));
    html = applyHead(html, seoHead({
        title: 'Page not found | Qurban Ali',
        description: 'This page does not exist or has moved. Visit the homepage, browse projects, or read the latest articles on AI and engineering.',
        url: '/404',
        jsonld: [WEBSITE],
        noindex: true
    }));
    write('404.html', html);
}

// --------------------------------------------------------------------------
// sitemap.xml, rss.xml, robots.txt, llms.txt, llms-full.txt
// --------------------------------------------------------------------------
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${sitemap.map(s => `  <url>
    <loc>${abs(s.url)}</loc>
    <lastmod>${s.lastmod}</lastmod>
    <priority>${s.priority}</priority>${s.image ? `
    <image:image><image:loc>${abs(s.image)}</image:loc></image:image>` : ''}
  </url>`).join('\n')}
</urlset>
`);

const rfc822 = (iso) => new Date(`${iso}T09:00:00Z`).toUTCString();
write('rss.xml', `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Qurban Ali — Blog</title>
    <link>${SITE}/blog</link>
    <description>Notes on AI, software architecture and engineering leadership.</description>
    <language>en</language>
    <atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${rfc822(latestDate)}</lastBuildDate>
${posts.map(p => `    <item>
      <title>${esc(p.title)}</title>
      <link>${abs(R.postUrl(p))}</link>
      <guid isPermaLink="true">${abs(R.postUrl(p))}</guid>
      <pubDate>${rfc822(p.date)}</pubDate>
      <description>${esc(p.excerpt)}</description>
${p.tags.map(t => `      <category>${esc(t)}</category>`).join('\n')}
    </item>`).join('\n')}
  </channel>
</rss>
`);

// AI crawlers are allowed on purpose: the goal is to be found and cited by AI assistants.
write('robots.txt', `# ${SITE}
# Search engines and AI assistants are welcome to crawl and cite this site.

User-agent: *
Allow: /
Disallow: /api/

# AI search and assistant crawlers (explicitly allowed)
User-agent: OAI-SearchBot
User-agent: ChatGPT-User
User-agent: GPTBot
User-agent: PerplexityBot
User-agent: Perplexity-User
User-agent: ClaudeBot
User-agent: Claude-SearchBot
User-agent: Claude-User
User-agent: Google-Extended
User-agent: Applebot-Extended
User-agent: Bingbot
Allow: /
Disallow: /api/

Sitemap: ${SITE}/sitemap.xml
`);

const llms = `# Qurban Ali

> Engineering Team Lead and Senior Full-Stack Developer based in Lahore, Pakistan, with 7+ years of experience building AI-powered platforms (LLM, RAG, semantic search), FinTech systems (NetSuite finance automation, reconciliation) and SaaS products, and leading the engineering teams that build them.

Key facts:
- Current role: Engineering Team Lead at Friday Media Group Pakistan (since May 2022)
- Location: Lahore, Punjab, Pakistan
- Expertise: technical leadership, software architecture, Generative AI and LLM integration, RAG and semantic search (Apache Solr, vector embeddings), FinTech and NetSuite ERP integration, accounts payable automation, full-stack development (React, Vue, Node.js, Laravel, PHP, Python)
- Contact: info@qurbanali.me · ${SITE}/#contact
- LinkedIn: https://www.linkedin.com/in/qurbanali-pro/

## Main pages

- [Home and profile](${SITE}/): About, technical expertise, experience, recommendations, FAQ and contact
- [All projects](${SITE}/projects): ${projects.length} production systems with details
- [Blog](${SITE}/blog): articles on AI, LLM search (GEO), AI agents and engineering leadership

## Projects

${projects.map(p => `- [${p.title}](${abs(R.projectUrl(p))}): ${p.excerpt}`).join('\n')}

## Articles

${posts.map(p => `- [${p.title}](${abs(R.postUrl(p))}): ${p.excerpt}`).join('\n')}

## Optional

- [Full text of all articles](${SITE}/llms-full.txt)
- [RSS feed](${SITE}/rss.xml)
- [Sitemap](${SITE}/sitemap.xml)
`;
write('llms.txt', llms);
write('llms-full.txt', `# Qurban Ali — full article text\n\nSource: ${SITE}/blog\n\n---\n\n${fullTextForLlms.join('\n---\n\n')}`);

console.log(`Built ${sitemap.length} pages (${projects.length} projects, ${posts.length} posts) into dist/`);
