import { expect, test } from '@playwright/test'
import { Welcome } from './pageobjects/welcome'
import { About } from './pageobjects/about'

test('BD-057: Navbar links navigate to the correct routes', async ({ page }) => {
	const welcome = new Welcome(page)
	const about = new About(page)

	await welcome.open()

	await welcome.welcomeLink.click()
	await expect(page).toHaveURL(/\/bistro\/$/)
	await expect(welcome.heroHeading).toBeVisible()

	await welcome.aboutLink.click()
	await expect(page).toHaveURL(/\/bistro\/about\/?$/)
	await expect(about.heading).toBeVisible()

	await welcome.menuLink.click()
	await expect(page).toHaveURL(/\/bistro\/#menu$/)
	await expect(welcome.menuSection).toBeInViewport()
})
