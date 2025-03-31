import { useMemoizedFn } from 'ahooks';

import { InfoType } from '@/pages/area/areaDebt/config';
import { useCtx } from '@/pages/area/areaDebt/getContext';
import UseUpdateTipInfo from '@/pages/area/areaDebt/hooks/useUpdateTipInfo';
import { useImmer } from '@/utils/hooks';

import { sourceValueObj, unitObj } from '../components/filter/indicator';

const initInfo: InfoType = { params: { regionCode: '', indicName: '' }, visible: false };

export default function useUpdateModalFn() {
  const {
    update,
    state: { condition },
  } = useCtx();

  /** 更新记录弹窗参数 */
  const [updateInfo, setUpdateInfo] = useImmer<InfoType>(initInfo);

  /** 请求数据更新指标详情弹窗 */
  const { loading: updateInfoLoading, data: updateDataInfo } = UseUpdateTipInfo({ condition, updateInfo });

  /** 打开数据更新弹窗 */
  const handleUpdateModalOpen = useMemoizedFn((record, realIndicName, o) => {
    setUpdateInfo((d) => {
      d.params = {
        regionCode: record?.regionCode4 || record?.regionCode,
        indicName: realIndicName || sourceValueObj[o] || o,
      };
      d.visible = true;
    });
    update((d) => {
      d.updateModalInfo.title = unitObj[o] ? `${o}${unitObj[o]}` : o;
      d.updateModalInfo.regionName = record?.regionName;
    });
  });
  /** 关闭数据更新弹窗 */
  const hanldeUpdateModalClose = useMemoizedFn(() => {
    update((o) => {
      o.updateModalInfo = {};
    });
    setUpdateInfo((d) => {
      d.params = initInfo.params;
      d.visible = initInfo.visible;
    });
  });
  return { handleUpdateModalOpen, hanldeUpdateModalClose, updateInfoLoading, updateDataInfo };
}
