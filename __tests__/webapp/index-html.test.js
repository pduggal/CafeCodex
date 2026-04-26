const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(
  path.join(__dirname, '../../index.html'),
  'utf-8'
);

describe('Webapp index.html regression checks', () => {
  test('PWA meta tags are present', () => {
    expect(html).toContain('apple-mobile-web-app-capable');
    expect(html).toContain('apple-mobile-web-app-status-bar-style');
    expect(html).toContain('apple-mobile-web-app-title');
    expect(html).toContain('theme-color');
  });

  test('GoatCounter analytics script is present', () => {
    expect(html).toContain('data-goatcounter="https://cafecodex.goatcounter.com/count"');
  });

  test('Web3Forms integration is present', () => {
    expect(html).toContain('api.web3forms.com/submit');
    expect(html).toContain('df232092-355f-4f5c-8d0a-70b739d24294');
  });

  test('App shell with 430px max-width exists', () => {
    expect(html).toContain('max-width: 430px');
    expect(html).toContain('class="app-shell"');
  });

  test('Key structural features are present', () => {
    expect(html).toContain('touch-action: none');
    expect(html).toContain('@media (min-width: 481px)');
    expect(html).toContain('@media (max-width: 480px)');
    expect(html).toContain('@media (max-width: 375px)');
    expect(html).toContain('-webkit-text-size-adjust: 100%');
    expect(html).toContain('font-size: 16px');
    expect(html).toContain('world-best');
    expect(html).toContain('id="worldBest"');
    expect(html).toContain('author-photo');
    expect(html).toContain('<img src="assets/author.jpg"');
    expect(html).toContain('detail-overlay');
    expect(html).toContain('nominate-overlay');
    expect(html).toContain('@supabase/supabase-js@2');
    expect(html).toContain('currentDeck = [...filtered]');
    expect(html).toContain('redealDeck');
    expect(html).toContain('vibe_tags || []');
  });
});
