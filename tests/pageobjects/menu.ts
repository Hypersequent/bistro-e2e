import { Locator, Page } from '@playwright/test'

export type CategoryTab = 'Pizzas' | 'Drinks' | 'Desserts'

export class Menu {
	readonly page: Page
	readonly section: Locator
	readonly pizzasPanel: Locator
	readonly drinksPanel: Locator
	readonly dessertsPanel: Locator
	/** The currently revealed category panel (`menu--is-visible`). */
	readonly visiblePanel: Locator
	readonly visibleItems: Locator
	readonly visibleItemTitles: Locator
	readonly visibleItemPrices: Locator

	constructor(page: Page) {
		this.page = page
		this.section = page.locator('#menu')
		this.pizzasPanel = page.locator('#pizzaMenu')
		this.drinksPanel = page.locator('#drinksMenu')
		this.dessertsPanel = page.locator('#dessertsMenu')
		this.visiblePanel = page.locator('#menu .menu--is-visible')
		this.visibleItems = this.visiblePanel.locator('.item')
		this.visibleItemTitles = this.visiblePanel.locator('.item__title')
		this.visibleItemPrices = this.visiblePanel.locator('.item__price')
	}

	tab(name: CategoryTab): Locator {
		return this.page.locator('.buttons-container').getByRole('button', { name, exact: true })
	}

	async switchTo(name: CategoryTab) {
		await this.tab(name).click()
	}

	itemCard(title: string): Locator {
		return this.visibleItems.filter({
			has: this.page.locator('.item__title', { hasText: title }),
		})
	}

	async addToCart(title: string) {
		await this.itemCard(title).getByRole('button', { name: 'Add to cart' }).click()
	}
}
