// =========================================================================
//  ОСНОВНОЙ СКРИПТ САЙТА. НЕ РЕДАКТИРОВАТЬ ЭТОТ БЛОК!
//  Все настройки теперь находятся в файле config.js
// =========================================================================

// Глобальные переменные для доступа функций лайтбокса и карусели
let currentImageIndex = 0;
let allVisibleImages = [];
let isGalleryContext = false; // Флаг для различения контекста галереи
let lightboxOpenedFromCarousel = false;
let activeHorizontalGallery = null; // Для отслеживания текущей активной горизонтальной галереи для навигации с клавиатуры
let activeCarouselGallery = null; // Для отслеживания текущей активной карусели с одним изображением
let carouselCurrentIndex = 0; // Текущий индекс для карусели с одним изображением
let carouselImagesData = []; // Хранит данные изображений для активной карусели
let fullscreenControlsTimeout; // Для автоматического скрытия иконки полноэкранного режима
let lightboxNavTimeout; // Для автоматического скрытия стрелок навигации лайтбокса
let carouselAutoplayIntervalId; // Для функции автовоспроизведения
let currentCarouselConfig = {}; // Хранит индивидуальные настройки карусели для текущей галереи
let carouselControlsTimeout; // NEW: Единый таймаут для всех контролов карусели

// НОВЫЕ ПЕРЕМЕННЫЕ ДЛЯ ШОУКЕЙСА
let activeShowcaseGallery = null; // Для отслеживания текущей активной галереи Шоукейса
let showcaseCurrentIndex = 0; // Текущий индекс для Шоукейса
let showcaseImagesData = []; // Хранит данные изображений и заголовков для Шоукейса
let showcaseAutoplayIntervalId; // Для автовоспроизведения Шоукейса
let currentShowcaseConfig = {}; // Хранит индивидуальные настройки Шоукейса
let showcaseTitleFontSize = "2.5rem"; // Размер шрифта заголовка шоукейса по умолчанию
let showcaseBulletsContainer = null; // Контейнер для буллетов навигации шоукейса

// NEW: Переменные для свайпов
let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;
const minSwipeDistance = 30; // Минимальное расстояние свайпа для срабатывания
const minCloseSwipeDistance = 100; // Для закрытия нужен более длинный свайп вниз

// Количество изображений для предзагрузки (N)
const preloadCount = 3;

// Получение элементов DOM (переменные остаются теми же, поскольку они нацелены на существующие HTML-элементы)
// Эти элементы будут инициализированы в DOMContentLoaded, но их ссылки нужны здесь,
// поэтому они объявляются до DOMContentLoaded.
let body;
let lightbox;
let lightboxImageContainer;
let lightboxFullscreenIcon;
let backToTopLink;
let darkModeToggleDesktop;
let darkModeIconDesktop;
let darkModeToggleMobile;
let darkModeIconMobile;
let menuToggleMobile;
let menuToggleDesktop;
let mainNav;
let mainNavList;
let dynamicContentContainer;
let footerMenu;
let lightboxArrowLeft;
let lightboxArrowRight;
let desktopHeaderHiddenSidebar;
let desktopHeaderLogo;
let darkModeToggleDesktopHeader;
let darkModeIconDesktopHeader;

let isPopstateNavigation = false; // NEW: флаг для отслеживания навигации через popstate

let sidebarStateBeforeLightbox = {
    bodySidebarHidden: false,
    mainNavHidden: false,
    desktopHeaderHiddenSidebarDisplay: 'none',
    menuToggleDesktopDisplay: 'none'
};

// Создание элементов кнопок и иконок единожды
const carouselArrowLeft = document.createElement('div');
carouselArrowLeft.id = 'carousel-arrow-left';
carouselArrowLeft.className = 'carousel-nav-arrow fas fa-chevron-left';

const carouselArrowRight = document.createElement('div');
carouselArrowRight.id = 'carousel-arrow-right';
carouselArrowRight.className = 'carousel-nav-arrow fas fa-chevron-right';

const carouselFullscreenIcon = document.createElement('div');
carouselFullscreenIcon.id = 'carousel-fullscreen-icon';
carouselFullscreenIcon.className = 'carousel-fullscreen-icon fas fa-expand';

// === SHOWCASE ARROWS ===
let showcaseControlsTimeout; // NEW: Единый таймаут для всех контролов шоукейса
const showcaseArrowLeft = document.createElement('div');
showcaseArrowLeft.id = 'showcase-arrow-left';
showcaseArrowLeft.className = 'showcase-nav-arrow fas fa-chevron-left';
const showcaseArrowRight = document.createElement('div');
showcaseArrowRight.id = 'showcase-arrow-right';
showcaseArrowRight.className = 'showcase-nav-arrow fas fa-chevron-right';
let showcaseClickHandler = null; // Обработчик клика для showcase (для cleanup)


// --- Safe Fullscreen Helpers ---
function safeRequestFullscreen(elem) {
    if (!elem) return Promise.reject(new Error('No element provided to safeRequestFullscreen'));
    try {
        if (elem.requestFullscreen) {
            return elem.requestFullscreen().catch(() => {
                try { elem.classList.add('pseudo-fullscreen'); } catch(e) {}
                return Promise.resolve();
            });
        } else if (elem.webkitRequestFullscreen) {
            try { elem.webkitRequestFullscreen(); return Promise.resolve(); } catch(e) { elem.classList.add('pseudo-fullscreen'); return Promise.resolve(); }
        } else if (elem.mozRequestFullScreen) {
            try { elem.mozRequestFullScreen(); return Promise.resolve(); } catch(e) { elem.classList.add('pseudo-fullscreen'); return Promise.resolve(); }
        } else {
            try { elem.classList.add('pseudo-fullscreen'); } catch(e) {}
            return Promise.resolve();
        }
    } catch (err) {
        try { elem.classList.add('pseudo-fullscreen'); } catch(e) {}
        return Promise.resolve();
    }
}

function safeExitFullscreen() {
    try {
        if (document.exitFullscreen) {
            return document.exitFullscreen().catch(() => {
                document.querySelectorAll('.pseudo-fullscreen').forEach(el => el.classList.remove('pseudo-fullscreen'));
                return Promise.resolve();
            });
        } else if (document.webkitExitFullscreen) { /* Safari */
            try { document.webkitExitFullscreen(); document.querySelectorAll('.pseudo-fullscreen').forEach(el => el.classList.remove('pseudo-fullscreen')); return Promise.resolve(); } catch(e) { document.querySelectorAll('.pseudo-fullscreen').forEach(el => el.classList.remove('pseudo-fullscreen')); return Promise.resolve(); }
        } else if (document.mozCancelFullScreen) { /* Firefox */
            try { document.mozCancelFullScreen(); document.querySelectorAll('.pseudo-fullscreen').forEach(el => el.classList.remove('pseudo-fullscreen')); return Promise.resolve(); } catch(e) { document.querySelectorAll('.pseudo-fullscreen').forEach(el => el.classList.remove('pseudo-fullscreen')); return Promise.resolve(); }
        } else if (document.msExitFullscreen) { /* IE/Edge */
            try { document.msExitFullscreen(); document.querySelectorAll('.pseudo-fullscreen').forEach(el => el.classList.remove('pseudo-fullscreen')); return Promise.resolve(); } catch(e) { document.querySelectorAll('.pseudo-fullscreen').forEach(el => el.classList.remove('pseudo-fullscreen')); return Promise.resolve(); }
        } else {
            document.querySelectorAll('.pseudo-fullscreen').forEach(el => el.classList.remove('pseudo-fullscreen'));
            return Promise.resolve();
        }
    } catch (err) {
        document.querySelectorAll('.pseudo-fullscreen').forEach(el => el.classList.remove('pseudo-fullscreen'));
        return Promise.resolve();
    }
}

// --- SiteConfig Validation ---
function validateSiteConfig(config) {
    const errors = [];

    if (!config || typeof config !== 'object') {
        errors.push("siteConfig is undefined or not an object.");
        return errors;
    }

    // Site
    if (!config.site || typeof config.site !== 'object') errors.push("siteConfig.site is undefined or not an object.");
    if (config.site && typeof config.site.title !== 'string') errors.push("siteConfig.site.title must be a string.");
    if (config.site && typeof config.site.email !== 'string') errors.push("siteConfig.site.email must be a string.");
    if (config.site && config.site.homepageId && typeof config.site.homepageId !== 'string') errors.push("siteConfig.site.homepageId must be a string.");
    if (config.site && typeof config.site.imageRootPath !== 'string') errors.push("siteConfig.site.imageRootPath must be a string."); // Validation for new field
    if (config.site && !['text', 'image'].includes(config.site.logoType)) errors.push("siteConfig.site.logoType must be 'text' or 'image'.");
    if (config.site && config.site.logoType === 'image' && typeof config.site.logoImagePath !== 'string') errors.push("siteConfig.site.logoImagePath must be a string if logoType is 'image'.");
    if (typeof config.site.robotsTxtGlobal !== 'string') errors.push("siteConfig.site.robotsTxtGlobal must be a string.");
	if (typeof config.site.noaiGlobal !== 'boolean') errors.push("siteConfig.site.noaiGlobal must be a boolean.");
    if (typeof config.site.protectImages !== 'boolean') errors.push("siteConfig.site.protectImages must be a boolean.");
    // NEW: Sidebar config validation
    if (config.site && config.site.sidebar && typeof config.site.sidebar !== 'object') errors.push("siteConfig.site.sidebar must be an object.");
    if (config.site && config.site.sidebar && typeof config.site.sidebar.enabledDesktop !== 'boolean') errors.push("siteConfig.site.sidebar.enabledDesktop must be a boolean.");
    if (config.site && config.site.sidebar && typeof config.site.sidebar.hideOnHomepage !== 'boolean') errors.push("siteConfig.site.sidebar.hideOnHomepage must be a boolean.");
    // NEW: Primary Image Format validation
    if (config.site && config.site.primaryImageFormat && typeof config.site.primaryImageFormat !== 'string') errors.push("siteConfig.site.primaryImageFormat must be a string (e.g., 'webp', 'jpeg', 'png').");


    // SEO
    if (!config.seo || typeof config.seo !== 'object') errors.push("siteConfig.seo is undefined or not an object.");
    if (config.seo && typeof config.seo.title !== 'string') errors.push("siteConfig.seo.title must be a string.");
    if (config.seo && typeof config.seo.description !== 'string') errors.push("siteConfig.seo.description must be a string.");
    if (config.seo && typeof config.seo.keywords !== 'string') errors.push("siteConfig.seo.keywords must be a string.");
    if (config.seo && typeof config.seo.author !== 'string') errors.push("siteConfig.seo.author must be a string.");
    
    // NEW: Validate Open Graph meta tags
    if (config.seo && typeof config.seo.ogTitle !== 'string') errors.push("siteConfig.seo.ogTitle must be a string.");
    if (config.seo && typeof config.seo.ogDescription !== 'string') errors.push("siteConfig.seo.ogDescription must be a string.");
    if (config.seo && typeof config.seo.ogImage !== 'string') errors.push("siteConfig.seo.ogImage must be a string.");
    if (config.seo && typeof config.seo.ogUrl !== 'string') errors.push("siteConfig.seo.ogUrl must be a string.");
    if (config.seo && typeof config.seo.ogType !== 'string') errors.push("siteConfig.seo.ogType must be a string.");
    // NEW: Validate Twitter Card meta tags
    if (config.seo && typeof config.seo.twitterCard !== 'string') errors.push("siteConfig.seo.twitterCard must be a string.");
    if (config.seo && typeof config.seo.twitterTitle !== 'string') errors.push("siteConfig.seo.twitterTitle must be a string.");
    if (config.seo && typeof config.seo.twitterDescription !== 'string') errors.push("siteConfig.seo.twitterDescription must be a string.");
    if (config.seo && typeof config.seo.twitterImage !== 'string') errors.push("siteConfig.seo.twitterImage must be a string.");
    // NEW: Validate favicon
    if (config.seo && typeof config.seo.favicon !== 'string') errors.push("siteConfig.seo.favicon must be a string.");

    
           // Navigation
    if (!Array.isArray(config.navigation)) errors.push("siteConfig.navigation must be an array.");
    if (config.navigation) {
        config.navigation.forEach((item, index) => {
            if (typeof item.id !== 'string' && item.type !== 'parent') errors.push(`navigation[${index}].id must be a string.`);
            if (typeof item.label !== 'string') errors.push(`navigation[${index}].label must be a string.`);
            if (child.type !== undefined && !['gallery', 'text', 'parent', 'link', 'zine'].includes(child.type)) errors.push(`navigation[${index}].children[${childIndex}].type has an invalid value.`);

            if (item.type === 'parent') {
                if (!Array.isArray(item.children)) errors.push(`navigation[${index}].children must be an array for type 'parent'.`);
                item.children.forEach((child, childIndex) => {
                    if (typeof child.id !== 'string' && child.type !== 'link') errors.push(`navigation[${index}].children[${childIndex}].id must be a string.`);
                    if (typeof child.label !== 'string') errors.push(`navigation[${index}].children[${childIndex}].label must be a string.`);
                    if (!['gallery', 'text', 'link', 'parent', 'zine'].includes(child.type)) errors.push(`navigation[${index}].children[${childIndex}].type has an invalid value.`);
                    if (child.type === 'link' && typeof child.url !== 'string') errors.push(`navigation[${index}].children[${childIndex}].url must be a string for type 'link'.`);

                                    // Валидация grandchildren
                 if (child.type === 'parent' || Array.isArray(child.children)) {
                    if (!Array.isArray(child.children)) {
                        errors.push(`navigation[${index}].children[${childIndex }].children must be an array.`);
                        } else {
                            child.children.forEach((grand, grandIndex) => {
                                if (typeof grand.id !== 'string' && grand.type !== 'link') errors.push(`navigation[${index}].children[${childIndex}].children[${grandIndex}].id must be a string.`);
                                if (typeof grand.label !== 'string') errors.push(`navigation[${index}].children[${childIndex}].children[${grandIndex}].label must be a string.`);
                                if (grand.type !== undefined && !['gallery', 'text', 'link', 'zine'].includes(grand.type)) errors.push(`navigation[${index}].children[${childIndex}].children[${grandIndex}].type has an invalid value.`);
                                if (grand.type === 'link' && typeof grand.url !== 'string') errors.push(`navigation[${index}].children[${childIndex}].children[${grandIndex}].url must be a string for type 'link'.`);
                            });
                        }
                    }
                });
            } else if (item.type === 'link') {
                if (typeof item.url !== 'string') errors.push(`navigation[${index}].url must be a string for type 'link'.`);
            } else if (item.type === 'overlay') {
                // For overlay, 'id' and 'label' are sufficient. No 'url' or 'children'.
            }
        });
    }

    // NEW: Footer Navigation validation
    if (config.footerNavigation && !Array.isArray(config.footerNavigation)) errors.push("siteConfig.footerNavigation must be an array if defined.");
    if (config.footerNavigation) {
        config.footerNavigation.forEach((item, index) => {
            if (typeof item.id !== 'string') errors.push(`footerNavigation[${index}].id must be a string.`);
            if (typeof item.label !== 'string') errors.push(`footerNavigation[${index}].label must be a string.`);
            if (!['gallery', 'text', 'link'].includes(item.type)) errors.push(`footerNavigation[${index}].type has an invalid value.`);
            if (item.type === 'link' && typeof item.url !== 'string') errors.push(`footerNavigation[${index}].url must be a string for type 'link'.`);
        });
    }

    // Galleries Data
    if (!Array.isArray(config.galleriesData)) errors.push("siteConfig.galleriesData must be an array.");
    if (config.galleriesData) {
        config.galleriesData.forEach((item, index) => {
            if (typeof item.id !== 'string') errors.push(`galleriesData[${index}].id must be a string.`);
            if (typeof item.title !== 'string') errors.push(`galleriesData[${index}].title must be a string.`);
            if (typeof item.folder !== 'string') errors.push(`galleriesData[${index}].folder must be a string.`);
            if (typeof item.imageCount !== 'number' || item.imageCount < 0) errors.push(`galleriesData[${index}].imageCount must be a positive number.`);
            if (typeof item.layoutClass !== 'string') errors.push(`galleriesData[${index}].layoutClass must be a string.`);
            if (typeof item.hideTitle !== 'boolean') errors.push(`galleriesData[${index}].hideTitle must be a boolean.`);
            if (typeof item.hideSidebar !== 'boolean' && item.hideSidebar !== undefined) errors.push(`galleriesData[${index}].hideSidebar must be a boolean.`); // NEW VALIDATION
            if (typeof item.noindex !== 'boolean') errors.push(`galleriesData[${index}].noindex must be a boolean.`);
			if (typeof item.noai !== 'boolean') errors.push(`galleriesData[${index}].noai must be a boolean.`);

            // Validation for description (NEW)
            if (item.description) {
                if (typeof item.description !== 'object') errors.push(`galleriesData[${index}].description must be an object or null.`);
                if (item.description.text && typeof item.description.text !== 'string') errors.push(`galleriesData[${index}].description.text must be a string (HTML allowed).`);
                if (item.description.displayMode && !['toggle', 'open', 'hidden'].includes(item.description.displayMode)) {
                    errors.push(`galleriesData[${index}].description.displayMode must be 'toggle', 'open', or 'hidden'.`);
                }
            }

            // Validation for single-image-carousel and showcase
            if (item.layoutClass === 'gallery-single-image-carousel' || item.layoutClass === 'gallery-showcase') {
                if (item.captions && !Array.isArray(item.captions)) {
                    errors.push(`galleriesData[${index}].captions must be an array for gallery-single-image-carousel or gallery-showcase.`);
                }
                if (item.carouselConfig) {
                    if (typeof item.carouselConfig.randomOrder !== 'boolean') errors.push(`galleriesData[${index}].carouselConfig.randomOrder must be a boolean.`);
                    if (typeof item.carouselConfig.autoPlay !== 'boolean') errors.push(`galleriesData[${index}].carouselConfig.autoPlay must be a boolean.`);
                    if (typeof item.carouselConfig.autoPlayInterval !== 'number' || item.carouselConfig.autoPlayInterval < 100) errors.push(`galleriesData[${index}].carouselConfig.autoPlayInterval must be a number >= 100.`);
                    if (item.layoutClass === 'gallery-showcase' && typeof item.carouselConfig.showBullets !== 'boolean') errors.push(`galleriesData[${index}].carouselConfig.showBullets must be a boolean for gallery-showcase.`);
                    // NEW: Validate showTitles for showcase
                    if (item.layoutClass === 'gallery-showcase' && typeof item.carouselConfig.showTitles !== 'boolean') errors.push(`galleriesData[${index}].carouselConfig.showTitles must be a boolean for gallery-showcase.`);
                    // NEW: Validate showArrows for single-image-carousel
                    if (item.layoutClass === 'gallery-single-image-carousel' && typeof item.carouselConfig.showArrows !== 'boolean' && item.carouselConfig.showArrows !== undefined) errors.push(`galleriesData[${index}].carouselConfig.showArrows must be a boolean for gallery-single-image-carousel.`);
                    // NEW: Validate showFullscreenButton for single-image-carousel
                    if (item.layoutClass === 'gallery-single-image-carousel' && typeof item.carouselConfig.showFullscreenButton !== 'boolean' && item.carouselConfig.showFullscreenButton !== undefined) errors.push(`galleriesData[${index}].carouselConfig.showFullscreenButton must be a boolean for gallery-single-image-carousel.`);
                }
                if (item.layoutClass === 'gallery-showcase' && !Array.isArray(item.showcaseData)) {
                    errors.push(`galleriesData[${index}].showcaseData must be an array for gallery-showcase.`);
                } else if (item.layoutClass === 'gallery-showcase' && item.showcaseData) {
                    item.showcaseData.forEach((showcaseItem, showcaseIndex) => {
                        // NEW: title can be null
                        if (showcaseItem.title !== null && typeof showcaseItem.title !== 'string') errors.push(`galleriesData[${index}].showcaseData[${showcaseIndex}].title must be a string or null.`);
                        if (showcaseItem.link && typeof showcaseItem.link !== 'object') errors.push(`galleriesData[${index}].showcaseData[${showcaseIndex}].link must be an object or null.`);
                        if (showcaseItem.link) {
                            if (typeof showcaseItem.link.url !== 'string') errors.push(`galleriesData[${index}].showcaseData[${showcaseIndex}].link.url must be a string.`);
                            if (typeof showcaseItem.link.label !== 'string') errors.push(`galleriesData[${index}].showcaseData[${showcaseIndex}].link.label must be a string.`);
                            if (typeof showcaseItem.link.external !== 'boolean' && showcaseItem.link.external !== undefined) errors.push(`galleriesData[${index}].showcaseData[${showcaseIndex}].link.external must be a boolean.`);
                        }
                        // Individual hideTitle is now removed from config, so its validation is removed here.
                    });
                }
            }
            if (typeof item.hideCaption !== 'boolean' && item.hideCaption !== undefined) errors.push(`galleriesData[${index}].hideCaption must be a boolean.`);
            // Validation for project gallery
if (item.isProjectGallery) {
    if (!Array.isArray(item.projectData)) {
        errors.push(`galleriesData[${index}].projectData must be an array if isProjectGallery is true.`);
    } else if (item.projectData.length !== item.imageCount) {
        errors.push(`galleriesData[${index}].projectData length must match imageCount.`);
    } else {
        item.projectData.forEach((proj, pIdx) => {
            if (proj.title !== undefined && proj.title !== null && typeof proj.title !== 'string') {
                errors.push(`galleriesData[${index}].projectData[${pIdx}].title must be a string, null, or undefined.`);
            }
            if (proj.url !== undefined && proj.url !== null && typeof proj.url !== 'string') {
                errors.push(`galleriesData[${index}].projectData[${pIdx}].url must be a string, null, or undefined.`);
            }
            if (proj.description !== undefined && proj.description !== null && typeof proj.description !== 'string') {
                errors.push(`galleriesData[${index}].projectData[${pIdx}].description must be a string, null, or undefined.`);
            }
        });
    }
}
        });
    }

    // Text Pages Data
    if (!Array.isArray(config.textPagesData)) errors.push("siteConfig.textPagesData must be an array.");
    if (config.textPagesData) {
        config.textPagesData.forEach((item, index) => {
            if (typeof item.id !== 'string') errors.push(`textPagesData[${index}].id must be a string.`);
            if (typeof item.title !== 'string') errors.push(`textPagesData[${index}].title must be a string.`);
            if (!Array.isArray(item.paragraphs)) errors.push(`textPagesData[${index}].paragraphs must be an array.`);
            if (typeof item.hideTitle !== 'boolean') errors.push(`textPagesData[${index}].hideTitle must be a boolean.`);
            if (typeof item.hideSidebar !== 'boolean' && item.hideSidebar !== undefined) errors.push(`textPagesData[${index}].hideSidebar must be a boolean.`); // NEW VALIDATION
            if (typeof item.noindex !== 'boolean') errors.push(`textPagesData[${index}].noindex must be a boolean.`);
			if (typeof item.noai !== 'boolean') errors.push(`textPagesData[${index}].noai must be a boolean.`);
        });
    }

    // Styles
    if (!config.styles || typeof config.styles !== 'object') errors.push("siteConfig.styles is undefined or not an object.");
    // СТАРАЯ ПРОВЕРКА - УДАЛИТЬ ИЛИ ЗАКОММЕНТИРОВАТЬ
    //if (config.styles && config.styles.defaultTheme && !['light', 'dark'].includes(config.styles.defaultTheme)) errors.push("siteConfig.styles.defaultTheme must be 'light' or 'dark'.");
    if (config.styles && config.styles.fontFamily && typeof config.styles.fontFamily !== 'string') errors.push("siteConfig.styles.fontFamily must be a string."); // NEW: Added validation for fontFamily
    if (config.styles && config.styles.logoFontFamily && typeof config.styles.logoFontFamily !== 'string') errors.push("siteConfig.styles.logoFontFamily must be a string.");
    if (config.styles && config.styles.logoFontSize && typeof config.styles.logoFontSize !== 'string') errors.push("siteConfig.styles.logoFontSize must be a string.");
    if (config.styles && config.styles.logoMobileFontSize && typeof config.styles.logoMobileFontSize !== 'string') errors.push("siteConfig.styles.logoMobileFontSize must be a string.");
    if (config.styles && config.styles.contentMaxWidthClass && typeof config.styles.contentMaxWidthClass !== 'string') errors.push("siteConfig.styles.contentMaxWidthClass must be a string.");
    
    
	// Project Gallery overley
	if (config.styles.projectGalleryOverlay) {
    const pg = config.styles.projectGalleryOverlay;
    if (typeof pg.titleFontSize !== 'string') errors.push("styles.projectGalleryOverlay.titleFontSize must be a string.");
    if (typeof pg.descriptionFontSize !== 'string') errors.push("styles.projectGalleryOverlay.descriptionFontSize must be a string.");
    if (typeof pg.titleColor !== 'string') errors.push("styles.projectGalleryOverlay.titleColor must be a string.");
    if (typeof pg.descriptionColor !== 'string') errors.push("styles.projectGalleryOverlay.descriptionColor must be a string.");
    if (typeof pg.linkColor !== 'string') errors.push("styles.projectGalleryOverlay.linkColor must be a string.");
    if (typeof pg.textColor !== 'string') errors.push("styles.projectGalleryOverlay.textColor must be a string.");
    if (typeof pg.alwaysVisibleDesktop !== 'boolean') errors.push("styles.projectGalleryOverlay.alwaysVisibleDesktop must be a boolean.");
	}
    // Lightbox
    if (!config.lightbox || typeof config.lightbox !== 'object') errors.push("siteConfig.lightbox is undefined or not an object.");
    if (config.lightbox && typeof config.lightbox.autoFullscreenOnClick !== 'boolean') errors.push("siteConfig.lightbox.autoFullscreenOnClick must be a boolean.");
    if (config.lightbox && config.lightbox.lightboxThemeLight && !['light', 'dark'].includes(config.lightbox.lightboxThemeLight)) errors.push("siteConfig.lightbox.lightboxThemeLight must be 'light' or 'dark'.");
    if (config.lightbox && config.lightbox.lightboxThemeDark && !['light', 'dark'].includes(config.lightbox.lightboxThemeDark)) errors.push("siteConfig.lightbox.lightboxThemeDark must be 'light' or 'dark'.");

    // NEW: Custom Code validation
    if (config.customCode && typeof config.customCode !== 'object') errors.push("siteConfig.customCode must be an object.");
    if (config.customCode && config.customCode.customCSS && typeof config.customCode.customCSS !== 'string') errors.push("siteConfig.customCode.customCSS must be a string.");
    if (config.customCode && config.customCode.customJS && typeof config.customCode.customJS !== 'string') errors.push("siteConfig.customCode.customJS must be a string.");

    return errors;
}


