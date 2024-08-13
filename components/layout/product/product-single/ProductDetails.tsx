import AddToCartButton from './AddToCartButton';

interface ProductDetailsProps {
  id: number;
  title: string;
  price: number;
  units: {
    value: number;
  };
}

const ProductDetails: React.FC<ProductDetailsProps> = ({
  id,
  title,
  price,
  units,
}) => {
  return (
    <div className="flex w-3/12 flex-col pt-1.5 max-md:mt-10 max-md:w-full">
      <h1 className="text-xl leading-6 text-neutral-600">{title}</h1>

      <p className="mt-3 text-sm leading-4 text-neutral-600">productType</p>

      <p className="mb-5 mt-4 text-left text-xl font-bold leading-8 text-neutral-600">
        $ {price}
      </p>

      <div className="relative box-border flex shrink-0 flex-col">
        <div className="self-end text-sm text-slate-300">
          {units.value} units
        </div>
        <div className="mt-1.5 flex flex-row justify-start rounded-xl bg-zinc-300 pr-16 max-md:pl-5">
          <div className="mr-auto h-[3px] w-[70%] shrink-0 rounded-xl bg-orange-500" />
        </div>
      </div>

      <AddToCartButton id={id} />
    </div>
  );
};

export default ProductDetails;
