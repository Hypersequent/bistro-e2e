import { Locator, Page } from '@playwright/test'

export type PaymentMethod = 'Cash on Delivery' | 'Card Payment on Delivery'

export class Checkout {
	readonly page: Page
	readonly heading: Locator
	readonly summaryRows: Locator
	readonly total: Locator
	readonly nameInput: Locator
	readonly addressInput: Locator
	readonly paymentSelect: Locator
	readonly placeOrderButton: Locator
	readonly successAlert: Locator
	readonly successHeading: Locator
	readonly successAddress: Locator

	constructor(page: Page) {
		this.page = page
		this.heading = page.getByRole('heading', { name: 'Checkout', exact: true })
		this.summaryRows = page.locator('table tbody tr')
		this.total = page.locator('[data-testid="cartTotal"]')
		this.nameInput = page.locator('#customerName')
		this.addressInput = page.locator('#customerAddress')
		this.paymentSelect = page.locator('#paymentMethod')
		this.placeOrderButton = page.getByRole('button', { name: 'Place Order' })
		this.successAlert = page.locator('.alert-success')
		this.successHeading = this.successAlert.locator('h4.alert-heading')
		this.successAddress = this.successAlert.locator('div.address')
	}

	summaryRow(title: string): Locator {
		return this.summaryRows.filter({ hasText: title })
	}

	async placeOrder(name: string, address: string, paymentMethod: PaymentMethod) {
		await this.nameInput.fill(name)
		await this.addressInput.fill(address)
		await this.paymentSelect.selectOption({ label: paymentMethod })
		await this.placeOrderButton.click()
	}
}
