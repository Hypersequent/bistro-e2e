# Bistro Delivery — Automated Test Plan

|                            |                                                           |
| -------------------------- | --------------------------------------------------------- |
| **Document**               | Automated test cases + Playwright/qas-cli automation spec |
| **Version**                | 1.0                                                       |
| **Last updated**           | 2026-05-26                                                |
| **Application under test** | https://hypersequent.github.io/bistro/                    |
| **Project code**           | `BD`                                                      |
| **Behavioural reference**  | [`docs/CONTEXT.md`](./CONTEXT.md)                         |
| **Requirements**           | [`docs/REQUIREMENTS.md`](./REQUIREMENTS.md)               |
| **Manual counterpart**     | [`docs/MANUAL.md`](./MANUAL.md)                           |

This file plans the **15 automated test cases** (`BD-057…BD-071`). They live in the **same QA Sphere
folders** as the manual cases and reuse the **same shared preconditions** (`SP-1/2/3`) and
**shared steps** (`SS-1/2/3`) defined in [`MANUAL.md`](./MANUAL.md) §4–§5. Each case is written with
manual-runnable steps so it can also be executed by hand; the difference is the `automated` tag, the
`Automation = Automated` custom field, and the **§8 implementation spec** that makes the Playwright
tests uploadable to QA Sphere via [`qas-cli`](https://github.com/Hypersequent/qas-cli).

These were prioritised for automation per `CONTEXT.md` §10: deterministic, assertion-rich behaviour
(cart math, quantity rules, checkout flow, persistence, routing) rather than visual/animation polish.

---

## 1. Conventions

Same as `MANUAL.md` §1, with these specifics for automated cases:

- **IDs** — `BD-057 … BD-071`.
- **Automation (custom field)** — `Automated` on every case here.
- **Tags** — feature + lifecycle tags **plus `automated`**.
- **Automated as** — each case names its Playwright spec file and the exact `test(...)` title. The
  title embeds the `BD-###` marker so qas-cli can match the result to the case (see §8).
- **Precondition / steps** — reference the shared entities from `MANUAL.md`; §8 explains how each is
  realised in code (UI actions and/or `localStorage` seeding) deterministically.

> **Scope:** this document is the plan + automation spec. The actual `.spec.ts` files are not part of
> this deliverable — §8 specifies them precisely (files, titles, config, upload) for implementation.

---

## 2. Folder placement

Automated cases share the manual folders (`MANUAL.md` §3):

```
Navigation & Layout/                 BD-057
Menu/                                BD-058, BD-059
Cart/                                BD-060, BD-061, BD-062
   └─ Quantity & Removal/            BD-063, BD-064, BD-065
Checkout/                            BD-066, BD-067
   └─ Order Placement/               BD-068, BD-069, BD-070
Persistence/                         BD-071
```

---

## 3. Navigation & Layout

#### BD-057 · Navbar links navigate to the correct routes

- **Folder:** `Navigation & Layout`
- **Requirement:** [NAV: Navbar links route correctly](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#nav-navbar-links-route-correctly)
- **Tags:** `navigation`, `automated`, `regression`
- **Priority:** High
- **Automation:** Automated
- **Automated as:** `tests/navigation.spec.ts` → `test('BD-057: Navbar links navigate to the correct routes', …)`
- **Precondition:** SP-1 — App open with an empty cart
- **Steps:**

  | #   | Action                 | Expected result                                                         |
  | --- | ---------------------- | ----------------------------------------------------------------------- |
  | 1   | Click **Welcome**      | URL is `/bistro/`; hero heading "Bistro Delivery" is visible            |
  | 2   | Click **About us**     | URL is `/bistro/about`; heading "Welcome to Bistro Delivery" is visible |
  | 3   | Click **Today's Menu** | The menu section is in view on the home page                            |

## 4. Menu

#### BD-058 · Switching tabs reveals the matching category and active state

- **Folder:** `Menu`
- **Requirement:** [TABS: Tabs reveal and mark categories](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#tabs-tabs-reveal-and-mark-categories)
- **Tags:** `menu`, `automated`, `regression`
- **Priority:** High
- **Automation:** Automated
- **Automated as:** `tests/menu.spec.ts` → `test('BD-058: Switching tabs reveals the matching category and active state', …)`
- **Precondition:** SP-1 — App open with an empty cart
- **Steps:**

  | #   | Action                   | Expected result                                                           |
  | --- | ------------------------ | ------------------------------------------------------------------------- |
  | 1   | Assert the default state | `Pizzas` tab has `button--is-active`; `#pizzaMenu` has `menu--is-visible` |
  | 2   | Click **Drinks**         | `#drinksMenu` becomes visible and the Drinks tab is active; pizzas hidden |
  | 3   | Click **Desserts**       | `#dessertsMenu` becomes visible and the Desserts tab is active            |

#### BD-059 · Item titles and prices match the menu data per category

- **Folder:** `Menu`
- **Requirement:** [CARD: Menu cards show item details](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#card-menu-cards-show-item-details)
- **Tags:** `menu`, `automated`, `regression`
- **Priority:** High
- **Automation:** Automated
- **Automated as:** `tests/menu.spec.ts` → `test('BD-059: Item titles and prices match the menu data per category', …)`
- **Precondition:** SP-1 — App open with an empty cart
- **Steps:**

  | #   | Action                   | Expected result                                                                                                                                     |
  | --- | ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
  | 1   | Read all Pizzas cards    | Six items; titles/prices match data (Cheese Pizza $15, Hot Pastrami $25, Classic Pizza $20, Country Pizza $17, Veggie Delight $18, BBQ Chicken $22) |
  | 2   | Read Drinks and Desserts | Six items each; titles/prices match the data table in `CONTEXT.md` §5                                                                               |

## 5. Cart

#### BD-060 · Add-to-cart increments the badge by total quantity

- **Folder:** `Cart`
- **Requirement:** [BADGE: Cart badge shows total quantity](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#badge-cart-badge-shows-total-quantity)
- **Tags:** `cart`, `automated`, `regression`
- **Priority:** High
- **Automation:** Automated
- **Automated as:** `tests/cart.spec.ts` → `test('BD-060: Add-to-cart increments the badge by total quantity', …)`
- **Precondition:** SP-1 — App open with an empty cart
- **Steps:**

  | #   | Action                               | Expected result                       |
  | --- | ------------------------------------ | ------------------------------------- |
  | 1   | Add Cheese Pizza ×1, Hot Pastrami ×2 | `.my-cart-badge` reads **3**          |
  | 2   | Add Cappuccino ×1                    | Badge reads **4** (sum of quantities) |

#### BD-061 · Adding the same item twice yields one line with quantity 2

- **Folder:** `Cart`
- **Requirement:** [ADD: Add items to cart](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#add-add-items-to-cart)
- **Tags:** `cart`, `automated`, `regression`
- **Priority:** Critical
- **Automation:** Automated
- **Automated as:** `tests/cart.spec.ts` → `test('BD-061: Adding the same item twice yields one line with quantity 2', …)`
- **Precondition:** SP-1 — App open with an empty cart
- **Steps:**

  | #   | Action                                | Expected result                                       |
  | --- | ------------------------------------- | ----------------------------------------------------- |
  | 1   | Add Cheese Pizza twice; open the cart | A single Cheese Pizza line exists with quantity **2** |
  | 2   | Read the line total                   | Line total is `$30` (15×2)                            |

#### BD-062 · Line totals and cart total compute correctly

- **Folder:** `Cart`
- **Requirement:** [TOTAL: Totals calculate correctly](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#total-totals-calculate-correctly)
- **Tags:** `cart`, `automated`, `regression`
- **Priority:** Critical
- **Automation:** Automated
- **Automated as:** `tests/cart.spec.ts` → `test('BD-062: Line totals and cart total compute correctly', …)`
- **Precondition:** SP-2 — Cart preloaded with a known order
- **Steps:**

  | #   | Action                           | Expected result                                                      |
  | --- | -------------------------------- | -------------------------------------------------------------------- |
  | 1   | Open the cart                    | Line totals: Cheese Pizza `$15`, Hot Pastrami `$50`, Cappuccino `$4` |
  | 2   | Read `[data-testid="cartTotal"]` | Total is **$69** (sum of line totals)                                |

## 6. Cart / Quantity & Removal

#### BD-063 · Setting a quantity greater than zero updates totals

- **Folder:** `Cart/Quantity & Removal`
- **Requirement:** [QTY: Quantity edits update totals](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#qty-quantity-edits-update-totals)
- **Tags:** `cart`, `automated`, `regression`
- **Priority:** High
- **Automation:** Automated
- **Automated as:** `tests/quantity.spec.ts` → `test('BD-063: Setting a quantity greater than zero updates totals', …)`
- **Precondition:** SP-2 — Cart preloaded with a known order
- **Steps:**

  | #   | Action                                               | Expected result                        |
  | --- | ---------------------------------------------------- | -------------------------------------- |
  | 1   | Open the cart and set Cheese Pizza quantity to **3** | Cheese Pizza line total becomes `$45`  |
  | 2   | Read the cart total                                  | Total updates to **$99** (45 + 50 + 4) |

#### BD-064 · Quantity 0 / empty / non-numeric removes the item

- **Folder:** `Cart/Quantity & Removal`
- **Requirement:** [ZERO: Invalid quantities remove items](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#zero-invalid-quantities-remove-items)
- **Tags:** `cart`, `automated`, `edge-case`
- **Priority:** High
- **Automation:** Automated
- **Automated as:** `tests/quantity.spec.ts` → `test('BD-064: Quantity 0, empty or non-numeric removes the item', …)`
- **Precondition:** SP-2 — Cart preloaded with a known order
- **Steps:**

  | #   | Action                                                | Expected result                                      |
  | --- | ----------------------------------------------------- | ---------------------------------------------------- |
  | 1   | Set Cappuccino quantity to **0**                      | The Cappuccino line is removed; total drops to `$65` |
  | 2   | Reset (SP-2), clear the Hot Pastrami quantity (empty) | The line is removed (empty → 0)                      |
  | 3   | Reset (SP-2), type `abc` into a quantity              | The line is removed (non-numeric → 0)                |

#### BD-065 · The remove (X) button deletes the line

- **Folder:** `Cart/Quantity & Removal`
- **Requirement:** [REMOVE: Remove button deletes a line](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#remove-remove-button-deletes-a-line)
- **Tags:** `cart`, `automated`, `regression`
- **Priority:** High
- **Automation:** Automated
- **Automated as:** `tests/quantity.spec.ts` → `test('BD-065: The remove (X) button deletes the line', …)`
- **Precondition:** SP-2 — Cart preloaded with a known order
- **Steps:**

  | #   | Action                                                 | Expected result                  |
  | --- | ------------------------------------------------------ | -------------------------------- |
  | 1   | Open the cart and click **X** on the Hot Pastrami line | The line is removed              |
  | 2   | Read the total and badge                               | Total is `$19`; badge drops by 2 |

## 7. Checkout

#### BD-066 · Empty-cart direct navigation to checkout redirects home

- **Folder:** `Checkout`
- **Requirement:** [GUARD: Checkout requires a non-empty cart](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#guard-checkout-requires-a-non-empty-cart)
- **Tags:** `checkout`, `automated`, `edge-case`
- **Priority:** High
- **Automation:** Automated
- **Automated as:** `tests/checkout.spec.ts` → `test('BD-066: Empty-cart direct navigation to checkout redirects home', …)`
- **Precondition:** SP-1 — App open with an empty cart
- **Steps:**

  | #   | Action                                             | Expected result                            |
  | --- | -------------------------------------------------- | ------------------------------------------ |
  | 1   | `page.goto('/bistro/checkout')` with an empty cart | The app redirects; final URL is `/bistro/` |

#### BD-067 · Order summary matches the cart

- **Folder:** `Checkout`
- **Requirement:** [SUMMARY: Checkout summary matches cart](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#summary-checkout-summary-matches-cart)
- **Tags:** `checkout`, `automated`, `regression`
- **Priority:** High
- **Automation:** Automated
- **Automated as:** `tests/checkout.spec.ts` → `test('BD-067: Order summary matches the cart', …)`
- **Precondition:** SP-3 — On the Checkout page with a known order
- **Steps:**

  | #   | Action                           | Expected result                                                  |
  | --- | -------------------------------- | ---------------------------------------------------------------- |
  | 1   | Read the order-summary rows      | Cheese Pizza ×1 `$15`, Hot Pastrami ×2 `$50`, Cappuccino ×1 `$4` |
  | 2   | Read `[data-testid="cartTotal"]` | Total is **$69**, matching the cart                              |

## 8. Checkout / Order Placement

#### BD-068 · Place an order with Cash on Delivery shows success

- **Folder:** `Checkout/Order Placement`
- **Requirement:** [ORDER: Order confirmation echoes details](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#order-order-confirmation-echoes-details)
- **Tags:** `order`, `checkout`, `automated`, `smoke`
- **Priority:** Critical
- **Automation:** Automated
- **Automated as:** `tests/order.spec.ts` → `test('BD-068: Place an order with Cash on Delivery shows success', …)`
- **Precondition:** SP-3 — On the Checkout page with a known order
- **Shared steps:** SS-3 — Fill the checkout form and place the order (Name `Jane Tester`, Address `12 Rue de Test, Paris`, **Cash on Delivery**)
- **Steps (after shared steps):**

  | #   | Action                  | Expected result                                                                          |
  | --- | ----------------------- | ---------------------------------------------------------------------------------------- |
  | 1   | Assert the confirmation | Heading reads exactly **"Your order placed successfully!"**                              |
  | 2   | Assert the echoed text  | Thanks **Jane Tester**, repeats the address, states **Payment method: Cash on Delivery** |

#### BD-069 · Place an order with Card Payment on Delivery shows success

- **Folder:** `Checkout/Order Placement`
- **Requirement:** [ORDER: Order confirmation echoes details](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#order-order-confirmation-echoes-details)
- **Tags:** `order`, `checkout`, `automated`, `regression`
- **Priority:** High
- **Automation:** Automated
- **Automated as:** `tests/order.spec.ts` → `test('BD-069: Place an order with Card Payment on Delivery shows success', …)`
- **Precondition:** SP-3 — On the Checkout page with a known order
- **Shared steps:** SS-3 — Fill the checkout form and place the order (**Card Payment on Delivery**)
- **Steps (after shared steps):**

  | #   | Action                  | Expected result                                                              |
  | --- | ----------------------- | ---------------------------------------------------------------------------- |
  | 1   | Assert the confirmation | Success message appears stating **Payment method: Card Payment on Delivery** |

#### BD-070 · Cart is not cleared after placing an order

- **Folder:** `Checkout/Order Placement`
- **Requirement:** [NOCLEAR: Order does not clear cart](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#noclear-order-does-not-clear-cart)
- **Tags:** `order`, `checkout`, `automated`, `edge-case`
- **Priority:** Medium
- **Automation:** Automated
- **Automated as:** `tests/order.spec.ts` → `test('BD-070: Cart is not cleared after placing an order', …)`
- **Precondition:** SP-3 — On the Checkout page with a known order
- **Shared steps:** SS-3 — Fill the checkout form and place the order
- **Steps (after shared steps):**

  | #   | Action                                  | Expected result                              |
  | --- | --------------------------------------- | -------------------------------------------- |
  | 1   | After success, read `localStorage.cart` | It still holds the three items (unchanged)   |
  | 2   | Navigate home and open the cart         | The same items and **$69** total are present |

## 9. Persistence

#### BD-071 · Cart persists across a reload

- **Folder:** `Persistence`
- **Requirement:** [PERSIST: Cart persists across sessions](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#persist-cart-persists-across-sessions)
- **Tags:** `persistence`, `automated`, `regression`
- **Priority:** High
- **Automation:** Automated
- **Automated as:** `tests/persistence.spec.ts` → `test('BD-071: Cart persists across a reload', …)`
- **Precondition:** SP-1 — App open with an empty cart
- **Shared steps:** SS-1 — Add items to the cart from the menu
- **Steps (after shared steps):**

  | #   | Action          | Expected result                                                                   |
  | --- | --------------- | --------------------------------------------------------------------------------- |
  | 1   | Reload the page | The badge still reads **4**                                                       |
  | 2   | Open the cart   | The same three lines and **$69** total are present; `localStorage.cart` is intact |

---

## 10. Automation implementation spec (qas-cli compatible)

This section specifies how the Playwright tests must be written so their results upload to QA Sphere
with [`qas-cli`](https://github.com/Hypersequent/qas-cli) (`playwright-json-upload`).

### 10.1 Repository layout (mirrors `bistro-e2e`)

```
tests/
  navigation.spec.ts      BD-057
  menu.spec.ts            BD-058, BD-059
  cart.spec.ts            BD-060, BD-061, BD-062
  quantity.spec.ts        BD-063, BD-064, BD-065
  checkout.spec.ts        BD-066, BD-067
  order.spec.ts           BD-068, BD-069, BD-070
  persistence.spec.ts     BD-071
  pageobjects/
    welcome.ts  about.ts  menu.ts  cart.ts  checkout.ts
```

### 10.2 Test-case matching — title marker (required)

qas-cli matches a Playwright result to a QA Sphere test case by finding a `PROJECT-SEQ` marker in the
`test(...)` title. The matcher is:

```
/\b([A-Za-z0-9]{1,5})-(\d{3,})\b/      // project: 1–5 alphanumerics; sequence: ≥ 3 digits
```

So **every** automated test title must start with its marker, e.g.:

```ts
test('BD-060: Add-to-cart increments the badge by total quantity', async ({ page }) => {
	/* … */
})
```

`BD-060` satisfies the matcher (`BD` = 2 chars ✓, `049` = 3 digits ✓). The marker must be in the
**spec title**, not only a `describe(...)` block. Keep the exact titles listed under "Automated as"
in §3–§9.

### 10.3 Test-case matching — annotation (alternative/backup)

Equivalently, attach a Playwright annotation whose `type` contains `test case` and whose
`description` is the full QA Sphere test-case URL:

```ts
test(
	'Add-to-cart increments the badge',
	{ annotation: { type: 'test case', description: `${process.env.QAS_URL}/project/BD/tcase/49` } },
	async ({ page }) => {
		/* … */
	}
)
```

Use **one** method consistently; the title-marker approach (10.2) is preferred and matches the
existing `bistro-e2e` convention.

### 10.4 `playwright.config.ts`

```ts
import { defineConfig, devices } from '@playwright/test'
import 'dotenv/config'

export default defineConfig({
	testDir: './tests',
	workers: 1, // cart state is per-origin; avoid cross-test races
	use: {
		baseURL: 'https://hypersequent.github.io/bistro/',
		screenshot: 'on', // captured as attachments for QA Sphere
		trace: 'on-first-retry',
	},
	reporter: [
		['list'],
		['json', { outputFile: 'test-results.json' }], // REQUIRED by qasphere playwright-json-upload
	],
	projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
})
```

### 10.5 Deterministic state (maps the shared entities to code)

The cart persists in `localStorage`, so every spec must start clean and seed its own state:

```ts
// SP-1 — clean, empty cart before each test
test.beforeEach(async ({ page }) => {
	await page.addInitScript(() => localStorage.removeItem('cart'))
	await page.goto('/')
})

// SP-2 — preloaded known order ($69): add via the UI (page objects), OR seed directly:
await page.addInitScript(() =>
	localStorage.setItem(
		'cart',
		JSON.stringify([
			{ id: 'p1', quantity: 1 },
			{ id: 'p2', quantity: 2 },
			{ id: 'd1', quantity: 1 },
		])
	)
)

// SP-3 — reach checkout via the in-app Checkout button (NOT page.goto('/checkout'),
// which redirects home because the guard runs before the store hydrates).
await cart.openCart()
await cart.checkout()
```

Prefer UI actions through page objects for realism; `addInitScript` seeding is acceptable for
quantity/persistence cases that only need a known starting cart.

### 10.6 Running and uploading

```bash
# 1. Authenticate (env vars, .env, or a .qaspherecli file)
export QAS_TOKEN="<api-token>"
export QAS_URL="https://<tenant>.qasphere.com"

# 2. Run the suite -> produces test-results.json (per the json reporter in 10.4)
npx playwright test --project=chromium

# 3. Upload results to QA Sphere (creates a run, matches BD-### markers, attaches screenshots)
npx qasphere playwright-json-upload \
  --project-code BD \
  --run-name "Bistro Delivery — {YYYY}-{MM}-{DD}" \
  --attachments \
  ./test-results.json
```

Useful flags: `--ignore-unmatched` (only the 15 BD cases should match), `--force` (don't abort on
non-fatal API issues), `--skip-report-stdout on-success` (smaller payloads). To upload into an
existing run instead of creating one, pass `-r https://<tenant>.qasphere.com/project/BD/run/<id>`.

### 10.7 Marker → spec → test title map

| BD     | Requirement | Spec file                   | `test(...)` title                                                       |
| ------ | ----------- | --------------------------- | ----------------------------------------------------------------------- |
| BD-057 | NAV         | `tests/navigation.spec.ts`  | `BD-057: Navbar links navigate to the correct routes`                   |
| BD-058 | TABS        | `tests/menu.spec.ts`        | `BD-058: Switching tabs reveals the matching category and active state` |
| BD-059 | CARD        | `tests/menu.spec.ts`        | `BD-059: Item titles and prices match the menu data per category`       |
| BD-060 | BADGE       | `tests/cart.spec.ts`        | `BD-060: Add-to-cart increments the badge by total quantity`            |
| BD-061 | ADD         | `tests/cart.spec.ts`        | `BD-061: Adding the same item twice yields one line with quantity 2`    |
| BD-062 | TOTAL       | `tests/cart.spec.ts`        | `BD-062: Line totals and cart total compute correctly`                  |
| BD-063 | QTY         | `tests/quantity.spec.ts`    | `BD-063: Setting a quantity greater than zero updates totals`           |
| BD-064 | ZERO        | `tests/quantity.spec.ts`    | `BD-064: Quantity 0, empty or non-numeric removes the item`             |
| BD-065 | REMOVE      | `tests/quantity.spec.ts`    | `BD-065: The remove (X) button deletes the line`                        |
| BD-066 | GUARD       | `tests/checkout.spec.ts`    | `BD-066: Empty-cart direct navigation to checkout redirects home`       |
| BD-067 | SUMMARY     | `tests/checkout.spec.ts`    | `BD-067: Order summary matches the cart`                                |
| BD-068 | ORDER       | `tests/order.spec.ts`       | `BD-068: Place an order with Cash on Delivery shows success`            |
| BD-069 | ORDER       | `tests/order.spec.ts`       | `BD-069: Place an order with Card Payment on Delivery shows success`    |
| BD-070 | NOCLEAR     | `tests/order.spec.ts`       | `BD-070: Cart is not cleared after placing an order`                    |
| BD-071 | PERSIST     | `tests/persistence.spec.ts` | `BD-071: Cart persists across a reload`                                 |

### 10.8 Key selectors (from `CONTEXT.md` §8, verified live)

| Element                       | Selector                                              |
| ----------------------------- | ----------------------------------------------------- |
| Cart total (modal & checkout) | `[data-testid="cartTotal"]`                           |
| Cart icon / badge             | `.my-cart-icon` / `.my-cart-badge`                    |
| Add-to-cart buttons           | `.my-cart-btn`                                        |
| Cart modal                    | `#cart`                                               |
| Active tab / visible panel    | `.button--is-active` / `.menu--is-visible`            |
| Menu panels                   | `#pizzaMenu`, `#drinksMenu`, `#dessertsMenu`          |
| Checkout fields               | `#customerName`, `#customerAddress`, `#paymentMethod` |
| Place order                   | button named **Place Order**                          |
| Success heading               | text **"Your order placed successfully!"**            |

---

## 11. Coverage summary

- **15 automated cases**, `BD-057…BD-071`, filed in the same folders as the manual suite.
- Each links to exactly one requirement (`REQUIREMENTS.md`) and carries the `automated` tag plus
  `Automation = Automated`.
- All 15 are written as manual-runnable steps **and** specified for Playwright + qas-cli upload (§10),
  using the same shared preconditions/steps as the manual plan.
