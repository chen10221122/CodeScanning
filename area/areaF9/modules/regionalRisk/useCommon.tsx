import { useMemo } from 'react';

import { Icon } from '@/components';
export const useRiskCommon = (column: any) => {
  const totalWidth = () => {
    if (column) {
      return column.reduce((prev: any, current: any, idx: any) => {
        if (idx && !current?.fixed) {
          prev += current.width || 0;
        }
        return prev;
      }, 0);
    }
    return 780;
  };
  const loadingTips = useMemo(() => {
    return (
      <span className="loading-tips">
        <Icon
          style={{ width: 24, height: 24, marginTop: '20px', zIndex: 1 }}
          image={require('@/assets/images/common/loading.gif')}
        />
        <span className="loading-text">加载中</span>
      </span>
    );
  }, []);
  return {
    totalWidth,
    loadingTips,
  };
};
