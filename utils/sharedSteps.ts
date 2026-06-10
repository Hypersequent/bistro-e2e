import { expect } from '@playwright/test'
import { Menu } from '../tests/pageobjects/menu'
import { Cart } from '../tests/pageobjects/cart'
import { Checkout, PaymentMethod } from '../tests/pageobjects/checkout'

/**
 * SS-1 / SP-2 (UI variant) — add the known order from the menu:
 * Cheese Pizza ×1 (badge 1), Hot Pastrami ×2 (badge 3), Cappuccino ×1 (badge 4).
 */
export async function addKnownOrderFromMenu(menu: Menu, cart: Cart) {
	await menu.addToCart('Cheese Pizza')
	await expect(cart.badge).toHaveText('1')
	await menu.addToCart('Hot Pastrami')
	await menu.addToCart('Hot Pastrami')
	await expect(cart.badge).toHaveText('3')
	await menu.switchTo('Drinks')
	await menu.addToCart('Cappuccino')
	await expect(cart.badge).toHaveText('4')
}

/**
 * SP-3 — reach the Checkout page with the known order via the in-app Checkout
 * button (direct `goto('/checkout')` redirects home before the cart hydrates).
 */
export async function reachCheckoutWithKnownOrder(menu: Menu, cart: Cart) {
	await addKnownOrderFromMenu(menu, cart)
	await cart.open()
	await cart.checkout()
}

/** SS-3 — fill the checkout form and place the order. */
export async function fillCheckoutFormAndPlaceOrder(
	checkout: Checkout,
	paymentMethod: PaymentMethod = 'Cash on Delivery',
	name = 'Jane Tester',
	address = '12 Rue de Test, Paris'
) {
	await checkout.nameInput.fill(name)
	await expect(checkout.nameInput).toHaveValue(name)
	await checkout.addressInput.fill(address)
	await expect(checkout.addressInput).toHaveValue(address)
	await checkout.paymentSelect.selectOption({ label: paymentMethod })
	// The options carry no value attribute, so the select's value equals the label.
	await expect(checkout.paymentSelect).toHaveValue(paymentMethod)
	await checkout.placeOrderButton.click()
}
