import { Locator, Page } from '@playwright/test'

export class About {
	readonly page: Page
	readonly heading: Locator

	constructor(page: Page) {
		this.page = page
		this.heading = page.locator('h1')
	}
}
