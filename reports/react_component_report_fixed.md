# React组件分析报告

## 元数据
- **文档类型**: React组件分析
- **生成时间**: 2025-03-31 14:44:35
- **组件总数**: 26
- **文档用途**: 组件依赖关系分析
- **适用场景**: 代码审查、架构分析、重构规划

## 组件定义概览
- **AiCore**: 定义于 `d:\workspace\demo\CodeScanning2\ai\aiCore.tsx`
- **AiMain**: 定义于 `d:\workspace\demo\CodeScanning2\ai\modules\main.tsx`
- **AiSide**: 定义于 `d:\workspace\demo\CodeScanning2\ai\side.tsx`
- **AnswerTags**: 定义于 `d:\workspace\demo\CodeScanning2\ai\components\queryArea\tags.tsx`
- **Card**: 定义于 `d:\workspace\demo\CodeScanning2\ai\components\answer\card.tsx`
- **Container**: 定义于 `d:\workspace\demo\CodeScanning2\ai\components\answer\title.tsx`
- **Content**: 定义于 `d:\workspace\demo\CodeScanning2\ai\modules\content\index.tsx`
- **CustomService**: 定义于 `d:\workspace\demo\CodeScanning2\ai\components\answer\customService.tsx`
- **EditStyle**: 定义于 `d:\workspace\demo\CodeScanning2\ai\components\queryArea\index.tsx`
- **Feedback**: 定义于 `d:\workspace\demo\CodeScanning2\ai\components\answer\feedback.tsx`
- **Func**: 定义于 `d:\workspace\demo\CodeScanning2\ai\components\queryArea\func.tsx`
- **History**: 定义于 `d:\workspace\demo\CodeScanning2\ai\modules\history.tsx`
- **Icon**: 定义于 `d:\workspace\demo\CodeScanning2\ai\components\svg\base.tsx`
- **Image**: 定义于 `d:\workspace\demo\CodeScanning2\ai\modules\leftTab\components\image.tsx`
- **LeftTab**: 定义于 `d:\workspace\demo\CodeScanning2\ai\modules\leftTab\index.tsx`
- **ListRenderer**: 定义于 `d:\workspace\demo\CodeScanning2\ai\components\ListRenderer.tsx`
- **MainTags**: 定义于 `d:\workspace\demo\CodeScanning2\ai\components\queryArea\tags.tsx`
- **Outer**: 定义于 `d:\workspace\demo\CodeScanning2\ai\modules\history.tsx`
- **QueryArea**: 定义于 `d:\workspace\demo\CodeScanning2\ai\components\queryArea\index.tsx`
- **StopButton**: 定义于 `d:\workspace\demo\CodeScanning2\ai\components\answer\stopButton.tsx`
- **Tags**: 定义于 `d:\workspace\demo\CodeScanning2\ai\components\queryArea\tags.tsx`
- **Thinking**: 定义于 `d:\workspace\demo\CodeScanning2\ai\components\answer\thinking.tsx`
- **Title**: 定义于 `d:\workspace\demo\CodeScanning2\ai\components\answer\title.tsx`
- **Tool**: 定义于 `d:\workspace\demo\CodeScanning2\ai\components\tool\index.tsx`
- **Wrap**: 定义于 `d:\workspace\demo\CodeScanning2\ai\components\svg\base.tsx`
- **Wrapper**: 定义于 `d:\workspace\demo\CodeScanning2\ai\modules\leftTab\index.tsx`

## 组件详细信息

### 组件: AiCore
**组件ID**: `AiCore`
**定义位置**: `d:\workspace\demo\CodeScanning2\ai\aiCore.tsx`
**导入来源**: 无外部导入或未检测到
**被引用次数**: 21
**引用位置**:
- `aiCore.tsx:349`
- `index.tsx:63,63`
- `index2.tsx:19`
- `side.tsx:50,50,48,57`
- `components\ListRenderer.tsx:174`
- `components\answer\card.tsx:58`
- `components\answer\content.tsx:120`
- `components\answer\customService.tsx:52`
- `components\answer\feedback.tsx:124`
- `components\answer\stopButton.tsx:17`
- `components\answer\thinking.tsx:60`
- `components\answer\title.tsx:115`
- `components\queryArea\func.tsx:55`
- `components\queryArea\index.tsx:381,479`
- `components\queryArea\tags.tsx:48,74`
- `components\svg\base.tsx:64`
- `components\tool\index.tsx:22`
- `modules\history.tsx:111`
- `modules\main.tsx:40`
- `modules\content\index.tsx:87`
- `modules\leftTab\index.tsx:51`
**组件类型**: 核心组件

### 组件: AiMain
**组件ID**: `AiMain`
**定义位置**: `d:\workspace\demo\CodeScanning2\ai\modules\main.tsx`
**导入来源**: `./modules/main`
**被引用次数**: 3
**引用位置**:
- `modules\main.tsx:40`
- `modules\content\index.tsx:87`
- `modules\leftTab\index.tsx:51`
**组件类型**: 模块组件

