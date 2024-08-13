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
      type="button"
      className="mt-6 rounded-[30px] border border-solid border-orange-500 bg-orange-500 px-5 py-4 text-center text-base font-bold uppercase text-white max-md:px-5"
    >
      Add to cart
    </button>
  );
};

export default AddToCartButton;
