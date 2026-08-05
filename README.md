# E2E Tests for Bistro Delivery

This repository contains end-to-end tests for [Bistro Delivery](https://github.com/hypersequent/bistro), implemented using [Playwright](https://playwright.dev/).

The suite covers the 15 automated test cases of the QA Sphere project `BD`, spread over seven spec
files that mirror the QA Sphere folders:

| Spec file                   | Cases                  |
| --------------------------- | ---------------------- |
| `tests/navigation.spec.ts`  | BD-057                 |
| `tests/menu.spec.ts`        | BD-058, BD-059         |
| `tests/cart.spec.ts`        | BD-060, BD-061, BD-062 |
| `tests/quantity.spec.ts`    | BD-063, BD-064, BD-065 |
| `tests/checkout.spec.ts`    | BD-066, BD-067         |
| `tests/order.spec.ts`       | BD-068, BD-069, BD-070 |
| `tests/persistence.spec.ts` | BD-071                 |

The test cases and the requirements they trace to live in the application repository:
[`REQUIREMENTS.md`](https://github.com/Hypersequent/bistro/blob/main/docs/REQUIREMENTS.md) and
[`AUTOMATED.md`](https://github.com/Hypersequent/bistro/blob/main/docs/AUTOMATED.md) (see
[`docs/`](https://github.com/Hypersequent/bistro/blob/main/docs/) for the full set).

Prerequisites: Node.js 22+ (with npm) — qas-cli, used to upload results, requires Node.js 22 or newer.

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

Results are uploaded with [qas-cli](https://github.com/Hypersequent/qas-cli), a pinned
devDependency of this repository. Its binary is named `qasphere`, so `npm install` is enough to run
the commands below via `npx qasphere …`.

1. Provide your QA Sphere credentials, either in a `.env` file, as environment variables, or in a
   `.qaspherecli` file:

   ```bash
   QAS_TOKEN=<QA Sphere API Token>
   # Get your token in QA Sphere -> Settings -> API Keys

   QAS_URL=<QA Sphere Company URL>
   # Example: https://qasdemo.eu2.qasphere.com
   ```

2. Run the suite against a single browser. The configured reporters write `./test-results.json`
   (Playwright JSON) and `./junit-results/results.xml` (JUnit XML), plus screenshots for every test:

   ```bash
   npm run test   # Chromium only
   ```

   Do not upload a report produced by a multi-browser run: qas-cli reads only the first project's
   execution of each spec, so the other browsers' results are silently dropped.

3. Upload the results. Either report format works — pick one:

   ```bash
   # Playwright JSON (recommended: richer status and attachment support)
   npx qasphere playwright-json-upload \
     --project-code BD \
     --run-name "Bistro Delivery — {YYYY}-{MM}-{DD} {HH}:{mm}" \
     --attachments \
     ./test-results.json

   # JUnit XML
   npx qasphere junit-upload \
     --project-code BD \
     --run-name "Bistro Delivery — {YYYY}-{MM}-{DD} {HH}:{mm}" \
     --attachments \
     ./junit-results/results.xml
   ```

   `npm run upload` runs the Playwright JSON variant with the defaults above. `--run-name` accepts
   the `{YYYY}`, `{MM}`, `{DD}`, `{HH}` and `{mm}` placeholders; pass `-r <run URL>` instead to
   upload into an existing run.

#### Matching tests to QA Sphere test cases

qas-cli matches a result to a test case by finding a `<project code>-<sequence>` marker in the
`test(...)` title, using the pattern `/\b([A-Za-z0-9]{1,5})-(\d{3,})\b/`. Two consequences:

- The sequence needs **at least three digits**, so it must be zero-padded: test case `BD-57` in QA
  Sphere is written `BD-057` in the test title. The padding is stripped when matching, so `BD-057`
  resolves to sequence 57.
- Keep the marker in the **`test(...)` title**. `playwright-json-upload` reads only the spec title,
  so a marker on the enclosing `describe(...)` is not seen. `junit-upload` does see it, because
  Playwright's JUnit reporter writes the name as `describe › test`; marking `test(...)` works for
  both.

```ts
test('BD-057: Navbar links navigate to the correct routes', async ({ page }) => {
	/* … */
})
```

As an alternative, a Playwright annotation whose `type` contains `test case` and whose `description`
is the full test case URL matches too. This suite uses title markers throughout; use one convention
consistently.

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
