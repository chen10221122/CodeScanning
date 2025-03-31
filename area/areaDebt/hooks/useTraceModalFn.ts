import { useEffect, useState } from 'react';

import { useMemoizedFn } from 'ahooks';

import { formateData, InfoType } from '@/pages/area/areaDebt/config';
import { useCtx } from '@/pages/area/areaDebt/getContext';
import UseListTipInfo from '@/pages/area/areaDebt/hooks/useListTipInfo';
import { useImmer } from '@/utils/hooks';

import { unitObj } from '../components/filter/indicator';

const initInfo: InfoType = { params: { regionCode: '', indicName: '' }, visible: false };

export default function useTraceModalFn() {
  const {
    update,
    state: { condition, infoDetail },
  } = useCtx();

  const [listInfo, setListInfo] = useImmer<InfoType>(initInfo);
  /** 点击溯源的指标名 */
  const [clickedIndictor, setClickedIndictor] = useState('');
  const [clickTrance, setClickTrance] = useState(false);
  const [data, setData] = useState([]);
  /** 计算指标详情弹窗 */
  const { loading: listInfoLoading, data: traceData } = UseListTipInfo({ condition, listInfo });

  /** 打开溯源弹窗 */
  const handleOpenModal = useMemoizedFn((record: any, o: string, year = '', updateData = []) => {
    setData(updateData);
    setClickTrance(true);
    setListInfo((d) => {
      d.params = {
        regionCode: infoDetail?.regionCode4 || record?.regionCode4,
        indicName: `${o}${unitObj[o]}`,
        endDate: year ? year : condition?.endDate[0],
      };
      d.visible = true;
    });
    update((d) => {
      d.traceModalInfo.visible = true;
      d.traceModalInfo.title = `${o}${unitObj[o]}`;
      d.traceModalInfo.regionName = infoDetail?.regionName || record?.regionName;
      d.traceModalInfo.regionCode = infoDetail?.regionCode4 || record?.regionCode4;
      if (year) {
        d.traceModalInfo.year = year;
      }
    });
    setClickedIndictor(o);
  });

  /** 格式化溯源弹窗数据 */
  useEffect(() => {
    update((d) => {
      d.traceModalInfo.loading = listInfoLoading;
    });
    if (traceData?.length > 0) {
      const list = formateData(traceData, clickedIndictor, data);
      update((d) => {
        d.traceModalInfo.traceData = traceData;
      });
      if (list) {
        update((d) => {
          d.traceModalInfo.data = list;
        });
      }
    }
  }, [traceData, clickedIndictor, update, listInfoLoading, data]);

  /** 关闭溯源弹窗 */
  const hanldeModalClose = useMemoizedFn(() => {
    setClickTrance(false);
    update((o) => {
      o.traceModalInfo = {};
      o.traceModalInfo.data = { tips: '', detail: '', data: [] };
    });
    setListInfo((d) => {
      d.params = initInfo.params;
      d.visible = initInfo.visible;
    });
  });
  return { handleOpenModal, hanldeModalClose, listInfoLoading, clickTrance };
}
