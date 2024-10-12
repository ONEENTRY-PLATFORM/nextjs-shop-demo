'use client';

import type { Dispatch, FC } from 'react';
import { createContext } from 'react';
import { useState } from 'react';

type ContextProps = {
  completed: boolean;
  toggleCompleted: Dispatch<boolean>;
};

const TransitionContext = createContext<ContextProps>({
  completed: false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  toggleCompleted: function (value: boolean): void {},
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const TransitionProvider: FC<{ children: any }> = ({ children }) => {
  const [completed, setCompleted] = useState(false);

  const toggleCompleted = (value: boolean) => {
    setCompleted(value);
  };

  return (
    <TransitionContext.Provider value={{ completed, toggleCompleted }}>
      {children}
    </TransitionContext.Provider>
  );
};

export default TransitionContext;
