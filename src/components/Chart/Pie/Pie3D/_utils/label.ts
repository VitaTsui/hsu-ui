import type { SeriesItem, LabelConfig } from "..";

interface LabelLine {
  coords: number[][];
  name: string;
  color?: string;
}

interface LabelPoint {
  x: number;
  y: number;
  z: number;
  text: string;
  name: string;
  color: string;
  originalY?: number; // Original y coordinate, used when adjusting
}

interface LabelRect {
  x: number;
  y: number;
  width: number;
  height: number;
  index: number;
}

// Estimate a label's width and height (based on text length and font size)
const estimateLabelSize = (
  text: string,
  fontSize: number = 14,
  padding: number = 5
): { width: number; height: number } => {
  // Rough estimate: each character takes about fontSize * 0.6 in width
  const estimatedWidth = text.length * fontSize * 0.6 + padding * 2;
  const estimatedHeight = fontSize + padding * 2;
  return { width: estimatedWidth, height: estimatedHeight };
};

// Check whether two rectangles overlap
const isOverlapping = (rect1: LabelRect, rect2: LabelRect): boolean => {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
};

// Adjust label positions to avoid overlap
const adjustLabelPositions = (
  labelPoints: LabelPoint[],
  labelTextStyle: { fontSize?: number; padding?: number }
): LabelPoint[] => {
  const fontSize = labelTextStyle.fontSize || 14;
  const padding = Array.isArray(labelTextStyle.padding)
    ? labelTextStyle.padding[0] || 5
    : labelTextStyle.padding || 5;

  // Convert label sizes into 3D coordinate units
  // Font size and padding are in pixels and must be converted into relative 3D coordinate units
  // The 3D coordinate range is roughly -1 to 1, so scaling is required
  const scaleFactor = 0.01; // Converts pixel units into 3D coordinate units

  // Build the label rectangles (on the 2D projection plane, using x and y coordinates)
  const labelRects: LabelRect[] = labelPoints?.map((point) => {
    const size = estimateLabelSize(point.text, fontSize, padding);
    // Convert pixel sizes into 3D coordinate units
    const width3D = size.width * scaleFactor;
    const height3D = size.height * scaleFactor;
    return {
      x: point.x - width3D / 2,
      y: point.y - height3D / 2,
      width: width3D,
      height: height3D,
      index: 0, // Assigned in the loop below
    };
  });

  // Assign indices
  labelRects?.forEach((rect, index) => {
    rect.index = index;
  });

  // Save the original coordinates
  labelPoints?.forEach((point) => {
    point.originalY = point.y;
  });

  // Detect and adjust overlapping labels
  const minSpacing = fontSize * scaleFactor * 0.3; // Minimum spacing (in 3D coordinate units)
  let hasOverlap = true;
  let iterations = 0;
  const maxIterations = 100; // Maximum number of iterations

  while (hasOverlap && iterations < maxIterations) {
    hasOverlap = false;
    iterations++;

    for (let i = 0; i < labelRects.length; i++) {
      for (let j = i + 1; j < labelRects.length; j++) {
        if (isOverlapping(labelRects[i], labelRects[j])) {
          hasOverlap = true;

          // Compute the center points of the two labels
          const center1X = labelRects[i].x + labelRects[i].width / 2;
          const center1Y = labelRects[i].y + labelRects[i].height / 2;
          const center2X = labelRects[j].x + labelRects[j].width / 2;
          const center2Y = labelRects[j].y + labelRects[j].height / 2;

          // Compute the distances along x and y
          const distanceX = Math.abs(center1X - center2X);
          const distanceY = Math.abs(center1Y - center2Y);

          // Compute the required distances
          const requiredDistanceX =
            (labelRects[i].width + labelRects[j].width) / 2 + minSpacing;
          const requiredDistanceY =
            (labelRects[i].height + labelRects[j].height) / 2 + minSpacing;

          // Adjust positions based on the overlap
          const originalY1 = labelPoints[i].originalY || labelPoints[i].y;
          const originalY2 = labelPoints[j].originalY || labelPoints[j].y;
          const originalX1 = labelPoints[i].x;
          const originalX2 = labelPoints[j].x;

          // Prefer adjusting along y (vertically), since that is the most common overlap
          if (distanceY < requiredDistanceY) {
            const adjustmentY =
              (requiredDistanceY - distanceY) / 2 + minSpacing * 0.5;

            if (originalY1 < originalY2) {
              labelPoints[i].y -= adjustmentY;
              labelPoints[j].y += adjustmentY;
            } else {
              labelPoints[i].y += adjustmentY;
              labelPoints[j].y -= adjustmentY;
            }
          }

          // If the labels are also close along x, nudge them along x as well
          if (distanceX < requiredDistanceX * 0.9) {
            const adjustmentX = ((requiredDistanceX - distanceX) / 2) * 0.5;

            if (originalX1 < originalX2) {
              labelPoints[i].x -= adjustmentX;
              labelPoints[j].x += adjustmentX;
            } else {
              labelPoints[i].x += adjustmentX;
              labelPoints[j].x -= adjustmentX;
            }
          }

          // Update the rectangle position
          const size1 = estimateLabelSize(
            labelPoints[i].text,
            fontSize,
            padding
          );
          const size2 = estimateLabelSize(
            labelPoints[j].text,
            fontSize,
            padding
          );
          labelRects[i].x = labelPoints[i].x - (size1.width * scaleFactor) / 2;
          labelRects[i].y = labelPoints[i].y - (size1.height * scaleFactor) / 2;
          labelRects[j].x = labelPoints[j].x - (size2.width * scaleFactor) / 2;
          labelRects[j].y = labelPoints[j].y - (size2.height * scaleFactor) / 2;
        }
      }
    }
  }

  return labelPoints;
};

