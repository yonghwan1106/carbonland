import { test } from '@playwright/test';

const testAreas = [
  { name: '청계산', description: '산림지역' },
  { name: '시화공단', description: '공업지역' },
  { name: '분당 정자역', description: '주거지역' },
];

test('여러 지역 비오톱 자동감지 테스트', async ({ page }) => {
  const results: Array<{name: string, detected: string, biotop: string}> = [];

  for (const area of testAreas) {
    console.log(`\n========== ${area.name} (${area.description}) 테스트 ==========`);

    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // 주소 검색
    const searchInput = page.locator('input[placeholder*="주소"]').first();
    await searchInput.fill(area.name);
    await page.locator('button').filter({ has: page.locator('svg.lucide-search') }).first().click();
    await page.waitForTimeout(2000);

    // 검색 결과 선택
    const searchResult = page.locator('button[class*="justify-start"]').first();
    if (await searchResult.isVisible({ timeout: 3000 }).catch(() => false)) {
      await searchResult.click();
      await page.waitForTimeout(2000);
    }

    // ESC로 드롭다운 닫기
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);

    // 스크롤해서 영역 그리기 버튼 보이게
    const drawButton = page.locator('button:has-text("영역 그리기")').first();
    await drawButton.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    // 영역 그리기
    await drawButton.click({ force: true });
    await page.waitForTimeout(500);

    const mapCanvas = page.locator('.ol-viewport canvas, .ol-layer').first();
    const mapBox = await mapCanvas.boundingBox();
    if (mapBox) {
      const cx = mapBox.x + mapBox.width / 2;
      const cy = mapBox.y + mapBox.height / 2;

      await page.mouse.click(cx - 80, cy - 80);
      await page.waitForTimeout(100);
      await page.mouse.click(cx + 80, cy - 80);
      await page.waitForTimeout(100);
      await page.mouse.click(cx + 80, cy + 80);
      await page.waitForTimeout(100);
      await page.mouse.click(cx - 80, cy + 80);
      await page.waitForTimeout(100);
      await page.mouse.dblclick(cx - 80, cy - 80);
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
      detected: landUseText,
      biotop: biotopText
    });

    console.log(`감지된 토지이용: ${landUseText}`);
    console.log(`비오톱 분석: ${biotopText}`);
  }

  console.log('\n\n========== 최종 결과 요약 ==========');
  for (const r of results) {
    console.log(`${r.name}: ${r.detected} | ${r.biotop}`);
  }
  console.log('=====================================\n');
});
