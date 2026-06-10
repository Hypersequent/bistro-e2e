import { Locator, Page } from '@playwright/test'

export type NavLinkName = 'Welcome' | "Today's Menu" | 'About us'

export class Welcome {
	readonly page: Page
	readonly heroHeading: Locator

	constructor(page: Page) {
		this.page = page
		this.heroHeading = page.locator('.hero1 h1')
	}

	navLink(name: NavLinkName): Locator {
		return this.page.locator('nav').getByRole('link', { name, exact: true })
	}
}
