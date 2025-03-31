import { useEffect, useState } from 'react';

const config = [
  {
    width: [0, 1280], // 区域宽度
    padding: 0, // 两边padding边距
  },
  {
    width: [1281, 1600], // 区域宽度
    padding: 24, // 两边padding边距
  },
  {
    width: [1601, 1920], // 区域宽度
    padding: 47, // 两边padding边距
  },
  {
    width: [1921, Infinity], // 区域宽度
    padding: 47, // 两边padding边距
  },
];

/**
 * 返回随窗体宽度变化的边距，可用于调用组件的内外边距
 */
export default function useStandardPadding(selector: string) {
  const [padding, setPadding] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      const container = document.querySelector(selector || '#app') as HTMLDivElement;
      const containerWidth = container?.offsetWidth || 1280;
      const curConfig =
        config.find((item) => item.width[0] <= containerWidth && item.width[1] >= containerWidth) || config[0];
      setPadding(curConfig.padding);
    };
    handleResize();
    // TODO: 防抖
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [selector]);

  return padding;
}