// NEW: Function to apply SEO meta tags, favicon, and protection settings
window.applySEOMetaTags = function(localSeo = null) {
    const config = window.siteConfig;
    if (!config || !config.seo) return;

    // === Извлекаем значение из { value, source } или используем строку ===
    const extractValue = (obj) => {
        if (obj && typeof obj === 'object' && obj.value !== undefined) {
            return obj.value;
        }
        return obj;
    };

    // === Определяем источник SEO ===
    let seoSource = config.seo; // fallback
    
    // Поддержка переводов (i18n)
    if (config.i18n?.enabled && config.i18n.currentLanguage && config.translations) {
        const lang = config.i18n.currentLanguage;
        const trans = config.translations[lang]?.seo;
        if (trans) {
            seoSource = {
                title: extractValue(trans.title) || config.seo.title,
                description: extractValue(trans.description) || config.seo.description,
                keywords: extractValue(trans.keywords) || config.seo.keywords,
                author: extractValue(trans.author) || config.seo.author,
                ogTitle: extractValue(trans.ogTitle) || config.seo.ogTitle || config.seo.title,
                ogDescription: extractValue(trans.ogDescription) || config.seo.ogDescription || config.seo.description,
                ogImage: extractValue(trans.ogImage) || config.seo.ogImage || './files/preview.jpg',
                ogUrl: (extractValue(trans.ogUrl) || config.seo.ogUrl || window.location.href).trim(),
                ogType: extractValue(trans.ogType) || config.seo.ogType || 'website',
                twitterCard: extractValue(trans.twitterCard) || config.seo.twitterCard || 'summary_large_image',
                twitterTitle: extractValue(trans.twitterTitle) || config.seo.twitterTitle || config.seo.title,
                twitterDescription: extractValue(trans.twitterDescription) || config.seo.twitterDescription || config.seo.description,
                twitterImage: extractValue(trans.twitterImage) || config.seo.twitterImage || config.seo.ogImage || './files/preview.jpg',
                favicon: extractValue(trans.favicon) || config.seo.favicon || './files/favicon.png'
            };
        }
    }
    
    // Если переданы локальные SEO-данные — они имеют наивысший приоритет
    if (localSeo) {
        seoSource = {
            title: localSeo.title || seoSource.title,
            description: localSeo.description || seoSource.description,
            keywords: localSeo.keywords || seoSource.keywords,
            author: localSeo.author || seoSource.author,
            ogTitle: localSeo.ogTitle || localSeo.title || seoSource.ogTitle || seoSource.title,
            ogDescription: localSeo.ogDescription || localSeo.description || seoSource.ogDescription || seoSource.description,
            ogImage: localSeo.ogImage || seoSource.ogImage || './files/preview.jpg',
            // noindex/noai могут быть переданы внутри localSeo
            noindex: localSeo.noindex,
            noai: localSeo.noai,
            
            ogUrl: (localSeo.ogUrl || window.location.href).trim(),
            ogType: localSeo.ogType || seoSource.ogType || 'website',
            twitterCard: localSeo.twitterCard || seoSource.twitterCard || 'summary_large_image',
            twitterTitle: localSeo.twitterTitle || localSeo.title || seoSource.twitterTitle || seoSource.title,
            twitterDescription: localSeo.twitterDescription || localSeo.description || seoSource.twitterDescription || seoSource.description,
            twitterImage: localSeo.twitterImage || localSeo.ogImage || seoSource.twitterImage || seoSource.ogImage || './files/preview.jpg',
            favicon: localSeo.favicon || seoSource.favicon || './files/favicon.png'
        };
    }

    // --- Обновление стандартных SEO метатегов ---
    document.title = seoSource.title || config.site?.title || 'Portfolio';

    const setMeta = (name, content) => {
        let el = document.querySelector(`meta[name="${name}"]`);
        if (!el) {
            el = document.createElement('meta');
            el.name = name;
            document.head.appendChild(el);
        }
        el.setAttribute('content', content || '');
    };
    const setMetaProp = (property, content) => {
        let el = document.querySelector(`meta[property="${property}"]`);
        if (!el) {
            el = document.createElement('meta');
            el.setAttribute('property', property);
            document.head.appendChild(el);
        }
        el.setAttribute('content', content || '');
    };

    setMeta('description', seoSource.description);
    setMeta('keywords', seoSource.keywords);
    setMeta('author', seoSource.author);

    setMetaProp('og:title', seoSource.ogTitle);
    setMetaProp('og:description', seoSource.ogDescription);
    setMetaProp('og:image', seoSource.ogImage);
    setMetaProp('og:url', seoSource.ogUrl);
    setMetaProp('og:type', seoSource.ogType);

    setMeta('twitter:card', seoSource.twitterCard);
    setMeta('twitter:title', seoSource.twitterTitle);
    setMeta('twitter:description', seoSource.twitterDescription);
    setMeta('twitter:image', seoSource.twitterImage);

    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) favicon.href = seoSource.favicon;

    // --- Глобальные правила индексации С УЧЕТОМ ЛОКАЛЬНЫХ ---
    
    // 1. Robots
    let robotsContent = 'index, follow';
    // Если глобально задано что-то другое
    if (config.site.robotsTxtGlobal) {
        robotsContent = config.site.robotsTxtGlobal;
    }
    // Если на странице явно включен noindex - он перекрывает всё
    if (seoSource.noindex === true) {
        robotsContent = 'noindex, nofollow';
    }

    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (!robotsMeta) {
        robotsMeta = document.createElement('meta');
        robotsMeta.name = 'robots';
        document.head.appendChild(robotsMeta);
    }
    robotsMeta.content = robotsContent;

    // 2. NoAI
    let noaiContent = '';
    // Если глобально включено
    if (config.site.noaiGlobal) {
        noaiContent = 'noai';
    }
    // Если на странице явно включено noai
    if (seoSource.noai === true) {
        noaiContent = 'noai';
    }

    let noaiMeta = document.querySelector('meta[name="noai"]');
    if (!noaiMeta) {
        noaiMeta = document.createElement('meta');
        noaiMeta.name = 'noai';
        document.head.appendChild(noaiMeta);
    }
    noaiMeta.content = noaiContent;
}

// --- Helper functions for color manipulation ---
function lightenColor(hex, percent) {
    const f=parseInt(hex.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=(f>>8)&0x00FF,B=(f)&0x0000FF;
    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}

function darkenColor(hex, percent) {
    return lightenColor(hex, -percent);
}

// Function to update lightbox theme colors
function updateLightboxThemeColors() {
    const isDarkBodyTheme = body.classList.contains('dark-theme');
    const lightboxThemeLightConfig = window.siteConfig.lightbox.lightboxThemeLight || 'dark';
    const lightboxThemeDarkConfig = window.siteConfig.lightbox.lightboxThemeDark || 'light';

    let lightboxBgColor;
    let lightboxIconColor;
    let lightboxNavColor;

    if (isDarkBodyTheme) {
        // Site is in dark theme
        if (lightboxThemeDarkConfig === 'light') {
            lightboxBgColor = 'rgba(255, 255, 255, 0.95)'; // Light overlay for dark theme
            lightboxIconColor = 'black';
            lightboxNavColor = 'black'; // Black for nav arrows on light overlay
        } else { // 'dark'
            lightboxBgColor = 'rgba(0, 0, 0, 0.95)'; // Dark overlay for dark theme
            lightboxIconColor = 'white';
            lightboxNavColor = 'white'; // White for nav arrows on dark overlay
        }
    } else {
        // Site is in light theme
        if (lightboxThemeLightConfig === 'dark') {
            lightboxBgColor = 'rgba(0, 0, 0, 0.95)'; // Dark overlay for light theme
            lightboxIconColor = 'white';
            lightboxNavColor = 'white'; // White for nav arrows on dark overlay
        } else { // 'light'
            lightboxBgColor = 'rgba(255, 255, 255, 0.95)'; // Light overlay for light theme
            lightboxIconColor = 'black';
            lightboxNavColor = 'black'; // Black for nav arrows on light overlay
        }
    }

    // Ensure elements exist before trying to style them
    if (lightbox) {
        lightbox.style.backgroundColor = lightboxBgColor;
    }
    if (lightboxFullscreenIcon) {
        lightboxFullscreenIcon.style.color = lightboxIconColor;
    }
    // Update lightbox nav arrow colors
    if (lightboxArrowLeft) {
        lightboxArrowLeft.style.color = lightboxNavColor;
    }
    if (lightboxArrowRight) {
        lightboxArrowRight.style.color = lightboxNavColor;
    }
}

// --- Dark/Light Mode Toggle ---
function toggleDarkMode() {
    const body = document.body;
    // Определяем текущее состояние темы (тёмная или светлая)
    const isCurrentlyDark = body.classList.contains('dark-theme');
    // Определяем новое состояние (противоположное текущему)
    const newIsDark = !isCurrentlyDark;
    // Переключаем класс 'dark-theme' на body
    body.classList.toggle('dark-theme', newIsDark);
    // Сохраняем выбор пользователя в localStorage
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
    // --- ИСПРАВЛЕНИЕ: Получаем ТЕКУЩУЮ базовую тему напрямую из классов body ---
    // Ищем класс вида theme-<имя_темы> на элементе body
    const currentBaseThemeClass = Array.from(body.classList).find(cls => cls.startsWith('theme-'));
    let currentBaseTheme = 'classic'; // Тема по умолчанию, если класс не найден
    if (currentBaseThemeClass) {
        // Извлекаем имя темы из класса (например, 'theme-hase' -> 'hase')
        currentBaseTheme = currentBaseThemeClass.substring(6); // 'theme-'.length = 6
    }
    // Проверка на случай, если в классе указано что-то неожиданное
    const validBaseThemes = ['classic', 'hase', 'ocean', 'custom'];
    if (!validBaseThemes.includes(currentBaseTheme)) {
         console.warn(`Неизвестная базовая тема в классе body: ${currentBaseThemeClass}. Используется 'classic'.`);
         currentBaseTheme = 'classic';
    }
    // --- КОНЕЦ ИСПРАВЛЕНИЯ ---
    // Применяем цвета CSS-переменных для текущей базовой темы и нового режима
    applyColors(currentBaseTheme, newIsDark);
    // Обновляем иконки переключателей темы
    updateDarkModeIcons(newIsDark);
    // Обновляем цвета для специфичных элементов
    updateLightboxThemeColors();
    updateShowcaseBulletsColor();
    updateShowcaseTitleAndLinkColors();
}

// Function to apply initial theme on page load
function applyInitialThemeOnLoad() {
    const body = document.body;

// --- NEW: Apply fonts from the config as soon as the page loads ---
    if (window.ViewmanFonts && window.siteConfig) {
        ViewmanFonts.applyFonts(window.siteConfig);
    }
    
    // --- 1. Определяем, какую базовую тему использовать (classic, hase, ocean, custom) ---
    const configDefaultBaseTheme = window.siteConfig.styles?.defaultTheme || 'classic';
    // selectedTheme хранит имя базовой темы (например, 'hase'), установленной через админку или по умолчанию
    const currentBaseTheme = localStorage.getItem('selectedTheme') || configDefaultBaseTheme;
    // Убедимся, что используемая базовая тема допустима
    const validBaseThemes = ['classic', 'hase', 'ocean', 'custom'];
    const safeCurrentBaseTheme = validBaseThemes.includes(currentBaseTheme) ? currentBaseTheme : 'classic';

    // --- 2. Определяем, какой цветовой режим использовать (светлый/тёмный) ---
    const savedUserMode = localStorage.getItem('theme'); // 'light' или 'dark'
    const configDefaultMode = window.siteConfig.site?.colorTheme?.default || 'light';
    // const configManualToggle = window.siteConfig.site?.colorTheme?.manualToggle || false;
    // manualToggle влияет на UI, но не на начальное состояние по умолчанию

    let isDarkMode;
    if (savedUserMode) {
        // Если пользователь переключал тему, используем его выбор
        isDarkMode = (savedUserMode === 'dark');
    } else {
        // Если нет сохраненного выбора, используем значение по умолчанию из конфига
        isDarkMode = (configDefaultMode === 'dark');
    }

    // --- 3. Применяем классы темы к <body> ---
    // Сначала удалим все возможные классы базовых тем
    validBaseThemes.forEach(themeName => {
        body.classList.remove(`theme-${themeName}`);
    });
    // Добавляем класс текущей базовой темы
    body.classList.add(`theme-${safeCurrentBaseTheme}`);

    // Добавляем или удаляем класс тёмной темы
    body.classList.toggle('dark-theme', isDarkMode);

    // --- 4. Применяем цвета через applyColors ---
    // applyColors ожидает имя темы (classic, hase...) и булево значение isDark
    applyColors(safeCurrentBaseTheme, isDarkMode);
    
    // --- 4.1 Применяем настройки Project Gallery Overlay ---
const pg = window.siteConfig.styles.projectGalleryOverlay || {};
document.documentElement.style.setProperty('--project-overlay-title-font-size', pg.titleFontSize || '1.5rem');
document.documentElement.style.setProperty('--project-overlay-description-font-size', pg.descriptionFontSize || '1rem');
document.documentElement.style.setProperty('--project-overlay-title-color', pg.titleColor || 'white');
document.documentElement.style.setProperty('--project-overlay-description-color', pg.descriptionColor || '#cfcfcf');
document.documentElement.style.setProperty('--project-overlay-link-color', pg.linkColor || 'white');
document.documentElement.style.setProperty('--project-overlay-text-color', pg.textColor || 'white');

    // --- 5. Обновляем иконки переключателей ---
    updateDarkModeIcons(isDarkMode);

    // --- 6. Обновляем специфичные элементы ---
    updateLightboxThemeColors();
    updateShowcaseBulletsColor();
    updateShowcaseTitleAndLinkColors();
    
// === ЕДИНАЯ ЗАЩИТА ИЗОБРАЖЕНИЙ (исправленная, без pointer-events на img) ===
function applyImageProtection() {
    const oldStyle = document.getElementById('image-protection-style');
    if (oldStyle) oldStyle.remove();

    const style = document.createElement('style');
    style.id = 'image-protection-style';

    const config = window.siteConfig;
    if (config?.site?.protectImages) {
        style.textContent = `
            /* Защита: отключаем перетаскивание и выделение */
            .gallery-section img,
            .text-content-section img {
                -webkit-user-drag: none !important;
                -khtml-user-drag: none !important;
                -moz-user-drag: none !important;
                -o-user-drag: none !important;
                user-drag: none !important;

                -webkit-user-select: none !important;
                -moz-user-select: none !important;
                -ms-user-select: none !important;
                user-select: none !important;

                /* НЕ используем pointer-events: none на img! */
            }

            /* Прозрачная маска поверх изображения */
            .gallery-section img::after,
            .text-content-section img::after {
                content: "";
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: transparent url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=") repeat;
                z-index: 10;
                pointer-events: none; /* Маска не мешает клику */
            }

            /* Важно: делаем img position: relative для ::after */
            .gallery-section img,
            .text-content-section img {
                position: relative !important;
                z-index: 1 !important;
            }

            /* Исключения: внутри лайтбокса — всё как обычно */
            #lightbox img {
                -webkit-user-drag: initial !important;
                user-drag: initial !important;
                -webkit-user-select: initial !important;
                user-select: initial !important;
            }
            #lightbox img::after {
                display: none !important;
            }
        `;
    } else {
        style.textContent = '';
    }

    document.head.appendChild(style);
}

// Применяем защиту
applyImageProtection();
}

// Вспомогательная функция для обновления иконок переключателя темы
function updateDarkModeIcons(isDarkMode) {
    // Обновление иконки на десктопной боковой панели
    if (darkModeIconDesktop) {
        darkModeIconDesktop.classList.remove('fa-moon', 'fa-sun');
        darkModeIconDesktop.classList.add(isDarkMode ? 'fa-sun' : 'fa-moon');
    }

    // Обновление иконки на мобильном меню
    if (darkModeIconMobile) {
        darkModeIconMobile.classList.remove('fa-moon', 'fa-sun');
        darkModeIconMobile.classList.add(isDarkMode ? 'fa-sun' : 'fa-moon');
    }

    // Обновление иконки в скрытом заголовке десктопа (когда сайдбар скрыт)
    if (darkModeIconDesktopHeader) {
        darkModeIconDesktopHeader.classList.remove('fa-moon', 'fa-sun');
        darkModeIconDesktopHeader.classList.add(isDarkMode ? 'fa-sun' : 'fa-moon');
    }
}

// Функция валидации SiteConfig
function validateSiteConfig(config) {
    const errors = [];
    if (config.styles) {
        // Разрешаем пользовательские темы (classic, hase, ocean, custom) вместо только light/dark
        const validThemes = ['classic', 'hase', 'ocean', 'custom', 'light', 'dark'];
        if (config.styles.defaultTheme && !validThemes.includes(config.styles.defaultTheme)) {
            errors.push(`siteConfig.styles.defaultTheme must be one of ${validThemes.join(', ')}.`);
        }
        const validModes = ['light', 'dark', 'manual'];
        if (config.styles.displayMode && !validModes.includes(config.styles.displayMode)) {
            errors.push(`siteConfig.styles.displayMode must be one of ${validModes.join(', ')}.`);
        }
    }
    if (errors.length > 0) {
        console.error('SiteConfig validation errors:', errors);
    }
    return errors.length === 0;
}

// Function to apply colors based on theme and mode
function applyColors(theme, isDark) {
    const themeColors = window.siteConfig.styles.themes[theme] || window.siteConfig.styles.themes['classic']; // Fallback на classic
    const mode = isDark ? 'dark' : 'light';
    const colors = themeColors[mode];
// 🔥 Обновляем showcase-цвета для CSS (переменные без суффикса light/dark)
document.documentElement.style.setProperty('--showcase-bullets-color', colors.showcaseBulletsColor || 'rgba(128, 128, 128, 0.5)');
document.documentElement.style.setProperty('--showcase-active-bullet-color', colors.showcaseActiveBulletColor || '#ffffff');

    const customStyles = `
        body.theme-${theme}${isDark ? '.dark-theme' : ''} {
            --background-color: ${colors.backgroundColor};
            --text-color: ${colors.textColor};
            --logo-color: ${colors.logoColor};
            --accent-color: ${colors.accentColor};
            --hover-accent-color: ${colors.hoverAccentColor};
            --button-bg: ${colors.buttonBg};
            --button-text: ${colors.buttonText};
            --button-hover-bg: ${colors.buttonHoverBg};
            --overlay-bg: ${colors.overlayBg};
            --overlay-inner-bg: ${colors.overlayInnerBg};
            --box-shadow: ${colors.boxShadow};
            --image-shadow: ${colors.imageShadow};
            --back-to-top-bg: ${colors.backToTopBg};
            --menu-bg: ${colors.menuBg};
            --menu-border: ${colors.menuBorder};
            --header-bg: ${colors.headerBg};
            --header-shadow: ${colors.headerShadow};
            --showcase-title-color: ${colors.showcaseTitleColor};
            --showcase-link-color: ${colors.showcaseLinkColor};
        }
    `;
    let styleEl = document.getElementById('theme-colors');
    if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'theme-colors';
        document.head.appendChild(styleEl);
    }
    // Добавляем :root блок — WebKit scrollbar псевдоэлементы читают var()
    // только из :root, игнорируя cascade через body. Пишем сюда напрямую
    // чтобы скроллбар получил правильный цвет текущей темы.
    const rootBlock = `
    :root {
        --accent-color: ${colors.accentColor};
        --hover-accent-color: ${colors.hoverAccentColor};
        --showcase-bullets-color: ${colors.showcaseBulletsColor || 'rgba(128, 128, 128, 0.5)'};
        --showcase-active-bullet-color: ${colors.showcaseActiveBulletColor || '#ffffff'};
    }
`;
    styleEl.textContent = customStyles + rootBlock;
}

// Функция для изменения темы (например, при выборе в админке)
function changeTheme(newTheme) {
    document.body.classList.remove('theme-classic', 'theme-hase', 'theme-ocean', 'theme-custom');
    document.body.classList.add(`theme-${newTheme}`);
    localStorage.setItem('selectedTheme', newTheme);
    applyColors(newTheme, document.body.classList.contains('dark-theme'));
}


// Остальной код (например, функции для карусели, меню и т.д.) остается без изменений
// Убедитесь, что он не конфликтует с новыми функциями


// Show/hide fullscreen controls (for when autoFullscreenOnClick is false)
function showFullscreenControls() {
    if (window.siteConfig.lightbox.autoFullscreenOnClick) return; // Skip if in auto-fullscreen mode

    clearTimeout(fullscreenControlsTimeout);
    if (lightboxFullscreenIcon && lightbox.classList.contains('active')) { // Only show if lightbox is active
        lightboxFullscreenIcon.style.display = 'block'; // Ensure it displays
        setTimeout(() => { // Small delay to ensure display change registers for transition
            lightboxFullscreenIcon.classList.add('show-icon');
        }, 10);
        // Hide after 3 seconds of inactivity
        fullscreenControlsTimeout = setTimeout(() => {
            hideFullscreenControls();
        }, 3000);
    }
}

function hideFullscreenControls() {
    if (window.siteConfig.lightbox.autoFullscreenOnClick) return; // Skip if in auto-fullscreen mode

    if (lightboxFullscreenIcon) {
        lightboxFullscreenIcon.classList.remove('show-icon');
        // Fully hide after transition
        setTimeout(() => {
            // Only hide display if 'show-icon' class is still not present (i.e., it hasn't been re-shown during the timeout)
            if (!lightboxFullscreenIcon.classList.contains('show-icon')) {
                lightboxFullscreenIcon.style.display = 'none';
            }
        }, 500); // Changed to 500ms
    }
}

// Toggle fullscreen mode
function toggleFullscreen() {
    const elem = lightbox; // Target the entire lightbox overlay
    if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement || elem.classList.contains('pseudo-fullscreen')) {
        // If currently in fullscreen (native or pseudo), exit fullscreen
        safeExitFullscreen();
    } else {
        // If not in fullscreen, request fullscreen
        safeRequestFullscreen(elem);
    }
}

// Fullscreen change handler to update icon
function handleFullscreenChange() {
    if (!lightboxFullscreenIcon) return; // Exit if icon element does not exist

    const autoFullscreenMode = window.siteConfig.lightbox.autoFullscreenOnClick;

    if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement || lightbox.classList.contains('pseudo-fullscreen')) {
        // We are now in fullscreen
        // Only update icon appearance if NOT in auto-fullscreen mode
        if (!autoFullscreenMode) {
            lightboxFullscreenIcon.classList.remove('fa-expand');
            lightboxFullscreenIcon.classList.add('fa-compress');
            lightboxFullscreenIcon.style.display = 'block'; // Ensure it displays
            setTimeout(() => {
                lightboxFullscreenIcon.classList.add('show-icon');
            }, 10);
            showFullscreenControls(); // Restart mouse activity timeout
        } else {
            // In auto-fullscreen mode, ensure it stays hidden
            lightboxFullscreenIcon.style.display = 'none';
            lightboxFullscreenIcon.classList.remove('show-icon');
        }
    }
    else {
        // We have exited fullscreen
        // Only update icon appearance if NOT in auto-fullscreen mode
        if (!autoFullscreenMode) {
            lightboxFullscreenIcon.classList.remove('fa-compress');
            lightboxFullscreenIcon.classList.add('fa-expand');
            showFullscreenControls(); // Restart mouse activity timeout
        } else {
            // In auto-fullscreen mode, ensure it stays hidden
            lightboxFullscreenIcon.style.display = 'none';
            lightboxFullscreenIcon.classList.remove('show-icon');
        }
    }
}

/* ---------- Slide helpers (insert after toggleFullscreen or next to other helpers) ---------- */

function setSlideCSSVars(duration = 500, easing = 'ease') {
  // синхронизируем CSS-переменные, которые будем читать в стилях
  document.documentElement.style.setProperty('--slide-duration', `${duration}ms`);
  document.documentElement.style.setProperty('--slide-easing', easing);
}

function calcDirection(prevIndex, nextIndex, len) {
  if (!Number.isInteger(len) || len <= 1) return 'next';
  if (prevIndex == null || isNaN(prevIndex)) return 'next';
  
  // Простая логика: если индекс увеличился (или перешёл с последнего на первый) - next
  // если уменьшился (или перешёл с первого на последний) - prev
  if (nextIndex === (prevIndex + 1) % len) {
    return 'next'; // Движение вперёд
  } else if (nextIndex === (prevIndex - 1 + len) % len) {
    return 'prev'; // Движение назад
  }
  
  // Для прыжков на большие расстояния определяем кратчайший путь
  const diff = (nextIndex - prevIndex + len) % len;
  return diff <= Math.floor(len / 2) ? 'next' : 'prev';
}

function getLightboxTransition() {
  const t = window.siteConfig?.lightbox?.transition || 'fade';
  const dur = window.siteConfig?.lightbox?.slideDuration ?? 500;
  const easing = window.siteConfig?.lightbox?.slideEasing ?? 'ease';
  setSlideCSSVars(dur, easing);
  return t;
}

function getGalleryTransition(galleryCarouselConfig = null) {
  // per-gallery override -> global galleriesGlobal -> default 'fade'
  const global = window.siteConfig?.galleriesGlobal?.carouselTransition ?? 'fade';
  const chosen = galleryCarouselConfig?.transition ?? global;
  const dur = galleryCarouselConfig?.slideDuration ?? window.siteConfig?.galleriesGlobal?.carouselSlideDuration ?? 500;
  const easing = galleryCarouselConfig?.slideEasing ?? window.siteConfig?.galleriesGlobal?.carouselSlideEasing ?? 'ease';
  setSlideCSSVars(dur, easing);
  return chosen;
}

/**
 * Shows the next/previous image in the lightbox.
 * @param {number} index The index of the image to show.
 */
// ---------------- Lightbox: navigation + display с поддержкой slide/fade ----------------

function showImage(index) {
    if (!isGalleryContext || allVisibleImages.length === 0) {
        return;
    }

    const len = allVisibleImages.length;
    if (len === 1) return; // Не навигируем, если только одно изображение
    
    // Циклическая навигация
    let nextIndex = index;
    if (nextIndex < 0) {
        nextIndex = len - 1;
    } else if (nextIndex >= len) {
        nextIndex = 0;
    }
    
    const prevIndex = currentImageIndex;
    
    // Если индекс не изменился - выходим
    if (nextIndex === prevIndex && len > 1) {
        return;
    }
    
    const imageData = allVisibleImages[nextIndex];
    
    // УПРОЩЕННАЯ логика определения направления
    let direction = 'next';
    if (prevIndex === len - 1 && nextIndex === 0) {
        direction = 'next';
    } else if (prevIndex === 0 && nextIndex === len - 1) {
        direction = 'prev';
    } else {
        direction = nextIndex > prevIndex ? 'next' : 'prev';
    }
    
    currentImageIndex = nextIndex;
    
    const showLoaded = (loadedSrc) => {
        displayLightboxImage(loadedSrc, imageData.alt, direction);
    };

    if (imageData.needsLoading && imageData.post && imageData.potentialUrls) {
        attemptLoadImage(imageData.img, imageData.potentialUrls, imageData.post, (success, loadedSrc) => {
            if (success) {
                imageData.src = loadedSrc;
                imageData.needsLoading = false;
                showLoaded(loadedSrc);
            } else {
                // Если загрузка не удалась, пропускаем это изображение
                showImage(nextIndex + (direction === 'next' ? 1 : -1));
            }
        }, false);
    } else {
        displayLightboxImage(imageData.src, imageData.alt, direction);
    }
    updateLightboxHash();
}

// --- Lightbox: обновление hash при смене кадра ---
function updateLightboxHash() {
    if (!isGalleryContext || !allVisibleImages.length || isPopstateNavigation) return;

    const activeImg = allVisibleImages[currentImageIndex];
    const activeSection = activeImg?.img
        ? activeImg.img.closest('.content-section')
        : document.querySelector('.content-section.active');

    if (!activeSection) return;

    const newHash = `#${activeSection.id}/lightbox-${currentImageIndex + 1}`;
    // ИСПРАВЛЕНИЕ: используем replaceState для навигации внутри lightbox
    history.replaceState(null, '', newHash);
}

/**
 * displayLightboxImage(src, alt, direction)
 * direction: 'next' | 'prev' (опционально)
 * поддерживает два режима: fade (старое поведение) и slide (новое)
 */
function displayLightboxImage(src, alt, direction = 'next') {
    const transitionType = getLightboxTransition();

    // КРИТИЧНО: Всегда сначала полностью очищаем контейнер от ВСЕХ изображений
    const allOldImages = lightboxImageContainer.querySelectorAll('img');
    
    if (transitionType === 'fade') {
        // Fade: просто удаляем все старые и добавляем новое
        allOldImages.forEach(img => img.remove());
        
        const newImgElement = document.createElement('img');
        newImgElement.src = src;
        newImgElement.alt = alt;
        newImgElement.style.opacity = '0';
        newImgElement.className = 'visible';
        
        lightboxImageContainer.appendChild(newImgElement);
        
        setTimeout(() => {
            newImgElement.style.opacity = '';
        }, 50);

        preloadLightboxImages(currentImageIndex);
        const activeSection = document.querySelector('.content-section.active');
        if (activeSection) {
            history.replaceState(null, '', `#${activeSection.id}/lightbox-${currentImageIndex + 1}`);
        }
        return;
    }

    // Slide режим
    const currentImg = lightboxImageContainer.querySelector('img.slide-active');
    
    // КРИТИЧНО: Если нет активного изображения - это первое открытие lightbox
    if (!currentImg) {
        // Первое изображение - просто показываем в центре без анимации
        allOldImages.forEach(img => img.remove());
        
        const firstImg = document.createElement('img');
        firstImg.src = src;
        firstImg.alt = alt;
        firstImg.className = 'slide-active';
        
        // УБЕДИТЕСЬ, что начальные стили правильные
        firstImg.style.transform = 'translateX(0)';
        firstImg.style.opacity = '1';
        
        lightboxImageContainer.appendChild(firstImg);

        preloadLightboxImages(currentImageIndex);
        const activeSection = document.querySelector('.content-section.active');
        if (activeSection) {
            history.replaceState(null, '', `#${activeSection.id}/lightbox-${currentImageIndex + 1}`);
        }
        return;
    }
    
    // Есть активное изображение - делаем slide переход
    // Удаляем ВСЕ изображения кроме текущего активного
    allOldImages.forEach(img => {
        if (img !== currentImg) {
            img.remove();
        }
    });
    
    const nextImg = document.createElement('img');
    nextImg.src = src;
    nextImg.alt = alt;
    
    lightboxImageContainer.appendChild(nextImg);
    
    // Устанавливаем начальную позицию БЕЗ transition
    nextImg.style.transition = 'none';
    if (direction === 'next') {
        nextImg.className = 'slide-next';
    } else {
        nextImg.className = 'slide-prev';
    }

    // Принудительный reflow
    nextImg.offsetWidth;
    
    // Включаем transition обратно
    nextImg.style.transition = '';

    // Анимация
    requestAnimationFrame(() => {
        nextImg.className = 'slide-active';
        
        if (currentImg) {
            if (direction === 'next') {
                currentImg.className = 'slide-prev';
            } else {
                currentImg.className = 'slide-next';
            }
        }
    });

    // Удаляем старое изображение после анимации
    setTimeout(() => {
        if (currentImg && currentImg.parentNode) {
            currentImg.remove();
        }
    }, 600);

    preloadLightboxImages(currentImageIndex);
    const activeSection = document.querySelector('.content-section.active');
    if (activeSection) {
        history.replaceState(null, '', `#${activeSection.id}/lightbox-${currentImageIndex + 1}`);
    }
}

// Глобальная блокировка контекстного меню на изображениях
document.addEventListener('contextmenu', (e) => {
    if (window.siteConfig?.site?.protectImages && e.target.tagName === 'IMG') {
        e.preventDefault();
    }
});

