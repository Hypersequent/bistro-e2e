import { test, expect } from '@playwright/test'
import { Menu } from './pageobjects/menu'
import { Cart } from './pageobjects/cart'
import { KNOWN_ORDER, openWithEmptyCart, readStoredCart } from '../utils/cartState'
import { addKnownOrderFromMenu } from '../utils/sharedSteps'

test.beforeEach(async ({ page }) => {
	// SP-1 — App open with an empty cart
	await openWithEmptyCart(page)
})

test('BD-060: Cart persists across a reload', async ({ page }) => {
	const menu = new Menu(page)
	const cart = new Cart(page)

	// SS-1 — Add items to the cart from the menu (badge 1 → 3 → 4)
	await addKnownOrderFromMenu(menu, cart)

	// Step 1 — Reload the page: the badge still reads 4
	await page.reload()
	await expect(cart.badge).toHaveText('4')

	// Step 2 — Open the cart: same three lines and $69 total; localStorage.cart intact
	await cart.open()
	await expect(cart.lines).toHaveCount(3)
	await expect(cart.quantityInput('Cheese Pizza')).toHaveValue('1')
	await expect(cart.quantityInput('Hot Pastrami')).toHaveValue('2')
	await expect(cart.quantityInput('Cappuccino')).toHaveValue('1')
	await expect(cart.total).toHaveText('$69')
	expect(await readStoredCart(page)).toEqual(KNOWN_ORDER)
})
