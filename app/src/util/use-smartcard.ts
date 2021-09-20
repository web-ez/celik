import { useContext, useEffect } from "react";
import { SmartcardContext } from "../context/smartcard";
import useBridgeContext from "./use-bridge-ctx";

export const useSmartcard = () => {
  const smartcardCtx = useBridgeContext("smartcard");
  const { card, device, devices, pickDevice, setState } =
    useContext(SmartcardContext);

  useEffect(() => {
    smartcardCtx.getDevices().then((devs) =>
      setState((prev) => {
        return { ...prev, devices: devs };
      })
    );
  }, [smartcardCtx, setState]);

  useEffect(() => {
    smartcardCtx.removeListeners("listenForDevices");
    smartcardCtx.listenForDevices((devs) => {
      console.log("Devices:", devs);
      setState((prev) => {
        return { ...prev, devices: devs.map((d) => d.name) };
      });
    });
  }, [smartcardCtx, setState]);

  useEffect(() => {
    if (!device) return;
    console.log("Picked device: ", device);
    smartcardCtx.waitForCard(device).then((x) => {
      console.log("Card Inserted", x);
      setState((prev) => {
        return { ...prev, card: x };
      });
    });
  }, [device, smartcardCtx, setState]);

  useEffect(() => {
    if (!card) return;
    smartcardCtx.listenCardDisconnected(() => {
      console.log("Card Removed.");
      smartcardCtx.removeListeners("listenCardDisconnected");
      setState((prev) => {
        return { ...prev, card: "", device: "" };
      });
    });
  }, [card, smartcardCtx, setState]);

  return {
    card,
    device,
    devices,
    pickDevice,
  };
};
