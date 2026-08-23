import type { IAttributeValues } from 'oneentry/types';
import type { Dispatch, JSX, SetStateAction } from 'react';

const AnswerButton = ({
  // dict,
  state,
  setState,
}: {
  dict: IAttributeValues;
  state: boolean;
  setState: Dispatch<SetStateAction<boolean>>;
}): JSX.Element => {
  return (
    <button
      type="button"
      onClick={() => {
        setState(!state);
      }}
      className="cursor-pointer text-sm text-orange-500 hover:underline"
    >
      Leave answer
    </button>
  );
};

export default AnswerButton;
