import * as echarts from "echarts";

type TooltipRenderMode = "html" | "richText";

interface RichTextTooltipMarker {
  renderMode: TooltipRenderMode;
  content: string;
  style: Record<string, unknown>;
}

export interface TooltipParams {
  marker?: string | RichTextTooltipMarker;
  seriesName?: string;
  value?: unknown;
  color?: string | echarts.Color;
  name?: string;
}

export interface ChartTooltipFormatterProps {
  params: TooltipParams | TooltipParams[];
  hideName?: boolean;
  hideMarker?: boolean;
  textStyle?: Record<string, unknown>;
  unit?: string;
  /** For multiple series, display sorted by value in descending order (largest on top) */
  sortDescending?: boolean;
}

const chartTooltipFormatter = (props: ChartTooltipFormatterProps) => {
  const {
    params,
    hideName,
    hideMarker,
    textStyle = { fontSize: 14, color: "#666", fontWeight: 400 },
    unit,
    sortDescending,
  } = props;

  if (!Array.isArray(params)) {
    return `
      <div style="margin: 0;line-height:1;">
        <div style="margin: 0;line-height:1;">
          ${hideMarker ? "" : `${params?.marker}`}
          <span style="font-size:${textStyle?.fontSize}px;color:${
            textStyle?.color
          };font-weight:${textStyle?.fontWeight};margin-left:2px">${
            params?.name
          }</span>
          <span style="float:right;margin-left:20px;font-size:${
            textStyle?.fontSize
          }px;color:${textStyle?.color};font-weight:${textStyle?.fontWeight}">${
            params?.value
          }${unit ? ` ` + unit : ""}</span>
          <div style="clear:both"></div>
        </div>
        <div style="clear:both"></div>
      </div>
    `;
  }

  if (params.length === 1) {
    const item = params[0];

    return `
      <div style="margin: 0;line-height:1;">
        <div style="margin: 0;line-height:1;">
          ${hideMarker ? "" : `${item?.marker}`}
          <span style="font-size:${textStyle?.fontSize}px;color:${
            textStyle?.color
          };font-weight:${textStyle?.fontWeight};margin-left:2px">${item?.name}</span>
          <span style="float:right;margin-left:20px;font-size:${
            textStyle?.fontSize
          }px;color:${textStyle?.color};font-weight:${textStyle?.fontWeight}">${
            item?.value
          }${unit ? ` ${unit}` : ""}</span>
          <div style="clear:both"></div>
        </div>
        <div style="clear:both"></div>
      </div>
    `;
  }

  // value may be a number, a string with a unit appended ("123次"), or one with thousands separators ("1,234"); normalize back to a number before sorting
  const toSortValue = (v: unknown): number => {
    if (typeof v === "number") return v;
    if (Array.isArray(v)) return toSortValue(v[v.length - 1]);
    const n = parseFloat(String(v ?? "").replace(/,/g, ""));
    return Number.isNaN(n) ? 0 : n;
  };

  const sortedParams = sortDescending
    ? [...params].sort((a, b) => toSortValue(b.value) - toSortValue(a.value))
    : params;

  const items = sortedParams
    ?.map((item, idx) => {
      const value = item.value ?? "";

      return `
      <div style="margin: 0 0 ${
        idx === sortedParams.length - 1 ? "0" : "10px"
      } 0;line-height:1;">
        <div style="margin: 0px 0 0;line-height:1;">
          ${hideMarker ? "" : `${item?.marker}`}
          <span style="font-size:${textStyle?.fontSize}px;color:${
            textStyle?.color
          };font-weight:${textStyle?.fontWeight};margin-left:2px">${
            item?.seriesName
          }</span>
          <span style="float:right;margin-left:20px;font-size:${
            textStyle?.fontSize
          }px;color:${textStyle?.color};font-weight:${
            textStyle?.fontWeight
          }">${value}${unit ? ` ${unit}` : ""}</span>
          <div style="clear:both"></div>
        </div>
        <div style="clear:both"></div>
      </div>
    `;
    })
    .join("");

  return `
    <div style="margin: 0px 0 0;line-height:1;">
      <div style="margin: 0px 0 0;line-height:1;">
        ${
          hideName
            ? ""
            : `<div style="margin-bottom: 10px;font-size:${
                textStyle?.fontSize
              }px;color:${textStyle?.color};font-weight:${
                textStyle?.fontWeight
              };line-height:1;">${params[0]?.name || ""}</div>`
        }
        ${items}
        <div style="clear:both"></div>
      </div>
      <div style="clear:both"></div>
    </div>
  `;
};

export default chartTooltipFormatter;
