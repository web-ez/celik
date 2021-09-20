import { useState } from "react";
import "./App.css";
import Layout from "./components/Layout/Layout";
import DeviceSelect from "./components/smartcard/DeviceSelect";
import Button from "./components/UI/Button";
import { toBase64Src } from "./util/to-base64";
import useBridgeContext from "./util/use-bridge-ctx";
import { useSmartcard } from "./util/use-smartcard";

type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T;

function App() {
  const celikCtx = useBridgeContext("celik");
  const { device, card } = useSmartcard();

  const [data, setData] = useState<Awaited<
    ReturnType<typeof celikCtx.getAllData>
  > | null>(null);

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
          {data && (
            <div
              style={{
                background: "whitesmoke",
                color: "darkblue",
                fontSize: "1rem",
                padding: "5px 1rem 1rem",
                margin: "1rem 2rem",
              }}
            >
              <p>{data.sex}</p>
              <img
                width={120}
                src={toBase64Src(data.portrait)}
                alt={data.givenName + " " + data.surname}
              />
              <p>
                {data.givenName} ({data.parentGivenName}) {data.surname}
              </p>
              <p>
                {data.dateOfBirth} {data.communityOfBirth}, {data.placeOfBirth},{" "}
                {data.stateOfBirth}
              </p>
              <p>
                {data.street} {data.houseNumber}
                {data.houseLetter}, {data.apartmentNumber} <br />
                {data.community}, {data.place} ({data.state})
              </p>
              <p>{data.docRegNo}</p>
              <p>{data.personalNumber}</p>
              <p>{data.issuingAuthority}</p>
              <p>
                {data.issuingDate} - {data.expiryDate}
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default App;
