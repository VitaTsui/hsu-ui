/* 为每个组件生成 index.md 文档骨架（已存在则跳过，便于后续手写丰富 demo） */
const fs = require("fs");
const path = require("path");

const COMP_DIR = path.resolve(__dirname, "../src/components");

// 分组与中文名
const META = {
  Button: ["通用", "Button 按钮"],
  Icon: ["通用", "Icon 图标"],
  Copy: ["通用", "Copy 复制"],
  Operate: ["通用", "Operate 操作"],
  FlexFill: ["布局", "FlexFill 自适应填充"],
  Panel: ["布局", "Panel 页面容器"],
  TabBar: ["布局", "TabBar 标签栏"],
  Input: ["数据录入", "Input 输入框"],
  Select: ["数据录入", "Select 选择器"],
  Checkbox: ["数据录入", "Checkbox 多选框"],
  Switch: ["数据录入", "Switch 开关"],
  Slider: ["数据录入", "Slider 滑动输入"],
  DatePicker: ["数据录入", "DatePicker 日期选择"],
  FormItem: ["数据录入", "FormItem 表单项"],
  Form: ["数据录入", "Form 表单"],
  Upload: ["数据录入", "Upload 上传"],
  CodeMirror: ["数据录入", "CodeMirror 代码编辑"],
  Editor: ["数据录入", "Editor 富文本"],
  SecondConf: ["数据录入", "SecondConf 二次确认"],
  Search: ["数据录入", "Search 搜索"],
  Table: ["数据展示", "Table 表格"],
  Tags: ["数据展示", "Tags 标签"],
  Descriptions: ["数据展示", "Descriptions 描述列表"],
  Tree: ["数据展示", "Tree 树形控件"],
  TextEllipsis: ["数据展示", "TextEllipsis 文本省略"],
  FileCol: ["数据展示", "FileCol 文件列"],
  FilePreview: ["数据展示", "FilePreview 文件预览"],
  Chart: ["数据展示", "Chart 图表"],
  Markdown: ["数据展示", "Markdown 渲染"],
  Spreadsheet: ["数据展示", "Spreadsheet 电子表格"],
  ChainGraph: ["数据展示", "ChainGraph 关系图"],
  Modal: ["反馈", "Modal 对话框"],
  Chat: ["AI", "Chat 对话"],
};

const GROUP_ORDER = {
  通用: 1,
  布局: 2,
  数据录入: 3,
  数据展示: 4,
  反馈: 5,
  AI: 6,
};

const comps = fs
  .readdirSync(COMP_DIR)
  .filter((n) => fs.existsSync(path.join(COMP_DIR, n, "index.tsx")));

let created = 0;
for (const c of comps) {
  const mdPath = path.join(COMP_DIR, c, "index.md");
  if (fs.existsSync(mdPath)) continue;
  const [group, title] = META[c] || ["其他", c];
  const order = GROUP_ORDER[group] || 9;
  const md = `---
nav: 组件
group:
  title: ${group}
  order: ${order}
title: ${title}
---

# ${title}

> \`${c}\` 组件。完整 API 见源码类型定义，下方为基础用法。

## 引入

\`\`\`ts
import { ${c} } from "@hsu-react/ui";
\`\`\`
`;
  fs.writeFileSync(mdPath, md);
  created++;
}
console.log(`created ${created} component docs (skipped existing)`);
