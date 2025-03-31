import { useState } from 'react';
import { useSelector } from 'react-redux';

import { useMemoizedFn } from 'ahooks';

import { IRootState } from '@/store';

const usePageChange = () => {
  // 翻页器权限相关
  const havePay = useSelector((store: IRootState) => store.user.info).havePay;
  // 翻页相关
  const [limitModalVisible, setLimitModalVisible] = useState(false);
  const [tipVisible, setTipVisible] = useState(false);

  // return true表示有权限限制
  const handleSkipChange = useMemoizedFn((page: number) => {
    // normal user 5 pages
    if (!havePay && page > 5) {
      setLimitModalVisible(true);
      return true;
    }
    // vip user 200 pages
    if (page > 200) {
      setTipVisible(true);
      return true;
    }
  });

  return {
    handleSkipChange,
    limitModalVisible,
    tipVisible,
    setLimitModalVisible,
    setTipVisible,
  };
};

export default usePageChange;
