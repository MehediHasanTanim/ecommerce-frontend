import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model for the Checkout Page (/checkout).
 */
export class CheckoutPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly stepper: Locator;
  readonly stepAddress: Locator;
  readonly stepReview: Locator;
  readonly stepComplete: Locator;
  readonly shippingAddressSection: Locator;
  readonly addressCards: Locator;
  readonly addAddressBtn: Locator;
  readonly paymentMethodSection: Locator;
  readonly continueToReviewBtn: Locator;
  readonly backToAddressBtn: Locator;
  readonly placeOrderBtn: Locator;
  readonly orderSummarySidebar: Locator;
  readonly grandTotal: Locator;
  readonly reviewItems: Locator;
  readonly emptyCartMessage: Locator;
  readonly processingText: Locator;
  readonly validationError: Locator;
  readonly loadingSkeleton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: /checkout/i, level: 1 });
    this.stepper = page.getByRole('navigation', { name: /checkout progress/i });

    // Step labels
    this.stepAddress = this.stepper.getByText('Address');
    this.stepReview = this.stepper.getByText('Review');
    this.stepComplete = this.stepper.getByText('Complete');

    // Address section
    this.shippingAddressSection = page.getByRole('heading', { name: /shipping address/i }).first();
    this.addressCards = page.getByRole('radio');
    this.addAddressBtn = page.getByRole('button', { name: /add address/i });

    // Payment section
    this.paymentMethodSection = page.getByText('Payment Method').first();

    // Navigation buttons
    this.continueToReviewBtn = page.getByRole('button', { name: /continue to review/i });
    this.backToAddressBtn = page.getByRole('button', { name: /back to address/i });
    this.placeOrderBtn = page.getByRole('button', { name: /place order/i });

    // Order summary
    this.orderSummarySidebar = page.getByText('Order Summary').first();
    this.grandTotal = page.getByText('Grand Total').first();

    // Review step
    this.reviewItems = page.getByText(/Review Your Order/i);

    // States
    this.emptyCartMessage = page.getByText(/your cart is empty/i);
    this.processingText = page.getByText(/processing your order/i);
    this.validationError = page.getByText(/please select a shipping address/i);
    this.loadingSkeleton = page.getByTestId('checkout-summary-skeleton');
  }

  async goto() {
    await this.page.goto('/checkout', { waitUntil: 'domcontentloaded' });
    await this.page.waitForTimeout(3000);
  }

  async selectFirstAddress() {
    const cards = this.addressCards;
    const count = await cards.count();
    if (count > 0) {
      await cards.first().click();
    }
  }

  async selectAddressByName(name: string) {
    const card = this.page.locator('[role="radio"]').filter({ hasText: name });
    await card.click();
  }

  async continueToReview() {
    await this.continueToReviewBtn.click();
    await this.page.waitForTimeout(1000);
  }

  async goBackToAddress() {
    await this.backToAddressBtn.click();
    await this.page.waitForTimeout(1000);
  }

  async clickPlaceOrder() {
    await this.placeOrderBtn.click();
  }

  async assertOnAddressStep() {
    await expect(this.shippingAddressSection).toBeVisible();
    await expect(this.continueToReviewBtn).toBeVisible();
  }

  async assertOnReviewStep() {
    await expect(this.reviewItems).toBeVisible();
  }

  async assertValidationError() {
    await expect(this.validationError).toBeVisible();
  }

  async assertProcessingState() {
    await expect(this.processingText).toBeVisible();
  }

  async assertPlaceOrderDisabled() {
    await expect(this.placeOrderBtn).toBeDisabled();
  }

  async assertPlaceOrderEnabled() {
    await expect(this.placeOrderBtn).toBeEnabled();
  }
}
