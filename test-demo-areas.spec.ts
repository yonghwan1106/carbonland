import { test } from '@playwright/test';

/**
 * 데모 영역 비오톱 확인 테스트
 * 각 데모 영역의 실제 비오톱 유형을 확인
 */

const demoAreas = [
  {
    id: 'suwon-yeongtong',
    name: '수원 영통 녹지',
    expectedType: 'FOREST',
    center: [127.0456, 37.2636],
  },
  {
    id: 'seongnam-pangyo',
    name: '성남 판교 녹지',
    expectedType: 'GRASSLAND',
    center: [127.1125, 37.3947],
  },
  {
    id: 'hwaseong-dongtan',
    name: '화성 동탄 농경지',
    expectedType: 'AGRICULTURAL',
    center: [127.0736, 37.2006],
  },
  {
    id: 'yongin-suji',
    name: '용인 수지 산림',
    expectedType: 'FOREST',
    center: [127.0856, 37.3256],
  },
  {
    id: 'goyang-ilsan',
    name: '고양 일산 습지',
    expectedType: 'WETLAND',
    center: [126.7656, 37.6706],
  },
];

test('데모 영역 비오톱 확인', async ({ page }) => {
  test.setTimeout(180000);

  const results: Array<{
    name: string;
    expected: string;
    detected: string;
    biotop: string;
  }> = [];

  // 콘솔 로그 캡처
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('비오톱 자동 감지')) {
      console.log(`[API] ${text}`);
    }
  });

  for (const area of demoAreas) {
    console.log(`\n========== ${area.name} 테스트 ==========`);
    console.log(`예상 유형: ${area.expectedType}`);
    console.log(`좌표: ${area.center[0]}, ${area.center[1]}`);

    // 페이지 로드
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // 좌표로 이동
    await page.evaluate(({ lon, lat }) => {
      const event = new CustomEvent('moveToCoordinate', {
        detail: { center: [lon, lat], zoom: 16 }
      });
      window.dispatchEvent(event);
    }, { lon: area.center[0], lat: area.center[1] });

    await page.waitForTimeout(2000);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);

    // 영역 그리기
    const drawButton = page.locator('button:has-text("영역 그리기")').first();
    await drawButton.scrollIntoViewIfNeeded();
    await drawButton.click({ force: true });
    await page.waitForTimeout(500);

    const mapCanvas = page.locator('.ol-viewport canvas, .ol-layer').first();
    const mapBox = await mapCanvas.boundingBox();

    if (mapBox) {
      const cx = mapBox.x + mapBox.width / 2;
      const cy = mapBox.y + mapBox.height / 2;

      // 작은 영역 그리기
      await page.mouse.click(cx - 50, cy - 50);
      await page.waitForTimeout(100);
      await page.mouse.click(cx + 50, cy - 50);
      await page.waitForTimeout(100);
      await page.mouse.click(cx + 50, cy + 50);
      await page.waitForTimeout(100);
      await page.mouse.click(cx - 50, cy + 50);
      await page.waitForTimeout(100);
      await page.mouse.dblclick(cx - 50, cy - 50);
    }

    // API 호출 대기
    await page.waitForTimeout(5000);

    // 결과 확인
    const landUseDropdown = page.locator('button[role="combobox"]').first();
    const landUseText = await landUseDropdown.textContent() || 'N/A';

    const biotopAnalysis = page.locator('text=/비오톱 분석:/');
    let biotopText = 'N/A';
    if (await biotopAnalysis.isVisible({ timeout: 2000 }).catch(() => false)) {
      biotopText = await biotopAnalysis.textContent() || 'N/A';
    }

    results.push({
      name: area.name,
      expected: area.expectedType,
      detected: landUseText,
      biotop: biotopText,
    });

    console.log(`감지된 토지이용: ${landUseText}`);
    console.log(`비오톱 분석: ${biotopText}`);
  }

  // 최종 결과 요약
  console.log('\n\n========================================');
  console.log('         데모 영역 비오톱 확인 결과');
  console.log('========================================');
  console.log('');

  for (const r of results) {
    const match = r.detected.includes(r.expected) ||
      (r.expected === 'FOREST' && (r.detected.includes('산림') || r.biotop.includes('산림'))) ||
      (r.expected === 'GRASSLAND' && (r.detected.includes('초지') || r.biotop.includes('초지') || r.biotop.includes('녹지'))) ||
      (r.expected === 'AGRICULTURAL' && (r.detected.includes('농') || r.biotop.includes('농'))) ||
      (r.expected === 'WETLAND' && (r.detected.includes('습지') || r.biotop.includes('습지') || r.biotop.includes('하천'))) ||
      (r.expected === 'INDUSTRIAL' && (r.detected.includes('공업') || r.biotop.includes('시가화')));

    const status = match ? '✅ 일치' : '❌ 불일치';
    console.log(`${r.name}`);
    console.log(`  예상: ${r.expected}`);
    console.log(`  감지: ${r.detected} | ${r.biotop}`);
    console.log(`  결과: ${status}`);
    console.log('');
  }

  console.log('========================================\n');
});
