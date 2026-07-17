import { useCallback, useMemo, useState } from "react";
import { FormItemProps } from "../../FormItem";

/**
 * Manages search item state
 *
 * Derives directly from the input via useMemo, storing only the visible
 * overrides the user manually toggles in FilterDropdown as state; this avoids
 * repeated setState when a useEffect mirrors the prop and the parent passes a
 * new array reference, which would trigger a Maximum update depth loop.
 */
export function useSearchItems(searchItems: FormItemProps[]) {
  const [visibilityOverrides, setVisibilityOverrides] = useState<
    Record<string, boolean>
  >({});

  const processedSearchItems = useMemo<FormItemProps[]>(() => {
    return (
      searchItems?.map((i) => {
        const key =
          i.name !== undefined && i.name !== null ? String(i.name) : "";
        const override = key ? visibilityOverrides[key] : undefined;
        return {
          ...i,
          visible:
            override !== undefined
              ? override
              : typeof i.visible === "boolean"
                ? i.visible
                : true,
        };
      }) ?? []
    );
  }, [searchItems, visibilityOverrides]);

  const setSearchItems = useCallback((items: FormItemProps[]) => {
    const overrides: Record<string, boolean> = {};
    items?.forEach((item) => {
      if (
        item.name !== undefined &&
        item.name !== null &&
        typeof item.visible === "boolean"
      ) {
        overrides[String(item.name)] = item.visible;
      }
    });
    setVisibilityOverrides(overrides);
  }, []);

  return {
    searchItems: processedSearchItems,
    setSearchItems,
  };
}
