// website/utils/fonts.js
// Универсальный модуль подключения шрифтов для Viewman CMS
// v3: параллельные запросы + автосбрасываемый кэш
(function (global) {
  if (!global) return;

  // ─── Настройки кэша ───
  const LS_KEY = 'vm_font_cache_v3';
  const LS_TTL = 24 * 60 * 60 * 1000; // 24 часа — страховочный срок жизни

  let memoryCache = new Map();   // кэш в памяти на текущую сессию
  let persistentCache = {};      // кэш из localStorage
  let currentFingerprint = '';   // отпечаток набора шрифтов из конфига
  let cacheDirty = false;
  let cacheLoaded = false;

  // ─── Отпечаток: версия сайта (если есть) + сортированный список шрифтов ───
  // Изменился любой шрифт в конфиге → отпечаток другой → кэш сбрасывается сам
  function computeFingerprint(cfg, fontNames) {
    const version = (cfg && cfg.site && cfg.site.version) ? String(cfg.site.version) : '';
    return version + '::' + [...new Set(fontNames.filter(Boolean))].sort().join('|');
  }

  // ─── Ленивая загрузка кэша с автоматической валидацией ───
  function ensureCacheLoaded() {
    if (cacheLoaded) return;
    cacheLoaded = true;
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      const expired = !data || (Date.now() - data.ts > LS_TTL);
      const fontsChanged = !data || data.fp !== currentFingerprint;
      if (expired || fontsChanged) {
        localStorage.removeItem(LS_KEY); // автосброс
        return;
      }
      persistentCache = data.map || {};
    } catch {
      persistentCache = {};
    }
  }

  function savePersistentCache() {
    if (!cacheDirty) return;
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({
        ts: Date.now(),
        fp: currentFingerprint,
        map: persistentCache
      }));
    } catch { /* переполнение localStorage — молча пропускаем */ }
    cacheDirty = false;
  }

  // ─── Проверка существования файла шрифта ───
  function checkFontFile(url) {
    ensureCacheLoaded();

    // 1. Кэш в памяти (текущая сессия)
    if (memoryCache.has(url)) return Promise.resolve(memoryCache.get(url));

    // 2. Кэш из localStorage (предыдущие сессии)
    if (Object.prototype.hasOwnProperty.call(persistentCache, url)) {
      const val = persistentCache[url];
      memoryCache.set(url, val);
      return Promise.resolve(val);
    }

    // 3. Единственный сетевой запрос (будет сделан максимум 1 раз на файл)
    return fetch(url, { method: 'HEAD', cache: 'no-cache' })
      .then(res => {
        memoryCache.set(url, res.ok);
        persistentCache[url] = res.ok;
        cacheDirty = true;
        return res.ok;
      })
      .catch(() => {
        memoryCache.set(url, false);
        persistentCache[url] = false;
        cacheDirty = true;
        return false;
      });
  }

  function getBaseFontsPath() {
    const path = window.location.pathname || '';
    return path.includes('/admin/') ? '../website/fonts' : 'fonts';
  }

  // ─── Построение @font-face: все 4 кандидата проверяются параллельно ───
  function buildFontFace(fontName) {
    const folder = fontName.replace(/\s+/g, '_');
    const dashName = fontName.replace(/\s+/g, '-');
    const base = getBaseFontsPath();
    const candidates = [
      `${base}/${folder}/${folder}-VariableFont.woff2`,
      `${base}/${folder}/${folder}.woff2`,
      `${base}/${folder}/${dashName}-VariableFont.woff2`,
      `${base}/${folder}/${dashName}.woff2`,
    ];

    return Promise.all(candidates.map(file =>
      checkFontFile(file).then(exists => ({ file, exists }))
    )).then(results => {
      const found = results.find(r => r.exists);
      if (found) {
        return `@font-face { font-family: '${fontName}'; src: url('${found.file}') format('woff2'); font-weight: 100 900; font-style: normal; font-display: swap; }`;
      }
      return '';
    });
  }

  // ─── Инжекция локальных шрифтов: все шрифты обрабатываются параллельно ───
  function injectLocalFonts(cfg, fontNames) {
    const unique = [...new Set(fontNames.filter(Boolean))];
    if (!unique.length) return Promise.resolve();

    currentFingerprint = computeFingerprint(cfg, unique);

    return Promise.all(unique.map(name => buildFontFace(name))).then(faces => {
      savePersistentCache();
      const css = faces.filter(Boolean).join('\n');
      if (!css) return;

      let style = document.getElementById('vm-local-fonts');
      if (!style) {
        style = document.createElement('style');
        style.id = 'vm-local-fonts';
        document.head.appendChild(style);
      }
      style.textContent = css;
    });
  }

  function injectGoogleFonts(fontNames) {
    document.querySelectorAll('link[data-vm-google]').forEach(l => l.remove());
    const unique = [...new Set(fontNames.filter(Boolean))];
    unique.forEach(font => {
      const href = `https://fonts.googleapis.com/css2?family=${font.replace(/ /g, '+')}:wght@100;200;300;400;500;600;700;800;900&display=swap`;
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.dataset.vmGoogle = font;
      document.head.appendChild(link);
    });
  }

  function applyCssVars(cfg) {
    if (!cfg.styles || !cfg.styles.fonts) return;
    Object.entries(cfg.styles.fonts).forEach(([type, f]) => {
      if (!f || !f.family) return;
      document.documentElement.style.setProperty(`--font-${type}-family`, `'${f.family}'`);
      document.documentElement.style.setProperty(`--font-${type}-weight`, f.weight || '400');
      document.documentElement.style.setProperty(`--font-${type}-style`, f.style || 'normal');
      document.documentElement.style.setProperty(`--font-${type}-decoration`, f.decoration || 'none');
      document.documentElement.style.setProperty(`--font-${type}-transform`, f.transform || 'none');
    });
  }

  function applyFonts(cfg) {
    if (!cfg || !cfg.styles) return Promise.resolve();
    const fonts = cfg.styles.fonts || {};
    const allFonts = [
      fonts.body && fonts.body.family,
      fonts.headings && fonts.headings.family,
      fonts.logo && fonts.logo.family,
    ].filter(Boolean);

    applyCssVars(cfg); // CSS-переменные применяем сразу, не дожидаясь шрифтов

    if (cfg.styles.fontSource === 'google') {
      injectGoogleFonts(allFonts.concat(cfg.styles.googleFonts || []));
      return Promise.resolve();
    }
    return injectLocalFonts(cfg, allFonts.concat(cfg.styles.localFonts || []));
  }

  // Ручной сброс (например, вызывается админкой после загрузки новых файлов)
  function clearFontCache() {
    memoryCache.clear();
    persistentCache = {};
    cacheLoaded = false;
    try { localStorage.removeItem(LS_KEY); } catch {}
  }

  global.ViewmanFonts = { applyFonts, clearFontCache };
})(window);
