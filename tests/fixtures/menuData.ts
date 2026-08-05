export type MenuItem = {
	title: string
	price: number
}

export type Category = 'pizzas' | 'drinks' | 'desserts'

export const menuData: Record<Category, MenuItem[]> = {
	pizzas: [
		{ title: 'Cheese Pizza', price: 15 },
		{ title: 'Hot Pastrami', price: 25 },
		{ title: 'Classic Pizza', price: 20 },
		{ title: 'Country Pizza', price: 17 },
		{ title: 'Veggie Delight', price: 18 },
		{ title: 'BBQ Chicken', price: 22 },
	],
	drinks: [
		{ title: 'Cappuccino', price: 4 },
		{ title: 'Iced Coffee', price: 5 },
		{ title: 'Café Latte', price: 3 },
		{ title: 'Espresso', price: 4 },
		{ title: 'Green Tea', price: 3 },
		{ title: 'Lemonade', price: 4 },
	],
	desserts: [
		{ title: 'Crème Brûlée', price: 16 },
		{ title: 'Tarte Tatin', price: 12 },
		{ title: 'Macarons', price: 10 },
		{ title: 'Chocolate Soufflé', price: 20 },
		{ title: 'Cheesecake', price: 14 },
		{ title: 'Apple Pie', price: 15 },
	],
}

export type CartEntry = {
	id: string
	quantity: number
}

/** SP-2 — the known order: Cheese Pizza ×1, Hot Pastrami ×2, Cappuccino ×1 ($69). */
export const knownOrder: CartEntry[] = [
	{ id: 'p1', quantity: 1 },
	{ id: 'p2', quantity: 2 },
	{ id: 'd1', quantity: 1 },
]

export const knownOrderTotal = 69
