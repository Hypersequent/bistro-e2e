import { test, expect } from '@playwright/test'
import { Menu } from './pageobjects/menu'
import { Cart } from './pageobjects/cart'
import { Checkout, paymentMethods } from './pageobjects/checkout'

test('BD-023: User should see product list according the cart on the Checkout page', async ({
	page,
}) => {
	const menu = new Menu(page)
	await menu.goto()

	await addToCart(menu)

	const pizzaMenu = await menu.getPizzaMenu()
	const drinksMenu = await menu.getOtherMenu('drinks')
	const dessertsMenu = await menu.getOtherMenu('desserts')

	let expectedCartResponse = {
		items: [
			{ name: pizzaMenu[0].name, amount: pizzaMenu[0].price },
			{ name: pizzaMenu[1].name, amount: pizzaMenu[1].price * 2 },
			{ name: drinksMenu[0].name, amount: drinksMenu[0].price },
			{ name: drinksMenu[1].name, amount: drinksMenu[1].price },
			{ name: dessertsMenu[0].name, amount: dessertsMenu[0].price },
		],
		total:
			pizzaMenu[0].price +
			pizzaMenu[1].price * 2 +
			drinksMenu[0].price +
			drinksMenu[1].price +
			dessertsMenu[0].price,
	}

	const cart = new Cart(page)
	await cart.openCart()
	let cartResponse = await cart.getCartItems()
	expect(cartResponse).toEqual(expectedCartResponse)

	// remove items from cart and check response

	await cart.removeCartItem(1)
	await cart.removeCartItem(0)

	expectedCartResponse = {
		items: [
			{ name: drinksMenu[0].name, amount: drinksMenu[0].price },
			{ name: drinksMenu[1].name, amount: drinksMenu[1].price },
			{ name: dessertsMenu[0].name, amount: dessertsMenu[0].price },
		],
		total: drinksMenu[0].price + drinksMenu[1].price + dessertsMenu[0].price,
	}

	cartResponse = await cart.getCartItems()
	expect(cartResponse).toEqual(expectedCartResponse)

	// add back items to cart again
	await cart.closeCart()
	await menu.switchTab('pizza')
	await menu.addMenuItemToCart(1)
	await menu.addMenuItemToCart(1)

	await cart.openCart()
	expectedCartResponse = {
		items: [
			{ name: drinksMenu[0].name, amount: drinksMenu[0].price },
			{ name: drinksMenu[1].name, amount: drinksMenu[1].price },
			{ name: dessertsMenu[0].name, amount: dessertsMenu[0].price },
			{ name: pizzaMenu[1].name, amount: pizzaMenu[1].price * 2 },
		],
		total:
			drinksMenu[0].price + drinksMenu[1].price + dessertsMenu[0].price + pizzaMenu[1].price * 2,
	}

	cartResponse = await cart.getCartItems()
	expect(cartResponse).toEqual(expectedCartResponse)
})

test('BD-022: User should place the order successfully after entering valid data in all required fields and selecting the "Cash" payment', async ({
	page,
}) => {
	const menu = new Menu(page)
	await menu.goto()

	await addToCart(menu)

	const pizzaMenu = await menu.getPizzaMenu()
	const drinksMenu = await menu.getOtherMenu('drinks')
	const dessertsMenu = await menu.getOtherMenu('desserts')

	const expectedItemsResponse = {
		items: [
			{ name: pizzaMenu[0].name, amount: pizzaMenu[0].price },
			{ name: pizzaMenu[1].name, amount: pizzaMenu[1].price * 2 },
			{ name: drinksMenu[0].name, amount: drinksMenu[0].price },
			{ name: drinksMenu[1].name, amount: drinksMenu[1].price },
			{ name: dessertsMenu[0].name, amount: dessertsMenu[0].price },
		],
		total:
			pizzaMenu[0].price +
			pizzaMenu[1].price * 2 +
			drinksMenu[0].price +
			drinksMenu[1].price +
			dessertsMenu[0].price,
	}

	const cart = new Cart(page)
	await cart.openCart()
	await page.waitForTimeout(1000)
	await cart.checkout()

	const checkout = new Checkout(page)
	const orderRes = await checkout.getOrderItems()
	expect(orderRes).toEqual(expectedItemsResponse)

	const nameInput = await checkout.getNameInput()
	await nameInput.fill('John Doe')

	const emailInput = await checkout.getEmailInput()
	await emailInput.fill('johndoe@example.com')

	const paymentMethodSelect = await checkout.getPaymentMethodSelect()
	expect(await paymentMethodSelect.locator('option').allInnerTexts()).toEqual(paymentMethods)
	await paymentMethodSelect.selectOption({ label: 'Cash on Delivery' })

	await checkout.placeOrderButton.click()
})

const addToCart = async (menu: Menu) => {
	await menu.addMenuItemToCart(0)
	await menu.addMenuItemToCart(1)
	await menu.addMenuItemToCart(1)

	await menu.switchTab('drinks')
	await menu.addMenuItemToCart(0)
	await menu.addMenuItemToCart(1)

	await menu.switchTab('desserts')
	await menu.addMenuItemToCart(0)
}
