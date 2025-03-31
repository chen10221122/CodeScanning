import { useEffect } from 'react';

import { useCtx } from '@pages/area/areaFinancing/context';

import { useTitle } from '@/app/libs/route';
import LoanScaleComponent from '@/pages/area/areaFinanceResource/modules/loanScale';

export default function LoanScale({ containerId, tabName }: { containerId?: string; tabName?: string }) {
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
  return <LoanScaleComponent containerId={containerId} />;
}
