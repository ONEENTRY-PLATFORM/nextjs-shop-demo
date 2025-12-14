import type { JSX } from 'react';

/**
 * Product units.
 * @param   {object}      props       - units props.
 * @param   {number}      props.units - units.
 * @returns {JSX.Element}             Product units component.
 */
const ProductUnits = ({ units }: { units: number }): JSX.Element => {
  /**
   * Set the maximum width of the progress bar
   * If units are less than 50, set max to 50, otherwise set to 120% of units
   */
  const maxUnits = units < 50 ? 50 : units * 1.2;

  /** Calculate the percentage width of the progress bar based on units */
  const width = (units / maxUnits) * 100;

  return (
    <div className="relative mb-6 box-border flex shrink-0 flex-col ">
      {/** Display the number of units available */}
      <div className="self-end text-sm text-slate-300">{units} units</div>
      {/** Progress bar container */}
      <div className="z-10 mt-1.5 flex w-full flex-row justify-start rounded-xl bg-zinc-300">
        {/** Progress bar showing the units level */}
        <div
          className={'mr-auto h-0.75 shrink-0 rounded-xl bg-orange-500'}
          style={{
            width: width + '%',
          }}
        />
      </div>
    </div>
  );
};

export default ProductUnits;