/**
 * Получает изображения зина, отсортированные визуально (сверху-вниз, слева-направо).
 * @param {HTMLElement} section Секция зина (.zine-section)
 * @returns {HTMLImageElement[]} Массив отсортированных изображений
 */
function getSortedZineImages(section) {
    // 1. Берем все блоки, внутри которых есть картинки
    const blocks = Array.from(section.querySelectorAll('.zine-block'));
    const imageBlocks = blocks.filter(b => b.querySelector('img'));

    // 2. Сортируем блоки по координатам
    imageBlocks.sort((a, b) => {
        // parseFloat отбросит '%' и вернет число
        const topA = parseFloat(a.style.top) || 0;
        const topB = parseFloat(b.style.top) || 0;
        const leftA = parseFloat(a.style.left) || 0;
        const leftB = parseFloat(b.style.left) || 0;

        // Допуск (tolerance) для "одной строки". 
        // Если разница по вертикали меньше 1%, считаем, что они на одной строке.
        const rowTolerance = 1.0; 

        if (Math.abs(topA - topB) > rowTolerance) {
            return topA - topB; // Сортировка по вертикали (кто выше - тот раньше)
        }
        return leftA - leftB; // Сортировка по горизонтали (кто левее - тот раньше)
    });

    // 3. Возвращаем сами картинки из отсортированных блоков
    return imageBlocks.map(b => b.querySelector('img'));
}

/**
 * Opens the lightbox with a specified image.
 * @param {string} src The source URL of the image.
 * @param {string} altText The alt text for the image.
 * @param {HTMLElement} [originalImgElement=null] The original <img> element that was clicked.
 */
function openLightbox(src, altText = "Lightbox image", originalImgElement = null, index = null) {
	lightboxOpenedFromCarousel = false;
    console.log("openLightbox called with src:", src, "alt:", altText, "originalImgElement:", originalImgElement, "index:", index);
    
    sidebarStateBeforeLightbox = {
    bodySidebarHidden: document.body.classList.contains('sidebar-hidden'),
    mainNavHidden: mainNav?.classList.contains('hidden') || false,
    desktopHeaderHiddenSidebarDisplay: desktopHeaderHiddenSidebar?.style.display || 'none',
    menuToggleDesktopDisplay: menuToggleDesktop?.style.display || 'none'
};

    lightboxImageContainer.innerHTML = '';

    // Сброс контекста галереи ПЕРЕД его установкой
    isGalleryContext = false;
    allVisibleImages = [];
    currentImageIndex = 0;

    // Флаг для отслеживания первого открытия lightbox
    const wasLightboxClosed = !lightbox.classList.contains('active');

    // --- NEW: шорткод-галереи ---
    if (originalImgElement) {
        const shortcodeWrap = originalImgElement.closest('.posts-wrap[data-shortcode-id]');
        if (shortcodeWrap) {
            // Берём ВСЕ .post элементы из шорткод-галереи
            const allPosts = Array.from(shortcodeWrap.querySelectorAll('.post'));
            
            allVisibleImages = allPosts.map(post => {
                const img = post.querySelector('img');
                // Если изображение загружено
                if (post.classList.contains('loaded') || (img.src && !img.src.startsWith('data:image/gif;base64'))) {
                    return { src: img.src, alt: img.alt, post: post, img: img };
                }
                // Если не загружено
                const potentialUrls = JSON.parse(img.dataset.potentialUrls || '[]');
                return { 
                    src: potentialUrls[0] || '', 
                    alt: img.alt, 
                    post: post, 
                    img: img,
                    needsLoading: true,
                    potentialUrls: potentialUrls
                };
            });
            
            // Если index передан явно (из диплинка)
            if (typeof index === "number" && index >= 0 && index < allVisibleImages.length) {
                currentImageIndex = index;
            } else {
                // Ищем по элементу
                currentImageIndex = allVisibleImages.findIndex(item => item.img === originalImgElement);
            }
            
            if (currentImageIndex === -1) currentImageIndex = 0;
            isGalleryContext = (allVisibleImages.length > 1);

            // Создаём первое изображение ПОСЛЕ установки контекста
            const imgElement = document.createElement('img');
            imgElement.src = allVisibleImages[currentImageIndex].src;
            imgElement.alt = allVisibleImages[currentImageIndex].alt;

            imgElement.onload = () => {
                const transitionType = getLightboxTransition();
                imgElement.className = (transitionType === 'slide') ? 'slide-active' : 'visible';
                
                if (window.siteConfig.lightbox.autoFullscreenOnClick) {
                    toggleFullscreen(); 
                } else {
                    showFullscreenControls();
                }
                showLightboxNavControls();
            };

            lightboxImageContainer.appendChild(imgElement);
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';

            preloadLightboxImages(currentImageIndex);

            // Обновляем URL с ID текстовой страницы
            const textSection = shortcodeWrap.closest('.content-section');
            if (textSection) {
                // ИСПРАВЛЕНИЕ: pushState только если lightbox был закрыт
                if (wasLightboxClosed && !isPopstateNavigation) {
                    history.pushState(null, '', `#${textSection.id}/lightbox-${currentImageIndex + 1}`);
                } else {
                    history.replaceState(null, '', `#${textSection.id}/lightbox-${currentImageIndex + 1}`);
                }
            }

            if (lightboxFullscreenIcon) {
                if (window.siteConfig.lightbox.autoFullscreenOnClick) {
                    lightboxFullscreenIcon.style.display = 'none';
                    lightboxFullscreenIcon.classList.remove('show-icon');
                } else {
                    lightboxFullscreenIcon.style.display = 'block';
                }
            }
            return;
        }
    }

    // --- обычные случаи ---
    let containingSection = null;
    if (originalImgElement) {
        containingSection = originalImgElement.closest('.content-section');
    }

    if (containingSection) {
        // Case 1: regular gallery
        if (containingSection.classList.contains('gallery-section') &&
            !containingSection.classList.contains('single-image-carousel-parent') &&
            !containingSection.classList.contains('showcase-gallery-parent')) {
            const postsWrap = containingSection.querySelector('.posts-wrap');
            
            // КРИТИЧНО: Берём ВСЕ .post элементы по порядку
            const allPosts = Array.from(postsWrap.querySelectorAll('.post'));
            
            allVisibleImages = allPosts.map(post => {
                const img = post.querySelector('img');
                // Если изображение загружено, используем его src
                if (img.classList.contains('loaded') || (img.src && !img.src.startsWith('data:image/gif;base64'))) {
                    return { src: img.src, alt: img.alt, post: post, img: img };
                }
                // Если не загружено, используем первый потенциальный URL
                const potentialUrls = JSON.parse(img.dataset.potentialUrls || '[]');
                return { 
                    src: potentialUrls[0] || '', 
                    alt: img.alt, 
                    post: post, 
                    img: img,
                    needsLoading: true,
                    potentialUrls: potentialUrls
                };
            });
            
            // Если index передан явно, используем его
            if (typeof index === "number" && index >= 0 && index < allVisibleImages.length) {
                currentImageIndex = index;
            } else if (originalImgElement) {
                // Ищем по элементу
                currentImageIndex = allVisibleImages.findIndex(item => item.img === originalImgElement);
            } else {
                // Ищем по src
                currentImageIndex = allVisibleImages.findIndex(item => item.src === src);
            }
            
            if (currentImageIndex === -1) currentImageIndex = 0;
            isGalleryContext = (allVisibleImages.length > 1);
            
            // Обновляем URL с правильным индексом
            // ИСПРАВЛЕНИЕ: pushState только если lightbox был закрыт
            if (wasLightboxClosed && !isPopstateNavigation) {
                history.pushState(null, '', `#${containingSection.id}/lightbox-${currentImageIndex + 1}`);
            } else {
                history.replaceState(null, '', `#${containingSection.id}/lightbox-${currentImageIndex + 1}`);
            }
        }
        // Case 2: carousel
        else if (containingSection.classList.contains('single-image-carousel-parent')) {
			lightboxOpenedFromCarousel = true;
            allVisibleImages = carouselImagesData.map(img => ({ src: img.loadedSrc, alt: img.alt }));
            
            if (typeof index === "number" && index >= 0 && index < allVisibleImages.length) {
                currentImageIndex = index;
            } else {
                currentImageIndex = allVisibleImages.findIndex(img => img.src === src);
            }
            
            if (currentImageIndex === -1) currentImageIndex = 0;
            isGalleryContext = (allVisibleImages.length > 1);

            // ИСПРАВЛЕНИЕ: pushState только если lightbox был закрыт
            if (wasLightboxClosed && !isPopstateNavigation) {
                history.pushState(null, '', `#${containingSection.id}/lightbox-${currentImageIndex + 1}`);
            } else {
                history.replaceState(null, '', `#${containingSection.id}/lightbox-${currentImageIndex + 1}`);
            }
        }
        // Case 3: text section
        else if (containingSection.classList.contains('text-content-section')) {
            allVisibleImages = Array.from(containingSection.querySelectorAll('.prose img[onclick*="openLightbox"]')).map(img => ({
                src: img.src,
                alt: img.alt
            }));
            
            if (typeof index === "number" && index >= 0 && index < allVisibleImages.length) {
                currentImageIndex = index;
            } else {
                currentImageIndex = allVisibleImages.findIndex(img => img.src === src);
            }
            
            if (currentImageIndex === -1) currentImageIndex = 0;
            isGalleryContext = (allVisibleImages.length > 1);

            // ИСПРАВЛЕНИЕ: pushState только если lightbox был закрыт
            if (wasLightboxClosed && !isPopstateNavigation) {
                history.pushState(null, '', `#${containingSection.id}/lightbox-${currentImageIndex + 1}`);
            } else {
                history.replaceState(null, '', `#${containingSection.id}/lightbox-${currentImageIndex + 1}`);
            }
        }
        // === NEW: Case 4: Zine section (С ВИЗУАЛЬНОЙ СОРТИРОВКОЙ) ===
        else if (containingSection.classList.contains('zine-section')) {
            // Используем хелпер для получения картинок в визуальном порядке
            const zineImages = getSortedZineImages(containingSection);
            
            allVisibleImages = zineImages.map(img => ({
                src: img.src,
                alt: img.alt,
                img: img // Сохраняем ссылку на DOM элемент
            }));

            // Определяем индекс текущей
            if (typeof index === "number" && index >= 0 && index < allVisibleImages.length) {
                currentImageIndex = index;
            } else if (originalImgElement) {
                currentImageIndex = allVisibleImages.findIndex(item => item.img === originalImgElement);
            } else {
                currentImageIndex = allVisibleImages.findIndex(item => item.src === src);
            }

            if (currentImageIndex === -1) currentImageIndex = 0;
            isGalleryContext = (allVisibleImages.length > 1);

            // Обновляем URL
            if (wasLightboxClosed && !isPopstateNavigation) {
                history.pushState(null, '', `#${containingSection.id}/lightbox-${currentImageIndex + 1}`);
            } else {
                history.replaceState(null, '', `#${containingSection.id}/lightbox-${currentImageIndex + 1}`);
            }
        }
    }

    // Если src не задан, но есть index и allVisibleImages – берём картинку оттуда
    if ((!src || src === "undefined") && typeof index === "number" && index >= 0 && allVisibleImages.length > 0) {
        const chosen = allVisibleImages[index];
        if (chosen) {
            src = chosen.src;
            altText = chosen.alt;
        }
    }

    // Создаём первое изображение ПОСЛЕ установки всего контекста
    const imgElement = document.createElement('img');
    imgElement.src = src || '';
    imgElement.alt = altText || "Lightbox image";

    imgElement.onload = () => {
        const transitionType = getLightboxTransition();
        imgElement.className = (transitionType === 'slide') ? 'slide-active' : 'visible';
        
        if (window.siteConfig.lightbox.autoFullscreenOnClick) {
            toggleFullscreen(); 
        } else {
            showFullscreenControls();
        }
        showLightboxNavControls();
    };

    lightboxImageContainer.appendChild(imgElement);
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';

    preloadLightboxImages(currentImageIndex);

    if (lightboxFullscreenIcon) {
        if (window.siteConfig.lightbox.autoFullscreenOnClick) {
            lightboxFullscreenIcon.style.display = 'none';
            lightboxFullscreenIcon.classList.remove('show-icon');
        } else {
            lightboxFullscreenIcon.style.display = 'block';
        }
    }
}


/**
 * Closes the lightbox.
 */
function closeLightbox() {
	// Сброс обработчика клика для showcase
if (activeShowcaseGallery && showcaseClickHandler) {
    activeShowcaseGallery.removeEventListener('click', showcaseClickHandler);
    showcaseClickHandler = null;
}
    // Немедленно разрешаем прокрутку
    document.body.style.overflow = 'auto';

    // Сбрасываем все inline-стили у изображений
    const allLightboxImages = lightboxImageContainer.querySelectorAll('img');
    allLightboxImages.forEach(img => {
        img.style.transform = '';
        img.style.opacity = '';
        img.style.transition = '';
    });

    lightbox.classList.remove('active'); // Начинаем анимацию закрытия
    safeExitFullscreen(); // Выходим из полноэкранного режима

    hideFullscreenControls();
    hideLightboxNavControls();
    stopCarouselAutoplay();
    stopShowcaseAutoplay();

    // Ждём завершения анимации
    setTimeout(() => {
        lightboxImageContainer.innerHTML = '';

        // --- ВОССТАНОВЛЕНИЕ состояния сайдбара ---
        if (window.innerWidth > 768) { // Только для десктопа
            // Восстанавливаем состояние сайдбара таким, каким оно было до открытия лайтбокса
            if (sidebarStateBeforeLightbox.bodySidebarHidden) {
                document.body.classList.add('sidebar-hidden');
            } else {
                document.body.classList.remove('sidebar-hidden');
            }
            
            if (sidebarStateBeforeLightbox.mainNavHidden) {
                mainNav?.classList.add('hidden');
            } else {
                mainNav?.classList.remove('hidden');
            }
            
            if (desktopHeaderHiddenSidebar) {
                desktopHeaderHiddenSidebar.style.display = sidebarStateBeforeLightbox.desktopHeaderHiddenSidebarDisplay;
            }
            
            if (menuToggleDesktop) {
                menuToggleDesktop.style.display = sidebarStateBeforeLightbox.menuToggleDesktopDisplay;
            }
        }

        // --- Синхронизация с контентом ---
              if (lightboxOpenedFromCarousel && activeCarouselGallery) {
          const newCarouselIndex = currentImageIndex;
          const oldCarouselIndex = carouselCurrentIndex; // Сохраняем старый индекс ДО обновления
          if (newCarouselIndex >= 0 && newCarouselIndex < carouselImagesData.length) {
              carouselCurrentIndex = newCarouselIndex;
              // Перезагружаем картинку ТОЛЬКО если индекс изменился
              // (пользователь листал в лайтбоксе). Если тот же — картинка
              // уже показана, и перезагрузка вызвала бы двойное мигание.
              if (newCarouselIndex !== oldCarouselIndex) {
                  _loadSingleCarouselImage(carouselImagesData[carouselCurrentIndex]);
              }
              const section = activeCarouselGallery.closest('.content-section');
              if (section && section.id && !isPopstateNavigation) {
                  history.replaceState(null, '', `#${section.id}/carousel-${carouselCurrentIndex + 1}`);
              }
          }
      }
        else if (isGalleryContext && allVisibleImages[currentImageIndex]) {
            const thumb = allVisibleImages[currentImageIndex].img;
            if (thumb) {
                const section = thumb.closest('.content-section');
                if (section && section.id && !isPopstateNavigation) {
                    history.pushState(null, '', `#${section.id}`);
                }
                thumb.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }

        // Сброс состояния
        isGalleryContext = false;
        allVisibleImages = [];
        currentImageIndex = 0;
        lightboxOpenedFromCarousel = false;
    }, 500);
}



// NEW: Show/hide lightbox navigation arrows
function showLightboxNavControls() {
    clearTimeout(lightboxNavTimeout);
    if (lightbox.classList.contains('active') && isGalleryContext) { // Only show if lightbox is active and in gallery context
        lightboxArrowLeft.classList.add('show-arrow');
        lightboxArrowRight.classList.add('show-arrow');
        lightboxNavTimeout = setTimeout(() => {
            hideLightboxNavControls();
        }, 3000); // Hide after 3 seconds of inactivity
    } else {
        hideLightboxNavControls(); // Ensure hidden if not in gallery context
    }
}

function hideLightboxNavControls() {
    if (lightboxArrowLeft) lightboxArrowLeft.classList.remove('show-arrow');
    if (lightboxArrowRight) lightboxArrowRight.classList.remove('show-arrow');
}

// Global observer for vertical scrolling galleries (grid, masonry)
const verticalImageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const postDiv = entry.target;
            const imgElement = postDiv.querySelector('img');
            if (imgElement && imgElement.dataset.potentialUrls) {
                const potentialUrls = JSON.parse(imgElement.dataset.potentialUrls);
                attemptLoadImage(imgElement, potentialUrls, postDiv, (success) => {
                    if (success) {
                        observer.unobserve(postDiv); // Stop observing once loaded
                        // После загрузки основного изображения, предзагружаем следующие
                        const allGalleryImages = Array.from(postDiv.closest('.posts-wrap').querySelectorAll('.post img'));
                        const currentIndex = allGalleryImages.indexOf(imgElement);
                        if (currentIndex !== -1) {
                            preloadNextNImages(allGalleryImages, currentIndex, preloadCount);
                        }
                    }
                }, false); // Indicate this is NOT a carousel image
            }
        }
    });
}, {
    rootMargin: '0px 0px 800px 0px', // Load images when they are 100px from viewport (vertical)
    threshold: 0.01
});

// Map to store IntersectionObserver instances for horizontal galleries (by gallery ID)
const horizontalGalleryObservers = new Map();

/**
 * Attempts to load an image by iterating through potential URLs.
 * @param {HTMLImageElement} imgElement The <img> element to load.
 * @param {string[]} potentialUrls Array of URLs to try.
 * @param {HTMLElement} postDiv The .post container to manage loading state.
 * @param {function(boolean, string?): void} callback Callback function (success, loadedSrc?).
 * @param {boolean} isCarouselImage Indicates if this is a carousel image to prevent removing postDiv on error.
 */
function attemptLoadImage(imgElement, potentialUrls, postDiv, callback, isCarouselImage = false) {
    let currentUrlIndex = 0;
    let img = new Image(); // Use a temporary Image object for loading check

    const tryNext = () => {
        if (currentUrlIndex < potentialUrls.length) {
            const urlToTry = potentialUrls[currentUrlIndex];
            img.src = urlToTry; // Attempt load via temporary Image
            currentUrlIndex++;
        } else {
            // All attempts failed
            console.warn(`Image NOT FOUND: Failed to load image after trying all URLs. First URL attempted: ${potentialUrls[0]}. All potential URLs tried:`, potentialUrls);
            if (callback) callback(false); // Indicate failure

            // Only remove the postDiv if it's NOT a carousel image, as carousels
            // handle missing images by skipping to the next.
            if (postDiv && !isCarouselImage) {
                postDiv.remove();
            }
        }
    };

    img.onload = () => {
        // If the temporary Image loaded successfully, set the src for the real imgElement
        imgElement.src = img.src;
        if (postDiv) {
            postDiv.classList.add('loaded'); // Add 'loaded' class to display image and hide spinner
        }
        if (callback) callback(true, img.src); // Indicate success
    };

    img.onerror = tryNext; // If current src fails to load, try next one

    // Start the loading process
    tryNext(); // Start with the first URL
}


/**
 * Calculates and updates the dynamic height of the carousel container.
 * This function considers:
 * - Viewport height
 * - Header height (mobile or desktop hidden sidebar)
 * - Carousel section top/bottom padding (--carousel-section-padding-y)
 * - Carousel caption height (--carousel-caption-h)
 * - Sidebar width (which affects overall content area width, though not directly height)
 */
function updateCarouselHeight() {
    const rootStyle = document.documentElement.style;
    const isMobile = window.innerWidth <= 768;
    const isSidebarHidden = window.innerWidth > 768 && body.classList.contains('sidebar-hidden');
    const isContentWithHeader = hasVisibleHeader(activeCarouselGallery ? activeCarouselGallery.closest('.content-section').id : '');

    let headerHeight = 0;
    if (isMobile) {
        headerHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--mobile-header-height')) || 0;
    } else if (isSidebarHidden && isContentWithHeader) { // Only count desktop header if sidebar is hidden AND content has its own header
        headerHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--desktop-header-height')) || 0;
    }

    const carouselSectionPaddingY = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--carousel-section-padding-y')) || 0;
    const carouselCaptionHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--carousel-caption-h')) || 0;

    // Viewport height
const viewportHeight = window.innerHeight;

// Calculate total vertical space taken by non-carousel elements
// ВАЖНО: подпись теперь не вычитаем, иначе картинка «съедается».
const verticalOffset = headerHeight + (carouselSectionPaddingY * 2);

// Remaining height for the carousel (картинка + caption вместе)
const dynamicHeight = viewportHeight - verticalOffset;
    // Set the CSS variable for the carousel's dynamic height
    if (activeCarouselGallery) {
        activeCarouselGallery.style.setProperty('--carousel-dynamic-h', `${dynamicHeight}px`);
    }
}


// --- Single Image Carousel Functions ---
/**
 * Loads and displays a single carousel image.
 * @param {object} imageData Object with image data (id, alt, caption, potentialUrls, loadedSrc).
 * @returns {Promise<boolean>} Promise that resolves to true if image loaded, false otherwise.
 */
function _loadSingleCarouselImage(imageData) {
    return new Promise((resolve) => {
        if (!imageData) {
            console.error("No image data provided to _loadSingleCarouselImage.");
            resolve(false);
            return;
        }

        const imgElement = document.querySelector('#carouselImage img');
        const captionElement = document.getElementById('carouselCaption');
        const currentPostDiv = document.getElementById('carouselImage'); // This is the .post wrapper

        if (!imgElement || !currentPostDiv) {
            console.error("Carousel elements not found.");
            resolve(false);
            return;
        }

        // Hide any previous error message if it was there
        let carouselErrorMessage = document.getElementById('carouselErrorMessage');
        if (carouselErrorMessage) {
            carouselErrorMessage.classList.remove('opacity-100');
            carouselErrorMessage.classList.add('opacity-0');
            setTimeout(() => carouselErrorMessage.remove(), 300); // Remove after fade-out
        }

        const hideCaptionForCarousel = currentCarouselConfig.hideCaption !== undefined ? currentCarouselConfig.hideCaption : false;

        // Start fading out current image and its caption
        imgElement.classList.remove('image-visible');
        if (captionElement) {
            captionElement.classList.remove('active');
        }
        currentPostDiv.classList.remove('loaded'); // Remove loaded to re-trigger spinner if needed for next image

  // === isFirstLoad: если нет активного слайда — без задержки ===
  const isFirstLoad = !currentPostDiv.classList.contains('active') && !imgElement.classList.contains('image-visible');

  const loadContent = () => {
      // Clear src here AFTER fade-out starts
      imgElement.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='; // Placeholder
      imgElement.alt = imageData.alt;

            if (captionElement) {
                if (!hideCaptionForCarousel) {
                    captionElement.textContent = imageData.caption;
                    captionElement.style.display = 'flex'; // Use flex for proper centering and height calculation
                    // Ensure position is static if it was previously set to absolute
                    captionElement.style.position = 'static';
                    captionElement.style.bottom = '';
                    captionElement.style.left = '';
                    captionElement.style.right = '';

                } else {
                    captionElement.textContent = '';
                    captionElement.style.display = 'none';
                    // Reset position/bottom if display is none to prevent phantom height
                    captionElement.style.position = '';
                    captionElement.style.bottom = '';
                    captionElement.style.left = '';
                    captionElement.style.right = '';
                }
            }

            attemptLoadImage(imgElement, imageData.potentialUrls, currentPostDiv, (success, loadedSrc) => {
                if (success) {
                    currentPostDiv.classList.add('loaded');
                    currentPostDiv.classList.add('active');
                    imgElement.classList.add('image-visible'); // This will trigger fade-in
                    if (captionElement && !hideCaptionForCarousel) {
                        captionElement.classList.add('active');
                    }
                    // === Update CSS var for caption height (учитываем margin) ===
let captionHeight = 0;
if (captionElement && !hideCaptionForCarousel) {
    const styles = getComputedStyle(captionElement);
    const mt = parseFloat(styles.marginTop) || 0;
    const mb = parseFloat(styles.marginBottom) || 0;
    captionHeight = (captionElement.offsetHeight || 0) + mt + mb;
} else {
    captionHeight = 0;
}
document.documentElement.style.setProperty('--carousel-caption-h', `${captionHeight}px`);
console.log('Карусель: Установлена высота подписи (--carousel-caption-h):', captionHeight); // DEBUG LOG);


                    imageData.loadedSrc = loadedSrc; // Store successfully loaded URL
                    console.log(`Carousel: Image loaded successfully: ${loadedSrc}`);
                    updateCarouselHeight(); // Update carousel height after image (and caption) loads
                    resolve(true);
                    // Предзагрузка следующего изображения
const nextIdx = (carouselCurrentIndex + 1) % carouselImagesData.length;
const nextData = carouselImagesData[nextIdx];
if (nextData && nextData.potentialUrls?.[0]) {
    const preloadNext = new Image();
    preloadNext.src = nextData.potentialUrls[0];
}
                } else {
                    console.warn('Carousel: Failed to load image after all attempts for:', imageData.potentialUrls[0]);
                    // DO NOT show error message to user on page
                    // Instead, simply move to the next image
                    // Ensure image and caption are hidden
                    imgElement.classList.remove('image-visible'); // Ensure hidden on error
                    if (captionElement) captionElement.classList.remove('active');
                    currentPostDiv.classList.remove('loaded'); // Hide spinner on error
                    document.documentElement.style.setProperty('--carousel-caption-h', '0px'); // Reset caption height on error
                    updateCarouselHeight(); // Update carousel height
                    resolve(false);
                }
            }, true); // !!! Indicate true for isCarouselImage !!!
  };

  if (isFirstLoad) {
      loadContent(); // Первая загрузка — без задержки
  } else {
      setTimeout(loadContent, 500); // Переключение — с fade-out
  }
});
}

// Manages carousel index and calls _loadSingleCarouselImage
async function showCarouselImage(index) {
    if (!activeCarouselGallery) {
        console.warn("Carousel: Active carousel gallery not found.");
        return;
    }

    // If no images in carouselImagesData, means nothing was found initially
    if (carouselImagesData.length === 0) {
        console.warn("Carousel: No images to display in carouselImagesData.");
        const currentPostDiv = document.getElementById('carouselImage');
        if (currentPostDiv) {
            let carouselErrorMessage = document.createElement('div');
            carouselErrorMessage.id = 'carouselErrorMessage';
            carouselErrorMessage.className = 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-700 text-white p-2 rounded-md z-20 text-center opacity-0 transition-opacity duration-300';
            currentPostDiv.innerHTML = ''; // Clear existing content
            currentPostDiv.appendChild(carouselErrorMessage);
            
            carouselErrorMessage.textContent = 'Галерея пуста или изображения не найдены.';
            carouselErrorMessage.classList.add('opacity-100');
            currentPostDiv.classList.remove('loaded');
            const imgElement = currentPostDiv.querySelector('img');
            if (imgElement) imgElement.classList.remove('image-visible');
            const captionElement = document.getElementById('carouselCaption');
            if (captionElement) captionElement.classList.remove('active');
        }
        document.documentElement.style.setProperty('--carousel-caption-h', '0px'); // Reset caption height
        updateCarouselHeight(); // Update carousel height
        stopCarouselAutoplay();
        hideCarouselNavControls(); // Скрыть контролы, если нет изображений
        hideCarouselFullscreenControls(); // Скрыть кнопку полноэкранного режима, если нет изображений
        return;
    }

    // Calculate next index
    const nextIndex = (index % carouselImagesData.length + carouselImagesData.length) % carouselImagesData.length;
    carouselCurrentIndex = nextIndex;
    console.log('Carousel: Attempting to show image at index:', carouselCurrentIndex); // New log
    // Show image
    const success = await _loadSingleCarouselImage(carouselImagesData[carouselCurrentIndex]);
    // If loading failed but carousel is not empty, immediately move to the next image
    if (!success && carouselImagesData.length > 0) {
        // No delay to avoid "stalling" on broken images
        showCarouselImage(carouselCurrentIndex + 1);
    }

    // >>> PATCH: Update URL hash for carousel image
    const activeSection = activeCarouselGallery.closest('.content-section');
    if (activeSection) {
        history.replaceState(null, '', `#${activeSection.id}/carousel-${carouselCurrentIndex + 1}`);
    }
    // <<< PATCH

}

function nextCarouselImage() {
    showCarouselImage(carouselCurrentIndex + 1);
}

function prevCarouselImage() {
    showCarouselImage(carouselCurrentIndex - 1);
}

function startCarouselAutoplay() {
    stopCarouselAutoplay(); // First clear any existing interval
    if (currentCarouselConfig.autoPlay && activeCarouselGallery && carouselImagesData.length > 0) { // Check for images
        carouselAutoplayIntervalId = setInterval(() => {
            nextCarouselImage();
        }, currentCarouselConfig.autoPlayInterval);
    }
}

