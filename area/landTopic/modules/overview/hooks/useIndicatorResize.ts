import { useEffect, useRef } from 'react';

import { useMemoizedFn, useSize } from 'ahooks';

import { SelectItem } from '@pages/area/landTopic/components/IndexTable';

import { triggerWindowResize } from '@/utils/share';

interface Props {
  container: HTMLDivElement | null;
  loading: boolean;
  onIndicatorChange: (selects: SelectItem[], selectsTree: SelectItem[]) => void;
}

const useIndicatorResize = ({ container, loading, onIndicatorChange }: Props) => {
  const hasScrollRef = useRef(true);
  const resizeDom = useMemoizedFn((time, width) => {
    setTimeout(() => {
      if (container) {
        container.style.width = width;
      }
    }, time);
  });
  const onIndicatorResize = useMemoizedFn((selects, tree) => {
    onIndicatorChange(selects, tree);
    /* 解决表格列发生变化时可能发生的错位问题 */
    resizeDom(150, 'calc(100% - 0.5px)');
    resizeDom(600, '100%');
  });
  const { height } = useSize(container) || { height: 0 };

  /* loading 结束后判断滚动条状态，不一样就 resize 一下，解决双滚动条 */
  useEffect(() => {
    if (!loading) {
      const scrollHeight = container?.scrollHeight || 0;
      const clientHeight = container?.clientHeight || 0;
      const newValue = scrollHeight > clientHeight + 12;
      if (newValue !== hasScrollRef.current) {
        hasScrollRef.current = newValue;
        container?.scrollTo({ top: (container?.scrollTop || 0) + 2 });
        triggerWindowResize();
      }
    }
  }, [container, container?.clientHeight, container?.scrollHeight, loading]);

  return { onIndicatorResize, height };
};

export default useIndicatorResize;
