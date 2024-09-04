export const UsePrice = ({
  amount,
  currency,
}: {
  amount: number;
  currency: string;
}) => {
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);

  return formattedPrice;
};
