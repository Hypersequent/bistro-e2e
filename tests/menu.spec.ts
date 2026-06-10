import { test, expect } from '@playwright/test'
import { Menu } from './pageobjects/menu'
import { openWithEmptyCart } from '../utils/cartState'
import { PIZZAS, DRINKS, DESSERTS, titles, prices } from '../utils/menuData'

test.beforeEach(async ({ page }) => {
	// SP-1 — App open with an empty cart
	await openWithEmptyCart(page)
})

test('BD-047: Switching tabs reveals the matching category and active state', async ({ page }) => {
	const menu = new Menu(page)

	// Step 1 — Default state: Pizzas tab has button--is-active; #pizzaMenu has menu--is-visible
	await expect(menu.tab('Pizzas')).toHaveClass(/button--is-active/)
	await expect(menu.pizzasPanel).toHaveClass(/menu--is-visible/)

	// Step 2 — Click Drinks: #drinksMenu becomes visible, Drinks tab is active; pizzas hidden
	await menu.switchTo('Drinks')
	await expect(menu.drinksPanel).toHaveClass(/menu--is-visible/)
	await expect(menu.drinksPanel).toBeVisible()
	await expect(menu.tab('Drinks')).toHaveClass(/button--is-active/)
	await expect(menu.pizzasPanel).not.toHaveClass(/menu--is-visible/)
	await expect(menu.pizzasPanel).toBeHidden()

	// Step 3 — Click Desserts: #dessertsMenu becomes visible and the Desserts tab is active
	await menu.switchTo('Desserts')
	await expect(menu.dessertsPanel).toHaveClass(/menu--is-visible/)
	await expect(menu.dessertsPanel).toBeVisible()
	await expect(menu.tab('Desserts')).toHaveClass(/button--is-active/)
})

test('BD-048: Item titles and prices match the menu data per category', async ({ page }) => {
	const menu = new Menu(page)

	// Step 1 — Pizzas: six items; titles/prices match the data
	await expect(menu.visibleItems).toHaveCount(6)
	await expect(menu.visibleItemTitles).toHaveText(titles(PIZZAS))
	await expect(menu.visibleItemPrices).toHaveText(prices(PIZZAS))

	// Step 2 — Drinks and Desserts: six items each; titles/prices match CONTEXT.md §5
	await menu.switchTo('Drinks')
	await expect(menu.visibleItems).toHaveCount(6)
	await expect(menu.visibleItemTitles).toHaveText(titles(DRINKS))
	await expect(menu.visibleItemPrices).toHaveText(prices(DRINKS))

	await menu.switchTo('Desserts')
	await expect(menu.visibleItems).toHaveCount(6)
	await expect(menu.visibleItemTitles).toHaveText(titles(DESSERTS))
	await expect(menu.visibleItemPrices).toHaveText(prices(DESSERTS))
})
