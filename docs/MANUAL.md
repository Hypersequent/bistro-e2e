# Bistro Delivery — Manual Test Plan

|                            |                                             |
| -------------------------- | ------------------------------------------- |
| **Document**               | Manual test cases (QA Sphere import plan)   |
| **Version**                | 1.0                                         |
| **Last updated**           | 2026-05-27                                  |
| **Application under test** | https://hypersequent.github.io/bistro/      |
| **Project code**           | `BD`                                        |
| **Behavioural reference**  | [`docs/CONTEXT.md`](./CONTEXT.md)           |
| **Requirements**           | [`docs/REQUIREMENTS.md`](./REQUIREMENTS.md) |
| **Automated counterpart**  | [`docs/AUTOMATED.md`](./AUTOMATED.md)       |

This file plans the **45 manual source test cases** (`BD-001…BD-056`) for the QA Sphere project,
including **4 template test cases** that generate filled/parameterized cases, alongside
the **shared preconditions** and **shared steps** they reuse. The 15 automated cases
(`BD-057…BD-071`) live in [`AUTOMATED.md`](./AUTOMATED.md) but share the same folders, tags, and
shared entities.

For convenience, this file **also documents manual reproduction steps for those 15 automated cases**,
filed in their matching folders (§6), so a QA can re-run a failing automated test by hand. Those
entries keep their `BD-057…BD-071` IDs, are marked `Automation = Automated`, and point to their
Playwright spec; their authoritative definition still lives in [`AUTOMATED.md`](./AUTOMATED.md).

---

## 1. Conventions

- **Test case IDs** — `BD-001 … BD-056` are the manual cases. `BD-057 … BD-071` are the automated
  cases ([`AUTOMATED.md`](./AUTOMATED.md)); their **manual reproduction steps** also appear in §6 so a
  failing automated test can be checked by hand. QA Sphere assigns the sequence; the IDs here are the
  human-readable `PROJECT-SEQ` form.
- **Folder** — the QA Sphere folder the case is filed under (paths are `/`-separated). Folders are
  shown in §3; manual and automated cases share the same folders.
- **Requirement** — every case links to exactly one requirement in `REQUIREMENTS.md`. Links use the
  hosted base `https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md`.
- **Tags** — feature (`navigation`, `menu`, `cart`, `checkout`, `order`, `persistence`, `about`,
  `responsive`) + lifecycle (`smoke`, `regression`, `edge-case`, `visual`). Automated cases also
  carry `automated`.
- **Automation (custom field)** — a QA Sphere dropdown custom field `automation` with values
  `Manual` / `Automated`. Every manual case below is `Manual`.
- **Type** — most cases are `Standalone`. Four manual cases are `Template` cases that use
  `${parameter_name}` variables and a parameter table to generate filled test cases.
- **Priority** — `Critical` / `High` / `Medium` / `Low`.
- **Precondition** — either a **shared precondition** (`SP-1`/`SP-2`/`SP-3`, §4) or inline rich
  text where the setup is case-specific.
- **Steps** — optionally one or two **shared steps** (`SS-1`/`SS-2`/`SS-3`/`SS-4`, §5) followed by
  case-specific Action / Expected rows.
- **Template parameters** — template cases define **Template variables**, **Template suffix params**,
  and **Parameter values**. If a template case relies on a shared step and needs values inside that
  shared step, the shared step itself must contain the `${parameter_name}` placeholders. `SS-4` is
  included specifically to demonstrate parameterized shared-step reuse.
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
Navigation & Layout/                 (BD-001…006, BD-057)
   └─ Responsive & Mobile Nav/       (BD-007…011)            ← nested
Menu/                                (BD-012…016, BD-058, BD-059)
Cart/                                (BD-020…021, BD-060…051)
   └─ Quantity & Removal/            (BD-028…026, BD-063…054) ← nested
Checkout/                            (BD-036…031, BD-066, BD-067)
   └─ Order Placement/               (BD-041…036, BD-068…059) ← nested
