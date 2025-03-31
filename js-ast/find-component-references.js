const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');

function findComponentReferences(content, componentName) {
    try {
        const ast = parser.parse(content, {
            sourceType: 'module',
            plugins: ['jsx'], // 启用 JSX 支持
            tokens: true,
            errorRecovery: true, // 容错模式
        });

        const references = new Set();

        // 遍历 AST 查找所有 JSX 元素和组件引用
        traverse(ast, {
            // 匹配 JSX 标签 <AiMain> 或 <AiMain />
            JSXOpeningElement(path) {
                if (
                    t.isJSXIdentifier(path.node.name, { name: componentName })
                ) {
                    const line = path.node.loc?.start.line;
                    if (line) references.add(line);
                }
            },

            // 匹配 HOC 如 withRouter(AiMain)
            CallExpression(path) {
                const callee = path.node.callee;
                const args = path.node.arguments;

                // 直接调用组件名，如 AiMain(...)
                if (t.isIdentifier(callee, { name: componentName })) {
                    references.add(callee.loc.start.line);
                }

                // 查找作为参数的组件名，如 withRouter(AiMain)
                args.forEach(arg => {
                    if (t.isIdentifier(arg, { name: componentName })) {
                        references.add(arg.loc.start.line);
                    }
                });
            },

            // 匹配 styled-components 如 styled(AiMain)
            TaggedTemplateExpression(path) {
                if (
                    t.isCallExpression(path.node.tag) &&
                    t.isIdentifier(path.node.tag.callee, { name: 'styled' }) &&
                    t.isIdentifier(path.node.tag.arguments[0], { name: componentName })
                ) {
                    references.add(path.node.tag.arguments[0].loc.start.line);
                }
            }
        });

        return Array.from(references).sort((a, b) => a - b);
    } catch (error) {
        console.error('AST Parsing Error:', error.message);
        return [];
    }
}

// 从命令行接收参数
const [content, componentName] = JSON.parse(process.argv[2]);
const lines = findComponentReferences(content, componentName);
console.log(JSON.stringify(lines));