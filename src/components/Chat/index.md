---
nav: 组件
group:
  title: AI
  order: 6
title: Chat 对话
---

# Chat 对话

基于 `@ant-design/x` 封装的 AI 对话组件集合，以 `Chat.List`（消息列表）、`Chat.Input`（输入框）、`Chat.History`（历史会话）三个子组件构成完整对话界面。

## 引入

```ts
import { Chat } from "@hsu-react/ui";
```

## 对话

```tsx
import React, { useState } from "react";
import { Chat } from "@hsu-react/ui";

export default () => {
  const [list, setList] = useState([
    {
      query: { query: "你好，请介绍一下你自己" },
      answers: [
        { answer: "你好！我是 AI 助手，有什么可以帮你的吗？", messageId: "1" },
      ],
    },
  ]);

  const handleSend = (value) => {
    setList((prev) => [
      ...prev,
      {
        query: { query: value },
        answers: [{ answer: `已收到：${value}`, messageId: String(Date.now()) }],
      },
    ]);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: 420 }}>
      <div style={{ flex: 1, overflow: "auto" }}>
        <Chat.List list={list} />
      </div>
      <Chat.Input onSend={handleSend} uploadEnabled={false} />
    </div>
  );
};
```

## 历史会话

历史会话列表，`historyList` 为按分组（如日期）组织的会话数据，支持新建、点击切换、重命名与删除会话。

```tsx
import React, { useState } from "react";
import { Chat } from "@hsu-react/ui";

export default () => {
  const [currentChatId, setCurrentChatId] = useState("1");

  const historyList = {
    今天: [
      { id: "1", name: "如何学习 React", conversationId: "c1" },
      { id: "2", name: "TypeScript 入门", conversationId: "c2" },
    ],
    昨天: [{ id: "3", name: "前端性能优化", conversationId: "c3" }],
  };

  return (
    <div style={{ height: 360, border: "1px solid #f0f0f0", borderRadius: 8 }}>
      <Chat.History
        historyList={historyList}
        currentChatId={currentChatId}
        width="240px"
        onNewChat={() => setCurrentChatId("")}
        onChatItemClick={(item) => setCurrentChatId(item.id)}
        updateTitle={(chatId, title) => console.log("重命名", chatId, title)}
        deleteHistory={(item) => console.log("删除", item)}
      />
    </div>
  );
};
```

## Chat.List

消息列表，渲染用户提问与 AI 回答。

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| list | 消息列表数据 | `ChatMessage[]` | `[]` |
| assistanting | AI 是否正在回答中 | `boolean` | - |
| onAgain | 重新生成回调 | `(query: string) => void` | - |
| onLikeChange | 点赞/点踩变化回调 | `(messageId: string, like: boolean \| null, content: string) => void` | - |
| hideTool | 是否隐藏消息工具栏 | `boolean` | - |
| defaultAnswer | 默认（空态）回答内容 | `string` | - |
| userName / assistantName | 用户/助手名称 | `string` | - |
| userAvatar / assistantAvatar | 用户/助手头像 | `ReactNode` | - |
| userRenderContent | 自定义用户消息内容 | `(originContent: ReactNode, item: QueryMessage) => ReactNode` | - |
| userRenderQuery | 自定义用户提问文本 | `(query: string \| undefined, item: QueryMessage) => string \| undefined` | - |
| noAnswerTip | 无回答时的提示文案 | `string` | - |
| className | 容器类名 | `string` | - |

> 另有 `defaultAnswerClassName`、`userClassName`、`assistantClassName`、`userHeaderClassName`、`assistantHeaderClassName` 等多个样式类名属性。

## Chat.Input

对话输入框，支持文件上传、模型切换、功能（agent）开关。

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| onSend | 发送回调 | `(value: string) => void` | - |
| assistanting | AI 是否回答中（显示停止按钮） | `boolean` | - |
| onStop | 停止回答回调 | `() => void` | - |
| fileList | 文件列表 | `UploadFile[]` | `[]` |
| onFileListChange | 文件列表变化回调 | `(fileList: UploadFile[]) => void` | - |
| uploadEnabled | 是否启用上传 | `boolean` | `true` |
| uploadConfig | 上传配置 | `UploadConfig` | - |
| modelConfig | 模型切换配置 | `{ modelList: ModelConfig[]; modelType: string; setModelType: (value: string) => void }` | - |
| agents | 功能开关配置 | `AgentToggleConfig[]` | `[]` |
| agentsState | 功能开关状态（受控） | `AgentConfig[]` | - |
| onAgentsChange | 功能开关变化回调 | `(agents: AgentConfig[]) => void` | - |
| placeholder | 占位提示文字 | `string` | `'询问问题'` |
| sendIcon / stopIcon | 发送/停止图标 | `string` | - |
| buttonGroup | 额外按钮组 | `ButtonProps[]` | - |
| wrapperClassName | 容器类名 | `string` | - |

## Chat.History

历史会话列表，支持新建、重命名、删除会话。

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| historyList | 分组历史会话数据 | `Record<string, ChatHistoryData[]>` | - |
| currentChatId | 当前选中的会话 id | `string` | - |
| onNewChat | 新建会话回调 | `() => void` | - |
| onChatItemClick | 会话点击回调 | `(item: ChatHistoryData) => void` | - |
| updateTitle | 重命名回调 | `(chatId: string, title: string) => void` | - |
| deleteHistory | 删除会话回调 | `(item?: ChatHistoryData) => void` | - |
| onScrollEnd | 滚动到底部回调（加载更多） | `() => void` | - |
| width | 容器宽度 | `string` | - |
| tools | 顶部自定义工具区 | `ReactNode` | - |