### 组件: AiSide
**组件ID**: `AiSide`
**定义位置**: `d:\workspace\demo\CodeScanning2\ai\side.tsx`
**导入来源**: 无外部导入或未检测到
**被引用次数**: 19
**引用位置**:
- `index2.tsx:19`
- `side.tsx:57`
- `components\ListRenderer.tsx:174`
- `components\answer\card.tsx:58`
- `components\answer\content.tsx:120`
- `components\answer\customService.tsx:52`
- `components\answer\feedback.tsx:124`
- `components\answer\stopButton.tsx:17`
- `components\answer\thinking.tsx:60`
- `components\answer\title.tsx:115`
- `components\queryArea\func.tsx:55`
- `components\queryArea\index.tsx:381,479`
- `components\queryArea\tags.tsx:48,74`
- `components\svg\base.tsx:64`
- `components\tool\index.tsx:22`
- `modules\history.tsx:111`
- `modules\main.tsx:40`
- `modules\content\index.tsx:87`
- `modules\leftTab\index.tsx:51`
**组件类型**: 核心组件

### 组件: AnswerTags
**组件ID**: `AnswerTags`
**定义位置**: `d:\workspace\demo\CodeScanning2\ai\components\queryArea\tags.tsx`
**导入来源**: 无外部导入或未检测到
**被引用次数**: 7
**引用位置**:
- `components\queryArea\tags.tsx:20,19,48,74`
- `components\svg\base.tsx:64`
- `components\tool\index.tsx:22`
- `modules\history.tsx:111`
- `modules\main.tsx:40`
- `modules\content\index.tsx:87`
- `modules\leftTab\index.tsx:51`
**组件类型**: UI组件

### 组件: Card
**组件ID**: `Card`
**定义位置**: `d:\workspace\demo\CodeScanning2\ai\components\answer\card.tsx`
**导入来源**: `./card`
**被引用次数**: 16
**引用位置**:
- `components\answer\card.tsx:58`
- `components\answer\content.tsx:93,93,92,120`
- `components\answer\customService.tsx:52`
- `components\answer\feedback.tsx:124`
- `components\answer\stopButton.tsx:17`
- `components\answer\thinking.tsx:60`
- `components\answer\title.tsx:115`
- `components\queryArea\func.tsx:55`
- `components\queryArea\index.tsx:381,479`
- `components\queryArea\tags.tsx:48,74`
- `components\svg\base.tsx:64`
- `components\tool\index.tsx:22`
- `modules\history.tsx:111`
- `modules\main.tsx:40`
- `modules\content\index.tsx:87`
- `modules\leftTab\index.tsx:51`
**组件类型**: UI组件

### 组件: Container
**组件ID**: `Container`
**定义位置**: `d:\workspace\demo\CodeScanning2\ai\components\answer\title.tsx`
**导入来源**: 无外部导入或未检测到
**被引用次数**: 16
**引用位置**:
- `components\answer\card.tsx:20,19,58`
- `components\answer\content.tsx:86,85,120`
- `components\answer\customService.tsx:15,14,52`
- `components\answer\feedback.tsx:103,103,102,124`
- `components\answer\stopButton.tsx:7,7,6,17`
- `components\answer\thinking.tsx:27,26,60`
- `components\answer\title.tsx:61,61,60,115`
- `components\queryArea\func.tsx:55`
- `components\queryArea\index.tsx:381,479`
- `components\queryArea\tags.tsx:48,74`
- `components\svg\base.tsx:64`
- `components\tool\index.tsx:22`
- `modules\history.tsx:111`
- `modules\main.tsx:40`
- `modules\content\index.tsx:87`
- `modules\leftTab\index.tsx:51`
**组件类型**: UI组件

### 组件: Content
**组件ID**: `Content`
**定义位置**: `d:\workspace\demo\CodeScanning2\ai\modules\content\index.tsx`
**导入来源**: `./answer/content`
**被引用次数**: 15
**引用位置**:
- `components\answer\content.tsx:120`
- `components\answer\customService.tsx:52`
- `components\answer\feedback.tsx:124`
- `components\answer\stopButton.tsx:17`
- `components\answer\thinking.tsx:60`
- `components\answer\title.tsx:115`
- `components\queryArea\func.tsx:55`
- `components\queryArea\index.tsx:381,479`
- `components\queryArea\tags.tsx:48,74`
- `components\svg\base.tsx:64`
- `components\tool\index.tsx:22`
- `modules\history.tsx:111`
- `modules\main.tsx:40`
- `modules\content\index.tsx:87`
- `modules\leftTab\index.tsx:51`
**组件类型**: 模块组件

### 组件: CustomService
**组件ID**: `CustomService`
**定义位置**: `d:\workspace\demo\CodeScanning2\ai\components\answer\customService.tsx`
**导入来源**: `./customService`
**被引用次数**: 14
**引用位置**:
- `components\answer\customService.tsx:52`
- `components\answer\feedback.tsx:124`
- `components\answer\stopButton.tsx:17`
- `components\answer\thinking.tsx:60`
- `components\answer\title.tsx:115`
- `components\queryArea\func.tsx:55`
- `components\queryArea\index.tsx:381,479`
- `components\queryArea\tags.tsx:48,74`
- `components\svg\base.tsx:64`
- `components\tool\index.tsx:22`
- `modules\history.tsx:111`
- `modules\main.tsx:40`
- `modules\content\index.tsx:87`
- `modules\leftTab\index.tsx:51`
**组件类型**: UI组件

