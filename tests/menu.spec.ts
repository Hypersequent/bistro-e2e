import { expect, test } from '@playwright/test'
import { Welcome } from './pageobjects/welcome'
import { Menu } from './pageobjects/menu'
import { menuData, MenuItem } from './fixtures/menuData'

const drinksPriceList: MenuItem[] = [
	{ title: 'Cappuccino', price: 4 },
	{ title: 'Iced Coffee', price: 5 },
	{ title: 'Café Latte', price: 4 },
	{ title: 'Espresso', price: 4 },
	{ title: 'Green Tea', price: 3 },
	{ title: 'Lemonade', price: 4 },
]

test('BD-058: Switching tabs reveals the matching category and active state', async ({ page }) => {
	const welcome = new Welcome(page)
	const menu = new Menu(page)

	await welcome.open()

	await expect(menu.tab('pizzas')).toHaveClass(/button--is-active/)
	await expect(menu.panel('pizzas')).toHaveClass(/menu--is-visible/)
	await expect(menu.panel('drinks')).not.toHaveClass(/menu--is-visible/)
	await expect(menu.panel('desserts')).not.toHaveClass(/menu--is-visible/)
	await expect(menu.activeTabs).toHaveCount(1)

	await menu.switchTo('drinks')
	await expect(menu.tab('drinks')).toHaveClass(/button--is-active/)
	await expect(menu.panel('pizzas')).not.toHaveClass(/menu--is-visible/)
	await expect(menu.panel('desserts')).not.toHaveClass(/menu--is-visible/)
	await expect(menu.activeTabs).toHaveCount(1)

	await menu.switchTo('desserts')
	await expect(menu.tab('desserts')).toHaveClass(/button--is-active/)
	await expect(menu.panel('pizzas')).not.toHaveClass(/menu--is-visible/)
	await expect(menu.panel('drinks')).not.toHaveClass(/menu--is-visible/)
	await expect(menu.activeTabs).toHaveCount(1)
})

test('BD-059: Item titles and prices match the menu data per category', async ({ page }) => {
	const welcome = new Welcome(page)
	const menu = new Menu(page)

	await welcome.open()

	expect(await menu.readItems('pizzas')).toEqual(menuData.pizzas)
	expect(await menu.readItems('drinks')).toEqual(drinksPriceList)
	expect(await menu.readItems('desserts')).toEqual(menuData.desserts)
})
