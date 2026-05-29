export const catalogRegressionFlag = process.env.CATALOG_E2E === '1';

export function skipIfCatalogE2EDisabled() {
  return !catalogRegressionFlag;
}
