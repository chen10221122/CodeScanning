#!/usr/bin/env python
# -*- coding: utf-8 -*-

from pathlib import Path
from typing import Dict, List, Set
from utils import find_imports, find_component_definitions
from component_references import find_component_references

class ComponentAnalyzer:
    """React组件分析器
    
    这个类负责分析React文件中的组件定义和引用关系。
    它能够识别组件的定义位置、引用位置，以及import语句，
    从而构建组件之间的依赖关系图。
    """
    
    def __init__(self):
        """初始化组件分析器
        
        初始化三个字典来存储分析结果：
        - component_references: 存储组件被引用的位置
        - component_definitions: 存储组件的定义位置
        - imports: 存储import语句的信息
        """
        self.component_references: Dict[str, List[str]] = {}  # 组件名 -> 引用位置列表
        self.component_definitions: Dict[str, str] = {}      # 组件名 -> 定义文件路径
        self.imports: Dict[str, str] = {}                    # 导入项 -> 来源模块
    
    def collect_component_definitions(self, file_path: Path, root_path: Path, content: str):
        """收集单个文件中的组件定义
        
        此方法专门用于收集组件定义，是analyze_file的简化版本，
        只执行import解析和组件定义收集，不进行引用分析。
        
        Args:
            file_path (Path): 要分析的文件路径
            root_path (Path): 项目根目录路径
            content (str): 文件的内容
        """
        try:
            # 解析import语句
            self.imports.update(find_imports(content))

            # 查找组件定义
            components = find_component_definitions(content)
            for component in components:
                self.component_definitions[component] = str(file_path)
        except Exception as e:
            print(f"Error collecting component definitions from {file_path}: {str(e)}")
    
    def analyze_references(self, file_path: Path, root_path: Path, content: str):
        """分析单个文件中的组件引用
        
        此方法专门用于分析组件引用，应在所有组件定义收集完成后调用。
        它使用完整的组件定义列表来查找文件中的所有组件引用。
        
        Args:
            file_path (Path): 要分析的文件路径
            root_path (Path): 项目根目录路径，用于生成相对路径
            content (str): 文件的内容
        """
        try:
            # 使用所有已知的组件定义来查找引用
            all_components = set(self.component_definitions.keys())
            
            for component in all_components:
                ref_lines = find_component_references(content, component)
                if ref_lines:
                    if component not in self.component_references:
                        self.component_references[component] = []
                    self.component_references[component].append(
                        f"{file_path.relative_to(root_path)}:{','.join(ref_lines)}"
                    )
        except Exception as e:
            print(f"Error analyzing references in {file_path}: {str(e)}")

    def get_analysis_results(self):
        """返回分析结果
        
        Returns:
            Dict: 包含三个部分的分析结果：
            - component_references: 组件的引用信息
            - component_definitions: 组件的定义信息
            - imports: import语句的信息
        """
        return {
            'component_references': self.component_references,
            'component_definitions': self.component_definitions,
            'imports': self.imports
        }