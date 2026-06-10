import { expect, Page } from '@playwright/test'
import { Cart } from '../tests/pageobjects/cart'

/** Shape the app persists under the `cart` localStorage key. */
export interface CartItem {
	id: string
	quantity: number
}

/**
 * SP-2 known order (MANUAL.md §4) — Cheese Pizza (p1) ×1, Hot Pastrami (p2) ×2,
 * Cappuccino (d1) ×1 → badge 4, cart total $69.
 */
export const KNOWN_ORDER: CartItem[] = [
	{ id: 'p1', quantity: 1 },
	{ id: 'p2', quantity: 2 },
	{ id: 'd1', quantity: 1 },
]

/**
 * SP-1 — App open with an empty cart: open the app, clear the persisted `cart`
 * key, reload, and confirm the badge reads 0 (deterministic starting state).
 */
export async function openWithEmptyCart(page: Page) {
	await page.goto(process.env.DEMO_BASE_URL + '/')
	await page.evaluate(() => localStorage.removeItem('cart'))
	await page.reload()
	await expect(new Cart(page).badge).toHaveText('0')
}

/**
 * SP-2 (seeded variant, AUTOMATED.md §10.5) — registers an init script that
 * writes the known order to `localStorage` before every page load, so a plain
 * `page.reload()` re-applies the precondition deterministically.
 */
export async function seedKnownOrder(page: Page) {
	await page.addInitScript((cart) => {
		localStorage.setItem('cart', JSON.stringify(cart))
	}, KNOWN_ORDER)
}

/** Reads and parses the persisted cart. */
export async function readStoredCart(page: Page): Promise<CartItem[]> {
	return page.evaluate(() => JSON.parse(localStorage.getItem('cart') ?? '[]'))
}
