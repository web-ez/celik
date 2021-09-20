import { useState } from "react";
import "./App.css";
import DeviceSelect from "./components/smartcard/DeviceSelect";
import Button from "./components/UI/Button";
import useBridgeContext from "./util/use-bridge-ctx";
import { useSmartcard } from "./util/use-smartcard";

function App() {
  const celikCtx = useBridgeContext("celik");
  const { device, card } = useSmartcard();

  const [data, setData] = useState("");

  const clickHandle = () => {
    if (!card) return;

    celikCtx.init(device).then((succ) => {
      if (succ) {
        console.log("Fetching data...");
        celikCtx.getAllData().then((v) => setData(JSON.stringify(v, null, 2)));
      } else {
        console.log("Error!");
      }
    });
  };

  return (
    <div id="main">
      <div>
        <h1>Card Reader</h1>
        <DeviceSelect />
        <br />
        <br />
        <p>
          Device: {device || "<none>"} <br />
          Card: {card || (device ? "Waiting..." : "<none>")}
        </p>
        <Button onClick={clickHandle} disabled={!card}>
          Get Data
        </Button>
        {card && data && (
          <pre
            style={{
              background: "whitesmoke",
              color: "darkblue",
              fontSize: "1rem",
              padding: "1rem",
            }}
          >
            {data}
          </pre>
        )}
      </div>
    </div>
  );
}

export default App;
