import { test, expect } from '@playwright/test'
import { Menu } from './pageobjects/menu'
import { Cart } from './pageobjects/cart'
import { openWithEmptyCart } from '../utils/cartState'
import { addKnownOrderFromMenu } from '../utils/sharedSteps'

test.beforeEach(async ({ page }) => {
	// SP-1 — App open with an empty cart
	await openWithEmptyCart(page)
})

test('BD-049: Add-to-cart increments the badge by total quantity', async ({ page }) => {
	const menu = new Menu(page)
	const cart = new Cart(page)

	// Step 1 — Add Cheese Pizza ×1, Hot Pastrami ×2: badge reads 3
	await menu.addToCart('Cheese Pizza')
	await menu.addToCart('Hot Pastrami')
	await menu.addToCart('Hot Pastrami')
	await expect(cart.badge).toHaveText('3')

	// Step 2 — Add Cappuccino ×1: badge reads 4 (sum of quantities)
	await menu.switchTo('Drinks')
	await menu.addToCart('Cappuccino')
	await expect(cart.badge).toHaveText('4')
})

test('BD-050: Adding the same item twice yields one line with quantity 2', async ({ page }) => {
	const menu = new Menu(page)
	const cart = new Cart(page)

	// Step 1 — Add Cheese Pizza twice; open the cart: a single line with quantity 2
	await menu.addToCart('Cheese Pizza')
	await menu.addToCart('Cheese Pizza')
	await cart.open()
	await expect(cart.line('Cheese Pizza')).toHaveCount(1)
	await expect(cart.quantityInput('Cheese Pizza')).toHaveValue('2')

	// Step 2 — Read the line total: $30 (15×2)
	await expect(cart.lineTotal('Cheese Pizza')).toHaveText('$30')
})

test('BD-051: Line totals and cart total compute correctly', async ({ page }) => {
	const menu = new Menu(page)
	const cart = new Cart(page)

	// SP-2 — Cart preloaded with the known order (built via the UI)
	await addKnownOrderFromMenu(menu, cart)

	// Step 1 — Open the cart: line totals Cheese Pizza $15, Hot Pastrami $50, Cappuccino $4
	await cart.open()
	await expect(cart.lineTotal('Cheese Pizza')).toHaveText('$15')
	await expect(cart.lineTotal('Hot Pastrami')).toHaveText('$50')
	await expect(cart.lineTotal('Cappuccino')).toHaveText('$4')

	// Step 2 — Read [data-testid="cartTotal"]: total is $69 (sum of line totals)
	await expect(cart.total).toHaveText('$69')
})
