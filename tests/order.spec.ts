import { expect, test } from '@playwright/test'
import { Welcome } from './pageobjects/welcome'
import { Cart } from './pageobjects/cart'
import { Checkout } from './pageobjects/checkout'
import { knownOrder } from './fixtures/menuData'

const customerName = 'Jane Tester'
const customerAddress = '12 Rue de Test, Paris'

test('BD-068: Place an order with Cash on Delivery shows success', async ({ page }) => {
	const welcome = new Welcome(page)
	const cart = new Cart(page)
	const checkout = new Checkout(page)

	await welcome.open()
	await welcome.seedCart(knownOrder)
	await cart.open()
	await cart.goToCheckout()

	await checkout.placeOrder(customerName, customerAddress, 'Cash on Delivery')

	await expect(checkout.successHeading).toHaveText('Your order placed successfully!')
	await expect(checkout.successAlert).toContainText(`Thank you, ${customerName},`)
	await expect(checkout.successAddress).toHaveText(customerAddress)
	await expect(checkout.successAlert.locator('strong').last()).toHaveText('Cash on Delivery')
})

test('BD-069: Place an order with Card Payment on Delivery shows success', async ({ page }) => {
	const welcome = new Welcome(page)
	const cart = new Cart(page)
	const checkout = new Checkout(page)

	await welcome.open()
	await welcome.seedCart(knownOrder)
	await cart.open()
	await cart.goToCheckout()

	await checkout.placeOrder(customerName, customerAddress, 'Card Payment on Delivery')

	await expect(checkout.successHeading).toHaveText('Your order placed successfully!')
	await expect(checkout.successAlert.locator('strong').last()).toHaveText(
		'Card Payment on Delivery'
	)
})

test('BD-070: Cart is not cleared after placing an order', async ({ page }) => {
	const welcome = new Welcome(page)
	const cart = new Cart(page)
	const checkout = new Checkout(page)

	await welcome.open()
	await welcome.seedCart(knownOrder)
	await cart.open()
	await cart.goToCheckout()

	await checkout.placeOrder(customerName, customerAddress, 'Cash on Delivery')
	await expect(checkout.successHeading).toBeVisible()

	expect(await welcome.readStoredCart()).toEqual(knownOrder)

	await welcome.open()
	await cart.open()
	await expect(cart.lines).toHaveCount(3)
	await expect(cart.total).toHaveText('$69')
})
