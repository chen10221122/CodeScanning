import { useState, useEffect } from 'react';

import { RowItem } from '@dzh/screen';
import { useRequest, useMemoizedFn } from 'ahooks';
import { isEmpty } from 'lodash';

import { getParkList } from '@/apis/area/parkEnterprise';
import { useSelector } from '@/pages/area/areaF9/context';
import useBaseList from '@/pages/area/areaF9/modules/regionalOverview/industrialPark/hooks/useBaseList';
import useScroll from '@/pages/area/areaF9/modules/regionalOverview/industrialPark/hooks/useScroll';
import { pageSize } from '@/pages/area/areaF9/modules/regionalOverview/industrialPark/modules/main/useList';
import type {
  TableData,
  ListResult,
} from '@/pages/area/areaF9/modules/regionalOverview/industrialPark/modules/modal/type';
import { handleChose } from '@/pages/area/areaF9/modules/regionalOverview/industrialPark/utils';

import { FliterType } from '../functionRegion/filter';

import type { screenParams } from '../type';

export const originCondition: screenParams = {
  from: 0,
  page: 1,
  size: pageSize,
  parkFlag: 'true',
  parkIndustryCode: '',
  areaRange: '',
  enterpriseNature: '',
  industryCode1: '',
  industryCode2: '',
  industryCode3: '',
  industryCode4: '',
  regCapital: '',
  regStatus: '',
  havePhone: '',
  parkKeywords: '',
  sortKey: '',
  sortRule: '',
};

const useList = () => {
  const { areaInfo } = useSelector((store) => ({ areaInfo: store.areaInfo }));
  const [firstLoading, setFirstLoading] = useState(true);
  const [empty, setEmpty] = useState(false);
  const [count, setCount] = useState(0);
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [condition, setCondition] = useState(originCondition);

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
    skip: 'from',
    keywords: 'parkKeywords',
  });

  const { run, loading, error } = useRequest(getParkList, {
    manual: true,
    onSuccess(res: { data: ListResult }) {
      if (res?.data) {
        setTableData(res.data.infoBeans);
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
      if (isEmpty(res?.data?.infoBeans) && firstLoading) {
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
    if (areaInfo?.regionCode) {
      setCondition((prev) => ({ ...prev, areaCode: areaInfo.regionCode.toString() }));
    }
  }, [areaInfo?.regionCode]);

  useEffect(() => {
    if (condition.areaCode) {
      run(condition);
    }
  }, [condition, run]);

  const handleMenuChange = useMemoizedFn((_, allSelectedRows: RowItem[]) => {
    let keyValueObj: any = {};

    allSelectedRows?.forEach((o) => {
      const { key, value } = o;
      if (key === FliterType.INDUSTRY) {
        switch (value.length) {
          case 5:
            handleChose(keyValueObj, 'industryCode4', value);
            break;
          case 4:
            handleChose(keyValueObj, 'industryCode3', value);
            break;
          case 3:
            handleChose(keyValueObj, 'industryCode2', value);
            break;
          case 1:
            handleChose(keyValueObj, 'industryCode1', value);
            break;
          default:
            break;
        }
      } else if (key === FliterType.AREA) {
        if (o.name === '范围输入' && !isEmpty(value)) {
          let start = value[0] || '*';
          let end = value[1] || '*';
          handleChose(keyValueObj, key, `[${start},${end})`);
        } else if (!isEmpty(value)) {
          handleChose(keyValueObj, key, value);
        }
      } else if (key === FliterType.CAPITAL) {
        if (o.name === '范围输入' && !isEmpty(value)) {
          let start = value[0] || '*';
          let end = value[1] || '*';
          handleChose(
            keyValueObj,
            key,
            `[${start !== '*' ? start + '0000' : start},${end !== '*' ? end + '0000' : end})`,
          );
        } else if (!isEmpty(value)) {
          handleChose(keyValueObj, key, value);
        }
      } else {
        handleChose(keyValueObj, key, value);
      }
    });

    setCondition((originState) => {
      return { ...originState, ...originCondition, ...keyValueObj, parkKeywords: originState.parkKeywords };
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
    renderScreen,
    handleMenuChange,
    handleSearch,
    handleReset,
    handleTableChange,
    handlePageChange,
  };
};

export default useList;
