import { useContext, useEffect, useState } from 'react';

import { useRequest } from 'ahooks';

import { getParkList } from '@/apis/area/industrialPark';

import IndustrialParkContext from '../../context';

import type { TableData, ListResult } from '../main/type';

const useList = () => {
  const { isOpenMap, mapParams } = useContext(IndustrialParkContext);
  const { centerCoordinates } = mapParams;

  const [tableData, setTableData] = useState<TableData[]>([]);

  const { run, loading, error } = useRequest(getParkList, {
    manual: true,
    onSuccess(res: { data: ListResult }) {
      if (res?.data) {
        setTableData(res.data.data);
      } else {
        setTableData([]);
      }
    },
    onError() {
      setTableData([]);
    },
  });

  useEffect(() => {
    if (isOpenMap) {
      //5km内最近的20个园区
      run({ centerLocation: centerCoordinates, distance: '5', size: '20' });
    }
  }, [centerCoordinates, isOpenMap, run]);

  return { tableData, loading, error };
};

export default useList;
