import {createContext, ReactNode, useContext, useState} from 'react';

interface IProps {
  children: ReactNode;
}

interface IValue {
  step: number;
}

interface IAction {
  update(to: number): void;
}

const Value = createContext<IValue | null>(null);
const Action = createContext<IAction | null>(null);
export const FormStackProvider = ({children}: IProps) => {
  const [step, setStep] = useState(0);
  const handleUpdateStep = (to: number) => {
    setStep(to);
  };
  return (
    <Action.Provider value={{update: handleUpdateStep}}>
      <Value.Provider value={{step}}>{children}</Value.Provider>
    </Action.Provider>
  );
};

export const useFormStackAction = () => {
  const context = useContext(Action);

  if (context === null) {
    throw new Error('Cannot access context');
  }

  return context;
};
export const useFormStackValue = () => {
  const context = useContext(Value);

  if (context === null) {
    throw new Error('Cannot access context');
  }

  return context;
};
