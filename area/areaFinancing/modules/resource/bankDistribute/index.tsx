import { useEffect } from 'react';

import { useCtx } from '@pages/area/areaFinancing/context';

import { useTitle } from '@/app/libs/route';
import BankDistributeComponent from '@/pages/area/areaFinanceResource/modules/bankDistribute';

export default function BankDistribute({ containerId, tabName }: { containerId?: string; tabName?: string }) {
  useTitle(tabName || '区域融资对比');
  const {
    state: { fullLoading },
    update,
  } = useCtx();
  useEffect(() => {
    if (fullLoading)
      update((d) => {
        d.fullLoading = false;
      });
  }, [fullLoading, update]);
  return <BankDistributeComponent containerId={containerId} />;
}
