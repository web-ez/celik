import { HTMLProps } from "react";

import styles from "./Button.module.css";

const Button: React.FC<HTMLProps<HTMLButtonElement>> = (props) => {
  return (
    <button
      onClick={props.onClick}
      disabled={props.disabled}
      type={props.type as any}
      className={styles.button}
    >
      <span>{props.children}</span>
    </button>
  );
};

export default Button;
