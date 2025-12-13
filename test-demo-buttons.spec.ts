import { test } from '@playwright/test';

/**
 * 데모 영역 버튼 클릭 테스트
 * 실제로 데모 영역 버튼을 클릭하여 비오톱 감지 결과 확인
 */

const demoAreas = [
  { name: '광교산 산림', expected: 'FOREST' },
  { name: '분당 율동공원', expected: 'GRASSLAND' },
  { name: '이천 농업지역', expected: 'AGRICULTURAL' },
  { name: '청계산 산림', expected: 'FOREST' },
  { name: '일산호수공원', expected: 'WETLAND' },
];

test('데모 영역 버튼 클릭 테스트', async ({ page }) => {
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
    if (text.includes('비오톱')) {
      console.log(`[API] ${text}`);
    }
  });

  for (const area of demoAreas) {
    console.log(`\n========== ${area.name} 테스트 ==========`);

    // 페이지 로드
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // 데모 영역 섹션으로 스크롤
    const demoSection = page.locator('text=데모 영역').first();
    if (await demoSection.isVisible().catch(() => false)) {
      await demoSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
    }

    // 데모 영역 버튼 클릭
    const areaButton = page.locator(`button:has-text("${area.name}")`).first();
    if (await areaButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await areaButton.click();
      console.log(`${area.name} 버튼 클릭됨`);
    } else {
      console.log(`${area.name} 버튼을 찾을 수 없음`);
      continue;
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
      expected: area.expected,
      detected: landUseText,
      biotop: biotopText,
    });

    console.log(`감지된 토지이용: ${landUseText}`);
    console.log(`비오톱 분석: ${biotopText}`);
  }

  // 최종 결과 요약
  console.log('\n\n========================================');
  console.log('    데모 영역 버튼 클릭 테스트 결과');
  console.log('========================================\n');

  for (const r of results) {
    console.log(`${r.name}`);
    console.log(`  예상: ${r.expected}`);
    console.log(`  감지: ${r.detected}`);
    console.log(`  비오톱: ${r.biotop}`);
    console.log('');
  }

  console.log('========================================\n');
});
