# E2E Tests for Bistro Delivery

This repository contains end-to-end tests for [Bistro Delivery](https://github.com/hypersequent/bistro), implemented using [Playwright](https://playwright.dev/).

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

3. Create `.env` file in the project root:

   ```bash
   DEMO_BASE_URL='https://hypersequent.github.io/bistro/'
   ```

   See `.env.example` for reference.

4. Install Playwright browsers and dependencies:
   ```bash
   npx playwright install --with-deps
   ```

## Running Tests

### Basic Test Execution

```bash
npm run test               # Run tests in Chromium
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
  npx qas-cli junit-upload --attachments junit-results/results.xml
  ```


# Additional Commands 

Different browsers: 
```bash
npm run chromium          # Run tests in Chromium
npm run firefox           # Run tests in Firefox
npm run webkit           # Run tests in WebKit
```

Playwright report: 
```bash
npm run play-report      # Open Playwright HTML report
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Maintained by [Hypersequent](https://github.com/Hypersequent)
