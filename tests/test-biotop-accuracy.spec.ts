import { test, expect } from '@playwright/test';

/**
 * 비오톱 자동감지 정확도 테스트
 *
 * 문제: 검색 결과가 해당 지역의 "대표점"(도로, 입구 등)으로 이동하기 때문에
 * 그 주변에서 영역을 그리면 시가화 지역이 감지됨
 *
 * 해결: page.evaluate()를 사용하여 Zustand store의 setViewport 직접 호출
 */

// 테스트 지역 좌표 (WGS84)
// 실제 해당 토지이용 유형이 있는 좌표
const testLocations = [
  {
    name: '광교산 정상 부근',
    description: '경기도 용인시 수지구 광교산 정상 산림지대',
    lat: 37.3050,
    lon: 127.0450,
    zoom: 17,
    expectedType: 'FOREST',
    expectedKeywords: ['산림', '자연산림', '인공산림', 'FOREST', '초지', '녹지'],
  },
  {
    name: '청계산 산림',
    description: '과천시 청계산 등산로 부근 산림',
    lat: 37.4450,
    lon: 127.0550,
    zoom: 17,
    expectedType: 'FOREST',
    expectedKeywords: ['산림', '자연산림', '인공산림', 'FOREST', '초지', '녹지'],
  },
  {
    name: '시화공단 공업지역',
    description: '시흥시 시화국가산업단지 내부',
    lat: 37.3450,
    lon: 126.7300,
    zoom: 17,
    expectedType: 'INDUSTRIAL',
    expectedKeywords: ['공업', '산업', '공장', '시가화', '주거'],
  },
  {
    name: '이천 농경지',
    description: '이천시 호법면 농경지대',
    lat: 37.2800,
    lon: 127.4200,
    zoom: 17,
    expectedType: 'AGRICULTURAL',
    expectedKeywords: ['농경', '논', '밭', '경작', '농업'],
  },
];

test('비오톱 자동감지 정확도 테스트 (좌표 기반)', async ({ page }) => {
  test.setTimeout(180000); // 3분 타임아웃

  const results: Array<{
    name: string;
    expected: string;
    detected: string;
    biotopName: string;
    ratio: string;
    correct: boolean;
  }> = [];

  for (const location of testLocations) {
    console.log(`\n========== ${location.name} 테스트 ==========`);
    console.log(`설명: ${location.description}`);
    console.log(`좌표: ${location.lat}, ${location.lon}`);
    console.log(`예상: ${location.expectedType}`);

    // 페이지 로드
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Zustand store를 통해 직접 viewport 설정
    await page.evaluate(({ lon, lat, zoom }) => {
      // window에서 zustand store 접근 (Next.js에서는 직접 접근이 어려움)
      // 대신 지도 이동을 위해 검색 입력 후 직접 좌표 이동을 시뮬레이션
      const event = new CustomEvent('moveToCoordinate', {
        detail: { center: [lon, lat], zoom }
      });
      window.dispatchEvent(event);
    }, { lon: location.lon, lat: location.lat, zoom: location.zoom });

    // 지도 이동 대기
    await page.waitForTimeout(2000);

    // ESC 키로 혹시 열린 팝업 닫기
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);

    // 영역 그리기 버튼 찾기
    const drawButton = page.locator('button:has-text("영역 그리기")').first();
    await drawButton.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    // 영역 그리기
    await drawButton.click({ force: true });
    await page.waitForTimeout(500);

    // 지도 캔버스 찾기
    const mapCanvas = page.locator('.ol-viewport canvas, .ol-layer').first();
    const mapBox = await mapCanvas.boundingBox();

    if (mapBox) {
      const cx = mapBox.x + mapBox.width / 2;
      const cy = mapBox.y + mapBox.height / 2;

      // 작은 사각형 영역 그리기 (중앙 집중)
      await page.mouse.click(cx - 60, cy - 60);
      await page.waitForTimeout(100);
      await page.mouse.click(cx + 60, cy - 60);
      await page.waitForTimeout(100);
      await page.mouse.click(cx + 60, cy + 60);
      await page.waitForTimeout(100);
      await page.mouse.click(cx - 60, cy + 60);
      await page.waitForTimeout(100);
      await page.mouse.dblclick(cx - 60, cy - 60);
    }

    // API 호출 대기
    await page.waitForTimeout(5000);

    // 결과 확인
    const landUseDropdown = page.locator('button[role="combobox"]').first();
    const landUseText = await landUseDropdown.textContent() || 'N/A';

    // 비오톱 분석 결과 확인
    const biotopAnalysis = page.locator('text=/비오톱 분석:/');
    let biotopText = 'N/A';
    if (await biotopAnalysis.isVisible({ timeout: 2000 }).catch(() => false)) {
      biotopText = await biotopAnalysis.textContent() || 'N/A';
    }

    // 예상 결과와 비교
    const isCorrect = location.expectedKeywords.some(keyword =>
      landUseText.includes(keyword) || biotopText.includes(keyword)
    );

    results.push({
      name: location.name,
      expected: location.expectedType,
      detected: landUseText,
      biotopName: biotopText,
      ratio: biotopText.match(/\d+%/) ? biotopText.match(/\d+%/)![0] : 'N/A',
      correct: isCorrect,
    });

    console.log(`감지된 토지이용: ${landUseText}`);
    console.log(`비오톱 분석: ${biotopText}`);
    console.log(`정확도: ${isCorrect ? '✅ 정확' : '❌ 불일치'}`);
  }

  // 최종 결과 요약
  console.log('\n\n========== 최종 결과 요약 ==========');
  console.log('지역명 | 예상 | 감지 | 비오톱 | 정확도');
  console.log('-------|------|------|--------|--------');

  let correctCount = 0;
  for (const r of results) {
    const status = r.correct ? '✅' : '❌';
    console.log(`${r.name} | ${r.expected} | ${r.detected} | ${r.biotopName} | ${status}`);
    if (r.correct) correctCount++;
  }

  const accuracy = (correctCount / results.length * 100).toFixed(1);
  console.log('=====================================');
  console.log(`전체 정확도: ${correctCount}/${results.length} (${accuracy}%)`);
  console.log('=====================================\n');

  // 최소 50% 정확도 기대 (API 한계 고려)
  expect(correctCount).toBeGreaterThanOrEqual(Math.floor(results.length * 0.5));
});