About & Content/                     (BD-048…041)
Persistence/                         (BD-053…045, BD-071)
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
> ![IMG-SP1 — Home page with an empty cart](https://qasphere-example.s3.amazonaws.com/bistro-v2/IMG-SP1.webp)
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
> ![IMG-SP2 — Cart modal with the known order](https://qasphere-example.s3.amazonaws.com/bistro-v2/IMG-SP2.webp)
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
> ![IMG-SP3 — Checkout order summary](https://qasphere-example.s3.amazonaws.com/bistro-v2/IMG-SP3.webp)
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
> ![IMG-SS1 — Add to cart updates the badge](https://qasphere-example.s3.amazonaws.com/bistro-v2/IMG-SS1.webp)
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
> ![IMG-SS2 — My cart modal](https://qasphere-example.s3.amazonaws.com/bistro-v2/IMG-SS2.webp)
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

### SS-4 — Fill the checkout form with parameterized customer data and place the order

> Used by template test cases. The placeholders live inside the shared step so QA Sphere can expose
> them in the template's parameter table and generate filled test cases from the shared-step content.
> Do **not** use this shared step from standalone/non-template cases; without template parameter
> values, `${customer_name}`, `${delivery_address}`, and `${payment_method}` remain unresolved text.

| #   | Action                                           | Expected result                                  |
| --- | ------------------------------------------------ | ------------------------------------------------ |
| 1   | Enter `${customer_name}` in **Name**             | The Name field contains `${customer_name}`       |
| 2   | Enter `${delivery_address}` in **Address**       | The Address field contains `${delivery_address}` |
| 3   | Select `${payment_method}` in **Payment Method** | `${payment_method}` is selected                  |
| 4   | Click **Place Order**                            | The form is replaced by the success confirmation |

---

## 6. Test cases

### 6.1 Navigation & Layout

#### BD-001 · Navbar links route to the correct pages

- **Folder:** `Navigation & Layout`
- **Requirement:** [NAV: Navbar links route correctly](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#nav-navbar-links-route-correctly)
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
- **Requirement:** [LOGO: Logo returns home](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#logo-logo-returns-home)
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
- **Requirement:** [MENULINK: Menu link scrolls to menu](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#menulink-menu-link-scrolls-to-menu)
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
- **Requirement:** [FOOTER: Footer shows QA Sphere link](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#footer-footer-shows-qa-sphere-link)
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
  > ![IMG-BD004 — Live footer attribution](https://qasphere-example.s3.amazonaws.com/bistro-v2/IMG-BD004.webp)
  >
  > - **Shows:** the footer text "Bistro Delivery - QA Sphere demo app" and its link.
  > - **How to capture:** desktop viewport, live URL, scrolled to the bottom of the home page.
  > - **Expectations:** the exact footer wording is legible (distinguishes the live site from the repo's older footer).

#### BD-005 · Page navigation uses smooth view transitions

- **Folder:** `Navigation & Layout`
- **Requirement:** [TRANSITION: Navigation uses smooth transitions](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#transition-navigation-uses-smooth-transitions)
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

  > 🖼️ **IMG-BD005 — View transition (before / after)**
  >
  > ![IMG-BD005 — View transition before/after pair](https://qasphere-example.s3.amazonaws.com/bistro-v2/IMG-BD005.webp)
  >
  > - **Shows:** a page-to-page transition captured mid-animation (cross-fade/slide).
  > - **How to capture:** Chromium desktop; trigger Home→About and capture during the transition.
  > - **Expectations:** the transition effect is visible; if impossible to capture mid-frame, capture before/after pair instead.

#### BD-006 · Navbar and footer are present on every page

- **Folder:** `Navigation & Layout`
- **Requirement:** [NAV: Navbar links route correctly](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#nav-navbar-links-route-correctly)
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

#### BD-057 · Navbar links navigate to the correct routes _(manual reproduction of automated BD-057)_

- **Folder:** `Navigation & Layout`
- **Requirement:** [NAV: Navbar links route correctly](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#nav-navbar-links-route-correctly)
- **Tags:** `navigation`, `automated`, `regression`
- **Priority:** High
- **Automation:** Automated (manual reproduction below)
- **Automated as:** `tests/navigation.spec.ts` → `test('BD-057: Navbar links navigate to the correct routes', …)`
- **Precondition:** SP-1 — App open with an empty cart
- **Steps:**

  | #   | Action                          | Expected result                                                                                                         |
  | --- | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
  | 1   | Click **Welcome** in the navbar | The home page loads; the address bar shows `/bistro/` and the hero heading **"Bistro Delivery"** is visible             |
  | 2   | Click **About us**              | The About page loads; the address bar shows `/bistro/about` and the heading **"Welcome to Bistro Delivery"** is visible |
  | 3   | Click **Today's Menu**          | The menu section is brought into view on the home page                                                                  |

### 6.2 Navigation & Layout / Responsive & Mobile Nav

#### BD-007 · Hamburger toggler appears on narrow viewports

- **Folder:** `Navigation & Layout/Responsive & Mobile Nav`
- **Requirement:** [RESPONSIVE: Navbar collapses on narrow screens](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#responsive-navbar-collapses-on-narrow-screens)
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
  > ![IMG-BD007 — Mobile navbar with hamburger](https://qasphere-example.s3.amazonaws.com/bistro-v2/IMG-BD007.webp)
  >
  > - **Shows:** the collapsed navbar with the hamburger toggler at mobile width.
  > - **How to capture:** 375×812 device emulation, home page, toggler closed.
  > - **Expectations:** the hamburger icon is clearly visible and the inline links are hidden.

#### BD-008 · Hamburger menu expands and collapses the nav links

- **Folder:** `Navigation & Layout/Responsive & Mobile Nav`
- **Requirement:** [RESPONSIVE: Navbar collapses on narrow screens](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#responsive-navbar-collapses-on-narrow-screens)
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
- **Requirement:** [RESPONSIVE: Navbar collapses on narrow screens](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#responsive-navbar-collapses-on-narrow-screens)
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
- **Requirement:** [MOBILE: Pages reflow on mobile](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#mobile-pages-reflow-on-mobile)
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
  > ![IMG-BD010 — Mobile home layout](https://qasphere-example.s3.amazonaws.com/bistro-v2/IMG-BD010.webp)
  >
  > - **Shows:** the home page reflowed for mobile (single column).
  > - **How to capture:** 375×812 device emulation, home page, menu section in frame.
  > - **Expectations:** no horizontal scrollbar, no overlapping elements, cards stacked cleanly.

#### BD-011 · Cart icon and badge remain reachable on mobile

- **Folder:** `Navigation & Layout/Responsive & Mobile Nav`
- **Requirement:** [MOBILE: Pages reflow on mobile](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#mobile-pages-reflow-on-mobile)
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
- **Requirement:** [MENU: Menu shows tabs with Pizzas active](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#menu-menu-shows-tabs-with-pizzas-active)
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

#### BD-013 · Switching menu tabs shows the selected category

- **Folder:** `Menu`
- **Requirement:** [TABS: Tabs reveal and mark categories](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#tabs-tabs-reveal-and-mark-categories)
- **Tags:** `menu`, `regression`
- **Priority:** High
- **Automation:** Manual
- **Type:** Template
- **Template variables:** `category`, `sample_item_1`, `sample_item_2`
- **Template suffix params:** `category`
- **Parameter values:**

  | Filled case         | category | sample_item_1 | sample_item_2 |
  | ------------------- | -------- | ------------- | ------------- |
  | Menu tab — Drinks   | Drinks   | Cappuccino    | Lemonade      |
  | Menu tab — Desserts | Desserts | Macarons      | Apple Pie     |
  | Menu tab — Pizzas   | Pizzas   | Cheese Pizza  | BBQ Chicken   |

- **Precondition:** SP-1 — App open with an empty cart
- **Steps:**

  | #   | Action                                                                       | Expected result                                                                                       |
  | --- | ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
  | 1   | Click the **`${category}`** tab                                              | The `${category}` panel becomes visible; the `${category}` tab is active; the other panels are hidden |
  | 2   | Verify visible item titles include `${sample_item_1}` and `${sample_item_2}` | Both sample items are visible in the selected category                                                |
  | 3   | Observe the browser URL and page state                                       | The page did not navigate or reload; only the visible menu category changed                           |

#### BD-017 · Menu item card shows title, price, description and Add-to-cart

- **Folder:** `Menu`
- **Requirement:** [CARD: Menu cards show item details](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#card-menu-cards-show-item-details)
- **Tags:** `menu`, `regression`
- **Priority:** High
- **Automation:** Manual
- **Precondition:** SP-1 — App open with an empty cart
- **Steps:**

  | #   | Action                                   | Expected result                                                             |
  | --- | ---------------------------------------- | --------------------------------------------------------------------------- |
  | 1   | Inspect a pizza card (e.g. Cheese Pizza) | It shows a title, price `$15`, a description, and an **Add to cart** button |
  | 2   | Inspect a drink and a dessert card       | Each shows title, price (`$<integer>`), description, and Add to cart        |

#### BD-018 · Pizzas show images; drinks and desserts do not

- **Folder:** `Menu`
- **Requirement:** [IMAGE: Pizzas show images only](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#image-pizzas-show-images-only)
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
  > ![IMG-BD015 — Image-less drink/dessert cards](https://qasphere-example.s3.amazonaws.com/bistro-v2/IMG-BD015.webp)
  >
  > - **Shows:** drink or dessert cards rendering cleanly with no image area.
  > - **How to capture:** desktop viewport, Drinks (or Desserts) tab active.
  > - **Expectations:** cards look intentional (no broken-image placeholder), title/price/description visible.

#### BD-019 · Menu content fades in on scroll (AOS)

- **Folder:** `Menu`
- **Requirement:** [ANIM: Menu animates on scroll](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#anim-menu-animates-on-scroll)
- **Tags:** `menu`, `visual`
- **Priority:** Low
- **Automation:** Manual
- **Precondition:** SP-1 — App open with an empty cart
- **Steps:**

  | #   | Action                                      | Expected result                                  |
  | --- | ------------------------------------------- | ------------------------------------------------ |
  | 1   | Reload and slowly scroll the menu into view | Cards fade/animate in as they enter the viewport |
  | 2   | After the animation settles                 | All cards are fully visible and interactive      |

  > 🖼️ **IMG-BD016 — Menu content (settled state)**
  >
  > ![IMG-BD016 — Menu content, settled state](https://qasphere-example.s3.amazonaws.com/bistro-v2/IMG-BD016.webp)
  >
  > - **Shows:** menu cards mid fade-in as the section scrolls into view.
  > - **How to capture:** desktop viewport; reload and capture during the scroll-in animation.
  > - **Expectations:** the partially-animated state is visible; if hard to capture, a settled state is acceptable.

#### BD-058 · Switching tabs reveals the matching category and active state _(manual reproduction of automated BD-058)_

- **Folder:** `Menu`
- **Requirement:** [TABS: Tabs reveal and mark categories](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#tabs-tabs-reveal-and-mark-categories)
- **Tags:** `menu`, `automated`, `regression`
- **Priority:** High
- **Automation:** Automated (manual reproduction below)
- **Automated as:** `tests/menu.spec.ts` → `test('BD-058: Switching tabs reveals the matching category and active state', …)`
- **Precondition:** SP-1 — App open with an empty cart
- **Steps:**

  | #   | Action                                      | Expected result                                                                           |
  | --- | ------------------------------------------- | ----------------------------------------------------------------------------------------- |
  | 1   | Open the menu and observe the default state | The **Pizzas** tab is highlighted active and the Pizzas panel is the one shown            |
  | 2   | Click the **Drinks** tab                    | The Drinks panel becomes visible and the Drinks tab is active; the Pizzas panel is hidden |
  | 3   | Click the **Desserts** tab                  | The Desserts panel becomes visible and the Desserts tab is active                         |

#### BD-059 · Item titles and prices match the menu data per category _(manual reproduction of automated BD-059)_

- **Folder:** `Menu`
- **Requirement:** [CARD: Menu cards show item details](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#card-menu-cards-show-item-details)
- **Tags:** `menu`, `automated`, `regression`
- **Priority:** High
- **Automation:** Automated (manual reproduction below)
- **Automated as:** `tests/menu.spec.ts` → `test('BD-059: Item titles and prices match the menu data per category', …)`
- **Precondition:** SP-1 — App open with an empty cart
- **Steps:**

  | #   | Action                                                   | Expected result                                                                                                                        |
  | --- | -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
  | 1   | On the **Pizzas** tab, check each card's title and price | Six pizzas — Cheese Pizza `$15`, Hot Pastrami `$25`, Classic Pizza `$20`, Country Pizza `$17`, Veggie Delight `$18`, BBQ Chicken `$22` |
  | 2   | Switch to **Drinks** and check each card                 | Six drinks — Cappuccino `$4`, Iced Coffee `$5`, Café Latte `$3`, Espresso `$4`, Green Tea `$3`, Lemonade `$4`                          |
  | 3   | Switch to **Desserts** and check each card               | Six desserts — Crème Brûlée `$16`, Tarte Tatin `$12`, Macarons `$10`, Chocolate Soufflé `$20`, Cheesecake `$14`, Apple Pie `$15`       |

### 6.4 Cart

#### BD-020 · Add a menu item to the cart

- **Folder:** `Cart`
- **Requirement:** [ADD: Add items to cart](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#add-add-items-to-cart)
- **Tags:** `cart`, `smoke`, `regression`
- **Priority:** Critical
- **Automation:** Manual
- **Type:** Template
- **Template variables:** `category`, `item_title`, `unit_price`
- **Template suffix params:** `category`, `item_title`
- **Parameter values:**

  | Filled case      | category | item_title   | unit_price |
  | ---------------- | -------- | ------------ | ---------- |
  | Add pizza item   | Pizzas   | Cheese Pizza | $15        |
  | Add drink item   | Drinks   | Cappuccino   | $4         |
  | Add dessert item | Desserts | Macarons     | $10        |

- **Precondition:** SP-1 — App open with an empty cart
- **Steps:**

  | #   | Action                                       | Expected result                                                                                 |
  | --- | -------------------------------------------- | ----------------------------------------------------------------------------------------------- |
  | 1   | Open the **`${category}`** tab               | The `${category}` panel is visible                                                              |
  | 2   | Click **Add to cart** on **`${item_title}`** | Cart badge becomes **1**                                                                        |
  | 3   | Open the cart modal                          | A single line for `${item_title}` is present with quantity **1** and line total `${unit_price}` |

#### BD-024 · Cart badge shows the total quantity across items

- **Folder:** `Cart`
- **Requirement:** [BADGE: Cart badge shows total quantity](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#badge-cart-badge-shows-total-quantity)
- **Tags:** `cart`, `regression`
- **Priority:** High
- **Automation:** Manual
- **Precondition:** SP-1 — App open with an empty cart
- **Steps:**

  | #   | Action                                  | Expected result                                             |
  | --- | --------------------------------------- | ----------------------------------------------------------- |
  | 1   | Add Cheese Pizza ×1 and Hot Pastrami ×2 | Badge shows **3** (sum of quantities, not 2 distinct items) |
  | 2   | Add Cappuccino ×1                       | Badge shows **4**                                           |

#### BD-025 · Cart line totals and Total row are correct

- **Folder:** `Cart`
- **Requirement:** [TOTAL: Totals calculate correctly](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#total-totals-calculate-correctly)
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

#### BD-026 · Cart modal opens and closes

- **Folder:** `Cart`
- **Requirement:** [MODAL: Cart modal opens and closes](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#modal-cart-modal-opens-and-closes)
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

#### BD-027 · Empty cart shows a message and hides Checkout

- **Folder:** `Cart`
- **Requirement:** [EMPTY: Empty cart shows a message](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#empty-empty-cart-shows-a-message)
- **Tags:** `cart`, `edge-case`
- **Priority:** Medium
- **Automation:** Manual
- **Precondition:** SP-1 — App open with an empty cart
- **Steps:**

  | #   | Action                                  | Expected result                             |
  | --- | --------------------------------------- | ------------------------------------------- |
  | 1   | Click the cart icon with no items added | The modal shows **"No items in your cart"** |
  | 2   | Look for a Checkout action              | **No Checkout button** is present           |

#### BD-060 · Add-to-cart increments the badge by total quantity _(manual reproduction of automated BD-060)_

- **Folder:** `Cart`
- **Requirement:** [BADGE: Cart badge shows total quantity](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#badge-cart-badge-shows-total-quantity)
- **Tags:** `cart`, `automated`, `regression`
- **Priority:** High
- **Automation:** Automated (manual reproduction below)
- **Automated as:** `tests/cart.spec.ts` → `test('BD-060: Add-to-cart increments the badge by total quantity', …)`
- **Precondition:** SP-1 — App open with an empty cart
- **Steps:**

  | #   | Action                                                              | Expected result                                |
  | --- | ------------------------------------------------------------------- | ---------------------------------------------- |
  | 1   | Add **Cheese Pizza** ×1 and **Hot Pastrami** ×2 from the Pizzas tab | The cart badge reads **3** (sum of quantities) |
  | 2   | Switch to **Drinks** and add **Cappuccino** ×1                      | The cart badge reads **4**                     |

#### BD-061 · Adding the same item twice yields one line with quantity 2 _(manual reproduction of automated BD-061)_

- **Folder:** `Cart`
- **Requirement:** [ADD: Add items to cart](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#add-add-items-to-cart)
- **Tags:** `cart`, `automated`, `regression`
- **Priority:** Critical
- **Automation:** Automated (manual reproduction below)
- **Automated as:** `tests/cart.spec.ts` → `test('BD-061: Adding the same item twice yields one line with quantity 2', …)`
- **Precondition:** SP-1 — App open with an empty cart
- **Steps:**

  | #   | Action                                                              | Expected result                                                                |
  | --- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
  | 1   | Click **Add to cart** on **Cheese Pizza** twice, then open the cart | A single Cheese Pizza line exists with quantity **2** (not two separate lines) |
  | 2   | Read the Cheese Pizza line total                                    | Line total is `$30` (15 × 2)                                                   |

#### BD-062 · Line totals and cart total compute correctly _(manual reproduction of automated BD-062)_

- **Folder:** `Cart`
- **Requirement:** [TOTAL: Totals calculate correctly](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#total-totals-calculate-correctly)
- **Tags:** `cart`, `automated`, `regression`
- **Priority:** Critical
- **Automation:** Automated (manual reproduction below)
- **Automated as:** `tests/cart.spec.ts` → `test('BD-062: Line totals and cart total compute correctly', …)`
- **Precondition:** SP-2 — Cart preloaded with a known order
- **Steps:**

  | #   | Action                                 | Expected result                                                |
  | --- | -------------------------------------- | -------------------------------------------------------------- |
  | 1   | Open the cart and read each line total | Cheese Pizza `$15`, Hot Pastrami `$50` (25×2), Cappuccino `$4` |
  | 2   | Read the **Total** row                 | Total is **$69** (sum of line totals)                          |

### 6.5 Cart / Quantity & Removal

#### BD-028 · Editing a cart quantity updates line and totals

- **Folder:** `Cart/Quantity & Removal`
- **Requirement:** [QTY: Quantity edits update totals](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#qty-quantity-edits-update-totals)
- **Tags:** `cart`, `regression`
- **Priority:** High
- **Automation:** Manual
- **Type:** Template
- **Template variables:** `item_title`, `new_quantity`, `expected_line_total`, `expected_cart_total`, `expected_badge`
- **Template suffix params:** `item_title`, `new_quantity`
- **Parameter values:**

  | Filled case          | item_title   | new_quantity | expected_line_total | expected_cart_total | expected_badge |
  | -------------------- | ------------ | -----------: | ------------------- | ------------------- | -------------: |
  | Raise pizza quantity | Cheese Pizza |            3 | $45                 | $99                 |              6 |
  | Lower pizza quantity | Hot Pastrami |            1 | $25                 | $44                 |              3 |
  | Raise drink quantity | Cappuccino   |            2 | $8                  | $73                 |              5 |

- **Precondition:** SP-2 — Cart preloaded with a known order
- **Shared steps:** SS-2 — Open the cart modal
- **Steps (after shared steps):**

  | #   | Action                                                   | Expected result                                                 |
  | --- | -------------------------------------------------------- | --------------------------------------------------------------- |
  | 1   | Change `${item_title}` quantity to **`${new_quantity}`** | The `${item_title}` line total becomes `${expected_line_total}` |
  | 2   | Read the **Total** row                                   | Cart total becomes `${expected_cart_total}`                     |
  | 3   | Observe the badge                                        | Badge shows `${expected_badge}`                                 |

#### BD-032 · Setting a quantity to 0 removes the item

- **Folder:** `Cart/Quantity & Removal`
- **Requirement:** [ZERO: Invalid quantities remove items](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#zero-invalid-quantities-remove-items)
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

#### BD-033 · Clearing or non-numeric quantity removes the item

- **Folder:** `Cart/Quantity & Removal`
- **Requirement:** [ZERO: Invalid quantities remove items](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#zero-invalid-quantities-remove-items)
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

#### BD-034 · Negative quantities are ignored

- **Folder:** `Cart/Quantity & Removal`
- **Requirement:** [NEG: Negative quantities are ignored](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#neg-negative-quantities-are-ignored)
- **Tags:** `cart`, `edge-case`
- **Priority:** Medium
- **Automation:** Manual
- **Precondition:** SP-2 — Cart preloaded with a known order
- **Shared steps:** SS-2 — Open the cart modal
- **Steps (after shared steps):**

  | #   | Action                                   | Expected result                                                                          |
  | --- | ---------------------------------------- | ---------------------------------------------------------------------------------------- |
  | 1   | Attempt to set a line quantity to **-1** | The cart is unchanged — the negative value is ignored (quantity and total stay the same) |

#### BD-035 · The remove (X) button deletes a line

- **Folder:** `Cart/Quantity & Removal`
- **Requirement:** [REMOVE: Remove button deletes a line](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#remove-remove-button-deletes-a-line)
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

#### BD-063 · Setting a quantity greater than zero updates totals _(manual reproduction of automated BD-063)_

- **Folder:** `Cart/Quantity & Removal`
- **Requirement:** [QTY: Quantity edits update totals](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#qty-quantity-edits-update-totals)
- **Tags:** `cart`, `automated`, `regression`
- **Priority:** High
- **Automation:** Automated (manual reproduction below)
- **Automated as:** `tests/quantity.spec.ts` → `test('BD-063: Setting a quantity greater than zero updates totals', …)`
- **Precondition:** SP-2 — Cart preloaded with a known order
- **Steps:**

  | #   | Action                                                          | Expected result                           |
  | --- | --------------------------------------------------------------- | ----------------------------------------- |
  | 1   | Open the cart and change the **Cheese Pizza** quantity to **3** | The Cheese Pizza line total becomes `$45` |
  | 2   | Read the **Total** row                                          | Total updates to **$99** (45 + 50 + 4)    |

#### BD-064 · Quantity 0 / empty / non-numeric removes the item _(manual reproduction of automated BD-064)_

- **Folder:** `Cart/Quantity & Removal`
- **Requirement:** [ZERO: Invalid quantities remove items](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#zero-invalid-quantities-remove-items)
- **Tags:** `cart`, `automated`, `edge-case`
- **Priority:** High
- **Automation:** Automated (manual reproduction below)
- **Automated as:** `tests/quantity.spec.ts` → `test('BD-064: Quantity 0, empty or non-numeric removes the item', …)`
- **Precondition:** SP-2 — Cart preloaded with a known order
- **Steps:**

  | #   | Action                                                                    | Expected result                                          |
  | --- | ------------------------------------------------------------------------- | -------------------------------------------------------- |
  | 1   | Open the cart and set the **Cappuccino** quantity to **0**                | The Cappuccino line is removed; the Total drops to `$65` |
  | 2   | Reset to SP-2, then clear the **Hot Pastrami** quantity (empty the field) | The Hot Pastrami line is removed (empty parsed as 0)     |
  | 3   | Reset to SP-2, then type `abc` into a quantity field                      | That line is removed (non-numeric parsed as 0)           |

#### BD-065 · The remove (X) button deletes the line _(manual reproduction of automated BD-065)_

- **Folder:** `Cart/Quantity & Removal`
- **Requirement:** [REMOVE: Remove button deletes a line](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#remove-remove-button-deletes-a-line)
- **Tags:** `cart`, `automated`, `regression`
- **Priority:** High
- **Automation:** Automated (manual reproduction below)
- **Automated as:** `tests/quantity.spec.ts` → `test('BD-065: The remove (X) button deletes the line', …)`
- **Precondition:** SP-2 — Cart preloaded with a known order
- **Steps:**

  | #   | Action                                                             | Expected result                               |
  | --- | ------------------------------------------------------------------ | --------------------------------------------- |
  | 1   | Open the cart and click the red **X** on the **Hot Pastrami** line | Only that line is removed                     |
  | 2   | Read the Total and badge                                           | Total is `$19` (15 + 4); the badge drops by 2 |

### 6.6 Checkout

#### BD-036 · Empty-cart direct navigation to checkout redirects home

- **Folder:** `Checkout`
- **Requirement:** [GUARD: Checkout requires a non-empty cart](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#guard-checkout-requires-a-non-empty-cart)
- **Tags:** `checkout`, `edge-case`
- **Priority:** High
- **Automation:** Manual
- **Precondition:** SP-1 — App open with an empty cart
- **Steps:**

  | #   | Action                                                                             | Expected result                                  |
  | --- | ---------------------------------------------------------------------------------- | ------------------------------------------------ |
  | 1   | Enter `https://hypersequent.github.io/bistro/checkout` directly in the address bar | The app **redirects to the home page**           |
  | 2   | Confirm the URL                                                                    | The browser ends on `/bistro/` (not `/checkout`) |

#### BD-037 · Order summary lists every cart line

- **Folder:** `Checkout`
- **Requirement:** [SUMMARY: Checkout summary matches cart](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#summary-checkout-summary-matches-cart)
- **Tags:** `checkout`, `regression`
- **Priority:** High
- **Automation:** Manual
- **Precondition:** SP-3 — On the Checkout page with a known order
- **Steps:**

  | #   | Action                          | Expected result                                                                    |
  | --- | ------------------------------- | ---------------------------------------------------------------------------------- |
  | 1   | Inspect the order summary table | Columns are **Image, Title, Count, Total Price**                                   |
  | 2   | Compare rows to the cart        | One row per item: Cheese Pizza ×1 `$15`, Hot Pastrami ×2 `$50`, Cappuccino ×1 `$4` |

#### BD-038 · Order summary total matches the cart total

- **Folder:** `Checkout`
- **Requirement:** [SUMMARY: Checkout summary matches cart](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#summary-checkout-summary-matches-cart)
- **Tags:** `checkout`, `regression`
- **Priority:** High
- **Automation:** Manual
- **Precondition:** SP-3 — On the Checkout page with a known order
- **Steps:**

  | #   | Action                                | Expected result                           |
  | --- | ------------------------------------- | ----------------------------------------- |
  | 1   | Read the **Total** row of the summary | Total is **$69** (matches the cart total) |

#### BD-039 · Name and Address are required to place an order

- **Folder:** `Checkout`
- **Requirement:** [FORM: Checkout requires name and address](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#form-checkout-requires-name-and-address)
- **Tags:** `checkout`, `regression`
- **Priority:** High
- **Automation:** Manual
- **Precondition:** SP-3 — On the Checkout page with a known order
- **Steps:**

  | #   | Action                                                    | Expected result                                                              |
  | --- | --------------------------------------------------------- | ---------------------------------------------------------------------------- |
  | 1   | Leave **Name** empty, fill Address, click **Place Order** | Submission is blocked; the Name field reports a required-field validation    |
  | 2   | Fill Name, clear **Address**, click **Place Order**       | Submission is blocked; the Address field reports a required-field validation |

#### BD-040 · Payment method offers Cash and Card on Delivery

- **Folder:** `Checkout`
- **Requirement:** [PAYMENT: Checkout offers cash and card](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#payment-checkout-offers-cash-and-card)
- **Tags:** `checkout`, `regression`
- **Priority:** Medium
- **Automation:** Manual
- **Precondition:** SP-3 — On the Checkout page with a known order
- **Steps:**

  | #   | Action                             | Expected result                                                        |
  | --- | ---------------------------------- | ---------------------------------------------------------------------- |
  | 1   | Open the **Payment Method** select | It lists exactly **Cash on Delivery** and **Card Payment on Delivery** |
  | 2   | Note the default                   | **Cash on Delivery** is preselected                                    |

#### BD-066 · Empty-cart direct navigation to checkout redirects home _(manual reproduction of automated BD-066)_

- **Folder:** `Checkout`
- **Requirement:** [GUARD: Checkout requires a non-empty cart](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#guard-checkout-requires-a-non-empty-cart)
- **Tags:** `checkout`, `automated`, `edge-case`
- **Priority:** High
- **Automation:** Automated (manual reproduction below)
- **Automated as:** `tests/checkout.spec.ts` → `test('BD-066: Empty-cart direct navigation to checkout redirects home', …)`
- **Precondition:** SP-1 — App open with an empty cart
- **Steps:**

  | #   | Action                                                                                                 | Expected result                                                                          |
  | --- | ------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- |
  | 1   | With an empty cart, enter `https://hypersequent.github.io/bistro/checkout` directly in the address bar | The app redirects to the home page; the address bar ends on `/bistro/` (not `/checkout`) |

#### BD-067 · Order summary matches the cart _(manual reproduction of automated BD-067)_

- **Folder:** `Checkout`
- **Requirement:** [SUMMARY: Checkout summary matches cart](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#summary-checkout-summary-matches-cart)
- **Tags:** `checkout`, `automated`, `regression`
- **Priority:** High
- **Automation:** Automated (manual reproduction below)
- **Automated as:** `tests/checkout.spec.ts` → `test('BD-067: Order summary matches the cart', …)`
- **Precondition:** SP-3 — On the Checkout page with a known order
- **Steps:**

  | #   | Action                                            | Expected result                                                  |
  | --- | ------------------------------------------------- | ---------------------------------------------------------------- |
  | 1   | On the Checkout page, read the order-summary rows | Cheese Pizza ×1 `$15`, Hot Pastrami ×2 `$50`, Cappuccino ×1 `$4` |
  | 2   | Read the **Total** row of the summary             | Total is **$69**, matching the cart                              |

### 6.7 Checkout / Order Placement

#### BD-041 · Place an order through the checkout form

- **Folder:** `Checkout/Order Placement`
- **Requirement:** [ORDER: Order confirmation echoes details](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#order-order-confirmation-echoes-details)
- **Tags:** `order`, `checkout`, `smoke`, `regression`
- **Priority:** Critical
- **Automation:** Manual
- **Type:** Template
- **Template variables:** `customer_name`, `delivery_address`, `payment_method`
- **Template suffix params:** `payment_method`
- **Parameter values:**

  | Filled case            | customer_name  | delivery_address      | payment_method           |
  | ---------------------- | -------------- | --------------------- | ------------------------ |
  | Cash order             | Jane Tester    | 12 Rue de Test, Paris | Cash on Delivery         |
  | Card-on-delivery order | Jules Verifier | 45 QA Avenue, Lyon    | Card Payment on Delivery |

- **Precondition:** SP-3 — On the Checkout page with a known order
- **Shared steps:** SS-4 — Fill the checkout form with parameterized customer data and place the order
- **Steps (after shared steps):**

  | #   | Action                             | Expected result                                                                                             |
  | --- | ---------------------------------- | ----------------------------------------------------------------------------------------------------------- |
  | 1   | Observe the page after Place Order | The form is replaced by **"Your order placed successfully!"**                                               |
  | 2   | Read the confirmation body         | It thanks `${customer_name}`, repeats `${delivery_address}`, and states `Payment method: ${payment_method}` |

  > 🖼️ **IMG-BD032 — Order success confirmation**
  >
  > ![IMG-BD032 — Order success confirmation](https://qasphere-example.s3.amazonaws.com/bistro-v2/IMG-BD032.webp)
  >
  > - **Shows:** the green success alert "Your order placed successfully!" echoing name, address, payment.
  > - **How to capture:** desktop viewport, after placing a Cash order from SP-3.
  > - **Expectations:** the heading and the echoed name/address/payment-method text are legible.

#### BD-044 · Place an order with Card Payment on Delivery

- **Folder:** `Checkout/Order Placement`
- **Requirement:** [ORDER: Order confirmation echoes details](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#order-order-confirmation-echoes-details)
- **Tags:** `order`, `checkout`, `regression`
- **Priority:** High
- **Automation:** Manual
- **Precondition:** SP-3 — On the Checkout page with a known order
- **Shared steps:** SS-3 — Fill the checkout form and place the order (select **Card Payment on Delivery**)
- **Steps (after shared steps):**

  | #   | Action                   | Expected result                                                                 |
  | --- | ------------------------ | ------------------------------------------------------------------------------- |
  | 1   | Observe the confirmation | Success message appears and states **Payment method: Card Payment on Delivery** |

#### BD-045 · Confirmation echoes the entered details

- **Folder:** `Checkout/Order Placement`
- **Requirement:** [ORDER: Order confirmation echoes details](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#order-order-confirmation-echoes-details)
- **Tags:** `order`, `checkout`, `regression`
- **Priority:** High
- **Automation:** Manual
- **Precondition:** SP-3 — On the Checkout page with a known order
- **Shared steps:** SS-3 — Fill the checkout form (Name `Jane Tester`, Address `12 Rue de Test, Paris`) and place the order
- **Steps (after shared steps):**

  | #   | Action                     | Expected result                                                                                                |
  | --- | -------------------------- | -------------------------------------------------------------------------------------------------------------- |
  | 1   | Read the confirmation text | It thanks **Jane Tester**, repeats the address **12 Rue de Test, Paris**, and states the chosen payment method |

#### BD-046 · Submitting with an empty Name is blocked

- **Folder:** `Checkout/Order Placement`
- **Requirement:** [FORM: Checkout requires name and address](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#form-checkout-requires-name-and-address)
- **Tags:** `order`, `checkout`, `edge-case`
- **Priority:** Medium
- **Automation:** Manual
- **Precondition:** SP-3 — On the Checkout page with a known order
- **Steps:**

  | #   | Action                                                     | Expected result                                                                         |
  | --- | ---------------------------------------------------------- | --------------------------------------------------------------------------------------- |
  | 1   | Fill Address only, leave Name empty, click **Place Order** | The order is not placed; no success message appears; the Name field is flagged required |

#### BD-047 · Placing an order does not clear the cart

- **Folder:** `Checkout/Order Placement`
- **Requirement:** [NOCLEAR: Order does not clear cart](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#noclear-order-does-not-clear-cart)
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

#### BD-068 · Place an order with Cash on Delivery shows success _(manual reproduction of automated BD-068)_

- **Folder:** `Checkout/Order Placement`
- **Requirement:** [ORDER: Order confirmation echoes details](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#order-order-confirmation-echoes-details)
- **Tags:** `order`, `checkout`, `automated`, `smoke`
- **Priority:** Critical
- **Automation:** Automated (manual reproduction below)
- **Automated as:** `tests/order.spec.ts` → `test('BD-068: Place an order with Cash on Delivery shows success', …)`
- **Precondition:** SP-3 — On the Checkout page with a known order
- **Shared steps:** SS-3 — Fill the checkout form and place the order (Name `Jane Tester`, Address `12 Rue de Test, Paris`, **Cash on Delivery**)
- **Steps (after shared steps):**

  | #   | Action                        | Expected result                                                                                                           |
  | --- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
  | 1   | Read the confirmation heading | It reads exactly **"Your order placed successfully!"**                                                                    |
  | 2   | Read the confirmation body    | It thanks **Jane Tester**, repeats the address **12 Rue de Test, Paris**, and states **Payment method: Cash on Delivery** |

#### BD-069 · Place an order with Card Payment on Delivery shows success _(manual reproduction of automated BD-069)_

- **Folder:** `Checkout/Order Placement`
- **Requirement:** [ORDER: Order confirmation echoes details](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#order-order-confirmation-echoes-details)
- **Tags:** `order`, `checkout`, `automated`, `regression`
- **Priority:** High
- **Automation:** Automated (manual reproduction below)
- **Automated as:** `tests/order.spec.ts` → `test('BD-069: Place an order with Card Payment on Delivery shows success', …)`
- **Precondition:** SP-3 — On the Checkout page with a known order
- **Shared steps:** SS-3 — Fill the checkout form and place the order (**Card Payment on Delivery**)
- **Steps (after shared steps):**

  | #   | Action                | Expected result                                                                     |
  | --- | --------------------- | ----------------------------------------------------------------------------------- |
  | 1   | Read the confirmation | The success message appears and states **Payment method: Card Payment on Delivery** |

#### BD-070 · Cart is not cleared after placing an order _(manual reproduction of automated BD-070)_

- **Folder:** `Checkout/Order Placement`
- **Requirement:** [NOCLEAR: Order does not clear cart](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#noclear-order-does-not-clear-cart)
- **Tags:** `order`, `checkout`, `automated`, `edge-case`
- **Priority:** Medium
- **Automation:** Automated (manual reproduction below)
- **Automated as:** `tests/order.spec.ts` → `test('BD-070: Cart is not cleared after placing an order', …)`
- **Precondition:** SP-3 — On the Checkout page with a known order
- **Shared steps:** SS-3 — Fill the checkout form and place the order
- **Steps (after shared steps):**

  | #   | Action                                                                          | Expected result                                                   |
  | --- | ------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
  | 1   | After the success message, navigate back to the **home page** and open the cart | The same three lines are still present (the cart was not cleared) |
  | 2   | Read the cart **Total**                                                         | Total is still **$69**                                            |

### 6.8 About & Content

#### BD-048 · About page heading and intro render

- **Folder:** `About & Content`
- **Requirement:** [ABOUT: About explains the demo purpose](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#about-about-explains-the-demo-purpose)
- **Tags:** `about`, `regression`
- **Priority:** Low
- **Automation:** Manual
- **Precondition:** SP-1 — App open with an empty cart
- **Steps:**

  | #   | Action              | Expected result                                                            |
  | --- | ------------------- | -------------------------------------------------------------------------- |
  | 1   | Open the About page | Heading reads **"Welcome to Bistro Delivery"** with intro paragraphs below |

#### BD-049 · About page explains the QA Sphere demo purpose

- **Folder:** `About & Content`
- **Requirement:** [ABOUT: About explains the demo purpose](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#about-about-explains-the-demo-purpose)
- **Tags:** `about`, `regression`
- **Priority:** Low
- **Automation:** Manual
- **Precondition:** SP-1 — App open with an empty cart
- **Steps:**

  | #   | Action              | Expected result                                                                       |
  | --- | ------------------- | ------------------------------------------------------------------------------------- |
  | 1   | Read the About copy | It states the app is a **QA Sphere** showcase and that you cannot actually order food |

#### BD-050 · About page links to qasphere.com

- **Folder:** `About & Content`
- **Requirement:** [ABOUT: About explains the demo purpose](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#about-about-explains-the-demo-purpose)
- **Tags:** `about`, `regression`
- **Priority:** Low
- **Automation:** Manual
- **Precondition:** SP-1 — App open with an empty cart
- **Steps:**

  | #   | Action                                         | Expected result                       |
  | --- | ---------------------------------------------- | ------------------------------------- |
  | 1   | Locate the QA Sphere link(s) in the About copy | A link to **qasphere.com** is present |
  | 2   | Activate the link                              | It navigates to the QA Sphere site    |

#### BD-051 · About page featured image renders

- **Folder:** `About & Content`
- **Requirement:** [ABOUT: About explains the demo purpose](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#about-about-explains-the-demo-purpose)
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
  > ![IMG-BD040 — About featured image](https://qasphere-example.s3.amazonaws.com/bistro-v2/IMG-BD040.webp)
  >
  > - **Shows:** the About page hero/featured image alongside the heading.
  > - **How to capture:** desktop viewport, About page top.
  > - **Expectations:** the image is fully loaded and the heading "Welcome to Bistro Delivery" is visible.

#### BD-052 · "About us" is reachable from the navbar

- **Folder:** `About & Content`
- **Requirement:** [ABOUT: About explains the demo purpose](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#about-about-explains-the-demo-purpose)
- **Tags:** `about`, `navigation`, `regression`
- **Priority:** Low
- **Automation:** Manual
- **Precondition:** SP-1 — App open with an empty cart
- **Steps:**

  | #   | Action                                 | Expected result                                   |
  | --- | -------------------------------------- | ------------------------------------------------- |
  | 1   | From the home page, click **About us** | The About page loads with its heading and content |

### 6.9 Persistence

#### BD-053 · Cart survives a page reload

- **Folder:** `Persistence`
- **Requirement:** [PERSIST: Cart persists across sessions](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#persist-cart-persists-across-sessions)
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

#### BD-054 · Cart survives navigation between pages

- **Folder:** `Persistence`
- **Requirement:** [PERSIST: Cart persists across sessions](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#persist-cart-persists-across-sessions)
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

#### BD-055 · Cart is stored in localStorage under the `cart` key

- **Folder:** `Persistence`
- **Requirement:** [PERSIST: Cart persists across sessions](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#persist-cart-persists-across-sessions)
- **Tags:** `persistence`, `regression`
- **Priority:** Medium
- **Automation:** Manual
- **Precondition:** SP-2 — Cart preloaded with a known order
- **Steps:**

  | #   | Action                                                   | Expected result                                                                          |
  | --- | -------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
  | 1   | Open DevTools → Application → Local Storage for the site | A `cart` key exists                                                                      |
  | 2   | Inspect its value                                        | It is a JSON array of `{ id, quantity }` matching the cart (e.g. `p1`×1, `p2`×2, `d1`×1) |

#### BD-056 · Malformed stored cart data resets to an empty cart

- **Folder:** `Persistence`
- **Requirement:** [HYDRATE: Malformed cart data resets safely](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#hydrate-malformed-cart-data-resets-safely)
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

#### BD-071 · Cart persists across a reload _(manual reproduction of automated BD-071)_

- **Folder:** `Persistence`
- **Requirement:** [PERSIST: Cart persists across sessions](https://github.com/Hypersequent/bistro-e2e/blob/main/docs/REQUIREMENTS.md#persist-cart-persists-across-sessions)
- **Tags:** `persistence`, `automated`, `regression`
- **Priority:** High
- **Automation:** Automated (manual reproduction below)
- **Automated as:** `tests/persistence.spec.ts` → `test('BD-071: Cart persists across a reload', …)`
- **Precondition:** SP-1 — App open with an empty cart
- **Shared steps:** SS-1 — Add items to the cart from the menu
- **Steps (after shared steps):**

  | #   | Action               | Expected result                                    |
  | --- | -------------------- | -------------------------------------------------- |
  | 1   | Reload the page (F5) | The cart badge still reads **4**                   |
  | 2   | Open the cart        | The same three lines and **$69** total are present |

---

## 7. Coverage summary

- **45 manual cases**, `BD-001…BD-056`, across the 9 folders in §3 (3 of them nested).
- **Manual reproductions of the 15 automated cases** (`BD-057…BD-071`) also appear in §6, filed in
  their matching folders, so a QA can verify a failing automated test by hand. These keep the
  `automated` tag and `Automation = Automated`; their authoritative spec is in
  [`AUTOMATED.md`](./AUTOMATED.md).
- **Shared preconditions** `SP-1/2/3` and **shared steps** `SS-1/2/3/4` are reused throughout:
  ~38 cases use a shared precondition and 12 use one or more shared steps — comfortably over half,
  as intended for the QA Sphere demo. `SS-4` is intentionally parameterized and should only be used
  by template cases with matching parameter values; `SS-1/2/3` remain safe for regular standalone
  cases. A handful of cases (BD-005, BD-007…011, BD-056) use **inline** preconditions to showcase
  that option too.
- Every case links to exactly one requirement in [`REQUIREMENTS.md`](./REQUIREMENTS.md); see the
  traceability matrix there.
- The 15 automated cases that share these folders and entities are planned in
  [`AUTOMATED.md`](./AUTOMATED.md).
