import { render, screen } from '@testing-library/react';

import PriceDisplay from '../PriceDisplay';

// Mock UsePrice utility
jest.mock('@/components/utils/utils', () => ({
  UsePrice: jest.fn(({ amount, lang }) => {
    if (lang === 'en') {
      return `$${amount.toFixed(2)}`;
    }
    return `€${amount.toFixed(2)}`;
  }),
}));

describe('PriceDisplay', () => {
  it('should display sale price when available', () => {
    render(
      <PriceDisplay attributeValues={{ sale: { value: 100 } }} lang="en" />,
    );

    const priceElement = screen.getByTestId('product-price');
    expect(priceElement).toHaveTextContent('$100.00');
    expect(priceElement).toHaveClass('text-orange-500');
  });

  it('should display original price when no sale price', () => {
    render(
      <PriceDisplay attributeValues={{ price: { value: 150 } }} lang="en" />,
    );

    const priceElement = screen.getByTestId('product-price');
    expect(priceElement).toHaveTextContent('$150.00');
    expect(priceElement).toHaveClass('text-orange-500');
  });

  it('should display both sale and original prices with correct styling', () => {
    render(
      <PriceDisplay
        attributeValues={{
          sale: { value: 80 },
          price: { value: 100 },
        }}
        lang="en"
      />,
    );

    // Sale price should be orange
    const salePrice = screen.getByText('$80.00');
    expect(salePrice).toHaveClass('text-orange-500');

    // Original price should be grayed out
    const originalPrice = screen.getByText('$100.00');
    expect(originalPrice).toHaveClass('text-slate-300');
  });

  it('should return empty fragment when no prices available', () => {
    const { container } = render(
      <PriceDisplay attributeValues={{}} lang="en" />,
    );

    expect(container.firstChild).toBeNull();
  });

  it('should handle zero sale price', () => {
    render(
      <PriceDisplay
        attributeValues={{
          sale: { value: 0 },
          price: { value: 100 },
        }}
        lang="en"
      />,
    );

    // Should only show original price when sale is 0
    expect(screen.queryByText('$0.00')).not.toBeInTheDocument();
    const originalPrice = screen.getByTestId('product-price');
    expect(originalPrice).toHaveTextContent('$100.00');
  });

  it('should handle French locale', () => {
    render(
      <PriceDisplay attributeValues={{ sale: { value: 50 } }} lang="fr" />,
    );

    const priceElement = screen.getByTestId('product-price');
    expect(priceElement).toHaveTextContent('€50.00');
  });

  it('should have proper aria-labels for accessibility', () => {
    render(
      <PriceDisplay
        attributeValues={{
          sale: { value: 80 },
          price: { value: 100 },
        }}
        lang="en"
      />,
    );

    expect(screen.getByLabelText('New price: $80.00')).toBeInTheDocument();
    expect(
      screen.getByLabelText('Original price: $100.00'),
    ).toBeInTheDocument();
  });

  it('should apply correct data-testid only to displayed price', () => {
    const { rerender } = render(
      <PriceDisplay attributeValues={{ sale: { value: 50 } }} lang="en" />,
    );

    // When sale price exists, it should have data-testid
    expect(screen.getByTestId('product-price')).toBeInTheDocument();

    // When only original price, it should have data-testid
    rerender(
      <PriceDisplay attributeValues={{ price: { value: 100 } }} lang="en" />,
    );

    expect(screen.getByTestId('product-price')).toBeInTheDocument();
  });
});
