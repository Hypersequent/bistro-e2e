# Bistro Delivery — Manual Test Plan

|                            |                                             |
| -------------------------- | ------------------------------------------- |
| **Document**               | Manual test cases (QA Sphere import plan)   |
| **Version**                | 1.0                                         |
| **Last updated**           | 2026-05-26                                  |
| **Application under test** | https://hypersequent.github.io/bistro/      |
| **Project code**           | `BD`                                        |
| **Behavioural reference**  | [`docs/CONTEXT.md`](./CONTEXT.md)           |
| **Requirements**           | [`docs/REQUIREMENTS.md`](./REQUIREMENTS.md) |
| **Automated counterpart**  | [`docs/AUTOMATED.md`](./AUTOMATED.md)       |

This file plans the **45 manual test cases** (`BD-001…BD-045`) for the QA Sphere project, alongside
the **shared preconditions** and **shared steps** they reuse. The 15 automated cases
(`BD-046…BD-060`) live in [`AUTOMATED.md`](./AUTOMATED.md) but share the same folders, tags, and
shared entities.

---

## 1. Conventions

- **Test case IDs** — `BD-001 … BD-045` (manual). QA Sphere assigns the sequence; the IDs here are
  the human-readable `PROJECT-SEQ` form.
- **Folder** — the QA Sphere folder the case is filed under (paths are `/`-separated). Folders are
  shown in §3; manual and automated cases share the same folders.
- **Requirement** — every case links to exactly one requirement in `REQUIREMENTS.md`. Links use the
  hosted base `https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md`.
- **Tags** — feature (`navigation`, `menu`, `cart`, `checkout`, `order`, `persistence`, `about`,
  `responsive`) + lifecycle (`smoke`, `regression`, `edge-case`, `visual`). Automated cases also
  carry `automated`.
- **Automation (custom field)** — a QA Sphere dropdown custom field `automation` with values
  `Manual` / `Automated`. Every manual case below is `Manual`.
- **Priority** — `Critical` / `High` / `Medium` / `Low`.
- **Precondition** — either a **shared precondition** (`SP-1`/`SP-2`/`SP-3`, §4) or inline rich
  text where the setup is case-specific.
- **Steps** — optionally one or two **shared steps** (`SS-1`/`SS-2`/`SS-3`, §5) followed by
  case-specific Action / Expected rows.
- **Images** — placeholders are marked `🖼️ IMG-xxx`. A future agent captures these against the
  live site; each placeholder states what to capture and what the image must show. Images are kept
  deliberately sparse (shared entities default to one image; only genuinely visual cases add one).

> **Determinism note:** the cart persists in `localStorage` across sessions. Unless a case says
> otherwise, start from **SP-1** (clean, empty cart) so results are repeatable.

---

## 2. Image placeholder format

Every image below uses this shape so it can be (re)captured consistently:

> 🖼️ **IMG-xxx — Title**
>
> - **Shows:** what the picture must depict.
> - **How to capture:** URL, viewport, exact actions, and what to frame.
> - **Expectations:** what must be legible/visible for the image to be useful (else retake).

---

## 3. Folder hierarchy

```
Navigation & Layout/                 (BD-001…006, BD-046)
   └─ Responsive & Mobile Nav/       (BD-007…011)            ← nested
Menu/                                (BD-012…016, BD-047, BD-048)
Cart/                                (BD-017…021, BD-049…051)
   └─ Quantity & Removal/            (BD-022…026, BD-052…054) ← nested
Checkout/                            (BD-027…031, BD-055, BD-056)
   └─ Order Placement/               (BD-032…036, BD-057…059) ← nested
About & Content/                     (BD-037…041)
Persistence/                         (BD-042…045, BD-060)
```

Navigation & Layout, Cart, and Checkout are **parent folders that hold their own cases and have
nested children** — demonstrating QA Sphere's nested-folder feature.

---

## 4. Shared preconditions

### SP-1 — App open with an empty cart

> Used by the majority of cases as the clean starting state.

