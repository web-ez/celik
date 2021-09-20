import styles from "./Layout.module.css";

const Layout: React.FC = (props) => {
  return (
    <>
      <div className={styles.menubar}>
        <span>Card Reader</span>
      </div>
      <div className={styles.container}>{props.children}</div>
    </>
  );
};
export default Layout;
