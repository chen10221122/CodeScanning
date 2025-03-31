import { RefObject, useMemo } from 'react';

import { useSize } from 'ahooks';

interface Iprops {
  scrollWrapRef: RefObject<HTMLDivElement>;
  contentRef: RefObject<HTMLDivElement>;
}

/** 判断页面有没有滚动条 */
export const useNoScrollBar = ({ scrollWrapRef, contentRef }: Iprops) => {
  const scrollWrapSize = useSize(scrollWrapRef);
  const contentSize = useSize(contentRef);

  return useMemo(() => {
    if (contentSize?.height && scrollWrapSize?.height) {
      return contentSize.height + 48 > scrollWrapSize.height;
    }
    return false;
  }, [scrollWrapSize, contentSize]);
};
