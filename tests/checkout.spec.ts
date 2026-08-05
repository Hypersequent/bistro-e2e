import { expect, test } from '@playwright/test'
import { Welcome } from './pageobjects/welcome'
import { Cart } from './pageobjects/cart'
import { Checkout } from './pageobjects/checkout'
import { knownOrder } from './fixtures/menuData'

test('BD-066: Empty-cart direct navigation to checkout redirects home', async ({ page }) => {
	const welcome = new Welcome(page)

	await page.goto('checkout')

	await expect(page).toHaveURL(/\/bistro\/$/)
	await expect(welcome.heroHeading).toBeVisible()
})

test('BD-067: Order summary matches the cart', async ({ page }) => {
	const welcome = new Welcome(page)
	const cart = new Cart(page)
	const checkout = new Checkout(page)

	await welcome.open()
	await welcome.seedCart(knownOrder)
	await cart.open()
	await cart.goToCheckout()

	const expectedRows = [
		{ title: 'Cheese Pizza', quantity: '1', total: '$15' },
		{ title: 'Hot Pastrami', quantity: '2', total: '$50' },
		{ title: 'Cappuccino', quantity: '1', total: '$4' },
	]

	for (const { title, quantity, total } of expectedRows) {
		const row = checkout.summaryRow(title)
		await expect(row.locator('td').nth(2)).toHaveText(quantity)
		await expect(row.locator('td').nth(3)).toHaveText(total)
	}

	await expect(checkout.total).toHaveText('$69')
})
