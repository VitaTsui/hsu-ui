import FormAuto, { FormAutoProps } from "./FormAuto";
import FormCheckbox, {
  FormCheckboxGroupProps,
  FormCheckboxProps,
} from "./FormCheckbox";
import FormDatePicker, {
  FormDatePickerProps,
  FormRangePickerProps,
  FormStepPickerProps,
} from "./FormDatePicker";
import FormEditor, { FormEditorProps } from "./FormEditor";
import FormInput, {
  FormInputNumberProps,
  FormInputProps,
  FormPasswordProps,
  FormPasswordStrengthProps,
  FormRangeInputProps,
  FormTextAreaInputProps,
} from "./FormInput";
import FormRadio, { FormRadioProps } from "./FormRadio";
import FormSegmented, { FormSegmentedProps } from "./FormSegmented";
import FormSelect, {
  FormAutoCompleteSelectProps,
  FormIconSelectProps,
  FormSelectProps,
  FormTreeSelectProps,
} from "./FormSelect";
import FormSlider, { FormSliderProps } from "./FormSlider";
import FormSwitch, { FormSwitchProps } from "./FormSwitch";
import FormTree, { FormTreeProps } from "./FormTree";
import FormUpload, { FormImageProps, FormUploadProps } from "./FormUpload";
import ItemContainer, { ItemContainerProps } from "./ItemContainer";
import FormText, { FormTextProps } from "./FormText";
import FormCodeMirror, { FormCodeMirrorProps } from "./FormCodeMirror";

import React from "react";

export { ItemContainer as FormItemContainer };
export type { ItemContainerProps as FormItemContainerProps };

// Common base type
interface BaseFormItem {
  visible?: boolean;
}

// Core mapping (sorted by group)
type FormItemMap = {
  // Input types
  AUTO: FormAutoProps;
  INPUT: FormInputProps;
  TEXTAREA: FormTextAreaInputProps;
  PASSWORD: FormPasswordProps;
  PASSWORDSTRENGTH: FormPasswordStrengthProps;
  INPUTNUMBER: FormInputNumberProps;
  RANGEINPUT: FormRangeInputProps;
  SLIDER: FormSliderProps;
  EDITOR: FormEditorProps;
  CODEMIRROR: FormCodeMirrorProps;
  TEXT: FormTextProps;

  // Selection types
  SELECT: FormSelectProps;
  TREESELECT: FormTreeSelectProps;
  AUTOCOMPLETESELECT: FormAutoCompleteSelectProps;
  SEGMENTED: FormSegmentedProps;
  SWITCH: FormSwitchProps;
  RADIO: FormRadioProps;
  CHECKBOX: FormCheckboxProps;
  CHECKBOXGROUP: FormCheckboxGroupProps;
  DATEPICKER: FormDatePickerProps;
  RANGEPICKER: FormRangePickerProps;
  STEPPICKER: FormStepPickerProps;
  TREE: FormTreeProps;
  ICONSELECT: FormIconSelectProps;

  // Upload types
  FILE: FormUploadProps;
  IMAGEFILE: FormImageProps;
};

// Derived type
export type FormItemType = keyof FormItemMap;

// Form item props
export type FormItemProps = {
  [K in keyof FormItemMap]: { type: K } & BaseFormItem & FormItemMap[K];
}[keyof FormItemMap];

// Chinese dictionary
export const PlaceholderDict: Record<FormItemType, string> = {
  // Input types
  AUTO: "",
  INPUT: "请输入",
  TEXTAREA: "请输入",
  PASSWORD: "请输入",
  PASSWORDSTRENGTH: "请输入",
  INPUTNUMBER: "请输入",
  RANGEINPUT: "请输入",
  SLIDER: "请输入",
  EDITOR: "请输入",
  CODEMIRROR: "请输入",
  TEXT: "请输入",

  // Selection types
  SELECT: "请选择",
  TREESELECT: "请选择",
  AUTOCOMPLETESELECT: "请选择",
  SEGMENTED: "请选择",
  SWITCH: "请选择",
  RADIO: "请选择",
  CHECKBOX: "请选择",
  CHECKBOXGROUP: "请选择",
  DATEPICKER: "请选择",
  RANGEPICKER: "请选择",
  STEPPICKER: "请选择",
  TREE: "请选择",
  ICONSELECT: "请选择",

  // Upload types
  FILE: "请上传",
  IMAGEFILE: "请上传",
};

// English dictionary
export const PlaceholderDictEn: Record<FormItemType, string> = {
  // Input types
  AUTO: "",
  INPUT: "Please enter",
  TEXTAREA: "Please enter",
  PASSWORD: "Please enter",
  PASSWORDSTRENGTH: "Please enter",
  INPUTNUMBER: "Please enter",
  RANGEINPUT: "Please enter",
  SLIDER: "Please enter",
  EDITOR: "Please enter",
  CODEMIRROR: "Please enter",
  TEXT: "Please enter",

  // Selection types
  SELECT: "Please select",
  TREESELECT: "Please select",
  AUTOCOMPLETESELECT: "Please select",
  SEGMENTED: "Please select",
  SWITCH: "Please select",
  RADIO: "Please select",
  CHECKBOX: "Please select",
  CHECKBOXGROUP: "Please select",
  DATEPICKER: "Please select",
  RANGEPICKER: "Please select",
  STEPPICKER: "Please select",
  TREE: "Please select",
  ICONSELECT: "Please select",

  // Upload types
  FILE: "Please upload",
  IMAGEFILE: "Please upload",
};

