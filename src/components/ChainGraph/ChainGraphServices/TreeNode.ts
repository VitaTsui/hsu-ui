import G6, {
  IGroup,
  Item,
  ModelConfig,
  ShapeOptions,
  ShapeStyle,
} from "@antv/g6";
import { getTextSize, NodeColor, NodeStyle } from ".";
import { TreeGraphData } from "..";

// ==================== Constant definitions ====================
const DEFAULT_PADDING = 20; // Node padding
const DEFAULT_LINE_HEIGHT = 18; // Line height
const DEFAULT_LINE_GAP = 2; // Line spacing
const DEFAULT_ICON_RADIUS = 8; // Collapse icon radius
const DEFAULT_PORT_WIDTH = 3; // Connection port width
const DEFAULT_PORT_HEIGHT = 18; // Connection port height
const DEFAULT_FONT_SIZE = 16; // Default font size for tree node
const DEFAULT_TEXT_COLOR = "#0c0d0e"; // Default text color
const DEFAULT_BG_COLOR = "#fff"; // Default background color
const DEFAULT_STROKE_COLOR = "#4096ff"; // Default border color
const DEFAULT_HOVER_TEXT_COLOR = "#fff"; // Text color on hover
const TEXT_WIDTH_TOLERANCE = 0.01; // Text width tolerance

interface TreeNodeProps {
  showPort?: boolean;
  styles?: NodeStyle;
  colors?: NodeColor[];
  hoverColors?: NodeColor[];
  selectedColors?: NodeColor[];
  rootLevel?: number;
  hasHover?: boolean;
  hasSelected?: boolean;
  addShape?: (
    group: IGroup,
    cfg: ModelConfig & { origin?: Record<string, unknown> }
  ) => void;
}

