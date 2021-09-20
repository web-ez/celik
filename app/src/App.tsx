import { useState } from "react";
import "./App.css";

import Layout from "./components/Layout/Layout";
import DeviceSelect from "./components/smartcard/DeviceSelect";
import Button from "./components/UI/Button";
import LKDisplay from "./components/display/LKDisplay";
import { LKData } from "./util/types";
import useBridgeContext from "./util/use-bridge-ctx";
import { useSmartcard } from "./util/use-smartcard";

function App() {
  const celikCtx = useBridgeContext("celik");
  const { device, card } = useSmartcard();

  const [data, setData] = useState<LKData | null>(null);

  if (!card && !!data) setData(null);

  const clickHandle = () => {
    if (!card) return;

    celikCtx.init(device).then((succ) => {
      if (succ) {
        console.log("Fetching data...");
        celikCtx.getAllData().then((v) => setData(v));
      } else {
        console.log("Error!");
      }
    });
  };

  return (
    <Layout>
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
          {data && <LKDisplay data={data} />}
        </div>
      </div>
    </Layout>
  );
}

export default App;
