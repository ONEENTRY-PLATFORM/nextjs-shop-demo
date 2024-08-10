import type { Dispatch } from 'react';

type QuantityProps = {
  count: number;
  setCount?: Dispatch<number>;
  isZeroValue?: boolean;
  action: (operator: '+' | '-') => void;
};

export const Quantity = ({
  count,
  // setCount,
  action,
  isZeroValue = false,
}: QuantityProps) => {
  return (
    <>
      <div>
        <button
          disabled={!isZeroValue ? count < 2 : count < 1}
          onClick={() => {
            action('-');
            // setCount && setCount(count - 1);
          }}
        >
          -
        </button>
        <p>{count}</p>
        <button
          onClick={() => {
            action('+');
            // setCount && setCount(count + 1);
          }}
        >
          +
        </button>
      </div>
    </>
  );
};
