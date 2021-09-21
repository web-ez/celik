import { useEffect, useState } from "react";
import { useSmartcard } from "../../context/smartcard";
import Button from "../UI/Button";

import styles from "./DeviceSelect.module.css";

const DeviceSelect: React.FC<{ autoSelect?: boolean }> = (props) => {
  const { device, devices, pickDevice } = useSmartcard();

  const [selectedDevice, setSelectedDevice] = useState("");

  useEffect(() => {
    if (
      selectedDevice === "" ||
      (devices.length > 0 && devices[0] !== selectedDevice)
    )
      setSelectedDevice(devices[0]);

    if (props.autoSelect && device === "")
      setTimeout(
        () => pickDevice(devices[0]),
        0
      ); /* setTimeout avoids render error! */
  }, [props.autoSelect, device, devices, selectedDevice, pickDevice]);

  return (
    <>
      <select
        className={styles.select}
        value={selectedDevice}
        onChange={(e) => setSelectedDevice(e.target.value)}
      >
        {[...devices].map((d, i) => (
          <option key={i} value={d}>
            {d}
          </option>
        ))}
      </select>
      <Button
        disabled={!selectedDevice || selectedDevice === device}
        onClick={() => pickDevice(selectedDevice)}
      >
        Pick
      </Button>
    </>
  );
};
export default DeviceSelect;
