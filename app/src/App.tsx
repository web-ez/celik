import { useEffect, useState } from "react";
import "./App.css";
import useBridgeContext from "./util/use-bridge-ctx";

function App() {
  const smartcardCtx = useBridgeContext("smartcard");

  const [device, setDevice] = useState("");
  const [card, setCard] = useState("");

  useEffect(() => {
    smartcardCtx.listenForDevices((d) => {
      console.log("Devices:");
      console.log(d);
    });
  }, [smartcardCtx]);

  useEffect(() => {
    if (device) {
      console.log("Picked device: ", device);
      smartcardCtx.waitForCard(device).then((x) => {
        console.log(x);
        setCard(x);
      });
    }
  }, [device, smartcardCtx]);

  useEffect(() => {
    if (card) {
      console.log("Work with card...");
      smartcardCtx.listenCardDisconnected(() => {
        console.log("Card Disconnected.");
        setCard("");
      });
    }
  }, [card, smartcardCtx]);

  const clickHandle = () =>
    smartcardCtx.getDevices().then((devs: string[]) => {
      console.log(devs);
      setDevice(devs[0]);
    });

  return (
    <div>
      <h1>Hello World!</h1>
      <p>Bemis</p>
      <p>
        Device: {device} <br />
        Card: {card}
      </p>
      <button onClick={clickHandle}>Get Devics</button>
    </div>
  );
}

export default App;
