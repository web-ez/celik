import { useState } from "react";
import { useSmartcard } from "../../util/use-smartcard";
import Button from "../UI/Button";

import styles from "./DeviceSelect.module.css";

const DeviceSelect: React.FC = () => {
  const { devices, pickDevice } = useSmartcard();

  const [selectedDevice, setSelectedDevice] = useState("");

  return (
    <>
      <select
        className={styles.select}
        value={selectedDevice}
        onChange={(e) => setSelectedDevice(e.target.value)}
      >
        {["", ...devices].map((d, i) => (
          <option key={i} value={d}>
            {d}
          </option>
        ))}
      </select>
      <Button
        disabled={!selectedDevice}
        onClick={() => pickDevice(selectedDevice)}
      >
        Pick
      </Button>
    </>
  );
};
export default DeviceSelect;
