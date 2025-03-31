import { useEffect } from 'react';

import CommonLayout from '@pages/area/areaFinancing/components/commonLayout';
import NextNode from '@pages/area/areaFinancing/components/nextNode';
import { useCtx } from '@pages/area/areaFinancing/context';
import useTimeoutFlag from '@pages/area/areaFinancing/hooks/useTimeoutFlag';

import CensusAnalyse from '@/pages/finance/financingLeaseNew/modules/censusAnalyse/OldCensusAnalysePro';

function TotalInvest() {
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
  const flag = useTimeoutFlag();
  return (
    <CommonLayout>
      <CensusAnalyse activeKey={'regionTotalAmount'} hideMenu={true} children={flag && <NextNode />} />
    </CommonLayout>
  );
}
export default TotalInvest;
