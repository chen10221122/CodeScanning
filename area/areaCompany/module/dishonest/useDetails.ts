import { useState } from 'react';

import { useMemoizedFn } from 'ahooks';

import { DetailModalParams } from '@/pages/area/areaCompany/components/dishonestDetailModal/dishonestExecutedPeople';
import { useImmer } from '@/utils/hooks';

export default () => {
  const [visible, setVisible] = useState(false);
  const [itName, setItName] = useState('');
  /** 弹窗请求参数 */
  const [params, setDetailParams] = useImmer<DetailModalParams>({
    details: { announceId: '', companyId: '', companyType: '' },
  });

  const openDetailModal = useMemoizedFn((row: Record<string, any>) => {
    setVisible(true);
    const {
      announceId,
      enterpriseInfo: { itCode, itName },
    } = row;
    setDetailParams((old: any) => {
      old.details = { announceId, companyId: itCode, companyType: 'company' };
    });
    setItName(itName || '');
  });

  return {
    itName,
    params,
    visible,
    setVisible,
    openDetailModal,
  };
};
