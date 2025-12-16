// AnswerButton

import type { IAttributeValues } from 'oneentry/dist/base/utils';
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
      className="text-orange-500 text-sm cursor-pointer hover:underline"
    >
      Leave answer
    </button>
  );
};

export default AnswerButton;
