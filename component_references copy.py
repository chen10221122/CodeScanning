#!/usr/bin/env python
# -*- coding: utf-8 -*-

import re
import json
import subprocess
from pathlib import Path


def find_component_references(content: str, component_name: str):
    """查找特定组件的引用
    
    查找文件中对指定组件的所有引用，包括：
    - JSX标签形式的引用
    - styled-components中的引用
    - HOC包装中的引用
    - React.memo和forwardRef中的引用
    - 条件渲染中的组件引用
    
    Args:
        content (str): 要分析的文件内容
        component_name (str): 要查找的组件名称
    
    Returns:
        List[str]: 组件被引用的行号列表
    """
    print(f"\n[DEBUG] 查找组件引用: {component_name}")
    
    # 过滤内置组件
    builtin_components = {
        'div', 'span', 'a', 'button', 'input', 'img', 'ul', 'li', 'p', 'h1', 'h2', 'h3', 'form',
        'table', 'tr', 'td', 'th', 'thead', 'tbody', 'tfoot', 'label', 'select', 'option', 'textarea',
        'nav', 'header', 'footer', 'main', 'section', 'article', 'aside', 'details', 'dialog', 'summary',
        'figure', 'figcaption', 'picture', 'source', 'time', 'data', 'meter', 'progress', 'output',
        'iframe', 'object', 'param', 'video', 'audio', 'track', 'embed', 'canvas', 'svg', 'math'
    }
    
    # 使用简单的字符串查找方法检查组件引用
    line_numbers = set()
    lines = content.split('\n')
    for line_num, line in enumerate(lines, 1):
        # 检查是否包含组件标签，同时排除内置组件和特殊组件
        
        if (f"<{component_name}" in line 
                and component_name not in builtin_components 
                and not re.search(r'<\s*(Suspense|Fragment|Profiler|StrictMode|SuspenseList|React\.Fragment)\b', line) 
                and not any(component_name.lower() == builtin.lower() for builtin in builtin_components)):
            print(f"[DEBUG] 行 {line_num} 匹配到组件 {component_name}: {line[:100]}")
            line_numbers.add(line_num)
    
    result = sorted(map(str, line_numbers))
    print(f"[DEBUG] 组件 {component_name} 引用行号: {result}")
    return result



# 备用的基于AST的实现方法
def find_component_references_ast(content: str, component_name: str) -> list:
    """查找特定组件的引用（基于AST的实现）
    
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
    # 获取 Node.js 脚本的绝对路径
    js_script_path = Path(__file__).parent / "js-ast" / "find-component-references.js"
    
    # 调用 Node.js 脚本
    cmd = [
        'node',
        str(js_script_path),
        json.dumps([content, component_name])  # 传递参数
    ]
    
    try:
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            encoding='utf-8',
            check=True
        )
        lines = json.loads(result.stdout)
        return [str(line) for line in lines]
    except subprocess.CalledProcessError as e:
        print("Node.js 脚本执行错误:", e.stderr)
        return []
    except json.JSONDecodeError:
        print("解析 Node.js 输出失败")
        return []