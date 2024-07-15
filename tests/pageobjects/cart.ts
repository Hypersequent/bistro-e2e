import { Locator, Page } from '@playwright/test'
import { z } from 'zod'
import { PriceSchema } from './menu'

export class Cart {
	page: Page
	cartButton: Locator
	closeCartButton: Locator
	checkoutButton: Locator

	constructor(page: Page) {
		this.page = page
		this.cartButton = page.locator(`div.my-cart-icon`)
		this.closeCartButton = page.locator(`#cart button[data-dismiss="modal"]`).first()
		this.checkoutButton = page.locator(`#cart a[href$="/checkout"]`)
	}

	async openCart() {
		await this.cartButton.click()
	}

	async closeCart() {
		await this.closeCartButton.click()
	}

	async checkout() {
		await this.checkoutButton.click()
		await this.page.waitForURL(process.env.DEMO_BASE_URL + 'checkout')
	}

	async getCartItems() {
		const rows = await this.page.locator(`#cart div.row.border-bottom`).all()

		const items = await Promise.all(
			rows.map(async (row) => {
				const name = await row.locator('div:nth-child(2)').innerText()
				const amount = await row.locator('div:nth-child(4)').innerText()

				return { name, amount }
			})
		)

		const total = await this.page.locator(`#cart div[data-testid='cartTotal']`).innerText()

		return CartResponseSchema.parse({
			items,
			total,
		})
	}

	async removeCartItem(idx: number) {
		const rows = await this.page.locator(`#cart div.row.border-bottom`).all()
		if (idx >= rows.length) {
			throw new Error(`Cart item with index ${idx} not found`)
		}
		await rows[idx].locator('button').click()
	}
}

export const CartItemSchema = z.object({
	name: z.string().min(1),
	amount: PriceSchema,
})

export const CartResponseSchema = z.object({
	items: z.array(CartItemSchema),
	total: PriceSchema,
})
