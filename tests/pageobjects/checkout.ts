import { Locator, Page } from '@playwright/test'

export type PaymentMethod = 'Cash on Delivery' | 'Card Payment on Delivery'

export class Checkout {
	readonly page: Page
	readonly nameInput: Locator
	readonly addressInput: Locator
	readonly paymentSelect: Locator
	readonly placeOrderButton: Locator
	/** Order-summary table rows (item lines + the Total row). */
	readonly summaryRows: Locator
	readonly total: Locator
	readonly successAlert: Locator
	readonly successHeading: Locator

	constructor(page: Page) {
		this.page = page
		this.nameInput = page.locator('#customerName')
		this.addressInput = page.locator('#customerAddress')
		this.paymentSelect = page.locator('#paymentMethod')
		this.placeOrderButton = page.getByRole('button', { name: 'Place Order' })
		this.summaryRows = page.locator('form table tbody tr')
		this.total = page.locator('[data-testid="cartTotal"]')
		this.successAlert = page.locator('.alert-success')
		this.successHeading = this.successAlert.locator('.alert-heading')
	}

	summaryRow(title: string): Locator {
		return this.summaryRows.filter({ hasText: title })
	}

	/** The Count cell of an order-summary row. */
	rowCount(title: string): Locator {
		return this.summaryRow(title).locator('td').nth(2)
	}

	/** The Total Price cell of an order-summary row. */
	rowTotal(title: string): Locator {
		return this.summaryRow(title).locator('td').nth(3)
	}
}
