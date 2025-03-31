import { useEffect, useState } from 'react';

import { useMemoizedFn } from 'ahooks';

// import { LINK_FINANCE_FINANCING_LEASE_CENSUSANALYSE } from '@/configs/routerMap';
import { useTab } from '@/libs/route';
// import { flagSideMenuData } from '@/pages/finance/financingLeaseNew/modules/censusAnalyse/config';
import { useHistory } from '@/utils/router';

import { useSelector } from '../context';

const useAllPageStatus = () => {
  const loading = useSelector((state) => state.loading);
  const error = useSelector((state) => state.error);
  const pageLoaded = useSelector((state) => state.pageLoaded);
  const { push } = useHistory();
  // const { key } = useParams<{ key?: string }>();
  const { refresh } = useTab();
  const [pageError, setPageError] = useState(false);

  const handleError = useMemoizedFn((mes?: string) => {
    if (mes === 'left') {
      refresh();
    } else {
      document.getElementById('sidebar-staff-service-btn')?.click();
    }
  });

  useEffect(() => {
    if (error && !pageLoaded) {
      setPageError(true);
    }
  }, [error, pageLoaded]);

  /** 整个页面加载时候隐藏超出 */
  useEffect(() => {
    const body = document.querySelector('.main-scroll-body') as HTMLElement;
    if (body) {
      if (loading) {
        body.style.overflow = 'hidden';
      } else {
        body.style.overflowY = 'overlay';
      }
    }
  }, [loading, error]);

  return { loading, error: pageError, push, handleError };
};

export default useAllPageStatus;
