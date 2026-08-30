// i18n.js — модуль локализации для Viewman CMS
(function () {
    const config = window.siteConfig || {};
    if (!config.i18n || !config.i18n.enabled) {
        document.querySelectorAll('.lang-toggle').forEach(el => el.style.display = 'none');
        return;
    }

    const langToggles = [
        { btn: document.getElementById('langToggleMain'), label: document.getElementById('currentLangMain') },
        { btn: document.getElementById('langToggleDesktop'), label: document.getElementById('currentLangDesktop') },
        { btn: document.getElementById('langToggleMobile'), label: document.getElementById('currentLangMobile') }
    ].filter(x => x.btn && x.label);

    if (config.i18n.available.length < 1) {
        langToggles.forEach(t => t.btn.style.display = 'none');
        return;
    }

    // Список всех поддерживаемых языков (включая исходный)
const allAvailableLangs = [config.i18n.defaultLanguage, ...config.i18n.available];

// 1. Проверяем сохранённый в localStorage язык
let currentLang = localStorage.getItem('viewman_currentLang');

// 2. Если не задан — определяем по настройкам
if (!currentLang) {
    if (config.i18n.autoDetectBrowserLanguage) {
        const browserLang = (navigator.language || navigator.userLanguage || 'en').split('-')[0];
        if (allAvailableLangs.includes(browserLang)) {
            currentLang = browserLang;
        } else {
            currentLang = config.i18n.defaultFrontendLanguage || config.i18n.defaultLanguage;
        }
    } else {
        // Используем явно заданный язык по умолчанию для фронтенда
        currentLang = config.i18n.defaultFrontendLanguage || config.i18n.defaultLanguage;
    }
}

// 3. Убеждаемся, что выбранный язык поддерживается
if (!allAvailableLangs.includes(currentLang)) {
    currentLang = config.i18n.defaultLanguage;
}

config.i18n.currentLanguage = currentLang;

    function getTranslatedValue(translationPath, defaultValue) {
        if (currentLang === config.i18n.defaultLanguage) {
            return defaultValue;
        }
        if (!config.translations || !config.translations[currentLang]) {
            return defaultValue;
        }
        const keys = translationPath.split('.');
        let current = config.translations[currentLang];
        for (const key of keys) {
            if (current && current[key] !== undefined) {
                current = current[key];
            } else {
                return defaultValue;
            }
        }
        const result = (current && typeof current === 'object' && current.value !== undefined) 
            ? current.value 
            : current;
        if (result === undefined || result === null) {
    return defaultValue;
}
// Пустая строка означает, что перевод очищен намеренно — показываем оригинал
if (typeof result === 'string' && result.trim() === '') {
    return defaultValue;
}
return result;
    }

    function getNextLanguage() {
        const currentIndex = allAvailableLangs.indexOf(currentLang);
        return allAvailableLangs[(currentIndex + 1) % allAvailableLangs.length];
    }

    function updateLangToggle() {
        const nextLang = getNextLanguage();
        langToggles.forEach(t => {
            t.label.textContent = nextLang.toUpperCase();
        });
    }

    function getTranslatedGallery(galleryId) {
        const original = config.galleriesData.find(g => g.id === galleryId);
        if (!original) return null;
        if (currentLang === config.i18n.defaultLanguage) return original;
        return {
            ...original,
            title: getTranslatedValue(`galleriesData.${galleryId}.title`, original.title),
            description: original.description ? {
                ...original.description,
                text: getTranslatedValue(`galleriesData.${galleryId}.description`, original.description.text)
            } : original.description,
            captions: original.captions ? original.captions.map((caption, index) => 
                getTranslatedValue(`galleriesData.${galleryId}.captions.${index}`, caption)
            ) : original.captions,
            showcaseData: original.showcaseData ? original.showcaseData.map((item, index) => ({
                ...item,
                title: getTranslatedValue(`galleriesData.${galleryId}.showcaseData.${index}.title`, item.title),
                link: item.link ? {
                    ...item.link,
                    label: getTranslatedValue(`galleriesData.${galleryId}.showcaseData.${index}.link.label`, item.link.label)
                } : item.link
            })) : original.showcaseData,
            projectData: original.projectData ? original.projectData.map((item, index) => ({
                ...item,
                title: getTranslatedValue(`galleriesData.${galleryId}.projectData.${index}.title`, item.title),
                description: getTranslatedValue(`galleriesData.${galleryId}.projectData.${index}.description`, item.description)
            })) : original.projectData
        };
    }

    // Field lists mirror admin/js/block-editor/block-editor.js's
    // TRANSLATABLE_FIELDS registry (duplicated intentionally — this file
    // ships to the published site and must not depend on the admin-only
    // block editor engine; same precedent as this file's own hardcoded
    // zine block-type handling in getTranslatedZinePage() below).
    const BLOCK_TRANSLATABLE_FIELDS = {
        text: ['html'],
        image: ['alt', 'caption'],
        button: ['text'],
        'image-text': ['html', 'imageAlt'],
        'text-image': ['html', 'imageAlt'],
        'image-card': ['title', 'html', 'buttonText'],
        feature: ['title', 'html'],
        callout: ['title', 'html'],
        quote: ['quote', 'author']
    };
    const BLOCK_FIELD_DATA_PATH = { imageAlt: 'image.alt', buttonText: 'button.text' };
    function getNestedValue(obj, path) {
        return path.split('.').reduce((o, k) => (o && o[k] !== undefined) ? o[k] : undefined, obj);
    }
    function setNestedValue(obj, path, value) {
        const keys = path.split('.');
        const last = keys.pop();
        const parent = keys.reduce((o, k) => { o[k] = o[k] || {}; return o[k]; }, obj);
        parent[last] = value;
    }
    function getTranslatedBlocks(pageId, blocks) {
        if (!Array.isArray(blocks)) return blocks;
        return blocks.map(block => {
            const fields = BLOCK_TRANSLATABLE_FIELDS[block.type];
            if (!fields || !fields.length) return block;
            const translatedData = JSON.parse(JSON.stringify(block.data || {}));
            fields.forEach(field => {
                const dataPath = BLOCK_FIELD_DATA_PATH[field] || field;
                const original = getNestedValue(block.data, dataPath);
                const translated = getTranslatedValue(`textPagesData.${pageId}.blocks.${block.id}.${field}`, original);
                setNestedValue(translatedData, dataPath, translated);
            });
            return { ...block, data: translatedData };
        });
    }

    function getTranslatedTextPage(pageId) {
        const original = config.textPagesData.find(t => t.id === pageId);
        if (!original) return null;
        if (currentLang === config.i18n.defaultLanguage) return original;
        return {
            ...original,
            title: getTranslatedValue(`textPagesData.${pageId}.title`, original.title),
            contentHtml: getTranslatedValue(`textPagesData.${pageId}.contentHtml`, original.contentHtml),
            blocks: original.contentFormat === 'blocks' ? getTranslatedBlocks(pageId, original.blocks) : original.blocks,
            seo: original.seo ? {
                ...original.seo,
                title: getTranslatedValue(`textPagesData.${pageId}.seo.title`, original.seo.title),
                description: getTranslatedValue(`textPagesData.${pageId}.seo.description`, original.seo.description),
                keywords: getTranslatedValue(`textPagesData.${pageId}.seo.keywords`, original.seo.keywords)
            } : original.seo
        };
    }
    
    function getTranslatedZinePage(zineId) {
    const original = config.zinePagesData?.find(z => z.id === zineId);
    if (!original) return null;
    if (currentLang === config.i18n.defaultLanguage) return original;
    
    const translated = { ...original };
    translated.title = getTranslatedValue(`zinePagesData.${zineId}.title`, original.title);
    
    // Перевод блоков
    if (Array.isArray(original.blocks)) {
        translated.blocks = original.blocks.map(block => {
            const tb = { ...block };
            if (block.type === 'text' || block.type === 'paragraph') {
                tb.data = getTranslatedValue(`zinePagesData.${zineId}.blocks.${block.id}.data`, block.data);
            } else if (block.type === 'button') {
                tb.data = { ...(block.data || {}) };
                tb.data.text = getTranslatedValue(`zinePagesData.${zineId}.blocks.${block.id}.text`, block.data?.text) || block.data?.text || 'Кнопка';
            }
            return tb;
        });
    }
    
    // SEO
    if (original.seo) {
        translated.seo = {
            ...original.seo,
            title: getTranslatedValue(`zinePagesData.${zineId}.seo.title`, original.seo.title),
            description: getTranslatedValue(`zinePagesData.${zineId}.seo.description`, original.seo.description),
            keywords: getTranslatedValue(`zinePagesData.${zineId}.seo.keywords`, original.seo.keywords)
        };
    }
    
    return translated;
}

    // === РЕКУРСИВНАЯ ФУНКЦИЯ ДЛЯ ПЕРЕВОДА ВСЕЙ НАВИГАЦИИ ===
    function translateNavigationItems(navArray, pathPrefix = 'navigation') {
    return navArray.map(item => {
        const itemPath = `${pathPrefix}.${item.id || item.internalId}`;
        const translatedLabel = getTranslatedValue(`${itemPath}.label`, item.label);
        let translatedItem = { ...item, label: translatedLabel };
        if (item.children) {
            translatedItem.children = translateNavigationItems(item.children, `${itemPath}.children`);
        }
        return translatedItem;
    });
}

    function applyTranslations() {
        // === SEO ===
        document.title = getTranslatedValue('seo.title', config.seo.title) + ' Portfolio';
        document.querySelector('meta[name="description"]')?.setAttribute('content', getTranslatedValue('seo.description', config.seo.description));
        document.querySelector('meta[name="keywords"]')?.setAttribute('content', getTranslatedValue('seo.keywords', config.seo.keywords));
        document.querySelector('meta[name="author"]')?.setAttribute('content', getTranslatedValue('seo.author', config.seo.author));
        const ogTitle = document.querySelector('meta[property="og:title"]');
        const ogDescription = document.querySelector('meta[property="og:description"]');
        if (ogTitle) ogTitle.setAttribute('content', getTranslatedValue('seo.ogTitle', config.seo.ogTitle));
        if (ogDescription) ogDescription.setAttribute('content', getTranslatedValue('seo.ogDescription', config.seo.ogDescription));
        const twitterTitle = document.querySelector('meta[name="twitter:title"]');
        const twitterDescription = document.querySelector('meta[name="twitter:description"]');
        if (twitterTitle) twitterTitle.setAttribute('content', getTranslatedValue('seo.twitterTitle', config.seo.twitterTitle));
        if (twitterDescription) twitterDescription.setAttribute('content', getTranslatedValue('seo.twitterDescription', config.seo.twitterDescription));

        // === Заголовок сайта ===
        const siteTitle = getTranslatedValue('site.title', config.site.title);
        [document.getElementById('sidebarLogo'), document.getElementById('mobileHeaderLogo'), document.getElementById('desktopHeaderLogo')]
            .filter(el => el)
            .forEach(el => {
                if (config.site.logoType === 'image') {
                    const img = el.querySelector('img');
                    if (img) img.alt = siteTitle;
                } else {
                    el.textContent = siteTitle;
                }
            });

        // === Сохраняем состояние открытых подменю ===
        const mainNavList = document.getElementById('mainNavList');
        const expandedParents = mainNavList
            ? Array.from(mainNavList.querySelectorAll('.parent-item.expanded')).map(el => el.dataset.navId)
            : [];

        // === Полная перестройка навигации с учётом перевода ===
        if (mainNavList) {
            mainNavList.innerHTML = '';
            const translatedNav = translateNavigationItems(config.navigation);
            translatedNav.forEach(navItem => {
                const li = document.createElement('li');
                li.dataset.navId = navItem.id || navItem.internalId; // ← для восстановления состояния
                if (navItem.type === 'parent') {
                    li.classList.add('parent-item');
                    const parentLink = document.createElement('a');
                    parentLink.href = '#';
                    parentLink.textContent = navItem.label;
                    parentLink.innerHTML += ' <i class="fas fa-chevron-down toggle-icon"></i>';
                    li.appendChild(parentLink);
                    const subMenuUl = document.createElement('ul');
                    subMenuUl.classList.add('submenu');
                    navItem.children.forEach(childItem => {
    const subLi = document.createElement('li');
    const subLink = document.createElement('a');
    subLink.textContent = childItem.label;

    if (childItem.type === 'parent' || (Array.isArray(childItem.children) && childItem.children.length > 0)) {
        // === 3-й уровень (grandchildren) ===
        subLi.classList.add('submenu-parent-item');
        subLink.href = '#';
        const arrowIcon = document.createElement('i');
        arrowIcon.className = 'fas fa-chevron-right toggle-icon-sub';
        subLink.appendChild(arrowIcon);

        const subSubMenuUl = document.createElement('ul');
        subSubMenuUl.classList.add('sub-submenu');

        (childItem.children || []).forEach(grandItem => {
            if (!grandItem) return;
            const gcLi = document.createElement('li');
            const gcLink = document.createElement('a');
            gcLink.textContent = grandItem.label || 'Страница';
            if (grandItem.type === 'link') {
                gcLink.href = grandItem.url;
                gcLink.target = '_blank';
                gcLink.rel = 'noopener noreferrer';
                gcLink.addEventListener('click', () => {
                    if (window.innerWidth <= 768 || document.body.classList.contains('sidebar-hidden')) {
                        document.getElementById('mainNav')?.classList.remove('active');
                        document.body.style.overflow = 'auto';
                    }
                });
            } else {
                gcLink.href = `#${grandItem.id}`;
                gcLink.classList.add('nav-link');
                gcLink.dataset.target = grandItem.id;
                gcLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    showContent(grandItem.id, -1);
                    if (window.innerWidth <= 768 || document.body.classList.contains('sidebar-hidden')) {
                        document.getElementById('mainNav')?.classList.remove('active');
                        document.body.style.overflow = 'auto';
                    }
                });
            }
            gcLi.appendChild(gcLink);
            subSubMenuUl.appendChild(gcLi);
        });

        subLi.appendChild(subLink);
        subLi.appendChild(subSubMenuUl);

        subLink.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const isExpanded = subLi.classList.toggle('expanded');
            subSubMenuUl.classList.toggle('expanded', isExpanded);
            Array.from(subMenuUl.querySelectorAll('.submenu-parent-item.expanded')).forEach(other => {
                if (other !== subLi) {
                    other.classList.remove('expanded');
                    const otherSub = other.querySelector('.sub-submenu');
                    if (otherSub) otherSub.classList.remove('expanded');
                }
            });
        });

    } else if (childItem.type === 'link') {
        subLink.href = childItem.url;
        subLink.target = '_blank';
        subLink.rel = 'noopener noreferrer';
        subLi.appendChild(subLink);
    } else {
        subLink.href = `#${childItem.id}`;
        subLink.classList.add('nav-link');
        subLink.dataset.target = childItem.id;
        subLink.addEventListener('click', (e) => {
            e.preventDefault();
            showContent(childItem.id, -1);
            if (window.innerWidth <= 768 || document.body.classList.contains('sidebar-hidden')) {
                document.getElementById('mainNav')?.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
        subLi.appendChild(subLink);
    }
    subMenuUl.appendChild(subLi);
});
                    li.appendChild(subMenuUl);
                    parentLink.addEventListener('click', (e) => {
                        e.preventDefault();
                        li.classList.toggle('expanded');
                        subMenuUl.classList.toggle('expanded');
                        if (window.innerWidth <= 768 || document.body.classList.contains('sidebar-hidden')) {
                            document.querySelectorAll('.main-nav .parent-item.expanded').forEach(other => {
                                if (other !== li) {
                                    other.classList.remove('expanded');
                                    other.querySelector('.submenu').classList.remove('expanded');
                                }
                            });
                        }
                    });
                } else if (navItem.type === 'link') {
                    const a = document.createElement('a');
                    a.href = navItem.url;
                    a.target = '_blank';
                    a.rel = 'noopener noreferrer';
                    a.textContent = navItem.label;
                    li.appendChild(a);
                } else {
                    const a = document.createElement('a');
                    a.href = `#${navItem.id}`;
                    a.classList.add('nav-link');
                    a.dataset.target = navItem.id;
                    a.textContent = navItem.label;
                    a.addEventListener('click', (e) => {
                        e.preventDefault();
                        showContent(navItem.id, -1);
                        if (window.innerWidth <= 768 || document.body.classList.contains('sidebar-hidden')) {
                            document.getElementById('mainNav')?.classList.remove('active');
                            document.body.style.overflow = 'auto';
                        }
                    });
                    li.appendChild(a);
                }
                mainNavList.appendChild(li);
            });

            // === Восстанавливаем состояние подменю ===
            expandedParents.forEach(id => {
                const item = mainNavList.querySelector(`.parent-item[data-nav-id="${id}"]`);
                if (item) {
                    item.classList.add('expanded');
                    const submenu = item.querySelector('.submenu');
                    if (submenu) submenu.classList.add('expanded');
                }
            });
        }

        // === Футер ===
        const footerMenu = document.getElementById('footerMenu');
        if (footerMenu && config.footerNavigation) {
            footerMenu.innerHTML = '';
            config.footerNavigation.forEach(item => {
                const translatedLabel = getTranslatedValue(`footerNavigation.${item.id || item.internalId}.label`, item.label);
                const a = document.createElement('a');
                a.textContent = translatedLabel;
                a.classList.add('footer-link');
                if (item.type === 'link') {
                    a.href = item.url;
                    a.target = '_blank';
                    a.rel = 'noopener noreferrer';
                } else {
                    a.href = `#${item.id}`;
                    a.dataset.target = item.id;
                    a.addEventListener('click', (e) => {
                        e.preventDefault();
                        showContent(item.id, -1);
                        if (window.innerWidth <= 768 || document.body.classList.contains('sidebar-hidden')) {
                            document.getElementById('mainNav')?.classList.remove('active');
                            document.body.style.overflow = 'auto';
                        }
                    });
                }
                footerMenu.appendChild(a);
            });
        }

        // === Обновить текущий контент ===
        updateCurrentContent();
        console.log('Translations applied for language:', currentLang);
        
        // === Применяем SEO после перевода ===
if (typeof window.applySEOMetaTags === 'function') {
    window.applySEOMetaTags();
}
    }

    function updateCurrentContent() {
        const activeSection = document.querySelector('.content-section.active');
        if (!activeSection) return;
        const contentId = activeSection.id;

        if (activeSection.classList.contains('gallery-section')) {
            const translatedGallery = getTranslatedGallery(contentId);
            if (!translatedGallery) return;

            const titleEl = activeSection.querySelector('h2');
            if (titleEl && !translatedGallery.hideTitle) {
                titleEl.textContent = translatedGallery.title;
            }

            // === Обновление описания галереи (все типы, включая horizontal, grid, masonry, carousel, showcase) ===
if (translatedGallery.description && translatedGallery.description.displayMode !== 'hidden') {
        const descEl = activeSection.querySelector('.gallery-description-text');
        if (descEl) {
            descEl.innerHTML = translatedGallery.description.text;
        }
    }

            // === Project Gallery ===
            if (translatedGallery.isProjectGallery && translatedGallery.projectData) {
                const overlays = activeSection.querySelectorAll('.project-overlay .project-content');
                overlays.forEach((overlay, i) => {
                    const proj = translatedGallery.projectData[i];
                    if (!proj) return;
                    overlay.innerHTML = '';
                    let wrapper = null;
                    if (proj.url) {
                        wrapper = document.createElement('a');
                        wrapper.href = proj.url;
                        if (proj.url.startsWith('#')) {
                            wrapper.dataset.internal = 'true';
                        } else {
                            wrapper.target = '_blank';
                            wrapper.rel = 'noopener noreferrer';
                        }
                    }
                    if (proj.title) {
                        const h = document.createElement('h3');
                        h.textContent = proj.title;
                        if (wrapper) {
                            wrapper.appendChild(h);
                            overlay.appendChild(wrapper);
                        } else {
                            overlay.appendChild(h);
                        }
                    }
                    if (proj.description) {
                        const p = document.createElement('p');
                        p.className = 'project-description';
                        p.textContent = proj.description;
                        if (wrapper) {
                            const pLink = wrapper.cloneNode(false);
                            pLink.appendChild(p);
                            overlay.appendChild(pLink);
                        } else {
                            overlay.appendChild(p);
                        }
                    }
                });
            }

            // === Обновление подписей в карусели БЕЗ пересоздания массива ===
if (activeSection.classList.contains('single-image-carousel-parent') && Array.isArray(carouselImagesData)) {
    // Обновляем caption напрямую в существующем массиве
    if (translatedGallery.captions && Array.isArray(translatedGallery.captions)) {
        for (let i = 0; i < carouselImagesData.length && i < translatedGallery.captions.length; i++) {
            carouselImagesData[i].caption = translatedGallery.captions[i];
        }
    }
    // Обновляем текущую подпись на экране
    const captionEl = document.getElementById('carouselCaption');
    if (captionEl && carouselImagesData[carouselCurrentIndex]) {
        captionEl.textContent = carouselImagesData[carouselCurrentIndex].caption || '';
    }
}

            // === Обновление заголовков и ссылок в шоукейсе БЕЗ пересоздания массива ===
if (activeSection.classList.contains('showcase-gallery-parent') && Array.isArray(showcaseImagesData)) {
    if (translatedGallery.showcaseData && Array.isArray(translatedGallery.showcaseData)) {
        for (let i = 0; i < showcaseImagesData.length && i < translatedGallery.showcaseData.length; i++) {
            const newData = translatedGallery.showcaseData[i];
            if (newData) {
                showcaseImagesData[i].title = newData.title || showcaseImagesData[i].title;
                showcaseImagesData[i].link = newData.link || showcaseImagesData[i].link;
            }
        }
    }
    // Обновляем DOM-заголовок на экране
    const titleEl = document.getElementById('showcaseTitle');
    if (titleEl && showcaseImagesData[showcaseCurrentIndex]) {
        const item = showcaseImagesData[showcaseCurrentIndex];
        titleEl.innerHTML = '';
        if (item.title) {
            if (item.link?.url) {
                const a = document.createElement('a');
                a.href = item.link.url;
                a.textContent = item.title;
                if (item.link.external) {
                    a.target = '_blank';
                    a.rel = 'noopener noreferrer';
                }
                a.addEventListener('click', handleShowcaseLinkClick);
                titleEl.appendChild(a);
            } else {
                titleEl.textContent = item.title;
            }
        }
    }
}

            // === Все остальные галереи: grid, masonry, horizontal-scroll ===
            if (!activeSection.classList.contains('single-image-carousel-parent') &&
                !activeSection.classList.contains('showcase-gallery-parent')) {
                if (translatedGallery.description) {
                    const descEl = activeSection.querySelector('.gallery-description-text');
                    if (descEl) {
                        descEl.innerHTML = translatedGallery.description.text;
                    }
                }
                const posts = activeSection.querySelectorAll('.post');
                posts.forEach((post, i) => {
                    const captionEl = post.querySelector('.image-caption');
                    if (captionEl && translatedGallery.captions?.[i]) {
                        captionEl.textContent = translatedGallery.captions[i];
                    }
                });
            }
        }

// === Вебзины ===
if (activeSection.classList.contains('zine-section')) {
    const translatedZine = getTranslatedZinePage(contentId);
    if (translatedZine) {
        const titleEl = activeSection.querySelector('h2');
        if (titleEl && !translatedZine.hideTitle) {
            titleEl.textContent = translatedZine.title;
        }
        if (Array.isArray(translatedZine.blocks)) {
            translatedZine.blocks.forEach(block => {
                const el = document.getElementById(`zine-block-${block.id}`);
                if (!el) return;
                if (block.type === 'text') {
                    const textContent = el.querySelector('.zine-text-content');
                    // 🔥 FIX: убираем проверку block.data как truthy — применяем всегда
                    if (textContent) {
                        textContent.innerHTML = block.data ?? '';
                    }
                } else if (block.type === 'paragraph') {
                    const paraContent = el.querySelector('.zine-paragraph-content');
                    // 🔥 FIX: убираем проверку block.data как truthy
                    if (paraContent) {
                        paraContent.innerHTML = block.data ?? '';
                    }
                } else if (block.type === 'button') {
                    const btnEl = el.querySelector('.zine-button-wrapper a');
                    // 🔥 FIX: fallback на 'Кнопка' если текст пустой
                    if (btnEl) {
                        btnEl.textContent = block.data?.text || 'Кнопка';
                    }
                }
            });
        }
    }
    return;
}


        // === Текстовые страницы с шорткодами ===
        if (activeSection.classList.contains('text-content-section')) {
            const translatedPage = getTranslatedTextPage(contentId);
            if (!translatedPage) return;

            const titleEl = activeSection.querySelector('h2');
            if (titleEl && !translatedPage.hideTitle) {
                titleEl.textContent = translatedPage.title;
            }

            // Viewman Block Editor pages: re-render the whole block list with
            // translated field values via the same shared renderer used for
            // the initial render (script.js) and the admin preview — no
            // separate DOM-patching logic to keep in sync.
            if (translatedPage.contentFormat === 'blocks') {
                const blocksContainer = activeSection.querySelector('.vb-blocks-container');
                if (blocksContainer && typeof window.ViewmanBlockRenderer !== 'undefined') {
                    blocksContainer.innerHTML = window.ViewmanBlockRenderer.renderBlocks(translatedPage.blocks || [], {
                        mode: 'site',
                        galleriesData: config.galleriesData || []
                    });
                    window.ViewmanBlockRenderer.wireGalleries(blocksContainer, config.galleriesData || []);
                }
                return;
            }

            const prose = activeSection.querySelector('.prose');
            if (!prose || !translatedPage.contentHtml) return;

            // --- Очистка старых обработчиков и структуры ---
            prose.innerHTML = '';

            // --- Воссоздание структуры как в createContentSection ---
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = translatedPage.contentHtml;

            function extractBlocks(node) {
                const blocks = [];
                for (let child of node.childNodes) {
                    if (child.nodeType === Node.TEXT_NODE) {
                        const text = child.textContent.trim();
                        if (text) blocks.push(`<p>${text}</p>`);
                    } else if (child.nodeType === Node.ELEMENT_NODE) {
                        const tag = child.tagName.toLowerCase();
                        if (['h1','h2','h3','h4','h5','h6','p','ul','ol','blockquote','pre'].includes(tag)) {
                            blocks.push(child.outerHTML);
                        } else if (tag === 'img') {
                            const src = child.src || '';
                            const alt = child.alt || '';
                            blocks.push(`<img src="${src}" alt="${alt}">`);
                        } else if (tag === 'video' || (tag === 'div' && child.classList.contains('video-container'))) {
                            blocks.push(child.outerHTML);
                        } else {
                            blocks.push(...extractBlocks(child));
                        }
                    }
                }
                return blocks;
            }

            let blocks = extractBlocks(tempDiv);
            const fullHtml = translatedPage.contentHtml;
            const shortcodeRegex = /\[gallery:([^\]]+)\]/gi;
            let lastIndex = 0;
            let finalBlocks = [];
            let match;
            while ((match = shortcodeRegex.exec(fullHtml)) !== null) {
                const before = fullHtml.slice(lastIndex, match.index).trim();
                if (before) {
                    const beforeDiv = document.createElement('div');
                    beforeDiv.innerHTML = before;
                    finalBlocks.push(...extractBlocks(beforeDiv));
                }
                finalBlocks.push(match[0]);
                lastIndex = match.index + match[0].length;
            }
            const after = fullHtml.slice(lastIndex).trim();
            if (after) {
                const afterDiv = document.createElement('div');
                afterDiv.innerHTML = after;
                finalBlocks.push(...extractBlocks(afterDiv));
            }
            blocks = finalBlocks;

            const paragraphsHtml = blocks.map(block => {
                if (typeof block === 'string' && block.match(/^\[gallery:[^\]]+\]$/)) {
                    const match = block.match(/\[gallery:([^\]]+)\]/);
                    const galleryId = match[1].trim();
                    const gallery = (window.siteConfig.galleriesData || []).find(x => x.id === galleryId);
                    if (gallery) {
                        return `<div class="embedded-gallery" data-gallery-id="${galleryId}"></div>`;
                    } else {
                        return `<p>⚠ Галерея "${galleryId}" не найдена</p>`;
                    }
                }

                let cleanedContent = block.replace(/<span[^>]*class="mceNonEditable"[^>]*>\[gallery:([^\]]+)\]<\/span>/gi, '[gallery:$1]');
                cleanedContent = cleanedContent.replace(/\[gallery:([^\]]+)\]/gi, (match, galleryId) => {
                    const gallery = (window.siteConfig.galleriesData || []).find(x => x.id === galleryId.trim());
                    if (gallery) {
                        return `<div class="embedded-gallery" data-gallery-id="${galleryId.trim()}"></div>`;
                    } else {
                        return `<p>⚠ Галерея "${galleryId}" не найдена</p>`;
                    }
                });

                if (cleanedContent.includes('<img')) {
                    const srcMatch = cleanedContent.match(/src="([^"]*)"/);
                    const altMatch = cleanedContent.match(/alt="([^"]*)"/);
                    const imgSrc = srcMatch ? srcMatch[1] : '';
                    const imgAlt = altMatch ? altMatch[1] : '';
                    return `<div class="image-wrapper" onclick="openLightbox('${imgSrc}', '${imgAlt}', this.querySelector('img'));">${cleanedContent}</div>`;
                }

                if (cleanedContent.includes('<video') || cleanedContent.includes('class="video-container"')) {
                    return `<div class="video-wrapper">${cleanedContent}</div>`;
                }

                return cleanedContent.startsWith('<') ? cleanedContent : `<p>${cleanedContent}</p>`;
            }).join('');

            prose.innerHTML = paragraphsHtml;

            // --- Рендерим встроенные галереи из шорткодов ---
            prose.querySelectorAll('.embedded-gallery').forEach(ph => {
                const galleryId = ph.getAttribute('data-gallery-id');
                const g = (window.siteConfig.galleriesData || []).find(x => x.id === galleryId);
                if (g) {
                    ph.innerHTML = '';
                    const postsWrap = document.createElement('div');
                    postsWrap.className = 'posts-wrap';
                    postsWrap.setAttribute('data-shortcode-id', galleryId);
                    ph.appendChild(postsWrap);
                    loadImageGallery(postsWrap, g.layoutClass, g.imageCount, g.folder, g.captions, g.hideCaption, g);
                } else {
                    ph.innerHTML = `<p>⚠ Галерея "${galleryId}" не найдена</p>`;
                }
            });
        }
    }

    // Переопределение showContent для обновления перевода после смены контента
    const originalShowContent = window.showContent;
    window.showContent = function(contentId, imageIndex = -1) {
        return originalShowContent.call(this, contentId, imageIndex).then(() => {
            updateCurrentContent();
        });
    };

    // Обработчики переключения языка
    langToggles.forEach(t => {
        t.btn.addEventListener('click', () => {
            currentLang = getNextLanguage();
            config.i18n.currentLanguage = currentLang;
            localStorage.setItem('viewman_currentLang', currentLang);
            updateLangToggle();
            applyTranslations();
        });
    });

    // Инициализация
    updateLangToggle();
    applyTranslations();
    
    // === ГЛОБАЛЬНЫЙ СИГНАЛ: i18n инициализирован ===
window.i18nReady = true;
if (typeof window.onI18nReady === 'function') {
    window.onI18nReady();
}
})();
