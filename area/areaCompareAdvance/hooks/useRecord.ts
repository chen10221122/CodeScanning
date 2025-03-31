import { getCompareHistory } from '@/apis/area/areaCompare';
import useRequest from '@/utils/ahooks/useRequest';

const useRecord = () => {
  const { data: compareHistoryData } = useRequest(getCompareHistory, { formatResult: (res) => res?.data });

  return { compareHistoryData };
};

export default useRecord;
