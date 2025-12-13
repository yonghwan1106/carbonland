import { test, expect } from '@playwright/test';

/**
 * 이미지/PDF 저장 기능 테스트
 */

test('저장/공유 기능 테스트', async ({ page }) => {
  test.setTimeout(120000);

  // 콘솔 로그 캡처
  const consoleErrors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  // 페이지 로드
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  // 데모 영역 선택
  console.log('1. 데모 영역 선택...');
  const demoButton = page.locator('button:has-text("광교산 산림")').first();
  if (await demoButton.isVisible({ timeout: 3000 }).catch(() => false)) {
    await demoButton.click();
    await page.waitForTimeout(3000);
  } else {
    console.log('데모 영역 버튼을 찾을 수 없음');
    return;
  }

  // 시뮬레이션 실행
  console.log('2. 시뮬레이션 실행...');
  const simButton = page.locator('button:has-text("시뮬레이션")').first();
  if (await simButton.isVisible({ timeout: 3000 }).catch(() => false)) {
    await simButton.click();
    await page.waitForTimeout(2000);
  }

  // 저장/공유 버튼 찾기
  console.log('3. 저장/공유 버튼 클릭...');
  const exportButton = page.locator('button:has-text("저장")').first();
  if (await exportButton.isVisible({ timeout: 3000 }).catch(() => false)) {
    await exportButton.click();
    await page.waitForTimeout(500);
  } else {
    console.log('저장/공유 버튼을 찾을 수 없음');
  }

  // 드롭다운 메뉴 확인
  const imageOption = page.locator('text=이미지로 저장');
  const pdfOption = page.locator('text=PDF 리포트');

  console.log('4. 메뉴 옵션 확인...');
  const imageVisible = await imageOption.isVisible({ timeout: 2000 }).catch(() => false);
  const pdfVisible = await pdfOption.isVisible({ timeout: 2000 }).catch(() => false);

  console.log(`이미지 저장 옵션: ${imageVisible ? '보임' : '안보임'}`);
  console.log(`PDF 리포트 옵션: ${pdfVisible ? '보임' : '안보임'}`);

  // 이미지 저장 테스트
  if (imageVisible) {
    console.log('5. 이미지 저장 시도...');
    const downloadPromise = page.waitForEvent('download', { timeout: 10000 }).catch(() => null);
    await imageOption.click();
    await page.waitForTimeout(3000);
    const download = await downloadPromise;
    if (download) {
      console.log(`이미지 다운로드 성공: ${download.suggestedFilename()}`);
    } else {
      console.log('이미지 다운로드 실패 또는 타임아웃');
    }
  }

  // 다시 저장/공유 버튼 클릭
  await page.waitForTimeout(1000);
  if (await exportButton.isVisible().catch(() => false)) {
    await exportButton.click();
    await page.waitForTimeout(500);
  }

  // PDF 저장 테스트
  if (await pdfOption.isVisible({ timeout: 2000 }).catch(() => false)) {
    console.log('6. PDF 저장 시도...');
    const downloadPromise = page.waitForEvent('download', { timeout: 10000 }).catch(() => null);
    await pdfOption.click();
    await page.waitForTimeout(3000);
    const download = await downloadPromise;
    if (download) {
      console.log(`PDF 다운로드 성공: ${download.suggestedFilename()}`);
    } else {
      console.log('PDF 다운로드 실패 또는 타임아웃');
    }
  }

  // 콘솔 에러 출력
  if (consoleErrors.length > 0) {
    console.log('\n콘솔 에러:');
    consoleErrors.forEach(err => console.log(`  - ${err}`));
  }
});