### 组件: EditStyle
**组件ID**: `EditStyle`
**定义位置**: `d:\workspace\demo\CodeScanning2\ai\components\queryArea\index.tsx`
**导入来源**: 无外部导入或未检测到
**被引用次数**: 8
**引用位置**:
- `components\queryArea\index.tsx:343,343,342,381,479`
- `components\queryArea\tags.tsx:48,74`
- `components\svg\base.tsx:64`
- `components\tool\index.tsx:22`
- `modules\history.tsx:111`
- `modules\main.tsx:40`
- `modules\content\index.tsx:87`
- `modules\leftTab\index.tsx:51`
**组件类型**: UI组件

### 组件: Feedback
**组件ID**: `Feedback`
**定义位置**: `d:\workspace\demo\CodeScanning2\ai\components\answer\feedback.tsx`
**导入来源**: `./feedback`
**被引用次数**: 13
**引用位置**:
- `components\answer\feedback.tsx:124`
- `components\answer\stopButton.tsx:17`
- `components\answer\thinking.tsx:60`
- `components\answer\title.tsx:115`
- `components\queryArea\func.tsx:55`
- `components\queryArea\index.tsx:381,479`
- `components\queryArea\tags.tsx:48,74`
- `components\svg\base.tsx:64`
- `components\tool\index.tsx:22`
- `modules\history.tsx:111`
- `modules\main.tsx:40`
- `modules\content\index.tsx:87`
- `modules\leftTab\index.tsx:51`
**组件类型**: UI组件

### 组件: Func
**组件ID**: `Func`
**定义位置**: `d:\workspace\demo\CodeScanning2\ai\components\queryArea\func.tsx`
**导入来源**: `@pages/ai/components/queryArea/func`
**被引用次数**: 9
**引用位置**:
- `components\queryArea\func.tsx:55`
- `components\queryArea\index.tsx:335,371,335,371,335,371,381,479`
- `components\queryArea\tags.tsx:48,74`
- `components\svg\base.tsx:64`
- `components\tool\index.tsx:22`
- `modules\history.tsx:111`
- `modules\main.tsx:40`
- `modules\content\index.tsx:87`
- `modules\leftTab\index.tsx:51`
**组件类型**: UI组件

### 组件: History
**组件ID**: `History`
**定义位置**: `d:\workspace\demo\CodeScanning2\ai\modules\history.tsx`
**导入来源**: `@/pages/ai/modules/history`
**被引用次数**: 4
**引用位置**:
- `modules\history.tsx:111`
- `modules\main.tsx:40`
- `modules\content\index.tsx:87`
- `modules\leftTab\index.tsx:51`
**组件类型**: 模块组件

### 组件: Icon
**组件ID**: `Icon`
**定义位置**: `d:\workspace\demo\CodeScanning2\ai\components\svg\base.tsx`
**导入来源**: `@dzh/components`
**被引用次数**: 6
**引用位置**:
- `components\svg\base.tsx:53,53,53,64`
- `components\tool\index.tsx:22`
- `modules\history.tsx:111`
- `modules\main.tsx:40`
- `modules\content\index.tsx:87`
- `modules\leftTab\index.tsx:51`
**组件类型**: UI组件

### 组件: Image
**组件ID**: `Image`
**定义位置**: `d:\workspace\demo\CodeScanning2\ai\modules\leftTab\components\image.tsx`
**导入来源**: `./components/image`
**被引用次数**: 6
**引用位置**:
- `components\svg\base.tsx:64`
- `components\tool\index.tsx:22`
- `modules\history.tsx:111`
- `modules\main.tsx:40`
- `modules\content\index.tsx:87`
- `modules\leftTab\index.tsx:38,38,37,51`
**组件类型**: UI组件

### 组件: LeftTab
**组件ID**: `LeftTab`
**定义位置**: `d:\workspace\demo\CodeScanning2\ai\modules\leftTab\index.tsx`
**导入来源**: `./modules/leftTab`
**被引用次数**: 1
**引用位置**:
- `modules\leftTab\index.tsx:51`
**组件类型**: 模块组件

### 组件: ListRenderer
**组件ID**: `ListRenderer`
**定义位置**: `d:\workspace\demo\CodeScanning2\ai\components\ListRenderer.tsx`
**导入来源**: `./components/ListRenderer`
**被引用次数**: 17
**引用位置**:
- `components\ListRenderer.tsx:174`
- `components\answer\card.tsx:58`
- `components\answer\content.tsx:120`
- `components\answer\customService.tsx:52`
- `components\answer\feedback.tsx:124`
- `components\answer\stopButton.tsx:17`
- `components\answer\thinking.tsx:60`
- `components\answer\title.tsx:115`
- `components\queryArea\func.tsx:55`
- `components\queryArea\index.tsx:381,479`
- `components\queryArea\tags.tsx:48,74`
- `components\svg\base.tsx:64`
- `components\tool\index.tsx:22`
- `modules\history.tsx:111`
- `modules\main.tsx:40`
- `modules\content\index.tsx:87`
- `modules\leftTab\index.tsx:51`
**组件类型**: UI组件

