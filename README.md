# E2E Tests for Bistro Delivery

This repository contains end-to-end tests for [Bistro Delivery](https://github.com/hypersequent/bistro), implemented using [Playwright](https://playwright.dev/).

The suite implements the **15 automated test cases `BD-046…BD-060`** planned in
[`food-delivery-demo/docs/AUTOMATED.md`](https://github.com/Hypersequent/food-delivery-demo/blob/main/docs/AUTOMATED.md)
(see also [`CONTEXT.md`](https://github.com/Hypersequent/food-delivery-demo/blob/main/docs/CONTEXT.md) and
[`MANUAL.md`](https://github.com/Hypersequent/food-delivery-demo/blob/main/docs/MANUAL.md)). Every test
title starts with its `BD-###:` marker so [qas-cli](https://github.com/Hypersequent/qas-cli) can match
uploaded results to the QA Sphere test cases:

| Spec file                   | Cases                  |
| --------------------------- | ---------------------- |
| `tests/navigation.spec.ts`  | BD-046                 |
| `tests/menu.spec.ts`        | BD-047, BD-048         |
| `tests/cart.spec.ts`        | BD-049, BD-050, BD-051 |
| `tests/quantity.spec.ts`    | BD-052, BD-053, BD-054 |
| `tests/checkout.spec.ts`    | BD-055, BD-056         |
| `tests/order.spec.ts`       | BD-057, BD-058, BD-059 |
| `tests/persistence.spec.ts` | BD-060                 |

Tests run against the live demo (`DEMO_BASE_URL`, default `https://hypersequent.github.io/bistro/`).

Prerequisites: Node.js 20+ (with npm)

## Getting Started

1. Clone the repository:

   ```bash
   git clone git@github.com:Hypersequent/bistro-e2e.git
   cd bistro-e2e
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Install Playwright browsers and dependencies:
   ```bash
   npx playwright install --with-deps
   ```

## Running Tests

### Basic Test Execution

```bash
npm run test              # Run tests in Chromium
npm run test-head         # Run tests in headed mode
```

### Upload testing results to QA Sphere

1. Add your QA Sphere credentials to the .env file:

   ```bash
   QAS_TOKEN=<QA Sphere API Token>
   # Get your token in QA Sphere -> Settings -> API Keys

   QAS_URL=<QA Sphere Company URL>
   # Example: https://qasdemo.eu2.qasphere.com
   ```

2. Upload results:

   ```bash
   npx qas-cli junit-upload --attachments junit-results/results.xml      # For JUnit XML
   npx qas-cli playwright-json-upload --attachments ./test-results.json  # For Playwright JSON
   ```

# Additional Commands

Different browsers:

```bash
npm run chromium          # Run tests in Chromium
npm run firefox           # Run tests in Firefox
npm run webkit            # Run tests in WebKit
```

Playwright report:

```bash
npm run play-report       # Open Playwright HTML report
```

## License

This project is licensed under the 0BSD License - see the [LICENSE](LICENSE) file for details.

---

Maintained by [Hypersequent](https://github.com/Hypersequent)
