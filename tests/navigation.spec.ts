import { test, expect } from '@playwright/test'
import { Welcome } from './pageobjects/welcome'
import { About } from './pageobjects/about'
import { Menu } from './pageobjects/menu'
import { openWithEmptyCart } from '../utils/cartState'

test.beforeEach(async ({ page }) => {
	// SP-1 — App open with an empty cart
	await openWithEmptyCart(page)
})

test('BD-046: Navbar links navigate to the correct routes', async ({ page }) => {
	const welcome = new Welcome(page)
	const about = new About(page)
	const menu = new Menu(page)

	// Step 1 — Click Welcome: URL is /bistro/; hero heading "Bistro Delivery" is visible
	await welcome.navLink('Welcome').click()
	await expect(page).toHaveURL(process.env.DEMO_BASE_URL + '/')
	await expect(welcome.heroHeading).toBeVisible()
	await expect(welcome.heroHeading).toHaveText('Bistro Delivery')

	// Step 2 — Click About us: URL is /bistro/about; heading "Welcome to Bistro Delivery" is visible
	await welcome.navLink('About us').click()
	await expect(page).toHaveURL(process.env.DEMO_BASE_URL + '/about')
	await expect(about.heading).toBeVisible()
	await expect(about.heading).toHaveText('Welcome to Bistro Delivery')

	// Step 3 — Click Today's Menu: the menu section is in view on the home page
	await welcome.navLink("Today's Menu").click()
	await expect(menu.section).toBeInViewport()
})
