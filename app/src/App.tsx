import { useState } from "react";
import "./App.css";

import Layout from "./components/Layout/Layout";
import DeviceSelect from "./components/smartcard/DeviceSelect";
import Button from "./components/UI/Button";
import LKDisplay from "./components/display/LKDisplay";
import { LKData } from "./util/types";
import useBridgeContext from "./util/use-bridge-ctx";
import { useSmartcard } from "./context/smartcard";

function App() {
  const celikCtx = useBridgeContext("celik");
  const { device, card } = useSmartcard();

  const [data, setData] = useState<LKData | null>(null);

  if (!card && !!data) setData(null);

  const clickHandle = async () => {
    if (!card) return;

    try {
      await celikCtx.init(device);
      console.log("Fetching data...");
      const res = await celikCtx.getAllData();
      setData(res);
    } catch (e: any) {
      console.log("Error!", e);
    }
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
