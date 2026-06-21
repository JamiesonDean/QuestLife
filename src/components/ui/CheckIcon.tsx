import checkIcon from "../../assets/check.svg";
import styles from "./CheckIcon.module.css";

export interface CheckIconProps {
  size?: number;
}

/** Green circle check — used on completed quest and discipline cards. */
export function CheckIcon({ size = 24 }: CheckIconProps) {
  return (
    <img
      className={styles.icon}
      src={checkIcon}
      alt=""
      width={size}
      height={size}
    />
  );
}
