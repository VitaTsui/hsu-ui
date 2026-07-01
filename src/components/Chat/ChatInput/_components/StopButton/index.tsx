import React from "react";
import Icon from "../../../../Icon";
import styles from "./index.module.scss";

interface StopButtonProps {
  onStop: () => void;
  stopIcon?: string;
}

const StopButton: React.FC<StopButtonProps> = (props) => {
  const { onStop, stopIcon = "eos-icons:loading" } = props;

  return (
    <li>
      <div className={styles.stop}>
        <Icon icon={stopIcon} fontSize={24} onClick={onStop} />
      </div>
    </li>
  );
};

export default StopButton;
