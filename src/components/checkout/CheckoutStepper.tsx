'use client';

import React from 'react';
import { Check } from 'lucide-react';
import type { CheckoutStep } from '@/store/checkout-store';

interface CheckoutStepperProps {
  currentStep: CheckoutStep;
  className?: string;
}

const STEPS: { step: CheckoutStep; label: string }[] = [
  { step: 1, label: 'Address' },
  { step: 2, label: 'Review' },
  { step: 3, label: 'Complete' },
];

export const CheckoutStepper = React.memo(function CheckoutStepper({
  currentStep,
  className = '',
}: CheckoutStepperProps) {
  return (
    <nav aria-label="Checkout progress" className={`w-full ${className}`}>
      <ol className="flex items-center justify-center gap-0">
        {STEPS.map((s, idx) => {
          const isCompleted = currentStep > s.step;
          const isCurrent = currentStep === s.step;

          return (
            <li key={s.step} className="flex items-center flex-1 last:flex-none">
              {/* Step circle & label */}
              <div className="flex flex-col items-center relative">
                <span
                  className={`
                    flex items-center justify-center w-10 h-10 rounded-full text-sm font-semibold
                    transition-colors duration-200 border-2
                    ${isCompleted ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]' : ''}
                    ${isCurrent ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]' : ''}
                    ${!isCompleted && !isCurrent ? 'bg-transparent text-gray-400 border-gray-300 dark:border-gray-600' : ''}
                  `}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {isCompleted ? <Check size={16} /> : s.step}
                </span>
                <span
                  className={`
                    mt-2 text-xs font-medium whitespace-nowrap
                    ${isCurrent || isCompleted ? 'text-[var(--color-primary)]' : 'text-gray-400'}
                  `}
                >
                  {s.label}
                </span>
              </div>

              {/* Connector line */}
              {idx < STEPS.length - 1 && (
                <div
                  className={`
                    flex-1 h-0.5 mx-2 mt-[-1.25rem]
                    transition-colors duration-200
                    ${isCompleted ? 'bg-[var(--color-primary)]' : 'bg-gray-200 dark:bg-gray-700'}
                  `}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
});
