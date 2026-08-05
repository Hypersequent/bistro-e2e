import { Locator, Page } from '@playwright/test'

export class About {
	readonly page: Page
	readonly heading: Locator

	constructor(page: Page) {
		this.page = page
		this.heading = page.getByRole('heading', { name: 'Welcome to Bistro Delivery', exact: true })
	}

	async open() {
		await this.page.goto('about')
	}
}
