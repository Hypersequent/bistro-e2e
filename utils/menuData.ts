/**
 * Menu data reference — mirrors `food-delivery-demo/docs/CONTEXT.md` §5
 * (source of truth: the app's `src/lib/items.ts`). 18 items, 6 per category.
 */
export interface MenuItem {
	title: string
	price: string
}

export const PIZZAS: MenuItem[] = [
	{ title: 'Cheese Pizza', price: '$15' },
	{ title: 'Hot Pastrami', price: '$25' },
	{ title: 'Classic Pizza', price: '$20' },
	{ title: 'Country Pizza', price: '$17' },
	{ title: 'Veggie Delight', price: '$18' },
	{ title: 'BBQ Chicken', price: '$22' },
]

export const DRINKS: MenuItem[] = [
	{ title: 'Cappuccino', price: '$4' },
	{ title: 'Iced Coffee', price: '$5' },
	{ title: 'Café Latte', price: '$3' },
	{ title: 'Espresso', price: '$4' },
	{ title: 'Green Tea', price: '$3' },
	{ title: 'Lemonade', price: '$4' },
]

export const DESSERTS: MenuItem[] = [
	{ title: 'Crème Brûlée', price: '$16' },
	{ title: 'Tarte Tatin', price: '$12' },
	{ title: 'Macarons', price: '$10' },
	{ title: 'Chocolate Soufflé', price: '$20' },
	{ title: 'Cheesecake', price: '$14' },
	{ title: 'Apple Pie', price: '$15' },
]

export const titles = (items: MenuItem[]) => items.map((item) => item.title)
export const prices = (items: MenuItem[]) => items.map((item) => item.price)