function stopCarouselAutoplay() {
    if (carouselAutoplayIntervalId) {
        clearInterval(carouselAutoplayIntervalId);
        carouselAutoplayIntervalId = null;
    }
}

// Show/hide carousel navigation arrows AND fullscreen button via CSS classes
function showCarouselNavControls() {
    clearTimeout(carouselControlsTimeout);

    const showArrows = currentCarouselConfig.showArrows ?? true;
    const showFullscreenButton = currentCarouselConfig.showFullscreenButton ?? true;

    if (activeCarouselGallery && carouselImagesData.length > 0) { // Only show if active carousel and has images
        // Apply/remove show-arrow class based on config
        if (showArrows) {
            carouselArrowLeft.classList.add('show-arrow');
            carouselArrowRight.classList.add('show-arrow');
        } else {
            carouselArrowLeft.classList.remove('show-arrow');
            carouselArrowRight.classList.remove('show-arrow');
        }
        
        // Apply/remove show-icon class based on config
        if (showFullscreenButton) {
            carouselFullscreenIcon.classList.add('show-icon');
        } else {
            carouselFullscreenIcon.classList.remove('show-icon');
        }

        carouselControlsTimeout = setTimeout(() => {
            hideCarouselNavControls();
            hideCarouselFullscreenControls();
        }, 3000); // Hide all after 3 seconds of inactivity
    } else {
        // If no active carousel or no images, ensure all classes are removed
        hideCarouselNavControls();
        hideCarouselFullscreenControls();
    }
}

function hideCarouselNavControls() {
    carouselArrowLeft.classList.remove('show-arrow');
    carouselArrowRight.classList.remove('show-arrow');
}

// Function to hide carousel fullscreen button specifically
function hideCarouselFullscreenControls() {
    carouselFullscreenIcon.classList.remove('show-icon');
}

// --- Showcase: Show/hide navigation arrows via CSS classes ---
function showShowcaseNavControls() {
    clearTimeout(showcaseControlsTimeout);
    if (activeShowcaseGallery && showcaseImagesData.length > 0 && currentShowcaseConfig) {
        if (currentShowcaseConfig.showArrows !== false) {
            showcaseArrowLeft.classList.add('show-arrow');
            showcaseArrowRight.classList.add('show-arrow');
        } else {
            showcaseArrowLeft.classList.remove('show-arrow');
            showcaseArrowRight.classList.remove('show-arrow');
        }
        showcaseControlsTimeout = setTimeout(() => {
            hideShowcaseNavControls();
        }, 3000);
    } else {
        hideShowcaseNavControls();
    }
}

function hideShowcaseNavControls() {
    showcaseArrowLeft.classList.remove('show-arrow');
    showcaseArrowRight.classList.remove('show-arrow');
}

// --- Showcase Functions ---
/**
 * Loads and displays a single showcase image with title and link.
 * @param {object} imageData Object with image and showcase data (id, alt, potentialUrls, loadedSrc, title, link).
 * @returns {Promise<boolean>} Promise that resolves to true if image loaded, false otherwise.
 */
function _loadShowcaseImage(imageData) {
    return new Promise((resolve) => {
        if (!imageData) {
            console.error("No image data provided to _loadShowcaseImage.");
            resolve(false);
            return;
        }

        const imgElement = document.querySelector('#showcaseImage img');
        const titleElement = document.getElementById('showcaseTitle');
        const currentPostDiv = document.getElementById('showcaseImage'); // This is the .post wrapper
        const overlayDiv = document.getElementById('showcaseOverlay');
        const showcaseContentDiv = document.querySelector('.showcase-content'); // Контейнер для заголовка и ссылки

        if (!imgElement || !titleElement || !currentPostDiv || !overlayDiv || !showcaseContentDiv) {
            console.error("Showcase elements not found.");
            resolve(false);
            return;
        }

        // Hide current image, title, link and overlay for fade-out effect
        imgElement.classList.remove('image-visible');
        titleElement.classList.remove('active');
        overlayDiv.classList.remove('active');
        currentPostDiv.classList.remove('loaded'); // Remove loaded to re-trigger spinner if needed

        // ИСПРАВЛЕНИЕ: Более тщательная очистка заголовка
        const existingTitleLink = titleElement.querySelector('a');
        if (existingTitleLink) {
            existingTitleLink.removeEventListener('click', handleShowcaseLinkClick);
            existingTitleLink.remove();
        }
        // Полная очистка содержимого заголовка
        titleElement.innerHTML = '';
        titleElement.textContent = '';

        // Apply title and link colors based on current theme
        const isDarkBodyTheme = body.classList.contains('dark-theme');
const currentBaseThemeClass = Array.from(body.classList).find(cls => cls.startsWith('theme-'));
const currentBaseTheme = currentBaseThemeClass ? currentBaseThemeClass.substring(6) : 'classic';
const themeConfig = window.siteConfig.styles.themes[currentBaseTheme] || window.siteConfig.styles.themes['classic'];
const modeColors = isDarkBodyTheme ? themeConfig.dark : themeConfig.light;
const titleColor = modeColors.showcaseTitleColor || (isDarkBodyTheme ? 'white' : 'black');
const linkColor = modeColors.showcaseLinkColor || (isDarkBodyTheme ? '#87CEEB' : '#2b647b');

        // Determine if titles should be shown for the current showcase gallery
        const shouldShowTitlesGlobally = currentShowcaseConfig.showTitles ?? true; // Default to true if not specified
        
              // === isFirstLoad: если нет активного слайда — без задержки ===
      const isFirstLoad = !currentPostDiv.classList.contains('active') && !imgElement.classList.contains('image-visible');

      const loadContent = () => {
          // Clear src here AFTER fade-out starts
          imgElement.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='; // Placeholder
          imgElement.alt = imageData.alt;
          titleElement.style.fontSize = showcaseTitleFontSize; // Apply font size from config
            titleElement.style.color = titleColor; // Apply title color

            // Render title only if shouldShowTitlesGlobally is true AND imageData.title is present
            const shouldShowTitle = shouldShowTitlesGlobally && imageData.title;
            
            if (shouldShowTitle) {
                if (imageData.link && imageData.link.url) {
                    const titleLink = document.createElement('a');
                    titleLink.href = imageData.link.url;
                    titleLink.textContent = imageData.title;
                    titleLink.style.color = linkColor; // Apply link color
                    if (imageData.link.external) {
                        titleLink.target = '_blank';
                        titleLink.rel = 'noopener noreferrer';
                    }
                    titleLink.addEventListener('click', handleShowcaseLinkClick); // Add event listener
                    titleElement.appendChild(titleLink);
                } else {
                    titleElement.textContent = imageData.title; // If no link, just set the text
                }
            }
            
            attemptLoadImage(imgElement, imageData.potentialUrls, currentPostDiv, (success, loadedSrc) => {
                if (success) {
                    currentPostDiv.classList.add('loaded');
                    currentPostDiv.classList.add('active'); // Activate postDiv
                    imgElement.classList.add('image-visible'); // This will trigger fade-in
                    
                    // Activate title and overlay only if shouldShowTitle is true
                    if (shouldShowTitle) {
                        titleElement.classList.add('active');
                        overlayDiv.classList.add('active'); // Activate overlay only if title is visible
                    } else {
                        // Ensure overlay is removed if title is not shown
                        overlayDiv.classList.remove('active');
                    }

                    imageData.loadedSrc = loadedSrc; // Store successfully loaded URL
                    console.log(`Showcase: Image loaded successfully: ${loadedSrc}`);
                    resolve(true);
                    // Предзагрузка следующего изображения
const nextIdx = (showcaseCurrentIndex + 1) % showcaseImagesData.length;
const nextData = showcaseImagesData[nextIdx];
if (nextData && nextData.potentialUrls?.[0]) {
    const preloadNext = new Image();
    preloadNext.src = nextData.potentialUrls[0];
}
                } else {
                    console.warn('Showcase: Failed to load image after all attempts for:', imageData.potentialUrls[0]);
                    // If loading fails, ensure everything is hidden
                    imgElement.classList.remove('image-visible');
                    titleElement.classList.remove('active');
                    overlayDiv.classList.remove('active'); // Ensure overlay is hidden on error
                    currentPostDiv.classList.remove('loaded');
                    resolve(false);
                }
            }, true); // !!! Indicate true for isCarouselImage !!!
      };

      if (isFirstLoad) {
          loadContent(); // Первая загрузка — без задержки
      } else {
          setTimeout(loadContent, 500); // Переключение — с fade-out
      }
});
}

function handleShowcaseLinkClick(event) {
    const link = event.currentTarget; // Use currentTarget to refer to the <a> element
    const url = link.getAttribute('href');
    const isExternal = link.getAttribute('target') === '_blank';

    if (!isExternal && url.startsWith('#')) {
        event.preventDefault(); // Prevent default link behavior for internal anchors
        const targetId = url.substring(1); // Get section ID
        showContent(targetId); // Switch to that section
    }
    // For external links or links without #, allow browser to handle them
}

// Manages Showcase index and calls _loadShowcaseImage
async function showShowcaseImage(index) {
    if (!activeShowcaseGallery) {
        console.warn("Showcase: Active showcase gallery not found.");
        return;
    }

    if (showcaseImagesData.length === 0) {
        console.warn("Showcase: No images to display in showcaseImagesData (initial check).");
        const currentPostDiv = document.getElementById('showcaseImage');
        if (currentPostDiv) {
            let showcaseErrorMessage = document.createElement('div');
            showcaseErrorMessage.id = 'showcaseErrorMessage';
            showcaseErrorMessage.className = 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-700 text-white p-2 rounded-md z-20 text-center';
            currentPostDiv.innerHTML = ''; // Clear if anything is there
            currentPostDiv.appendChild(showcaseErrorMessage);
            showcaseErrorMessage.textContent = 'Шоукейс пуст или изображения не найдены в конфигурации.';
            currentPostDiv.classList.remove('loaded'); // Ensure spinner is hidden
        }
        stopShowcaseAutoplay();
        return;
    }

    // Calculate next index, ensuring it wraps around if it goes out of bounds
    const nextIndex = (index % showcaseImagesData.length + showcaseImagesData.length) % showcaseImagesData.length;
    showcaseCurrentIndex = nextIndex;
    console.log('Showcase: Attempting to show image at index:', showcaseCurrentIndex);
    
    // Update active class for bullets
    if (showcaseBulletsContainer && currentShowcaseConfig.showBullets) {
        Array.from(showcaseBulletsContainer.children).forEach((bullet, idx) => {
            if (idx === showcaseCurrentIndex) {
                bullet.classList.add('active');
            } else {
                bullet.classList.remove('active');
            }
        });
    }
    
    // ИСПРАВЛЕНИЕ: Убедитесь, что вызывается только один раз
    const success = await _loadShowcaseImage(showcaseImagesData[showcaseCurrentIndex]);
    
    // If loading failed but showcase is not empty, immediately move to the next image
    // This ensures the carousel doesn't "stall" on a broken image.
    if (!success && showcaseImagesData.length > 0) {
        console.warn(`Showcase: Image at index ${showcaseCurrentIndex} failed to load. Skipping to next image.`);
        showShowcaseImage(showcaseCurrentIndex + 1); // Recursively call to try next image
    }

    // >>> PATCH: Update URL hash for showcase image
    const activeSection = activeShowcaseGallery.closest('.content-section');
    if (activeSection) {
        history.replaceState(null, '', `#${activeSection.id}/showcase-${showcaseCurrentIndex + 1}`);
    }
    // <<< PATCH
}

function nextShowcaseImage() {
    showShowcaseImage(showcaseCurrentIndex + 1);
}

function prevShowcaseImage() {
    showShowcaseImage(showcaseCurrentIndex - 1);
}

function startShowcaseAutoplay() {
    stopShowcaseAutoplay();
    if (currentShowcaseConfig.autoPlay && activeShowcaseGallery && showcaseImagesData.length > 0) {
        showcaseAutoplayIntervalId = setInterval(() => {
            nextShowcaseImage();
        }, currentShowcaseConfig.autoPlayInterval);
    }
}

function stopShowcaseAutoplay() {
    if (showcaseAutoplayIntervalId) {
        clearInterval(showcaseAutoplayIntervalId);
        showcaseAutoplayIntervalId = null;
        // Сбрасываем таймаут контролов, чтобы они не остались видимыми
clearTimeout(showcaseControlsTimeout);
    }
}

// Update bullet colors based on theme
function updateShowcaseBulletsColor() {
    // Больше не задаём inline-стили!
    // CSS сам управляет цветами через переменные и класс .active
    // Функция оставлена для обратной совместимости, но ничего не делает
}

// NEW: Function to update showcase title and link colors based on theme
function updateShowcaseTitleAndLinkColors() {
    const titleElement = document.getElementById('showcaseTitle');
    if (!titleElement) return;
    
    const isDarkBodyTheme = body.classList.contains('dark-theme');
    const currentBaseThemeClass = Array.from(body.classList).find(cls => cls.startsWith('theme-'));
    const currentBaseTheme = currentBaseThemeClass ? currentBaseThemeClass.substring(6) : 'classic';
    
    const themeConfig = window.siteConfig.styles.themes[currentBaseTheme] || 
                        window.siteConfig.styles.themes['classic'];
    const modeColors = isDarkBodyTheme ? themeConfig.dark : themeConfig.light;
    
    const titleColor = modeColors.showcaseTitleColor || (isDarkBodyTheme ? 'white' : 'black');
    const linkColor = modeColors.showcaseLinkColor || (isDarkBodyTheme ? '#87CEEB' : '#2b647b');
    
    titleElement.style.color = titleColor;
    const titleLink = titleElement.querySelector('a');
    if (titleLink) {
        titleLink.style.color = linkColor;
    }
}

/**
 * Вспомогательная функция для предзагрузки изображения в фоновом режиме.
 * @param {string} url URL изображения для предзагрузки.
 */
function preloadImage(url) {
    if (!url) return;
    const img = new Image();
    img.src = url;
    // console.log(`Preloading: ${url}`); // Для отладки
}

/**
 * Предзагружает следующие N изображений в массиве.
 * @param {HTMLImageElement[]} imagesList Список всех img элементов в галерее.
 * @param {number} startIndex Индекс текущего отображаемого изображения.
 * @param {number} count Количество изображений для предзагрузки.
 */
function preloadNextNImages(imagesList, startIndex, count) {
    for (let i = 1; i <= count; i++) {
        const nextIndex = startIndex + i;
        if (nextIndex < imagesList.length) {
            const imgElement = imagesList[nextIndex];
            if (!imgElement.src || imgElement.src.startsWith('data:image/gif;base64')) { // Проверяем, не загружено ли уже
                const potentialUrls = JSON.parse(imgElement.dataset.potentialUrls); // Corrected JSON.PARSE to JSON.parse
                // Предзагружаем только первый доступный URL, так как это просто кэширование
                if (potentialUrls.length > 0) {
                    preloadImage(potentialUrls[0]);
                }
            }
        }
    }
}

/**
 * Предзагружает следующее и предыдущее изображения в контексте лайтбокса.
 * @param {number} currentIndex Текущий индекс изображения в лайтбоксе.
 */
function preloadLightboxImages(currentIndex) {
    if (!isGalleryContext || allVisibleImages.length === 0) return;

    // Предзагрузка следующего
    const nextIndex = (currentIndex + 1) % allVisibleImages.length;
    preloadImage(allVisibleImages[nextIndex].src);

    // Предзагрузка предыдущего
    const prevIndex = (currentIndex - 1 + allVisibleImages.length) % allVisibleImages.length;
    preloadImage(allVisibleImages[prevIndex].src);
}


// Helper function to shuffle an array (Fisher-Yates algorithm)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

/**
 * Loads images for a gallery.
 * @param {HTMLElement} containerElement The container element for images.
 * @param {string} layoutClass CSS class for the layout.
 * @param {number} count Expected number of images.
 * @param {string} folder Image folder.
 * @param {string[]} captions Array of captions.
 * @param {boolean} hideCaption Whether to hide captions.
 * @param {object} galleryData Gallery data object from siteConfig.
 * @returns {Promise<void>} Promise that resolves after attempting to load all images.
 */
function loadImageGallery(containerElement, layoutClass, count, folder, captions = [], hideCaption = false, galleryData = null) {
    containerElement.innerHTML = '';
    containerElement.className = `posts-wrap ${layoutClass}`;
    const imageRootPath = window.siteConfig.site.imageRootPath;

    // === ОПРЕДЕЛЯЕМ ПОРЯДОК ФОРМАТОВ ===
    const baseImageExtensions = ['webp', 'jpg', 'jpeg', 'png', 'avif'];
    const primaryFormat = window.siteConfig.site.primaryImageFormat?.toLowerCase();

    // === ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ ДЛЯ ГЕНЕРАЦИИ URL-ОВ В ПРАВИЛЬНОМ ПОРЯДКЕ ===
    function generatePotentialUrls(imgNumber, imgNumberPadded) {
        const urls = [];

        // 1. Сначала — паддингованные имена (01.webp, 01.jpg, ...)
        const paddedVariants = [];
        for (const ext of baseImageExtensions) {
            paddedVariants.push(`${imageRootPath}${folder}/${imgNumberPadded}.${ext}`);
            paddedVariants.push(`${imageRootPath}${folder}/${imgNumberPadded}.${ext.toUpperCase()}`);
        }

        // 2. Потом — без ведущего нуля (1.webp, 1.jpg, ...)
        const unpaddedVariants = [];
        if (imgNumber !== imgNumberPadded) {
            for (const ext of baseImageExtensions) {
                unpaddedVariants.push(`${imageRootPath}${folder}/${imgNumber}.${ext}`);
                unpaddedVariants.push(`${imageRootPath}${folder}/${imgNumber}.${ext.toUpperCase()}`);
            }
        }

        // Объединяем
        let allUrls = [...paddedVariants, ...unpaddedVariants];

        // 3. Если задан primaryFormat — перемещаем его варианты В НАЧАЛО
        if (primaryFormat && baseImageExtensions.includes(primaryFormat)) {
            const primaryPadded = `${imageRootPath}${folder}/${imgNumberPadded}.${primaryFormat}`;
            const primaryPaddedUpper = `${imageRootPath}${folder}/${imgNumberPadded}.${primaryFormat.toUpperCase()}`;
            const primaryUnpadded = imgNumber !== imgNumberPadded ? `${imageRootPath}${folder}/${imgNumber}.${primaryFormat}` : null;
            const primaryUnpaddedUpper = imgNumber !== imgNumberPadded ? `${imageRootPath}${folder}/${imgNumber}.${primaryFormat.toUpperCase()}` : null;

            const primaryFirst = [primaryPadded, primaryPaddedUpper];
            if (primaryUnpadded) primaryFirst.push(primaryUnpadded, primaryUnpaddedUpper);

            // Удаляем все вхождения primaryFormat из основного списка
            const filtered = allUrls.filter(url => {
                const lower = url.toLowerCase();
                return !lower.endsWith(`.${primaryFormat}`);
            });

            // Собираем итоговый порядок
            allUrls = [...primaryFirst, ...filtered];
        }

        // Убираем дубликаты
        return [...new Set(allUrls)];
    }

    if (layoutClass === 'gallery-single-image-carousel') {
        currentCarouselConfig = {
            randomOrder: galleryData.carouselConfig?.randomOrder ?? false,
            autoPlay: galleryData.carouselConfig?.autoPlay ?? false,
            autoPlayInterval: galleryData.carouselConfig?.autoPlayInterval ?? 3000,
            hideCaption: hideCaption,
            showArrows: galleryData.carouselConfig?.showArrows ?? true,
            showFullscreenButton: galleryData.carouselConfig?.showFullscreenButton ?? true
        };
        carouselImagesData = [];
        carouselCurrentIndex = 0;
        const promises = [];
        const tempCarouselImagesData = [];

        for (let i = 1; i <= count; i++) {
            const imgNumber = String(i);
            const imgNumberPadded = String(i).padStart(2, '0');
            const imageAlt = `Image ${i}`;
            const imageCaption = captions[i - 1] || `Image ${i}`;
            const potentialUrls = generatePotentialUrls(imgNumber, imgNumberPadded);

            const checkPromise = new Promise(resolve => {
                const img = new Image();
                let triedUrls = 0;
                img.onload = () => {
                    tempCarouselImagesData.push({
                        id: i,
                        alt: imageAlt,
                        caption: imageCaption,
                        potentialUrls: potentialUrls,
                        loadedSrc: img.src
                    });
                    resolve(true);
                };
                img.onerror = () => {
                    triedUrls++;
                    if (triedUrls < potentialUrls.length) {
                        img.src = potentialUrls[triedUrls];
                    } else {
                        console.warn(`Failed to find carousel image: ${potentialUrls[0]}`);
                        resolve(false);
                    }
                };
                if (potentialUrls.length > 0) {
                    img.src = potentialUrls[0];
                } else {
                    resolve(false);
                }
            });
            promises.push(checkPromise);
        }

        return Promise.all(promises).then(() => {
            tempCarouselImagesData.sort((a, b) => a.id - b.id);
            carouselImagesData = tempCarouselImagesData;

            if (carouselImagesData.length === 0) {
                console.error(`No images found for carousel in folder: ${folder}.`);
                const noImageMessageDiv = document.createElement('div');
                noImageMessageDiv.id = 'carouselErrorMessage';
                noImageMessageDiv.className = 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-700 text-white p-2 rounded-md z-20 text-center opacity-0 transition-opacity duration-300';
                noImageMessageDiv.textContent = 'Галерея пуста или изображения не найдены.';
                containerElement.appendChild(noImageMessageDiv);
                return;
            }

            const carouselImageDiv = document.createElement('div');
            carouselImageDiv.id = 'carouselImage';
            carouselImageDiv.className = 'post photopost';
            const imgElement = document.createElement('img');
            imgElement.alt = `Carousel Image`;
            imgElement.className = `wp-image-1 notPhotoset`;
            imgElement.loading = 'eager';
            imgElement.fetchPriority = 'high';
            const carouselCaptionDiv = document.createElement('div');
            carouselCaptionDiv.id = 'carouselCaption';
            carouselCaptionDiv.className = 'carousel-caption';
            carouselImageDiv.appendChild(imgElement);
            if (!hideCaption) {
                carouselImageDiv.appendChild(carouselCaptionDiv);
            }
            containerElement.appendChild(carouselImageDiv);
            containerElement.appendChild(carouselArrowLeft);
            containerElement.appendChild(carouselArrowRight);
            containerElement.appendChild(carouselFullscreenIcon);

            if (currentCarouselConfig.showArrows) {
                containerElement.classList.add('has-arrows');
            }

            carouselArrowLeft.addEventListener('click', (event) => {
                event.stopPropagation();
                prevCarouselImage();
                stopCarouselAutoplay();
            });
            carouselArrowRight.addEventListener('click', (event) => {
                event.stopPropagation();
                nextCarouselImage();
                stopCarouselAutoplay();
            });
            carouselFullscreenIcon.addEventListener('click', (event) => {
                event.stopPropagation();
                const imgElementForLightbox = activeCarouselGallery.querySelector('#carouselImage img');
                openLightbox(imgElementForLightbox.src, imgElementForLightbox.alt, imgElementForLightbox);
                stopCarouselAutoplay();
            });

            const needsSideGutters = !!currentCarouselConfig.showArrows || !!currentCarouselConfig.showFullscreenButton;
            document.documentElement.style.setProperty('--carousel-nav-gutter-w', needsSideGutters ? '3rem' : '0rem');

            containerElement.addEventListener('mousemove', showCarouselNavControls);
            containerElement.addEventListener('mouseleave', hideCarouselNavControls);
            hideCarouselNavControls();

            imgElement.addEventListener('click', (event) => {
                event.stopPropagation();
                const imgRect = imgElement.getBoundingClientRect();
                const clickX = event.clientX - imgRect.left;
                const imgWidth = imgRect.width;
                const leftThird = imgWidth / 3;
                const rightThird = imgWidth * 2 / 3;
                if (clickX > leftThird && clickX < rightThird) {
                    openLightbox(imgElement.src, imgElement.alt, imgElement);
                } else if (clickX < imgWidth / 2) {
                    prevCarouselImage();
                } else {
                    nextCarouselImage();
                }
                stopCarouselAutoplay();
            });

            imgElement.addEventListener('mousemove', (event) => {
                const imgRect = imgElement.getBoundingClientRect();
                const mouseX = event.clientX - imgRect.left;
                const imgWidth = imgRect.width;
                const leftZone = imgWidth / 3;
                const rightZone = imgWidth * 2 / 3;
                if (mouseX < leftZone) {
                    imgElement.style.cursor = 'w-resize';
                } else if (mouseX > rightZone) {
                    imgElement.style.cursor = 'e-resize';
                } else {
                    imgElement.style.cursor = 'zoom-in';
                }
            });
            imgElement.addEventListener('mouseleave', () => {
                imgElement.style.cursor = 'default';
            });
        });
    } else if (layoutClass === 'gallery-showcase') {
        containerElement.innerHTML = '';
        currentShowcaseConfig = {
    randomOrder: galleryData.carouselConfig?.randomOrder ?? false,
    autoPlay: galleryData.carouselConfig?.autoPlay ?? false,
    autoPlayInterval: galleryData.carouselConfig?.autoPlayInterval ?? 7000,
    showBullets: galleryData.carouselConfig?.showBullets ?? true,
    showTitles: galleryData.carouselConfig?.showTitles ?? true,
    showArrows: galleryData.carouselConfig?.showArrows ?? true  // НОВОЕ
};
        showcaseTitleFontSize = window.siteConfig.styles.showcaseTitleFontSize || "2rem";
        showcaseImagesData = [];
        showcaseCurrentIndex = 0;
        const showcasePromises = [];
        const tempShowcaseImagesData = [];

        for (let i = 1; i <= count; i++) {
            const imgNumber = String(i);
            const imgNumberPadded = String(i).padStart(2, '0');
            const imageAlt = `Showcase Image`;
            const showcaseItemData = galleryData.showcaseData?.[i - 1] || {};
            const title = showcaseItemData.title || null;
            const link = showcaseItemData.link || null;
            const potentialUrls = generatePotentialUrls(imgNumber, imgNumberPadded);

            const checkPromise = new Promise(resolve => {
                const img = new Image();
                let triedUrls = 0;
                img.onload = () => {
                    tempShowcaseImagesData.push({
                        id: i,
                        alt: imageAlt,
                        title: title,
                        link: link,
                        potentialUrls: potentialUrls,
                        loadedSrc: img.src
                    });
                    resolve(true);
                };
                img.onerror = () => {
                    triedUrls++;
                    if (triedUrls < potentialUrls.length) {
                        img.src = potentialUrls[triedUrls];
                    } else {
                        console.warn(`Failed to find showcase image: ${potentialUrls[0]}`);
                        resolve(false);
                    }
                };
                if (potentialUrls.length > 0) {
                    img.src = potentialUrls[0];
                } else {
                    resolve(false);
                }
            });
            showcasePromises.push(checkPromise);
        }

        return Promise.all(showcasePromises).then(() => {
            tempShowcaseImagesData.sort((a, b) => a.id - b.id);
            showcaseImagesData = tempShowcaseImagesData;

            if (showcaseImagesData.length === 0) {
                console.error(`No images found for Showcase gallery ID: ${galleryData.id}.`);
                const noImageMessageDiv = document.createElement('div');
                noImageMessageDiv.id = 'showcaseErrorMessage';
                noImageMessageDiv.className = 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-700 text-white p-2 rounded-md z-20 text-center';
                noImageMessageDiv.textContent = 'Шоукейс пуст или изображения не найдены в папке.';
                containerElement.appendChild(noImageMessageDiv);
                return;
            }

            const showcaseImageDiv = document.createElement('div');
            showcaseImageDiv.id = 'showcaseImage';
            showcaseImageDiv.className = 'post photopost';
            const imgElement = document.createElement('img');
            imgElement.alt = `Showcase Image`;
            imgElement.className = `wp-image-1 notPhotoset`;
            imgElement.loading = 'eager';
            imgElement.fetchPriority = 'high'; 
            const overlayDiv = document.createElement('div');
            overlayDiv.id = 'showcaseOverlay';
            overlayDiv.className = 'showcase-overlay';
            const contentDiv = document.createElement('div');
            contentDiv.className = 'showcase-content';
            const titleElement = document.createElement('h2');
            titleElement.id = 'showcaseTitle';
            titleElement.className = 'showcase-title';
            contentDiv.appendChild(titleElement);
            overlayDiv.appendChild(contentDiv);
            showcaseImageDiv.appendChild(imgElement);
            showcaseImageDiv.appendChild(overlayDiv);
            containerElement.appendChild(showcaseImageDiv);

            if (currentShowcaseConfig.showBullets) {
                showcaseBulletsContainer = document.createElement('div');
                showcaseBulletsContainer.id = 'showcaseBullets';
                showcaseBulletsContainer.className = 'showcase-bullets';
                for (let i = 0; i < showcaseImagesData.length; i++) {
                    const bullet = document.createElement('span');
                    bullet.classList.add('showcase-bullet');
                    bullet.dataset.index = i;
                    bullet.addEventListener('click', () => {
                        showShowcaseImage(parseInt(bullet.dataset.index));
                        stopShowcaseAutoplay();
                    });
                    showcaseBulletsContainer.appendChild(bullet);
                }
                containerElement.appendChild(showcaseBulletsContainer);
                // === SHOWCASE ARROWS ===
containerElement.appendChild(showcaseArrowLeft);
containerElement.appendChild(showcaseArrowRight);
if (currentShowcaseConfig.showArrows !== false) {
    containerElement.classList.add('has-arrows');
}
showcaseArrowLeft.addEventListener('click', (event) => {
    event.stopPropagation();
    prevShowcaseImage();
    stopShowcaseAutoplay();
});
showcaseArrowRight.addEventListener('click', (event) => {
    event.stopPropagation();
    nextShowcaseImage();
    stopShowcaseAutoplay();
});
containerElement.addEventListener('mousemove', showShowcaseNavControls);
containerElement.addEventListener('mouseleave', hideShowcaseNavControls);
hideShowcaseNavControls();
            }

            // === УДАЛИТЬ СТАРЫЙ ОБРАБОТЧИК КЛИКА, ЕСЛИ ЕСТЬ ===
if (showcaseClickHandler && activeShowcaseGallery) {
    activeShowcaseGallery.removeEventListener('click', showcaseClickHandler);
}

// === СОЗДАТЬ НОВЫЙ ОБРАБОТЧИК И СОХРАНИТЬ ССЫЛКУ ===
showcaseClickHandler = (event) => {
    if (event.target.closest('.showcase-bullet') || event.target.closest('.showcase-title a')) {
        return;
    }
    const imgRect = imgElement.getBoundingClientRect();
    const clickX = event.clientX - imgRect.left;
    const imgWidth = imgRect.width;
    if (clickX < imgWidth / 2) {
        prevShowcaseImage();
    } else {
        nextShowcaseImage();
    }
    stopShowcaseAutoplay();
};
containerElement.addEventListener('click', showcaseClickHandler);
        });
    } else {
        // === ОБЫЧНЫЕ ГАЛЕРЕИ: grid, masonry, horizontal ===
        let currentObserver;
        if (layoutClass === 'gallery-horizontal-scroll') {
            if (!horizontalGalleryObservers.has(galleryData.id)) {
                const observer = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const postDiv = entry.target;
                            const imgElement = postDiv.querySelector('img');
                            if (imgElement && imgElement.dataset.potentialUrls) {
                                const potentialUrls = JSON.parse(imgElement.dataset.potentialUrls);
                                attemptLoadImage(imgElement, potentialUrls, postDiv, (success) => {
                                    if (success) {
                                        observer.unobserve(postDiv);
                                        const allGalleryImages = Array.from(postDiv.closest('.posts-wrap').querySelectorAll('.post img'));
                                        const currentIndex = allGalleryImages.indexOf(imgElement);
                                        if (currentIndex !== -1) {
                                            preloadNextNImages(allGalleryImages, currentIndex, preloadCount);
                                        }
                                    }
                                }, false);
                            }
                        }
                    });
                }, {
                    root: containerElement,
                    rootMargin: '0px 500px 0px 500px',
                    threshold: 0.01
                });
                horizontalGalleryObservers.set(galleryData.id, observer);
            }
            currentObserver = horizontalGalleryObservers.get(galleryData.id);
        } else {
            currentObserver = verticalImageObserver;
        }

        const postsToObserve = [];

        for (let i = 1; i <= count; i++) {
            const imgNumber = String(i);
            const imgNumberPadded = String(i).padStart(2, '0');
            const postDiv = document.createElement('div');
            postDiv.className = 'post photopost';

            // === Project Gallery Overlay ===
            if (galleryData.isProjectGallery) {
                const overlay = document.createElement('div');
                overlay.className = 'project-overlay';
                const content = document.createElement('div');
                content.className = 'project-content';
                const pgConfig = window.siteConfig.styles.projectGalleryOverlay || {};
                if (pgConfig.alwaysVisibleDesktop) {
                    overlay.classList.add('always-visible');
                }
                const projItem = galleryData.projectData[i - 1];
                let clickableWrapper = null;
                if (projItem && projItem.url) {
                    clickableWrapper = document.createElement('a');
                    clickableWrapper.href = projItem.url;
                    if (projItem.url.startsWith('#')) {
                        clickableWrapper.dataset.internal = 'true';
                    } else {
                        clickableWrapper.target = '_blank';
                        clickableWrapper.rel = 'noopener noreferrer';
                    }
                }
                if (projItem && projItem.title) {
                    const titleEl = document.createElement('h3');
                    titleEl.textContent = projItem.title;
                    if (clickableWrapper) {
                        clickableWrapper.appendChild(titleEl);
                        content.appendChild(clickableWrapper);
                    } else {
                        content.appendChild(titleEl);
                    }
                }
                if (projItem && projItem.description) {
                    const descEl = document.createElement('p');
                    descEl.className = 'project-description';
                    descEl.textContent = projItem.description;
                    if (clickableWrapper) {
                        const descLink = clickableWrapper.cloneNode(false);
                        descLink.appendChild(descEl);
                        content.appendChild(descLink);
                    } else {
                        content.appendChild(descEl);
                    }
                }
                overlay.appendChild(content);
                postDiv.appendChild(overlay);
            }

            const postMarginAdjustmentDiv = document.createElement('div');
            postMarginAdjustmentDiv.className = 'post_margin_adjustment';
            const postRelativeDiv = document.createElement('div');
            postRelativeDiv.className = 'post_relative';
            const figureElement = document.createElement('figure');
            figureElement.className = 'wp-block-image size-large';
            const imgElement = document.createElement('img');
            imgElement.alt = `Image ${i}`;
            imgElement.className = `wp-image-${i} notPhotoset`;
            imgElement.loading = (i <= 2) ? 'eager' : 'lazy'; 
			imgElement.fetchPriority = (i <= 2) ? 'high' : 'low'; 
            imgElement.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';

            const potentialUrls = generatePotentialUrls(imgNumber, imgNumberPadded);
            imgElement.dataset.potentialUrls = JSON.stringify(potentialUrls);

            // === CLICK HANDLER ===
            if (galleryData.isProjectGallery) {
                postDiv.addEventListener('click', (e) => {
                    if (e.target.closest('img')) return;
                    const link = postDiv.querySelector('.project-content a');
                    if (link) {
                        if (link.target === '_blank') {
                            window.open(link.href, '_blank');
                        } else {
                            if (link.href.startsWith('#')) {
                                const targetId = link.href.substring(1);
                                showContent(targetId);
                            } else {
                                window.location.href = link.href;
                            }
                        }
                    }
                });
            } else {
                postDiv.addEventListener('click', () => {
                    openLightbox(imgElement.src, imgElement.alt, imgElement);
                });
            }

            figureElement.appendChild(imgElement);
            postRelativeDiv.appendChild(figureElement);
            postMarginAdjustmentDiv.appendChild(postRelativeDiv);
            postDiv.appendChild(postMarginAdjustmentDiv);

            if (!hideCaption && captions[i - 1] && !galleryData.isProjectGallery) {
                const captionElement = document.createElement('figcaption');
                captionElement.className = 'image-caption';
                captionElement.textContent = captions[i - 1];
                postDiv.appendChild(captionElement);
            }

            containerElement.appendChild(postDiv);
            postsToObserve.push(postDiv);
        }

        // === ЗАГРУЗКА ПО СТРОКАМ ДЛЯ КОЛОНОЧНЫХ ГАЛЕРЕЙ ===
        const isMultiColumn = layoutClass.includes('column');
        if (isMultiColumn) {
            requestAnimationFrame(() => {
                const postsWithRect = postsToObserve.map(post => {
                    const rect = post.getBoundingClientRect();
                    return { post, top: rect.top, left: rect.left };
                });
                postsWithRect.sort((a, b) => {
                    const topDiff = a.top - b.top;
                    if (Math.abs(topDiff) < 10) {
                        return a.left - b.left;
                    }
                    return topDiff;
                });
                postsWithRect.forEach(({ post }) => currentObserver.observe(post));
            });
        } else {
            postsToObserve.forEach(post => currentObserver.observe(post));
        }

        // === ПРЕДЗАГРУЗКА ПЕРВЫХ 6 ИЗОБРАЖЕНИЙ ===
        const allPosts = containerElement.querySelectorAll('.post');
        const eagerCount = 2;
        for (let idx = 0; idx < Math.min(eagerCount, allPosts.length); idx++) {
            const post = allPosts[idx];
            const img = post.querySelector('img');
            const urls = JSON.parse(img.dataset.potentialUrls || '[]');
            if (urls.length > 0) {
                const preloadImg = new Image();
                preloadImg.src = urls[0];
            }
        }
    }
}

