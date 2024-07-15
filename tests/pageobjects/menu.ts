import { expect, Locator, Page } from '@playwright/test'
import { z } from 'zod'

export type Tab = 'pizza' | 'drinks' | 'desserts'

export class Menu {
	page: Page
	navbarItems: Locator
	tab: Locator

	constructor(page: Page) {
		this.page = page
		this.navbarItems = page.locator('nav ul > li')
		this.tab = page.locator(`div.buttons-container`)
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
				const isActive = (await item.getAttribute('class'))?.includes('active') ?? false

				return {
					text,
					isActive,
				}
			})
		)

		return linkItemsObj
	}

	async getTabs() {
		const children = await this.tab.locator('a').all()

		const tabs = await Promise.all(
			children.map(async (child) => {
				const text = (await child.innerText()).trim()
				const isActive = ((await child.getAttribute('class')) || '').includes('is-active')

				return { text, isActive }
			})
		)

		return tabs
	}

	async switchTab(tab: Tab) {
		await this.page.locator(`a[data-target='${tab}Menu']`).click()
	}

	async getPizzaMenu() {
		await this.switchTab('pizza')
		const items = await this.page.evaluate(getPizzaItems)
		return PizzaMenuSchema.parse(items)
	}

	async getOtherMenu(item: 'drinks' | 'desserts') {
		await this.switchTab(item)
		const items = await this.page.evaluate(getOtherItems)
		return OtherMenuSchema.parse(items)
	}

	async addMenuItemToCart(idx: number) {
		const item = this.page.locator(
			`section#menu > div > div.menu--is-visible > div.row:nth-of-type(${idx + 1})`
		)
		await item.locator('button').click()
	}
}

export const PriceSchema = z
	.string()
	.regex(/^\$\d+$/)
	.transform((val) => Number.parseInt(val.slice(1), 10))

export const PizzaItemSchema = z.object({
	name: z.string().min(1),
	image: z.string().min(1),
	description: z.string().min(1),
	price: PriceSchema,
})

export const PizzaMenuSchema = z.array(PizzaItemSchema).min(1)

function getPizzaItems() {
	const items = Array.from(
		document.querySelectorAll(`section#menu > div > div.menu--is-visible > div.row`)
	)

	return items.map((item) => {
		const name = item.querySelector('h3.item__title')?.textContent || ''
		const price = item.querySelector('span.item__price')?.textContent || ''
		const description = item.querySelector('p.item__description')?.textContent || ''
		const image = item.querySelector('img')?.getAttribute('src') || ''

		return {
			name,
			image,
			description,
			price,
		}
	})
}

export const OtherItemSchema = z.object({
	name: z.string().min(1),
	description: z.string().min(1),
	price: PriceSchema,
})

export const OtherMenuSchema = z.array(OtherItemSchema).min(1)

function getOtherItems() {
	const items = Array.from(
		document.querySelectorAll(`section#menu > div > div.menu--is-visible > div.row`)
	)

	return items.map((item) => {
		const name = item.querySelector('h3.item__title')?.textContent || ''
		const price = item.querySelector('span.item__price')?.textContent || ''
		const description = item.querySelector('p.item__description')?.textContent || ''

		return {
			name,
			description,
			price,
		}
	})
}
