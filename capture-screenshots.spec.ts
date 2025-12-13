import { test } from '@playwright/test';

test('프레젠테이션 스크린샷 캡처', async ({ page }) => {
  const screenshotDir = 'docs/screenshots';

  // 1. 메인 페이지
  console.log('1. 메인 페이지 캡처...');
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  await page.screenshot({ path: `${screenshotDir}/01-main.png` });

  // 2. 주소 검색 - "광교산" 검색 (산림 지역)
  console.log('2. 주소 검색 캡처...');
  const searchInput = page.locator('input[placeholder*="주소"]').first();
  await searchInput.fill('광교산');
  await page.locator('button').filter({ has: page.locator('svg.lucide-search') }).first().click();
  await page.waitForTimeout(2000);
  await page.screenshot({ path: `${screenshotDir}/02-search.png` });

  // 검색 결과 선택 - 광교산 선택
  const searchResult = page.locator('button').filter({ hasText: /광교/ }).first();
  if (await searchResult.isVisible({ timeout: 3000 }).catch(() => false)) {
    await searchResult.click();
    await page.waitForTimeout(2000);
  }

  // 3. 영역 그리기 - 광교산 산림 지역 선택
  console.log('3. 영역 그리기 캡처...');
  await page.locator('button:has-text("영역 그리기")').first().click();
  await page.waitForTimeout(500);

  // 지도 중앙의 산림 지역에 사각형 그리기
  const mapCanvas = page.locator('.ol-viewport canvas, .ol-layer').first();
  const mapBox = await mapCanvas.boundingBox();
  if (mapBox) {
    // 지도 중심 영역 (광교산 산림)
    const cx = mapBox.x + mapBox.width / 2;
    const cy = mapBox.y + mapBox.height / 2;

    // 사각형 영역 그리기
    await page.mouse.click(cx - 50, cy - 50);
    await page.waitForTimeout(150);
    await page.mouse.click(cx + 50, cy - 50);
    await page.waitForTimeout(150);
    await page.mouse.click(cx + 50, cy + 50);
    await page.waitForTimeout(150);
    await page.mouse.click(cx - 50, cy + 50);
    await page.waitForTimeout(150);
    await page.mouse.dblclick(cx - 50, cy - 50); // 완료
  }
  await page.waitForTimeout(5000); // 자동감지 API 호출 대기
  await page.screenshot({ path: `${screenshotDir}/03-draw-area.png` });

  // 4. 시뮬레이션 실행
  console.log('4. 시뮬레이션 실행 캡처...');
  await page.locator('text=시뮬레이션 설정').first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await page.locator('button:has-text("시뮬레이션")').first().click();
  await page.waitForTimeout(2000);
  await page.screenshot({ path: `${screenshotDir}/04-simulation.png` });

  // 5. 결과 패널 (스크롤해서 전체 보기)
  console.log('5. 결과 패널 캡처...');
  await page.screenshot({ path: `${screenshotDir}/05-results.png` });

  // 6. WMS 레이어
  console.log('6. WMS 레이어 캡처...');
  const nppSwitch = page.locator('text=탄소흡수지도').locator('..').locator('button[role="switch"]').first();
  if (await nppSwitch.isVisible().catch(() => false)) {
    await nppSwitch.click();
    await page.waitForTimeout(2000);
  }
  await page.screenshot({ path: `${screenshotDir}/06-wms-layer.png` });

  // 7. 저장/공유
  console.log('7. 저장/공유 캡처...');
  await page.locator('button:has-text("저장")').first().click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${screenshotDir}/07-export.png` });

  // 드롭다운 닫기
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);

  // 8. About 페이지
  console.log('8. About 페이지 캡처...');
  await page.goto('http://localhost:3000/about');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: `${screenshotDir}/08-about.png` });

  console.log('모든 스크린샷 캡처 완료!');
});
