import { expect, test } from '@playwright/test'
import { Welcome } from './pageobjects/welcome'
import { Cart } from './pageobjects/cart'
import { knownOrder } from './fixtures/menuData'

test('BD-063: Setting a quantity greater than zero updates totals', async ({ page }) => {
	const welcome = new Welcome(page)
	const cart = new Cart(page)

	await welcome.open()
	await welcome.seedCart(knownOrder)
	await cart.open()

	await cart.setQuantity('Cheese Pizza', '3')
	await expect(cart.lineTotal('Cheese Pizza')).toHaveText('$45')
	await expect(cart.total).toHaveText('$95')
})

test('BD-064: Quantity 0 / empty / non-numeric removes the item', async ({ page }) => {
	const welcome = new Welcome(page)
	const cart = new Cart(page)

	await welcome.open()
	await welcome.seedCart(knownOrder)
	await cart.open()

	await cart.setQuantity('Cappuccino', '0')
	await expect(cart.line('Cappuccino')).toHaveCount(0)
	await expect(cart.total).toHaveText('$65')

	await welcome.seedCart(knownOrder)
	await cart.open()
	await cart.setQuantity('Hot Pastrami', '')
	await expect(cart.line('Hot Pastrami')).toHaveCount(0)
	await expect(cart.total).toHaveText('$19')

	await welcome.seedCart(knownOrder)
	await cart.open()
	await cart.setRawQuantity('Hot Pastrami', 'abc')
	await expect(cart.line('Hot Pastrami')).toHaveCount(0)
	await expect(cart.total).toHaveText('$19')
})

test('BD-065: The remove (X) button deletes the line', async ({ page }) => {
	const welcome = new Welcome(page)
	const cart = new Cart(page)

	await welcome.open()
	await welcome.seedCart(knownOrder)
	await cart.open()
	await expect(cart.badge).toHaveText('4')

	await cart.removeLine('Hot Pastrami')
	await expect(cart.line('Hot Pastrami')).toHaveCount(0)
	await expect(cart.total).toHaveText('$19')
	await expect(cart.badge).toHaveText('2')
})
