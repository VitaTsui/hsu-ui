import {
  Icon as Iconify,
  IconifyIcon,
  IconProps as IconifyProps,
} from "@iconify/react";

import * as AntdIcons from "@ant-design/icons";
import React, { useEffect, useRef } from "react";
import classNames from "classnames";
import styles from "./index.module.scss";

type AntdNamedIconComponent = React.ForwardRefExoticComponent<
  {
    className?: string;
    style?: React.CSSProperties;
  } & React.RefAttributes<HTMLSpanElement>
>;

/** Check whether it is an AntD icon component name (e.g. "SettingOutlined") and return the corresponding component */
const getAntdIcon = (
  icon: unknown
): AntdNamedIconComponent | undefined => {
  if (typeof icon !== "string") return undefined;
  if (!/(?:Outlined|Filled|TwoTone)$/.test(icon)) return undefined;
  return (AntdIcons as unknown as Record<string, AntdNamedIconComponent | undefined>)[
    icon
  ];
};

interface IconProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLSpanElement>,
    HTMLDivElement
  > {
  iconProps?: Omit<IconifyProps, "icon">;
  icon: IconifyIcon | string;
  onRef?: (ref?: React.RefObject<HTMLDivElement>) => void;
  fontSize?: number | string;
}

const Icon: React.FC<IconProps> = (props) => {
  const {
    iconProps,
    icon,
    className,
    color,
    style,
    onRef,
    fontSize,
    ...iconConfig
  } = props;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onRef?.(ref);
  }, [onRef, ref]);

  const mergedStyle: React.CSSProperties = {
    color,
    fontSize: typeof fontSize === "number" ? `${fontSize}px` : fontSize,
    ...style,
  };

  // Support AntD icon names (e.g. "SettingOutlined") by rendering the corresponding AntD icon component directly
  const AntdNamedIcon = getAntdIcon(icon);
  if (AntdNamedIcon) {
    return (
      <AntdNamedIcon
        {...iconConfig}
        className={classNames([styles.icon, className])}
        style={mergedStyle}
        ref={ref as unknown as React.Ref<HTMLSpanElement>}
      />
    );
  }

  // Iconify icons: host Iconify's own svg directly in a span, instead of nesting it inside
  // the antd Icon's svg (whose viewBox would scale the inner svg down so much the icon becomes invisible).
  return (
    <span
      {...iconConfig}
      role="img"
      ref={ref as unknown as React.Ref<HTMLSpanElement>}
      className={classNames(["anticon", styles.icon, className])}
      style={mergedStyle}
    >
      <Iconify {...iconProps} icon={icon} width="1em" height="1em" />
    </span>
  );
};

export default Icon;
