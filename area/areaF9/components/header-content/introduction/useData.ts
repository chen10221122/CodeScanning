import { getAreaIntroduction } from '@/apis/area/areaEconomy';
import useRequest from '@/utils/ahooks/useRequest';

export default () => {
  const { data, run, loading } = useRequest(getAreaIntroduction, {
    manual: true,
  });

  return {
    data,
    run,
    loading,
  };
};
