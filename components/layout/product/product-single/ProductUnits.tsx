// ProductUnits

const ProductUnits = ({ units }: { units: number }) => {
  const maxUnits = 50;
  const width = (units / maxUnits) * 100;

  return (
    <div className="relative mb-6 box-border flex shrink-0 flex-col ">
      <div className="self-end text-sm text-slate-300">{units} units</div>
      <div className="z-10 mt-1.5 flex w-full flex-row justify-start rounded-xl bg-zinc-300">
        <div
          className={'mr-auto h-[3px] shrink-0 rounded-xl bg-orange-500'}
          style={{
            width: width + '%',
          }}
        />
      </div>
    </div>
  );
};

export default ProductUnits;