const calculateLabelPoints = (
  series: SeriesItem[],
  label: LabelConfig,
  maxValue: number,
  minHeight: number,
  maxHeight: number,
  autoRotate: boolean,
  yOffset: number,
  alpha: number,
  colorPalette: string[]
): { lines: LabelLine[]; points: LabelPoint[] } => {
  const labelLines: LabelLine[] = [];
  const labelPoints: LabelPoint[] = [];
  const effectiveYOffset = autoRotate ? 0 : yOffset;
  const sumValue = series.reduce((sum, s) => sum + s.pieData.value, 0);

  for (let i = 0; i < series.length; i += 1) {
    const midRatio =
      (series[i].pieData.startRatio! + series[i].pieData.endRatio!) / 2;
    const midRadian = midRatio * Math.PI * 2;

    const heightRatio = series[i].pieData.value / maxValue;
    const height = minHeight + (maxHeight - minHeight) * heightRatio;
    const zTop = height * 0.1;
    const zBottom = -height * 0.1;

    const startRadius = 1;
    const startY = Math.sin(midRadian) * startRadius + effectiveYOffset;

    let startZ: number;
    let midHeightIncrease: number;
    let midPoint: number[];
    let endPoint: number[];

    if (autoRotate) {
      startZ = zTop;
      midHeightIncrease = 1;
      const midDistance = label.distance || 1;
      midPoint = [
        Math.cos(midRadian) * (startRadius + midDistance * 0.2),
        Math.sin(midRadian) * (startRadius + midDistance * 0.2),
        startZ + midHeightIncrease,
      ];
      const horizontalDistance = midDistance * 0.4;
      endPoint = [
        Math.cos(midRadian) *
          (startRadius + midDistance * 0.2 + horizontalDistance),
        Math.sin(midRadian) *
          (startRadius + midDistance * 0.2 + horizontalDistance),
        midPoint[2],
      ];
    } else {
      const threshold = -1 + alpha / 90;
      const isFrontSide = startY < threshold;

      if (isFrontSide) {
        startZ = (zTop + zBottom) / 2;
        midHeightIncrease = -1;
      } else {
        startZ = zTop;
        midHeightIncrease = 1;
      }

      const midDistance = 1;
      midPoint = [
        Math.cos(midRadian) * (startRadius + midDistance * 0.1),
        Math.sin(midRadian) * (startRadius + midDistance * 0.5) +
          effectiveYOffset,
        startZ + midHeightIncrease,
      ];

      const isLeftSide = Math.cos(midRadian) < 0;
      const horizontalDistance = midDistance * 0.6;
      endPoint = [
        midPoint[0] + (isLeftSide ? -horizontalDistance : horizontalDistance),
        midPoint[1],
        midPoint[2],
      ];
    }

    const startPoint = [Math.cos(midRadian) * startRadius, startY, startZ];

    const sectorColor =
      series[i].itemStyle?.color ||
      series[i].pieData.itemStyle?.color ||
      colorPalette[i % colorPalette.length];

    labelLines.push({
      coords: [startPoint, midPoint, endPoint],
      name: series[i].name,
      color: sectorColor,
    });

    const percent = ((series[i].pieData.value / sumValue) * 100).toFixed(1);
    let labelText = "";
    if (label.formatter) {
      labelText = label.formatter({
        name: series[i].name,
        value: series[i].pieData.value,
        percent: parseFloat(percent),
      });
    } else {
      labelText = `${series[i].name} ${percent}%`;
    }

    labelPoints.push({
      x: endPoint[0],
      y: endPoint[1],
      z: endPoint[2],
      text: labelText,
      name: series[i].name,
      color: sectorColor,
    });
  }

  // Adjust label positions to avoid overlap
  const labelTextStyle = label.textStyle || {};
  // Handle padding possibly being an array
  const adjustedTextStyle = {
    fontSize: labelTextStyle.fontSize,
    padding: Array.isArray(labelTextStyle.padding)
      ? labelTextStyle.padding[0] || 5
      : labelTextStyle.padding || 5,
  };
  const adjustedPoints = adjustLabelPositions(labelPoints, adjustedTextStyle);

  // Update each leader line's end and mid points to match the adjusted label position
  adjustedPoints?.forEach((point, index) => {
    if (labelLines[index]) {
      const originalEndPoint = labelLines[index].coords[2];
      const originalMidPoint = labelLines[index].coords[1];

      // Update the end point
      labelLines[index].coords[2] = [point.x, point.y, point.z];

      // If the y coordinate changed, adjust the mid point's y to keep the line smooth
      const yDiff = point.y - originalEndPoint[1];
      if (Math.abs(yDiff) > 0.001) {
        // Adjust the mid point's y so it transitions smoothly between start and end
        const midY = originalMidPoint[1] + yDiff * 0.5; // The mid point follows the end point, but moves less
        labelLines[index].coords[1] = [
          originalMidPoint[0],
          midY,
          originalMidPoint[2],
        ];
      }
    }
  });

  return { lines: labelLines, points: adjustedPoints };
};

