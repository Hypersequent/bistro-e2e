import { Locator, Page, expect } from '@playwright/test'
import { CartResponseSchema } from './cart'

export const paymentMethods = ['Cash on Delivery', 'Card Payment on Delivery']

export class Checkout {
	page: Page
	nameInput: Locator
	emailInput: Locator
	paymentMethodSelect: Locator
	placeOrderButton: Locator

	constructor(page: Page) {
		this.page = page
		this.nameInput = page.locator(`#customerName`)
		this.emailInput = page.locator(`#customerAddress`)
		this.paymentMethodSelect = page.locator(`#paymentMethod`)
		this.placeOrderButton = page.locator(`form button[type="submit"]`)
	}

	async getOrderItems() {
		expect(this.page.url()).toBe(process.env.DEMO_BASE_URL + 'checkout')
		await new Promise((resolve) => setTimeout(resolve, 500))

		const rows = await this.page.locator(`table > tbody > tr`).all()

		const items = await Promise.all(
			rows.slice(0, rows.length - 1).map(async (row) => {
				const name = await row.locator('td:nth-child(2)').innerText()
				const amount = await row.locator('td:nth-child(4)').innerText()

				return { name, amount }
			})
		)

		const total = await this.page
			.locator(`table.table > tbody > tr:last-of-type td:nth-child(4)`)
			.innerText()

		return CartResponseSchema.parse({
			items,
			total,
		})
	}

	async getNameInput() {
		return this.nameInput
	}

	async getEmailInput() {
		return this.emailInput
	}

	async getPaymentMethodSelect() {
		return this.paymentMethodSelect
	}
}
