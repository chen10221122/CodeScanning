export const calculateMultilineTextHeight = (text: string, width: number, lineHeight = 21, font = '13px Arial') => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (context) {
    context.font = font;

    const words = text.split('');
    // console.log('words', words);
    let lines = [];
    let currentLine = '';

    // 将文本分割成多行
    words.forEach((word) => {
      const testLine = currentLine + word;
      const metrics = context.measureText(testLine);
      const lineWidth = metrics.width;

      if (lineWidth > width) {
        lines.push(currentLine);
        currentLine = word; // 开始新的一行
      } else {
        currentLine = testLine; // 继续当前行
      }
    });

    // 添加最后一行
    if (currentLine) {
      lines.push(currentLine);
    }
    // console.log('lines', lines);
    // 计算总高度
    const totalHeight = lines.length * lineHeight;
    return { height: totalHeight, lines: lines.length, allLines: lines }; // 返回总高度
  }
  return { height: 0, lines: 0 };
};

export const calculateRealTextHeight = (text: string, width: number, lineHeight = 21, fontsize = 13) => {
  // 创建一个 div 元素
  const newDiv = document.createElement('div');
  // 设置样式
  newDiv.style.position = 'fixed';
  newDiv.style.right = '-10000px';
  newDiv.style.fontSize = fontsize + 'px';
  newDiv.style.lineHeight = lineHeight + 'px';
  newDiv.style.width = width + 'px';
  // 添加文字内容
  newDiv.textContent = text;
  // 将创建的元素添加到文档中
  document.body.appendChild(newDiv);
  // 获取该 DOM 的高度
  const height = newDiv.clientHeight;
  const lines = Math.ceil(height / 21);

  // 销毁 DOM
  // newDiv.remove();
  return { height, lines };
};
