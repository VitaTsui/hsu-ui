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

/** 判断是否为 AntD 图标组件名（如 "SettingOutlined"），并返回对应组件 */
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

  // 兼容 AntD 图标名（如 "SettingOutlined"），直接渲染对应 AntD 图标组件
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

  // iconify 图标：直接用 span 承载 Iconify 自带的 svg，避免把它嵌套进 antd Icon
  // 的 svg（其 viewBox 会把内层 svg 缩放成极小值导致图标不可见）。
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