/**
 * Determines if the sidebar should be hidden for the current page.
 */
function shouldHideSidebar(contentId) {
    const sidebarConfig = window.siteConfig.site.sidebar;
    // 1. Глобальное отключение
    if (!sidebarConfig || sidebarConfig.enabledDesktop === false) { 
        return true;
    }

    // 2. Скрытие на главной
    const isHomepage = contentId === window.siteConfig.site.homepageId;
    if (sidebarConfig.hideOnHomepage && isHomepage) {
        return true;
    }

    // 3. Проверка Галерей
    const galleryData = window.siteConfig.galleriesData.find(g => g.id === contentId);
    if (galleryData && galleryData.hideSidebar) {
        return true;
    }

    // 4. Проверка Текстовых страниц
    const textPageData = window.siteConfig.textPagesData.find(t => t.id === contentId);
    if (textPageData && textPageData.hideSidebar) {
        return true;
    }

    // 5. === NEW: Проверка Зинов ===
    if (window.siteConfig.zinePagesData) {
        const zineData = window.siteConfig.zinePagesData.find(z => z.id === contentId);
        // Проверяем настройку hideSidebar внутри объекта зина
        if (zineData && zineData.hideSidebar) {
            return true;
        }
    }

    return false;
}

/**
 * Determines if the current gallery/text page has a visible title or description.
 * @param {string} contentId The ID of the currently displayed content.
 * @returns {boolean} True if title or description are visible, false otherwise.
 */
function hasVisibleHeader(contentId) {
    const galleryData = window.siteConfig.galleriesData.find(g => g.id === contentId);
    if (galleryData) {
        const hasTitle = !galleryData.hideTitle;
        const hasDescription = galleryData.description && galleryData.description.displayMode !== 'hidden';
        return hasTitle || hasDescription;
    }
    const textPageData = window.siteConfig.textPagesData.find(t => t.id === contentId);
    if (textPageData) {
        const hasTitle = !textPageData.hideTitle;
        return hasTitle;
    }
    // === ZINE ===
    const zinePageData = window.siteConfig.zinePagesData?.find(z => z.id === contentId);
    if (zinePageData) {
        return !zinePageData.hideTitle;
    }
    return false;
}


// --- Content Switching Logic (galleries/pages) ---
// --- Content Switching Logic (galleries/pages/zines) ---
async function showContent(contentId, imageIndex = -1) {
    // Сброс прокрутки
    body.style.overflow = 'auto';

    const allContentSections = document.querySelectorAll('.content-section');
    const navLinks = document.querySelectorAll('.nav-link');
    const footerLinks = document.querySelectorAll('.footer-link');

    stopCarouselAutoplay();
    stopShowcaseAutoplay();

    // Очистка слушателей событий от предыдущих галерей
    if (activeCarouselGallery) {
        activeCarouselGallery.removeEventListener('touchstart', handleTouchStart);
        activeCarouselGallery.removeEventListener('touchmove', handleTouchMove);
        activeCarouselGallery.removeEventListener('touchend', handleTouchEndCarousel);
        activeCarouselGallery.removeEventListener('wheel', handleCarouselWheel);
    }
    if (activeShowcaseGallery) {
        activeShowcaseGallery.removeEventListener('touchstart', handleTouchStart);
        activeShowcaseGallery.removeEventListener('touchmove', handleTouchMove);
        activeShowcaseGallery.removeEventListener('touchend', handleTouchEndShowcase);
    }
    // === ДОБАВИТЬ: Удаление обработчика клика ===
if (showcaseClickHandler) {
    activeShowcaseGallery.removeEventListener('click', showcaseClickHandler);
    showcaseClickHandler = null;
}

    // Reset State
    isGalleryContext = false;
    allVisibleImages = [];
    currentImageIndex = 0;
    activeCarouselGallery = null;
    carouselCurrentIndex = 0;
    carouselImagesData = [];
    if (carouselAutoplayIntervalId) {
        clearInterval(carouselAutoplayIntervalId);
        carouselAutoplayIntervalId = null;
    }
    activeShowcaseGallery = null;
    showcaseCurrentIndex = 0;
    showcaseImagesData = [];
    if (showcaseAutoplayIntervalId) {
        clearInterval(showcaseAutoplayIntervalId);
        showcaseAutoplayIntervalId = null;
    }
    currentShowcaseConfig = {}; 

    // Скрываем все секции
    allContentSections.forEach(section => {
        section.classList.remove('active');
        section.classList.add('hidden');
        
        // Очистка специфичных элементов
        if (section.classList.contains('showcase-gallery-parent')) {
            const showcasePostsWrap = section.querySelector('.posts-wrap.gallery-showcase');
            if (showcasePostsWrap) {
                showcasePostsWrap.innerHTML = '';
                showcasePostsWrap.style.display = 'none';
            }
        }
        if (section.classList.contains('single-image-carousel-parent')) {
            const carouselPostsWrap = section.querySelector('.posts-wrap.gallery-single-image-carousel');
            if (carouselPostsWrap) {
                carouselPostsWrap.innerHTML = '';
                hideCarouselNavControls(); // Убираем стрелки
                carouselPostsWrap.style.display = 'none';
            }
        }
    });

    // Ищем целевую секцию
    let targetSection = document.getElementById(contentId);

    // Если секции нет, пытаемся найти данные и создать её
    if (!targetSection) {
        const textPageData = window.siteConfig.textPagesData.find(t => t.id === contentId);
        if (textPageData) {
            createContentSection('text', textPageData);
            targetSection = document.getElementById(contentId);
        } 
        else if (window.siteConfig.zinePagesData) {
            const zinePageData = window.siteConfig.zinePagesData.find(z => z.id === contentId);
            if (zinePageData) {
                // Создаем секцию для зина
                const section = document.createElement('section');
                section.id = zinePageData.id;
                section.className = 'content-section zine-section hidden';
                // Заголовок и контейнер
                let titleHtml = zinePageData.hideTitle ? '' : `<h2 class="font-bold text-center mb-6">${zinePageData.title}</h2>`;
                const containerMaxWidth = zinePageData.contentMaxWidth || 'var(--content-max-width)';
                
                section.innerHTML = `
                    <div class="container mx-auto py-4 px-0" style="max-width: ${containerMaxWidth};">
                        ${titleHtml}
                        <div class="zine-canvas">
                            <div class="zine-inner"
                                 data-canvas-width="${zinePageData.editorSettings?.canvasWidth || 1200}"
                                 data-canvas-height="${zinePageData.editorSettings?.canvasHeight || 1200}">
                            </div>
                        </div>
                    </div>
                `;
                dynamicContentContainer.appendChild(section);
                targetSection = section;
            }
        }
    }

    if (targetSection) {
        targetSection.classList.add('active');
        targetSection.classList.remove('hidden');
        
        const hideSidebarForCurrentPage = shouldHideSidebar(contentId);
const currentContentHasHeader = hasVisibleHeader(contentId);

        // === Рендеринг ЗИНА ===
        if (targetSection.classList.contains('zine-section')) {
    const zineData = window.siteConfig.zinePagesData?.find(z => z.id === contentId);
    if (zineData) {
        if (!currentContentHasHeader) targetSection.classList.add('no-header-height');
        else targetSection.classList.remove('no-header-height');
        renderZine(targetSection, zineData);
        initZineParagraphModal(targetSection);
    }
}

        // Заполнение пустых галерей
        if (!targetSection.querySelector('.posts-wrap') && !targetSection.classList.contains('zine-section')) {
            const galleryData = window.siteConfig.galleriesData.find(g => g.id === contentId);
            if (galleryData) {
                fillGalleryStub(targetSection, galleryData);
            }
        }

        // Iframe lazy load
        if (targetSection.classList.contains('text-content-section')) {
            const lazyIframes = targetSection.querySelectorAll('.lazy-iframe');
            lazyIframes.forEach(iframe => {
                if (iframe.dataset.lazySrc) {
                    iframe.src = iframe.dataset.lazySrc;
                    iframe.classList.remove('lazy-iframe');
                }
            });
        }

        // Логика сайдбара
        

        if (window.innerWidth > 768) {
            if (hideSidebarForCurrentPage) {
                body.classList.add('sidebar-hidden');
                if (desktopHeaderHiddenSidebar) desktopHeaderHiddenSidebar.style.display = 'flex';
                if (menuToggleDesktop) menuToggleDesktop.style.display = 'block';
            } else {
                body.classList.remove('sidebar-hidden');
                if (desktopHeaderHiddenSidebar) desktopHeaderHiddenSidebar.style.display = 'none';
                if (menuToggleDesktop) menuToggleDesktop.style.display = 'none';
            }
        }

        // Горизонтальная галерея
        if (targetSection.classList.contains('horizontal-gallery-parent')) {
            activeHorizontalGallery = targetSection.querySelector('.posts-wrap.gallery-horizontal-scroll');
            if (activeHorizontalGallery) {
                if (activeHorizontalGallery._horizontalScrollCleanup) activeHorizontalGallery._horizontalScrollCleanup();
                initHorizontalGalleryScroll(activeHorizontalGallery);
            }
        } else {
            activeHorizontalGallery = null;
        }

        // Карусель
        if (targetSection.classList.contains('single-image-carousel-parent')) {
            activeCarouselGallery = targetSection.querySelector('.posts-wrap.gallery-single-image-carousel');
            if (activeCarouselGallery) activeCarouselGallery.style.display = '';
            
            const currentGalleryData = window.siteConfig.galleriesData.find(g => g.id === contentId);
            
            if (!currentContentHasHeader) targetSection.classList.add('no-header-height');
            else targetSection.classList.remove('no-header-height');

            if (currentGalleryData) {
                await loadImageGallery(activeCarouselGallery, currentGalleryData.layoutClass, currentGalleryData.imageCount, currentGalleryData.folder, currentGalleryData.captions, currentGalleryData.hideCaption, currentGalleryData);
            }

            if (carouselImagesData.length > 0) {
                // Конфигурация карусели...
                currentCarouselConfig = {
                    randomOrder: currentGalleryData.carouselConfig?.randomOrder ?? false,
                    autoPlay: currentGalleryData.carouselConfig?.autoPlay ?? false,
                    autoPlayInterval: currentGalleryData.carouselConfig?.autoPlayInterval ?? 3000,
                    hideCaption: currentGalleryData.hideCaption,
                    showArrows: currentGalleryData.carouselConfig?.showArrows ?? true,
                    showFullscreenButton: currentGalleryData.carouselConfig?.showFullscreenButton ?? true
                };

                            if (currentCarouselConfig.randomOrder) shuffleArray(carouselImagesData);
            // Используем imageIndex из хеша, если передан; иначе 0
            carouselCurrentIndex = (imageIndex >= 0 && imageIndex < carouselImagesData.length) ? imageIndex : 0;
            await _loadSingleCarouselImage(carouselImagesData[carouselCurrentIndex]);
                updateCarouselHeight();
                if (currentCarouselConfig.autoPlay) startCarouselAutoplay();

                if (activeCarouselGallery) {
                    activeCarouselGallery.addEventListener('touchstart', handleTouchStart, { passive: false });
                    activeCarouselGallery.addEventListener('touchmove', handleTouchMove, { passive: false });
                    activeCarouselGallery.addEventListener('touchend', handleTouchEndCarousel);
                    activeCarouselGallery.addEventListener('wheel', handleCarouselWheel, { passive: false });
                }
            } else {
                stopCarouselAutoplay();
                hideCarouselNavControls();
                hideCarouselFullscreenControls();
            }
        } else {
            // Если это НЕ карусель
            activeCarouselGallery = null;
            targetSection.classList.remove('no-header-height');
            hideCarouselNavControls();
            hideCarouselFullscreenControls();
        }

        // Шоукейс
        if (targetSection.classList.contains('showcase-gallery-parent')) {
            activeShowcaseGallery = targetSection.querySelector('.posts-wrap.gallery-showcase');
            if (activeShowcaseGallery) activeShowcaseGallery.style.display = '';
            const currentGalleryData = window.siteConfig.galleriesData.find(g => g.id === contentId);

            if (currentGalleryData) {
                await loadImageGallery(activeShowcaseGallery, currentGalleryData.layoutClass, currentGalleryData.imageCount, currentGalleryData.folder, null, true, currentGalleryData);
            }

            if (showcaseImagesData.length > 0) {
    currentShowcaseConfig = {
        randomOrder: currentGalleryData.carouselConfig?.randomOrder ?? false,
        autoPlay: currentGalleryData.carouselConfig?.autoPlay ?? false,
        autoPlayInterval: currentGalleryData.carouselConfig?.autoPlayInterval ?? 7000,
        showBullets: currentGalleryData.carouselConfig?.showBullets ?? true,
        showTitles: currentGalleryData.carouselConfig?.showTitles ?? true,
        showArrows: currentGalleryData.carouselConfig?.showArrows ?? true, 
        showFullscreenButton: false
    };
                             if (currentShowcaseConfig.randomOrder) shuffleArray(showcaseImagesData);
             // Используем imageIndex из хеша, если передан; иначе 0
             showcaseCurrentIndex = (imageIndex >= 0 && imageIndex < showcaseImagesData.length) ? imageIndex : 0;
             await showShowcaseImage(showcaseCurrentIndex);
updateShowcaseBulletsColor();
updateShowcaseTitleAndLinkColors();
if (currentShowcaseConfig.autoPlay) startShowcaseAutoplay();
                
                if (carouselFullscreenIcon.parentNode === activeShowcaseGallery) {
                    activeShowcaseGallery.removeChild(carouselFullscreenIcon);
                }
                carouselFullscreenIcon.classList.remove('show-icon');

                if (activeShowcaseGallery) {
                    activeShowcaseGallery.addEventListener('touchstart', handleTouchStart, { passive: false });
                    activeShowcaseGallery.addEventListener('touchmove', handleTouchMove, { passive: false });
                    activeShowcaseGallery.addEventListener('touchend', handleTouchEndShowcase);
                }
            } else {
                stopShowcaseAutoplay();
                hideShowcaseNavControls();
            }
        } else {
            activeShowcaseGallery = null;
            if (carouselFullscreenIcon.parentNode) {
                 // Безопасное удаление иконки, если она где-то осталась
                 if (carouselFullscreenIcon.parentNode.classList.contains('gallery-showcase')) {
                     carouselFullscreenIcon.parentNode.removeChild(carouselFullscreenIcon);
                 }
            }
            carouselFullscreenIcon.classList.remove('show-icon');
        }
    }

    // Обновление активного пункта меню
    navLinks.forEach(link => link.classList.remove('active'));
    footerLinks.forEach(link => link.classList.remove('active'));

    const currentNavLink = document.querySelector(`.nav-link[data-target="${contentId}"]`);
    if (currentNavLink) {
        currentNavLink.classList.add('active');
        // Раскрываем все родительские уровни (поддержка 3-го уровня)
        let parentUl = currentNavLink.closest('.sub-submenu');
        if (parentUl) {
            // Активная ссылка внутри 3-го уровня
            parentUl.classList.add('expanded');
            const subParentLi = parentUl.closest('.submenu-parent-item');
            if (subParentLi) subParentLi.classList.add('expanded');
            // Раскрываем submenu 2-го уровня
            const submenu = parentUl.closest('.submenu');
            if (submenu) {
                submenu.classList.add('expanded');
                const parentLi = submenu.closest('.parent-item');
                if (parentLi) parentLi.classList.add('expanded');
            }
        } else {
            // Активная ссылка внутри submenu 2-го уровня
            const submenu = currentNavLink.closest('.submenu');
            if (submenu) {
                submenu.classList.add('expanded');
                const parentLi = submenu.closest('.parent-item');
                if (parentLi) parentLi.classList.add('expanded');
            }
        }
    } else {
        const currentFooterLink = document.querySelector(`.footer-link[data-target="${contentId}"]`);
        if (currentFooterLink) currentFooterLink.classList.add('active');
    }

    // Закрытие мобильного меню
    if (window.innerWidth <= 768 || (window.innerWidth > 768 && body.classList.contains('sidebar-hidden'))) {
        mainNav.classList.remove('active');
        body.style.overflow = 'auto';
    }

    window.scrollTo(0, 0);

    // Поиск данных для SEO
    let activeNavItem = null;
    for (const item of window.siteConfig.navigation) {
        if (item.id === contentId) { activeNavItem = item; break; }
        if (item.type === 'parent' && item.children) {
            const child = item.children.find(c => c.id === contentId);
            if (child) { activeNavItem = child; break; }
            // Проверка 3-го уровня
            for (const c of item.children) {
                if (c.type === 'parent' && Array.isArray(c.children)) {
                    const grandChild = c.children.find(gc => gc.id === contentId);
                    if (grandChild) { activeNavItem = grandChild; break; }
                }
            }
            if (activeNavItem) break;
        }
    }
    if (!activeNavItem && window.siteConfig.footerNavigation) {
        activeNavItem = window.siteConfig.footerNavigation.find(item => item.id === contentId);
    }

    let pageData = null;
    if (activeNavItem && activeNavItem.type === 'gallery') {
        pageData = window.siteConfig.galleriesData.find(g => g.id === contentId);
    } else if (activeNavItem && activeNavItem.type === 'text') {
        pageData = window.siteConfig.textPagesData.find(t => t.id === contentId);
    } else if (activeNavItem && activeNavItem.type === 'zine') {
        pageData = window.siteConfig.zinePagesData?.find(z => z.id === contentId);
    }

   // Применение SEO
    let localSeo = null;
    
    // 1. Инициализируем localSeo с полными данными SEO, если они есть (для Зинов/Текстовых страниц)
    if (pageData && pageData.seo) {
        // Используем spread-оператор для копирования, чтобы не менять исходный объект
        localSeo = { ...pageData.seo }; 
    }

    // 2. Добавляем или перекрываем корневые флаги (для обратной совместимости/консистентности)
    if (pageData && (pageData.noindex !== undefined || pageData.noai !== undefined)) {
        // Если localSeo ещё не инициализирован (т.е. нет pageData.seo), создаем его
        if (!localSeo) { 
            localSeo = {};
        }
        
        // Добавляем флаги
        if (pageData.noindex !== undefined) {
            localSeo.noindex = pageData.noindex;
        }
        if (pageData.noai !== undefined) {
            localSeo.noai = pageData.noai;
        }
    }
    
    // 3. Вызов applySEOMetaTags
    if (typeof window.applySEOMetaTags === 'function') {
        const applyWithI18nCheck = () => {
            const cfg = window.siteConfig;
            // Ждем загрузки конфига i18n, если он включен
            if (cfg?.i18n?.enabled && !cfg.i18n.currentLanguage) {
                setTimeout(applyWithI18nCheck, 50);
                return;
            }
            // Передаем собранный объект localSeo
            window.applySEOMetaTags(localSeo);
        };
        applyWithI18nCheck();
    }
    
    updateCarouselHeight();

    // ==========================================================================
    // >>> FINAL FIX: Обновление хеша URL (для Зинов, Галерей, Текста)
    // ==========================================================================
    const currentHash = window.location.hash.substring(1);
    
    // Проверяем, не является ли текущий хеш "диплинком"
    const isDeepLink = currentHash.startsWith(`${contentId}/lightbox-`) || 
                       currentHash.startsWith(`${contentId}/carousel-`) || 
                       currentHash.startsWith(`${contentId}/showcase-`);

    if (
        !isPopstateNavigation &&     // Не переписываем при нажатии "Назад"
        currentHash !== contentId && // Если уже верно, не трогаем
        !isDeepLink                  // Если открыт слайд, не сбрасываем
    ) {
        history.replaceState(null, '', `#${contentId}`);
    }
    // ==========================================================================


    // >>> FINAL PATCH: Открытие лайтбокса по прямой ссылке (Deep Linking)
    if (imageIndex >= 0) {
        const targetSection = document.getElementById(contentId);
        if (!targetSection) return Promise.resolve();

             // CASE 1: Carousel и Showcase уже обработаны выше через imageIndex
     // Оставляем только лайтбокс и текстовые галереи
     if (targetSection.classList.contains('single-image-carousel-parent') || 
         targetSection.classList.contains('showcase-gallery-parent')) {
         // Ничего не делаем — индекс уже применён при первичной загрузке
     }
        // CASE 3: Zine Section
else if (targetSection.classList.contains('zine-section')) {
    const tryOpenZineLightbox = (attempt = 0) => {
        const zineImages = getSortedZineImages(targetSection);
        console.log(`📍 ZINE DEEP LINK attempt ${attempt}: found ${zineImages.length} images, target index=${imageIndex}`);
        
        if (imageIndex >= 0 && imageIndex < zineImages.length) {
            const targetImg = zineImages[imageIndex];
            // Проверяем, что src установлен и это не placeholder
            if (targetImg.src && !targetImg.src.startsWith('data:image/gif')) {
                console.log(`✅ Zine deep link: opening image ${imageIndex}, src=${targetImg.src}`);
                openLightbox(targetImg.src, targetImg.alt, targetImg, imageIndex);
                return;
            }
        }
        
        // Retry: ждём пока renderZine закончит создавать блоки
        if (attempt < 15) {
            setTimeout(() => tryOpenZineLightbox(attempt + 1), 150);
        } else {
            console.warn('❌ Zine deep link: images not ready after 15 attempts');
        }
    };
    // Увеличенная начальная задержка — даём renderZine время создать все блоки
    setTimeout(() => tryOpenZineLightbox(), 300);
}
        // CASE 4: Gallery / Text
        else {
            setTimeout(() => {
                if (targetSection.classList.contains('gallery-section')) {
                    const postsWrap = targetSection.querySelector('.posts-wrap');
                    if (!postsWrap) return;
                    const allPosts = Array.from(postsWrap.querySelectorAll('.post'));
                    if (imageIndex >= 0 && imageIndex < allPosts.length) {
                        const targetPost = allPosts[imageIndex];
                        const targetImg = targetPost.querySelector('img');
                        const isLoaded = targetPost.classList.contains('loaded') || (targetImg.src && !targetImg.src.startsWith('data:image/gif;base64'));
                        if (isLoaded) {
                            openLightbox(targetImg.src, targetImg.alt, targetImg, imageIndex);
                        } else {
                            const potentialUrls = JSON.parse(targetImg.dataset.potentialUrls || '[]');
                            attemptLoadImage(targetImg, potentialUrls, targetPost, (success, loadedSrc) => {
                                if (success) openLightbox(loadedSrc, targetImg.alt, targetImg, imageIndex);
                            }, false);
                        }
                    }
                } 
                else if (targetSection.classList.contains('text-content-section')) {
                     // Логика для текстовых галерей (шорткоды)
                     const shortcodeWraps = Array.from(targetSection.querySelectorAll('.posts-wrap[data-shortcode-id]'));
                     if (shortcodeWraps.length > 0) {
                        let allImages = [];
                        shortcodeWraps.forEach(wrap => {
                            const posts = Array.from(wrap.querySelectorAll('.post'));
                            posts.forEach(post => allImages.push({post, img: post.querySelector('img')}));
                        });
                        if (imageIndex >= 0 && imageIndex < allImages.length) {
                            const {post: targetPost, img: targetImg} = allImages[imageIndex];
                            const isLoaded = targetPost.classList.contains('loaded') || (targetImg.src && !targetImg.src.startsWith('data:image/gif;base64'));
                            if (isLoaded) openLightbox(targetImg.src, targetImg.alt, targetImg, imageIndex);
                            else {
                                const potentialUrls = JSON.parse(targetImg.dataset.potentialUrls || '[]');
                                attemptLoadImage(targetImg, potentialUrls, targetPost, (success, loadedSrc) => {
                                    if (success) openLightbox(loadedSrc, targetImg.alt, targetImg, imageIndex);
                                }, false);
                            }
                        }
                     } else {
                        const images = Array.from(targetSection.querySelectorAll('.prose img[onclick*="openLightbox"]'));
                        if (images.length > 0) {
                            const validIndex = Math.max(0, Math.min(imageIndex, images.length - 1));
                            const targetImg = images[validIndex];
                            if (targetImg) openLightbox(targetImg.src, targetImg.alt, targetImg, validIndex);
                        }
                     }
                }
            }, 300);
        }
    }
    
    return Promise.resolve();
}

