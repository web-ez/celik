import { createContext, useState } from "react";

type SmartcardState = {
  card: string;
  device: string;
  devices: string[];
};
export const SmartcardContext = createContext<
  SmartcardState & {
    pickDevice: (dev: string) => void;
    setState: (fn: (prev: SmartcardState) => SmartcardState) => void;
  }
>({
  card: "",
  device: "",
  devices: [],
  pickDevice: () => {},
  setState: () => {},
});

const SmartcardProvider: React.FC = (props) => {
  const [state, setState] = useState<SmartcardState>({
    card: "",
    devices: [],
    device: "",
  });

  const pickHandler = (device: string) =>
    setState((prev) => {
      return { ...prev, device };
    });

  return (
    <SmartcardContext.Provider
      value={{
        ...state,
        pickDevice: pickHandler,
        setState,
      }}
    >
      {props.children}
    </SmartcardContext.Provider>
  );
};
export default SmartcardProvider;
