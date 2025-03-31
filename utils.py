#!/usr/bin/env python
# -*- coding: utf-8 -*-

import re

# React组件相关的正则表达式
# 用于匹配import语句，支持解构导入和默认导入
IMPORT_PATTERN = r'import\s+{?\s*([A-Za-z0-9_,\s]+)}?\s+from\s+[\'"]([@\w\-\._/]+)[\'"](.*?)'

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
    
    使用正则表达式匹配文件中的import语句，支持解构导入和默认导入。
    
    Args:
        content (str): 要分析的文件内容
    
    Returns:
        Dict[str, str]: 导入映射字典，键为导入项，值为来源模块
    
    示例：
    - import { Component } from 'react'
    - import DefaultComponent from './components'
    """
    imports = {}
    for match in re.finditer(IMPORT_PATTERN, content):
        imported_items = [imp.strip() for imp in match.group(1).split(',')]
        source = match.group(2)
        for item in imported_items:
            imports[item] = source
    return imports

def find_component_definitions(content: str):
    """查找文件中的组件定义
    
    使用预定义的正则表达式模式匹配不同类型的React组件定义，
    包括类组件、函数组件、箭头函数组件、HOC包装组件等。
    过滤掉常量数组定义如FEEDBACK_TYPE。
    
    Args:
        content (str): 要分析的文件内容
    
    Returns:
        Set[str]: 组件名称集合
    """
    components = set()
    for pattern in COMPONENT_PATTERNS:
        for match in re.finditer(pattern, content):
            component_name = match.group(1)
            # 过滤掉常量数组定义
            if not (component_name.endswith('_TYPE') or component_name.isupper()):
                components.add(component_name)
    return components

def find_component_references(content: str, component_name: str):
    """查找特定组件的引用
    
    查找文件中对指定组件的所有引用，包括：
    - JSX标签形式的引用
    - styled-components中的引用
    - HOC包装中的引用
    - React.memo和forwardRef中的引用
    
    Args:
        content (str): 要分析的文件内容
        component_name (str): 要查找的组件名称
    
    Returns:
        List[str]: 组件被引用的行号列表
    """
    patterns = [
        # JSX组件引用
        f'<{component_name}(?:\s+[^>]*>|\s*/?>|>|\s+[^>]*/>)',
        # styled-components引用
        f'const\s+[A-Z][\w]*?\s*=\s*styled(?:\({component_name}\)|\.[w]+`)',
        # HOC包装引用
        f'(?:connect|withRouter|withStyles|withTheme|with[A-Z][\w]*)\({component_name}\)',
        # React.memo引用
        f'(?:React\.)?memo\({component_name}\)',
        # React.forwardRef引用
        f'(?:React\.)?forwardRef\({component_name}\)'
    ]
    references = []
    for pattern in patterns:
        references.extend(re.finditer(pattern, content))
    return [str(content[:m.start()].count('\n') + 1) for m in references]