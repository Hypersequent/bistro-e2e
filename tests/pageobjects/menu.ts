import { expect, Locator, Page } from '@playwright/test'

export type Tab = 'pizza' | 'drinks' | 'desserts'

export class Menu {
	page: Page
	navbarItems: Locator

	constructor(page: Page) {
		this.page = page
		this.navbarItems = page.locator('nav ul > li')
	}

	async goto() {
		await this.page.goto(process.env.DEMO_BASE_URL)
	}

	async getNavbarItems() {
		const items = await this.navbarItems.all()
		expect(items).toHaveLength(3)

		const linkItemsObj = await Promise.all(
			items.map(async (item) => {
				const text = (await item.innerText()).trim()
				const isActive = (await item.getAttribute('class')) === 'active'

				return {
					text,
					isActive,
				}
			})
		)

		return linkItemsObj
	}

	async switchTab(tab: Tab) {
		await this.page.locator(`a[data-taget='${tab}Menu']`).click()
	}

	async getPizzaMenu() {
		this.page.locator(`section#menu > div > div.menu`)
	}
}
