import { SearchProps as AntdSearchProps, InputRef } from "antd/es/input";
import React, { useEffect, useRef, useState } from "react";

import AntdSearch from "antd/es/input/Search";
import classNames from "classnames";
import styles from "./index.module.scss";

export interface SearchProps
  extends Omit<
    AntdSearchProps,
    "onCompositionStart" | "onCompositionEnd" | "ref" | "onChange"
  > {
  getRef?: (ref: InputRef | null) => void;
  onChange?: (value: string) => void;
}

const Search: React.FC<SearchProps> = (props) => {
  const { onChange, getRef, value, defaultValue, className, ...inputConfig } =
    props;
  const [isComposing, setComposing] = useState<boolean>(false);
  const ref = useRef<InputRef>(null);

  // On initialization, prefer value, then fall back to defaultValue
  const initialValue =
    value !== undefined
      ? value?.toString() ?? ""
      : defaultValue !== undefined
      ? defaultValue?.toString() ?? ""
      : "";

  const [_value, setValue] = useState<string>(initialValue);
  const [lastValue, setLastValue] = useState<string>(initialValue);
  const prevValueRef = useRef<typeof value>(undefined);

  useEffect(() => {
    if (!isComposing && _value !== lastValue) {
      const trimmedValue = _value.trim();
      const finalValue = trimmedValue === "" ? "" : _value;
      setLastValue(finalValue);
      onChange?.(finalValue);
    }
  }, [_value, isComposing, lastValue, onChange]);

  useEffect(() => {
    // Update internal state only when the external value prop actually changes
    if (prevValueRef.current !== value) {
      prevValueRef.current = value;

      if (value !== undefined) {
        setValue(value?.toString());
        setLastValue(value?.toString());
      } else {
        // Clear only on initialization or when explicitly set to undefined externally
        setValue("");
        setLastValue("");
      }
    }
  }, [value]);

  useEffect(() => {
    getRef?.(ref.current);
  }, [getRef]);

  return (
    <AntdSearch
      ref={ref}
      className={classNames(styles.antdInput, className)}
      onCompositionStart={() => setComposing(true)}
      onCompositionEnd={() => {
        setTimeout(() => {
          setComposing(false);
        }, 1);
      }}
      value={_value}
      onChange={(e) => setValue(e.target.value)}
      {...inputConfig}
    />
  );
};

export default Search;
