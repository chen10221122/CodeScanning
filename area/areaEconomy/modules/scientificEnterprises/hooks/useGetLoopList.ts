import { useInterval } from 'ahooks';

import useRequest from '@/utils/ahooks/useRequest';

import { getLoopList } from '../api';

/** 30 min  */
const INTERVAL = 1_800_000;

export const useLoopData = () => {
  const { run, loading, data } = useRequest(getLoopList, {
    manual: true,
    formatResult(res: { data: { list: any } }) {
      return res.data?.list ?? [];
    },
  });
  /** 定时器 */
  useInterval(run, INTERVAL, { immediate: true });

  return {
    loading,
    data,
  };
};
