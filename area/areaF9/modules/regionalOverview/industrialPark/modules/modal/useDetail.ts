import { useState, useEffect } from 'react';

import { useRequest, useMemoizedFn } from 'ahooks';
import { isEmpty } from 'lodash';

import { getDetailList } from '@/apis/area/industrialPark';
import { PAGESIZE } from '@/pages/area/areaCompany/const';

import useBaseList from '../../hooks/useBaseList';
import useScroll from '../../hooks/useScroll';
import { handleChose } from '../../utils';
import { FliterType } from './functionRegion/filter';

import type { ScreenParams, TableData, ListResult } from './type';

interface Props {
  isOpenEnterprise: boolean;
  enterpriseParams: { devZoneCode: string; devZoneName: string };
  setEnterpriseFalse: () => void;
}

const originCondition: ScreenParams = {
  from: 0,
  page: 1,
  size: PAGESIZE,
  enterpriseNature: '',
  industryCode1: '',
  industryCode2: '',
  industryCode3: '',
  industryCode4: '',
  regCapital: '',
  regStatus: '',
  havePhone: '',
  likeStr: '',
  sortRule: '',
  sortKey: '',
  parkFlag: 'true',
};

const useDetailData = ({ isOpenEnterprise, enterpriseParams, setEnterpriseFalse }: Props) => {
  const [firstLoading, setFirstLoading] = useState(true);
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
    keywords: 'likeStr',
  });

  const { run, loading, error } = useRequest(getDetailList, {
    manual: true,
    onSuccess: (res: { data: ListResult }) => {
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
    onFinally() {
      setTimeout(() => {
        setFirstLoading(false);
      });
      setOnlyBodyLoading(false);
    },
  });

  useScroll({
    loading,
    container: '.dzh-has-vertical-scrollbar',
    paddingRightBefore: '32px',
    paddingRightAfter: '14px',
  });

  useEffect(() => {
    if (isOpenEnterprise) {
      setCondition((originState) => {
        return { ...originState, ...originCondition, devZoneCode: enterpriseParams.devZoneCode };
      });
    }
  }, [isOpenEnterprise, enterpriseParams]);

  useEffect(() => {
    if (isOpenEnterprise && condition?.devZoneCode) {
      run(condition);
    }
  }, [condition, isOpenEnterprise, run]);

  const handleMenuChange = useMemoizedFn((_, allSelectedRows: any[]) => {
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
      return { ...originState, ...originCondition, ...keyValueObj, likeStr: originState.likeStr };
    });
  });

  const handleClose = useMemoizedFn(() => {
    setCondition((originState) => {
      return { ...originState, devZoneCode: '' };
    });
    setFirstLoading(true);
    setEnterpriseFalse();
  });

  return {
    onlyBodyLoading,
    error,
    firstLoading,
    loading,
    condition,
    count,
    tableData,
    renderScreen,
    handleTableChange,
    handlePageChange,
    handleMenuChange,
    handleSearch,
    handleReset,
    handleClose,
  };
};

export default useDetailData;
