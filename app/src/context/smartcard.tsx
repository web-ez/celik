import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import useBridgeContext from "../util/use-bridge-ctx";

type SmartcardState = {
  card: string;
  device: string;
  devices: string[];
};
export const SmartcardContext = createContext<
  SmartcardState & {
    pickDevice: (dev: string) => void;
    setState: (newState: Partial<SmartcardState>) => void;
  }
>({
  card: "",
  device: "",
  devices: [],
  pickDevice: () => {},
  setState: () => {},
});

const _logChanges = (
  prevState: SmartcardState,
  newState: Partial<SmartcardState>
) => {
  if (!!newState.device && newState.device !== prevState.device)
    console.log("Picked device: ", newState.device);
  if (!!newState.card && newState.card !== prevState.card)
    console.log("Card detected: ", newState.card);
  if (!!newState.devices) console.log("Devices: ", newState.devices);
  if (newState.card === "" && prevState.card !== "")
    console.log("Card removed.");
};

const SmartcardProvider: React.FC = (props) => {
  const smartcardCtx = useBridgeContext("smartcard");
  const [state, _setState] = useState<SmartcardState>({
    card: "",
    devices: [],
    device: "",
  });

  const setState = useCallback(
    (obj: Partial<SmartcardState>) => {
      _setState((prev) => {
        _logChanges(prev, obj);
        return { ...prev, ...obj };
      });
    },
    [_setState]
  );

  const pickHandler = (device: string) => setState({ device });

  useEffect(() => {
    /* Init Devices */
    smartcardCtx.getDevices().then((devs) => setState({ devices: devs }));
  }, [smartcardCtx, setState]);

  useEffect(() => {
    /* Listen for devices activate/deactivate */
    smartcardCtx.removeListeners("listenForDevices");
    smartcardCtx.listenForDevices((devs) =>
      setState({ devices: devs.map((d) => d.name) })
    );
  }, [smartcardCtx, setState]);

  useEffect(() => {
    if (!state.device) return;
    /* On Device Picked */
    smartcardCtx.waitForCard(state.device).then((x) => {
      setState({ card: x });
    });
  }, [state.device, smartcardCtx, setState]);

  useEffect(() => {
    if (!state.card) return;
    /* On Card Removed */
    smartcardCtx.listenCardDisconnected(() => {
      smartcardCtx.removeListeners("listenCardDisconnected");
      setState({ card: "", device: "" });
    });
  }, [state.card, smartcardCtx, setState]);

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

export const useSmartcard = () => {
  const {
    card,
    device,
    devices,
    pickDevice: pick,
  } = useContext(SmartcardContext);

  return {
    card,
    device,
    devices,
    pickDevice: (dev: string) => {
      if (dev !== device) pick(dev);
    },
  };
};
