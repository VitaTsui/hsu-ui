import React, { ReactNode } from "react";
import styles from "../../index.module.scss";

interface PrefixProps {
  prefix: ReactNode;
}

export const Prefix: React.FC<PrefixProps> = ({ prefix }) => {
  return (
    <span className={styles.prefix}>
      <span className="ant-input-prefix">{prefix}</span>
    </span>
  );
};

