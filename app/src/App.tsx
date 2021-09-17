import { useEffect, useState } from "react";
import "./App.css";
import useBridgeContext from "./util/use-bridge-ctx";
import { useSmartcard } from "./util/use-smartcard";

function App() {
  const celikCtx = useBridgeContext("celik");
  const { device, devices, card, pickDevice } = useSmartcard();

  const [selectedDevice, setSelectedDevice] = useState("");

  console.log("Loaded.");

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

  const clickHandle = () => pickDevice(selectedDevice);

  return (
    <div>
      <h1>Hello World!</h1>
      <p>Bemis</p>
      <p>Available Devices: {devices}</p>
      <select onChange={(e) => setSelectedDevice(e.target.value)}>
        {devices.map((d, i) => (
          <option key={i} value={d}>
            {d}
          </option>
        ))}
        <option value="XD">XD</option>
      </select>
      <br />
      <br />
      <p>
        Device: {device} <br />
        Card: {card}
      </p>
      <button onClick={clickHandle}>Pick 1st Device</button>
    </div>
  );
}

export default App;
