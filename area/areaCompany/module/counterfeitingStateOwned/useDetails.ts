import { useState } from 'react';

import { useMemoizedFn } from 'ahooks';

import { useImmer } from '@/utils/hooks';

export default () => {
  const [visible, setVisible] = useState(false);
  const [params, setDetailParams] = useImmer<any>({});

  const openDetailModal = useMemoizedFn((row: Record<string, any>) => {
    setVisible(true);
    const {
      blackListName,
      endDate,
      inclusionDate: startDate,
      tagCode,
      enterpriseInfo: { itCode },
    } = row;
    setDetailParams(() => ({
      endDate,
      startDate,
      tagCode,
      itCode,
      tagName: blackListName,
    }));
  });

  return {
    params,
    visible,
    setVisible,
    openDetailModal,
  };
};
