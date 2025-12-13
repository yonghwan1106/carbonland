import { test } from '@playwright/test';

/**
 * PDF 저장 상세 테스트
 */

test('PDF 저장 상세 테스트', async ({ page }) => {
  test.setTimeout(120000);

  // 모든 콘솔 로그 캡처
  page.on('console', msg => {
    console.log(`[${msg.type()}] ${msg.text()}`);
  });

  // 페이지 로드
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  // 데모 영역 선택
  console.log('1. 데모 영역 선택...');
  const demoButton = page.locator('button:has-text("광교산 산림")').first();
  await demoButton.click();
  await page.waitForTimeout(3000);

  // 시뮬레이션 실행 버튼 확인
  console.log('2. 시뮬레이션 버튼 확인...');
  const simButtons = await page.locator('button:has-text("시뮬레이션")').all();
  console.log(`시뮬레이션 버튼 수: ${simButtons.length}`);

  for (let i = 0; i < simButtons.length; i++) {
    const text = await simButtons[i].textContent();
    const visible = await simButtons[i].isVisible();
    console.log(`  버튼 ${i}: "${text}" - visible: ${visible}`);
  }

  // 시뮬레이션 실행
  const simButton = page.locator('button:has-text("시뮬레이션 실행")').first();
  if (await simButton.isVisible({ timeout: 3000 }).catch(() => false)) {
    console.log('3. 시뮬레이션 실행...');
    await simButton.click();
    await page.waitForTimeout(3000);
  } else {
    // 다른 버튼 시도
    const altButton = page.locator('button').filter({ hasText: /^시뮬레이션$/ }).first();
    if (await altButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('3. 시뮬레이션 버튼 클릭...');
      await altButton.click();
      await page.waitForTimeout(3000);
    }
  }

  // 저장/공유 버튼 클릭
  console.log('4. 저장/공유 버튼 클릭...');
  const exportButton = page.locator('button:has-text("저장")').first();
  await exportButton.click();
  await page.waitForTimeout(500);

  // PDF 옵션 확인
  const pdfOption = page.locator('[role="menuitem"]:has-text("PDF")');
  const pdfDisabled = await pdfOption.getAttribute('data-disabled');
  const pdfAriaDisabled = await pdfOption.getAttribute('aria-disabled');
  console.log(`PDF 옵션 disabled: ${pdfDisabled}, aria-disabled: ${pdfAriaDisabled}`);

  // PDF 저장 시도
  console.log('5. PDF 저장 시도...');
  const downloadPromise = page.waitForEvent('download', { timeout: 15000 }).catch(e => {
    console.log(`다운로드 이벤트 대기 실패: ${e.message}`);
    return null;
  });

  await pdfOption.click({ force: true });
  await page.waitForTimeout(5000);

  const download = await downloadPromise;
  if (download) {
    console.log(`✅ PDF 다운로드 성공: ${download.suggestedFilename()}`);
  } else {
    console.log('❌ PDF 다운로드 실패');
  }

  // 스크린샷 저장
  await page.screenshot({ path: 'test-results/pdf-test-screenshot.png' });
});
