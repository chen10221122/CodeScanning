import { useState, useEffect, useMemo } from 'react';

import { RowItem } from '@dzh/screen';
import { useRequest, useMemoizedFn } from 'ahooks';
import { isEmpty, omit } from 'lodash';

import { getParkList } from '@/apis/area/industrialPark';
import { useSelector } from '@/pages/area/areaF9/context';

import useBaseList from '../../hooks/useBaseList';
import useScroll from '../../hooks/useScroll';
import { handleChose } from '../../utils';
import { FliterType } from './functionRegion/filter';

import type { ScreenParams, TableData, ListResult } from './type';

export const pageSize = 50;

export const originCondition: ScreenParams = {
  skip: 0,
  page: 1,
  size: pageSize,
  industryCode: '',
  areaRange: '',
  keywords: '',
  sortKey: '',
  sortRule: '',
};

const selectList = Object.keys(omit(originCondition, ['skip', 'page', 'size', 'sortKey', 'sortRule']));

const useList = () => {
  const { areaInfo } = useSelector((store) => ({ areaInfo: store.areaInfo }));
  const [firstLoading, setFirstLoading] = useState(true);
  const [empty, setEmpty] = useState(false);
  const [count, setCount] = useState(0);
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [condition, setCondition] = useState(originCondition);

  const regionCode = useMemo(() => areaInfo?.regionCode.toString(), [areaInfo?.regionCode]);

  const {
    handleSearch,
    handleTableChange,
    handlePageChange,
    handleReset,
    setOnlyBodyLoading,
    renderScreen,
    onlyBodyLoading,
  } = useBaseList({
    setCondition,
    originCondition,
    extraParams: { areaCode: regionCode },
  });

  const { run, loading, error } = useRequest(getParkList, {
    manual: true,
    onSuccess(res: { data: ListResult }) {
      if (res?.data) {
        setTableData(res.data.data);
        setCount(res.data.total);
      } else {
        setTableData([]);
        setCount(0);
      }
    },
    onError() {
      setTableData([]);
      setCount(0);
    },
    onFinally(params, res) {
      if (isEmpty(res?.data) && firstLoading) {
        setEmpty(true);
      }
      setTimeout(() => {
        setFirstLoading(false);
      });
      setOnlyBodyLoading(false);
    },
  });

  useScroll({ loading });

  useEffect(() => {
    if (regionCode) {
      setCondition((prev) => ({ ...prev, areaCode: regionCode }));
    }
  }, [regionCode]);

  useEffect(() => {
    if (condition.areaCode) {
      run(condition);
    }
  }, [condition, run]);

  const selectStatus = useMemo(() => {
    let status = false;
    selectList.forEach((o) => {
      //@ts-ignore
      if (condition[o]) {
        status = true;
      }
    });

    if (condition?.areaCode !== regionCode) {
      status = true;
    }

    return status;
  }, [regionCode, condition]);

  const handleMenuChange = useMemoizedFn((_, allSelectedRows: RowItem[]) => {
    let keyValueObj: any = {};

    allSelectedRows?.forEach((o) => {
      const { key, value } = o;
      if (key === FliterType.AREA) {
        if (o.name === '范围输入' && !isEmpty(value)) {
          let start = value[0] || '*';
          let end = value[1] || '*';
          handleChose(keyValueObj, key, `[${start},${end})`);
        } else if (!isEmpty(value)) {
          handleChose(keyValueObj, key, value);
        }
      } else {
        handleChose(keyValueObj, key, value);
      }
    });

    setCondition((originState) => {
      return {
        ...originState,
        ...originCondition,
        areaCode: regionCode,
        ...keyValueObj,
        keywords: originState.keywords,
      };
    });
  });

  return {
    empty,
    onlyBodyLoading,
    error,
    firstLoading,
    loading,
    condition,
    count,
    tableData,
    selectStatus,
    renderScreen,
    handleMenuChange,
    handleSearch,
    handleReset,
    handleTableChange,
    handlePageChange,
  };
};

export default useList;
