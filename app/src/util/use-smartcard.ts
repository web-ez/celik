import { useEffect, useState } from "react";
import useBridgeContext from "./use-bridge-ctx";

export const useSmartcard = () => {
  const smartcardCtx = useBridgeContext("smartcard");

  const [devices, setDevices] = useState<string[]>([]);
  const [device, setDevice] = useState("");
  const [card, setCard] = useState("");

  useEffect(() => {
    smartcardCtx.getDevices().then((devs) => setDevices(devs));
  }, [smartcardCtx]);

  useEffect(() => {
    smartcardCtx.removeListeners("listenForDevices");
    smartcardCtx.listenForDevices((devs) => {
      console.log("Devices:", devs);
      setDevices(devs.map((d) => d.name));
    });
  }, [smartcardCtx]);

  useEffect(() => {
    if (!device) return;
    console.log("Picked device: ", device);
    smartcardCtx.waitForCard(device).then((x) => {
      console.log("Card Inserted", x);
      setCard(x);
    });
  }, [device, smartcardCtx]);

  useEffect(() => {
    if (!card) return;
    smartcardCtx.listenCardDisconnected(() => {
      console.log("Card Removed.");
      smartcardCtx.removeListeners("listenCardDisconnected");
      setCard("");
      setDevice("");
    });
  }, [card, smartcardCtx]);

  return {
    devices,
    device,
    card,
    pickDevice: setDevice,
  };
};
