import { useEffect } from 'react';

import NextNode from '@pages/area/areaFinancing/components/nextNode';
import { useCtx } from '@pages/area/areaFinancing/context';
import useTimeoutFlag from '@pages/area/areaFinancing/hooks/useTimeoutFlag';

import CensusAnalyse from '@/pages/finance/financingLeaseNew/modules/censusAnalyse/OldCensusAnalysePro';

import CommonLayout from '../../../components/commonLayout';

function Flow() {
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
      <CensusAnalyse activeKey={'regionTrend'} hideMenu={true} children={flag && <NextNode />} />
    </CommonLayout>
  );
}
export default Flow;
