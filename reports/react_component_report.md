# React组件分析报告

## 元数据
- **文档类型**: React组件分析
- **生成时间**: 2025-04-01 13:51:13
- **组件总数**: 3
- **文档用途**: 组件依赖关系分析
- **适用场景**: 代码审查、架构分析、重构规划

## 组件定义概览
- **AiCore**: 定义于 `d:\workspace\demo\CodeScanning2\ai2\aiCore.tsx`
- **AiMain**: 定义于 `d:\workspace\demo\CodeScanning2\ai2\modules\main.tsx`
- **Wrapper**: 定义于 `d:\workspace\demo\CodeScanning2\ai2\modules\main.tsx`

## 组件详细信息

### 组件: AiCore
**组件ID**: `AiCore`
**定义位置**: `d:\workspace\demo\CodeScanning2\ai2\aiCore.tsx`
**导入来源**: 无外部导入或未检测到
**被引用次数**: 0
**引用位置**: 未在其他组件中被引用
**组件类型**: 核心组件

### 组件: AiMain
**组件ID**: `AiMain`
**定义位置**: `d:\workspace\demo\CodeScanning2\ai2\modules\main.tsx`
**导入来源**: `./modules/main`
**被引用次数**: 1
**引用位置**:
- `aiCore.tsx:335`
**组件类型**: 模块组件

### 组件: Wrapper
**组件ID**: `Wrapper`
**定义位置**: `d:\workspace\demo\CodeScanning2\ai2\modules\main.tsx`
**导入来源**: 无外部导入或未检测到
**被引用次数**: 2
**引用位置**:
- `aiCore.tsx:303`
- `modules\main.tsx:22,24`
**组件类型**: 模块组件

## 组件依赖关系

### 中等依赖组件 (被引用2-5次)
- **Wrapper**: 被引用2次
  - 在 `aiCore.tsx` 中被引用
  - 在 `modules\main.tsx` 中被引用

### 低依赖组件 (被引用1次)
- **AiMain**: 被引用1次，在 `aiCore.tsx` 中

### 未被引用的组件
- **AiCore**: 定义于 `d:\workspace\demo\CodeScanning2\ai2\aiCore.tsx`