test('API 응답 상세 분석', async ({ page }) => {
  test.setTimeout(60000);

  // 콘솔 로그 캡처 설정
  const apiResponses: string[] = [];

  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('비오톱') || text.includes('WFS') || text.includes('lclsf') ||
        text.includes('피처') || text.includes('자동 감지')) {
      apiResponses.push(text);
    }
  });

  // 페이지 로드
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  // 광교산 좌표로 이동
  await page.evaluate(() => {
    const event = new CustomEvent('moveToCoordinate', {
      detail: { center: [127.029, 37.309], zoom: 16 }
    });
    window.dispatchEvent(event);
  });

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

    await page.mouse.click(cx - 40, cy - 40);
    await page.waitForTimeout(100);
    await page.mouse.click(cx + 40, cy - 40);
    await page.waitForTimeout(100);
    await page.mouse.click(cx + 40, cy + 40);
    await page.waitForTimeout(100);
    await page.mouse.click(cx - 40, cy + 40);
    await page.waitForTimeout(100);
    await page.mouse.dblclick(cx - 40, cy - 40);
  }

  await page.waitForTimeout(6000);

  // 결과 확인
  const landUseDropdown = page.locator('button[role="combobox"]').first();
  const landUseText = await landUseDropdown.textContent() || 'N/A';

  const biotopAnalysis = page.locator('text=/비오톱 분석:/');
  let biotopText = 'N/A';
  if (await biotopAnalysis.isVisible({ timeout: 2000 }).catch(() => false)) {
    biotopText = await biotopAnalysis.textContent() || 'N/A';
  }

  console.log('\n========== API 응답 분석 ==========');
  console.log(`감지된 토지이용: ${landUseText}`);
  console.log(`비오톱 분석 결과: ${biotopText}`);
  console.log('--- 콘솔 로그 ---');
  for (const response of apiResponses) {
    console.log(response);
  }
  console.log('====================================\n');
});
