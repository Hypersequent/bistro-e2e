import { expect, Locator, Page } from '@playwright/test'
import { CartEntry } from '../fixtures/menuData'

export class Welcome {
	readonly page: Page
	readonly brandLink: Locator
	readonly welcomeLink: Locator
	readonly menuLink: Locator
	readonly aboutLink: Locator
	readonly heroHeading: Locator
	readonly menuSection: Locator

	constructor(page: Page) {
		this.page = page
		this.brandLink = page.locator('a.navbar-brand')
		this.welcomeLink = page.getByRole('link', { name: 'Welcome', exact: true })
		this.menuLink = page.getByRole('link', { name: "Today's Menu", exact: true })
		this.aboutLink = page.getByRole('link', { name: 'About us', exact: true })
		this.heroHeading = page.getByRole('heading', { name: 'Bistro Delivery', exact: true })
		this.menuSection = page.locator('#menu')
	}

	async open() {
		await this.page.goto('.')
		await this.waitUntilReady()
	}

	/**
	 * The page is prerendered, so the markup is there before the handlers are.
	 * The tab script marks the pizza panel visible as soon as it runs.
	 */
	async waitUntilReady() {
		await expect(this.page.locator('#pizzaMenu')).toHaveClass(/menu--is-visible/)
	}

	async seedCart(entries: CartEntry[]) {
		await this.page.evaluate(
			(items) => localStorage.setItem('cart', JSON.stringify(items)),
			entries
		)
		await this.page.reload()
		await this.waitUntilReady()
	}

	async readStoredCart(): Promise<CartEntry[]> {
		const raw = await this.page.evaluate(() => localStorage.getItem('cart'))
		return JSON.parse(raw ?? '[]')
	}
}
