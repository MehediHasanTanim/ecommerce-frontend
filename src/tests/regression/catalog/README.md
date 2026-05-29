# Catalog & Search Regression Automation

## Scope

This Playwright suite covers:

- Homepage catalog sections
- Product listing load and pagination
- Product detail navigation and invalid slug handling
- Category navigation and empty category state
- Search query flow and no-result behavior
- Filter sidebar and mobile drawer behavior
- Sorting and persisted sort query state

## Enablement

The suite is gated until the Catalog & Search UI implements the required `data-testid` contract.

Run active catalog E2E tests with:

```bash
CATALOG_E2E=1 npm run test:regression -- src/tests/regression/catalog/tests
```

Run the default regression suite, with catalog tests skipped:

```bash
npm run test:regression
```

## API Strategy

Tests use Playwright route mocking through `utils/apiMocks.ts` for:

- `GET /api/v1/products`
- `GET /api/v1/products/:slug`
- `GET /api/v1/products/search`
- `GET /api/v1/categories`
- `GET /api/v1/brands`

Fixtures are deterministic and stored under `fixtures/`.

## Required Selectors

Catalog UI should expose stable selectors:

- `home-promo-banner`
- `home-featured-products`
- `home-categories`
- `home-brands`
- `category-link-{slug}`
- `product-grid`
- `product-card`
- `product-card-image`
- `product-card-price`
- `product-card-effective-price`
- `product-card-availability`
- `product-loading-state`
- `product-empty-state`
- `pagination-next`
- `product-sort-select`
- `product-detail-title`
- `product-image-gallery`
- `product-detail-price`
- `product-detail-description`
- `product-detail-brand`
- `product-detail-category`
- `product-detail-stock-status`
- `product-variant-option`
- `product-detail-error-state`
- `category-title`
- `category-description`
- `category-empty-state`
- `catalog-search-input`
- `catalog-search-submit`
- `search-empty-state`
- `filters-mobile-open`
- `filters-clear-all`
- `filter-category-{slug}`
- `filter-brand-{slug}`
- `filter-min-price`
- `filter-max-price`
- `filter-availability-{value}`
- `clear-search`

## CI Example

Default CI can keep using:

```bash
npm run test:regression
```

Enable catalog regression once the UI is complete:

```yaml
- name: Run Catalog Regression
  run: CATALOG_E2E=1 npm run test:regression -- src/tests/regression/catalog/tests
```
