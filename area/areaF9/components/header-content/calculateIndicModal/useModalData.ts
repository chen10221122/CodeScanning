import { useState } from 'react';

import { useMemoizedFn, useRequest } from 'ahooks';

import { getAreaTopList } from '@/apis/area/areaEconomy';
import { useSelector, useDispatch } from '@/pages/area/areaF9/context';
import { formatNumber } from '@/utils/format';

export const useModalData = () => {
  const [tableData, setTableData] = useState<any>([]);
  const dispatch = useDispatch();
  const modalInfo = useSelector((store) => store.tranceModalInfo);

  const totalValue = modalInfo.info.totalValue;

  const { run, loading, error } = useRequest(getAreaTopList, {
    manual: true,
    onSuccess: ({ data }) => {
      const list = [{ indicName: '城区常住人口(万人)', mValue: totalValue, guid: '' }];
      if (data?.length > 0) {
        const otherValue = formatNumber(Number(totalValue) - Number(data[0].mValue));
        list.push({ indicName: '城区人口(万人)', mValue: data[0].mValue || '', guid: data[0].guid });
        list.push({ indicName: '加：城区暂住人口(万人)', mValue: otherValue, guid: data[0].guid });
      }
      setTableData(list);
    },
    onError: () => {
      setTableData([{ indicName: '城区常住人口(万人)', mValue: totalValue, guid: '' }]);
    },
  });

  const closeModal = useMemoizedFn(() => {
    dispatch((d) => {
      d.tranceModalInfo.visible = false;
    });
  });

  return { modalInfo, closeModal, run, tableData, loading, error };
};
