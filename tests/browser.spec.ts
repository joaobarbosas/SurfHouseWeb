import { expect, test } from '@playwright/test'

for (const width of [1440, 390, 320]) {
  test(`layout and frame delivery at ${width}px`, async ({ page, request }) => {
    await page.setViewportSize({ width, height: 900 })
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    const failedFrames: string[] = []
    page.on('requestfailed', req => {
      if (req.url().includes('/frames/')) failedFrames.push(req.url())
    })
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'Surf Ranch', exact: true })).toBeVisible()
    await expect(page.locator('canvas')).toHaveCSS('opacity', '1')
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await page.evaluate(() => window.scrollTo(0, innerHeight))
    // Decode every original frame, not just the first one.
    for (let i = 1; i <= 193; i++) {
      const response = await request.get(`/frames/frame_${String(i).padStart(4, '0')}.jpg`)
      expect(response.ok()).toBe(true)
    }
    expect(failedFrames).toEqual([])
    expect(errors).toEqual([])
  })
}

test('reduced motion loads a static first frame and suppresses CSS motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const frames = new Set<string>()
  page.on('request', req => {
    if (req.url().includes('/frames/')) frames.add(new URL(req.url()).pathname)
  })
  await page.goto('/')
  await expect(page.locator('canvas')).toHaveCSS('opacity', '1')
  expect([...frames]).toEqual(['/frames/frame_0001.jpg'])
  expect(await page.locator('.scroll-hero').evaluate(el => el.getBoundingClientRect().height))
    .toBe(await page.evaluate(() => innerHeight))
  await expect(page.getByRole('heading', { name: 'Surf Ranch', exact: true })).toHaveCSS('animation-name', 'none')
})
