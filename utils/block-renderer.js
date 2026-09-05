// block-renderer.js
// =========================================================================
// Viewman Block Editor — SHARED RENDERER
// Same file is used to draw the admin preview AND the published site.
// It must have ZERO dependency on Alpine.js or admin-only globals.
// It MAY optionally use globals that exist only on the published site
// (window.loadImageGallery, window.openLightbox, window.showContent) —
// those are always guarded with `typeof x === 'function'` checks so the
// exact same file works, degraded but safe, inside the admin preview.
// =========================================================================
(function (global) {
    'use strict';

    var CURRENT_VERSION = 1;

    // ---------------------------------------------------------------
    // Small helpers (deliberately self-contained — no admin.js reuse)
    // ---------------------------------------------------------------
    function escapeHtml(str) {
        if (typeof str !== 'string') return '';
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function escapeAttr(str) {
        return escapeHtml(str == null ? '' : String(str));
    }

    // Very small curated icon sets. The data model stores {library, name}
    // so any future library can be added here without touching block data.
    var TABLER_ICONS = {
        // --- reused verbatim from elsewhere in this admin (guaranteed-correct paths) ---
        'arrow-right': '<path d="M5 12l14 0" /><path d="M13 18l6 -6" /><path d="M13 6l6 6" />',
        'arrow-left': '<path d="M5 12l14 0" /><path d="M11 18l-6 -6" /><path d="M11 6l-6 6" />',
        'external-link': '<path d="M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6" /><path d="M11 13l9 -9" /><path d="M15 4h5v5" />',
        'download': '<path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" /><path d="M7 11l5 5l5 -5" /><path d="M12 4l0 12" />',
        'world': '<path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M3.6 9h16.8" /><path d="M3.6 15h16.8" /><path d="M11.5 3a17 17 0 0 0 0 18" /><path d="M12.5 3a17 17 0 0 1 0 18" />',
        'cloud-upload': '<path d="M7 18a4.6 4.4 0 0 1 0 -9a5 4.5 0 0 1 11 2h1a3.5 3.5 0 0 1 0 7h-1" /><path d="M9 15l3 -3l3 3" /><path d="M12 12l0 9" />',
        'settings': '<path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065" /><path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />',
        'brush': '<path d="M3 21v-4a4 4 0 1 1 4 4h-4" /><path d="M21 3a16 16 0 0 0 -12.8 10.2" /><path d="M21 3a16 16 0 0 1 -10.2 12.8" /><path d="M10.6 9a9 9 0 0 1 4.4 4.4" />',
        'adjustments': '<path d="M4 10a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M6 4v4" /><path d="M6 12v8" /><path d="M10 16a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M12 4v10" /><path d="M12 18v2" /><path d="M16 7a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M18 4v1" /><path d="M18 9v11" />',
        'photo-scan': '<path d="M15 8h.01" /><path d="M6 13l2.644 -2.644a1.21 1.21 0 0 1 1.712 0l3.644 3.644" /><path d="M13 13l1.644 -1.644a1.21 1.21 0 0 1 1.712 0l1.644 1.644" /><path d="M3 7v-2a2 2 0 0 1 2 -2h2" /><path d="M3 17v2a2 2 0 0 0 2 2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" /><path d="M17 21h2a2 2 0 0 0 2 -2v-2" />',
        'text-size': '<path d="M3 7v-2h13v2" /><path d="M10 5v14" /><path d="M12 19h-4" /><path d="M15 13v-1h6v1" /><path d="M18 12v7" /><path d="M17 19h2" />',
        'layout-grid': '<path d="M4 6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v1a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2l0 -1" /><path d="M4 15a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v3a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2l0 -3" /><path d="M14 6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v3a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2l0 -3" /><path d="M14 17a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v1a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2l0 -1" />',
        'code-asterisk': '<path d="M6 19a2 2 0 0 1 -2 -2v-4l-1 -1l1 -1v-4a2 2 0 0 1 2 -2" /><path d="M12 11.875l3 -1.687" /><path d="M12 11.875v3.375" /><path d="M12 11.875l-3 -1.687" /><path d="M12 11.875l3 1.688" /><path d="M12 8.5v3.375" /><path d="M12 11.875l-3 1.688" /><path d="M18 19a2 2 0 0 0 2 -2v-4l1 -1l-1 -1v-4a2 2 0 0 0 -2 -2" />',
        'link': '<path d="M9 15l6 -6" /><path d="M11 6l.463 -.536a5 5 0 0 1 7.072 0a4.993 4.993 0 0 1 -.001 7.072" /><path d="M12.603 18.534a5.07 5.07 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463" />',
        'align-left': '<path d="M4 4v16" /><path d="M8 6h12" /><path d="M8 12h6" /><path d="M8 18h10" />',
        'align-center': '<path d="M4 6l16 0" /><path d="M8 12l8 0" /><path d="M6 18l12 0" />',
        'align-right': '<path d="M20 4v16" /><path d="M4 6h12" /><path d="M10 12h6" /><path d="M6 18h10" />',
        'trash': '<path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />',
        'edit': '<path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" /><path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" /><path d="M16 5l3 3" />',
        'maximize': '<path d="M4 8v-2a2 2 0 0 1 2 -2h2" /><path d="M4 16v2a2 2 0 0 0 2 2h2" /><path d="M16 4h2a2 2 0 0 1 2 2v2" /><path d="M16 20h2a2 2 0 0 0 2 -2v-2" />',
        'eye-question': '<path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M14.071 17.764a8.989 8.989 0 0 1 -2.071 .236c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.346 0 6.173 1.727 8.482 5.182" /><path d="M19 22v.01" /><path d="M19 19a2.003 2.003 0 0 0 .914 -3.782a1.98 1.98 0 0 0 -2.414 .483" />',

        // --- additional common, everyday icons ---
        'star': '<path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" />',
        'check': '<path d="M5 12l5 5l10 -10" />',
        'x': '<path d="M18 6l-12 12" /><path d="M6 6l12 12" />',
        'plus': '<path d="M12 5l0 14" /><path d="M5 12l14 0" />',
        'minus': '<path d="M5 12l14 0" />',
        'mail': '<path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z" /><path d="M3 7l9 6l9 -6" />',
        'phone': '<path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" />',
        'home': '<path d="M5 12l-2 0l9 -9l9 9l-2 0" /><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" /><path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />',
        'user': '<path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" /><path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />',
        'users': '<path d="M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" /><path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /><path d="M21 21v-2a4 4 0 0 0 -3 -3.85" />',
        'heart': '<path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />',
        'search': '<path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" /><path d="M21 21l-6 -6" />',
        'calendar': '<path d="M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12z" /><path d="M16 3v4" /><path d="M8 3v4" /><path d="M4 11h16" /><path d="M11 15h1" /><path d="M12 15v3" />',
        'clock': '<path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M12 7v5l3 3" />',
        'map-pin': '<path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" /><path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z" />',
        'lock': '<path d="M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-6z" /><path d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" /><path d="M8 11v-4a4 4 0 1 1 8 0v4" />',
        'flag': '<path d="M5 21v-16a1 1 0 0 1 1 -1h10.586a1 1 0 0 1 .707 1.707l-4.293 4.293l4.293 4.293a1 1 0 0 1 -.707 1.707h-11.586" />',
        'gift': '<path d="M3 8m0 1a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1z" /><path d="M12 8l0 13" /><path d="M19 12l0 7a2 2 0 0 1 -2 2l-10 0a2 2 0 0 1 -2 -2l0 -7" /><path d="M7.5 8a2.5 2.5 0 0 1 0 -5c1.5 0 3 1.5 4.5 5c1.5 -3.5 3 -5 4.5 -5a2.5 2.5 0 0 1 0 5" />',
        'thumb-up': '<path d="M7 11v8a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-7a1 1 0 0 1 1 -1h3a4 4 0 0 0 4 -4v-1a2 2 0 0 1 4 0v5h3a2 2 0 0 1 2 2l-1 5a2 3 0 0 1 -2 2h-7a3 3 0 0 1 -3 -3" />',
        'share': '<path d="M6 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M18 6m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M18 18m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M8.7 10.7l6.6 -3.4" /><path d="M8.7 13.3l6.6 3.4" />',
        'printer': '<path d="M17 17h2a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2h-14a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h2" /><path d="M17 9v-4a2 2 0 0 0 -2 -2h-6a2 2 0 0 0 -2 2v4" /><path d="M7 13m0 2a2 2 0 0 1 2 -2h6a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-6a2 2 0 0 1 -2 -2z" />',
        'camera': '<path d="M5 7h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2" /><path d="M12 13m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />',
        'book': '<path d="M3 19a9 9 0 0 1 9 0a9 9 0 0 1 9 0" /><path d="M3 6a9 9 0 0 1 9 0a9 9 0 0 1 9 0" /><path d="M3 6l0 13" /><path d="M12 6l0 13" /><path d="M21 6l0 13" />',
        'briefcase': '<path d="M3 7m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" /><path d="M8 7v-2a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v2" /><path d="M12 12l0 .01" /><path d="M3 13a20 20 0 0 0 18 0" />',
        'info-circle': '<path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M12 9h.01" /><path d="M11 12h1v4h1" />',
        'alert-triangle': '<path d="M12 9v4" /><path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0z" /><path d="M12 16h.01" />',
        'chevron-right': '<path d="M9 6l6 6l-6 6" />',
        'chevron-down': '<path d="M6 9l6 6l6 -6" />',
        'bolt': '<path d="M13 3l0 7l6 0l-8 11l0 -7l-6 0l8 -11" />',
        'shield-check': '<path d="M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3" /><path d="M9 12l2 2l4 -4" />',
        'quote': '<path d="M10 11h-4a1 1 0 0 1 -1 -1v-3a1 1 0 0 1 1 -1h3a1 1 0 0 1 1 1v6c0 2.667 -1.333 4.333 -4 5" /><path d="M19 11h-4a1 1 0 0 1 -1 -1v-3a1 1 0 0 1 1 -1h3a1 1 0 0 1 1 1v6c0 2.667 -1.333 4.333 -4 5" />',
        'video': '<path d="M15 10l4.553 -2.276a1 1 0 0 1 1.447 .894v6.764a1 1 0 0 1 -1.447 .894l-4.553 -2.276v-4z" /><path d="M3 6m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z" />',
        'photo': '<path d="M15 8h.01" /><path d="M4 4h16a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1v-14a1 1 0 0 1 1 -1z" /><path d="M4 15l4 -4a3 5 0 0 1 3 0l5 5" /><path d="M14 14l1 -1a3 5 0 0 1 3 0l2 2" />'
    };
    // Font Awesome is only loaded on the published site (src/fontawesome).
    // In admin preview the class simply won't resolve visually — the name
    // is still stored and rendered as a class so nothing is lost.
    function renderIcon(icon, extraClass) {
        if (!icon || !icon.name) return '';
        var cls = 'vb-icon' + (extraClass ? ' ' + extraClass : '');
        if (icon.library === 'fontawesome') {
            return '<i class="' + cls + ' fas fa-' + escapeAttr(icon.name) + '" aria-hidden="true"></i>';
        }
        // default: tabler
        var body = TABLER_ICONS[icon.name];
        if (!body) {
            // Unknown tabler icon name — keep a harmless generic glyph,
            // the name itself is preserved in the block data untouched.
            body = '<circle cx="12" cy="12" r="1" />';
        }
        return '<svg class="' + cls + '" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" ' +
            'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
            '<path stroke="none" d="M0 0h24v24H0z" fill="none"/>' + body + '</svg>';
    }

    // ---------------------------------------------------------------
    // One-time stylesheet injection (grid + block base styles).
    // Colors/spacing intentionally reuse the site's own CSS variables
    // (--accent-color, --text-color, etc.) so no new design system is
    // introduced — see task constraint "не делать themes".
    // ---------------------------------------------------------------
    function ensureStyles(doc) {
        doc = doc || document;
        if (doc.getElementById('vb-block-styles')) return;
        var css = ''
            + '.vb-blocks{display:grid;grid-template-columns:repeat(12,1fr);gap:1.75rem 1.5rem;width:100%;box-sizing:border-box;}'
            + '.vb-block{grid-column:span var(--vb-w-mobile,12);min-width:0;box-sizing:border-box;}'
            + '@media (min-width:769px) and (max-width:1024px){.vb-block{grid-column:span var(--vb-w-tablet,12);}}'
            + '@media (min-width:1025px){.vb-block{grid-column:span var(--vb-w-desktop,12);}}'
            + '.vb-page-container{width:100%;box-sizing:border-box;}'
            + '.vb-block-text{line-height:var(--paragraph-line-height,1.6);}'
            + '.vb-block-text p{margin:0 0 var(--paragraph-margin-bottom,1em) 0;}'
            + '.vb-block-text p:last-child{margin-bottom:0;}'
            + '.vb-block-text a{color:var(--accent-color);text-decoration:var(--prose-link-text-decoration,underline);}'
            + '.vb-block-text mark{background:var(--vb-mark-bg,#fff3a0);color:inherit;padding:0 .15em;}'
            + '.vb-block-text .vb-size-small{font-size:.85em;}'
            + '.vb-block-text .vb-size-large{font-size:1.25em;}'
            + '.vb-block-text .vb-size-xlarge{font-size:1.6em;}'
            + '.vb-block-image{margin:0;}'
            + '.vb-block-image img{max-width:100%;height:auto;display:block;border-radius:0;}'
            + '.vb-block-image.vb-align-center{text-align:center;}'
            + '.vb-block-image.vb-align-center img{margin-left:auto;margin-right:auto;}'
            + '.vb-block-image.vb-align-right{text-align:right;}'
            + '.vb-block-image.vb-align-right img{margin-left:auto;}'
            + '.vb-block-image img.vb-w-25{max-width:25%;}'
            + '.vb-block-image img.vb-w-50{max-width:50%;}'
            + '.vb-block-image img.vb-w-75{max-width:75%;}'
            + '.vb-image-caption{margin-top:.5rem;font-size:.85rem;color:var(--text-color);opacity:.75;}'
            + '.vb-block-gallery-placeholder{border:1px dashed var(--menu-border,#ccc);border-radius:6px;padding:1.5rem;text-align:center;color:var(--text-color);opacity:.7;}'
            + '.vb-block-button{display:flex;}'
            + '.vb-block-button.vb-align-center{justify-content:center;}'
            + '.vb-block-button.vb-align-right{justify-content:flex-end;}'
            + '.vb-btn{display:inline-flex;align-items:center;gap:.5em;text-decoration:none;}'
            + '.vb-btn.vb-size-small{font-size:.8rem;padding:.35rem .9rem !important;}'
            + '.vb-btn.vb-size-large{font-size:1.15rem;padding:.75rem 1.75rem !important;}'
            + '.vb-block-video{width:100%;}'
            // Соотношение сторон задаётся per-instance через --vb-aspect (см. renderVideo()) —
            // 16/9 здесь только запасное значение на случай, если переменная не пришла.
            + '.vb-video-frame{position:relative;overflow:hidden;background:#000;aspect-ratio:var(--vb-aspect,16/9);}'
            + '.vb-video-frame iframe,.vb-video-frame video{position:absolute;top:0;left:0;width:100%;height:100%;border:0;}'
            + '.vb-block-html{width:100%;}'
            + '.vb-block-imagetext,.vb-block-textimage{display:flex;gap:1.5rem;align-items:center;flex-wrap:wrap;}'
            + '.vb-block-imagetext .vb-it-img,.vb-block-textimage .vb-it-img{flex:1 1 280px;min-width:0;}'
            + '.vb-block-imagetext .vb-it-text,.vb-block-textimage .vb-it-text{flex:1 1 280px;min-width:0;}'
            + '.vb-block-textimage{flex-direction:row-reverse;}'
            + '.vb-block-imagetext.vb-valign-top,.vb-block-textimage.vb-valign-top{align-items:flex-start;}'
            + '.vb-block-imagetext.vb-valign-center,.vb-block-textimage.vb-valign-center{align-items:center;}'
            + '.vb-block-imagetext.vb-valign-bottom,.vb-block-textimage.vb-valign-bottom{align-items:flex-end;}'
            + '@media (max-width:600px){.vb-block-imagetext,.vb-block-textimage{align-items:flex-start !important;}}'
            + '.vb-block-imagetext img,.vb-block-textimage img{width:100%;height:auto;display:block;}'
            + '.vb-block-card{border:1px solid var(--menu-border,#e5e5e5);border-radius:8px;overflow:hidden;height:100%;display:flex;flex-direction:column;}'
            + '.vb-block-card img{width:100%;height:auto;display:block;}'
            + '.vb-card-body{padding:1.25rem;flex:1;display:flex;flex-direction:column;gap:.5rem;}'
            + '.vb-card-body h3{margin:0;font-size:var(--h3-font-size,1.3rem);}'
            + '.vb-block-feature,.vb-block-callout{display:flex;gap:1rem;align-items:flex-start;}'
            + '.vb-block-callout{background:var(--menu-bg,#f5f5f5);border-radius:8px;padding:1.25rem;}'
            + '.vb-feature-icon,.vb-callout-icon{flex:0 0 auto;color:var(--accent-color);}'
            + '.vb-feature-icon svg,.vb-callout-icon svg{width:32px;height:32px;}'
            + '.vb-feature-body h4,.vb-callout-body h4{margin:0 0 .35rem 0;font-size:1.1rem;}'
            + '.vb-block-quote{border-left:4px solid var(--accent-color);padding-left:1.5em;font-style:italic;}'
            + '.vb-quote-author{display:block;margin-top:.5rem;font-style:normal;font-weight:600;opacity:.75;}'
            + '.vb-block-spacer{width:100%;}'
            + '.vb-block-spacer.vb-size-small{height:1rem;}'
            + '.vb-block-spacer.vb-size-medium{height:2.5rem;}'
            + '.vb-block-spacer.vb-size-large{height:5rem;}'
            + '.vb-block-divider hr{border:none;border-top:1px solid var(--menu-border,#ccc);margin:0;}'
            + '.vb-warning-banner{display:flex;gap:.75rem;align-items:flex-start;background:#fef3c7;border:1px solid #fde68a;color:#92400e;border-radius:6px;padding:1rem;margin-bottom:1.5rem;font-size:.95rem;line-height:1.5;}'
            + '.vb-warning-banner strong{display:block;margin-bottom:.15rem;}'
            ;
        var styleEl = doc.createElement('style');
        styleEl.id = 'vb-block-styles';
        styleEl.textContent = css;
        doc.head.appendChild(styleEl);
    }

    // ---------------------------------------------------------------
    // Width -> inline style (CSS custom properties consumed by the
    // stylesheet above)
    // ---------------------------------------------------------------
    function widthStyle(block) {
        var w = block.width || {};
        var d = clampCol(w.desktop, 12);
        var t = clampCol(w.tablet != null ? w.tablet : w.desktop, d);
        var m = clampCol(w.mobile, 12);
        return 'style="--vb-w-desktop:' + d + ';--vb-w-tablet:' + t + ';--vb-w-mobile:' + m + ';"';
    }
    // Same as widthStyle() but returns bare CSS declarations (no style="" wrapper)
    // so callers that need extra per-block inline declarations (e.g. the button
    // block's vertical align) can append to the same style attribute.
    function widthStyleVars(block) {
        var w = block.width || {};
        var d = clampCol(w.desktop, 12);
        var t = clampCol(w.tablet != null ? w.tablet : w.desktop, d);
        var m = clampCol(w.mobile, 12);
        return '--vb-w-desktop:' + d + ';--vb-w-tablet:' + t + ';--vb-w-mobile:' + m + ';';
    }
    function clampCol(v, def) {
        v = parseInt(v, 10);
        if (isNaN(v) || v < 1) v = def;
        if (v > 12) v = 12;
        return v;
    }

    // ---------------------------------------------------------------
    // ctx shape (all optional, sane defaults applied):
    // {
    //   mode: 'site' | 'admin',
    //   imageRootPath: './pictures/',
    //   resolveImage: (relPath) => src,          // default: identity
    //   galleriesData: [...siteConfig.galleriesData],
    //   translate: (blockId, field, fallback) => string   // default: fallback
    //   pageId: 'text_page_id' (used for lightbox/gallery wiring on site)
    // }
    // ---------------------------------------------------------------
    function normalizeCtx(ctx) {
        ctx = ctx || {};
        return {
            mode: ctx.mode === 'admin' ? 'admin' : 'site',
            resolveImage: typeof ctx.resolveImage === 'function' ? ctx.resolveImage : function (p) { return p || ''; },
            galleriesData: ctx.galleriesData || [],
            translate: typeof ctx.translate === 'function' ? ctx.translate : function (blockId, field, fallback) { return fallback; },
            pageId: ctx.pageId || ''
        };
    }

    function t(ctx, block, field, fallback) {
        return ctx.translate(block.id, field, fallback == null ? '' : fallback);
    }

    // ---------------------------------------------------------------
    // Per-block renderers
    // ---------------------------------------------------------------
    function renderText(block, ctx) {
        var html = t(ctx, block, 'html', (block.data && block.data.html) || '');
        return '<div class="vb-block vb-block-text" ' + widthStyle(block) + ' data-block-id="' + escapeAttr(block.id) + '">' + html + '</div>';
    }

    function renderImage(block, ctx) {
        var d = block.data || {};
        var alt = t(ctx, block, 'alt', d.alt || '');
        var caption = t(ctx, block, 'caption', d.caption || '');
        var src = ctx.resolveImage(d.src || '');
        var align = d.align || 'center';
        var wClass = d.width && d.width !== '100%' ? ' vb-w-' + d.width.replace('%', '') : '';
        var imgTag = '<img src="' + escapeAttr(src) + '" alt="' + escapeAttr(alt) + '" loading="lazy" class="' + wClass.trim() + '">';

        var clickAttr = '';
        if (d.lightbox && ctx.mode === 'site') {
            // Uses the site-wide, already-existing lightbox — no per-block
            // lightbox implementation, per spec.
            clickAttr = ' onclick="if(typeof openLightbox===\'function\'){openLightbox(this.src,this.alt,this);}"';
            imgTag = imgTag.replace('<img ', '<img style="cursor:pointer;"' + clickAttr + ' ');
        }
        if (d.link && d.link.url) {
            var target = d.link.target === '_blank' ? ' target="_blank" rel="noopener noreferrer"' : '';
            imgTag = '<a href="' + escapeAttr(d.link.url) + '"' + target + '>' + imgTag + '</a>';
        }
        var captionHtml = caption ? '<figcaption class="vb-image-caption">' + escapeHtml(caption) + '</figcaption>' : '';
        return '<figure class="vb-block vb-block-image vb-align-' + escapeAttr(align) + '" ' + widthStyle(block) +
            ' data-block-id="' + escapeAttr(block.id) + '">' + imgTag + captionHtml + '</figure>';
    }

    function renderGallery(block, ctx) {
        var galleryId = (block.data || {}).galleryId || '';
        var gallery = (ctx.galleriesData || []).find(function (g) { return g.id === galleryId; });

        if (ctx.mode === 'admin') {
            if (!gallery) {
                return '<div class="vb-block vb-block-gallery-placeholder" ' + widthStyle(block) + '>⚠ Галерея не выбрана или не найдена</div>';
            }
            return '<div class="vb-block vb-block-gallery-placeholder" ' + widthStyle(block) + '>' +
                '📷 Галерея «' + escapeHtml(gallery.title || gallery.id) + '» — ' + (gallery.imageCount || 0) + ' изобр.' +
                '<div style="font-size:.8em;opacity:.7;margin-top:.35rem;">Живой предпросмотр галерей внутри блочного редактора не отображается — миниатюры будут собраны при публикации/предпросмотре сайта.</div>' +
                '</div>';
        }
        // Site mode: reuse the exact markup the existing shortcode system
        // (`[gallery:id]` inside TinyMCE pages) already produces, so the
        // already-existing instantiation code (`.embedded-gallery` lookup
        // in script.js) works completely unmodified for block pages too.
        if (!gallery) {
            return '<div class="vb-block" ' + widthStyle(block) + '><p>⚠ Галерея "' + escapeHtml(galleryId) + '" не найдена</p></div>';
        }
        return '<div class="vb-block vb-block-gallery" ' + widthStyle(block) + ' data-block-id="' + escapeAttr(block.id) + '">' +
            '<div class="embedded-gallery" data-gallery-id="' + escapeAttr(galleryId) + '"></div>' +
            '</div>';
    }

    function renderButtonInner(text, url, target, rel, styleClass, size, icon, iconPosition) {
        var targetAttr = target === '_blank' ? ' target="_blank"' : '';
        var relAttr = rel ? ' rel="' + escapeAttr(rel) + '"' : (target === '_blank' ? ' rel="noopener noreferrer"' : '');
        var iconHtml = renderIcon(icon);
        var inner = escapeHtml(text || '');
        if (iconHtml && iconPosition === 'right') inner = inner + iconHtml;
        else if (iconHtml) inner = iconHtml + inner;
        var cls = 'vb-btn ' + (styleClass === 'button_secondary' ? 'button_secondary' : 'button') +
            (size && size !== 'normal' ? ' vb-size-' + escapeAttr(size) : '');
        return '<a class="' + cls + '" href="' + escapeAttr(url || '#') + '"' + targetAttr + relAttr + '>' + inner + '</a>';
    }

    function renderButton(block, ctx) {
        var d = block.data || {};
        var text = t(ctx, block, 'text', d.text || 'Кнопка');
        var align = d.align || 'left';
        var valign = d.verticalAlign || 'top';
        var alignSelfMap = { top: 'flex-start', center: 'center', bottom: 'flex-end' };
        var html = renderButtonInner(text, d.url, d.target, d.rel, d.style, d.size, d.icon, d.iconPosition);
        return '<div class="vb-block vb-block-button vb-align-' + escapeAttr(align) + '" style="' + widthStyleVars(block) +
            'align-self:' + (alignSelfMap[valign] || 'flex-start') + ';" data-block-id="' + escapeAttr(block.id) + '">' + html + '</div>';
    }

    function buildVideoEmbed(d, ctx) {
        var attrs = [];
        if (d.controls !== false) attrs.push('controls');
        if (d.autoplay) attrs.push('autoplay');
        if (d.muted || d.autoplay) attrs.push('muted'); // most browsers require muted for autoplay
        if (d.loop) attrs.push('loop');
        if (d.playsinline) attrs.push('playsinline');
        var attrStr = attrs.length ? ' ' + attrs.join(' ') : '';

        if (d.source === 'youtube' && d.videoId) {
            var ytParams = [];
            if (d.autoplay) ytParams.push('autoplay=1', 'mute=1');
            if (d.loop) ytParams.push('loop=1', 'playlist=' + encodeURIComponent(d.videoId));
            var q = ytParams.length ? '?' + ytParams.join('&') : '';
            // referrerpolicy — явно, а не полагаясь на дефолт вебвью: в Neutralino/WebKitGTK
            // без него Referer на кросс-доменный запрос к youtube.com иногда не уходит,
            // а YouTube без Referer отдаёт ошибку 153 вместо видео.
            return '<iframe src="https://www.youtube.com/embed/' + encodeURIComponent(d.videoId) + q +
                '" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>';
        }
        if (d.source === 'vimeo' && d.videoId) {
            var vParams = [];
            if (d.autoplay) vParams.push('autoplay=1', 'muted=1');
            if (d.loop) vParams.push('loop=1');
            var vq = vParams.length ? '?' + vParams.join('&') : '';
            return '<iframe src="https://player.vimeo.com/video/' + encodeURIComponent(d.videoId) + vq +
                '" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>';
        }
        if (d.source === 'peertube' && d.videoId && d.peertubeHost) {
            var host = String(d.peertubeHost).replace(/\/+$/, '');
            if (!/^https?:\/\//i.test(host)) host = 'https://' + host;
            return '<iframe src="' + escapeAttr(host) + '/videos/embed/' + encodeURIComponent(d.videoId) +
                '" frameborder="0" allowfullscreen loading="lazy" sandbox="allow-same-origin allow-scripts allow-popups allow-forms"></iframe>';
        }
        if (d.source === 'local' && d.localSrc) {
            // Локальные пути (./files/...) должны пройти через ctx.resolveImage —
            // в Neutralino-редакторе он превращает их в blob-URL, иначе <video>
            // пытается грузить относительный путь мимо файловой системы проекта
            // и просто ничего не показывает (на опубликованном сайте resolveImage
            // — identity-функция, поэтому там всё и так работало).
            var localSrc = ctx.resolveImage(d.localSrc);
            var posterSrc = d.poster ? ctx.resolveImage(d.poster) : '';
            var poster = posterSrc ? ' poster="' + escapeAttr(posterSrc) + '"' : '';
            return '<video' + poster + attrStr + '><source src="' + escapeAttr(localSrc) + '"></video>';
        }
        if (d.source === 'url' && d.directUrl) {
            var isFileLike = /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(d.directUrl);
            if (isFileLike) {
                return '<video' + attrStr + '><source src="' + escapeAttr(d.directUrl) + '"></video>';
            }
            // Ссылка могла быть сохранена ещё до того, как детектор (см.
            // detectVideoFromUrl в block-editor.js) научился понимать /shorts/ и
            // т.п. — тогда она попала сюда как "просто ссылка" вместо youtube/vimeo,
            // а страницу просмотра YouTube нельзя вставить в iframe напрямую
            // (ERR_BLOCKED_BY_RESPONSE). Пытаемся на лету распознать такие ссылки
            // и подставить настоящий embed-адрес.
            var ytMatch = d.directUrl.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{6,})/);
            var vimMatch = !ytMatch && d.directUrl.match(/vimeo\.com\/(\d+)/);
            var ptMatch = !ytMatch && !vimMatch && d.directUrl.match(/^(https?:\/\/[^\/]+)\/(?:videos\/watch|w)\/([a-zA-Z0-9_-]+)/);
            if (ytMatch) {
                return '<iframe src="https://www.youtube.com/embed/' + escapeAttr(ytMatch[1]) + '" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>';
            }
            if (vimMatch) {
                return '<iframe src="https://player.vimeo.com/video/' + escapeAttr(vimMatch[1]) + '" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>';
            }
            if (ptMatch) {
                return '<iframe src="' + escapeAttr(ptMatch[1] + '/videos/embed/' + ptMatch[2]) + '" frameborder="0" allowfullscreen loading="lazy" sandbox="allow-same-origin allow-scripts allow-popups allow-forms"></iframe>';
            }
            return '<iframe src="' + escapeAttr(d.directUrl) + '" frameborder="0" allowfullscreen loading="lazy"></iframe>';
        }
        return '<div style="color:#fff;display:flex;align-items:center;justify-content:center;height:100%;font-size:.9rem;">⚠ Видео не настроено</div>';
    }

    function videoAspectStyle(d) {
        var w = parseFloat(d.aspectW), h = parseFloat(d.aspectH);
        if (!(w > 0) || !(h > 0)) { w = 16; h = 9; } // shorts/reels use e.g. aspectW:9, aspectH:16
        return 'style="--vb-aspect:' + w + '/' + h + ';"';
    }

    function renderVideo(block, ctx) {
        var d = block.data || {};
        var embed = buildVideoEmbed(d, ctx);
        return '<div class="vb-block vb-block-video" ' + widthStyle(block) + ' data-block-id="' + escapeAttr(block.id) + '">' +
            '<div class="vb-video-frame" ' + videoAspectStyle(d) + '>' + embed + '</div>' +
            '</div>';
    }

    function renderHtml(block, ctx) {
        // Advanced/trusted content — deliberately NOT sanitized, matching
        // the spec ("HTML Block is an explicit advanced author feature").
        var code = (block.data || {}).code || '';
        return '<div class="vb-block vb-block-html" ' + widthStyle(block) + ' data-block-id="' + escapeAttr(block.id) + '">' + code + '</div>';
    }

    function renderImageText(block, ctx) {
        var d = block.data || {};
        var img = d.image || {};
        var alt = t(ctx, block, 'imageAlt', img.alt || '');
        var html = t(ctx, block, 'html', d.html || '');
        var src = ctx.resolveImage(img.src || '');
        // Unified image-text/text-image block: textPosition drives layout for
        // newly-created blocks; legacy 'text-image' blocks without textPosition
        // fall back to their old fixed reversed layout.
        var reversed = d.textPosition ? d.textPosition === 'left' : block.type === 'text-image';
        var valign = d.verticalAlign || 'top';
        var wrapClass = reversed ? 'vb-block-textimage' : 'vb-block-imagetext';
        var imgTag = '<img src="' + escapeAttr(src) + '" alt="' + escapeAttr(alt) + '" loading="lazy">';
        if (img.link && img.link.url) {
            var linkTarget = img.link.target === '_blank' ? ' target="_blank" rel="noopener noreferrer"' : '';
            imgTag = '<a href="' + escapeAttr(img.link.url) + '"' + linkTarget + '>' + imgTag + '</a>';
        }
        return '<div class="vb-block ' + wrapClass + ' vb-valign-' + escapeAttr(valign) + '" ' + widthStyle(block) + ' data-block-id="' + escapeAttr(block.id) + '">' +
            '<div class="vb-it-img">' + imgTag + '</div>' +
            '<div class="vb-it-text">' + html + '</div>' +
            '</div>';
    }

    function renderImageCard(block, ctx) {
        var d = block.data || {};
        var img = d.image || {};
        var title = t(ctx, block, 'title', d.title || '');
        var html = t(ctx, block, 'html', d.html || '');
        var src = ctx.resolveImage(img.src || '');
        var btn = d.button || {};
        var btnText = t(ctx, block, 'buttonText', btn.text || '');
        var btnHtml = btnText ? renderButtonInner(btnText, btn.url, btn.target, btn.rel, 'button', 'normal', null, 'left') : '';
        return '<div class="vb-block vb-block-card" ' + widthStyle(block) + ' data-block-id="' + escapeAttr(block.id) + '">' +
            (src ? '<img src="' + escapeAttr(src) + '" alt="' + escapeAttr(img.alt || '') + '" loading="lazy">' : '') +
            '<div class="vb-card-body">' +
            (title ? '<h3>' + escapeHtml(title) + '</h3>' : '') +
            (html ? '<div>' + html + '</div>' : '') +
            (btnHtml ? '<div>' + btnHtml + '</div>' : '') +
            '</div></div>';
    }

    function renderFeatureLike(block, ctx, cssClass) {
        var d = block.data || {};
        var title = t(ctx, block, 'title', d.title || '');
        var html = t(ctx, block, 'html', d.html || '');
        return '<div class="vb-block ' + cssClass + '" ' + widthStyle(block) + ' data-block-id="' + escapeAttr(block.id) + '">' +
            '<div class="' + (cssClass === 'vb-block-callout' ? 'vb-callout-icon' : 'vb-feature-icon') + '">' + renderIcon(d.icon) + '</div>' +
            '<div class="' + (cssClass === 'vb-block-callout' ? 'vb-callout-body' : 'vb-feature-body') + '">' +
            (title ? '<h4>' + escapeHtml(title) + '</h4>' : '') +
            (html ? '<div>' + html + '</div>' : '') +
            '</div></div>';
    }

    function renderQuote(block, ctx) {
        var d = block.data || {};
        var quote = t(ctx, block, 'quote', d.quote || '');
        var author = t(ctx, block, 'author', d.author || '');
        return '<blockquote class="vb-block vb-block-quote" ' + widthStyle(block) + ' data-block-id="' + escapeAttr(block.id) + '">' +
            '<p>' + escapeHtml(quote) + '</p>' +
            (author ? '<span class="vb-quote-author">— ' + escapeHtml(author) + '</span>' : '') +
            '</blockquote>';
    }

    function renderSpacer(block) {
        var size = (block.data || {}).size || 'medium';
        return '<div class="vb-block vb-block-spacer vb-size-' + escapeAttr(size) + '" ' + widthStyle(block) + '></div>';
    }

    function renderDivider(block) {
        return '<div class="vb-block vb-block-divider" ' + widthStyle(block) + '><hr></div>';
    }

    var RENDERERS = {
        text: renderText,
        image: renderImage,
        gallery: renderGallery,
        button: renderButton,
        video: renderVideo,
        html: renderHtml,
        'image-text': function (b, c) { return renderImageText(b, c); },
        'text-image': function (b, c) { return renderImageText(b, c); },
        'image-card': renderImageCard,
        feature: function (b, c) { return renderFeatureLike(b, c, 'vb-block-feature'); },
        callout: function (b, c) { return renderFeatureLike(b, c, 'vb-block-callout'); },
        quote: renderQuote,
        spacer: renderSpacer,
        divider: renderDivider
    };

    function renderBlock(block, ctx) {
        ctx = normalizeCtx(ctx);
        var fn = RENDERERS[block.type];
        if (!fn) {
            return '<div class="vb-block" ' + widthStyle(block) + '>⚠ Неизвестный тип блока: ' + escapeHtml(block.type) + '</div>';
        }
        try {
            return fn(block, ctx);
        } catch (err) {
            console.error('[ViewmanBlockRenderer] Ошибка рендера блока', block, err);
            return '<div class="vb-block">⚠ Ошибка рендера блока "' + escapeHtml(block.type) + '"</div>';
        }
    }

    function renderBlocks(blocks, ctx, doc) {
        ensureStyles(doc);
        blocks = Array.isArray(blocks) ? blocks : [];
        var normCtx = normalizeCtx(ctx);
        var html = blocks.map(function (b) { return renderBlock(b, normCtx); }).join('');
        return '<div class="vb-blocks">' + html + '</div>';
    }

    // Wires up any `.embedded-gallery` placeholders produced by
    // renderGallery() in site mode. Mirrors exactly what script.js already
    // does for `[gallery:id]` shortcodes inside TinyMCE pages, so gallery
    // behaviour (lightbox, layouts, translations of captions, etc.) is
    // identical between the two editors without duplicating that logic.
    function wireGalleries(rootEl, galleriesData) {
        if (!rootEl || typeof window === 'undefined' || typeof window.loadImageGallery !== 'function') return;
        var placeholders = rootEl.querySelectorAll('.embedded-gallery');
        placeholders.forEach(function (ph) {
            var galleryId = ph.getAttribute('data-gallery-id');
            var g = (galleriesData || []).find(function (x) { return x.id === galleryId; });
            if (!g) {
                ph.innerHTML = '<p>⚠ Галерея "' + escapeHtml(galleryId) + '" не найдена</p>';
                return;
            }
            var postsWrap = document.createElement('div');
            postsWrap.className = 'posts-wrap';
            postsWrap.setAttribute('data-shortcode-id', galleryId);
            ph.appendChild(postsWrap);
            window.loadImageGallery(postsWrap, g.layoutClass, g.imageCount, g.folder, g.captions, g.hideCaption, g);
        });
    }

    global.ViewmanBlockRenderer = {
        CURRENT_VERSION: CURRENT_VERSION,
        renderBlocks: renderBlocks,
        renderBlock: renderBlock,
        wireGalleries: wireGalleries,
        renderIcon: renderIcon,
        escapeHtml: escapeHtml,
        ICONS: { tabler: TABLER_ICONS }
    };
})(typeof window !== 'undefined' ? window : this);
