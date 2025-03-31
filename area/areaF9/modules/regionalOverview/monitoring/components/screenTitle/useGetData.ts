import { useRequest, useMount } from 'ahooks';

import { useDispatch, useSelector } from '@/pages/area/areaF9/modules/regionalOverview/monitoring/context'
import { getIndustry } from '@/pages/publicOpinionPages/monitoring/apis';

export const useGetIndustryData = () => {
  const dispatch = useDispatch();
  const industryCacheData = useSelector((s) => s.cacheData.industryCache);

  const { run } = useRequest(getIndustry, {
    manual: true,
    onSuccess: ({ data }) => {
      dispatch((d) => {
        d.cacheData.industryCache = data;
      });
    },
  });

  useMount(() => {
    if (!industryCacheData) run();
  });

  return industryCacheData;
};
