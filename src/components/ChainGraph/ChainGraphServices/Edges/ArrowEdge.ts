import { IGroup, ModelConfig, ShapeOptions, ShapeStyle } from "@antv/g6";

interface ArrowEdgeProps {
  styles?: ShapeStyle;
}

export default function ArrowEdge(
  arrowEdgeProps: ArrowEdgeProps
): ShapeOptions {
  const { styles } = arrowEdgeProps || {};

  const _styles: ShapeStyle = {
    stroke: "#A5A5A5",
    lineWidth: 1.5,
    ...styles,
  };

  const draw = (cfg: ModelConfig, group: IGroup) => {
    const { startPoint, endPoint } = cfg;
    if (!startPoint || !endPoint) {
      return group.addShape("path", {
        attrs: {
          path: [],
          stroke: "#000",
          lineWidth: 1,
        },
        name: "empty-path",
      });
    }
    const line = group.addShape("path", {
      attrs: {
        path: [
          // Start point
          ["M", startPoint.x, startPoint.y],
          // Horizontally right to the middle X position
          ["L", (startPoint.x + endPoint.x) / 2, startPoint.y],
          // Vertically down/up to the end point's Y position
          ["L", (startPoint.x + endPoint.x) / 2, endPoint.y],
          // Horizontally right to the end point
          ["L", endPoint.x, endPoint.y],
        ],
        endArrow: {
          path: "M 0,0 L 6,3 L 6,-3 Z",
          fill: "#A5A5A5",
          d: 0,
        },
        ..._styles,
      },
      name: "path-shape",
    });
    return line;
  };

  return {
    draw,
  };
}
