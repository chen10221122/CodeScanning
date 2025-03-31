import { getUpdateDataInModal } from '@/apis/area/areaDebt';
import { getUpdateData } from '@/pages/area/monthlyEconomy/api';
import useRequest from '@/utils/ahooks/useRequest';

export default () => {
  /** 获取 多个地区单个年份 的更新提示数据 */
  const { loading, data, run } = useRequest(getUpdateData, {
    manual: true,
    formatResult: (res) => {
      return res?.data;
    },
  });

  /** 获取 单个地区多个年份 的更新提示数据 */
  const {
    loading: inModalUpdateTipLoading,
    data: inModalUpdateTipInfo,
    run: getInModalUpdateTipInfo,
  } = useRequest(getUpdateDataInModal, {
    manual: true,
    formatResult: (res) => {
      return res?.data;
    },
  });
  return {
    tipLoading: loading,
    tipData: data,
    getTipData: run,
    inModalUpdateTipLoading,
    inModalUpdateTipInfo,
    getInModalUpdateTipInfo,
  };
};
