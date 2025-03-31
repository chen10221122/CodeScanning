import { getListTipInfo, getUpdateDataInfo } from '@/apis/area/areaDebt';
import { getProgressModal } from '@/pages/area/areaF9/modules/regionalOverview/regionalEconomy/api';
import useRequest from '@/utils/ahooks/useRequest';

export const fixedParams = {
  from: 0,
  keyword: '',
  size: 10000,
  sort: '',
};

/** isCalculateIndic:是否是计算指标 */
export default ({ isCalculateIndic, tabIndex }: { isCalculateIndic?: boolean; tabIndex?: number }) => {
  const { loading, data, run } = useRequest(
    isCalculateIndic ? getListTipInfo : tabIndex === 2 ? getProgressModal : getUpdateDataInfo,
    {
      manual: true,
      formatResult: (res) => {
        return res?.data;
      },
    },
  );

  return { loading, data, run };
};
