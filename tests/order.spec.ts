import { test, expect } from '@playwright/test'
import { Menu } from './pageobjects/menu'
import { Cart } from './pageobjects/cart'
import { Checkout } from './pageobjects/checkout'
import { Welcome } from './pageobjects/welcome'
import { KNOWN_ORDER, openWithEmptyCart, readStoredCart } from '../utils/cartState'
import { fillCheckoutFormAndPlaceOrder, reachCheckoutWithKnownOrder } from '../utils/sharedSteps'

test.beforeEach(async ({ page }) => {
	// SP-3 — On the Checkout page with the known order (via SP-1 + SP-2 + Checkout button)
	await openWithEmptyCart(page)
	await reachCheckoutWithKnownOrder(new Menu(page), new Cart(page))
})

test('BD-057: Place an order with Cash on Delivery shows success', async ({ page }) => {
	const checkout = new Checkout(page)

	// SS-3 — Fill the checkout form (Jane Tester, 12 Rue de Test, Paris) and place the order
	await fillCheckoutFormAndPlaceOrder(checkout, 'Cash on Delivery')

	// Step 1 — Heading reads exactly "Your order placed successfully!"
	await expect(checkout.successHeading).toHaveText('Your order placed successfully!')

	// Step 2 — Thanks Jane Tester, repeats the address, states Payment method: Cash on Delivery
	await expect(checkout.successAlert).toContainText('Thank you, Jane Tester')
	await expect(checkout.successAlert).toContainText('12 Rue de Test, Paris')
	await expect(checkout.successAlert).toContainText(/Payment method:\s*Cash on Delivery/)
})

test('BD-058: Place an order with Card Payment on Delivery shows success', async ({ page }) => {
	const checkout = new Checkout(page)

	// SS-3 — Fill the checkout form and place the order (Card Payment on Delivery)
	await fillCheckoutFormAndPlaceOrder(checkout, 'Card Payment on Delivery')

	// Step 1 — Success message appears stating Payment method: Card Payment on Delivery
	await expect(checkout.successHeading).toHaveText('Your order placed successfully!')
	await expect(checkout.successAlert).toContainText(/Payment method:\s*Card Payment on Delivery/)
})

test('BD-059: Cart is not cleared after placing an order', async ({ page }) => {
	const checkout = new Checkout(page)
	const welcome = new Welcome(page)
	const cart = new Cart(page)

	// SS-3 — Fill the checkout form and place the order
	await fillCheckoutFormAndPlaceOrder(checkout)
	await expect(checkout.successHeading).toBeVisible()

	// Step 1 — After success, localStorage.cart still holds the three items (unchanged)
	expect(await readStoredCart(page)).toEqual(KNOWN_ORDER)

	// Step 2 — Navigate home and open the cart: the same items and $69 total are present
	await welcome.navLink('Welcome').click()
	await cart.open()
	await expect(cart.lines).toHaveCount(3)
	await expect(cart.quantityInput('Cheese Pizza')).toHaveValue('1')
	await expect(cart.quantityInput('Hot Pastrami')).toHaveValue('2')
	await expect(cart.quantityInput('Cappuccino')).toHaveValue('1')
	await expect(cart.total).toHaveText('$69')
})
