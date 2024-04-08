import { test, expect } from '@playwright/test'
import { Welcome } from './pageobjects/welcome'
import { About } from './pageobjects/about'
import { Menu } from './pageobjects/menu'

test('Welcome page content', async ({ page }) => {
	const welcome = new Welcome(page)

	await welcome.goto()

	expect(await welcome.getHeading()).toBe('Bistrot Français')
	expect(await welcome.getBody()).toBe(
		'Elegance of French Cuisine Delivered Directly to Your Doorstep!'
	)

	expect(await welcome.getGotoMenuButton()).toBe("View Today's Menu")
})

test('About page content', async ({ page }) => {
	const about = new About(page)

	await about.goto()

	expect(await about.getHeading()).toBe('Welcome to Bistrot Français')
	expect(await about.getBody()).toContain(
		"So, while you won't actually be able to order your favorite quiche or ratatouille from us," +
			' you can certainly rely on QA Sphere to deliver the tools and systems you need to ensure your software projects' +
			' are a recipe for success. Bon appétit and happy testing!'
	)
})

test('Navigation bar items', async ({ page }) => {
	const welcome = new Welcome(page)
	const about = new About(page)
	const menu = new Menu(page)

	await welcome.goto()
	let navbarItems = await welcome.getNavbarItems()
	expect(navbarItems).toEqual([
		{ text: 'Welcome', isActive: true },
		{ text: "Today's Menu", isActive: false },
		{ text: 'About us', isActive: false },
	])

	await menu.goto()
	navbarItems = await menu.getNavbarItems()
	expect(navbarItems).toEqual([
		{ text: 'Welcome', isActive: false },
		{ text: "Today's Menu", isActive: true },
		{ text: 'About us', isActive: false },
	])

	await about.goto()
	navbarItems = await about.getNavbarItems()
	expect(navbarItems).toEqual([
		{ text: 'Welcome', isActive: false },
		{ text: "Today's Menu", isActive: false },
		{ text: 'About us', isActive: true },
	])
})

test('Menu page content', async ({ page }) => {
	const menu = new Menu(page)

	await menu.goto()
})
