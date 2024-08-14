import React from 'react';

const QuantitySelector: React.FC<{ count: number }> = ({ count }) => {
  return (
    <div className="flex items-start justify-between gap-2 rounded-3xl bg-stone-50 p-2.5 max-sm:pr-2.5">
      <button
        className="relative box-border w-5 self-stretch"
        aria-label="Decrease quantity"
      >
        –
      </button>
      <input
        className="relative box-border w-10"
        type="text"
        name=""
        id=""
        value={count}
      />
      <button
        className="relative box-border w-5"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
};

export default QuantitySelector;
