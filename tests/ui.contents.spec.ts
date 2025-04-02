import { test, expect } from '@playwright/test'
import { Welcome } from './pageobjects/welcome'
import { About } from './pageobjects/about'
import { Menu } from './pageobjects/menu'

test('BD-055: User should see the content according to the About Us information', async ({
	page,
}) => {
	const about = new About(page)

	await about.goto()

	expect(await about.getHeading()).toBe('Welcome to Bistro Delivery')
	expect(await about.getBody()).toContain(
		"So, while you won't actually be able to order your favorite quiche or ratatouille from us," +
			' you can certainly rely on QA Sphere to deliver the tools and systems you need to ensure your software projects' +
			' are a recipe for success. Bon appétit and happy testing!'
	)
})

test('BD-026: Correct display of blocks and buttons in the navbar', async ({ page }) => {
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
		{ text: 'Welcome', isActive: true },
		{ text: "Today's Menu", isActive: false }, // bug: this should be true instead of Welcome
		{ text: 'About us', isActive: false },
	])

	await about.goto()
	navbarItems = await about.getNavbarItems()
	expect(navbarItems).toEqual([
		{ text: 'Welcome', isActive: true },
		{ text: "Today's Menu", isActive: false },
		{ text: 'About us', isActive: false }, // bug: this should be true instead of Welcome
	])
})

test('BD-038: User should see the Pizzas list by default on the Todays Menu block', async ({
	page,
}) => {
	const menu = new Menu(page)
	await menu.goto()

	const pizzaMenu = await menu.getPizzaMenu()
	let tabs = await menu.getTabs()
	expect(tabs).toEqual([
		{ text: 'PIZZAS', isActive: true },
		{ text: 'DRINKS', isActive: false },
		{ text: 'DESSERTS', isActive: false },
	])
	expect(pizzaMenu.length).toBeGreaterThan(0)

	const drinksMenu = await menu.getOtherMenu('drinks')
	tabs = await menu.getTabs()
	expect(tabs).toEqual([
		{ text: 'PIZZAS', isActive: false },
		{ text: 'DRINKS', isActive: true },
		{ text: 'DESSERTS', isActive: false },
	])
	expect(drinksMenu.length).toBeGreaterThan(0)

	const dessertsMenu = await menu.getOtherMenu('desserts')
	tabs = await menu.getTabs()
	expect(tabs).toEqual([
		{ text: 'PIZZAS', isActive: false },
		{ text: 'DRINKS', isActive: false },
		{ text: 'DESSERTS', isActive: true },
	])
	expect(dessertsMenu.length).toBeGreaterThan(0)
})

test('BD-052: User should see the Todays Menu block after clicking the Todays Menu button in the Welcome banner', async ({
	page,
}) => {
	const welcome = new Welcome(page)

	await welcome.goto()

	expect(await welcome.getHeading()).toBe('Bistro Delivery')
	expect(await welcome.getBody()).toBe(
		'Elegance of French&Italian Cuisine Delivered Directly to Your Doorstep!'
	)

	expect(await welcome.getGotoMenuButton()).toBe("View Today's Menu")
})