1. Open **https://hypersequent.github.io/bistro/**.
2. Clear any prior cart: in the browser console run `localStorage.removeItem('cart')` (or clear the
   site's storage), then **reload** the page.
3. Confirm the cart badge shows **0** (no items) — opening the cart would show _"No items in your
   cart"_.

> 🖼️ **IMG-SP1 — Home page with an empty cart**
>
> - **Shows:** the home page hero + the cart icon with no/zero badge.
> - **How to capture:** desktop viewport (~1280×800), live URL, after step 2, top-right cart icon in frame.
> - **Expectations:** hero "Bistro Delivery" heading and the empty cart icon are both clearly visible.

### SP-2 — Cart preloaded with a known order

> A fixed cart (total **$69**) used by cart, quantity, and persistence cases.

1. Start from a fresh, empty cart (**SP-1**).
2. On the **Pizzas** tab, click **Add to cart** on **Cheese Pizza** ($15) once, and on
   **Hot Pastrami** ($25) twice.
3. Switch to the **Drinks** tab and click **Add to cart** on **Cappuccino** ($4) once.

The cart now holds three lines — Cheese Pizza ×1, Hot Pastrami ×2, Cappuccino ×1 — the **badge
shows 4**, and the **cart total is $69**.

> 🖼️ **IMG-SP2 — Cart modal with the known order**
>
> - **Shows:** the "My cart" modal listing the three lines with quantities and a **$69** total.
> - **How to capture:** desktop viewport, after step 3, open the cart modal; frame the line items and the Total row.
> - **Expectations:** all three titles, quantities (1, 2, 1), and the `$69` total are legible.

### SP-3 — On the Checkout page with a known order

> Used by all checkout and order-placement cases.

1. Build the preloaded cart (**SP-2**).
2. Click the **cart icon** to open the **My cart** modal.
3. Click **Checkout**.

The **Checkout** page (`/bistro/checkout`) loads showing the order summary (Cheese Pizza,
Hot Pastrami ×2, Cappuccino), a **Total of $69**, and the order form (Name, Address, Payment
Method).

> **Note:** checkout must be reached via the **Checkout button** — direct navigation to
> `/bistro/checkout` redirects to the home page (the route guard runs before the cart hydrates).

> 🖼️ **IMG-SP3 — Checkout order summary**
>
> - **Shows:** the checkout order-summary table (Image/Title/Count/Total Price + Total $69) and the form below.
> - **How to capture:** desktop viewport, after step 3; frame the summary table and the Name/Address/Payment form.
> - **Expectations:** summary rows, the `$69` total, and all three form fields are visible.

---

## 5. Shared steps

### SS-1 — Add items to the cart from the menu

| #   | Action                                                                   | Expected result                               |
| --- | ------------------------------------------------------------------------ | --------------------------------------------- |
| 1   | On the home page Pizzas tab, click **Add to cart** on **Cheese Pizza**   | Cart badge becomes **1**                      |
| 2   | Click **Add to cart** on **Hot Pastrami** twice                          | Badge becomes **3** (Hot Pastrami quantity 2) |
| 3   | Switch to the **Drinks** tab and click **Add to cart** on **Cappuccino** | Badge becomes **4**                           |

> 🖼️ **IMG-SS1 — Add to cart updates the badge**
>
> - **Shows:** a menu card's **Add to cart** button and the cart badge having incremented.
> - **How to capture:** desktop viewport; capture mid-flow with the badge showing a non-zero count.
> - **Expectations:** the Add-to-cart button and the updated badge count are both clearly visible.

### SS-2 — Open the cart modal

| #   | Action                              | Expected result                                                                                                       |
| --- | ----------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| 1   | Click the **cart icon** (top-right) | The **My cart** modal opens, listing each item with an editable quantity, an **X** remove button, and a **Total** row |

> 🖼️ **IMG-SS2 — "My cart" modal**
>
> - **Shows:** the open cart modal with line items, quantity inputs, X buttons, and the Total row.
> - **How to capture:** desktop viewport, from SP-2; open the modal and frame its full body.
> - **Expectations:** quantity fields, X buttons, and the Total row are legible.

### SS-3 — Fill the checkout form and place the order

| #   | Action                                                         | Expected result                                  |
| --- | -------------------------------------------------------------- | ------------------------------------------------ |
| 1   | Enter a name in **Name** (e.g. `Jane Tester`)                  | The field accepts the text                       |
| 2   | Enter an address in **Address** (e.g. `12 Rue de Test, Paris`) | The field accepts the text                       |
| 3   | Select a **Payment Method**                                    | The chosen method is selected                    |
| 4   | Click **Place Order**                                          | The form is replaced by the success confirmation |

---

## 6. Test cases

### 6.1 Navigation & Layout

#### BD-001 · Navbar links route to the correct pages

- **Folder:** `Navigation & Layout`
- **Requirement:** [FR-NAV: Navbar links route to the correct pages](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#fr-nav-navbar-links-route-to-the-correct-pages)
- **Tags:** `navigation`, `smoke`, `regression`
- **Priority:** High
- **Automation:** Manual
- **Precondition:** SP-1 — App open with an empty cart
- **Steps:**

  | #   | Action                          | Expected result                                       |
  | --- | ------------------------------- | ----------------------------------------------------- |
  | 1   | Click **Welcome** in the navbar | The home page (`/bistro/`) loads with the hero banner |
  | 2   | Click **Today's Menu**          | The menu section comes into view on the home page     |
  | 3   | Click **About us**              | The About page (`/bistro/about`) loads                |

#### BD-002 · Logo returns to the home page

- **Folder:** `Navigation & Layout`
- **Requirement:** [FR-LOGO: Logo returns to the home page](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#fr-logo-logo-returns-to-the-home-page)
- **Tags:** `navigation`, `regression`
- **Priority:** Medium
- **Automation:** Manual
- **Precondition:** SP-1 — App open with an empty cart
- **Steps:**

  | #   | Action                             | Expected result                        |
  | --- | ---------------------------------- | -------------------------------------- |
  | 1   | Navigate to the **About** page     | The About page loads                   |
  | 2   | Click the **Bistro Delivery logo** | The home page loads with hero and menu |

#### BD-003 · "Today's Menu" scrolls to the menu section

- **Folder:** `Navigation & Layout`
- **Requirement:** [FR-MENULINK: "Today's Menu" scrolls to the menu section](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#fr-menulink-todays-menu-scrolls-to-the-menu-section)
- **Tags:** `navigation`, `regression`
- **Priority:** Medium
- **Automation:** Manual
- **Precondition:** SP-1 — App open with an empty cart
- **Steps:**

  | #   | Action                                                        | Expected result                                                   |
  | --- | ------------------------------------------------------------- | ----------------------------------------------------------------- |
  | 1   | On the home page, click the hero **View Today's Menu** button | The page scrolls to and reveals the menu section (no full reload) |
  | 2   | Scroll back up and click **Today's Menu** in the navbar       | The menu section is brought into view again                       |

#### BD-004 · Footer shows the QA Sphere attribution and link

- **Folder:** `Navigation & Layout`
- **Requirement:** [FR-FOOTER: Footer shows the QA Sphere attribution and link](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#fr-footer-footer-shows-the-qa-sphere-attribution-and-link)
- **Tags:** `navigation`, `regression`
- **Priority:** Low
- **Automation:** Manual
- **Precondition:** SP-1 — App open with an empty cart
- **Steps:**

  | #   | Action                    | Expected result                                         |
  | --- | ------------------------- | ------------------------------------------------------- |
  | 1   | Scroll to the page footer | Footer reads **"Bistro Delivery - QA Sphere demo app"** |
  | 2   | Click the footer link     | It points to `github.com/Hypersequent/bistro`           |

  > 🖼️ **IMG-BD004 — Live footer attribution**
  >
  > - **Shows:** the footer text "Bistro Delivery - QA Sphere demo app" and its link.
  > - **How to capture:** desktop viewport, live URL, scrolled to the bottom of the home page.
  > - **Expectations:** the exact footer wording is legible (distinguishes the live site from the repo's older footer).

#### BD-005 · Page navigation uses smooth view transitions

- **Folder:** `Navigation & Layout`
- **Requirement:** [FR-TRANSITION: Page navigation uses smooth view transitions](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#fr-transition-page-navigation-uses-smooth-view-transitions)
- **Tags:** `navigation`, `visual`
- **Priority:** Low
- **Automation:** Manual
- **Precondition:** Use a browser that supports the View Transitions API (recent Chromium/Edge). The
  app is open at the home page with an empty cart.
- **Steps:**

  | #   | Action                                        | Expected result                                              |
  | --- | --------------------------------------------- | ------------------------------------------------------------ |
  | 1   | Navigate Home → About → Today's Menu          | Each navigation animates with a smooth cross-page transition |
  | 2   | Observe the browser console during navigation | No errors are logged; navigation completes normally          |

  > 🖼️ **IMG-BD005 — View transition mid-animation**
  >
  > - **Shows:** a page-to-page transition captured mid-animation (cross-fade/slide).
  > - **How to capture:** Chromium desktop; trigger Home→About and capture during the transition.
  > - **Expectations:** the transition effect is visible; if impossible to capture mid-frame, capture before/after pair instead.

#### BD-006 · Navbar and footer are present on every page

- **Folder:** `Navigation & Layout`
- **Requirement:** [FR-NAV: Navbar links route to the correct pages](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#fr-nav-navbar-links-route-to-the-correct-pages)
- **Tags:** `navigation`, `regression`
- **Priority:** Medium
- **Automation:** Manual
- **Precondition:** SP-1 — App open with an empty cart
- **Steps:**

  | #   | Action                    | Expected result                                                   |
  | --- | ------------------------- | ----------------------------------------------------------------- |
  | 1   | Visit the **Home** page   | Navbar (Welcome / Today's Menu / About us) and footer are present |
  | 2   | Visit the **About** page  | Navbar and footer are present and unchanged                       |
  | 3   | Open the **menu** section | Navbar and footer remain present                                  |

### 6.2 Navigation & Layout / Responsive & Mobile Nav

#### BD-007 · Hamburger toggler appears on narrow viewports

- **Folder:** `Navigation & Layout/Responsive & Mobile Nav`
- **Requirement:** [FR-RESPONSIVE: Navbar collapses into a hamburger menu on narrow viewports](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#fr-responsive-navbar-collapses-into-a-hamburger-menu-on-narrow-viewports)
- **Tags:** `responsive`, `navigation`, `regression`
- **Priority:** High
- **Automation:** Manual
- **Precondition:** Open the live site on a mobile viewport (≈375×812, e.g. device emulation) with a
  fresh, empty cart.
- **Steps:**

  | #   | Action                                  | Expected result                                                  |
  | --- | --------------------------------------- | ---------------------------------------------------------------- |
  | 1   | Observe the navbar at mobile width      | The inline links are hidden and a **hamburger toggler** is shown |
  | 2   | Widen the viewport above the breakpoint | The links display inline and the toggler disappears              |

  > 🖼️ **IMG-BD007 — Mobile navbar with hamburger**
  >
  > - **Shows:** the collapsed navbar with the hamburger toggler at mobile width.
  > - **How to capture:** 375×812 device emulation, home page, toggler closed.
  > - **Expectations:** the hamburger icon is clearly visible and the inline links are hidden.

#### BD-008 · Hamburger menu expands and collapses the nav links

- **Folder:** `Navigation & Layout/Responsive & Mobile Nav`
- **Requirement:** [FR-RESPONSIVE: Navbar collapses into a hamburger menu on narrow viewports](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#fr-responsive-navbar-collapses-into-a-hamburger-menu-on-narrow-viewports)
- **Tags:** `responsive`, `navigation`, `regression`
- **Priority:** High
- **Automation:** Manual
- **Precondition:** Live site on a mobile viewport (≈375×812), fresh cart, hamburger menu collapsed.
- **Steps:**

  | #   | Action                        | Expected result                    |
  | --- | ----------------------------- | ---------------------------------- |
  | 1   | Tap the **hamburger toggler** | The nav links expand into view     |
  | 2   | Tap the toggler again         | The nav links collapse out of view |

#### BD-009 · Navigation links work from the mobile menu

- **Folder:** `Navigation & Layout/Responsive & Mobile Nav`
- **Requirement:** [FR-RESPONSIVE: Navbar collapses into a hamburger menu on narrow viewports](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#fr-responsive-navbar-collapses-into-a-hamburger-menu-on-narrow-viewports)
- **Tags:** `responsive`, `navigation`, `regression`
- **Priority:** Medium
- **Automation:** Manual
- **Precondition:** Live site on a mobile viewport (≈375×812), fresh cart.
- **Steps:**

  | #   | Action                                       | Expected result      |
  | --- | -------------------------------------------- | -------------------- |
  | 1   | Open the hamburger menu and tap **About us** | The About page loads |
  | 2   | Open the hamburger menu and tap **Welcome**  | The home page loads  |

#### BD-010 · Page content reflows cleanly on a mobile viewport

- **Folder:** `Navigation & Layout/Responsive & Mobile Nav`
- **Requirement:** [FR-MOBILE: Pages reflow cleanly on mobile viewports](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#fr-mobile-pages-reflow-cleanly-on-mobile-viewports)
- **Tags:** `responsive`, `visual`
- **Priority:** Medium
- **Automation:** Manual
- **Precondition:** Live site on a mobile viewport (≈375×812), fresh cart.
- **Steps:**

  | #   | Action                         | Expected result                                                                    |
  | --- | ------------------------------ | ---------------------------------------------------------------------------------- |
  | 1   | Scroll the home page on mobile | Hero, menu, and cards reflow to a single readable column with no horizontal scroll |
  | 2   | Open the menu and switch tabs  | Tabs and item cards remain readable and tappable; nothing overlaps or clips        |

  > 🖼️ **IMG-BD010 — Mobile home layout**
  >
  > - **Shows:** the home page reflowed for mobile (single column).
  > - **How to capture:** 375×812 device emulation, home page, menu section in frame.
  > - **Expectations:** no horizontal scrollbar, no overlapping elements, cards stacked cleanly.

#### BD-011 · Cart icon and badge remain reachable on mobile

- **Folder:** `Navigation & Layout/Responsive & Mobile Nav`
- **Requirement:** [FR-MOBILE: Pages reflow cleanly on mobile viewports](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#fr-mobile-pages-reflow-cleanly-on-mobile-viewports)
- **Tags:** `responsive`, `cart`, `visual`
- **Priority:** Medium
- **Automation:** Manual
- **Precondition:** Live site on a mobile viewport (≈375×812), fresh cart.
- **Steps:**

  | #   | Action                             | Expected result                                               |
  | --- | ---------------------------------- | ------------------------------------------------------------- |
  | 1   | Add any item to the cart on mobile | The cart badge is visible and updates                         |
  | 2   | Tap the cart icon                  | The cart modal opens and is usable within the mobile viewport |

### 6.3 Menu

#### BD-012 · Pizzas tab is shown and active by default

- **Folder:** `Menu`
- **Requirement:** [FR-MENU: Menu presents three categorized tabs with Pizzas active by default](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#fr-menu-menu-presents-three-categorized-tabs-with-pizzas-active-by-default)
- **Tags:** `menu`, `smoke`, `regression`
- **Priority:** High
- **Automation:** Manual
- **Precondition:** SP-1 — App open with an empty cart
- **Steps:**

  | #   | Action                              | Expected result                                       |
  | --- | ----------------------------------- | ----------------------------------------------------- |
  | 1   | Open the menu section               | The **Pizzas** tab is active and its panel is visible |
  | 2   | Count the items in the Pizzas panel | Six pizza items are listed                            |
  | 3   | Glance at Drinks and Desserts       | Each also contains six items (18 total)               |

#### BD-013 · Switching tabs shows the selected category

- **Folder:** `Menu`
- **Requirement:** [FR-TABS: Selecting a tab reveals its category and marks it active](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#fr-tabs-selecting-a-tab-reveals-its-category-and-marks-it-active)
- **Tags:** `menu`, `regression`
- **Priority:** High
- **Automation:** Manual
- **Precondition:** SP-1 — App open with an empty cart
- **Steps:**

  | #   | Action                     | Expected result                                                |
  | --- | -------------------------- | -------------------------------------------------------------- |
  | 1   | Click the **Drinks** tab   | Drinks become visible; Drinks tab is active; Pizzas hidden     |
  | 2   | Click the **Desserts** tab | Desserts become visible; Desserts tab is active; Drinks hidden |
  | 3   | Click the **Pizzas** tab   | Pizzas become visible again; the page did not navigate/reload  |

#### BD-014 · Menu item card shows title, price, description and Add-to-cart

- **Folder:** `Menu`
- **Requirement:** [FR-CARD: Menu item card shows title, price, description and Add-to-cart](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#fr-card-menu-item-card-shows-title-price-description-and-add-to-cart)
- **Tags:** `menu`, `regression`
- **Priority:** High
- **Automation:** Manual
- **Precondition:** SP-1 — App open with an empty cart
- **Steps:**

  | #   | Action                                   | Expected result                                                             |
  | --- | ---------------------------------------- | --------------------------------------------------------------------------- |
  | 1   | Inspect a pizza card (e.g. Cheese Pizza) | It shows a title, price `$15`, a description, and an **Add to cart** button |
  | 2   | Inspect a drink and a dessert card       | Each shows title, price (`$<integer>`), description, and Add to cart        |

#### BD-015 · Pizzas show images; drinks and desserts do not

- **Folder:** `Menu`
- **Requirement:** [FR-IMAGE: Pizzas display images; drinks and desserts display none](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#fr-image-pizzas-display-images-drinks-and-desserts-display-none)
- **Tags:** `menu`, `regression`, `edge-case`
- **Priority:** Medium
- **Automation:** Manual
- **Precondition:** SP-1 — App open with an empty cart
- **Steps:**

  | #   | Action                          | Expected result                                                             |
  | --- | ------------------------------- | --------------------------------------------------------------------------- |
  | 1   | Look at the Pizzas panel        | Every pizza card shows a product image                                      |
  | 2   | Switch to Drinks, then Desserts | Cards render correctly **without** images, by design (no broken-image icon) |

  > 🖼️ **IMG-BD015 — Image-less drink/dessert cards**
  >
  > - **Shows:** drink or dessert cards rendering cleanly with no image area.
  > - **How to capture:** desktop viewport, Drinks (or Desserts) tab active.
  > - **Expectations:** cards look intentional (no broken-image placeholder), title/price/description visible.

#### BD-016 · Menu content fades in on scroll (AOS)

- **Folder:** `Menu`
- **Requirement:** [FR-ANIM: Menu content animates on scroll](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#fr-anim-menu-content-animates-on-scroll)
- **Tags:** `menu`, `visual`
- **Priority:** Low
- **Automation:** Manual
- **Precondition:** SP-1 — App open with an empty cart
- **Steps:**

  | #   | Action                                      | Expected result                                  |
  | --- | ------------------------------------------- | ------------------------------------------------ |
  | 1   | Reload and slowly scroll the menu into view | Cards fade/animate in as they enter the viewport |
  | 2   | After the animation settles                 | All cards are fully visible and interactive      |

  > 🖼️ **IMG-BD016 — Menu AOS animation**
  >
  > - **Shows:** menu cards mid fade-in as the section scrolls into view.
  > - **How to capture:** desktop viewport; reload and capture during the scroll-in animation.
  > - **Expectations:** the partially-animated state is visible; if hard to capture, a settled state is acceptable.

### 6.4 Cart

#### BD-017 · Add items to the cart

- **Folder:** `Cart`
- **Requirement:** [FR-ADD: Add items to the cart](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#fr-add-add-items-to-the-cart)
- **Tags:** `cart`, `smoke`, `regression`
- **Priority:** Critical
- **Automation:** Manual
- **Precondition:** SP-1 — App open with an empty cart
- **Steps:**

  | #   | Action                                      | Expected result                                                       |
  | --- | ------------------------------------------- | --------------------------------------------------------------------- |
  | 1   | Click **Add to cart** on Cheese Pizza       | A line for Cheese Pizza is created with quantity 1; badge = 1         |
  | 2   | Click **Add to cart** on Cheese Pizza again | The same line increments to quantity 2 (not a second line); badge = 2 |
  | 3   | Switch to Drinks and add Cappuccino         | A Cappuccino line is added; badge = 3                                 |

#### BD-018 · Cart badge shows the total quantity across items

- **Folder:** `Cart`
- **Requirement:** [FR-BADGE: Cart badge reflects the total item quantity](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#fr-badge-cart-badge-reflects-the-total-item-quantity)
- **Tags:** `cart`, `regression`
- **Priority:** High
- **Automation:** Manual
- **Precondition:** SP-1 — App open with an empty cart
- **Steps:**

  | #   | Action                                  | Expected result                                             |
  | --- | --------------------------------------- | ----------------------------------------------------------- |
  | 1   | Add Cheese Pizza ×1 and Hot Pastrami ×2 | Badge shows **3** (sum of quantities, not 2 distinct items) |
  | 2   | Add Cappuccino ×1                       | Badge shows **4**                                           |

#### BD-019 · Cart line totals and Total row are correct

- **Folder:** `Cart`
- **Requirement:** [FR-TOTAL: Line and cart totals calculate correctly](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#fr-total-line-and-cart-totals-calculate-correctly)
- **Tags:** `cart`, `regression`
- **Priority:** Critical
- **Automation:** Manual
- **Precondition:** SP-1 — App open with an empty cart
- **Shared steps:** SS-1 — Add items to the cart from the menu, then SS-2 — Open the cart modal
- **Steps (after shared steps):**

  | #   | Action                 | Expected result                                                      |
  | --- | ---------------------- | -------------------------------------------------------------------- |
  | 1   | Read each line total   | Cheese Pizza = `$15`, Hot Pastrami = `$50` (25×2), Cappuccino = `$4` |
  | 2   | Read the **Total** row | Total = **$69** (sum of line totals)                                 |

#### BD-020 · Cart modal opens and closes

- **Folder:** `Cart`
- **Requirement:** [FR-MODAL: Cart modal opens and closes](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#fr-modal-cart-modal-opens-and-closes)
- **Tags:** `cart`, `regression`
- **Priority:** Medium
- **Automation:** Manual
- **Precondition:** SP-2 — Cart preloaded with a known order
- **Steps:**

  | #   | Action                         | Expected result             |
  | --- | ------------------------------ | --------------------------- |
  | 1   | Click the cart icon            | The **My cart** modal opens |
  | 2   | Click the **×** button         | The modal closes            |
  | 3   | Re-open and click **Close**    | The modal closes            |
  | 4   | Re-open and click the backdrop | The modal closes            |

#### BD-021 · Empty cart shows a message and hides Checkout

- **Folder:** `Cart`
- **Requirement:** [FR-EMPTY: Empty cart shows a message and no checkout](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#fr-empty-empty-cart-shows-a-message-and-no-checkout)
- **Tags:** `cart`, `edge-case`
- **Priority:** Medium
- **Automation:** Manual
- **Precondition:** SP-1 — App open with an empty cart
- **Steps:**

  | #   | Action                                  | Expected result                             |
  | --- | --------------------------------------- | ------------------------------------------- |
  | 1   | Click the cart icon with no items added | The modal shows **"No items in your cart"** |
  | 2   | Look for a Checkout action              | **No Checkout button** is present           |

### 6.5 Cart / Quantity & Removal

#### BD-022 · Editing the quantity updates the line and totals

- **Folder:** `Cart/Quantity & Removal`
- **Requirement:** [FR-QTY: Editing a quantity updates the line and totals](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#fr-qty-editing-a-quantity-updates-the-line-and-totals)
- **Tags:** `cart`, `regression`
- **Priority:** High
- **Automation:** Manual
- **Precondition:** SP-2 — Cart preloaded with a known order
- **Shared steps:** SS-2 — Open the cart modal
- **Steps (after shared steps):**

  | #   | Action                                       | Expected result                                          |
  | --- | -------------------------------------------- | -------------------------------------------------------- |
  | 1   | Change Cheese Pizza quantity from 1 to **3** | Line total becomes `$45`; cart total updates accordingly |
  | 2   | Observe the badge                            | Badge reflects the new total quantity                    |

#### BD-023 · Setting a quantity to 0 removes the item

- **Folder:** `Cart/Quantity & Removal`
- **Requirement:** [FR-ZERO: Quantity of zero, empty, or non-numeric removes the item](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#fr-zero-quantity-of-zero-empty-or-non-numeric-removes-the-item)
- **Tags:** `cart`, `edge-case`
- **Priority:** High
- **Automation:** Manual
- **Precondition:** SP-2 — Cart preloaded with a known order
- **Shared steps:** SS-2 — Open the cart modal
- **Steps (after shared steps):**

  | #   | Action                               | Expected result                              |
  | --- | ------------------------------------ | -------------------------------------------- |
  | 1   | Set the Cappuccino quantity to **0** | The Cappuccino line is removed from the cart |
  | 2   | Check the total and badge            | They update to exclude the removed item      |

#### BD-024 · Clearing or non-numeric quantity removes the item

- **Folder:** `Cart/Quantity & Removal`
- **Requirement:** [FR-ZERO: Quantity of zero, empty, or non-numeric removes the item](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#fr-zero-quantity-of-zero-empty-or-non-numeric-removes-the-item)
- **Tags:** `cart`, `edge-case`
- **Priority:** Medium
- **Automation:** Manual
- **Precondition:** SP-2 — Cart preloaded with a known order
- **Shared steps:** SS-2 — Open the cart modal
- **Steps (after shared steps):**

  | #   | Action                                                                 | Expected result                                      |
  | --- | ---------------------------------------------------------------------- | ---------------------------------------------------- |
  | 1   | Clear the Hot Pastrami quantity (empty the field)                      | The Hot Pastrami line is removed (empty parsed as 0) |
  | 2   | Reset (SP-2) and type a non-numeric value (e.g. `abc`) into a quantity | The line is removed (non-numeric parsed as 0)        |

#### BD-025 · Negative quantities are ignored

- **Folder:** `Cart/Quantity & Removal`
- **Requirement:** [FR-NEG: Negative quantities are ignored](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#fr-neg-negative-quantities-are-ignored)
- **Tags:** `cart`, `edge-case`
- **Priority:** Medium
- **Automation:** Manual
- **Precondition:** SP-2 — Cart preloaded with a known order
- **Shared steps:** SS-2 — Open the cart modal
- **Steps (after shared steps):**

  | #   | Action                                   | Expected result                                                                          |
  | --- | ---------------------------------------- | ---------------------------------------------------------------------------------------- |
  | 1   | Attempt to set a line quantity to **-1** | The cart is unchanged — the negative value is ignored (quantity and total stay the same) |

#### BD-026 · The remove (X) button deletes a line

- **Folder:** `Cart/Quantity & Removal`
- **Requirement:** [FR-REMOVE: The remove (X) button deletes a line](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#fr-remove-the-remove-x-button-deletes-a-line)
- **Tags:** `cart`, `regression`
- **Priority:** High
- **Automation:** Manual
- **Precondition:** SP-2 — Cart preloaded with a known order
- **Shared steps:** SS-2 — Open the cart modal
- **Steps (after shared steps):**

  | #   | Action                                       | Expected result                        |
  | --- | -------------------------------------------- | -------------------------------------- |
  | 1   | Click the red **X** on the Hot Pastrami line | Only that line is removed              |
  | 2   | Read the Total and badge                     | Total drops by `$50`; badge drops by 2 |

### 6.6 Checkout

#### BD-027 · Empty-cart direct navigation to checkout redirects home

- **Folder:** `Checkout`
- **Requirement:** [FR-GUARD: Checkout is reachable only with a non-empty cart](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#fr-guard-checkout-is-reachable-only-with-a-non-empty-cart)
- **Tags:** `checkout`, `edge-case`
- **Priority:** High
- **Automation:** Manual
- **Precondition:** SP-1 — App open with an empty cart
- **Steps:**

  | #   | Action                                                                             | Expected result                                  |
  | --- | ---------------------------------------------------------------------------------- | ------------------------------------------------ |
  | 1   | Enter `https://hypersequent.github.io/bistro/checkout` directly in the address bar | The app **redirects to the home page**           |
  | 2   | Confirm the URL                                                                    | The browser ends on `/bistro/` (not `/checkout`) |

#### BD-028 · Order summary lists every cart line

- **Folder:** `Checkout`
- **Requirement:** [FR-SUMMARY: Checkout shows an order summary matching the cart](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#fr-summary-checkout-shows-an-order-summary-matching-the-cart)
- **Tags:** `checkout`, `regression`
- **Priority:** High
- **Automation:** Manual
- **Precondition:** SP-3 — On the Checkout page with a known order
- **Steps:**

  | #   | Action                          | Expected result                                                                    |
  | --- | ------------------------------- | ---------------------------------------------------------------------------------- |
  | 1   | Inspect the order summary table | Columns are **Image, Title, Count, Total Price**                                   |
  | 2   | Compare rows to the cart        | One row per item: Cheese Pizza ×1 `$15`, Hot Pastrami ×2 `$50`, Cappuccino ×1 `$4` |

#### BD-029 · Order summary total matches the cart total

- **Folder:** `Checkout`
- **Requirement:** [FR-SUMMARY: Checkout shows an order summary matching the cart](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#fr-summary-checkout-shows-an-order-summary-matching-the-cart)
- **Tags:** `checkout`, `regression`
- **Priority:** High
- **Automation:** Manual
- **Precondition:** SP-3 — On the Checkout page with a known order
- **Steps:**

  | #   | Action                                | Expected result                           |
  | --- | ------------------------------------- | ----------------------------------------- |
  | 1   | Read the **Total** row of the summary | Total is **$69** (matches the cart total) |

#### BD-030 · Name and Address are required to place an order

- **Folder:** `Checkout`
- **Requirement:** [FR-FORM: Checkout requires Name and Address](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#fr-form-checkout-requires-name-and-address)
- **Tags:** `checkout`, `regression`
- **Priority:** High
- **Automation:** Manual
- **Precondition:** SP-3 — On the Checkout page with a known order
- **Steps:**

  | #   | Action                                                    | Expected result                                                              |
  | --- | --------------------------------------------------------- | ---------------------------------------------------------------------------- |
  | 1   | Leave **Name** empty, fill Address, click **Place Order** | Submission is blocked; the Name field reports a required-field validation    |
  | 2   | Fill Name, clear **Address**, click **Place Order**       | Submission is blocked; the Address field reports a required-field validation |

#### BD-031 · Payment method offers Cash and Card on Delivery

- **Folder:** `Checkout`
- **Requirement:** [FR-PAYMENT: Checkout offers Cash and Card payment options](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#fr-payment-checkout-offers-cash-and-card-payment-options)
- **Tags:** `checkout`, `regression`
- **Priority:** Medium
- **Automation:** Manual
- **Precondition:** SP-3 — On the Checkout page with a known order
- **Steps:**

  | #   | Action                             | Expected result                                                        |
  | --- | ---------------------------------- | ---------------------------------------------------------------------- |
  | 1   | Open the **Payment Method** select | It lists exactly **Cash on Delivery** and **Card Payment on Delivery** |
  | 2   | Note the default                   | **Cash on Delivery** is preselected                                    |

### 6.7 Checkout / Order Placement

#### BD-032 · Place an order with Cash on Delivery

- **Folder:** `Checkout/Order Placement`
- **Requirement:** [FR-ORDER: Placing an order shows a confirmation echoing the entered details](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#fr-order-placing-an-order-shows-a-confirmation-echoing-the-entered-details)
- **Tags:** `order`, `checkout`, `smoke`, `regression`
- **Priority:** Critical
- **Automation:** Manual
- **Precondition:** SP-3 — On the Checkout page with a known order
- **Shared steps:** SS-3 — Fill the checkout form and place the order (select **Cash on Delivery**)
- **Steps (after shared steps):**

  | #   | Action                             | Expected result                                               |
  | --- | ---------------------------------- | ------------------------------------------------------------- |
  | 1   | Observe the page after Place Order | The form is replaced by **"Your order placed successfully!"** |

  > 🖼️ **IMG-BD032 — Order success confirmation**
  >
  > - **Shows:** the green success alert "Your order placed successfully!" echoing name, address, payment.
  > - **How to capture:** desktop viewport, after placing a Cash order from SP-3.
  > - **Expectations:** the heading and the echoed name/address/payment-method text are legible.

#### BD-033 · Place an order with Card Payment on Delivery

- **Folder:** `Checkout/Order Placement`
- **Requirement:** [FR-ORDER: Placing an order shows a confirmation echoing the entered details](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#fr-order-placing-an-order-shows-a-confirmation-echoing-the-entered-details)
- **Tags:** `order`, `checkout`, `regression`
- **Priority:** High
- **Automation:** Manual
- **Precondition:** SP-3 — On the Checkout page with a known order
- **Shared steps:** SS-3 — Fill the checkout form and place the order (select **Card Payment on Delivery**)
- **Steps (after shared steps):**

  | #   | Action                   | Expected result                                                                 |
  | --- | ------------------------ | ------------------------------------------------------------------------------- |
  | 1   | Observe the confirmation | Success message appears and states **Payment method: Card Payment on Delivery** |

#### BD-034 · Confirmation echoes the entered details

- **Folder:** `Checkout/Order Placement`
- **Requirement:** [FR-ORDER: Placing an order shows a confirmation echoing the entered details](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#fr-order-placing-an-order-shows-a-confirmation-echoing-the-entered-details)
- **Tags:** `order`, `checkout`, `regression`
- **Priority:** High
- **Automation:** Manual
- **Precondition:** SP-3 — On the Checkout page with a known order
- **Shared steps:** SS-3 — Fill the checkout form (Name `Jane Tester`, Address `12 Rue de Test, Paris`) and place the order
- **Steps (after shared steps):**

  | #   | Action                     | Expected result                                                                                                |
  | --- | -------------------------- | -------------------------------------------------------------------------------------------------------------- |
  | 1   | Read the confirmation text | It thanks **Jane Tester**, repeats the address **12 Rue de Test, Paris**, and states the chosen payment method |

#### BD-035 · Submitting with an empty Name is blocked

- **Folder:** `Checkout/Order Placement`
- **Requirement:** [FR-FORM: Checkout requires Name and Address](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#fr-form-checkout-requires-name-and-address)
- **Tags:** `order`, `checkout`, `edge-case`
- **Priority:** Medium
- **Automation:** Manual
- **Precondition:** SP-3 — On the Checkout page with a known order
- **Steps:**

  | #   | Action                                                     | Expected result                                                                         |
  | --- | ---------------------------------------------------------- | --------------------------------------------------------------------------------------- |
  | 1   | Fill Address only, leave Name empty, click **Place Order** | The order is not placed; no success message appears; the Name field is flagged required |

#### BD-036 · Placing an order does not clear the cart

- **Folder:** `Checkout/Order Placement`
- **Requirement:** [FR-NOCLEAR: Placing an order does not clear the cart](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#fr-noclear-placing-an-order-does-not-clear-the-cart)
- **Tags:** `order`, `checkout`, `edge-case`
- **Priority:** Medium
- **Automation:** Manual
- **Precondition:** SP-3 — On the Checkout page with a known order
- **Shared steps:** SS-3 — Fill the checkout form and place the order
- **Steps (after shared steps):**

  | #   | Action                                            | Expected result                                           |
  | --- | ------------------------------------------------- | --------------------------------------------------------- |
  | 1   | After the success message, note the order summary | The summary table is still visible above the confirmation |
  | 2   | Navigate back to the home page and open the cart  | The same items are still in the cart (it was not cleared) |

### 6.8 About & Content

#### BD-037 · About page heading and intro render

- **Folder:** `About & Content`
- **Requirement:** [FR-ABOUT: About page explains the QA Sphere demo purpose](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#fr-about-about-page-explains-the-qa-sphere-demo-purpose)
- **Tags:** `about`, `regression`
- **Priority:** Low
- **Automation:** Manual
- **Precondition:** SP-1 — App open with an empty cart
- **Steps:**

  | #   | Action              | Expected result                                                            |
  | --- | ------------------- | -------------------------------------------------------------------------- |
  | 1   | Open the About page | Heading reads **"Welcome to Bistro Delivery"** with intro paragraphs below |

#### BD-038 · About page explains the QA Sphere demo purpose

- **Folder:** `About & Content`
- **Requirement:** [FR-ABOUT: About page explains the QA Sphere demo purpose](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#fr-about-about-page-explains-the-qa-sphere-demo-purpose)
- **Tags:** `about`, `regression`
- **Priority:** Low
- **Automation:** Manual
- **Precondition:** SP-1 — App open with an empty cart
- **Steps:**

  | #   | Action              | Expected result                                                                       |
  | --- | ------------------- | ------------------------------------------------------------------------------------- |
  | 1   | Read the About copy | It states the app is a **QA Sphere** showcase and that you cannot actually order food |

#### BD-039 · About page links to qasphere.com

- **Folder:** `About & Content`
- **Requirement:** [FR-ABOUT: About page explains the QA Sphere demo purpose](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#fr-about-about-page-explains-the-qa-sphere-demo-purpose)
- **Tags:** `about`, `regression`
- **Priority:** Low
- **Automation:** Manual
- **Precondition:** SP-1 — App open with an empty cart
- **Steps:**

  | #   | Action                                         | Expected result                       |
  | --- | ---------------------------------------------- | ------------------------------------- |
  | 1   | Locate the QA Sphere link(s) in the About copy | A link to **qasphere.com** is present |
  | 2   | Activate the link                              | It navigates to the QA Sphere site    |

#### BD-040 · About page featured image renders

- **Folder:** `About & Content`
- **Requirement:** [FR-ABOUT: About page explains the QA Sphere demo purpose](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#fr-about-about-page-explains-the-qa-sphere-demo-purpose)
- **Tags:** `about`, `visual`
- **Priority:** Low
- **Automation:** Manual
- **Precondition:** SP-1 — App open with an empty cart
- **Steps:**

  | #   | Action              | Expected result                                    |
  | --- | ------------------- | -------------------------------------------------- |
  | 1   | View the About page | The featured image renders fully (no broken image) |

  > 🖼️ **IMG-BD040 — About featured image**
  >
  > - **Shows:** the About page hero/featured image alongside the heading.
  > - **How to capture:** desktop viewport, About page top.
  > - **Expectations:** the image is fully loaded and the heading "Welcome to Bistro Delivery" is visible.

#### BD-041 · "About us" is reachable from the navbar

- **Folder:** `About & Content`
- **Requirement:** [FR-ABOUT: About page explains the QA Sphere demo purpose](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#fr-about-about-page-explains-the-qa-sphere-demo-purpose)
- **Tags:** `about`, `navigation`, `regression`
- **Priority:** Low
- **Automation:** Manual
- **Precondition:** SP-1 — App open with an empty cart
- **Steps:**

  | #   | Action                                 | Expected result                                   |
  | --- | -------------------------------------- | ------------------------------------------------- |
  | 1   | From the home page, click **About us** | The About page loads with its heading and content |

### 6.9 Persistence

#### BD-042 · Cart survives a page reload

- **Folder:** `Persistence`
- **Requirement:** [FR-PERSIST: Cart persists across reloads, navigation, and sessions](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#fr-persist-cart-persists-across-reloads-navigation-and-sessions)
- **Tags:** `persistence`, `regression`
- **Priority:** High
- **Automation:** Manual
- **Precondition:** SP-1 — App open with an empty cart
- **Shared steps:** SS-1 — Add items to the cart from the menu
- **Steps (after shared steps):**

  | #   | Action               | Expected result                                    |
  | --- | -------------------- | -------------------------------------------------- |
  | 1   | Reload the page (F5) | The cart badge still shows **4**                   |
  | 2   | Open the cart        | The same three lines and **$69** total are present |

#### BD-043 · Cart survives navigation between pages

- **Folder:** `Persistence`
- **Requirement:** [FR-PERSIST: Cart persists across reloads, navigation, and sessions](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#fr-persist-cart-persists-across-reloads-navigation-and-sessions)
- **Tags:** `persistence`, `regression`
- **Priority:** Medium
- **Automation:** Manual
- **Precondition:** SP-1 — App open with an empty cart
- **Shared steps:** SS-1 — Add items to the cart from the menu
- **Steps (after shared steps):**

  | #   | Action                                       | Expected result                  |
  | --- | -------------------------------------------- | -------------------------------- |
  | 1   | Navigate to **About**, then back to **Home** | The cart badge still shows **4** |
  | 2   | Open the cart                                | The same items remain            |

#### BD-044 · Cart is stored in localStorage under the `cart` key

- **Folder:** `Persistence`
- **Requirement:** [FR-PERSIST: Cart persists across reloads, navigation, and sessions](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#fr-persist-cart-persists-across-reloads-navigation-and-sessions)
- **Tags:** `persistence`, `regression`
- **Priority:** Medium
- **Automation:** Manual
- **Precondition:** SP-2 — Cart preloaded with a known order
- **Steps:**

  | #   | Action                                                   | Expected result                                                                          |
  | --- | -------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
  | 1   | Open DevTools → Application → Local Storage for the site | A `cart` key exists                                                                      |
  | 2   | Inspect its value                                        | It is a JSON array of `{ id, quantity }` matching the cart (e.g. `p1`×1, `p2`×2, `d1`×1) |

#### BD-045 · Malformed stored cart data resets to an empty cart

- **Folder:** `Persistence`
- **Requirement:** [FR-HYDRATE: Malformed stored cart data resets safely](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#fr-hydrate-malformed-stored-cart-data-resets-safely)
- **Tags:** `persistence`, `edge-case`
- **Priority:** Low
- **Automation:** Manual
- **Precondition:** The site is open. In the console, set malformed data:
  `localStorage.setItem('cart', '{not valid json')` (or a non-array value like `'42'`).
- **Steps:**

  | #   | Action          | Expected result                                                      |
  | --- | --------------- | -------------------------------------------------------------------- |
  | 1   | Reload the page | The cart resets to empty (badge 0); no uncaught error in the console |
  | 2   | Open the cart   | It shows **"No items in your cart"**                                 |

---

## 7. Coverage summary

- **45 manual cases**, `BD-001…BD-045`, across the 9 folders in §3 (3 of them nested).
- **Shared preconditions** `SP-1/2/3` and **shared steps** `SS-1/2/3` are reused throughout:
  ~38 cases use a shared precondition and 12 use one or more shared steps — comfortably over half,
  as intended for the QA Sphere demo. A handful of cases (BD-005, BD-007…011, BD-045) use **inline**
  preconditions to showcase that option too.
- Every case links to exactly one requirement in [`REQUIREMENTS.md`](./REQUIREMENTS.md); see the
  traceability matrix there.
- The 15 automated cases that share these folders and entities are planned in
  [`AUTOMATED.md`](./AUTOMATED.md).
