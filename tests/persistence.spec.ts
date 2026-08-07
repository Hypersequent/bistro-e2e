import { expect, test } from '@playwright/test'
import { Welcome } from './pageobjects/welcome'
import { Menu } from './pageobjects/menu'
import { Cart } from './pageobjects/cart'
import { knownOrder } from './fixtures/menuData'

test('BD-071: Cart persists across a reload', async ({ page }) => {
	const welcome = new Welcome(page)
	const menu = new Menu(page)
	const cart = new Cart(page)

	await welcome.open()

	await menu.addToCart('pizzas', 'Cheese Pizza')
	await menu.addToCart('pizzas', 'Hot Pastrami', 2)
	await menu.addToCart('drinks', 'Cappuccino')
	await expect(cart.badge).toHaveText('4')

	await page.reload()
	await welcome.waitUntilReady()
	await expect(cart.badge).toHaveText('4')

	await cart.open()
	await expect(cart.lines).toHaveCount(3)
	await expect(cart.total).toHaveText('$69')
	expect(await welcome.readStoredCart()).toEqual(knownOrder)
})
