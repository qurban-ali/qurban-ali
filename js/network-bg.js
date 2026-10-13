/**
 * Animated constellation background.
 * Drifting nodes that link to nearby nodes (and to the cursor) with fading lines.
 */
(() => {
    const canvas = document.getElementById('network-bg');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const COLORS = ['99, 102, 241', '20, 184, 166', '217, 70, 239']; // indigo, teal, pink
    const LINK_DIST = 140;
    const MOUSE_DIST = 200;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width, height, dpr, nodes = [], rafId = null;
    const mouse = { x: null, y: null };

    function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        // Density scales with screen area; capped for performance
        const count = Math.min(Math.floor((width * height) / 11000), 140);
        nodes = Array.from({ length: count }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.35,
            vy: (Math.random() - 0.5) * 0.35,
            r: Math.random() * 1.6 + 0.8,
            color: COLORS[Math.floor(Math.random() * COLORS.length)]
        }));
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);

        for (const n of nodes) {
            n.x += n.vx;
            n.y += n.vy;
            if (n.x < 0 || n.x > width) n.vx *= -1;
            if (n.y < 0 || n.y > height) n.vy *= -1;
        }

        // Node-to-node links
        for (let i = 0; i < nodes.length; i++) {
            const a = nodes[i];
            for (let j = i + 1; j < nodes.length; j++) {
                const b = nodes[j];
                const dx = a.x - b.x, dy = a.y - b.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < LINK_DIST) {
                    const alpha = (1 - dist / LINK_DIST) * 0.5;
                    const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
                    grad.addColorStop(0, `rgba(${a.color}, ${alpha})`);
                    grad.addColorStop(1, `rgba(${b.color}, ${alpha})`);
                    ctx.strokeStyle = grad;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            }

            // Cursor links + gentle attraction
            if (mouse.x !== null) {
                const dx = mouse.x - a.x, dy = mouse.y - a.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < MOUSE_DIST) {
                    ctx.strokeStyle = `rgba(${a.color}, ${(1 - dist / MOUSE_DIST) * 0.6})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                    a.x += dx * 0.003;
                    a.y += dy * 0.003;
                }
            }
        }

        // Nodes with soft glow
        for (const n of nodes) {
            ctx.beginPath();
            ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${n.color}, 0.9)`;
            ctx.shadowColor = `rgba(${n.color}, 0.8)`;
            ctx.shadowBlur = 8;
            ctx.fill();
        }
        ctx.shadowBlur = 0;

        rafId = reduceMotion ? null : requestAnimationFrame(draw);
    }

    function start() {
        if (!rafId) rafId = requestAnimationFrame(draw);
    }

    function stop() {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;
    }

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => { resize(); if (reduceMotion) draw(); }, 150);
    });
    window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
    document.addEventListener('mouseleave', () => { mouse.x = mouse.y = null; });
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) stop();
        else if (!reduceMotion) start();
    });

    resize();
    reduceMotion ? draw() : start();
})();
