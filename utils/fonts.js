// website/utils/fonts.js
// Универсальный модуль подключения шрифтов для Viewman CMS

(function(global){
  if (!global) return;

  function getBaseFontsPath() {
    const path = window.location.pathname || '';
    return path.includes('/admin/') ? '../website/fonts' : 'fonts';
  }

  async function checkFontFile(url) {
    try {
      const res = await fetch(url, { method: 'HEAD' });
      return res.ok;
    } catch {
      return false;
    }
  }

  async function buildFontFace(fontName) {
    const folder = fontName.replace(/\s+/g, '_');
    const base = getBaseFontsPath();
    const candidates = [
      `${base}/${folder}/${folder}-VariableFont.woff2`,
      `${base}/${folder}/${folder}.woff2`,
      `${base}/${folder}/${fontName.replace(/\s+/g, '-')}-VariableFont.woff2`,
      `${base}/${folder}/${fontName.replace(/\s+/g, '-')}.woff2`,
    ];
    for (const file of candidates) {
      if (await checkFontFile(file)) {
        return `
@font-face {
  font-family: '${fontName}';
  src: url('${file}') format('woff2');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}`;
      }
    }
    return '';
  }

  async function injectLocalFonts(fontNames = []) {
    const unique = [...new Set(fontNames)];
    const style = document.getElementById('vm-local-fonts') || document.createElement('style');
    style.id = 'vm-local-fonts';
    const parts = [];
    for (const name of unique) {
      const css = await buildFontFace(name);
      if (css) parts.push(css);
    }
    style.textContent = parts.join('\n');
    document.head.appendChild(style);
  }

  function injectGoogleFonts(fontNames = []) {
    document.querySelectorAll('link[data-vm-google]').forEach(l => l.remove());
    const unique = [...new Set(fontNames)];
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
    const fonts = cfg.styles.fonts;
    Object.entries(fonts).forEach(([type, f]) => {
      document.documentElement.style.setProperty(`--font-${type}-family`, `'${f.family}'`);
      document.documentElement.style.setProperty(`--font-${type}-weight`, f.weight || '400');
      document.documentElement.style.setProperty(`--font-${type}-style`, f.style || 'normal');
      document.documentElement.style.setProperty(`--font-${type}-decoration`, f.decoration || 'none');
      document.documentElement.style.setProperty(`--font-${type}-transform`, f.transform || 'none');
    });
  }

  async function applyFonts(cfg) {
    if (!cfg || !cfg.styles) return;
    const allFonts = [
      cfg.styles.fonts.body.family,
      cfg.styles.fonts.headings.family,
      cfg.styles.fonts.logo.family
    ];
    if (cfg.styles.fontSource === 'google') {
      injectGoogleFonts(allFonts.concat(cfg.styles.googleFonts || []));
    } else {
      await injectLocalFonts(allFonts.concat(cfg.styles.localFonts || []));
    }
    applyCssVars(cfg);
  }

  global.ViewmanFonts = { applyFonts };

})(window);
