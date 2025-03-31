#!/usr/bin/env python
# -*- coding: utf-8 -*-

from typing import Dict, List
import os
import json
from pathlib import Path
import time
import re

class ReportGenerator:
    """React组件分析报告生成器
    
    这个类负责将组件分析的结果整理成可读的报告格式。
    它能够展示组件的定义位置、引用关系和导入信息，
    帮助开发者理解React项目的组件依赖结构。
    支持生成控制台报告和Markdown格式报告。
    """
    
    def __init__(self, component_definitions: Dict[str, str], component_references: Dict[str, List[str]], imports: Dict[str, str]):
        """初始化报告生成器
        
        Args:
            component_definitions (Dict[str, str]): 组件定义信息，键为组件名，值为定义文件路径
            component_references (Dict[str, List[str]]): 组件引用信息，键为组件名，值为引用位置列表
            imports (Dict[str, str]): 导入信息，键为导入项，值为来源模块
        """
        self.component_definitions = component_definitions
        self.component_references = component_references
        self.imports = imports
        self.timestamp = time.strftime("%Y-%m-%d %H:%M:%S")

    def generate_report(self):
        """生成组件依赖关系报告（控制台输出）
        
        生成一个包含以下内容的报告：
        1. 已定义的组件列表及其定义位置
        2. 每个组件的导入来源（如果有）
        3. 每个组件被引用的位置列表
        
        报告格式：
        - 按字母顺序排序组件
        - 清晰展示组件的定义、导入和引用信息
        - 使用缩进和分隔符提高可读性
        """
        print("\nReact Component Analysis Report")
        print("-" * 40)
        print(f"Generated at: {self.timestamp}")
        
        # 输出所有已定义的组件
        print("\nDefined Components:")
        component_count = len(self.component_definitions)
        print(f"Found {component_count} components in total.")
        
        # 按字母顺序排序组件名
        sorted_components = sorted(self.component_definitions.keys())
        
        for component in sorted_components:
            definition_path = self.component_definitions[component]
            print(f"\n- {component}")
            print(f"  Defined in: {definition_path}")
            
            # 显示导入信息
            if component in self.imports:
                print(f"  Imported from: {self.imports[component]}")
            
            # 显示引用信息
            if component in self.component_references:
                references = self.component_references[component]
                print(f"  Referenced in {len(references)} places:")
                for ref in references:
                    print(f"    - {ref}")
            else:
                print("  Not referenced in other components")
    
    def generate_dify_friendly_report(self, output_file_path: str | None = None):
        """生成适合Dify知识库导入的Markdown报告
        
        生成一个结构化的Markdown文档，针对向量化和大模型理解进行了优化：
        1. 元数据部分：添加更多标签和分类信息
        2. 组件定义：使用更清晰的层级结构
        3. 组件关系：按依赖程度分类，便于理解
        4. 每个组件独立成块：便于向量化和检索
        
        报告格式：
        - 使用标准Markdown格式（标题、列表、表格等）
        - 结构化组织内容，便于大模型识别和向量化
        - 每个组件信息独立成块，便于分段索引
        
        Args:
            output_file_path (str, optional): 输出文件路径。如果为None，则使用默认路径。
        
        Returns:
            str: 生成的Markdown报告内容
        """
        if output_file_path is None:
            output_dir = Path("reports")
            output_dir.mkdir(exist_ok=True)
            timestamp = time.strftime("%Y%m%d_%H%M%S")
            output_file_path = str(output_dir / f"react_component_report_{timestamp}.md")
        
        # 按字母顺序排序组件名
        sorted_components = sorted(self.component_definitions.keys())
        component_count = len(sorted_components)
        
        # 构建Markdown内容
        md_content = []
        
        # 标题和元数据 - 添加更多元数据标签，便于向量化
        md_content.append("# React组件分析报告")
        md_content.append(f"\n## 元数据")
        md_content.append(f"- **文档类型**: React组件分析")
        md_content.append(f"- **生成时间**: {self.timestamp}")
        md_content.append(f"- **组件总数**: {component_count}")
        md_content.append(f"- **文档用途**: 组件依赖关系分析")
        md_content.append(f"- **适用场景**: 代码审查、架构分析、重构规划")
        
        # 组件定义概览 - 简化表格，使其更易于向量化
        md_content.append("\n## 组件定义概览")
        for component in sorted_components:
            definition_path = self.component_definitions[component]
            md_content.append(f"- **{component}**: 定义于 `{definition_path}`")
        
        # 组件详细信息 - 每个组件使用独立的知识块，便于向量化
        md_content.append("\n## 组件详细信息")
        for component in sorted_components:
            # 使用更明确的标题格式，便于分块索引
            md_content.append(f"\n### 组件: {component}")
            
            # 创建组件卡片，包含所有相关信息
            definition_path = self.component_definitions[component]
            md_content.append(f"**组件ID**: `{component}`")
            md_content.append(f"**定义位置**: `{definition_path}`")
            
            # 导入信息
            if component in self.imports:
                md_content.append(f"**导入来源**: `{self.imports[component]}`")
            else:
                md_content.append("**导入来源**: 无外部导入或未检测到")
            
            # 引用信息 - 使用更结构化的格式
            if component in self.component_references:
                references = self.component_references[component]
                md_content.append(f"**被引用次数**: {len(references)}")
                md_content.append("**引用位置**:")
                for ref in references:
                    md_content.append(f"- `{ref}`")
            else:
                md_content.append("**被引用次数**: 0")
                md_content.append("**引用位置**: 未在其他组件中被引用")
            
            # 添加组件类型标签（基于文件路径推断）
            if '/components/' in definition_path.replace('\\', '/'):
                md_content.append("**组件类型**: UI组件")
            elif '/hooks/' in definition_path.replace('\\', '/'):
                md_content.append("**组件类型**: Hook")
            elif '/modules/' in definition_path.replace('\\', '/'):
                md_content.append("**组件类型**: 模块组件")
            else:
                md_content.append("**组件类型**: 核心组件")
        
        # 组件依赖关系 - 使用更结构化的格式，便于向量化理解
        md_content.append("\n## 组件依赖关系")
        
        # 按依赖类型分类
        high_dependency_components = []
        medium_dependency_components = []
        low_dependency_components = []
        
        for component in sorted_components:
            if component in self.component_references:
                references = self.component_references[component]
                ref_count = len(references)
                if ref_count > 5:
                    high_dependency_components.append((component, ref_count))
                elif ref_count > 1:
                    medium_dependency_components.append((component, ref_count))
                elif ref_count > 0:
                    low_dependency_components.append((component, ref_count))
        
        # 高依赖组件
        if high_dependency_components:
            md_content.append("\n### 高依赖组件 (被引用5次以上)")
            for component, count in sorted(high_dependency_components, key=lambda x: x[1], reverse=True):
                md_content.append(f"- **{component}**: 被引用{count}次")
                references = self.component_references[component]
                for ref in references:
                    file_path = ref.split(":")[0] if ":" in ref else ref
                    md_content.append(f"  - 在 `{file_path}` 中被引用")
        
        # 中等依赖组件
        if medium_dependency_components:
            md_content.append("\n### 中等依赖组件 (被引用2-5次)")
            for component, count in sorted(medium_dependency_components, key=lambda x: x[1], reverse=True):
                md_content.append(f"- **{component}**: 被引用{count}次")
                references = self.component_references[component]
                for ref in references:
                    file_path = ref.split(":")[0] if ":" in ref else ref
                    md_content.append(f"  - 在 `{file_path}` 中被引用")
        
        # 低依赖组件
        if low_dependency_components:
            md_content.append("\n### 低依赖组件 (被引用1次)")
            for component, count in low_dependency_components:
                md_content.append(f"- **{component}**: 被引用{count}次，在 `{self.component_references[component][0].split(':')[0] if ':' in self.component_references[component][0] else self.component_references[component][0]}` 中")
        
        # 未被引用的组件
        unused_components = []
        for component in sorted_components:
            if component not in self.component_references or not self.component_references[component]:
                unused_components.append(component)
        
        if unused_components:
            md_content.append("\n### 未被引用的组件")
            for component in unused_components:
                md_content.append(f"- **{component}**: 定义于 `{self.component_definitions[component]}`")
        
        # 将内容写入文件
        markdown_text = "\n".join(md_content)
        output_path = Path(output_file_path)
        output_path.parent.mkdir(exist_ok=True)
        output_path.write_text(markdown_text, encoding="utf-8")
        
        print(f"\nDify友好的Markdown报告已生成: {output_path}")
        return markdown_text
    
    def generate_markdown_report(self, output_file_path: str | None = None):
        """生成组件依赖关系的Markdown报告
        
        此方法现在调用优化后的generate_dify_friendly_report方法
        以生成更适合Dify知识库导入的报告格式
        
        Args:
            output_file_path (str, optional): 输出文件路径。如果为None，则使用默认路径。
        
        Returns:
            str: 生成的Markdown报告内容
        """
        return self.generate_dify_friendly_report(output_file_path)