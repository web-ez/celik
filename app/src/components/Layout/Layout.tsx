import styles from "./Layout.module.css";
import Menubar from "./Menubar";

const Layout: React.FC = (props) => {
  return (
    <>
      <Menubar />
      <div className={styles.container}>{props.children}</div>
    </>
  );
};
export default Layout;
