import { useState } from "react";
import useBridgeContext from "../../util/use-bridge-ctx";

import styles from "./Menubar.module.css";

const MINIMIZE_ICON = "/menubar/minimize.png";
const MAXIMIZE_ICON = (b: boolean) =>
  `/menubar/${b ? "maximized" : "maximize"}.png`;
const CLOSE_ICON = "/menubar/close.png";

const Menubar: React.FC = () => {
  const menuCtx = useBridgeContext("menu");

  const [maximized, setMaximized] = useState(false);

  const maximize = async () => {
    await menuCtx.maximize();
    setMaximized(await menuCtx.isMaximized());
  };

  return (
    <div className={styles.menubar}>
      <span>Card Reader</span>
      <div className={styles.right}>
        <div className={styles.btn} onClick={() => menuCtx.minimize()}>
          <img src={MINIMIZE_ICON} alt="" />
        </div>
        <div className={styles.btn} onClick={maximize}>
          <img src={MAXIMIZE_ICON(maximized)} alt="" />
        </div>
        <div className={styles.btn} onClick={() => menuCtx.close()}>
          <img src={CLOSE_ICON} alt="" />
        </div>
      </div>
    </div>
  );
};
export default Menubar;
