import { expect, test } from '@playwright/test'
import { Welcome } from './pageobjects/welcome'
import { Menu } from './pageobjects/menu'
import { Cart } from './pageobjects/cart'
import { knownOrder } from './fixtures/menuData'

test('BD-060: Add-to-cart increments the badge by total quantity', async ({ page }) => {
	const welcome = new Welcome(page)
	const menu = new Menu(page)
	const cart = new Cart(page)

	await welcome.open()

	await menu.addToCart('pizzas', 'Cheese Pizza')
	await menu.addToCart('pizzas', 'Hot Pastrami', 2)
	await expect(cart.badge).toHaveText('3')

	await menu.addToCart('drinks', 'Cappuccino')
	await expect(cart.badge).toHaveText('4')
})

test('BD-061: Adding the same item twice yields one line with quantity 2', async ({ page }) => {
	const welcome = new Welcome(page)
	const menu = new Menu(page)
	const cart = new Cart(page)

	await welcome.open()

	await menu.addToCart('pizzas', 'Cheese Pizza', 2)
	await cart.open()

	await expect(cart.lines).toHaveCount(1)
	await expect(cart.quantityInput('Cheese Pizza')).toHaveValue('2')
	await expect(cart.lineTotal('Cheese Pizza')).toHaveText('$30')
})

test('BD-062: Line totals and cart total compute correctly', async ({ page }) => {
	const welcome = new Welcome(page)
	const cart = new Cart(page)

	await welcome.open()
	await welcome.seedCart(knownOrder)
	await cart.open()

	await expect(cart.lineTotal('Cheese Pizza')).toHaveText('$15')
	await expect(cart.lineTotal('Hot Pastrami')).toHaveText('$50')
	await expect(cart.lineTotal('Cappuccino')).toHaveText('$4')
	await expect(cart.total).toHaveText('$69')
})
