import { expect, Locator, Page } from '@playwright/test'

export class Cart {
	readonly page: Page
	readonly icon: Locator
	readonly badge: Locator
	readonly modal: Locator
	/** One row per cart line inside the "My cart" modal. */
	readonly lines: Locator
	readonly total: Locator
	readonly checkoutButton: Locator

	constructor(page: Page) {
		this.page = page
		this.icon = page.locator('.my-cart-icon')
		this.badge = page.locator('.my-cart-badge')
		this.modal = page.locator('#cart')
		this.lines = this.modal.locator('.row.border-bottom')
		this.total = this.modal.locator('[data-testid="cartTotal"]')
		this.checkoutButton = this.modal.locator('a[href$="/checkout"]')
	}

	/**
	 * Opens the "My cart" modal. The icon click can race the Bootstrap fade
	 * transition and wedge the modal half-toggled (`show` class while
	 * `display: none`) — the previous suite papered over this with a 1s sleep.
	 * Instead, retry without sleeps: if the modal wedges, reload (the cart
	 * itself persists in localStorage) and toggle it again.
	 *
	 * NB: in tests using seedKnownOrder, the reload re-applies the seed and
	 * discards in-test cart mutations — only call open() before mutating the
	 * cart in those tests.
	 */
	async open() {
		await expect(async () => {
			if (!(await this.modal.isVisible())) {
				const wedged = await this.modal.evaluate((el) => el.classList.contains('show'))
				if (wedged) {
					await this.page.reload()
				}
				await this.icon.click()
			}
			await expect(this.modal).toBeVisible({ timeout: 1500 })
		}).toPass({ timeout: 20_000 })
	}

	line(title: string): Locator {
		return this.lines.filter({ hasText: title })
	}

	quantityInput(title: string): Locator {
		return this.line(title).locator('input[type="number"]')
	}

	/** The line-total cell (first plain `.col` in the row). */
	lineTotal(title: string): Locator {
		return this.line(title).locator('div.col').first()
	}

	removeButton(title: string): Locator {
		return this.line(title).getByRole('button', { name: 'X' })
	}

	/**
	 * Sets a line quantity. The app commits quantity edits on the `change`
	 * event, so blur after filling to fire it (like a user clicking away).
	 */
	async setQuantity(title: string, value: string) {
		const input = this.quantityInput(title)
		await input.fill(value)
		await input.blur()
	}

	async checkout() {
		// Re-open the modal if the fade-transition race closed it (see open()).
		await expect(async () => {
			if (!(await this.checkoutButton.isVisible())) {
				await this.open()
			}
			await this.checkoutButton.click({ timeout: 2000 })
		}).toPass({ timeout: 15_000 })
		await this.page.waitForURL(process.env.DEMO_BASE_URL + '/checkout')
	}
}
