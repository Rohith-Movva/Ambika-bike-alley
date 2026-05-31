"use client";

import React from 'react';
import Link from 'next/link';

interface CheckoutStepsProps {
  step1?: boolean;
  step2?: boolean;
  step3?: boolean;
  step4?: boolean;
}

const CheckoutSteps = ({ step1, step2, step3, step4 }: CheckoutStepsProps) => {
  const steps = [
    { name: 'Sign In', active: step1, href: '/login' },
    { name: 'Shipping', active: step2, href: '/shipping' },
    { name: 'Payment', active: step3, href: '/payment' },
    { name: 'Place Order', active: step4, href: '/placeorder' },
  ];

  return (
    <nav className="flex justify-center items-center sm:space-x-8 max-w-xl mx-auto mb-10 text-sm font-medium">
      {steps.map((step, index) => (
        <React.Fragment key={step.name}>
          {/* Step Label */}
          {step.active ? (
            <Link href={step.href} className="text-blue-600 font-bold hover:text-blue-800 transition">
              {step.name}
            </Link>
          ) : (
            <span className="text-gray-400 cursor-not-allowed">{step.name}</span>
          )}

          {/* Separator Arrow (Don't show after the last step) */}
          {index < steps.length - 1 && (
            <span className="text-gray-300 mx-2 hidden sm:inline">&rarr;</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default CheckoutSteps;