### 组件: MainTags
**组件ID**: `MainTags`
**定义位置**: `d:\workspace\demo\CodeScanning2\ai\components\queryArea\tags.tsx`
**导入来源**: 无外部导入或未检测到
**被引用次数**: 7
**引用位置**:
- `components\queryArea\tags.tsx:27,26,48,74`
- `components\svg\base.tsx:64`
- `components\tool\index.tsx:22`
- `modules\history.tsx:111`
- `modules\main.tsx:40`
- `modules\content\index.tsx:87`
- `modules\leftTab\index.tsx:51`
**组件类型**: UI组件

### 组件: Outer
**组件ID**: `Outer`
**定义位置**: `d:\workspace\demo\CodeScanning2\ai\modules\history.tsx`
**导入来源**: 无外部导入或未检测到
**被引用次数**: 20
**引用位置**:
- `index.tsx:46,46,45`
- `index2.tsx:10,9,19`
- `side.tsx:45,45,44,57`
- `components\ListRenderer.tsx:174`
- `components\answer\card.tsx:58`
- `components\answer\content.tsx:120`
- `components\answer\customService.tsx:52`
- `components\answer\feedback.tsx:124`
- `components\answer\stopButton.tsx:17`
- `components\answer\thinking.tsx:60`
- `components\answer\title.tsx:115`
- `components\queryArea\func.tsx:55`
- `components\queryArea\index.tsx:381,479`
- `components\queryArea\tags.tsx:48,74`
- `components\svg\base.tsx:64`
- `components\tool\index.tsx:22`
- `modules\history.tsx:53,53,52,111`
- `modules\main.tsx:40`
- `modules\content\index.tsx:87`
- `modules\leftTab\index.tsx:51`
**组件类型**: 模块组件

### 组件: QueryArea
**组件ID**: `QueryArea`
**定义位置**: `d:\workspace\demo\CodeScanning2\ai\components\queryArea\index.tsx`
**导入来源**: `../../components/queryArea`
**被引用次数**: 8
**引用位置**:
- `components\queryArea\index.tsx:381,479`
- `components\queryArea\tags.tsx:48,74`
- `components\svg\base.tsx:64`
- `components\tool\index.tsx:22`
- `modules\history.tsx:111`
- `modules\main.tsx:26,26,25,40`
- `modules\content\index.tsx:79,79,78,87`
- `modules\leftTab\index.tsx:51`
**组件类型**: UI组件

### 组件: StopButton
**组件ID**: `StopButton`
**定义位置**: `d:\workspace\demo\CodeScanning2\ai\components\answer\stopButton.tsx`
**导入来源**: `./answer/stopButton`
**被引用次数**: 12
**引用位置**:
- `components\answer\stopButton.tsx:17`
- `components\answer\thinking.tsx:60`
- `components\answer\title.tsx:115`
- `components\queryArea\func.tsx:55`
- `components\queryArea\index.tsx:381,479`
- `components\queryArea\tags.tsx:48,74`
- `components\svg\base.tsx:64`
- `components\tool\index.tsx:22`
- `modules\history.tsx:111`
- `modules\main.tsx:40`
- `modules\content\index.tsx:87`
- `modules\leftTab\index.tsx:51`
**组件类型**: UI组件

### 组件: Tags
**组件ID**: `Tags`
**定义位置**: `d:\workspace\demo\CodeScanning2\ai\components\queryArea\tags.tsx`
**导入来源**: `./tags`
**被引用次数**: 7
**引用位置**:
- `components\queryArea\tags.tsx:48,74`
- `components\svg\base.tsx:64`
- `components\tool\index.tsx:22`
- `modules\history.tsx:111`
- `modules\main.tsx:40`
- `modules\content\index.tsx:87`
- `modules\leftTab\index.tsx:51`
**组件类型**: UI组件

### 组件: Thinking
**组件ID**: `Thinking`
**定义位置**: `d:\workspace\demo\CodeScanning2\ai\components\answer\thinking.tsx`
**导入来源**: `./answer/thinking`
**被引用次数**: 11
**引用位置**:
- `components\answer\thinking.tsx:60`
- `components\answer\title.tsx:115`
- `components\queryArea\func.tsx:55`
- `components\queryArea\index.tsx:381,479`
- `components\queryArea\tags.tsx:48,74`
- `components\svg\base.tsx:64`
- `components\tool\index.tsx:22`
- `modules\history.tsx:111`
- `modules\main.tsx:40`
- `modules\content\index.tsx:87`
- `modules\leftTab\index.tsx:51`
**组件类型**: UI组件

