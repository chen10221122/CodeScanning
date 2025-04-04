const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');

// 辅助函数：提取成员表达式全名
function getMemberExpressionName(node) {
    let object = node.object;
    let property = node.property;
    const parts = [];

    while (t.isJSXMemberExpression(object)) {
        parts.unshift(property.name);
        property = object.property;
        object = object.object;
    }

    parts.unshift(property.name);
    parts.unshift(object.name);

    return parts.join('.');
}

// 辅助函数：深度遍历 JSX 容器
function traverseJSXContainer(path, componentName, references) {
    path.traverse({
        JSXOpeningElement(childPath) {
            const nameNode = childPath.node.name;
            checkJSXName(nameNode, componentName, references);
        }
    });
}

// 辅助函数：检测 JSX 元素名称
function checkJSXName(nameNode, componentName, references) {
    if (t.isJSXIdentifier(nameNode, {
            name: componentName
        })) {
        addLineNumber(nameNode.loc, references);
        return;
    }

    if (t.isJSXMemberExpression(nameNode)) {
        const fullName = getMemberExpressionName(nameNode);
        if (fullName === componentName) {
            addLineNumber(nameNode.loc, references);
        }
    }
}

// 辅助函数：记录行号
function addLineNumber(loc, references) {
    if (loc) references.add(loc.start.line);
}

function findComponentReferences(content, componentName) {
    try {
        const ast = parser.parse(content, {
            sourceType: 'module',
            plugins: ['jsx', 'typescript'],
            tokens: true,
            errorRecovery: true
        });

        const references = new Set();

        traverse(ast, {
            // 匹配常规 JSX 元素
            JSXOpeningElement(path) {
                checkJSXName(path.node.name, componentName, references);
            },

            // 匹配三元表达式中的 JSX（如 condition ? <Comp /> : <AiMain />）
            ConditionalExpression(path) {
                const consequent = path.get('consequent');
                const alternate = path.get('alternate');

                function traverseExpression(expression, references) {
                    if (!expression || !expression.node) return;

                    // 直接是 JSX
                    if (t.isJSXElement(expression.node) || t.isJSXFragment(expression.node)) {
                        traverseJSXContainer(expression, componentName, references);
                    }
                    // 逻辑运算符（&&, ||） 可能 JSX 在 left 或 right
                    else if (t.isLogicalExpression(expression.node)) {
                        traverseExpression(expression.get('left'), references);
                        traverseExpression(expression.get('right'), references);
                    }
                    // 条件表达式（condition ? <AiMain /> : <OtherComponent />）
                    else if (t.isConditionalExpression(expression.node)) {
                        traverseExpression(expression.get('consequent'), references);
                        traverseExpression(expression.get('alternate'), references);
                    }
                    // 函数调用（如 getComponent()）
                    else if (t.isCallExpression(expression.node)) {
                        expression.get('arguments').forEach(arg => traverseExpression(arg, references));
                    }
                    // 变量（如 const MyComponent = AiMain; <MyComponent />）
                    else if (t.isIdentifier(expression.node)) {
                        const binding = expression.scope.getBinding(expression.node.name);
                        if (binding && binding.path) {
                            traverseExpression(binding.path.get('init'), references);
                        }
                    }
                }

                // 遍历条件表达式的两个分支
                traverseExpression(consequent, references);
                traverseExpression(alternate, references);
            },



            // 匹配逻辑表达式中的 JSX（如 {show && <AiMain />}）
            LogicalExpression(path) {
                traverseJSXContainer(path.get('right'), componentName, references);
            },

            // 匹配JSX表达式容器中的组件引用（如 {condition && <AiMain />}）
            JSXExpressionContainer(path) {
                const expression = path.get('expression');
                if (t.isJSXElement(expression.node) || t.isJSXFragment(expression.node)) {
                    traverseJSXContainer(expression, componentName, references);
                } else if (t.isLogicalExpression(expression.node) || t.isConditionalExpression(expression.node)) {
                    traverseExpression(expression, references);
                }
            },

            // 匹配数组 map 中的 JSX（如 list.map(() => <AiMain />)）
            ArrowFunctionExpression(path) {
                traverseJSXContainer(path.get('body'), componentName, references);
            },

            // 匹配 HOC 和函数调用
            CallExpression(path) {
                const callee = path.node.callee;
                const args = path.node.arguments;

                if (t.isIdentifier(callee, {
                        name: componentName
                    })) {
                    addLineNumber(callee.loc, references);
                }

                args.forEach(arg => {
                    if (t.isIdentifier(arg, {
                            name: componentName
                        })) {
                        addLineNumber(arg.loc, references);
                    }
                });
            },

            // 匹配 styled-components
            TaggedTemplateExpression(path) {
                if (
                    t.isCallExpression(path.node.tag) &&
                    t.isIdentifier(path.node.tag.callee, {
                        name: 'styled'
                    }) &&
                    t.isIdentifier(path.node.tag.arguments[0], {
                        name: componentName
                    })
                ) {
                    addLineNumber(path.node.tag.arguments[0].loc, references);
                }
            }
        });

        return Array.from(references).sort((a, b) => a - b);
    } catch (error) {
        console.error('AST Parsing Error:', error.message);
        return [];
    }
}

// 命令行参数处理
const [content, componentName] = JSON.parse(process.argv[2]);
const lines = findComponentReferences(content, componentName);
console.log(JSON.stringify(lines));