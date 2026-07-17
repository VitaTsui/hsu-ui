import { Button as AntdButton, ButtonProps as AntdButtonProps } from "antd";

import React from "react";
import usePermissions from "../../hooks/usePermissions";
import classNames from "classnames";
import styles from "./index.module.scss";
import ChakraButton, { ChakraButtonProps } from "./ChakraButton";

export type { ChakraButtonProps };

export interface ButtonProps extends AntdButtonProps {
  hasPermi?: string[];
  hidden?: boolean;
  iconPosition?: "start" | "end";
}

interface ButtonFC
  extends React.ForwardRefExoticComponent<
    ButtonProps & React.RefAttributes<HTMLButtonElement>
  > {
  Chakra: React.FC<ChakraButtonProps>;
}

// forwardRef: when wrapped by overlay components like Tooltip / Popconfirm, the button DOM can be accessed directly,
// preventing rc libraries from falling back to findDOMNode and triggering React deprecation warnings
const InternalButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const {
      hasPermi,
      hidden,
      iconPosition = "start",
      className,
      children,
      title,
      ...buttonConfig
    } = props;
    const { permitted } = usePermissions(hasPermi);

    if (!permitted || hidden) {
      return null;
    }

    return (
      <AntdButton
        {...buttonConfig}
        ref={ref}
        className={classNames(className, styles.button, {
          [styles[iconPosition]]: iconPosition,
        })}
        children={children ?? title}
      />
    );
  }
);

const Button = InternalButton as ButtonFC;

Button.Chakra = ChakraButton;

export default Button;
