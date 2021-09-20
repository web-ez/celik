import { useState } from "react";
import useBridgeContext from "../../util/use-bridge-ctx";
import styles from "./Layout.module.css";

const Layout: React.FC = (props) => {
  const menuCtx = useBridgeContext("menu");
  const [maximized, setMaximized] = useState(false);

  const maximize = async () => {
    await menuCtx.maximize();
    setMaximized(await menuCtx.isMaximized());
  };

  return (
    <>
      <div className={styles.menubar}>
        <span>Card Reader</span>
        <div className={styles.right}>
          <div className={styles.btn} onClick={() => menuCtx.minimize()}>
            <img src="/minimize.png" alt="" />
          </div>
          <div className={styles.btn} onClick={maximize}>
            <img src={maximized ? "/maximized.png" : "/maximize.png"} alt="" />
          </div>
          <div className={styles.btn} onClick={() => menuCtx.close()}>
            <img src="/close.png" alt="" />
          </div>
        </div>
      </div>
      <div className={styles.container}>{props.children}</div>
    </>
  );
};
export default Layout;
