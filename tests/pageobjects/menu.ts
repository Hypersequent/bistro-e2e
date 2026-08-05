import { expect, Locator, Page } from '@playwright/test'
import { Category, MenuItem } from '../fixtures/menuData'

const panelIds: Record<Category, string> = {
	pizzas: 'pizzaMenu',
	drinks: 'drinksMenu',
	desserts: 'dessertsMenu',
}

const tabNames: Record<Category, string> = {
	pizzas: 'Pizzas',
	drinks: 'Drinks',
	desserts: 'Desserts',
}

export class Menu {
	readonly page: Page
	readonly activeTabs: Locator

	constructor(page: Page) {
		this.page = page
		this.activeTabs = page.locator('.buttons-container a.button--is-active')
	}

	tab(category: Category): Locator {
		return this.page.locator(`a.button[data-target="${panelIds[category]}"]`, {
			hasText: tabNames[category],
		})
	}

	panel(category: Category): Locator {
		return this.page.locator(`#${panelIds[category]}`)
	}

	async switchTo(category: Category) {
		await this.tab(category).click()
		await expect(this.panel(category)).toHaveClass(/menu--is-visible/)
	}

	card(category: Category, title: string): Locator {
		return this.panel(category)
			.locator('.item')
			.filter({
				has: this.page.getByRole('heading', { name: title, exact: true }),
			})
	}

	async addToCart(category: Category, title: string, times = 1) {
		await this.switchTo(category)
		const button = this.card(category, title).locator('.my-cart-btn')
		for (let i = 0; i < times; i++) {
			await button.click()
		}
	}

	async readItems(category: Category): Promise<MenuItem[]> {
		await this.switchTo(category)
		const panel = this.panel(category)
		const titles = await panel.locator('h3.item__title').allTextContents()
		const prices = await panel.locator('span.item__price').allTextContents()

		return titles.map((title, index) => ({
			title: title.trim(),
			price: Number(prices[index].replace('$', '')),
		}))
	}
}
