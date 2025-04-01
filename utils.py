#!/usr/bin/env python
# -*- coding: utf-8 -*-

import re
import json
import subprocess
from pathlib import Path

# React组件相关的正则表达式
# 用于匹配import语句，支持解构导入、默认导入和命名空间导入
IMPORT_PATTERNS = [
    # 解构导入：import { Component1, Component2 } from 'module'
    r'import\s+{\s*([A-Za-z0-9_,\s]+)}\s+from\s+[\'"]([@\w\-\._/]+)[\'"](.*?)',
    # 默认导入：import DefaultComponent from 'module'
    r'import\s+([A-Z][\w]*)\s+from\s+[\'"]([@\w\-\._/]+)[\'"](.*?)',
    # 命名空间导入：import * as Components from 'module'
    r'import\s+\*\s+as\s+([A-Z][\w]*)\s+from\s+[\'"]([@\w\-\._/]+)[\'"](.*?)'
]

# 用于匹配不同类型的React组件定义的正则表达式列表
COMPONENT_PATTERNS = [
    # 类组件：继承自React.Component或PureComponent的类定义
    r'class\s+([A-Z][\w]*?)\s+extends\s+(?:React\.)?(?:Component|PureComponent)',
    
    # 函数组件（带类型定义）：使用FC、FunctionComponent等类型声明的函数
    r'(?:export\s+)?(?:function|const)\s+([A-Z][\w]*?)\s*[:<]\s*(?:React\.)?(?:FC|FunctionComponent|VFC|VoidFunctionComponent)',
    
    # 普通函数组件：使用function关键字定义的组件
    r'(?:export\s+)?function\s+([A-Z][\w]*?)\s*\(',
    
    # 箭头函数组件（带类型定义）：使用箭头函数语法的组件
    r'(?:export\s+)?const\s+([A-Z][\w]*?)\s*:\s*(?:React\.)?(?:FC|FunctionComponent|VFC|VoidFunctionComponent)',
    
    # 普通箭头函数组件：不带类型定义的箭头函数组件
    r'(?:export\s+)?const\s+([A-Z][\w]*?)\s*=\s*(?:\([^)]*\)|[^=]*)\s*=>',
    
    # memo包装的组件：使用React.memo高阶组件包装的组件
    r'(?:export\s+)?const\s+([A-Z][\w]*?)\s*=\s*(?:React\.)?memo\s*\(\s*(?:function|\([^)]*\)\s*=>|[A-Z][\w]*)',
    
    # styled-components组件：使用styled-components创建的样式组件
    r'(?:export\s+)?const\s+([A-Z][\w]*?)\s*=\s*styled(?:\.[\w]+|\([A-Z][\w]*\)\.[\w]+|\([A-Z][\w]*\))`',
    
    # forwardRef组件：使用React.forwardRef包装的组件
    r'(?:export\s+)?const\s+([A-Z][\w]*?)\s*=\s*(?:React\.)?forwardRef\s*\(',
    
    # HOC包装的组件：使用常见高阶组件包装的组件
    r'(?:export\s+)?const\s+([A-Z][\w]*?)\s*=\s*(?:connect|withRouter|withStyles|withTheme)\s*\(',
    
    # 自定义HOC包装的组件：使用自定义高阶组件包装的组件
    r'(?:export\s+)?const\s+([A-Z][\w]*?)\s*=\s*with[A-Z][\w]*\s*\('
]

def find_imports(content: str):
    """解析文件中的import语句
    
    使用正则表达式匹配文件中的import语句，支持解构导入、默认导入和命名空间导入。
    
    Args:
        content (str): 要分析的文件内容
    
    Returns:
        Dict[str, str]: 导入映射字典，键为导入项，值为来源模块
    
    示例：
    - import { Component } from 'react'
    - import DefaultComponent from './components'
    - import * as Components from './components'
    """
    imports = {}
    for pattern in IMPORT_PATTERNS:
        for match in re.finditer(pattern, content):
            imported_items = [imp.strip() for imp in match.group(1).split(',')] if '{' in match.group(0) else [match.group(1)]
            source = match.group(2)
            for item in imported_items:
                if item and not item.startswith('use') and not item.endswith('Provider'):  # 过滤掉Hooks和Context Provider
                    imports[item] = source
    return imports

def find_component_definitions(content: str):
    """查找文件中的组件定义
    
    使用预定义的正则表达式模式匹配不同类型的React组件定义，
    包括类组件、函数组件、箭头函数组件、HOC包装组件等。
    同时识别子组件和导入的组件。
    
    Args:
        content (str): 要分析的文件内容
    
    Returns:
        Set[str]: 组件名称集合
    """
    components = set()
    
    # 1. 查找直接定义的组件
    for pattern in COMPONENT_PATTERNS:
        for match in re.finditer(pattern, content):
            component_name = match.group(1)
            # 过滤掉常量数组定义和非组件命名
            if (not component_name.endswith('_TYPE')
                and not component_name.isupper()
                and not component_name.endswith('Context')
                and not component_name.endswith('Provider')
                and not component_name.startswith('use')):
                components.add(component_name)
    
    # 2. 查找子组件定义
    sub_component_pattern = r'(?:const|let|var)\s+([A-Z][\w]*?)\s*=\s*[^=]*?=>'  # 匹配组件内部定义的子组件
    for match in re.finditer(sub_component_pattern, content):
        component_name = match.group(1)
        if not component_name.endswith('_TYPE') and not component_name.isupper():
            components.add(component_name)
    
    # 3. 查找字符串形式的组件引用
    string_component_pattern = r'[\'\"]((?:[A-Z][a-zA-Z]*?)+)[\'"]'  # 匹配字符串中的组件名称
    for match in re.finditer(string_component_pattern, content):
        component_name = match.group(1)
        if (component_name.endswith('Component')
            or any(word[0].isupper() for word in component_name.split())
            and not component_name.endswith('_TYPE')
            and not component_name.isupper()):
            components.add(component_name)
    
    return components