export default function TreeNode(treeNodeProps: TreeNodeProps): ShapeOptions {
  const {
    showPort = true,
    styles,
    colors = [],
    hoverColors = [],
    selectedColors = [],
    rootLevel = 1,
    hasHover = true,
    hasSelected = true,
    addShape,
  } = treeNodeProps || {};
  const {
    textStyle,
    textSelectedStyle,
    textHoverStyle,
    textAlign = "default",
    bgStyle,
    selectedBgStyle,
    hoverBgStyle,
    collapseIconStyle,
    maxWidth,
    render,
  } = styles || {};

  // ==================== Text styles ====================
  const _textStyle: ShapeStyle = {
    fill: DEFAULT_TEXT_COLOR,
    fontSize: DEFAULT_FONT_SIZE,
    ...textStyle,
  };

  const _textSelectedStyle: ShapeStyle = {
    fill: DEFAULT_HOVER_TEXT_COLOR,
    ...textSelectedStyle,
  };

  const _textHoverStyle: ShapeStyle = {
    fill: DEFAULT_HOVER_TEXT_COLOR,
    ...textHoverStyle,
  };

  // ==================== Background styles ====================
  const _bgStyle: ShapeStyle = {
    fill: DEFAULT_BG_COLOR,
    stroke: DEFAULT_STROKE_COLOR,
    lineWidth: 1,
    radius: 4,
    ...bgStyle,
  };

  const _selectedBgStyle: ShapeStyle = {
    fill: DEFAULT_STROKE_COLOR,
    ...selectedBgStyle,
  };

  const _hoverBgStyle: ShapeStyle = {
    fill: DEFAULT_STROKE_COLOR,
    ...hoverBgStyle,
  };

  // ==================== Expand/collapse icon style ====================
  const _collapseIconStyle: ShapeStyle = {
    stroke: DEFAULT_STROKE_COLOR,
    lineWidth: 1,
    fill: DEFAULT_BG_COLOR,
    ...collapseIconStyle,
  };

  // ==================== Connection port style ====================
  const _portStyle: ShapeStyle = {
    fill: DEFAULT_STROKE_COLOR,
  };

  // ==================== Options ====================
  const options = {
    styles: {},
  };

  // ==================== Get color config ====================
  const getColorConfig = (item: Item) => {
    const index = (item._cfg?.model?.level as number) - rootLevel;
    const colorArrayLength = colors.length + 1;
    return {
      color: colors?.[index % colorArrayLength],
      hoverColor: hoverColors?.[index % (hoverColors.length + 1)],
      selectedColor: selectedColors?.[index % (selectedColors.length + 1)],
    };
  };

  // ==================== Set state ====================
  const setState = (name?: string, value?: string | boolean, item?: Item) => {
    if (!item) return;

    const group = item.get<IGroup>("group");
    const collapseShape = group.find((e) => e.get("name") === "collapse-icon");
    const textShapes = group.findAll((e) => e.get("name") === "text-shape");
    const keyShape = item.getKeyShape();

    const { color, hoverColor, selectedColor } = getColorConfig(item);

    // Handle collapse state
    if (name === "collapse") {
      collapseShape?.attr({
        symbol: value ? G6.Marker.collapse : G6.Marker.expand,
      });
      return;
    }

    // Handle hover state
    if (name === "hover" && !item.hasState("click") && hasHover) {
      const isHover = Boolean(value);
      const renderStyle = render?.(
        item._cfg as ModelConfig,
        isHover ? "hover" : "default"
      );

      const bgStyle = isHover ? _hoverBgStyle : _bgStyle;
      const textStyle = isHover ? _textHoverStyle : _textStyle;
      const currentColor = isHover ? hoverColor : color;

      keyShape?.attr({
        ...bgStyle,
        fill: currentColor?.bg ?? color?.bg ?? bgStyle.fill,
        stroke: currentColor?.stroke ?? color?.stroke ?? bgStyle.stroke,
        ...renderStyle?.bgStyle,
      });

      textShapes?.forEach((textShape) => {
        textShape?.attr({
          ...textStyle,
          fill: currentColor?.text ?? color?.text ?? textStyle.fill,
          ...renderStyle?.textStyle,
        });
      });
      return;
    }

    // Handle selected state
    if (name === "click" && hasSelected) {
      const isSelected = Boolean(value);
      const renderStyle = render?.(
        item._cfg as ModelConfig,
        isSelected ? "selected" : "default"
      );

      const bgStyle = isSelected ? _selectedBgStyle : _bgStyle;
      const textStyle = isSelected ? _textSelectedStyle : _textStyle;
      const currentColor = isSelected ? selectedColor : color;

      keyShape?.attr({
        ...bgStyle,
        fill: currentColor?.bg ?? color?.bg ?? bgStyle.fill,
        stroke: currentColor?.stroke ?? color?.stroke ?? bgStyle.stroke,
        ...renderStyle?.bgStyle,
      });

      textShapes?.forEach((textShape) => {
        textShape?.attr({
          ...textStyle,
          fill: currentColor?.text ?? color?.text ?? textStyle.fill,
          ...renderStyle?.textStyle,
        });
      });
    }
  };

  // ==================== Text wrapping ====================
  const wrapText = (label: string, maxWidth: number): string[] => {
    const lines: string[] = [];
    let currentLine = "";
    const labelChars = label?.split("") || [];

    labelChars?.forEach((char, idx) => {
      const { width: charWidth } = getTextSize(currentLine + char, _textStyle);
      const availableWidth = maxWidth - DEFAULT_PADDING * 2;

      if (charWidth - TEXT_WIDTH_TOLERANCE > availableWidth) {
        lines.push(currentLine);
        currentLine = char;
      } else {
        currentLine += char;
      }

      if (idx === labelChars.length - 1) {
        lines.push(currentLine);
      }
    });

    return lines.length > 0 ? lines : [label || ""];
  };

  // ==================== Calculate node size ====================
  const calculateNodeSize = (
    label: string,
    fontSize: number
  ): { width: number; height: number; lines: string[] } => {
    const { width, height } = getTextSize(label, _textStyle);
    const minWidth = fontSize + DEFAULT_PADDING * 2;
    const nodeWidth = maxWidth
      ? Math.max(maxWidth, minWidth)
      : width + DEFAULT_PADDING * 2;

    const lines = wrapText(label, nodeWidth);
    const lineCount = lines.length;
    const nodeHeight =
      height * lineCount +
      DEFAULT_LINE_HEIGHT +
      (lineCount - 1) * DEFAULT_LINE_GAP;

    return { width: nodeWidth, height: nodeHeight, lines };
  };

  // ==================== Calculate text position ====================
  const calculateTextPosition = (
    lineWidth: number,
    nodeWidth: number,
    direction: string
  ): number => {
    if (textAlign === "center") {
      return -lineWidth / 2;
    }

    if (direction === "right") {
      return -nodeWidth / 2 + DEFAULT_PADDING;
    }

    return -lineWidth + nodeWidth / 2 - DEFAULT_PADDING;
  };

  // ==================== Draw ====================
  const draw = (cfg: ModelConfig, group: IGroup) => {
    const renderStyle = render?.(cfg, "default");
    cfg.textStyle = { ..._textStyle, ...renderStyle?.textStyle };

    const index = (cfg.level as number) - rootLevel;
    const colorArrayLength = colors.length + 1;
    const color = colors?.[index % colorArrayLength];
    const fontSize = _textStyle.fontSize ?? DEFAULT_FONT_SIZE;

    const {
      width: nodeWidth,
      height: nodeHeight,
      lines,
    } = calculateNodeSize(cfg.label as string, fontSize);

    const lineCount = lines.length;
    const textHeight = getTextSize(cfg.label as string, _textStyle).height;
    const direction = (cfg.direction as string) || "right";

    cfg.width = nodeWidth;
    cfg.height = nodeHeight;
    cfg.line = lineCount;

    // Draw background
    const node = group.addShape("rect", {
      attrs: {
        ..._bgStyle,
        fill: color?.bg ?? _bgStyle.fill,
        stroke: color?.stroke ?? _bgStyle.stroke,
        ...renderStyle?.bgStyle,
        width: nodeWidth,
        height: nodeHeight,
        x: -nodeWidth / 2,
        y: -(nodeHeight - DEFAULT_LINE_HEIGHT) / lineCount,
      },
      name: "rect-shape",
    });

    // Draw text
    lines?.forEach((line, lineIndex) => {
      const { width: lineWidth } = getTextSize(line, _textStyle);
      const textX = calculateTextPosition(lineWidth, nodeWidth, direction);
      const textY =
        textHeight * lineIndex +
        DEFAULT_LINE_HEIGHT / 2 +
        lineIndex * DEFAULT_LINE_GAP;

      group.addShape("text", {
        attrs: {
          ..._textStyle,
          fill: color?.text ?? _textStyle.fill,
          ...renderStyle?.textStyle,
          text: line,
          x: textX,
          y: textY,
          position: direction,
        },
        name: "text-shape",
      });
    });

    // Draw expand/collapse icon
    const hasChildren =
      cfg.children && (cfg.children as TreeGraphData[]).length > 0;
    if (hasChildren) {
      const iconX = direction === "right" ? nodeWidth / 2 : -nodeWidth / 2;
      const iconY =
        -(nodeHeight - DEFAULT_LINE_HEIGHT) / lineCount + nodeHeight / 2;

      group.addShape("marker", {
        attrs: {
          r: DEFAULT_ICON_RADIUS,
          ..._collapseIconStyle,
          x: iconX,
          y: iconY,
          symbol: cfg.collapsed ? G6.Marker.expand : G6.Marker.collapse,
          cursor: "pointer",
        },
        name: "collapse-icon",
      });
    }

    // Draw connection port
    if (showPort) {
      const portX =
        direction === "right"
          ? -nodeWidth / 2 - DEFAULT_PORT_WIDTH
          : nodeWidth / 2;
      const portY =
        -(nodeHeight - DEFAULT_LINE_HEIGHT) / lineCount +
        nodeHeight / 2 -
        DEFAULT_PORT_HEIGHT / 2;

      group.addShape("rect", {
        attrs: {
          fill: color?.port ?? _portStyle.fill,
          ..._portStyle,
          x: portX,
          y: portY,
          width: DEFAULT_PORT_WIDTH,
          height: DEFAULT_PORT_HEIGHT,
          radius:
            direction === "right"
              ? [DEFAULT_PORT_WIDTH, 0, 0, DEFAULT_PORT_WIDTH]
              : [0, DEFAULT_PORT_WIDTH, DEFAULT_PORT_WIDTH, 0],
        },
        name: "port-shape",
      });
    }

    // Custom shapes
    if (addShape) {
      addShape(group, cfg);
    }

    return node;
  };

  return {
    options,
    setState,
    draw,
  };
}
