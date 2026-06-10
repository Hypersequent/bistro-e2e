import { test, expect } from '@playwright/test'
import { Menu } from './pageobjects/menu'
import { Cart } from './pageobjects/cart'
import { Checkout } from './pageobjects/checkout'
import { openWithEmptyCart } from '../utils/cartState'
import { reachCheckoutWithKnownOrder } from '../utils/sharedSteps'

test.beforeEach(async ({ page }) => {
	// SP-1 — App open with an empty cart
	await openWithEmptyCart(page)
})

test('BD-055: Empty-cart direct navigation to checkout redirects home', async ({ page }) => {
	// Step 1 — goto /bistro/checkout with an empty cart: the app redirects; final URL is /bistro/
	await page.goto(process.env.DEMO_BASE_URL + '/checkout')
	await expect(page).toHaveURL(process.env.DEMO_BASE_URL + '/')
})

test('BD-056: Order summary matches the cart', async ({ page }) => {
	const menu = new Menu(page)
	const cart = new Cart(page)
	const checkout = new Checkout(page)

	// SP-3 — On the Checkout page with the known order
	await reachCheckoutWithKnownOrder(menu, cart)

	// Step 1 — Read the order-summary rows: Cheese Pizza ×1 $15, Hot Pastrami ×2 $50, Cappuccino ×1 $4
	await expect(checkout.rowCount('Cheese Pizza')).toHaveText('1')
	await expect(checkout.rowTotal('Cheese Pizza')).toHaveText('$15')
	await expect(checkout.rowCount('Hot Pastrami')).toHaveText('2')
	await expect(checkout.rowTotal('Hot Pastrami')).toHaveText('$50')
	await expect(checkout.rowCount('Cappuccino')).toHaveText('1')
	await expect(checkout.rowTotal('Cappuccino')).toHaveText('$4')

	// Step 2 — Read [data-testid="cartTotal"]: total is $69, matching the cart
	await expect(checkout.total).toHaveText('$69')
})