### 组件: Title
**组件ID**: `Title`
**定义位置**: `d:\workspace\demo\CodeScanning2\ai\components\answer\title.tsx`
**导入来源**: `./components/answer/title`
**被引用次数**: 10
**引用位置**:
- `components\answer\title.tsx:115`
- `components\queryArea\func.tsx:55`
- `components\queryArea\index.tsx:381,479`
- `components\queryArea\tags.tsx:48,74`
- `components\svg\base.tsx:64`
- `components\tool\index.tsx:22`
- `modules\history.tsx:111`
- `modules\main.tsx:40`
- `modules\content\index.tsx:87`
- `modules\leftTab\index.tsx:51`
**组件类型**: UI组件

### 组件: Tool
**组件ID**: `Tool`
**定义位置**: `d:\workspace\demo\CodeScanning2\ai\components\tool\index.tsx`
**导入来源**: `@pages/ai/components/tool`
**被引用次数**: 5
**引用位置**:
- `components\tool\index.tsx:22`
- `modules\history.tsx:111`
- `modules\main.tsx:40`
- `modules\content\index.tsx:87`
- `modules\leftTab\index.tsx:51`
**组件类型**: UI组件

### 组件: Wrap
**组件ID**: `Wrap`
**定义位置**: `d:\workspace\demo\CodeScanning2\ai\components\svg\base.tsx`
**导入来源**: 无外部导入或未检测到
**被引用次数**: 6
**引用位置**:
- `components\svg\base.tsx:52,52,51,64`
- `components\tool\index.tsx:22`
- `modules\history.tsx:111`
- `modules\main.tsx:40`
- `modules\content\index.tsx:87`
- `modules\leftTab\index.tsx:51`
**组件类型**: UI组件

### 组件: Wrapper
**组件ID**: `Wrapper`
**定义位置**: `d:\workspace\demo\CodeScanning2\ai\modules\leftTab\index.tsx`
**导入来源**: 无外部导入或未检测到
**被引用次数**: 21
**引用位置**:
- `aiCore.tsx:303,302,349`
- `index2.tsx:19`
- `side.tsx:57`
- `components\ListRenderer.tsx:104,104,103,174`
- `components\answer\card.tsx:58`
- `components\answer\content.tsx:120`
- `components\answer\customService.tsx:52`
- `components\answer\feedback.tsx:124`
- `components\answer\stopButton.tsx:17`
- `components\answer\thinking.tsx:60`
- `components\answer\title.tsx:115`
- `components\queryArea\func.tsx:40,39,55`
- `components\queryArea\index.tsx:330,330,329,381,479`
- `components\queryArea\search.tsx:119,119,118`
- `components\queryArea\tags.tsx:48,74`
- `components\svg\base.tsx:64`
- `components\tool\index.tsx:10,9,22`
- `modules\history.tsx:111`
- `modules\main.tsx:24,23,40`
- `modules\content\index.tsx:17,16,87`
- `modules\leftTab\index.tsx:31,30,51`
**组件类型**: 模块组件

## 组件依赖关系

### 高依赖组件 (被引用5次以上)
- **AiCore**: 被引用21次
  - 在 `aiCore.tsx` 中被引用
  - 在 `index.tsx` 中被引用
  - 在 `index2.tsx` 中被引用
  - 在 `side.tsx` 中被引用
  - 在 `components\ListRenderer.tsx` 中被引用
  - 在 `components\answer\card.tsx` 中被引用
  - 在 `components\answer\content.tsx` 中被引用
  - 在 `components\answer\customService.tsx` 中被引用
  - 在 `components\answer\feedback.tsx` 中被引用
  - 在 `components\answer\stopButton.tsx` 中被引用
  - 在 `components\answer\thinking.tsx` 中被引用
  - 在 `components\answer\title.tsx` 中被引用
  - 在 `components\queryArea\func.tsx` 中被引用
  - 在 `components\queryArea\index.tsx` 中被引用
  - 在 `components\queryArea\tags.tsx` 中被引用
  - 在 `components\svg\base.tsx` 中被引用
  - 在 `components\tool\index.tsx` 中被引用
  - 在 `modules\history.tsx` 中被引用
  - 在 `modules\main.tsx` 中被引用
  - 在 `modules\content\index.tsx` 中被引用
  - 在 `modules\leftTab\index.tsx` 中被引用
- **Wrapper**: 被引用21次
  - 在 `aiCore.tsx` 中被引用
  - 在 `index2.tsx` 中被引用
  - 在 `side.tsx` 中被引用
  - 在 `components\ListRenderer.tsx` 中被引用
  - 在 `components\answer\card.tsx` 中被引用
  - 在 `components\answer\content.tsx` 中被引用
  - 在 `components\answer\customService.tsx` 中被引用
  - 在 `components\answer\feedback.tsx` 中被引用
  - 在 `components\answer\stopButton.tsx` 中被引用
  - 在 `components\answer\thinking.tsx` 中被引用
  - 在 `components\answer\title.tsx` 中被引用
  - 在 `components\queryArea\func.tsx` 中被引用
  - 在 `components\queryArea\index.tsx` 中被引用
  - 在 `components\queryArea\search.tsx` 中被引用
  - 在 `components\queryArea\tags.tsx` 中被引用
  - 在 `components\svg\base.tsx` 中被引用
  - 在 `components\tool\index.tsx` 中被引用
  - 在 `modules\history.tsx` 中被引用
  - 在 `modules\main.tsx` 中被引用
  - 在 `modules\content\index.tsx` 中被引用
  - 在 `modules\leftTab\index.tsx` 中被引用
