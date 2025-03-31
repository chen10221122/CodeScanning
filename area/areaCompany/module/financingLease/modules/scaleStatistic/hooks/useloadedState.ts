import { useEffect, useRef } from 'react';

import { useDispatch } from '@/pages/finance/financingLeaseNew/modules/censusAnalyse/context';

const useLoadedState = (loading: boolean, error: boolean) => {
  const timerRef = useRef<any>();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!loading) {
      dispatch((d) => {
        d.loading = loading;
      });

      timerRef.current = setTimeout(() => {
        dispatch((d) => {
          d.pageLoaded = true;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [loading, dispatch]);

  useEffect(() => {
    dispatch((d) => {
      d.error = error;
    });
  }, [error, dispatch]);
};

export default useLoadedState;