// Helper function to create content sections
function createContentSection(type, data) {
    const section = document.createElement('section');
    section.id = data.id;
    section.classList.add('content-section', 'hidden'); // All sections are initially hidden

    let contentInnerHtml = '';
    let titleHtml = data.hideTitle ? '' : `<h2 class="font-bold text-center">${data.title}</h2>`;

    if (type === 'gallery') {
        section.classList.add('gallery-section');
        if (data.layoutClass === 'gallery-horizontal-scroll') {
            section.classList.add('horizontal-gallery-parent');
        } else if (data.layoutClass === 'gallery-single-image-carousel') {
            section.classList.add('single-image-carousel-parent');
        } else if (data.layoutClass === 'gallery-showcase') { 
            section.classList.add('showcase-gallery-parent');
        }

        let descriptionHtml = '';

        if (data.description && data.description.displayMode !== "hidden") {
            const isInitiallyOpen = data.description.displayMode === "open";
            const initialDescriptionClass = isInitiallyOpen ? 'expanded' : '';
            const initialButtonText = isInitiallyOpen ? '&times;' : 'i';

            descriptionHtml = `
                <div class="gallery-description-container">
                    <div class="gallery-description-text ${initialDescriptionClass}">
                        ${data.description.text}
                    </div>
                    <button class="toggle-description-button">${initialButtonText}</button>
                </div>
            `;
        } else {
            titleHtml = data.hideTitle ? '' : `<h2 class="font-bold text-center title-no-description-margin">${data.title}</h2>`;
        }

        if (data.layoutClass === 'gallery-horizontal-scroll') {
            contentInnerHtml = `
                <div class="horizontal-gallery-header-container">
                    ${titleHtml}
                    ${descriptionHtml}
                </div>
                <div class="posts-wrap ${data.layoutClass}"></div>
            `;
        } else if (data.layoutClass === 'gallery-showcase') {
            contentInnerHtml = `
                <div class="posts-wrap ${data.layoutClass}"></div>
            `;
        } else {
            contentInnerHtml = `
                <div class="container mx-auto p-4">
                    ${titleHtml}
                    ${descriptionHtml}
                </div>
                <div class="posts-wrap ${data.layoutClass}"></div>
            `;
        }

    }
    // 🔥🔥🔥 ВСТАВЛЕН НОВЫЙ БЛОК ZINE — ПРАВИЛЬНОЕ МЕСТО
    else if (type === 'zine') {
    section.classList.add('zine-section');

    let titleHtml = data.hideTitle ? '' : `<h2 class="font-bold text-center mb-6">${data.title}</h2>`;

    // Применяем max-width из настроек
    if (data.contentMaxWidth) {
        section.style.maxWidth = data.contentMaxWidth;
    } else {
        section.style.maxWidth = 'var(--content-max-width)';
    }
    section.style.marginLeft = 'auto';
    section.style.marginRight = 'auto';

    const canvasWidth = data.editorSettings?.canvasWidth || 1100;
    const canvasHeight = data.editorSettings?.canvasHeight || 1500;

    contentInnerHtml = `
        <div class="container mx-auto py-4 px-0">
            ${titleHtml}
            <div class="zine-canvas">
                <div class="zine-inner"
                     data-canvas-width="${canvasWidth}"
                     data-canvas-height="${canvasHeight}">
                </div>
            </div>
        </div>
    `;
}
    // 🔥🔥🔥 КОНЕЦ НОВОГО БЛОКА ZINE

    else if (type === 'text') {
    section.classList.add('text-content-section');
    // NEW: индивидуальная ширина для текстовых страниц
    if (data.contentMaxWidth) {
        section.style.maxWidth = data.contentMaxWidth;
    } else {
        section.style.maxWidth = "var(--content-max-width)";
    }
    section.style.marginLeft = "auto";
    section.style.marginRight = "auto";

    // === ОПРЕДЕЛЕНИЕ КОНТЕНТА: contentHtml ИЛИ paragraphs ===
    let blocks = [];
    if (data.contentHtml !== undefined && data.contentHtml !== null) {
        // Разбиваем contentHtml на логические блоки: заголовки, параграфы, списки, изображения, видео, шорткоды
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = data.contentHtml;

        // Функция для рекурсивного извлечения текстовых узлов и элементов
function extractBlocks(node) {
    const blocks = [];
    for (let child of node.childNodes) {
        if (child.nodeType === Node.TEXT_NODE) {
            const text = child.textContent.trim();
            if (text) blocks.push(`<p>${text}</p>`);
        } else if (child.nodeType === Node.ELEMENT_NODE) {
            const tag = child.tagName.toLowerCase();
            if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'ul', 'ol', 'blockquote', 'pre'].includes(tag)) {
                blocks.push(child.outerHTML);
            } else if (tag === 'img') {
                const src = child.src || '';
                const alt = child.alt || '';
                blocks.push(`<img src="${src}" alt="${alt}">`);
            } else if (tag === 'video') {
                blocks.push(child.outerHTML);
            } else if (tag === 'div' && child.classList.contains('video-container')) {
                blocks.push(child.outerHTML);
            } else {
                // Рекурсивно обрабатываем вложенные элементы
                blocks.push(...extractBlocks(child));
            }
        }
    }
    return blocks;
}

        // Извлекаем все блоки
        blocks = extractBlocks(tempDiv);

        // Добавляем шорткоды как отдельные блоки (они могут быть в тексте как "[gallery:xxx]")
        const fullHtml = data.contentHtml;
        const shortcodeRegex = /\[gallery:([^\]]+)\]/gi;
        let lastIndex = 0;
        let finalBlocks = [];
        let match;

        while ((match = shortcodeRegex.exec(fullHtml)) !== null) {
            const before = fullHtml.slice(lastIndex, match.index).trim();
            if (before) {
                // Вставляем HTML-фрагмент до шорткода как блок
                const beforeDiv = document.createElement('div');
                beforeDiv.innerHTML = before;
                finalBlocks.push(...extractBlocks(beforeDiv));
            }
            // Добавляем шорткод как отдельный блок
            finalBlocks.push(match[0]);
            lastIndex = match.index + match[0].length;
        }

        // Остаток после последнего шорткода
        const after = fullHtml.slice(lastIndex).trim();
        if (after) {
            const afterDiv = document.createElement('div');
            afterDiv.innerHTML = after;
            finalBlocks.push(...extractBlocks(afterDiv));
        }

        blocks = finalBlocks;
    } else if (Array.isArray(data.paragraphs)) {
        blocks = data.paragraphs;
    } else {
        blocks = [];
    }

    // === ОБРАБОТКА КАЖДОГО БЛОКА (как в старом коде) ===
    const paragraphsHtml = blocks.map(block => {
        // Если это шорткод — обрабатываем отдельно
        if (typeof block === 'string' && block.match(/^\[gallery:[^\]]+\]$/)) {
            const match = block.match(/\[gallery:([^\]]+)\]/);
            const galleryId = match[1].trim();
            const gallery = (window.siteConfig.galleriesData || []).find(x => x.id === galleryId);
            if (gallery) {
                return `<div class="embedded-gallery" data-gallery-id="${galleryId}"></div>`;
            } else {
                console.warn(`Gallery not found for ID: ${galleryId}`);
                return `<p>⚠ Галерея "${galleryId}" не найдена</p>`;
            }
        }

        // --- Очистка от возможных оберток редактора (например, TinyMCE) ---
        let cleanedContent = block.replace(/<span[^>]*class="mceNonEditable"[^>]*>\[gallery:([^\]]+)\]<\/span>/gi, '[gallery:$1]');

        // --- Обработка шорткодов внутри HTML-блоков (на случай, если они остались) ---
        const shortcodeRegex = /\[gallery:([^\]]+)\]/gi;
        let result = cleanedContent;
        if (shortcodeRegex.test(cleanedContent)) {
            result = cleanedContent.replace(shortcodeRegex, (match, galleryId) => {
                const gallery = (window.siteConfig.galleriesData || []).find(x => x.id === galleryId.trim());
                if (gallery) {
                    return `<div class="embedded-gallery" data-gallery-id="${galleryId.trim()}"></div>`;
                } else {
                    console.warn(`Gallery not found for ID: ${galleryId}`);
                    return `<p>⚠ Галерея "${galleryId}" не найдена</p>`;
                }
            });
        }

        // Обработка изображений
        if (result.includes('<img')) {
            const srcMatch = result.match(/src="([^"]*)"/);
            const altMatch = result.match(/alt="([^"]*)"/);
            const imgSrc = srcMatch ? srcMatch[1] : '';
            const imgAlt = altMatch ? altMatch[1] : '';
            return `<div class="image-wrapper" onclick="openLightbox('${imgSrc}', '${imgAlt}', this.querySelector('img'));">${result}</div>`;
        }

        // Обработка видео
        if (result.includes('<video') || result.includes('class="video-container"')) {
            return `<div class="video-wrapper">${result}</div>`;
        }
        
        // === ОТЛОЖЕННАЯ ЗАГРУЗКА IFRAME ===
if (result.includes('<iframe')) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = result;
    const iframes = tempDiv.querySelectorAll('iframe');
    iframes.forEach(iframe => {
        const src = iframe.src;
        iframe.removeAttribute('src');
        iframe.dataset.lazySrc = src;
        iframe.classList.add('lazy-iframe');
    });
    return tempDiv.innerHTML;
}

        // Если это уже HTML-блок — возвращаем как есть
        if (result.startsWith('<')) {
            return result;
        }

        // Иначе оборачиваем в <p>
        return `<p>${result}</p>`;
    }).join('');

    contentInnerHtml = `
        <div class="container mx-auto p-4">
            ${titleHtml}
            <div class="prose">
                ${paragraphsHtml}
            </div>
        </div>
    `;
}

    dynamicContentContainer.appendChild(section); // Append section first
    section.innerHTML = contentInnerHtml; // Then set innerHTML

    // --- Рендерим встроенные галереи из шорткодов ---
    section.querySelectorAll('.embedded-gallery').forEach(ph => {
        const galleryId = ph.getAttribute('data-gallery-id');
        const g = (window.siteConfig.galleriesData || []).find(x => x.id === galleryId);
        if (g) {
            const postsWrap = document.createElement('div');
            postsWrap.className = 'posts-wrap'; // чтобы структура была как у обычных галерей
            postsWrap.setAttribute('data-shortcode-id', galleryId); // ← ключевой момент
            ph.appendChild(postsWrap);

            loadImageGallery(postsWrap, g.layoutClass, g.imageCount, g.folder, g.captions, g.hideCaption, g);
        } else {
            ph.innerHTML = `<p>⚠ Галерея "${galleryId}" не найдена</p>`;
        }
    });

    // For carousel and showcase, loadImageGallery is now async and called in showContent
    // For other gallery types, call it synchronously here.
    if (type === 'gallery' && data.layoutClass !== 'gallery-single-image-carousel' && data.layoutClass !== 'gallery-showcase') {
         loadImageGallery(section.querySelector('.posts-wrap'), data.layoutClass, data.imageCount, data.folder, data.captions, data.hideCaption, data);
    }
     return section;
}

function fillGalleryStub(stubElement, galleryData) {
    // Очищаем заглушку
    stubElement.innerHTML = '';
    // Устанавливаем классы и структуру, как в createContentSection
    let titleHtml = galleryData.hideTitle ? '' : `<h2 class="font-bold text-center">${galleryData.title}</h2>`;
    let descriptionHtml = '';
    if (galleryData.description && galleryData.description.displayMode !== "hidden") {
        const isInitiallyOpen = galleryData.description.displayMode === "open";
        const initialDescriptionClass = isInitiallyOpen ? 'expanded' : '';
        const initialButtonText = isInitiallyOpen ? '&times;' : 'i';
        descriptionHtml = `
            <div class="gallery-description-container">
                <div class="gallery-description-text ${initialDescriptionClass}">
                    ${galleryData.description.text}
                </div>
                <button class="toggle-description-button">${initialButtonText}</button>
            </div>
        `;
    } else {
        titleHtml = galleryData.hideTitle ? '' : `<h2 class="font-bold text-center title-no-description-margin">${galleryData.title}</h2>`;
    }

    let contentInnerHtml = '';
    if (galleryData.layoutClass === 'gallery-horizontal-scroll') {
        contentInnerHtml = `
            <div class="horizontal-gallery-header-container">
                ${titleHtml}
                ${descriptionHtml}
            </div>
            <div class="posts-wrap ${galleryData.layoutClass}"></div>
        `;
    } else if (galleryData.layoutClass === 'gallery-showcase') {
        contentInnerHtml = `<div class="posts-wrap ${galleryData.layoutClass}"></div>`;
    } else {
        contentInnerHtml = `
            <div class="container mx-auto p-4">
                ${titleHtml}
                ${descriptionHtml}
            </div>
            <div class="posts-wrap ${galleryData.layoutClass}"></div>
        `;
    }

    stubElement.innerHTML = contentInnerHtml;

    // Загружаем изображения (только для обычных галерей)
    if (galleryData.layoutClass !== 'gallery-single-image-carousel' && galleryData.layoutClass !== 'gallery-showcase') {
        loadImageGallery(stubElement.querySelector('.posts-wrap'), galleryData.layoutClass, galleryData.imageCount, galleryData.folder, galleryData.captions, galleryData.hideCaption, galleryData);
    }
}

// Вебзины
function renderZine(section, data) {
    const container = section.querySelector('.zine-inner');
    if (!container) return;
    container.innerHTML = '';
    
    // 1. Получаем размеры.
    let canvasWidth = data.editorSettings?.canvasWidth || parseFloat(container.dataset.canvasWidth);
    let canvasHeight = data.editorSettings?.canvasHeight || parseFloat(container.dataset.canvasHeight);

    // Дефолт
    if (!canvasWidth || !canvasHeight) {
        canvasWidth = 1200;
        canvasHeight = 1200;
    }

    // Коэффициент удлинения холста
    const canvasRatio = canvasHeight / canvasWidth;

    // Задаем высоту контейнера
    container.style.paddingTop = `${canvasRatio * 100}%`;

    console.log(`🎨 Zine Final: Ratio=${canvasRatio.toFixed(3)}`);

    // 2. Рендерим блоки
    (data.blocks || []).forEach((block, index) => {
        const el = document.createElement('div');
        el.className = 'zine-block';
        el.id = `zine-block-${block.id}`;
        
        // === КОРРЕКЦИЯ КООРДИНАТ ===
        const correctedHeight = block.frontendHeight / canvasRatio;
        const correctedTop = block.frontendY / canvasRatio;

        el.style.left = `${block.frontendX}%`;
        el.style.width = `${block.frontendWidth}%`;
        el.style.top = `${correctedTop}%`;
        el.style.height = `${correctedHeight}%`;
        el.style.zIndex = block.zIndex || (index + 1);
        
        // Поворот
        if (block.transform) {
            el.style.transform = block.transform;
        } else if (block.rotation) {
            el.style.transform = `rotate(${block.rotation}deg)`;
        }
        
        if (block.type === 'image') {
            const imgContainer = document.createElement('div');
            imgContainer.className = 'zine-image-container';
            
            const img = document.createElement('img');
            const imgSrc = block.data || block.url || '';
            img.src = imgSrc;
            img.alt = block.alt || '';
            img.loading = "lazy"; 

            img.style.cursor = 'pointer';
            img.onclick = (e) => {
                e.stopPropagation();
                if (typeof openLightbox === 'function') {
                    openLightbox(img.src, img.alt, img);
                }
            };
            
            imgContainer.appendChild(img);
            el.appendChild(imgContainer);
        } 
        // 🔥 ИСПРАВЛЕНО: ТЕКСТОВЫЙ БЛОК С ПРЯМОЙ УСТАНОВКОЙ FONT-SIZE
else if (block.type === 'text') {
    const textWrapper = document.createElement('div');
    textWrapper.className = 'zine-text-content';
    textWrapper.innerHTML = block.html || block.data || '';
    el.appendChild(textWrapper);
    
    if (block.baseFontSize && block.originalWidth) {
        // Сохраняем данные для пересчёта
        textWrapper.dataset.baseFontSize = block.baseFontSize;
        textWrapper.dataset.originalWidth = block.originalWidth;
        
        // 🔥 КРИТИЧНО: Прямая установка font-size через inline style
        // Это гарантирует, что размер применится даже если CSS перебит Tailwind
        const initialScale = (block.frontendWidth / 100) * canvasWidth / block.originalWidth;
        const computedFontSize = Math.max(12, block.baseFontSize * initialScale);
        textWrapper.style.fontSize = `${computedFontSize}px`;
        
        // CSS-переменные как backup
        textWrapper.style.setProperty('--base-font-size', `${block.baseFontSize}px`);
        textWrapper.style.setProperty('--font-scale', initialScale);
        
        // Очищаем inline font-size из дочерних элементов
        textWrapper.querySelectorAll('span, p, div, b, strong, i, em, h1, h2, h3, h4, h5, h6').forEach(child => {
            child.style.fontSize = '';
            if (!child.getAttribute('style') || child.getAttribute('style').trim() === '') {
                child.removeAttribute('style');
            }
        });
    }
}
        
        // 🔥 АБЗАЦ — фиксированный шрифт, как у текстовых страниц
        else if (block.type === 'paragraph') {
            const paraWrapper = document.createElement('div');
            paraWrapper.className = 'zine-paragraph-content';
            paraWrapper.innerHTML = block.html || block.data || '';
            
            // Очищаем inline font-size (на случай старых данных)
            paraWrapper.querySelectorAll('[style*="font-size"]').forEach(child => {
                child.style.fontSize = '';
                if (!child.getAttribute('style') || child.getAttribute('style').trim() === '') {
                    child.removeAttribute('style');
                }
            });
            
            el.appendChild(paraWrapper);
        }
        
        // 🔥 КНОПКА — используем CSS-переменные темы сайта
        else if (block.type === 'button') {
            const data = block.data || {};
            const wrapper = document.createElement('div');
            wrapper.className = 'zine-button-wrapper';
            wrapper.style.width = '100%';
            wrapper.style.height = '100%';
            wrapper.style.display = 'flex';
            wrapper.style.alignItems = 'center';
            wrapper.style.justifyContent = 'center';

            const a = document.createElement('a');
            a.className = data.style || 'button';
            a.textContent = data.text || 'Кнопка';

            if (data.url) {
                a.href = data.url;
                // Внутренние ссылки (#page-id) — навигация через showContent
                if (data.url.startsWith('#')) {
                    a.addEventListener('click', (e) => {
                        e.preventDefault();
                        const targetId = data.url.substring(1);
                        if (typeof showContent === 'function') showContent(targetId);
                    });
                } else {
                    // Внешние ссылки
                    if (data.target === '_blank') {
                        a.target = '_blank';
                        a.rel = 'noopener noreferrer';
                    }
                }
            } else {
                a.href = '#';
                a.addEventListener('click', e => e.preventDefault());
            }

            wrapper.appendChild(a);
            el.appendChild(wrapper);
            el.classList.add('zine-block-button');
        }
        
        container.appendChild(el);
    });
    
    // 🔥 КРИТИЧНО: После рендера всех блоков — рассчитываем фактический масштаб
    // 🔥 ИСПРАВЛЕНО: Ждём реального layout перед расчётом шрифта
function recalcZineFonts() {
    const textContents = container.querySelectorAll('.zine-text-content');
    let allReady = true;
    textContents.forEach(textWrapper => {
        const baseFontSize = parseFloat(textWrapper.dataset.baseFontSize);
        const originalWidth = parseFloat(textWrapper.dataset.originalWidth);
        if (!baseFontSize || !originalWidth) return;
        const blockElement = textWrapper.closest('.zine-block');
        if (blockElement) {
            const actualBlockWidth = blockElement.offsetWidth;
            if (actualBlockWidth === 0) {
                allReady = false; // Блок ещё не отрисован
                return;
            }
            const actualScale = actualBlockWidth / originalWidth;
            textWrapper.style.setProperty('--font-scale', actualScale);
            // 🔥 FALLBACK: Прямая установка font-size
            const computedFontSize = Math.max(12, baseFontSize * actualScale);
            textWrapper.style.fontSize = `${computedFontSize}px`;
            console.log(`🔤 Zine Font: base=${baseFontSize}px, width=${actualBlockWidth}px, scale=${actualScale.toFixed(3)}, final=${computedFontSize.toFixed(1)}px`);
        }
    });
    return allReady;
}

// Попытка 1: через rAF (после первого paint)
requestAnimationFrame(() => {
    requestAnimationFrame(() => {
        if (!recalcZineFonts()) {
            // Попытка 2: через 300мс (для медленных загрузок)
            setTimeout(() => {
                if (!recalcZineFonts()) {
                    // Попытка 3: через 800мс (fallback)
                    setTimeout(recalcZineFonts, 500);
                }
            }, 300);
        }
    });
});
}


// Лайтбокс для вебзинов
function initZineLightbox() {
    document.querySelectorAll(".zine-inner img").forEach(img => {
        img.addEventListener("click", () => {
            openLightbox(img.src, img.alt, img);
        });
    });
}


// =====================================================================
// Модальное окно для блоков «Абзац» в вебзинах
// Проверяет реальный overflow — работает на любом размере экрана
// =====================================================================
function initZineParagraphModal(container) {
    var paras = container.querySelectorAll('.zine-paragraph-content');
    if (!paras.length) return;

    // Одна модалка на страницу — создаём только один раз
    var modal = document.getElementById('zine-para-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'zine-para-modal';
        modal.className = 'zine-para-modal';
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('role', 'dialog');
        modal.innerHTML =
            '<div class="zine-para-modal__backdrop"></div>' +
            '<div class="zine-para-modal__sheet">' +
                '<button class="zine-para-modal__close" aria-label="\u0417\u0430\u043a\u0440\u044b\u0442\u044c">\u2715</button>' +
                '<div class="zine-para-modal__body"></div>' +
            '</div>';
        document.body.appendChild(modal);

        var closeModal = function() {
            modal.classList.remove('is-open');
            document.body.style.overflow = '';
        };
        modal.querySelector('.zine-para-modal__backdrop').addEventListener('click', closeModal);
        modal.querySelector('.zine-para-modal__close').addEventListener('click', closeModal);
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
        });
    }

    // Проверяет overflow и обновляет состояние блока
    var checkOverflow = function(para) {
        var block = para.closest('.zine-block');
        if (!block) return;

        var isOverflowing = para.scrollHeight > para.clientHeight + 4;

        if (isOverflowing) {
            block.classList.add('zine-para-overflow');
            // Вешаем обработчик клика только один раз
            if (!block.dataset.paraModalInit) {
                block.dataset.paraModalInit = '1';

                var hint = document.createElement('span');
                hint.className = 'zine-para-hint';
                var hintSVG =
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<path stroke="none" d="M0 0h24v24H0z" fill="none"/>' +
        '<path d="M8 4h-2l-3 10v2.5" />' +
        '<path d="M16 4h2l3 10v2.5" />' +
        '<path d="M10 16l4 0" />' +
        '<path d="M14 16.5a3.5 3.5 0 1 0 7 0a3.5 3.5 0 1 0 -7 0" />' +
        '<path d="M3 16.5a3.5 3.5 0 1 0 7 0a3.5 3.5 0 1 0 -7 0" />' +
    '</svg>';
    hint.innerHTML = hintSVG;
                hint.setAttribute('aria-hidden', 'true');
                block.appendChild(hint);

                block.addEventListener('click', function() {
                    modal.querySelector('.zine-para-modal__body').innerHTML = para.innerHTML;
                    modal.classList.add('is-open');
                    document.body.style.overflow = 'hidden';
                    modal.querySelector('.zine-para-modal__sheet').scrollTop = 0;
                });
            }
        } else {
            block.classList.remove('zine-para-overflow');
        }
    };

    // Первичная проверка — после отрисовки
    setTimeout(function() {
        paras.forEach(checkOverflow);
    }, 300);

    // Повторная проверка при ресайзе (debounce 200ms)
    var resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            paras.forEach(checkOverflow);
        }, 200);
    });
}





// NEW: Обработчик события wheel для карусели
// FIX: та же проблема, что и в лайтбоксе — трекпад шлёт много wheel-событий с
// маленькой дельтой на один жест, и без ограничения частоты один свайп листал
// сразу несколько картинок. Добавлен кулдаун между переключениями.
let carouselWheelCooldown = false;
function handleCarouselWheel(event) {
    if (!activeCarouselGallery || carouselImagesData.length <= 1) return; // Не перелистывать, если 1 или меньше изображений
    event.preventDefault(); // Предотвратить прокрутку страницы
    if (carouselWheelCooldown) return; // Игнорируем "дребезг" трекпада
    carouselWheelCooldown = true;
    if (event.deltaY > 0) { // Прокрутка вниз -> следующее изображение
        nextCarouselImage();
    } else { // Прокрутка вверх -> предыдущее изображение
        prevCarouselImage();
    }
    stopCarouselAutoplay(); // Остановить автовоспроизведение при ручном взаимодействии
    setTimeout(() => { carouselWheelCooldown = false; }, 500);
}


// --- NEW: Обработчики событий свайпов для сенсорных устройств ---
function handleTouchStart(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    touchEndX = 0;
    touchEndY = 0;
}

function handleTouchMove(e) {
    touchEndX = e.touches[0].clientX;
    touchEndY = e.touches[0].clientY;
}

function handleTouchEndLightbox() {
    if (touchStartX === 0 || touchStartY === 0) {
        touchStartX = 0;
        touchStartY = 0;
        touchEndX = 0;
        touchEndY = 0;
        return;
    }
    
    // Если не было движения (короткий тап) - ничего не делаем
    if (touchEndX === 0 && touchEndY === 0) {
        touchStartX = 0;
        touchStartY = 0;
        return;
    }

    const deltaX = touchStartX - touchEndX;
    const deltaY = touchStartY - touchEndY;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // Определяем направление свайпа (горизонтальный или вертикальный)
    if (absDeltaY > absDeltaX) {
        // Вертикальный свайп (вверх ИЛИ вниз)
        if (absDeltaY > minCloseSwipeDistance) {
            // Свайп вверх или вниз - закрываем лайтбокс
            closeLightbox();
        }
    } else {
        // Горизонтальный свайп - навигация
        if (absDeltaX > minSwipeDistance && isGalleryContext) {
            if (deltaX > 0) {
                showImage(currentImageIndex + 1); // Влево → вперёд
            } else {
                showImage(currentImageIndex - 1); // Вправо → назад
            }
            showLightboxNavControls();
        }
    }
    
    touchStartX = 0;
    touchStartY = 0;
    touchEndX = 0;
    touchEndY = 0;
}

