import { test, expect } from '@playwright/test'
import { Cart } from './pageobjects/cart'
import { seedKnownOrder } from '../utils/cartState'

test.beforeEach(async ({ page }) => {
	// SP-2 — Cart preloaded with the known order (deterministic localStorage seeding
	// per AUTOMATED.md §10.5; the init script re-applies the seed on every reload)
	await seedKnownOrder(page)
	await page.goto(process.env.DEMO_BASE_URL + '/')
})

test('BD-052: Setting a quantity greater than zero updates totals', async ({ page }) => {
	const cart = new Cart(page)

	// Step 1 — Open the cart and set Cheese Pizza quantity to 3: line total becomes $45
	await cart.open()
	await cart.setQuantity('Cheese Pizza', '3')
	await expect(cart.lineTotal('Cheese Pizza')).toHaveText('$45')

	// Step 2 — Read the cart total: updates to $99 (45 + 50 + 4)
	await expect(cart.total).toHaveText('$99')
})

test('BD-053: Quantity 0, empty or non-numeric removes the item', async ({ page }) => {
	const cart = new Cart(page)

	// Step 1 — Set Cappuccino quantity to 0: the line is removed; total drops to $65
	await cart.open()
	await cart.setQuantity('Cappuccino', '0')
	await expect(cart.line('Cappuccino')).toHaveCount(0)
	await expect(cart.total).toHaveText('$65')

	// Step 2 — Reset (SP-2), clear the Hot Pastrami quantity: the line is removed (empty → 0)
	await page.reload()
	await cart.open()
	await cart.setQuantity('Hot Pastrami', '')
	await expect(cart.line('Hot Pastrami')).toHaveCount(0)

	// Step 3 — Reset (SP-2), type a non-numeric quantity: the line is removed (non-numeric → 0)
	// Chromium filters non-numeric keystrokes out of number inputs before the app
	// sees them, so commit the value at the DOM level: per the HTML spec, assigning
	// "abc" to an input[type=number] coerces its value to "" — exactly what the app
	// receives from a browser that allows typing letters (e.g. Firefox).
	await page.reload()
	await cart.open()
	await cart.quantityInput('Cheese Pizza').evaluate((el) => {
		const input = el as HTMLInputElement
		input.value = 'abc'
		input.dispatchEvent(new Event('input', { bubbles: true }))
		input.dispatchEvent(new Event('change', { bubbles: true }))
	})
	await expect(cart.line('Cheese Pizza')).toHaveCount(0)
})

test('BD-054: The remove (X) button deletes the line', async ({ page }) => {
	const cart = new Cart(page)

	// SP-2 baseline: badge shows 4
	await expect(cart.badge).toHaveText('4')

	// Step 1 — Open the cart and click X on the Hot Pastrami line: the line is removed
	await cart.open()
	await cart.removeButton('Hot Pastrami').click()
	await expect(cart.line('Hot Pastrami')).toHaveCount(0)

	// Step 2 — Read the total and badge: total is $19; badge drops by 2 (4 → 2)
	await expect(cart.total).toHaveText('$19')
	await expect(cart.badge).toHaveText('2')
})
