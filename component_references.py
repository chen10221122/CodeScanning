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
    # print(f"\n[DEBUG] 组件内容: {content}")
    escaped_name = re.escape(component_name)  # 转义特殊字符（如 . $ 等）
    
    
    patterns = [
        # 新增备选方案：匹配任意以<开头的组件引用
        rf'<\s*({re.escape(component_name)}\b(?:\.[\w]+)?)',
        # 新增备选方案：匹配命名空间子组件
        rf'<\s*{escaped_name}\.[\w]+\b',
        
        # 1️⃣ **基本JSX标签**
        # 匹配完整 JSX 标签（支持任意多行属性）- 增强版，更宽松的空格处理
        rf'<\s*{escaped_name}\b(\s+[^>]*?|\s*?)>.*?<\s*/\s*{escaped_name}\s*>',
        # 匹配自闭合 JSX 标签（支持任意多行属性）- 增强版，更宽松的空格处理
        rf'<\s*{escaped_name}\b[\s\S]*?\/\s*>',
        # 匹配组件的子组件引用（如 Timeline.Item）
        rf'<\s*{escaped_name}\.\w+\b[^>]*?(?:/>|>)',
        
        # 2️⃣ **条件渲染中的组件引用**
        # 处理条件渲染中的组件引用 (&&) - 包括花括号包裹和不包裹的情况 - 增强版
        rf'\b\S+\s*&&\s*<\s*{escaped_name}\b[\s\S]*?(?:<\s*/\s*{escaped_name}\s*>|\/\s*>)',
        # 处理花括号包裹的条件渲染 ({condition && <Component />}) - 增强版
        rf'\{{\s*[\w\.]+\s*&&\s*<\s*{escaped_name}\b[\s\S]*?(?:<\s*/\s*{escaped_name}\s*>|\/\s*>)\s*\}}',
        # 处理带括号的条件表达式 ((condition) && <Component />) - 增强版
        rf'\([^)]*?\)\s*&&\s*<\s*{escaped_name}\b[\s\S]*?(?:<\s*/\s*{escaped_name}\s*>|\/\s*>)',
        # 处理更简单的花括号包裹条件渲染 ({showFeedback && <Feedback />}) - 增强版
        rf'\{{\s*[\w\.]+\s*&&\s*<\s*{escaped_name}[^>]*?(?:/>|>[\s\S]*?<\s*/\s*{escaped_name}>)\s*\}}',
        # 处理更宽松的条件渲染模式，匹配任何花括号内的组件引用 - 增强版
        rf'\{{[^\}}]*?<\s*{escaped_name}\b[^>]*?(?:/>|>[\s\S]*?<\s*/\s*{escaped_name}>)[^\}}]*?\}}',
        
        # 3️⃣ **三元表达式中的组件引用**
        # 处理三元表达式中的组件（如 condition ? <Component /> : null）- 增强版
        rf'\?\s*<\s*{escaped_name}\b[\s\S]*?(?:<\s*/\s*{escaped_name}\s*>|\/\s*>)',
        # 处理三元表达式中的组件（如 condition ? null : <Component />）- 增强版
        rf':\s*<\s*{escaped_name}\b[\s\S]*?(?:<\s*/\s*{escaped_name}\s*>|\/\s*>)',
        # 处理花括号包裹的三元表达式 ({condition ? <Component /> : null}) - 增强版
        rf'\{{\s*[\w\.]+\s*\?\s*<\s*{escaped_name}\b[\s\S]*?(?:<\s*/\s*{escaped_name}\s*>|\/\s*>)\s*:',
        # 处理花括号包裹的三元表达式另一侧 ({condition ? null : <Component />}) - 增强版
        rf':\s*<\s*{escaped_name}\b[\s\S]*?(?:<\s*/\s*{escaped_name}\s*>|\/\s*>)\s*\}}',
        
        # 4️⃣ **组件作为参数传递**
        # 处理组件作为属性值传递（如 component={<AiMain />}）- 增强版
        rf'=\s*\{{\s*<\s*{escaped_name}\b[\s\S]*?(?:<\s*/\s*{escaped_name}\s*>|\/\s*>)\s*\}}',
        
        # 5️⃣ **数组中的组件**
        # 处理数组中的组件（如 [<AiMain />, <OtherComponent />]）- 增强版
        rf'\[\s*<\s*{escaped_name}\b[\s\S]*?(?:<\s*/\s*{escaped_name}\s*>|\/\s*>)',
        rf',\s*<\s*{escaped_name}\b[\s\S]*?(?:<\s*/\s*{escaped_name}\s*>|\/\s*>)',
        
        # 6️⃣ **变量引用组件**
        # 处理变量引用组件（如 const Component = AiMain）
        rf'\bconst\s+[A-Z][\w]*\s*=\s*{escaped_name}\b',
        
        # 7️⃣ **组件作为函数参数**
        # 处理组件作为函数参数（如 renderComponent(AiMain)）
        rf'\b[a-zA-Z][\w]*\(\s*{escaped_name}\b[^(]*?\)',

        # 4️⃣ **styled-components 样式组件**
        rf'const\s+[A-Z][\w]*?\s*=\s*styled\(\s*{component_name}\s*\)',

        # 5️⃣ **HOC 高阶组件包装**
        rf'(?:connect|withRouter|withStyles|withTheme|with[A-Z][\w]*)\(\s*{component_name}\s*\)',

        # 6️⃣ **React.memo 或 forwardRef 包装**
        rf'(?:React\.)?(memo|forwardRef)\(\s*{component_name}\s*\)',

        # 7️⃣ **React.lazy 动态导入**
        rf'(?:React\.)?lazy\(\s*\(\s*=>\s*import\([\'"]{component_name}[\'"]\)\s*\)\s*\)',

        # 8️⃣ **Suspense 包装的组件**
        rf'<\s*Suspense[^>]*?>[\s\S]*?<\s*{component_name}[^>]*?>[\s\S]*?</\s*Suspense\s*>',
    ]

    references = []
    pattern_matches = {}
    
    # 过滤内置组件
    builtin_components = {
        'div', 'span', 'a', 'button', 'input', 'img', 'ul', 'li', 'p', 'h1', 'h2', 'h3', 'form',
        'table', 'tr', 'td', 'th', 'thead', 'tbody', 'tfoot', 'label', 'select', 'option', 'textarea',
        'nav', 'header', 'footer', 'main', 'section', 'article', 'aside', 'details', 'dialog', 'summary',
        'figure', 'figcaption', 'picture', 'source', 'time', 'data', 'meter', 'progress', 'output',
        'iframe', 'object', 'param', 'video', 'audio', 'track', 'embed', 'canvas', 'svg', 'math'
    }
    
    # 记录每个模式的匹配结果
    for i, pattern in enumerate(patterns):
        matches = list(re.finditer(pattern, content, re.DOTALL))
        if matches:
            pattern_matches[i] = matches
            references.extend(matches)
            print(f"[DEBUG] 模式 {i+1} 匹配到 {len(matches)} 个结果")
            # 打印匹配到的内容片段（最多显示50个字符）
            for m in matches[:3]:  # 只显示前3个匹配结果
                match_text = content[m.start():m.start()+50].replace('\n', '\\n')
                start_line = content[:m.start()].count('\n') + 1
                print(f"  - 行 {start_line}: {match_text}...")
        else:
            pattern_matches[i] = []

    # 打印每个模式的匹配结果
    line_numbers = set()
    for m in references:
        start = m.start()
        line_number = content[:start].count('\n') + 1
        line_numbers.add(line_number)
    
    if not line_numbers:
        print(f"[DEBUG] 正则匹配无结果，启用逐行扫描")
        print(f"[DEBUG] contentcontentcontent {content}")
        for line_num, line in enumerate(content.split('\n'), 1):
            # 检查是否包含组件标签，同时排除内置组件
            if f"<{component_name}" in line \
                    and component_name not in builtin_components \
                    and not re.search(r'<\s*(Suspense|Fragment|Profiler|StrictMode|SuspenseList|React\.Fragment)\b', line) \
                    and not any(component_name.lower() == builtin.lower() for builtin in builtin_components):
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