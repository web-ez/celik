import { useEffect, useState } from "react";
import "./App.css";
import useBridgeContext from "./util/use-bridge-ctx";

function App() {
  const smartcardCtx = useBridgeContext("smartcard");

  const [device, setDevice] = useState("");

  useEffect(() => {
    if (device) {
      console.log("Picked device: ", device);
      smartcardCtx.waitForCard(device).then((x) => {
        console.log(x);
      });
    }
  }, [device, smartcardCtx]);

  const clickHandle = () =>
    smartcardCtx.getDevices().then((devs: string[]) => {
      console.log(devs);
      setDevice(devs[0]);
    });

  return (
    <div>
      <h1>Hello World!</h1>
      <p>Bemis</p>
      <button onClick={clickHandle}>Get Devics</button>
    </div>
  );
}

export default App;
