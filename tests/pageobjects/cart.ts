import { expect, Locator, Page } from '@playwright/test'

export class Cart {
	readonly page: Page
	readonly icon: Locator
	readonly badge: Locator
	readonly modal: Locator
	readonly lines: Locator
	readonly total: Locator
	readonly emptyMessage: Locator
	readonly closeButton: Locator
	readonly checkoutLink: Locator

	constructor(page: Page) {
		this.page = page
		this.icon = page.locator('.my-cart-icon')
		this.badge = page.locator('.my-cart-badge')
		this.modal = page.locator('#cart')
		this.lines = this.modal.locator('.modal-body .row.border-bottom')
		this.total = this.modal.locator('[data-testid="cartTotal"]')
		this.emptyMessage = this.modal.getByText('No items in your cart')
		this.closeButton = this.modal.locator('.modal-footer button', { hasText: 'Close' })
		this.checkoutLink = this.modal.getByRole('link', { name: 'Checkout' })
	}

	async open() {
		// On mount the app schedules a hide of #cart that lands ~200ms later; opening
		// before it fires closes the modal and leaves it stuck. Wait for that timer
		// (it sets an inline display:none) before clicking.
		await this.page.waitForFunction(() => {
			const modal = document.querySelector<HTMLElement>('#cart')
			return modal?.style.display === 'none'
		})
		await this.icon.click()
		await expect(this.modal).toBeVisible()
	}

	async close() {
		await this.closeButton.click()
		await expect(this.modal).toBeHidden()
	}

	line(title: string): Locator {
		return this.lines.filter({ hasText: title })
	}

	lineTotal(title: string): Locator {
		return this.line(title).locator('div.col').first()
	}

	quantityInput(title: string): Locator {
		return this.line(title).locator('input[type="number"]')
	}

	async setQuantity(title: string, quantity: string) {
		const input = this.quantityInput(title)
		await input.fill(quantity)
		await input.blur()
	}

	async setRawQuantity(title: string, value: string) {
		await this.quantityInput(title).evaluate((input, raw) => {
			;(input as HTMLInputElement).value = raw
			input.dispatchEvent(new Event('change', { bubbles: true }))
		}, value)
	}

	async removeLine(title: string) {
		await this.line(title).locator('button.btn-danger').click()
	}

	async goToCheckout() {
		await this.checkoutLink.click()
		await this.page.waitForURL(/\/checkout\/?$/)
	}
}