- **Outer**: 被引用20次
  - 在 `index.tsx` 中被引用
  - 在 `index2.tsx` 中被引用
  - 在 `side.tsx` 中被引用
  - 在 `components\ListRenderer.tsx` 中被引用
  - 在 `components\answer\card.tsx` 中被引用
  - 在 `components\answer\content.tsx` 中被引用
  - 在 `components\answer\customService.tsx` 中被引用
  - 在 `components\answer\feedback.tsx` 中被引用
  - 在 `components\answer\stopButton.tsx` 中被引用
  - 在 `components\answer\thinking.tsx` 中被引用
  - 在 `components\answer\title.tsx` 中被引用
  - 在 `components\queryArea\func.tsx` 中被引用
  - 在 `components\queryArea\index.tsx` 中被引用
  - 在 `components\queryArea\tags.tsx` 中被引用
  - 在 `components\svg\base.tsx` 中被引用
  - 在 `components\tool\index.tsx` 中被引用
  - 在 `modules\history.tsx` 中被引用
  - 在 `modules\main.tsx` 中被引用
  - 在 `modules\content\index.tsx` 中被引用
  - 在 `modules\leftTab\index.tsx` 中被引用
- **AiSide**: 被引用19次
  - 在 `index2.tsx` 中被引用
  - 在 `side.tsx` 中被引用
  - 在 `components\ListRenderer.tsx` 中被引用
  - 在 `components\answer\card.tsx` 中被引用
  - 在 `components\answer\content.tsx` 中被引用
  - 在 `components\answer\customService.tsx` 中被引用
  - 在 `components\answer\feedback.tsx` 中被引用
  - 在 `components\answer\stopButton.tsx` 中被引用
  - 在 `components\answer\thinking.tsx` 中被引用
  - 在 `components\answer\title.tsx` 中被引用
  - 在 `components\queryArea\func.tsx` 中被引用
  - 在 `components\queryArea\index.tsx` 中被引用
  - 在 `components\queryArea\tags.tsx` 中被引用
  - 在 `components\svg\base.tsx` 中被引用
  - 在 `components\tool\index.tsx` 中被引用
  - 在 `modules\history.tsx` 中被引用
  - 在 `modules\main.tsx` 中被引用
  - 在 `modules\content\index.tsx` 中被引用
  - 在 `modules\leftTab\index.tsx` 中被引用
- **ListRenderer**: 被引用17次
  - 在 `components\ListRenderer.tsx` 中被引用
  - 在 `components\answer\card.tsx` 中被引用
  - 在 `components\answer\content.tsx` 中被引用
  - 在 `components\answer\customService.tsx` 中被引用
  - 在 `components\answer\feedback.tsx` 中被引用
  - 在 `components\answer\stopButton.tsx` 中被引用
  - 在 `components\answer\thinking.tsx` 中被引用
  - 在 `components\answer\title.tsx` 中被引用
  - 在 `components\queryArea\func.tsx` 中被引用
  - 在 `components\queryArea\index.tsx` 中被引用
  - 在 `components\queryArea\tags.tsx` 中被引用
  - 在 `components\svg\base.tsx` 中被引用
  - 在 `components\tool\index.tsx` 中被引用
  - 在 `modules\history.tsx` 中被引用
  - 在 `modules\main.tsx` 中被引用
  - 在 `modules\content\index.tsx` 中被引用
  - 在 `modules\leftTab\index.tsx` 中被引用
- **Card**: 被引用16次
  - 在 `components\answer\card.tsx` 中被引用
  - 在 `components\answer\content.tsx` 中被引用
  - 在 `components\answer\customService.tsx` 中被引用
  - 在 `components\answer\feedback.tsx` 中被引用
  - 在 `components\answer\stopButton.tsx` 中被引用
  - 在 `components\answer\thinking.tsx` 中被引用
  - 在 `components\answer\title.tsx` 中被引用
  - 在 `components\queryArea\func.tsx` 中被引用
  - 在 `components\queryArea\index.tsx` 中被引用
  - 在 `components\queryArea\tags.tsx` 中被引用
  - 在 `components\svg\base.tsx` 中被引用
  - 在 `components\tool\index.tsx` 中被引用
  - 在 `modules\history.tsx` 中被引用
  - 在 `modules\main.tsx` 中被引用
  - 在 `modules\content\index.tsx` 中被引用
  - 在 `modules\leftTab\index.tsx` 中被引用
- **Container**: 被引用16次
  - 在 `components\answer\card.tsx` 中被引用
  - 在 `components\answer\content.tsx` 中被引用
  - 在 `components\answer\customService.tsx` 中被引用
  - 在 `components\answer\feedback.tsx` 中被引用
  - 在 `components\answer\stopButton.tsx` 中被引用
  - 在 `components\answer\thinking.tsx` 中被引用
  - 在 `components\answer\title.tsx` 中被引用
  - 在 `components\queryArea\func.tsx` 中被引用
  - 在 `components\queryArea\index.tsx` 中被引用
  - 在 `components\queryArea\tags.tsx` 中被引用
  - 在 `components\svg\base.tsx` 中被引用
  - 在 `components\tool\index.tsx` 中被引用
  - 在 `modules\history.tsx` 中被引用
  - 在 `modules\main.tsx` 中被引用
  - 在 `modules\content\index.tsx` 中被引用
  - 在 `modules\leftTab\index.tsx` 中被引用
