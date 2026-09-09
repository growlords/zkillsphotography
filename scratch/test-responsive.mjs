async function main() {
  const listRes = await fetch('http://localhost:9222/json/list');
  const list = await listRes.json();
  const pageTarget = list.find((t) => t.type === 'page');
  if (!pageTarget) throw new Error('No page target found');
  console.log('Connecting to page:', pageTarget.id);

  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

  let id = 1;
  const pending = new Map();

  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const msgId = id++;
      pending.set(msgId, { resolve, reject });
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(msg.error);
      else resolve(msg.result);
    }
  };

  await new Promise((res) => (ws.onopen = res));
  await send('Page.enable');
  await send('Runtime.enable');
  await send('DOM.enable');

  console.log('Navigating to http://localhost:3003/ ...');
  await send('Page.navigate', { url: 'http://localhost:3003/' });

  // Wait 3.5 seconds for preloader to finish and UI to stabilize
  console.log('Waiting for preloader to complete...');
  await new Promise((r) => setTimeout(r, 3500));

  const viewports = [
    { width: 430, height: 932, name: 'iPhone 14/15/16 Pro Max (430x932)' },
    { width: 390, height: 844, name: 'iPhone 12/13/14 (390x844)' },
    { width: 375, height: 812, name: 'iPhone X/XS/11 Pro (375x812)' },
    { width: 360, height: 800, name: 'Android Common (360x800)' },
    { width: 1440, height: 900, name: 'Desktop Cinema (1440x900)' },
  ];

  for (const vp of viewports) {
    console.log(`\n========================================`);
    console.log(`TESTING VIEWPORT: ${vp.name}`);
    console.log(`========================================`);

    await send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 2,
      mobile: vp.width < 1024,
    });

    // Scroll to #work
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const el = document.getElementById('work');
          if (el) el.scrollIntoView({ behavior: 'instant' });
          window.dispatchEvent(new Event('resize'));
        })()
      `,
    });

    await new Promise((r) => setTimeout(r, 800));

    // Check horizontal page overflow and card visibility
    const metricsEval = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const docEl = document.documentElement;
          const body = document.body;
          const workSec = document.getElementById('work');
          const cards = Array.from(workSec ? workSec.querySelectorAll('[data-cursor="view"]') : []);

          const winW = window.innerWidth;
          const scrollW = Math.max(docEl.scrollWidth, body.scrollWidth);
          const hasHorizontalOverflow = scrollW > winW;

          const cardMetrics = cards.map((c, i) => {
            const r = c.getBoundingClientRect();
            return {
              index: i,
              width: Math.round(r.width),
              height: Math.round(r.height),
              left: Math.round(r.left),
              right: Math.round(r.right),
              top: Math.round(r.top),
              visibleInViewport: (r.left >= -10 && r.right <= winW + 10),
            };
          });

          return {
            windowWidth: winW,
            pageScrollWidth: scrollW,
            hasHorizontalOverflow,
            cardCount: cards.length,
            cardMetrics,
          };
        })()
      `,
      returnByValue: true,
    });

    const res = metricsEval.result.value;
    console.log(`Window Width: ${res.windowWidth}px`);
    console.log(`Page Scroll Width: ${res.pageScrollWidth}px`);
    console.log(`Has Horizontal Overflow: ${res.hasHorizontalOverflow ? 'FAIL ❌' : 'PASS ✅ (No horizontal page overflow)'}`);
    console.log(`Total Portfolio Cards: ${res.cardCount}`);

    let allVisible = true;
    res.cardMetrics.forEach((c) => {
      console.log(`  Card ${c.index + 1}: width=${c.width}px, left=${c.left}px, right=${c.right}px -> ${c.visibleInViewport ? 'CONTAINED INSIDE VIEWPORT ✅' : 'OFFSCREEN ❌'}`);
      if (!c.visibleInViewport && vp.width < 1024) allVisible = false;
    });

    if (vp.width < 1024) {
      console.log(`Mobile Viewport Card Containment: ${allVisible ? '100% PASS ✅' : 'FAIL ❌'}`);
    }

    // Capture screenshot
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    const fs = await import('fs');
    const safeName = vp.width + 'x' + vp.height;
    fs.writeFileSync(`/tmp/audit_${safeName}.png`, Buffer.from(shot.data, 'base64'));
    console.log(`Saved screenshot: /tmp/audit_${safeName}.png`);
  }

  ws.close();
  console.log('\nAll requested viewports verified successfully!');
}

main().catch(console.error);
