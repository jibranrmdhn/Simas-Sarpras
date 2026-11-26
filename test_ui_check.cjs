const fs = require('fs');

const pages = fs.readdirSync('pages').filter(f => f.endsWith('.html'));

pages.forEach(p => {
  const content = fs.readFileSync('pages/' + p, 'utf8');
  const onclickMatches = [...content.matchAll(/onclick="([^("]+)/g)].map(m => m[1]);
  const onsubmits = [...content.matchAll(/onsubmit="([^("]+)/g)].map(m => m[1]);
  const scriptTags = [...content.matchAll(/src="\.\.\/js\/([^"]+)"/g)].map(m => m[1]);
  
  // Extract inline scripts
  const inlineScripts = [...content.matchAll(/<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]);

  let allJsCode = inlineScripts.join('\n');
  scriptTags.forEach(s => {
    try {
      allJsCode += '\n' + fs.readFileSync('js/' + s, 'utf8');
    } catch (e) {}
  });

  const missing = [];
  [...new Set([...onclickMatches, ...onsubmits])].forEach(fn => {
    if (fn.startsWith('javascript:') || fn.startsWith('window.') || fn === 'confirm' || fn === 'alert') return;
    const exists = allJsCode.includes('function ' + fn) || allJsCode.includes(fn + ' =') || allJsCode.includes(fn + '(') || allJsCode.includes('const ' + fn) || allJsCode.includes('let ' + fn);
    if (!exists) {
      missing.push(fn);
    }
  });

  if (missing.length > 0) {
    console.warn(`[!] MISSING in ${p}:`, missing);
  } else {
    console.log(`[OK] All handlers exist in ${p}`);
  }
});