- **Content**: 被引用15次
  - 在 `components\answer\content.tsx` 中被引用
  - 在 `components\answer\customService.tsx` 中被引用
  - 在 `components\answer\feedback.tsx` 中被引用
  - 在 `components\answer\stopButton.tsx` 中被引用
  - 在 `components\answer\thinking.tsx` 中被引用
  - 在 `components\answer\title.tsx` 中被引用
  - 在 `components\queryArea\func.tsx` 中被引用
  - 在 `components\queryArea\index.tsx` 中被引用
  - 在 `components\queryArea\tags.tsx` 中被引用
  - 在 `components\svg\base.tsx` 中被引用
  - 在 `components\tool\index.tsx` 中被引用
  - 在 `modules\history.tsx` 中被引用
  - 在 `modules\main.tsx` 中被引用
  - 在 `modules\content\index.tsx` 中被引用
  - 在 `modules\leftTab\index.tsx` 中被引用
- **CustomService**: 被引用14次
  - 在 `components\answer\customService.tsx` 中被引用
  - 在 `components\answer\feedback.tsx` 中被引用
  - 在 `components\answer\stopButton.tsx` 中被引用
  - 在 `components\answer\thinking.tsx` 中被引用
  - 在 `components\answer\title.tsx` 中被引用
  - 在 `components\queryArea\func.tsx` 中被引用
  - 在 `components\queryArea\index.tsx` 中被引用
  - 在 `components\queryArea\tags.tsx` 中被引用
  - 在 `components\svg\base.tsx` 中被引用
  - 在 `components\tool\index.tsx` 中被引用
  - 在 `modules\history.tsx` 中被引用
  - 在 `modules\main.tsx` 中被引用
  - 在 `modules\content\index.tsx` 中被引用
  - 在 `modules\leftTab\index.tsx` 中被引用
- **Feedback**: 被引用13次
  - 在 `components\answer\feedback.tsx` 中被引用
  - 在 `components\answer\stopButton.tsx` 中被引用
  - 在 `components\answer\thinking.tsx` 中被引用
  - 在 `components\answer\title.tsx` 中被引用
  - 在 `components\queryArea\func.tsx` 中被引用
  - 在 `components\queryArea\index.tsx` 中被引用
  - 在 `components\queryArea\tags.tsx` 中被引用
  - 在 `components\svg\base.tsx` 中被引用
  - 在 `components\tool\index.tsx` 中被引用
  - 在 `modules\history.tsx` 中被引用
  - 在 `modules\main.tsx` 中被引用
  - 在 `modules\content\index.tsx` 中被引用
  - 在 `modules\leftTab\index.tsx` 中被引用
- **StopButton**: 被引用12次
  - 在 `components\answer\stopButton.tsx` 中被引用
  - 在 `components\answer\thinking.tsx` 中被引用
  - 在 `components\answer\title.tsx` 中被引用
  - 在 `components\queryArea\func.tsx` 中被引用
  - 在 `components\queryArea\index.tsx` 中被引用
  - 在 `components\queryArea\tags.tsx` 中被引用
  - 在 `components\svg\base.tsx` 中被引用
  - 在 `components\tool\index.tsx` 中被引用
  - 在 `modules\history.tsx` 中被引用
  - 在 `modules\main.tsx` 中被引用
  - 在 `modules\content\index.tsx` 中被引用
  - 在 `modules\leftTab\index.tsx` 中被引用
- **Thinking**: 被引用11次
  - 在 `components\answer\thinking.tsx` 中被引用
  - 在 `components\answer\title.tsx` 中被引用
  - 在 `components\queryArea\func.tsx` 中被引用
  - 在 `components\queryArea\index.tsx` 中被引用
  - 在 `components\queryArea\tags.tsx` 中被引用
  - 在 `components\svg\base.tsx` 中被引用
  - 在 `components\tool\index.tsx` 中被引用
  - 在 `modules\history.tsx` 中被引用
  - 在 `modules\main.tsx` 中被引用
  - 在 `modules\content\index.tsx` 中被引用
  - 在 `modules\leftTab\index.tsx` 中被引用
- **Title**: 被引用10次
  - 在 `components\answer\title.tsx` 中被引用
  - 在 `components\queryArea\func.tsx` 中被引用
  - 在 `components\queryArea\index.tsx` 中被引用
  - 在 `components\queryArea\tags.tsx` 中被引用
  - 在 `components\svg\base.tsx` 中被引用
  - 在 `components\tool\index.tsx` 中被引用
  - 在 `modules\history.tsx` 中被引用
  - 在 `modules\main.tsx` 中被引用
  - 在 `modules\content\index.tsx` 中被引用
  - 在 `modules\leftTab\index.tsx` 中被引用
