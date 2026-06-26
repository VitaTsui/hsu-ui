/* 生成 FormItem 文档：每种 type 一个独立 Demo（独立代码框），按分组用次级标题组织 */
const fs = require("fs");
const path = require("path");

const MD = path.resolve(__dirname, "../src/components/FormItem/index.md");
const src = fs.readFileSync(MD, "utf8");

// 头部（到“## 基础用法”之前）与 API 段（从“## API”开始）原样保留
const apiIdx = src.indexOf("## API");
const headEnd = src.indexOf("## 基础用法");
const head = src.slice(0, headEnd).trimEnd();
const api = src.slice(apiIdx).trimEnd();

// 每个 type：分组、标题、FormItem 属性、需要的额外常量/导入
const ITEMS = [
  // 输入类
  { g: "输入类", t: "INPUT", label: "INPUT 输入框", attr: `type="INPUT" name="input" label="输入框" required` },
  { g: "输入类", t: "TEXTAREA", label: "TEXTAREA 多行文本", attr: `type="TEXTAREA" name="textarea" label="多行文本"` },
  { g: "输入类", t: "PASSWORD", label: "PASSWORD 密码", attr: `type="PASSWORD" name="password" label="密码"` },
  { g: "输入类", t: "PASSWORDSTRENGTH", label: "PASSWORDSTRENGTH 密码强度", attr: `type="PASSWORDSTRENGTH" name="pwd" label="密码强度"` },
  { g: "输入类", t: "INPUTNUMBER", label: "INPUTNUMBER 数字", attr: `type="INPUTNUMBER" name="number" label="数字" componentProps={{ min: 0, max: 100 }}` },
  { g: "输入类", t: "RANGEINPUT", label: "RANGEINPUT 范围输入", attr: `type="RANGEINPUT" name="range" label="范围输入"` },
  { g: "输入类", t: "SLIDER", label: "SLIDER 滑块", attr: `type="SLIDER" name="slider" label="滑块"` },
  { g: "输入类", t: "TEXT", label: "TEXT 只读文本", attr: `type="TEXT" name="text" label="只读文本" componentProps={{ value: "只读文本内容" }}` },
  { g: "输入类", t: "AUTO", label: "AUTO 自定义控件", imp: `import { Form, Input } from "antd";`, attr: `type="AUTO" name="auto" label="自定义控件" element={<Input placeholder="任意自定义控件" />}` },
  // 选择类
  { g: "选择类", t: "SELECT", label: "SELECT 选择器", opts: true, attr: `type="SELECT" name="select" label="选择器" componentProps={{ options }}` },
  { g: "选择类", t: "AUTOCOMPLETESELECT", label: "AUTOCOMPLETESELECT 自动完成", opts: true, attr: `type="AUTOCOMPLETESELECT" name="ac" label="自动完成" componentProps={{ options }}` },
  { g: "选择类", t: "TREESELECT", label: "TREESELECT 树选择", tree: true, attr: `type="TREESELECT" name="treeSelect" label="树选择" componentProps={{ treeData }}` },
  { g: "选择类", t: "ICONSELECT", label: "ICONSELECT 图标选择", attr: `type="ICONSELECT" name="icon" label="图标选择"` },
  { g: "选择类", t: "SEGMENTED", label: "SEGMENTED 分段控制", opts: true, attr: `type="SEGMENTED" name="segmented" label="分段控制" componentProps={{ options }}` },
  { g: "选择类", t: "RADIO", label: "RADIO 单选", opts: true, attr: `type="RADIO" name="radio" label="单选" componentProps={{ options }}` },
  { g: "选择类", t: "CHECKBOX", label: "CHECKBOX 单个多选框", attr: `type="CHECKBOX" name="checkbox" label="多选框"` },
  { g: "选择类", t: "CHECKBOXGROUP", label: "CHECKBOXGROUP 多选组", opts: true, attr: `type="CHECKBOXGROUP" name="checkboxGroup" label="多选组" componentProps={{ options }}` },
  { g: "选择类", t: "SWITCH", label: "SWITCH 开关", attr: `type="SWITCH" name="switch" label="开关"` },
  { g: "选择类", t: "DATEPICKER", label: "DATEPICKER 日期", attr: `type="DATEPICKER" name="date" label="日期"` },
  { g: "选择类", t: "RANGEPICKER", label: "RANGEPICKER 日期范围", attr: `type="RANGEPICKER" name="dateRange" label="日期范围"` },
  { g: "选择类", t: "STEPPICKER", label: "STEPPICKER 步进日期", attr: `type="STEPPICKER" name="step" label="步进日期"` },
  { g: "选择类", t: "TREE", label: "TREE 树形控件", tree: true, attr: `type="TREE" name="tree" label="树形控件" componentProps={{ treeData }}` },
  // 富文本 / 代码
  { g: "富文本 / 代码", t: "EDITOR", label: "EDITOR 富文本", attr: `type="EDITOR" name="editor" label="富文本"` },
  { g: "富文本 / 代码", t: "CODEMIRROR", label: "CODEMIRROR 代码", attr: `type="CODEMIRROR" name="code" label="代码" componentProps={{ language: "json" }}` },
  // 上传类
  { g: "上传类", t: "FILE", label: "FILE 文件上传", attr: `type="FILE" name="file" label="文件上传" componentProps={{ action: "/api/upload" }}` },
  { g: "上传类", t: "IMAGEFILE", label: "IMAGEFILE 图片上传", attr: `type="IMAGEFILE" name="image" label="图片上传" componentProps={{ action: "/api/upload" }}` },
];

const OPTIONS = `const options = [
  { label: "选项一", value: "1" },
  { label: "选项二", value: "2" },
  { label: "选项三", value: "3" },
];

`;
const TREE = `const treeData = [
  {
    title: "父节点",
    value: "0",
    key: "0",
    children: [
      { title: "子节点 1", value: "0-1", key: "0-1" },
      { title: "子节点 2", value: "0-2", key: "0-2" },
    ],
  },
];

`;

function demo(it) {
  const imp = it.imp || `import { Form } from "antd";`;
  const consts = (it.opts ? OPTIONS : "") + (it.tree ? TREE : "");
  return [
    "```tsx",
    `import React from "react";`,
    `import { FormItem } from "@hsu-react/ui";`,
    imp,
    "",
    consts +
      `export default () => (\n  <Form layout="vertical" style={{ maxWidth: 420 }}>\n    <FormItem ${it.attr} />\n  </Form>\n);`,
    "```",
  ].join("\n");
}

let body = "## 基础用法\n\n`FormItem` 通过 `type` 指定控件类型，业务参数统一放在 `componentProps` 中，需置于 antd `Form` 之内。下面按类型分别演示：\n\n";

let curGroup = "";
for (const it of ITEMS) {
  if (it.g !== curGroup) {
    curGroup = it.g;
    body += `### ${curGroup}\n\n`;
  }
  body += `#### ${it.label}\n\n${demo(it)}\n\n`;
}

const out = `${head}\n\n${body}${api}\n`;
fs.writeFileSync(MD, out);
console.log(`wrote FormItem doc with ${ITEMS.length} per-type demos`);
