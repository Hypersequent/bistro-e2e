import { expect, Locator, Page } from '@playwright/test'

export class Welcome {
	page: Page
	heading: Locator
	body: Locator
	navbarItems: Locator
	gotoMenuButton: Locator

	constructor(page: Page) {
		this.page = page
		this.heading = page.locator('h1')
		this.body = page.locator('div.hero1 p')
		this.navbarItems = page.locator('nav ul > li')
		this.gotoMenuButton = page.locator('a[href="#menu"]')
	}

	async goto() {
		await this.page.goto(process.env.DEMO_BASE_URL)
	}

	async getHeading() {
		return (await this.heading.innerText()).trim()
	}

	async getBody() {
		return (await this.body.innerText()).trim()
	}

	async getNavbarItems() {
		const items = await this.navbarItems.all()
		expect(items).toHaveLength(3)

		const linkItemsObj = await Promise.all(
			items.map(async (item) => {
				const text = (await item.innerText()).trim()
				const isActive = (await item.getAttribute('class'))?.includes('active') ?? false

				return {
					text,
					isActive,
				}
			})
		)

		return linkItemsObj
	}

	async getGotoMenuButton() {
		return (await this.gotoMenuButton.innerText()).trim()
	}
}