function handleTouchEndCarousel() {
    if (!activeCarouselGallery || carouselImagesData.length <= 1 || touchStartX === 0 || touchEndX === 0) return;

    const deltaX = touchStartX - touchEndX;
    if (Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX > 0) { // Свайп влево (показываем следующую)
            nextCarouselImage();
        } else { // Свайп вправо (показываем предыдущую)
            prevCarouselImage();
        }
        stopCarouselAutoplay(); // Остановить автовоспроизведение при ручном взаимодействии
    }
    touchStartX = 0;
    touchEndX = 0;
}

function handleTouchEndShowcase() {
    if (!activeShowcaseGallery || showcaseImagesData.length <= 1 || touchStartX === 0 || touchEndX === 0) return;

    const deltaX = touchStartX - touchEndX;
    if (Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX > 0) { // Свайп влево (показываем следующую)
            nextShowcaseImage();
        } else { // Свайп вправо (показываем предыдущую)
            prevShowcaseImage();
        }
        stopShowcaseAutoplay(); // Остановить автовоспроизведение при ручном взаимодействии
    }
    touchStartX = 0;
    touchEndX = 0;
}




document.addEventListener('DOMContentLoaded', () => {
	
    // Получение элементов DOM внутри DOMContentLoaded
    body = document.body;
    lightbox = document.getElementById('lightbox');
    lightboxImageContainer = document.getElementById('lightbox_image');
    lightboxFullscreenIcon = document.getElementById('lightbox_fullscreen_icon');
    backToTopLink = document.getElementById('backToTopLink');
    darkModeToggleDesktop = document.getElementById('darkModeToggle'); // Переключатель боковой панели для десктопа
    darkModeIconDesktop = document.getElementById('darkModeIcon');     // Иконка боковой панели для десктопа
    darkModeToggleMobile = document.getElementById('darkModeToggleMobile'); // Переключатель мобильной шапки
    darkModeIconMobile = document.getElementById('darkModeIconMobile');     // Иконка мобильной шапки
    menuToggleMobile = document.getElementById('menuToggle'); // Переключатель мобильного меню
    menuToggleDesktop = document.getElementById('menuToggleDesktop'); // Новый переключатель десктопного меню
    mainNav = document.getElementById('mainNav');
    mainNavList = document.getElementById('mainNavList');
    dynamicContentContainer = document.getElementById('dynamicContentContainer');
    footerMenu = document.getElementById('footerMenu'); // Элемент меню футера
    lightboxArrowLeft = document.getElementById('lightbox-arrow-left'); // Левая стрелка лайтбокса
    lightboxArrowRight = document.getElementById('lightbox-arrow-right'); // Правая стрелка лайтбокса
    desktopHeaderHiddenSidebar = document.getElementById('desktopHeaderHiddenSidebar');
    desktopHeaderLogo = document.getElementById('desktopHeaderLogo');
    darkModeToggleDesktopHeader = document.getElementById('darkModeToggleDesktopHeader');
    darkModeIconDesktopHeader = document.getElementById('darkModeIconDesktopHeader');
    
    // Применяем начальную тему ПОСЛЕ инициализации всех DOM-элементов
applyInitialThemeOnLoad();
    
    // === СКРЫТЬ ПЕРЕКЛЮЧАТЕЛИ ЯЗЫКА, ЕСЛИ I18N ВЫКЛЮЧЕН ===
if (!window.siteConfig?.i18n?.enabled) {
    const langToggles = [
        document.getElementById('langToggleMain'),
        document.getElementById('langToggleDesktop'),
        document.getElementById('langToggleMobile')
    ].filter(el => el);
    langToggles.forEach(el => el.style.display = 'none');
}

    // START: Mobile menu toggle setup - put this first to ensure it's initialized
    if (menuToggleMobile && mainNav) {
        console.log('Mobile menu toggle and navigation elements found.');
        menuToggleMobile.addEventListener('click', () => {
            console.log('Mobile Hamburger clicked!'); // Debug log
            mainNav.classList.toggle('active');
            if (mainNav.classList.contains('active')) {
                body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
                console.log('Mobile menu opened.');
            } else {
                body.style.overflow = 'auto'; // Restore scrolling
                console.log('Mobile menu closed.');
            }
        });
    } else {
        console.error('Mobile menu toggle (menuToggleMobile) or navigation element (mainNav) not found!');
    }
    // END: Mobile menu toggle setup

    // NEW: Desktop menu toggle setup (for hidden sidebar)
    if (menuToggleDesktop && mainNav) {
        console.log('Desktop menu toggle and navigation elements found.');
        menuToggleDesktop.addEventListener('click', () => {
            console.log('Desktop Hamburger clicked!'); // Debug log
            mainNav.classList.toggle('active');
            if (mainNav.classList.contains('active')) {
                body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
                console.log('Desktop slide-out menu opened.');
            } else {
                body.style.overflow = 'auto'; // Restore scrolling
                console.log('Desktop slide-out menu closed.');
            }
        });
    } else {
        console.error('Desktop menu toggle (menuToggleDesktop) or navigation element (mainNav) not found!');
    }
    


    const validationErrors = validateSiteConfig(window.siteConfig);
    if (validationErrors.length > 0) {
        console.error("SiteConfig validation errors:");
        validationErrors.forEach(error => console.error(error));
        // Optionally, display an error message on the page
        dynamicContentContainer.innerHTML = `<div class="text-red-500 p-4">Site configuration loading error. Please check console for details.</div>`;
        return; // Stop execution if configuration is invalid
    }

    // NEW: Inject custom CSS if provided in config
    if (window.siteConfig.customCode?.customCSS) {
        const styleTag = document.createElement('style');
        styleTag.textContent = window.siteConfig.customCode.customCSS;
        document.head.appendChild(styleTag);
    }

    // Apply dynamic styles
    const rootStyle = document.documentElement.style;
    if (window.siteConfig.styles.accentColor) {
        rootStyle.setProperty('--accent-color-light', window.siteConfig.styles.accentColor);
        rootStyle.setProperty('--button-bg-light', window.siteConfig.styles.accentColor);
        rootStyle.setProperty('--hover-accent-color-light', darkenColor(window.siteConfig.styles.accentColor, 15));
        rootStyle.setProperty('--button-hover-bg-light', darkenColor(window.siteConfig.styles.accentColor, 15));

        // Determine dark accent color
        const darkAccent = window.siteConfig.styles.darkAccentColor || lightenColor(window.siteConfig.styles.accentColor, 50);
        rootStyle.setProperty('--accent-color-dark', darkAccent);
        rootStyle.setProperty('--button-bg-dark', darkAccent);
        rootStyle.setProperty('--hover-accent-color-dark', lightenColor(darkAccent, 15));
        rootStyle.setProperty('--button-hover-bg-dark', lightenColor(darkAccent, 15));
    }

    // Apply text font family
    if (window.siteConfig.styles.fontFamily) {
        document.body.style.fontFamily = window.siteConfig.styles.fontFamily;
        // If a Google Font is specified, dynamically load it if not already present
        if (window.siteConfig.styles.fontFamily.includes("'") && window.siteConfig.styles.fontFamily.includes(',')) {
            const fontName = window.siteConfig.styles.fontFamily.split(',')[0].replace(/'/g, '').trim();
            const googleFontLink = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}:wght@300;400;600;700&display=swap`;
            if (!document.querySelector(`link[href*="${fontName.replace(/ /g, '+')}"]`)) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = googleFontLink;
                document.head.appendChild(link);
            }
        }
    }

    // Apply logo font family and size
    if (window.siteConfig.styles.logoFontFamily) {
        rootStyle.setProperty('--logo-font-family', window.siteConfig.styles.logoFontFamily);
        // Dynamically load Google Font for logo if needed
        if (window.siteConfig.styles.logoFontFamily.includes("'") && window.siteConfig.styles.logoFontFamily.includes(',')) {
            const logoFontName = window.siteConfig.styles.logoFontFamily.split(',')[0].replace(/'/g, '').trim();
            const googleLogoFontLink = `https://fonts.googleapis.com/css2?family=${logoFontName.replace(/ /g, '+')}:wght@600;700&display=swap`;
            if (!document.querySelector(`link[href*="${logoFontName.replace(/ /g, '+')}"]`)) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = googleLogoFontLink;
                document.head.appendChild(link);
            }
        }
    }
    if (window.siteConfig.styles.logoFontSize) {
        rootStyle.setProperty('--logo-font-size-desktop', window.siteConfig.styles.logoFontSize);
        // Calculate mobile logo size if not explicitly set
        const desktopSizeValue = parseFloat(window.siteConfig.styles.logoFontSize);
        const desktopSizeUnit = window.siteConfig.styles.logoFontSize.match(/[a-zA-Z%]+$/) ? window.siteConfig.styles.logoFontSize.match(/[a-zA-Z%]+$/)[0] : 'rem';

        const mobileLogoSize = window.siteConfig.styles.logoMobileFontSize ||
                               `${desktopSizeValue * 0.8}${desktopSizeUnit}`; // Default to 80% of desktop size
        rootStyle.setProperty('--logo-font-size-mobile', mobileLogoSize);
    }

    if (window.siteConfig.styles.textFontSize) {
        rootStyle.setProperty('--text-font-size', window.siteConfig.styles.textFontSize);
    }

    // Map Tailwind max-width classes to actual pixel or rem values for CSS variables
    const maxWidthClassMap = {
        "max-w-xs": "20rem", "max-w-sm": "24rem", "max-w-md": "28rem",
        "max-w-lg": "32rem", "max-w-xl": "36rem", "max-w-2xl": "42rem",
        "max-w-3xl": "48rem", "max-w-4xl": "56rem", "max-w-5xl": "64rem",
        "max-w-6xl": "72rem", "max-w-7xl": "80rem", "max-w-full": "100%",
        "max-w-screen-sm": "640px", "max-w-screen-md": "768px",
        "max-w-screen-lg": "1024px",
        "max-w-screen-xl": "1280px",
        "max-w-screen-2xl": "1536px"
    };
    const selectedMaxWidth = window.siteConfig.styles.contentMaxWidthClass;
    if (selectedMaxWidth && maxWidthClassMap[selectedMaxWidth]) {
        rootStyle.setProperty('--content-max-width', maxWidthClassMap[selectedMaxWidth]);
    } else if (selectedMaxWidth) {
        // Allow custom values like "1400px" or "90rem"
        rootStyle.setProperty('--content-max-width', selectedMaxWidth);
    } else {
        rootStyle.setProperty('--content-max-width', '80rem'); // Default to max-w-7xl
    }

    if (window.siteConfig.styles.sidebarWidth) {
        rootStyle.setProperty('--sidebar-width', window.siteConfig.styles.sidebarWidth);
    }
    // Update heading font sizes
    if (window.siteConfig.styles.h1FontSize) {
        rootStyle.setProperty('--h1-font-size', window.siteConfig.styles.h1FontSize);
    }
    if (window.siteConfig.styles.h2FontSize) {
        rootStyle.setProperty('--h2-font-size', window.siteConfig.styles.h2FontSize);
    }
    if (window.siteConfig.styles.h3FontSize) {
        rootStyle.setProperty('--h3-font-size', window.siteConfig.styles.h3FontSize);
    }
    if (window.siteConfig.styles.headingMarginBottom) {
        rootStyle.setProperty('--heading-margin-bottom', window.siteConfig.styles.headingMarginBottom);
    }

    if (window.siteConfig.styles.menuItemSpacing) {
        rootStyle.setProperty('--menu-item-spacing', window.siteConfig.styles.menuItemSpacing);
    }
    if (window.siteConfig.styles.paragraphLineHeight) {
        rootStyle.setProperty('--paragraph-line-height', window.siteConfig.styles.paragraphLineHeight);
    }
    if (window.siteConfig.styles.paragraphMarginBottom) {
        rootStyle.setProperty('--paragraph-margin-bottom', window.siteConfig.styles.paragraphMarginBottom);
    }
    rootStyle.setProperty('--prose-link-text-decoration', window.siteConfig.styles.proseLinkUnderline ? 'underline' : 'none');
    if (window.siteConfig.styles.standaloneImageMaxWidth) {
        rootStyle.setProperty('--standalone-image-max-width', window.siteConfig.styles.standaloneImageMaxWidth);
    }
    if (window.siteConfig.styles.videoMaxWidth) {
        rootStyle.setProperty('--video-max-width', window.siteConfig.styles.videoMaxWidth);
    }
    if (window.siteConfig.styles.contentAreaPaddingTop) {
        rootStyle.setProperty('--content-area-padding-top', window.siteConfig.styles.contentAreaPaddingTop);
    }
    if (window.siteConfig.styles.horizontalGalleryMaxHeight) {
        rootStyle.setProperty('--horizontal-gallery-max-height', window.siteConfig.styles.horizontalGalleryMaxHeight);
    }

    // Глобальный размер шрифта заголовка showcase
if (window.siteConfig.styles.showcaseTitleFontSize) {
    showcaseTitleFontSize = window.siteConfig.styles.showcaseTitleFontSize;
    rootStyle.setProperty('--showcase-title-font-size', showcaseTitleFontSize);
}


    // Populate navigation and logo
    const sidebarLogoContainer = document.getElementById('sidebarLogo');
    const mobileHeaderLogoContainer = document.getElementById('mobileHeaderLogo');
    // NEW: desktopHeaderLogoContainer for desktop header when sidebar is hidden
    const desktopHeaderLogoContainer = document.getElementById('desktopHeaderLogo');

    function renderLogo(container) {
        container.innerHTML = ''; // Clear existing content
        if (window.siteConfig.site.logoType === 'image') {
            const img = document.createElement('img');
            img.src = window.siteConfig.site.logoImagePath;
            img.alt = window.siteConfig.site.title + ' Logo';
            container.appendChild(img);
        } else {
            container.textContent = window.siteConfig.site.title;
        }
    }

    renderLogo(sidebarLogoContainer);
    renderLogo(mobileHeaderLogoContainer);
    renderLogo(desktopHeaderLogoContainer); // Render for new desktop header

    // Dynamic navigation menu construction
    mainNavList.innerHTML = ''; // Clear existing navigation items
    // === АВТО-НОРМАЛИЗАЦИЯ КОНФИГА ПЕРЕД РЕНДЕРОМ ===
if (window.siteConfig.navigation) {
    window.siteConfig.navigation.forEach(item => {
        if (Array.isArray(item.children)) {
            item.type = 'parent';
            item.children.forEach(child => {
                if (Array.isArray(child.children) && child.children.length > 0) {
                    child.type = 'parent';
                }
            });
        }
    });
}
// ================================================
    window.siteConfig.navigation.forEach(navItem => {
        const li = document.createElement('li');
        if (navItem.type === 'parent') {
            li.classList.add('parent-item');
            const parentLink = document.createElement('a');
            parentLink.href = '#'; // Parent itself is not a direct link
            parentLink.textContent = navItem.label;
            parentLink.innerHTML += ' <i class="fas fa-chevron-down toggle-icon"></i>'; // Add icon
            li.appendChild(parentLink);

            const subMenuUl = document.createElement('ul');
            subMenuUl.classList.add('submenu'); // Already hidden with CSS max-height: 0
            navItem.children.forEach(childItem => {
                const subLi = document.createElement('li');
                const subLink = document.createElement('a');
                subLink.textContent = childItem.label;

                if (childItem.type === 'link') {
                    // Внешняя ссылка
                    subLink.href = childItem.url;
                    subLink.target = '_blank';
                    subLink.rel = 'noopener noreferrer';
                    subLink.addEventListener('click', () => {
                        if (window.innerWidth <= 768 || body.classList.contains('sidebar-hidden')) {
                            mainNav.classList.remove('active');
                            body.style.overflow = 'auto';
                        }
                    });
                    subLi.appendChild(subLink);

               } else if (childItem.type === 'parent' || Array.isArray(childItem.children)) {
                // Раздел 2-го уровня с подпунктами 3-го уровня
                subLi.classList.add('submenu-parent-item');
                subLink.href = '#';
                // Стрелка-индикатор
                const arrowIcon = document.createElement('i');
                arrowIcon.className = 'fas fa-chevron-right toggle-icon-sub';
                subLink.appendChild(arrowIcon);

                const subSubMenuUl = document.createElement('ul');
                subSubMenuUl.classList.add('sub-submenu');

                (Array.isArray(childItem.children) ? childItem.children : []).forEach(grandItem => {
                    if (!grandItem) return; // защита от битых элементов
                    const gcLi = document.createElement('li');
                    const gcLink = document.createElement('a');
                    // безопасный fallback для label, чтобы не было undefined
                    gcLink.textContent = grandItem.label || (grandItem.type === 'link' ? 'Внешняя ссылка' : 'Страница');

                        if (grandItem.type === 'link') {
                            gcLink.href = grandItem.url;
                            gcLink.target = '_blank';
                            gcLink.rel = 'noopener noreferrer';
                            gcLink.addEventListener('click', () => {
                                if (window.innerWidth <= 768 || body.classList.contains('sidebar-hidden')) {
                                    mainNav.classList.remove('active');
                                    body.style.overflow = 'auto';
                                }
                            });
                        } else {
                            gcLink.href = `#${grandItem.id}`;
                            gcLink.classList.add('nav-link');
                            gcLink.dataset.target = grandItem.id;
                            gcLink.addEventListener('click', (event) => {
                                event.preventDefault();
                                const targetId = event.currentTarget.dataset.target;
                                showContent(targetId, -1);
                                if (window.innerWidth <= 768 || body.classList.contains('sidebar-hidden')) {
                                    mainNav.classList.remove('active');
                                    body.style.overflow = 'auto';
                                }
                            });
                        }
                        gcLi.appendChild(gcLink);
                        subSubMenuUl.appendChild(gcLi);
                    });

                    subLi.appendChild(subLink);
                    subLi.appendChild(subSubMenuUl);

                    // Переключение sub-submenu по клику на родительский пункт 2-го уровня
                    subLink.addEventListener('click', (event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        const isExpanded = subLi.classList.toggle('expanded');
                        subSubMenuUl.classList.toggle('expanded', isExpanded);
                        // Закрываем соседние открытые sub-submenu
                        Array.from(subMenuUl.querySelectorAll('.submenu-parent-item.expanded')).forEach(other => {
                            if (other !== subLi) {
                                other.classList.remove('expanded');
                                const otherSub = other.querySelector('.sub-submenu');
                                if (otherSub) otherSub.classList.remove('expanded');
                            }
                        });
                    });

                } else {
                    // Gallery, text, zine — обычные пункты подменю
                    subLink.href = `#${childItem.id}`;
                    subLink.classList.add('nav-link');
                    subLink.dataset.target = childItem.id;
                    subLink.addEventListener('click', (event) => {
                        event.preventDefault();
                        const targetId = event.currentTarget.dataset.target;
                        showContent(targetId, -1);
                        if (window.innerWidth <= 768 || body.classList.contains('sidebar-hidden')) {
                            mainNav.classList.remove('active');
                            body.style.overflow = 'auto';
                        }
                    });
                    subLi.appendChild(subLink);
                }

                subMenuUl.appendChild(subLi);
            });
            li.appendChild(subMenuUl);

            parentLink.addEventListener('click', (event) => {
                event.preventDefault();
                // Toggle 'expanded' class on parent LI and submenu UL
                li.classList.toggle('expanded');
                subMenuUl.classList.toggle('expanded');
                // For mobile, ensure only one submenu is open at a time
                if (window.innerWidth <= 768 || body.classList.contains('sidebar-hidden')) { // Apply for desktop slide-out too
                    document.querySelectorAll('.main-nav .parent-item.expanded').forEach(otherParent => {
                        if (otherParent !== li) {
                            otherParent.classList.remove('expanded');
                            otherParent.querySelector('.submenu').classList.remove('expanded');
                        }
                    });
                }
            });
        } else if (navItem.type === 'link') { // Handle top-level 'link' type
            const a = document.createElement('a');
            a.href = navItem.url;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            a.textContent = navItem.label;
            li.appendChild(a);
            a.addEventListener('click', () => {
                // Close mobile/slide-out menu if clicked from mobile/hidden sidebar desktop
                if (window.innerWidth <= 768 || body.classList.contains('sidebar-hidden')) {
                    mainNav.classList.remove('active');
                    body.style.overflow = 'auto';
                }
            });
        
        } else { // Gallery and text types (top-level)
            const a = document.createElement('a');
            a.href = `#${navItem.id}`;
            a.classList.add('nav-link');
            a.dataset.target = navItem.id;
            a.textContent = navItem.label;
            li.appendChild(a);
            a.addEventListener('click', (event) => {
                event.preventDefault();
                const targetId = event.target.dataset.target;
                showContent(targetId, -1); // <<< PATCH: Added -1
                // Close mobile/slide-out menu if clicked from mobile/hidden sidebar desktop
                if (window.innerWidth <= 768 || body.classList.contains('sidebar-hidden')) {
                    mainNav.classList.remove('active');
                    body.style.overflow = 'auto';
                }
            });
        }
        mainNavList.appendChild(li);
    });

    // Populate footer navigation (now a direct descendant of mainNav)
    if (footerMenu && window.siteConfig.footerNavigation) {
        footerMenu.innerHTML = ''; // Clear existing content
        window.siteConfig.footerNavigation.forEach(footerNavItem => {
            const a = document.createElement('a');
            a.textContent = footerNavItem.label;
            a.classList.add('footer-link'); // Add class for footer links

            if (footerNavItem.type === 'link') {
                a.href = footerNavItem.url;
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
            } else { // For 'gallery' or 'text' types in footer, link to content sections
                a.href = `#${footerNavItem.id}`;
                a.dataset.target = footerNavItem.id;
                a.addEventListener('click', (event) => {
                    event.preventDefault();
                    showContent(event.target.dataset.target, -1); // <<< PATCH: Added -1
                    // Close mobile/slide-out menu if open
                    if (window.innerWidth <= 768 || body.classList.contains('sidebar-hidden')) {
                        mainNav.classList.remove('active');
                        body.style.overflow = 'auto';
                    }
                });
            }
            footerMenu.appendChild(a);
        });
    }

    // Event listeners for desktop dark mode toggle (now fixed HTML element)
    if (darkModeToggleDesktop) darkModeToggleDesktop.addEventListener('click', toggleDarkMode);
    // Mobile dark mode toggle listener (fixed in mobile header)
    if (darkModeToggleMobile) darkModeToggleMobile.addEventListener('click', toggleDarkMode);
    // NEW: Desktop header dark mode toggle listener
    if (darkModeToggleDesktopHeader) darkModeToggleDesktopHeader.addEventListener('click', toggleDarkMode);


    // Populate dynamic content sections (galleries and text sections)
   // Создаём ЗАГЛУШКИ для всех галерей — только <section id="..."> без контента
window.siteConfig.galleriesData.forEach(gallery => {
    const stub = document.createElement('section');
    stub.id = gallery.id;
    stub.className = 'content-section hidden gallery-section'; // важно: не gallery-section.active!
    // Добавляем минимальные классы для распознавания типа
    if (gallery.layoutClass === 'gallery-horizontal-scroll') {
        stub.classList.add('horizontal-gallery-parent');
    } else if (gallery.layoutClass === 'gallery-single-image-carousel') {
        stub.classList.add('single-image-carousel-parent');
    } else if (gallery.layoutClass === 'gallery-showcase') {
        stub.classList.add('showcase-gallery-parent');
    }
    dynamicContentContainer.appendChild(stub);
});
// ========== СОЗДАНИЕ ЗИНОВ ПРИ ЗАГРУЗКЕ ==========
window.siteConfig.zinePagesData?.forEach(zinePage => {
    const section = document.createElement('section');
    section.id = zinePage.id;
    // ИСПРАВЛЕНО: убираем класс hidden, добавляем zine-section
    section.className = 'content-section zine-section';

    let titleHtml = zinePage.hideTitle ? '' : `<h2 class="font-bold text-center mb-6">${zinePage.title}</h2>`;

    // Применяем max-width из настроек зина
    const containerMaxWidth = zinePage.contentMaxWidth || 'var(--content-max-width)';

    section.innerHTML = `
        <div class="container mx-auto py-4 px-0" style="max-width: ${containerMaxWidth};">
            ${titleHtml}
            <div class="zine-canvas">
                <div class="zine-inner"
                     data-canvas-width="${zinePage.editorSettings?.canvasWidth || 1100}"
                     data-canvas-height="${zinePage.editorSettings?.canvasHeight || 1500}">
                </div>
            </div>
        </div>
    `;

    dynamicContentContainer.appendChild(section);
    
    // ВАЖНО: рендерим контент сразу после создания
    renderZine(section, zinePage);
    initZineParagraphModal(section);
    
    // Устанавливаем hidden после рендеринга, чтобы контент был готов
    section.classList.add('hidden');
});

   // === ОПРЕДЕЛЕНИЕ initialContentId (Исправленная логика) ===
    const hash = window.location.hash.substring(1);
    let initialContentId = null;

    // Вспомогательная функция проверки существования ID в конфиге
    const isValidContentId = (id) => {
        if (!id) return false;
        const isGallery = window.siteConfig.galleriesData.some(g => g.id === id);
        const isText = window.siteConfig.textPagesData.some(t => t.id === id);
        const isZine = window.siteConfig.zinePagesData?.some(z => z.id === id);
        return isGallery || isText || isZine;
    };

    // 1. Проверяем Хеш (приоритет №1)
    // Если по хешу есть валидный контент - используем его
    if (hash && isValidContentId(hash)) {
        initialContentId = hash;
    }

    // 2. Если хеша нет (или он невалиден), проверяем Homepage ID из конфига (приоритет №2)
    if (!initialContentId && window.siteConfig.site.homepageId) {
        if (isValidContentId(window.siteConfig.site.homepageId)) {
            initialContentId = window.siteConfig.site.homepageId;
        }
    }

    // 3. Fallback: Первый пункт меню (приоритет №3)
    if (!initialContentId) {
        let firstContentNavItem = null;
        for (const navItem of window.siteConfig.navigation) {
            // Проверяем верхний уровень
            if (['gallery', 'text', 'zine'].includes(navItem.type)) {
                firstContentNavItem = navItem;
                break;
            }
            // Проверяем вложенные пункты
            if (navItem.type === 'parent' && navItem.children) {
                const childContent = navItem.children.find(child => 
                    ['gallery', 'text', 'zine'].includes(child.type)
                );
                if (childContent) {
                    firstContentNavItem = childContent;
                    break;
                }
            }
        }
        // Проверяем футер, если в меню пусто
        if (!firstContentNavItem && window.siteConfig.footerNavigation) {
            firstContentNavItem = window.siteConfig.footerNavigation.find(item => 
                ['gallery', 'text', 'zine'].includes(item.type)
            );
        }

        if (firstContentNavItem) {
            initialContentId = firstContentNavItem.id;
        }
    }

// Если хэш не дал результата — используем homepageId или fallback
if (!initialContentId) {
    if (window.siteConfig.site.homepageId) {
        const homepageSection = document.getElementById(window.siteConfig.site.homepageId);
        if (homepageSection && (homepageSection.classList.contains('gallery-section') || homepageSection.classList.contains('text-content-section'))) {
            initialContentId = window.siteConfig.site.homepageId;
        }
    }
}


// Fallback: первая доступная секция
if (!initialContentId) {
    let firstContentNavItem = null;
    for (const navItem of window.siteConfig.navigation) {
        // ADD || navItem.type === 'zine' HERE:
        if (navItem.type === 'gallery' || navItem.type === 'text' || navItem.type === 'zine') {
            firstContentNavItem = navItem;
            break;
        }
        if (navItem.type === 'parent' && navItem.children) {
            // ADD || child.type === 'zine' HERE:
            const childContent = navItem.children.find(child => child.type === 'gallery' || child.type === 'text' || child.type === 'zine');
            if (childContent) {
                firstContentNavItem = childContent;
                break;
            }
        }
    }
    if (!firstContentNavItem && window.siteConfig.footerNavigation) {
        // ADD || item.type === 'zine' HERE:
        firstContentNavItem = window.siteConfig.footerNavigation.find(item => item.type === 'gallery' || item.type === 'text' || item.type === 'zine');
    }
    if (firstContentNavItem) {
        initialContentId = firstContentNavItem.id;
    }
}

    // If no valid hash, use homepageId from config
    if (!initialContentId && window.siteConfig.site.homepageId) {
        const homepageSection = document.getElementById(window.siteConfig.site.homepageId);
        if (homepageSection && (homepageSection.classList.contains('gallery-section') || homepageSection.classList.contains('text-content-section'))) {
            initialContentId = window.siteConfig.site.homepageId;
        }
    }

    // Fallback to the first content nav item (including children of parents) if neither hash nor homepageId are valid
    if (!initialContentId) {
        let firstContentNavItem = null;
        for (const navItem of window.siteConfig.navigation) {
             if (navItem.type === 'gallery' || navItem.type === 'text' || navItem.type === 'zine') {
                firstContentNavItem = navItem;
                break;
            }
            if (navItem.type === 'parent' && navItem.children) {
            const childContent = navItem.children.find(child => child.type === 'gallery' || child.type === 'text' || child.type === 'zine');
            if (childContent) {
                firstContentNavItem = childContent;
                break;
            }
            // ДОБАВИТЬ ЭТОТ БЛОК: Проверка 3-го уровня для Fallback
            for (const child of navItem.children) {
                if (child.type === 'parent' && Array.isArray(child.children)) {
                    const grandChildContent = child.children.find(gc => gc.type === 'gallery' || gc.type === 'text' || gc.type === 'zine');
                    if (grandChildContent) {
                        firstContentNavItem = grandChildContent;
                        break;
                    }
                }
            }
            if (firstContentNavItem) break;
        }
        }
        // Check footer navigation for fallback as well
        if (!firstContentNavItem && window.siteConfig.footerNavigation) {
            firstContentNavItem = window.siteConfig.footerNavigation.find(item => item.type === 'gallery' || item.type === 'text');
        }

        if (firstContentNavItem) {
            initialContentId = firstContentNavItem.id;
        }
    }

                    

    

    // Lightbox fullscreen functionality setup
    if (lightbox) {
        lightbox.addEventListener('click', (event) => {
            // Click on fullscreen icon should only toggle fullscreen, not close lightbox.
            if (event.target === lightboxFullscreenIcon) {
                // Allow manual toggle only if autoFullscreenOnClick is false
                if (!window.siteConfig.lightbox.autoFullscreenOnClick) {
                    toggleFullscreen(); // Now correctly toggles
                }
                event.stopPropagation(); // Prevent this click from bubbling to lightbox and closing it.
                return;
            }

            // Click on nav arrows should not close lightbox.
            if (event.target === lightboxArrowLeft || event.target === lightboxArrowRight) {
                event.stopPropagation();
                return;
            }

            // If click on lightbox background or image itself, close it.
            // This handles both auto-fullscreen mode and non-auto mode.
            const clickedImage = lightboxImageContainer.querySelector('img');
            if (event.target === lightbox || event.target === clickedImage || event.target === lightboxImageContainer) {
                closeLightbox();
            }
        });
        
        
        // Делегирование кликов по кнопкам раскрытия описания галерей
document.addEventListener('click', (event) => {
    const button = event.target.closest('.toggle-description-button');
    if (!button) return;

    const descriptionTextContainer = button.previousElementSibling;
    if (!descriptionTextContainer || !descriptionTextContainer.classList.contains('gallery-description-text')) return;

    descriptionTextContainer.classList.toggle('expanded');
    button.innerHTML = descriptionTextContainer.classList.contains('expanded') ? '&times;' : 'i';
});

        // NEW: Add mouse wheel listener for lightbox
        // FIX: трекпад генерирует множество wheel-событий с маленькой дельтой на один
        // жест свайпа (в отличие от мышки, где одно "деление" = одно событие). Без
        // ограничения частоты один жест листал сразу несколько картинок. Добавлен
        // короткий "кулдаун": пока он активен, повторные wheel-события игнорируются.
        let lightboxWheelCooldown = false;
        lightbox.addEventListener('wheel', (event) => {
            if (lightbox.classList.contains('active') && isGalleryContext) {
                event.preventDefault(); // Prevent page scrolling
                if (lightboxWheelCooldown) return; // Игнорируем "дребезг" трекпада
                lightboxWheelCooldown = true;
                if (event.deltaY > 0) { // Scroll down -> next image
                    showImage(currentImageIndex + 1);
                } else { // Scroll up -> previous image
                    showImage(currentImageIndex - 1);
                }
                showLightboxNavControls(); // Reset timeout on interaction
                setTimeout(() => { lightboxWheelCooldown = false; }, 500);
            }
        }, { passive: false });

        // Initialize fullscreen icon state based on autoFullscreenOnClick
        if (lightboxFullscreenIcon) { // Ensure element exists
            if (window.siteConfig.lightbox.autoFullscreenOnClick) {
                lightboxFullscreenIcon.style.display = 'none'; // Hide icon if auto-fullscreen is enabled
                lightboxFullscreenIcon.classList.remove('show-icon');
            } else {
                lightboxFullscreenIcon.style.display = 'block'; // Ensure it displays from the start for manual mode
                // Add mousemove listeners to hide/show icon
                lightbox.addEventListener('mousemove', showFullscreenControls);
                lightbox.addEventListener('mouseleave', hideFullscreenControls);
                // Initially hide controls after a delay
                hideFullscreenControls();
            }
        }

        // Add event listeners for lightbox navigation arrows
        if (lightboxArrowLeft) {
            lightboxArrowLeft.addEventListener('click', (event) => {
                event.stopPropagation(); // Prevent lightbox from closing
                showImage(currentImageIndex - 1);
                showLightboxNavControls(); // Reset timeout on interaction
            });
        }
        if (lightboxArrowRight) {
            lightboxArrowRight.addEventListener('click', (event) => {
                event.stopPropagation(); // Prevent lightbox from closing
                showImage(currentImageIndex + 1);
                showLightboxNavControls(); // Reset timeout on interaction
            });
        }

        // Mouse activity listeners for lightbox navigation arrows
        lightbox.addEventListener('mousemove', showLightboxNavControls);
        lightbox.addEventListener('mouseleave', hideLightboxNavControls);
        // Initial hiding for navigation controls
        hideLightboxNavControls();

        // Listen for fullscreen change events to update icon (only relevant for manual mode, handled inside handleFullscreenChange)
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange); // For Safari
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);   // For Firefox
        document.addEventListener('MSFullscreenChange', handleFullscreenChange);   // For IE/Edge
    }

    // Keyboard navigation for global events
