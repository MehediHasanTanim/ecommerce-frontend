import { create } from 'zustand';
import type { PaymentMethod } from '@/types/order';

export type CheckoutStep = 1 | 2 | 3;

interface CheckoutState {
  /** Currently selected address ID */
  selectedAddressId: string | null;
  /** Selected payment method (defaults to cod) */
  paymentMethod: PaymentMethod;
  /** Current checkout step (1=Address, 2=Review, 3=Place) */
  currentStep: CheckoutStep;
  /** Whether an order is being placed */
  isPlacingOrder: boolean;

  // Actions
  setSelectedAddress: (addressId: string) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setCurrentStep: (step: CheckoutStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  setIsPlacingOrder: (placing: boolean) => void;
  resetCheckout: () => void;
}

const initialState = {
  selectedAddressId: null,
  paymentMethod: 'cod' as PaymentMethod,
  currentStep: 1 as CheckoutStep,
  isPlacingOrder: false,
};

export const useCheckoutStore = create<CheckoutState>()((set, get) => ({
  ...initialState,

  setSelectedAddress: (addressId) => set({ selectedAddressId: addressId }),

  setPaymentMethod: (method) => set({ paymentMethod: method }),

  setCurrentStep: (step) => set({ currentStep: step }),

  nextStep: () => {
    const { currentStep } = get();
    if (currentStep < 3) {
      set({ currentStep: (currentStep + 1) as CheckoutStep });
    }
  },

  prevStep: () => {
    const { currentStep } = get();
    if (currentStep > 1) {
      set({ currentStep: (currentStep - 1) as CheckoutStep });
    }
  },

  setIsPlacingOrder: (placing) => set({ isPlacingOrder: placing }),

  resetCheckout: () => set({ ...initialState }),
}));
