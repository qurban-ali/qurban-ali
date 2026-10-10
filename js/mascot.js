/**
 * Qbot: the site's animated assistant (bottom-right corner).
 * - waves hello, follows the pointer with its eyes, naps when the visitor is idle
 * - explains each section the first time it scrolls into view (and when it's clicked)
 * - reacts to contact-form mistakes with a specific hint, and celebrates a sent message
 * Drawn as inline SVG in the site's own colours; styles live in css/style.css (QBOT section).
 * Public API: window.Qbot.say(text, mood, ms) with mood = idle | happy | worried | thinking | celebrate.
 */
(function () {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const HIDE_KEY = 'qbot-hidden';

    const storage = {
        get(key) { try { return localStorage.getItem(key); } catch { return null; } },
        set(key, value) { try { localStorage.setItem(key, value); } catch { /* private mode */ } },
        remove(key) { try { localStorage.removeItem(key); } catch { /* private mode */ } }
    };

    const SECTION_TIPS = {
        about: 'This is the short version. Tap “Read my full story” for Qurban’s whole journey.',
        skills: 'From AI & LLMs to NetSuite finance automation: this is the toolkit behind every project.',
        projects: 'Click any project for the full breakdown, or “View all projects” for the complete list.',
        experience: '7+ years, from Laravel developer to Engineering Team Lead.',
        recommendations: 'Don’t take my word for it. Here’s what colleagues say about Qurban.',
        blog: 'Fresh articles on AI search, AI agents and engineering leadership.',
        faq: 'Quick answers live here. Tap a question to open it.',
        contact: 'Tell Qurban what you need. I’ll make sure the form is filled in right ✨'
    };

    const CLICK_TIPS = [
        'Need a hand? Use the menu to jump to any section.',
        'Want to talk? You can book a 1-on-1 call from the Contact section.',
        'Tip: Ctrl/Cmd-click a project to open its full page in a new tab.',
        'Qurban usually replies within 1–2 business days.',
        'Curious about AI search? The blog has a full GEO playbook.'
    ];

    // Friendly, field-specific hints for the contact form.
    function fieldHint(field) {
        const v = field.validity;
        const value = (field.value || '').trim();
        switch (field.id) {
            case 'form-name':
                return 'I’ll need your name first 🙂';
            case 'form-email':
                if (v.valueMissing) return 'Your email is missing. How else will Qurban reply?';
                return `Hmm, “${value.slice(0, 40)}” doesn’t look like an email. Try name@company.com`;
            case 'form-service':
                return 'Pick a service from the list, or choose “Other” if it isn’t there.';
            case 'form-other-service':
                return 'You chose “Other”. Tell me which service you need.';
            case 'form-message':
                return 'Add a short message so Qurban knows how to help.';
            default:
                return field.validationMessage || 'Something in the form needs another look.';
        }
    }

    const SVG = `
<svg class="qbot-svg" viewBox="0 0 120 132" aria-hidden="true" focusable="false">
  <defs>
    <linearGradient id="qbot-body" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" class="qbot-stop-a"/><stop offset="1" class="qbot-stop-b"/>
    </linearGradient>
  </defs>
  <ellipse class="qbot-shadow" cx="60" cy="126" rx="26" ry="4"/>
  <g class="qbot-figure">
    <g class="qbot-antenna">
      <line x1="60" y1="24" x2="60" y2="10"/>
      <circle class="qbot-antenna-light" cx="60" cy="8" r="5"/>
    </g>
    <g class="qbot-arm qbot-arm-left"><rect x="12" y="88" width="12" height="26" rx="6"/></g>
    <g class="qbot-arm qbot-arm-right"><rect x="96" y="88" width="12" height="26" rx="6"/></g>
    <rect class="qbot-torso" x="30" y="86" width="60" height="36" rx="16"/>
    <circle class="qbot-core" cx="60" cy="104" r="6"/>
    <rect class="qbot-head" x="16" y="22" width="88" height="66" rx="28"/>
    <rect class="qbot-screen" x="26" y="33" width="68" height="44" rx="18"/>
    <g class="qbot-face">
      <g class="qbot-eyes qbot-eyes-open">
        <rect x="41" y="44" width="11" height="17" rx="5.5"/>
        <rect x="68" y="44" width="11" height="17" rx="5.5"/>
      </g>
      <g class="qbot-eyes qbot-eyes-happy">
        <path d="M40 56 q6 -9 12 0"/><path d="M68 56 q6 -9 12 0"/>
      </g>
      <g class="qbot-eyes qbot-eyes-closed">
        <path d="M40 54 q6 5 12 0"/><path d="M68 54 q6 5 12 0"/>
      </g>
      <g class="qbot-brows"><path d="M39 41 l13 4"/><path d="M81 41 l-13 4"/></g>
      <circle class="qbot-cheek" cx="36" cy="64" r="4"/>
      <circle class="qbot-cheek" cx="84" cy="64" r="4"/>
      <path class="qbot-mouth qbot-mouth-smile" d="M53 66 q7 6 14 0"/>
      <ellipse class="qbot-mouth qbot-mouth-o" cx="60" cy="68" rx="4" ry="4.5"/>
      <path class="qbot-mouth qbot-mouth-flat" d="M54 68 h12"/>
    </g>
  </g>
  <g class="qbot-zzz"><text x="94" y="20">z</text><text x="102" y="10">z</text></g>
</svg>`;

    function build() {
        const root = document.createElement('div');
        root.className = 'qbot';
        root.dataset.mood = 'idle';
        root.innerHTML = `
            <div class="qbot-bubble" role="status" aria-live="polite" hidden>
                <span class="qbot-name">Qbot</span>
                <p class="qbot-text"></p>
                <button type="button" class="qbot-bubble-close" aria-label="Dismiss message">&times;</button>
            </div>
            <button type="button" class="qbot-avatar" aria-label="Qbot, Qurban’s assistant. Click for a tip.">${SVG}</button>
            <button type="button" class="qbot-hide" aria-label="Hide assistant" title="Hide assistant">&minus;</button>`;
        const restore = document.createElement('button');
        restore.type = 'button';
        restore.className = 'qbot-restore';
        restore.textContent = 'Show Qbot';
        restore.hidden = true;
        document.body.append(root, restore);
        return { root, restore };
    }

    document.addEventListener('DOMContentLoaded', () => {
        const { root, restore } = build();
        const bubble = root.querySelector('.qbot-bubble');
        const text = root.querySelector('.qbot-text');
        const avatar = root.querySelector('.qbot-avatar');
        const eyes = root.querySelector('.qbot-eyes-open');

        let hideTimer, moodTimer, idleTimer;
        let lockedUntil = 0;        // errors stay visible over casual tips for a moment
        let tipIndex = 0;

        // ------------------------------------------------------------------
        // Speaking & moods
        // ------------------------------------------------------------------
        function setMood(mood, ms) {
            root.dataset.mood = mood;
            clearTimeout(moodTimer);
            if (ms) moodTimer = setTimeout(() => { root.dataset.mood = 'idle'; }, ms);
        }

        function say(message, mood = 'happy', ms = 6000, { priority = false } = {}) {
            if (root.hidden) return;
            if (!priority && Date.now() < lockedUntil) return;
            if (priority) lockedUntil = Date.now() + 3500;
            wake();
            text.textContent = message;
            bubble.dataset.tone = mood;
            bubble.hidden = false;
            requestAnimationFrame(() => bubble.classList.add('show'));
            setMood(mood, ms);
            clearTimeout(hideTimer);
            hideTimer = setTimeout(dismiss, ms);
        }

        function dismiss() {
            bubble.classList.remove('show');
            clearTimeout(hideTimer);
            hideTimer = setTimeout(() => { bubble.hidden = true; }, 250);
        }

        function celebrate(message) {
            say(message, 'celebrate', 7000, { priority: true });
            if (reducedMotion) return;
            const colors = ['var(--accent-indigo)', 'var(--accent-teal)', 'var(--accent-pink)'];
            for (let i = 0; i < 22; i++) {
                const bit = document.createElement('span');
                bit.className = 'qbot-confetti';
                bit.style.setProperty('--x', `${Math.round(Math.random() * 220 - 160)}px`);
                bit.style.setProperty('--y', `${Math.round(-120 - Math.random() * 140)}px`);
                bit.style.setProperty('--r', `${Math.round(Math.random() * 540)}deg`);
                bit.style.background = colors[i % colors.length];
                bit.style.animationDelay = `${Math.random() * 120}ms`;
                root.appendChild(bit);
                setTimeout(() => bit.remove(), 1400);
            }
        }

        // ------------------------------------------------------------------
        // Idle nap & waking up
        // ------------------------------------------------------------------
        function wake() {
            if (root.dataset.mood === 'sleep') root.dataset.mood = 'idle';
            clearTimeout(idleTimer);
            idleTimer = setTimeout(() => {
                if (bubble.hidden) root.dataset.mood = 'sleep';
            }, 45000);
        }
        ['pointerdown', 'keydown', 'scroll', 'pointermove'].forEach(evt =>
            window.addEventListener(evt, () => { if (root.dataset.mood === 'sleep') wake(); }, { passive: true }));
        wake();

        // ------------------------------------------------------------------
        // Eyes follow the pointer (mouse / pen only)
        // ------------------------------------------------------------------
        let frame;
        window.addEventListener('pointermove', (e) => {
            if (e.pointerType === 'touch' || reducedMotion || frame) return;
            frame = requestAnimationFrame(() => {
                frame = null;
                const box = avatar.getBoundingClientRect();
                const dx = e.clientX - (box.left + box.width / 2);
                const dy = e.clientY - (box.top + box.height * 0.4);
                const dist = Math.hypot(dx, dy) || 1;
                const reach = Math.min(1, dist / 300);
                eyes.style.transform = `translate(${(dx / dist) * 3.5 * reach}px, ${(dy / dist) * 3 * reach}px)`;
            });
        }, { passive: true });

        // ------------------------------------------------------------------
        // Controls: click for tips, dismiss bubble, hide / restore
        // ------------------------------------------------------------------
        avatar.addEventListener('click', () => {
            say(CLICK_TIPS[tipIndex++ % CLICK_TIPS.length], 'happy', 6000, { priority: true });
            if (!reducedMotion) {
                root.classList.remove('qbot-bounce');
                void root.offsetWidth;
                root.classList.add('qbot-bounce');
            }
        });
        root.querySelector('.qbot-bubble-close').addEventListener('click', dismiss);

        function setHidden(hidden) {
            root.hidden = hidden;
            restore.hidden = !hidden;
            if (hidden) storage.set(HIDE_KEY, '1'); else storage.remove(HIDE_KEY);
        }
        root.querySelector('.qbot-hide').addEventListener('click', () => setHidden(true));
        restore.addEventListener('click', () => {
            setHidden(false);
            say('I’m back! Click me any time for a tip.', 'happy', 4000);
        });
        if (storage.get(HIDE_KEY)) setHidden(true);

        // ------------------------------------------------------------------
        // Greeting per page
        // ------------------------------------------------------------------
        const path = location.pathname.replace(/\/+$/, '') || '/';
        let greeting = 'Hi! I’m Qbot, Qurban’s assistant 👋 Scroll around and I’ll point out the good stuff.';
        if (document.querySelector('.breadcrumbs') && path.startsWith('/blog/')) {
            greeting = document.querySelector('.article-toc')
                ? 'Long read? Use “In this article” to jump straight to a section.'
                : 'Enjoy the read! There’s a contact link at the end if you want to chat.';
        } else if (path.startsWith('/projects/')) {
            greeting = 'Here’s the full story of this project. Related ones are at the bottom.';
        } else if (path === '/projects') {
            greeting = 'Search by name or technology. Try “NetSuite” or “RAG”.';
        } else if (path === '/blog') {
            greeting = 'Pick a topic or search. Every article has a table of contents.';
        } else if (document.querySelector('.page-hero h1')?.textContent.includes('Page not found')) {
            greeting = 'Looks like this page wandered off. Let’s get you back home.';
            setTimeout(() => setMood('worried', 5000), 900);
        }
        if (!reducedMotion) root.classList.add('qbot-wave');
        setTimeout(() => say(greeting, 'happy', 6500), 1200);

        // ------------------------------------------------------------------
        // Section tips: when a home section first comes into view, or on click
        // ------------------------------------------------------------------
        const seen = new Set();
        let lastClickTip = 0;
        const sections = Object.keys(SECTION_TIPS).map(id => document.getElementById(id)).filter(Boolean);
        if (sections.length && 'IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting || seen.has(entry.target.id)) return;
                    seen.add(entry.target.id);
                    say(SECTION_TIPS[entry.target.id], 'happy', 5500);
                });
            }, { threshold: 0.35 });
            setTimeout(() => sections.forEach(s => observer.observe(s)), 2500);

            document.addEventListener('click', (e) => {
                if (e.target.closest('a, button, input, textarea, select, summary, label, .project-card, .blog-card, .qbot, .modal-overlay')) return;
                const section = e.target.closest('section[id]');
                if (!section || !SECTION_TIPS[section.id] || Date.now() - lastClickTip < 4000) return;
                lastClickTip = Date.now();
                say(SECTION_TIPS[section.id], 'happy', 5500);
            });
        }

        // ------------------------------------------------------------------
        // Contact form: specific hints instead of the browser's default tooltips
        // ------------------------------------------------------------------
        const form = document.getElementById('contact-form');
        if (form) {
            let pending = null;
            form.addEventListener('invalid', (e) => {
                const field = e.target;
                e.preventDefault();                      // replace the browser tooltip with Qbot
                field.classList.add('is-invalid');
                field.setAttribute('aria-invalid', 'true');
                if (!pending) {
                    pending = field;
                    setTimeout(() => {
                        say(fieldHint(pending), 'worried', 6000, { priority: true });
                        pending.focus({ preventScroll: false });
                        pending = null;
                    }, 0);
                }
            }, true);

            form.addEventListener('input', (e) => {
                const field = e.target;
                if (field.classList.contains('is-invalid') && field.checkValidity()) {
                    field.classList.remove('is-invalid');
                    field.removeAttribute('aria-invalid');
                }
            });

            // Gentle check when leaving the email field
            const email = document.getElementById('form-email');
            email?.addEventListener('blur', () => {
                if (email.value.trim() && email.validity.typeMismatch) {
                    email.classList.add('is-invalid');
                    say(fieldHint(email), 'worried', 5500, { priority: true });
                }
            });

            // Encouragement the first time the visitor starts writing a message
            const message = document.getElementById('form-message');
            message?.addEventListener('input', function onFirstInput() {
                message.removeEventListener('input', onFirstInput);
                say('Nice! Details help Qurban reply faster. Take your time.', 'thinking', 4500);
            });

            // Success and server errors (app.js toggles these elements)
            const success = document.getElementById('form-success');
            const error = document.getElementById('form-error');
            new MutationObserver(() => {
                if (success.classList.contains('active')) {
                    celebrate('Message sent! 🎉 Check your inbox for a confirmation email.');
                }
            }).observe(success, { attributes: true, attributeFilter: ['class'] });
            new MutationObserver(() => {
                if (error.classList.contains('active') && error.textContent.trim()) {
                    say('Oops, that didn’t go through. Please try again in a minute, or email info@qurbanali.me.', 'worried', 8000, { priority: true });
                }
            }).observe(error, { attributes: true, attributeFilter: ['class'] });
        }

        // ------------------------------------------------------------------
        // Listing pages: empty search results
        // ------------------------------------------------------------------
        ['projects', 'blog'].forEach(kind => {
            const count = document.getElementById(`${kind}-count`);
            const search = document.getElementById(`${kind}-search`);
            if (!count || !search) return;
            new MutationObserver(() => {
                if (/^Showing 0 /.test(count.textContent) && search.value.trim()) {
                    say(`No matches for “${search.value.trim().slice(0, 30)}”. Try a broader word like “AI” or “Laravel”.`, 'worried', 5000, { priority: true });
                }
            }).observe(count, { childList: true, characterData: true, subtree: true });
        });

        window.Qbot = { say, celebrate, dismiss };
    });
})();
