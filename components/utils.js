export const UsePrice = ({ amount, currency }) => {
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);

  return formattedPrice;
};
