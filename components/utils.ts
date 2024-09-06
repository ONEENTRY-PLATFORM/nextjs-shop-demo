export const UsePrice = ({
  amount,
  currency,
}: {
  amount: number | string;
  currency: string;
}) => {
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(Number(amount));

  return formattedPrice;
};
