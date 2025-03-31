import { useEffect } from 'react';

interface Props {
  loading: boolean;
  container?: string;
  height?: number;
  paddingRightBefore?: string; //加载时的padding值
  paddingRightAfter?: string; //加载后的padding值
}

const useScroll = ({
  loading,
  container = '.side-page-content',
  height = 0,
  paddingRightBefore = '12px',
  paddingRightAfter = '0',
}: Props) => {
  useEffect(() => {
    const scrollEl = document.querySelector(container) as HTMLDivElement;
    if (scrollEl && loading) {
      scrollEl.scroll({ top: height });
      scrollEl.style.overflow = 'hidden';
      scrollEl.style.paddingRight = paddingRightBefore;
    } else if (scrollEl && !loading) {
      scrollEl.style.overflow = 'auto';
      scrollEl.style.paddingRight = paddingRightAfter;
    }
  }, [container, height, loading, paddingRightAfter, paddingRightBefore]);
};

export default useScroll;
