import { getProgressModal } from '@/pages/area/areaF9/modules/regionalOverview/regionalEconomy/api';
import useRequest from '@/utils/ahooks/useRequest';

export const fixedParams = {
  from: 0,
  keyword: '',
  size: 10000,
  sort: '',
};

export default () => {
  const { loading, data, run } = useRequest(getProgressModal, {
    manual: true,
    formatResult: (res) => {
      return res?.data;
    },
  });

  return { loading, data, run };
};