export const createLabelSeries = (
  series: SeriesItem[],
  label: LabelConfig,
  maxValue: number,
  minHeight: number,
  maxHeight: number,
  autoRotate: boolean,
  yOffset: number,
  alpha: number,
  colorPalette: string[]
): SeriesItem[] => {
  if (!label?.show) {
    return [];
  }

  const { lines, points } = calculateLabelPoints(
    series,
    label,
    maxValue,
    minHeight,
    maxHeight,
    autoRotate,
    yOffset,
    alpha,
    colorPalette
  );

  const labelSeries: SeriesItem[] = [];
  const labelTextStyle = label.textStyle || {};

  lines?.forEach((line) => {
    labelSeries.push({
      type: "line3D",
      coordinateSystem: "cartesian3D",
      data: line.coords,
      lineStyle: {
        width: label.hideLine ? 0 : label.lineStyle?.width || 1,
        color: label.lineStyle?.color || line.color || "#fff",
      },
      silent: true,
    } as unknown as SeriesItem);
  });

  points?.forEach((point) => {
    labelSeries.push({
      type: "scatter3D",
      data: [[point.x, point.y, point.z, point.text, point.name]],
      symbolSize: 0,
      label: {
        show: true,
        position: "top",
        formatter: (params: unknown) => {
          const dataArray = (params as { value: unknown[] })?.value || [];
          return (dataArray?.[3] as string) || "";
        },
        textStyle: {
          color: labelTextStyle.color || point.color || "#fff",
          fontSize: labelTextStyle.fontSize || 14,
          padding: labelTextStyle.padding || 5,
        },
      },
      silent: true,
    } as unknown as SeriesItem);
  });

  return labelSeries;
};
