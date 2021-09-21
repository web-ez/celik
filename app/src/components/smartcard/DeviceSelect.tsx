import { useState } from "react";
import { useSmartcard } from "../../context/smartcard";
import Button from "../UI/Button";

import styles from "./DeviceSelect.module.css";

const DeviceSelect: React.FC<{ autoSelect?: boolean }> = (props) => {
  const { devices, pickDevice } = useSmartcard();

  const [selectedDevice, setSelectedDevice] = useState("");

  if (props.autoSelect && devices.length > 0 && devices[0] !== selectedDevice)
    setSelectedDevice(devices[0]);

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