- **Func**: 被引用9次
  - 在 `components\queryArea\func.tsx` 中被引用
  - 在 `components\queryArea\index.tsx` 中被引用
  - 在 `components\queryArea\tags.tsx` 中被引用
  - 在 `components\svg\base.tsx` 中被引用
  - 在 `components\tool\index.tsx` 中被引用
  - 在 `modules\history.tsx` 中被引用
  - 在 `modules\main.tsx` 中被引用
  - 在 `modules\content\index.tsx` 中被引用
  - 在 `modules\leftTab\index.tsx` 中被引用
- **EditStyle**: 被引用8次
  - 在 `components\queryArea\index.tsx` 中被引用
  - 在 `components\queryArea\tags.tsx` 中被引用
  - 在 `components\svg\base.tsx` 中被引用
  - 在 `components\tool\index.tsx` 中被引用
  - 在 `modules\history.tsx` 中被引用
  - 在 `modules\main.tsx` 中被引用
  - 在 `modules\content\index.tsx` 中被引用
  - 在 `modules\leftTab\index.tsx` 中被引用
- **QueryArea**: 被引用8次
  - 在 `components\queryArea\index.tsx` 中被引用
  - 在 `components\queryArea\tags.tsx` 中被引用
  - 在 `components\svg\base.tsx` 中被引用
  - 在 `components\tool\index.tsx` 中被引用
  - 在 `modules\history.tsx` 中被引用
  - 在 `modules\main.tsx` 中被引用
  - 在 `modules\content\index.tsx` 中被引用
  - 在 `modules\leftTab\index.tsx` 中被引用
- **AnswerTags**: 被引用7次
  - 在 `components\queryArea\tags.tsx` 中被引用
  - 在 `components\svg\base.tsx` 中被引用
  - 在 `components\tool\index.tsx` 中被引用
  - 在 `modules\history.tsx` 中被引用
  - 在 `modules\main.tsx` 中被引用
  - 在 `modules\content\index.tsx` 中被引用
  - 在 `modules\leftTab\index.tsx` 中被引用
- **MainTags**: 被引用7次
  - 在 `components\queryArea\tags.tsx` 中被引用
  - 在 `components\svg\base.tsx` 中被引用
  - 在 `components\tool\index.tsx` 中被引用
  - 在 `modules\history.tsx` 中被引用
  - 在 `modules\main.tsx` 中被引用
  - 在 `modules\content\index.tsx` 中被引用
  - 在 `modules\leftTab\index.tsx` 中被引用
- **Tags**: 被引用7次
  - 在 `components\queryArea\tags.tsx` 中被引用
  - 在 `components\svg\base.tsx` 中被引用
  - 在 `components\tool\index.tsx` 中被引用
  - 在 `modules\history.tsx` 中被引用
  - 在 `modules\main.tsx` 中被引用
  - 在 `modules\content\index.tsx` 中被引用
  - 在 `modules\leftTab\index.tsx` 中被引用
- **Icon**: 被引用6次
  - 在 `components\svg\base.tsx` 中被引用
  - 在 `components\tool\index.tsx` 中被引用
  - 在 `modules\history.tsx` 中被引用
  - 在 `modules\main.tsx` 中被引用
  - 在 `modules\content\index.tsx` 中被引用
  - 在 `modules\leftTab\index.tsx` 中被引用
- **Image**: 被引用6次
  - 在 `components\svg\base.tsx` 中被引用
  - 在 `components\tool\index.tsx` 中被引用
  - 在 `modules\history.tsx` 中被引用
  - 在 `modules\main.tsx` 中被引用
  - 在 `modules\content\index.tsx` 中被引用
  - 在 `modules\leftTab\index.tsx` 中被引用
- **Wrap**: 被引用6次
  - 在 `components\svg\base.tsx` 中被引用
  - 在 `components\tool\index.tsx` 中被引用
  - 在 `modules\history.tsx` 中被引用
  - 在 `modules\main.tsx` 中被引用
  - 在 `modules\content\index.tsx` 中被引用
  - 在 `modules\leftTab\index.tsx` 中被引用

### 中等依赖组件 (被引用2-5次)
- **Tool**: 被引用5次
  - 在 `components\tool\index.tsx` 中被引用
  - 在 `modules\history.tsx` 中被引用
  - 在 `modules\main.tsx` 中被引用
  - 在 `modules\content\index.tsx` 中被引用
  - 在 `modules\leftTab\index.tsx` 中被引用
- **History**: 被引用4次
  - 在 `modules\history.tsx` 中被引用
  - 在 `modules\main.tsx` 中被引用
  - 在 `modules\content\index.tsx` 中被引用
  - 在 `modules\leftTab\index.tsx` 中被引用
- **AiMain**: 被引用3次
  - 在 `modules\main.tsx` 中被引用
  - 在 `modules\content\index.tsx` 中被引用
  - 在 `modules\leftTab\index.tsx` 中被引用

### 低依赖组件 (被引用1次)
- **LeftTab**: 被引用1次，在 `modules\leftTab\index.tsx` 中