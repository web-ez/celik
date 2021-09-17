import { useEffect } from "react";
import "./App.css";
import useBridgeContext from "./util/use-bridge-ctx";
import { useSmartcard } from "./util/use-smartcard";

function App() {
  const celikCtx = useBridgeContext("celik");
  const { device, devices, card, pickDevice } = useSmartcard();

  useEffect(() => {
    if (!card) return;

    celikCtx.init(device).then((succ) => {
      if (succ) {
        console.log("Fetching data...");
        celikCtx.getAllData().then((v) => console.log(v));
      } else {
        console.log("Error!");
      }
    });
  }, [card, device, celikCtx]);

  const clickHandle = () => pickDevice(devices[0]);

  return (
    <div>
      <h1>Hello World!</h1>
      <p>Bemis</p>
      <p>Available Devices: {devices}</p>
      <br />
      <br />
      <p>
        Device: {device} <br />
        Card: {card}
      </p>
      <button onClick={clickHandle}>Pick Device [0]</button>
    </div>
  );
}

export default App;
