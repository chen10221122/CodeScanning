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
    
    def generate_markdown_report(self, output_file_path: str | None = None):
        """生成组件依赖关系的Markdown报告
        
        生成一个结构化的Markdown文档，包含以下内容：
        1. 元数据部分：扫描时间、组件总数等
        2. 组件定义列表：每个组件的定义位置
        3. 组件引用关系：每个组件被引用的位置
        4. 导入信息：组件的导入来源
        
        报告格式：
        - 使用标准Markdown格式（标题、列表、表格、代码块等）
        - 结构化组织内容，便于大模型识别和向量化
        - 包含元数据和组件关系图的文本描述
        
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
        
        # 标题和元数据
        md_content.append("# React组件分析报告")
        md_content.append(f"\n## 元数据")
        md_content.append(f"- **生成时间**: {self.timestamp}")
        md_content.append(f"- **组件总数**: {component_count}")
        
        # 组件定义概览
        md_content.append("\n## 组件定义概览")
        md_content.append("| 组件名 | 定义文件 |")
        md_content.append("| ------ | -------- |")
        for component in sorted_components:
            definition_path = self.component_definitions[component]
            md_content.append(f"| `{component}` | `{definition_path}` |")
        
        # 组件详细信息
        md_content.append("\n## 组件详细信息")
        for component in sorted_components:
            md_content.append(f"\n### {component}")
            
            # 定义信息
            definition_path = self.component_definitions[component]
            md_content.append(f"- **定义位置**: `{definition_path}`")
            
            # 导入信息
            if component in self.imports:
                md_content.append(f"- **导入来源**: `{self.imports[component]}`")
            
            # 引用信息
            if component in self.component_references:
                references = self.component_references[component]
                md_content.append(f"- **引用位置** ({len(references)}):")
                for ref in references:
                    md_content.append(f"  - `{ref}`")
            else:
                md_content.append("- **引用位置**: 未在其他组件中被引用")
        
        # 组件关系图（文本描述）
        md_content.append("\n## 组件关系图")
        md_content.append("以下是组件之间的引用关系描述：")
        
        # 构建组件引用关系
        for component in sorted_components:
            if component in self.component_references:
                references = self.component_references[component]
                if references:
                    md_content.append(f"- `{component}` 被引用于:")
                    for ref in references:
                        # 从引用路径中提取文件名
                        file_path = ref.split(":")[0] if ":" in ref else ref
                        md_content.append(f"  - `{file_path}`")
        
        # 扫描性能因素说明
        md_content.append("\n## 扫描性能因素")
        md_content.append("React组件扫描的性能受以下因素影响：")
        md_content.append("1. **文件数量**: 项目中的文件数量越多，扫描时间越长")
        md_content.append("2. **文件大小**: 大文件的解析需要更多时间")
        md_content.append("3. **组件复杂度**: 复杂的组件结构和嵌套关系会增加分析时间")
        md_content.append("4. **计算机性能**: CPU、内存和磁盘I/O速度会影响扫描效率")
        md_content.append("5. **并行处理**: 启用并行处理可以提高扫描速度，但会增加内存使用")
        
        # 将内容写入文件
        markdown_text = "\n".join(md_content)
        output_path = Path(output_file_path)
        output_path.parent.mkdir(exist_ok=True)
        output_path.write_text(markdown_text, encoding="utf-8")
        
        print(f"\nMarkdown报告已生成: {output_path}")
        return markdown_text