document.addEventListener('keydown', (event) => {
    if (lightbox && lightbox.classList.contains('active')) {
    if (event.key === 'ArrowLeft' && isGalleryContext) {
        showImage(currentImageIndex - 1);
        // УДАЛЕНО: showLightboxNavControls();
    } else if (event.key === 'ArrowRight' && isGalleryContext) {
        showImage(currentImageIndex + 1);
        // УДАЛЕНО: showLightboxNavControls();
    } else if (event.key === ' ') { // Пробел = вперёд
        event.preventDefault();
        if (isGalleryContext) {
            showImage(currentImageIndex + 1);
        }
    } else if (event.key === 'Escape') {
        closeLightbox();
    } else if (event.code === 'KeyF') { // ← РАБОТАЕТ ВСЕГДА, ЛЮБАЯ РАСКЛАДКА
        toggleFullscreen(); // ← БЕЗ УСЛОВИЙ!
    }
}
    // Keyboard navigation for horizontal gallery
    if (activeHorizontalGallery) {
        const scrollAmount = 200;
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            activeHorizontalGallery.scrollLeft -= scrollAmount;
        }
        if (event.key === 'ArrowRight') {
            event.preventDefault();
            activeHorizontalGallery.scrollLeft += scrollAmount;
        }
    }
    // Keyboard navigation for single image carousel gallery
    if (activeCarouselGallery) {
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            prevCarouselImage();
            stopCarouselAutoplay();
        }
        if (event.key === 'ArrowRight') {
            event.preventDefault();
            nextCarouselImage();
            stopCarouselAutoplay();
        }
    }
    // Keyboard navigation for Showcase
    if (activeShowcaseGallery) {
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            prevShowcaseImage();
            stopShowcaseAutoplay();
        } else if (event.key === 'ArrowRight') {
            event.preventDefault();
            nextShowcaseImage();
            stopShowcaseAutoplay();
        }
    }
});
            // Прикрепить слушатели событий свайпа к лайтбоксу
    if (lightbox) {
        lightbox.addEventListener('touchstart', handleTouchStart, { passive: false });
        lightbox.addEventListener('touchmove', handleTouchMove, { passive: false });
        lightbox.addEventListener('touchend', handleTouchEndLightbox);
    }
	// === DRAG & SWIPE FOR LIGHTBOX (SLIDE MODE ONLY) ===
let isDraggingLightbox = false;
let dragStartX = 0;
let currentX = 0;
const dragThreshold = 25;

function isLightboxSlideMode() {
    return getLightboxTransition() === 'slide';
}

function handleLightboxDragStart(e) {
    if (!isLightboxSlideMode() || !isGalleryContext || allVisibleImages.length <= 1) return;
    const activeImg = lightboxImageContainer.querySelector('img.slide-active');
    if (!activeImg) return;

    isDraggingLightbox = true;
    dragStartX = e.clientX || e.touches?.[0].clientX || 0;
    currentX = dragStartX;

    // Отключаем transition на время drag
    activeImg.style.transition = 'none';
    e.preventDefault();
}

function handleLightboxDragMove(e) {
    if (!isDraggingLightbox) return;
    const activeImg = lightboxImageContainer.querySelector('img.slide-active');
    if (!activeImg) return;

    currentX = e.clientX || e.touches?.[0].clientX || 0;
    const deltaX = currentX - dragStartX;

    // Применяем сдвиг только к активному изображению
    activeImg.style.transform = `translateX(${deltaX}px)`;
    // Опционально: слегка затемнять при сдвиге
    const opacity = 1 - Math.abs(deltaX) / (window.innerWidth * 0.5);
    activeImg.style.opacity = Math.max(0.7, opacity);
}

function handleLightboxDragEnd() {
    if (!isDraggingLightbox) return;
    const activeImg = lightboxImageContainer.querySelector('img.slide-active');
    if (!activeImg) {
        isDraggingLightbox = false;
        return;
    }

    const deltaX = currentX - dragStartX;
    const absDelta = Math.abs(deltaX);

    // Возвращаем изображение в исходное положение
    activeImg.style.transition = ''; // включаем transition
    activeImg.style.transform = 'translateX(0)';
    activeImg.style.opacity = '';

    if (absDelta > dragThreshold) {
        if (deltaX > 0) {
            showImage(currentImageIndex - 1); // вправо → назад
        } else {
            showImage(currentImageIndex + 1); // влево → вперёд
        }
        showLightboxNavControls();
    }

    isDraggingLightbox = false;
}

// Привязка событий
if (lightboxImageContainer) {
    // Mouse
    lightboxImageContainer.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return; // только ЛКМ
        handleLightboxDragStart(e);
        const moveHandler = (ev) => handleLightboxDragMove(ev);
        const upHandler = () => {
            handleLightboxDragEnd();
            document.removeEventListener('mousemove', moveHandler);
            document.removeEventListener('mouseup', upHandler);
        };
        document.addEventListener('mousemove', moveHandler);
        document.addEventListener('mouseup', upHandler);
    });
}
    // Initial check for "back to top" button visibility
    const backToTopButton = document.querySelector('.back_to_top');
    if (backToTopButton) {
        backToTopButton.style.display = 'none'; // Ensure it's hidden initially
    }
    window.addEventListener('scroll', () => {
        if (backToTopButton) {
            if (window.scrollY > 300) { backToTopButton.style.display = 'block'; }
            else { backToTopButton.style.display = 'none'; }
        }
    }
);

    if (backToTopLink) {
        backToTopLink.addEventListener('click', (event) => {
            event.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    

                  // ---------- HASH PARSER ----------
function parseHashString(hash) {
    if (!hash) return { contentId: null, mode: null, index: -1 };

    if (hash.includes('/')) {
        const [possibleId, rest] = hash.split('/');
        const el = document.getElementById(possibleId);
        if (el) {
            const m = rest.match(/^(lightbox|carousel|showcase)-(\d+)$/);
            if (m) return { contentId: possibleId, mode: m[1], index: parseInt(m[2], 10) - 1 };
        }
    } else {
        const el = document.getElementById(hash);
        if (el) return { contentId: hash, mode: null, index: -1 };
    }
    return { contentId: null, mode: null, index: -1 };
}

// ---------- POPSTATE ----------
window.addEventListener('popstate', async () => {
    isPopstateNavigation = true;
    
    const hash = window.location.hash.substring(1);
    const parsed = parseHashString(hash);

    console.log('🔙 Popstate triggered:', { hash, parsed }); // DEBUG

    if (parsed.contentId) {
        const targetSection = document.getElementById(parsed.contentId);
        if (!targetSection) {
            console.error('Target section not found:', parsed.contentId);
            isPopstateNavigation = false;
            return;
        }

        const isLightboxOpen = lightbox && lightbox.classList.contains('active');
        const currentActiveSection = document.querySelector('.content-section.active');
        const needContentSwitch = !currentActiveSection || currentActiveSection.id !== parsed.contentId;

        console.log('🔍 Popstate state:', { 
            isLightboxOpen, 
            currentSection: currentActiveSection?.id, 
            targetSection: parsed.contentId,
            needContentSwitch 
        }); // DEBUG

        // CASE 1: Hash указывает на lightbox
        if (parsed.mode === 'lightbox' && parsed.index >= 0) {
            if (needContentSwitch) {
                // Нужно переключить контент И открыть lightbox
                console.log('📂 Switching content + opening lightbox');
                await showContent(parsed.contentId, parsed.index);
            } else if (!isLightboxOpen) {
                // Контент уже активен, но lightbox закрыт - открываем
                console.log('🖼️ Opening lightbox on current content');
                const allPosts = Array.from(targetSection.querySelectorAll('.post'));
                if (parsed.index >= 0 && parsed.index < allPosts.length) {
                    const targetPost = allPosts[parsed.index];
                    const targetImg = targetPost.querySelector('img');
                    if (targetImg) {
                        openLightbox(targetImg.src, targetImg.alt, targetImg, parsed.index);
                    }
                }
            } else {
                // Lightbox уже открыт - просто переключаем изображение
                console.log('🔄 Switching lightbox image');
                if (currentImageIndex !== parsed.index) {
                    showImage(parsed.index);
                }
            }
        }
        // CASE 2: Hash указывает на carousel
        else if (parsed.mode === 'carousel' && parsed.index >= 0) {
            if (needContentSwitch) {
                await showContent(parsed.contentId, parsed.index);
            } else if (activeCarouselGallery && carouselCurrentIndex !== parsed.index) {
                showCarouselImage(parsed.index);
            }
        }
        // CASE 3: Hash указывает на showcase
        else if (parsed.mode === 'showcase' && parsed.index >= 0) {
            if (needContentSwitch) {
                await showContent(parsed.contentId, parsed.index);
            } else if (activeShowcaseGallery && showcaseCurrentIndex !== parsed.index) {
                showShowcaseImage(parsed.index);
            }
        }
        // CASE 4: Обычный hash без модификаторов
        else {
            if (isLightboxOpen) {
                console.log('❌ Closing lightbox (plain hash)');
                closeLightbox();
            }
            if (needContentSwitch) {
                console.log('📂 Switching to content');
                await showContent(parsed.contentId, -1);
            }
        }
    } else {
        // Нет валидного hash - переход на homepage
        console.log('🏠 No valid hash, going to homepage');
        const isLightboxOpen = lightbox && lightbox.classList.contains('active');
        if (isLightboxOpen) {
            closeLightbox();
        }
        const fallbackId = window.siteConfig.site.homepageId || initialContentId;
        if (fallbackId) {
            await showContent(fallbackId, -1);
        }
    }
    
    // Сбрасываем флаг ПОСЛЕ небольшой задержки, чтобы избежать race conditions
    setTimeout(() => {
        isPopstateNavigation = false;
    }, 100);
});


// Добавьте в конец DOMContentLoaded, после других обработчиков
document.addEventListener('click', (e) => {
    const internalLink = e.target.closest('a[data-internal="true"]');
    if (internalLink) {
        e.preventDefault();
        const targetId = internalLink.getAttribute('href').substring(1);
        showContent(targetId);
    }
});


// ---------- INITIAL LOAD (с ожиданием i18n) ----------
function showInitialContent() {
    const parsedInitial = parseHashString(window.location.hash.substring(1));
    if (parsedInitial.contentId) {
        showContent(parsedInitial.contentId, parsedInitial.index >= 0 ? parsedInitial.index : -1);
    } else {
        showContent(initialContentId, -1);
    }
}

// Проверяем, включена ли локализация
const i18nEnabled = window.siteConfig?.i18n?.enabled;

if (i18nEnabled) {
    // Если i18n уже готов (редкий случай), показываем сразу
    if (window.i18nReady) {
        showInitialContent();
    } else {
        // Иначе ждём готовности
        window.onI18nReady = showInitialContent;
    }
} else {
    // Если i18n выключен — показываем без ожидания
    showInitialContent();
}


    

    // NEW: Inject custom JS if provided in config (after all other DOM is ready)
    if (window.siteConfig.customCode?.customJS) {
        const scriptTag = document.createElement('script');
        scriptTag.textContent = window.siteConfig.customCode.customJS;
        document.body.appendChild(scriptTag);
    }

    // Call updateCarouselHeight initially after DOM is ready and content shown
    updateCarouselHeight();
    
/* === СКРЫВАЮЩИЙСЯ ХЕДЕР ПРИ ПРОКРУТКЕ (ИСПРАВЛЕНО ДЛЯ SIDEBAR-HIDDEN) === */
(function() {
    const mobileHeader = document.querySelector('.mobile-header');
    const desktopHeader = document.getElementById('desktopHeaderHiddenSidebar');
    const contentArea = document.querySelector('.content-area');
    
    let lastScrollTop = 0;
    const scrollThreshold = 5;
    let isScrolling = false;

    function handleHeaderScroll() {
        let currentScrollTop = 0;
        let activeHeader = null;

        if (window.innerWidth <= 768) {
            // Мобильная версия
            currentScrollTop = window.scrollY || document.documentElement.scrollTop;
            activeHeader = mobileHeader;
        } else {
            // Десктоп версия - используем contentArea, но подстраховываемся:
            // если по какой-то причине реально скроллится window (а не .content-area),
            // берём то значение, которое действительно меняется.
            const contentAreaScroll = contentArea ? contentArea.scrollTop : 0;
            const windowScroll = window.scrollY || document.documentElement.scrollTop;
            currentScrollTop = contentAreaScroll > 0 ? contentAreaScroll : windowScroll;
            activeHeader = desktopHeader;
        }

        // Если хедер не найден или скрыт, выходим
        if (!activeHeader || window.getComputedStyle(activeHeader).display === 'none') {
            return;
        }

        // Всегда показываем в самом верху
        if (currentScrollTop < 10) {
            activeHeader.classList.remove('header-hidden');
            activeHeader.classList.add('header-visible');
            lastScrollTop = currentScrollTop;
            return;
        }

        const scrollDifference = currentScrollTop - lastScrollTop;

        // Скроллим ВНИЗ -> Скрываем
        if (scrollDifference > scrollThreshold && currentScrollTop > 60) {
            if (!activeHeader.classList.contains('header-hidden')) {
                activeHeader.classList.remove('header-visible');
                activeHeader.classList.add('header-hidden');
            }
        } 
        // Скроллим ВВЕРХ -> Показываем
        else if (scrollDifference < -scrollThreshold) {
            if (activeHeader.classList.contains('header-hidden')) {
                activeHeader.classList.remove('header-hidden');
                activeHeader.classList.add('header-visible');
            }
        }

        lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
    }

    function onScroll() {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                handleHeaderScroll();
                isScrolling = false;
            });
            isScrolling = true;
        }
    }

    // Слушатели на оба источника скролла
    window.addEventListener('scroll', onScroll, { passive: true });
    if (contentArea) {
        contentArea.addEventListener('scroll', onScroll, { passive: true });
    }

    // Пересчитываем при изменении размера окна
    window.addEventListener('resize', () => {
        lastScrollTop = 0;
        handleHeaderScroll();
    });

    // Инициализация
    handleHeaderScroll();
})();

});

function initHorizontalGalleryScroll(galleryElement) {
    if (!galleryElement || !galleryElement.classList.contains('gallery-horizontal-scroll')) return;

    // --- Wheel scroll ---
    const onWheel = (e) => {
        if (e.deltaY !== 0) {
            e.preventDefault();
            galleryElement.scrollLeft += e.deltaY;
        }
    };
    galleryElement.addEventListener('wheel', onWheel, { passive: false });

    // --- Drag-to-scroll ---
    let isDragging = false;
    let wasDragged = false;
    let startX;
    let scrollLeftAtStart;

    const onMouseDown = (e) => {
    if (e.button !== 0) return;
    isDragging = true;
    wasDragged = false; // сброс при новом нажатии
    startX = e.pageX;
    scrollLeftAtStart = galleryElement.scrollLeft;
    galleryElement.classList.add('dragging');
    e.preventDefault();
};

    const onMouseMove = (e) => {
    if (!isDragging) return;
    wasDragged = true; // зафиксировали движение → это drag, не click
    e.preventDefault();
    const x = e.pageX;
    const walk = (x - startX) * 2;
    galleryElement.scrollLeft = scrollLeftAtStart - walk;
};
    const stopDragging = () => {
    if (!isDragging) return;
    isDragging = false;
    galleryElement.classList.remove('dragging');
    // wasDragged остаётся true, если было движение
};

    // Важно: слушатели на document, чтобы работало даже при выходе курсора за пределы галереи
    galleryElement.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', stopDragging);

    // Инициализация
    galleryElement.style.cursor = 'grab';
    galleryElement.style.overflowX = 'auto';

    // Функция очистки
    galleryElement._horizontalScrollCleanup = () => {
        galleryElement.removeEventListener('wheel', onWheel);
        galleryElement.removeEventListener('mousedown', onMouseDown);
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', stopDragging);
    };
    
    // Подавление клика на изображениях, если было перетаскивание
const onClickImage = (e) => {
    if (wasDragged) {
        e.stopImmediatePropagation();
        e.preventDefault();
        wasDragged = false; // сброс
        return false;
    }
};

// Навешиваем обработчик на все изображения (с учётом динамического контента)
const attachClickHandlers = () => {
    galleryElement.querySelectorAll('.post img').forEach(img => {
        img.addEventListener('click', onClickImage, { capture: true });
    });
};

// Вызываем сразу и при необходимости — повторно (например, после подгрузки)
attachClickHandlers();

// Сохраняем для очистки
galleryElement._horizontalScrollCleanup = () => {
    galleryElement.removeEventListener('wheel', onWheel);
    galleryElement.removeEventListener('mousedown', onMouseDown);
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', stopDragging);

    // Удаляем обработчики кликов
    galleryElement.querySelectorAll('.post img').forEach(img => {
        img.removeEventListener('click', onClickImage, { capture: true });
    });
};
}

// === АДАПТИВНЫЙ ПЕРЕСЧЁТ ШРИФТА ВЕБЗИНОВ ПРИ РЕСАЙЗЕ ===
let zineResizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(zineResizeTimer);
    zineResizeTimer = setTimeout(() => {
        document.querySelectorAll('.zine-section .zine-text-content').forEach(textWrapper => {
            const baseFontSize = parseFloat(textWrapper.dataset.baseFontSize);
            const originalWidth = parseFloat(textWrapper.dataset.originalWidth);
            if (!baseFontSize || !originalWidth) return;
            
            const blockElement = textWrapper.closest('.zine-block');
            if (blockElement) {
                const actualBlockWidth = blockElement.offsetWidth;
                const actualScale = actualBlockWidth / originalWidth;
                const computedFontSize = Math.max(12, baseFontSize * actualScale);
                
                // Прямая установка
                textWrapper.style.fontSize = `${computedFontSize}px`;
                textWrapper.style.setProperty('--font-scale', actualScale);
            }
        });
    }, 150);
});

// Close mobile menu and manage sidebar on desktop resize
window.addEventListener('resize', () => {
    const mainNav = document.getElementById('mainNav');
    const body = document.body;
    const desktopHeaderHiddenSidebar = document.getElementById('desktopHeaderHiddenSidebar');

    if (window.innerWidth > 768) {
        const currentContentId = window.location.hash.substring(1) || window.siteConfig.site.homepageId;
        const hideSidebarForCurrentPage = shouldHideSidebar(currentContentId);
        const currentContentHasHeader = hasVisibleHeader(currentContentId); // NEW: Get header visibility

        if (hideSidebarForCurrentPage) {
            body.classList.add('sidebar-hidden');
            if (desktopHeaderHiddenSidebar) desktopHeaderHiddenSidebar.style.display = 'flex';
            if (menuToggleDesktop) menuToggleDesktop.style.display = 'block';
        } else {
            body.classList.remove('sidebar-hidden');
            if (desktopHeaderHiddenSidebar) desktopHeaderHiddenSidebar.style.display = 'none';
            if (menuToggleDesktop) menuToggleDesktop.style.display = 'none';
        }

        // NEW: Apply/remove no-header-height class on resize for carousel if active
        const activeCarouselParent = document.querySelector('.gallery-section.single-image-carousel-parent.active');
        if (activeCarouselParent) {
            if (!currentContentHasHeader) {
                activeCarouselParent.classList.add('no-header-height');
            } else {
                activeCarouselParent.classList.remove('no-header-height');
            }
        }

        // Update carousel height on resize
        updateCarouselHeight();


        // Ensure mainNav is closed if it's open on desktop when switching between sidebar hidden/shown
        if (mainNav.classList.contains('active') && !body.classList.contains('sidebar-hidden')) {
             mainNav.classList.remove('active');
             body.style.overflow = 'auto';
        }
        // If mainNav is open AND sidebar is hidden, ensure body overflow is hidden
        if (mainNav.classList.contains('active') && body.classList.contains('sidebar-hidden')) {
            body.style.overflow = 'hidden';
        }


    } else { // Mobile view
        // Ensure sidebar-hidden class is removed on mobile view
        body.classList.remove('sidebar-hidden');
        if (desktopHeaderHiddenSidebar) desktopHeaderHiddenSidebar.style.display = 'none';
        // Ensure mainNav is closed if it's open on mobile
        if (mainNav.classList.contains('active')) {
            mainNav.classList.remove('active');
            body.style.overflow = 'auto';
        }
        // NEW: Ensure no-header-height is removed on mobile, as fixed heights are less relevant
        const activeCarouselParent = document.querySelector('.gallery-section.single-image-carousel-parent.active');
        if (activeCarouselParent) {
            activeCarouselParent.classList.remove('no-header-height');
        }
        // Update carousel height on resize for mobile
        updateCarouselHeight();
    }
});

// 🔥 ПЕРЕСЧЁТ ШРИФТА ВЕБЗИНОВ ПОСЛЕ ПОЛНОЙ ЗАГРУЗКИ СТРАНИЦЫ
// FIX: раньше эта подписка на 'load' по ошибке была вложена внутрь обработчика
// 'resize', из-за чего она регистрировалась только ПОСЛЕ того, как 'load' уже
// случился один раз при открытии страницы — и поэтому никогда не срабатывала.
// Вынесено на верхний уровень, чтобы сработать один раз при полной загрузке.
window.addEventListener('load', () => {
    setTimeout(() => {
        document.querySelectorAll('.zine-section .zine-text-content').forEach(textWrapper => {
            const baseFontSize = parseFloat(textWrapper.dataset.baseFontSize);
            const originalWidth = parseFloat(textWrapper.dataset.originalWidth);
            if (!baseFontSize || !originalWidth) return;
            const blockElement = textWrapper.closest('.zine-block');
            if (blockElement && blockElement.offsetWidth > 0) {
                const actualScale = blockElement.offsetWidth / originalWidth;
                textWrapper.style.setProperty('--font-scale', actualScale);
                const computedFontSize = Math.max(12, baseFontSize * actualScale);
                textWrapper.style.fontSize = `${computedFontSize}px`;
            }
        });
    }, 200);
});

// Ensure mobile menu is closed and body scrolls on initial load if on mobile
// This is a global script, runs immediately.
(() => {
    const mainNav = document.getElementById('mainNav');
    const body = document.body;
    const desktopHeaderHiddenSidebar = document.getElementById('desktopHeaderHiddenSidebar');
    if (window.innerWidth <= 768) {
        if (mainNav) {
            mainNav.classList.remove('active');
        }
        body.style.overflow = 'auto';
        if (desktopHeaderHiddenSidebar) desktopHeaderHiddenSidebar.style.display = 'none'; // Hide desktop header on mobile
    } else { // Desktop on initial load
        // Apply sidebar visibility logic on initial desktop load
        const initialContentId = window.location.hash.substring(1) || window.siteConfig.site.homepageId;
        const hideSidebarForInitialPage = shouldHideSidebar(initialContentId);
        const initialContentHasHeader = hasVisibleHeader(initialContentId); // NEW: Check header visibility on initial load

        if (hideSidebarForInitialPage) {
            body.classList.add('sidebar-hidden');
            if (desktopHeaderHiddenSidebar) desktopHeaderHiddenSidebar.style.display = 'flex'; // Here, display flex for the desktop header when sidebar is hidden
        } else {
            body.classList.remove('sidebar-hidden');
            if (desktopHeaderHiddenSidebar) desktopHeaderHiddenSidebar.style.display = 'none'; // Here, display none for the desktop header when sidebar is visible
        }

        // NEW: Apply/remove no-header-height class on initial load for carousel if applicable
        const initialActiveSection = document.getElementById(initialContentId);
        if (initialActiveSection && initialActiveSection.classList.contains('single-image-carousel-parent')) {
            if (!initialContentHasHeader) {
                initialActiveSection.classList.add('no-header-height');
            } else {
                initialActiveSection.classList.remove('no-header-height');
            }
        }
    }

    
})();
