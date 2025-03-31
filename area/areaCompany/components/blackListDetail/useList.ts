import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useMemoizedFn, useRequest } from 'ahooks';
import { isEmpty } from 'lodash';

import {
  ETagType,
  ModalPageSize,
  DETAIL_TOP,
} from '@/pages/detail/modules/enterprise/overview/modules/qualityList/constant';
import { GroupItem, SelectItem } from '@/pages/detail/modules/enterprise/overview/modules/qualityList/types';
import { useImmer } from '@/utils/hooks';

interface ListProps {
  originCondition: Record<string, number | string | boolean>;
  tagType: string;
  params: Record<string, any>;
  getListData: (params: any) => Promise<any>;
  scrollRef?: React.MutableRefObject<HTMLDivElement> | React.MutableRefObject<null>;
  filterRef?: React.MutableRefObject<HTMLDivElement> | React.MutableRefObject<null>;
}

const useList = ({ getListData, tagType, originCondition, params, scrollRef, filterRef }: ListProps) => {
  // 各个模块弹窗的默认排序规则
  const sort = useMemo(() => {
    switch (tagType) {
      case ETagType.SATI: {
        return {
          sortKey: 'registerCapital,establishDate',
          sortRule: 'desc,desc',
        };
      }
      case ETagType.RANKLIST: {
        return {
          sortKey: 'rank,publicationDate,registerCapital,establishDate',
          sortRule: 'asc,desc,desc,desc',
        };
      }
      default: {
        return {
          sortKey: 'publicationDate,registerCapital,establishDate',
          sortRule: 'desc,desc,desc',
        };
      }
    }
  }, [tagType]);

  const [condition, setCondition] = useState<Record<string, string | number>>({
    ...originCondition,
    tagCode: params?.tagCode,
    sortKey: sort?.sortKey,
    sortRule: sort?.sortRule,
  });
  const skipRef = useRef(0);
  const [firstLoaded, setFirstLoaded] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [hideRank, setHideRank] = useState(false);
  // 弹窗顶部的展示信息
  const [headInfo, setHeadIndo] = useState({
    dataSource: '',
    publicationDate: '',
    fileList: '',
  });
  // 是否对应字段展示在弹窗的顶部
  const [groupItem, setgroupItem] = useState<GroupItem>({
    dataSource: false,
    publicationDate: false,
    fileList: false,
  });
  const [pager, setPager] = useImmer<{ pageSize: number; current: number; total: number }>({
    current: 1,
    total: 0,
    pageSize: ModalPageSize,
  });

  const [renderScreen, setRenderScreen] = useState(true);

  const { data, run, loading } = useRequest(getListData, {
    manual: true,
    onSuccess: () => {
      if (firstLoaded) setFirstLoaded(false);
    },
    onError: () => {
      setFirstLoaded(false);
      setTableData([]);
      setPager((base) => {
        base.total = 0;
        base.current = 1;
      });
    },
  });

  useEffect(() => {
    const finalData = data?.data ?? [];
    if (!isEmpty(finalData)) {
      setPager((base) => {
        base.current = skipRef.current + 1;
        base.total = finalData.total;
      });
      setHideRank(() => !finalData.data?.some((o: any) => !!o.rank));
      setTableData(
        finalData.data?.map((o: any, i: number) => {
          return { ...o, key: i, skip: skipRef.current * ModalPageSize };
        }),
      );
      // 根据判断对应字段是否唯一
      Number(condition.isQueryUniqueFields) === 1 &&
        setgroupItem({
          dataSource: finalData.groupItems?.dataSource === '1',
          publicationDate: finalData.groupItems?.declareDate === '1',
          fileList: finalData.groupItems?.guid === '1',
        });
      // 只有isQueryUniqueFields 参数为1的时候才设置顶部的数据
      Number(condition.isQueryUniqueFields) === 1 &&
        setHeadIndo(() => {
          return {
            dataSource: finalData.groupItems?.dataSource === '1' ? finalData.data[0]?.dataSource : '',
            publicationDate: finalData.groupItems?.declareDate === '1' ? finalData.data[0]?.publicationDate : '',
            fileList: finalData.groupItems?.guid === '1' ? finalData.data[0]?.fileList : '',
          };
        });
      // setTimeout(() => {
      //   window.dispatchEvent(new Event('resize'));
      // });
    }
  }, [data, setPager, condition.isQueryUniqueFields]);

  useEffect(() => {
    // 非首次加载，并且已经处于上推时，加载数据时才回到顶部
    if (filterRef?.current && !firstLoaded && filterRef?.current?.offsetTop > DETAIL_TOP) {
      scrollRef?.current?.scrollIntoView();
    }
    if (condition.tagCode && condition?.code) {
      run(condition);
    }
    // eslint-disable-next-line
  }, [condition, run]);

  useEffect(() => {
    // loading 时隐藏页面整体的滚动条
    const scrollEl: any = document.querySelector('#contentScrollDom');
    if (scrollEl && scrollEl.style) {
      scrollEl.style.overflowY = loading ? 'hidden' : '';
    }
  }, [loading]);

  const handleMenuChange = useCallback(
    (_, total) => {
      let keyValueObj: any = {};
      total?.forEach((item: SelectItem) => {
        if (!keyValueObj[item.key]) {
          keyValueObj[item.key] = item.value;
        } else {
          keyValueObj[item.key] = keyValueObj[item.key] + ',' + item.value;
        }
      });
      skipRef.current = 0;
      setCondition((originState) => {
        return { ...originState, ...originCondition, ...keyValueObj };
      });
    },
    [originCondition],
  );

  const onFilterChange = useMemoizedFn((row, record) => {
    skipRef.current = 0;
    setCondition((originState) => {
      return { ...originState, ...record };
    });
  });

  const handleChangePage = useCallback(
    (current) => {
      setPager((base) => {
        base.current = current;
      });
      skipRef.current = current - 1;
      setCondition((originState) => {
        return { ...originState, isQueryMainCompany: 0, isQueryUniqueFields: 0, skip: skipRef.current * ModalPageSize };
      });
    },
    [setPager],
  );

  const handleSearch = useCallback((value) => {
    skipRef.current = 0;
    setCondition((originState) => {
      return { ...originState, skip: 0, keyWord: value };
    });
  }, []);

  const handleReset = useCallback(() => {
    setRenderScreen(false);
    skipRef.current = 0;
    setCondition((originState) => {
      for (let key in originState) {
        if (!['code', 'tagCode', 'exportFlag', 'isQueryMainCompany', 'isQueryUniqueFields', 'pageSize'].includes(key)) {
          originState[key] = '';
        }
      }
      return { ...originState, skip: 0, keyWord: '' };
    });
    requestAnimationFrame(() => {
      setRenderScreen(true);
    });
  }, [setRenderScreen]);

  const handleSort = useCallback((pagination, filters, sorter) => {
    if (isEmpty(sorter)) return;
    skipRef.current = 0;
    setCondition((originState) => {
      return {
        ...originState,
        isQueryMainCompany: sorter.order ? '' : 1,
        skip: 0,
        sortKey: sorter.order ? sorter.field : '',
        sortRule: sorter.order === 'ascend' ? 'asc' : sorter.order === 'descend' ? 'desc' : '',
      };
    });
  }, []);

  return {
    hideRank,
    headInfo,
    groupItem,
    tableData,
    condition,
    pager,
    loading,
    firstLoaded,
    skipRef,
    renderScreen,
    handleMenuChange,
    onFilterChange,
    handleChangePage,
    handleSearch,
    handleSort,
    handleReset,
  };
};

export default useList;
