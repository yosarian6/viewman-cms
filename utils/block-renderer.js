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
        'arrow-right': '<path d="M5 12l14 0" /><path d="M13 18l6 -6" /><path d="M13 6l6 6" />',
        'arrow-left': '<path d="M5 12l14 0" /><path d="M11 18l-6 -6" /><path d="M11 6l-6 6" />',
        'external-link': '<path d="M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6" /><path d="M11 13l9 -9" /><path d="M15 4h5v5" />',
        'star': '<path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" />',
        'check': '<path d="M5 12l5 5l10 -10" />',
        'mail': '<path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z" /><path d="M3 7l9 6l9 -6" />',
        'download': '<path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" /><path d="M7 11l5 5l5 -5" /><path d="M12 4l0 12" />',
        'phone': '<path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" />',
        'photo': '<path d="M15 8h.01" /><path d="M4 4h16a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1v-14a1 1 0 0 1 1 -1z" /><path d="M4 15l4 -4a3 5 0 0 1 3 0l5 5" /><path d="M14 14l1 -1a3 5 0 0 1 3 0l2 2" />',
        'bolt': '<path d="M13 3l0 7l6 0l-8 11l0 -7l-6 0l8 -11" />',
        'shield-check': '<path d="M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3" /><path d="M9 12l2 2l4 -4" />',
        'quote': '<path d="M10 11h-4a1 1 0 0 1 -1 -1v-3a1 1 0 0 1 1 -1h3a1 1 0 0 1 1 1v6c0 2.667 -1.333 4.333 -4 5" /><path d="M19 11h-4a1 1 0 0 1 -1 -1v-3a1 1 0 0 1 1 -1h3a1 1 0 0 1 1 1v6c0 2.667 -1.333 4.333 -4 5" />'
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
            + '@media (min-width:769px){.vb-block{grid-column:span var(--vb-w-desktop,12);}}'
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
            + '.vb-video-frame{position:relative;padding-bottom:56.25%;height:0;overflow:hidden;background:#000;}'
            + '.vb-video-frame iframe,.vb-video-frame video{position:absolute;top:0;left:0;width:100%;height:100%;border:0;}'
            + '.vb-block-html{width:100%;}'
            + '.vb-block-imagetext,.vb-block-textimage{display:flex;gap:1.5rem;align-items:center;flex-wrap:wrap;}'
            + '.vb-block-imagetext .vb-it-img,.vb-block-textimage .vb-it-img{flex:1 1 280px;min-width:0;}'
            + '.vb-block-imagetext .vb-it-text,.vb-block-textimage .vb-it-text{flex:1 1 280px;min-width:0;}'
            + '.vb-block-textimage{flex-direction:row-reverse;}'
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
        var m = clampCol(w.mobile, 12);
        return 'style="--vb-w-desktop:' + d + ';--vb-w-mobile:' + m + ';"';
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
        var html = renderButtonInner(text, d.url, d.target, d.rel, d.style, d.size, d.icon, d.iconPosition);
        return '<div class="vb-block vb-block-button vb-align-' + escapeAttr(align) + '" ' + widthStyle(block) +
            ' data-block-id="' + escapeAttr(block.id) + '">' + html + '</div>';
    }

    function buildVideoEmbed(d) {
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
            return '<iframe src="https://www.youtube.com/embed/' + encodeURIComponent(d.videoId) + q +
                '" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>';
        }
        if (d.source === 'vimeo' && d.videoId) {
            var vParams = [];
            if (d.autoplay) vParams.push('autoplay=1', 'muted=1');
            if (d.loop) vParams.push('loop=1');
            var vq = vParams.length ? '?' + vParams.join('&') : '';
            return '<iframe src="https://player.vimeo.com/video/' + encodeURIComponent(d.videoId) + vq +
                '" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen loading="lazy"></iframe>';
        }
        if (d.source === 'peertube' && d.videoId && d.peertubeHost) {
            var host = String(d.peertubeHost).replace(/\/+$/, '');
            if (!/^https?:\/\//i.test(host)) host = 'https://' + host;
            return '<iframe src="' + escapeAttr(host) + '/videos/embed/' + encodeURIComponent(d.videoId) +
                '" frameborder="0" allowfullscreen loading="lazy" sandbox="allow-same-origin allow-scripts allow-popups allow-forms"></iframe>';
        }
        if (d.source === 'local' && d.localSrc) {
            var poster = d.poster ? ' poster="' + escapeAttr(d.poster) + '"' : '';
            return '<video' + poster + attrStr + '><source src="' + escapeAttr(d.localSrc) + '"></video>';
        }
        if (d.source === 'url' && d.directUrl) {
            var isFileLike = /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(d.directUrl);
            if (isFileLike) {
                return '<video' + attrStr + '><source src="' + escapeAttr(d.directUrl) + '"></video>';
            }
            return '<iframe src="' + escapeAttr(d.directUrl) + '" frameborder="0" allowfullscreen loading="lazy"></iframe>';
        }
        return '<div style="color:#fff;display:flex;align-items:center;justify-content:center;height:100%;font-size:.9rem;">⚠ Видео не настроено</div>';
    }

    function renderVideo(block, ctx) {
        var d = block.data || {};
        var embed = buildVideoEmbed(d);
        return '<div class="vb-block vb-block-video" ' + widthStyle(block) + ' data-block-id="' + escapeAttr(block.id) + '">' +
            '<div class="vb-video-frame">' + embed + '</div>' +
            '</div>';
    }

    function renderHtml(block, ctx) {
        // Advanced/trusted content — deliberately NOT sanitized, matching
        // the spec ("HTML Block is an explicit advanced author feature").
        var code = (block.data || {}).code || '';
        return '<div class="vb-block vb-block-html" ' + widthStyle(block) + ' data-block-id="' + escapeAttr(block.id) + '">' + code + '</div>';
    }

    function renderImageText(block, ctx, reversed) {
        var d = block.data || {};
        var img = d.image || {};
        var alt = t(ctx, block, 'imageAlt', img.alt || '');
        var html = t(ctx, block, 'html', d.html || '');
        var src = ctx.resolveImage(img.src || '');
        var wrapClass = reversed ? 'vb-block-textimage' : 'vb-block-imagetext';
        return '<div class="vb-block ' + wrapClass + '" ' + widthStyle(block) + ' data-block-id="' + escapeAttr(block.id) + '">' +
            '<div class="vb-it-img"><img src="' + escapeAttr(src) + '" alt="' + escapeAttr(alt) + '" loading="lazy"></div>' +
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
        'image-text': function (b, c) { return renderImageText(b, c, false); },
        'text-image': function (b, c) { return renderImageText(b, c, true); },
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
