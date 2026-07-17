import { ShapeStyle } from "@antv/g6";
import { get_string_size } from "hsu-utils";

/**
 * Get text size
 * @param text Text content
 * @param textStyle Text style
 * @returns Width and height of the text
 */
export const getTextSize = (text: string, textStyle: ShapeStyle) => {
  if (!text) return { width: 0, height: 0 };

  const { width, height } = get_string_size(text, {
    size: Number(textStyle.fontSize),
    weight: textStyle.fontWeight?.toString(),
    family: textStyle.fontFamily,
  });

  return { width, height };
};

