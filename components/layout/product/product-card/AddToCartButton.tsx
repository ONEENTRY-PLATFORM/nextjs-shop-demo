'use client';

interface AddToCartProps {
  id: number;
}

const AddToCartButton: React.FC<AddToCartProps> = ({ id }) => {
  return (
    <button
      onClick={() => {
        console.log(id);
      }}
      className="rounded-3xl border border-solid border-orange-500 px-4 py-2.5 text-center text-sm font-bold text-orange-500"
    >
      ADD TO CART
    </button>
  );
};

export default AddToCartButton;