const FormItem: React.FC<FormItemProps> = (props) => {
  const { type, visible, en } = props;

  if (visible === false) {
    return null;
  }

  switch (type) {
    case "AUTO":
      return <FormAuto {...props} />;
    case "INPUT":
      return (
        <FormInput
          {...props}
          componentProps={{
            placeholder:
              typeof props.label === "string"
                ? props.label
                : en
                ? PlaceholderDictEn[type]
                : PlaceholderDict[type],
            ...props.componentProps,
          }}
        />
      );
    case "TEXTAREA":
      return (
        <FormInput.TextArea
          {...props}
          componentProps={{
            placeholder:
              typeof props.label === "string"
                ? props.label
                : en
                ? PlaceholderDictEn[type]
                : PlaceholderDict[type],
            ...props.componentProps,
          }}
        />
      );
    case "PASSWORDSTRENGTH":
      return (
        <FormInput.PasswordStrength
          {...props}
          componentProps={{
            placeholder:
              typeof props.label === "string"
                ? props.label
                : en
                ? PlaceholderDictEn[type]
                : PlaceholderDict[type],
            ...props.componentProps,
          }}
        />
      );
    case "INPUTNUMBER":
      return (
        <FormInput.InputNumber
          {...props}
          componentProps={{
            placeholder:
              typeof props.label === "string"
                ? props.label
                : en
                ? PlaceholderDictEn[type]
                : PlaceholderDict[type],
            ...props.componentProps,
          }}
        />
      );
    case "PASSWORD":
      return (
        <FormInput.Password
          {...props}
          componentProps={{
            placeholder:
              typeof props.label === "string"
                ? props.label
                : en
                ? PlaceholderDictEn[type]
                : PlaceholderDict[type],
            ...props.componentProps,
          }}
        />
      );
    case "RANGEINPUT":
      return (
        <FormInput.RangeInput
          {...props}
          componentProps={{
            type: "NUMBER",
            placeholder: [
              typeof props.label === "string"
                ? props.label
                : en
                ? PlaceholderDictEn.INPUT
                : PlaceholderDict.INPUT,
              typeof props.label === "string"
                ? props.label
                : en
                ? PlaceholderDictEn.INPUT
                : PlaceholderDict.INPUT,
            ],
            ...props.componentProps,
          }}
        />
      );
    case "SELECT":
      return (
        <FormSelect
          {...props}
          componentProps={{
            placeholder:
              typeof props.label === "string"
                ? props.label
                : en
                ? PlaceholderDictEn[type]
                : PlaceholderDict[type],
            ...props.componentProps,
          }}
        />
      );
    case "TREESELECT":
      return (
        <FormSelect.Tree
          {...props}
          componentProps={{
            placeholder:
              typeof props.label === "string"
                ? props.label
                : en
                ? PlaceholderDictEn[type]
                : PlaceholderDict[type],
            ...props.componentProps,
          }}
        />
      );
    case "AUTOCOMPLETESELECT":
      return (
        <FormSelect.AutoComplete
          {...props}
          componentProps={{
            placeholder:
              typeof props.label === "string"
                ? props.label
                : en
                ? PlaceholderDictEn[type]
                : PlaceholderDict[type],
            ...props.componentProps,
          }}
        />
      );
    case "ICONSELECT":
      return <FormSelect.Icon {...props} />;
    case "SEGMENTED":
      return <FormSegmented {...props} />;
    case "SWITCH":
      return <FormSwitch {...props} />;
    case "RADIO":
      return <FormRadio {...props} />;
    case "CHECKBOX":
      return <FormCheckbox {...props} />;
    case "CHECKBOXGROUP":
      return <FormCheckbox.Group {...props} />;
    case "DATEPICKER":
      return (
        <FormDatePicker
          {...props}
          componentProps={{
            placeholder:
              typeof props.label === "string"
                ? props.label
                : en
                ? PlaceholderDictEn[type]
                : PlaceholderDict[type],
            ...props.componentProps,
          }}
        />
      );
    case "RANGEPICKER":
      return (
        <FormDatePicker.RangePicker
          {...props}
          componentProps={{
            placeholder: [
              typeof props.label === "string"
                ? props.label
                : en
                ? PlaceholderDictEn[type]
                : PlaceholderDict[type],
              typeof props.label === "string"
                ? props.label
                : en
                ? PlaceholderDictEn[type]
                : PlaceholderDict[type],
            ],
            ...props.componentProps,
          }}
        />
      );
    case "STEPPICKER":
      return (
        <FormDatePicker.StepPicker
          {...props}
          componentProps={{
            ...props.componentProps,
          }}
        />
      );
    case "FILE":
      return <FormUpload {...props} />;
    case "IMAGEFILE":
      return <FormUpload.Image {...props} />;
    case "TREE":
      return <FormTree {...props} />;
    case "SLIDER":
      return <FormSlider {...props} />;
    case "EDITOR":
      return <FormEditor {...props} />;
    case "CODEMIRROR":
      return <FormCodeMirror {...props} />;
    case "TEXT":
      return <FormText {...props} />;
    default:
      return null;
  }
};

export default FormItem;
