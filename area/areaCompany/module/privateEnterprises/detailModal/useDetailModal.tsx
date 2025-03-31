import { useState, useEffect, useRef, useMemo } from 'react';

import { useRequest, useMemoizedFn, useUpdateEffect } from 'ahooks';
import dayjs from 'dayjs';

import { RowItem } from '@/components/screen';
import { getPrivateDetail, PrivateDetailProps } from '@/pages/area/areaCompany/api/regionFinancingApi';
import { PrivateFilterProps } from '@/pages/area/areaCompany/api/screenApi';
import { PAGESIZE } from '@/pages/area/areaCompany/const';
import { DescProps } from '@/pages/area/areaCompany/module/privateEnterprises/config';
import { useImmer, useTableSort } from '@/utils/hooks';
import { shortId } from '@/utils/share';

import { getEstablishDateValue } from './components/filter/config';
import useFilter from './components/filter/useFilter';
import { ISCLEARFILTER } from './config';
import useDetailColumns from './useDetailColumns';

type FilterPrivateDetailProps = Pick<PrivateDetailProps, 'label' | 'regCapital' | 'regStatus' | 'establishDate'>;
const defaultCondition: PrivateDetailProps = {
  boardCode: '',
  itCode2: '',
  tagYear: '',
  label: '',
  regCapital: '',
  regStatus: '',
  establishDate: '',
  sortKey: '',
  sortRule: '',
  likeStr: '',
  from: 0,
  size: PAGESIZE,
  isQueryMainCompany: 1,
};
const filterKeys: (keyof PrivateDetailProps)[] = ['label', 'regCapital', 'regStatus', 'establishDate'];
const needKeys = ['boardCode', 'itCode2', 'tagYear'];
const defaultTableInfo = {
  dataSource: [],
  count: 0,
  page: 1,
  title: '',
  desc: {} as DescProps,
  hasRank: true,
  hasLabel: true,
};
const defaultFilterCondition: PrivateFilterProps = {
  boardCode: '',
  codeFirst: '',
  tagYear: '',
};

export default () => {
  const [visible, setVisible] = useState(false);
  const [exportTitle, setExportTitle] = useState('');
  const mountRef = useRef(true);
  /** 上一次的描述信息，防止筛选/表格变动无数据导致描述信息也隐藏掉。 */
  const prevDescRef = useRef<DescProps>(defaultTableInfo.desc);
  /** 上一次的弹窗code */
  const prevModalCodeRef = useRef('');
  const [skipYearFilter, setSkipYearFilter] = useState(false);
  const [screenKey, setScreenKey] = useState(shortId());

  const [tableInfo, updateTableInfo] = useImmer<{
    /** 表格数据 */
    dataSource: Record<string, any>[];
    /** 表格总数 */
    count: number;
    /** 表格页数 */
    page: number;
    /** 弹窗标题 */
    title: string;
    /** 头部描述 */
    desc: DescProps;
    /** 是否显示排名列 */
    hasRank: boolean;
    /** 是否显示连续状态列 */
    hasLabel: boolean;
  }>(defaultTableInfo);
  /** 弹窗筛选接口参数 */
  const [filterCondition, updateFilterCondition] = useImmer<PrivateFilterProps>(defaultFilterCondition);
  /** 弹窗表格接口参数 */
  const [condition, updateCondition] = useImmer<PrivateDetailProps>(defaultCondition);

  const noSortColumns = useDetailColumns({ curPage: tableInfo.page, keyword: condition.likeStr || '' });

  const onTableSort = useMemoizedFn(() => {
    updateCondition((d) => {
      d.isQueryMainCompany = 0;
    });
  });

  const {
    columns: hasSortedColumns,
    handelTableSort: handleTableChange,
    updateCurSorter,
  } = useTableSort({
    defaultSortKey: '',
    defaultSortRule: '',
    noSortColumns,
    defaultCondition,
    updateCondition: updateCondition as any,
    onTableSort,
    conditionSortKey: 'sortKey',
    conditionSortRule: 'sortRule',
  });

  /** 筛选 */
  const { getFilter, filterMenu: originFilterMenu, years, filterStatus, setYears } = useFilter(skipYearFilter);

  /** 列表请求 */
  const { run, loading } = useRequest(getPrivateDetail, {
    manual: true,
    onSuccess: (res: Record<string, any>) => {
      const data = res && res.data ? res.data : {};
      if (res && res.data) {
        prevDescRef.current = {
          identityUnit: data.identityUnit,
          dataSource: data.dataSource,
          declareDate: data.declareDate,
          fileUrl: data.fileUrl,
        };
      }
      updateTableInfo((d) => {
        d.dataSource = data.detailList || [];
        d.count = data.total || 0;
        d.hasRank = data.haveRank;
        d.hasLabel = data.latestYear;
        d.desc = prevDescRef.current;
      });
    },
    onError() {
      updateTableInfo((d) => {
        d.dataSource = defaultTableInfo.dataSource;
        d.count = defaultTableInfo.count;
        d.desc = prevDescRef.current;
      });
    },
  });

  useEffect(() => {
    if (filterCondition.tagYear) {
      getFilter(filterCondition);
    }
    /* itcode2是为了防止筛选的参数多个是一样的 */
  }, [getFilter, filterCondition, condition.itCode2]);
  useEffect(() => {
    if (!needKeys.some((key) => !condition[key as keyof PrivateDetailProps])) {
      run(condition);
    }
  }, [run, condition]);

  /** 对筛选项处理 */
  const filterMenu = useMemo(() => {
    if (!tableInfo.hasLabel) return originFilterMenu.slice(1);
    return originFilterMenu;
  }, [originFilterMenu, tableInfo]);

  // 筛选长度变化直接重置key，保证正常渲染
  useUpdateEffect(() => {
    setScreenKey(shortId());
  }, [filterMenu.length]);

  /** 对表格列显隐处理 */
  const columns = useMemo(() => {
    if (!tableInfo.hasRank) return hasSortedColumns.filter((col: Record<string, any>) => col.title !== '排名');
    if (!tableInfo.hasLabel) return hasSortedColumns.filter((col: Record<string, any>) => col.title !== '连续状态');
    return hasSortedColumns;
  }, [hasSortedColumns, tableInfo.hasRank, tableInfo.hasLabel]);

  /** 重置表格状态 */
  const handleResetTableStatus = useMemoizedFn(() => {
    updateTableInfo((d) => {
      d.page = defaultTableInfo.page;
    });
    updateCurSorter((d) => {
      d.sortRule = '';
    });
  });

  const handleOpenModal = useMemoizedFn((condition: Record<string, any>) => {
    updateFilterCondition((d) => {
      d.codeFirst = condition.codeFirst;
      d.boardCode = condition.boardCode;
      d.tagYear = condition.tagYear;
    });

    setVisible(true);
    // 去掉年份 这里通过正则简单判断。
    const noYearTagName = condition.tagName.replace(new RegExp(/.{4}年/), '');
    updateTableInfo((d) => {
      d.title = noYearTagName;
    });
    setExportTitle(noYearTagName);

    // 重置状态
    updateCondition((d) => {
      for (const key in defaultCondition) {
        (d[key as keyof PrivateDetailProps] as string) = defaultCondition[key as keyof PrivateDetailProps] as string;
      }
      d.boardCode = condition.boardCode;
      d.itCode2 = condition.itCode2;
    });
    handleResetTableStatus();
    mountRef.current = true;
    prevDescRef.current = defaultTableInfo.desc;
    setSkipYearFilter(false);
    const strModal = JSON.stringify(condition);
    if (prevModalCodeRef.current) {
      if (strModal !== prevModalCodeRef.current) {
        /* 在新的弹窗打开，才去清除years */
        setYears([]);
        prevModalCodeRef.current = strModal;
      }
    } else {
      prevModalCodeRef.current = strModal;
    }
  });

  /** 表格翻页 */
  const handlePageChange = useMemoizedFn((page: number) => {
    if (page !== tableInfo.page) {
      updateTableInfo((d) => {
        d.page = page;
      });
      updateCondition((d) => {
        d.from = (page - 1) * PAGESIZE;
        d.isQueryMainCompany = 0;
      });
    }
  });

  /** 头部年份筛选 */
  const hanldeYearChange = useMemoizedFn((_: RowItem[], all: RowItem[]) => {
    if (mountRef.current) {
      mountRef.current = false;
    } else {
      setSkipYearFilter(true);
      handleResetTableStatus();
      // 头部筛选重置下方筛选
      setScreenKey(shortId());
      updateCondition((d) => {
        d.isQueryMainCompany = 0;
      });
    }
    updateFilterCondition((d) => {
      d.tagYear = all[0].value;
    });
    updateCondition((d) => {
      d.tagYear = all[0].value;
      // 重置筛选以及表格参数 保留搜索
      filterKeys.forEach((keyItem) => {
        (d[keyItem] as string) = '';
      });
      d.from = defaultCondition.from;
      d.sortKey = defaultCondition.sortKey;
      d.sortRule = defaultCondition.sortRule;
    });
  });

  /** 弹窗筛选 */
  const handleScreenChange = useMemoizedFn((_: RowItem[], all: RowItem[]) => {
    const resCondition: Record<keyof FilterPrivateDetailProps, string[]> = {
      label: [],
      regCapital: [],
      regStatus: [],
      establishDate: [],
    };
    if (all.length) {
      all.forEach((item) => {
        if (item.key === 'establishDate') {
          let val = '';
          if (item.name === '自定义') {
            val = `[${dayjs(item.value[0]).format('YYYY-MM-DD')},${dayjs(item.value[1]).format('YYYY-MM-DD')})`;
          } else {
            val = getEstablishDateValue(item.value) || '';
          }
          resCondition[item.key as keyof FilterPrivateDetailProps].push(val);
        } else {
          resCondition[item.key as keyof FilterPrivateDetailProps].push(item.value);
        }
      });
    }
    updateCondition((d) => {
      filterKeys.forEach((keyItem) => {
        (d[keyItem] as string) = resCondition[keyItem as keyof FilterPrivateDetailProps].join(',');
      });
      // 重置参数
      d.from = defaultCondition.from;
      d.sortKey = defaultCondition.sortKey;
      d.sortRule = defaultCondition.sortRule;
      d.isQueryMainCompany = 0;
    });
    handleResetTableStatus();
  });

  /** 搜索 */
  const onSearch = useMemoizedFn((txt: string) => {
    updateCondition((d) => {
      d.likeStr = txt;
      // 重置参数
      d.from = defaultCondition.from;
      d.sortKey = defaultCondition.sortKey;
      d.sortRule = defaultCondition.sortRule;
      d.isQueryMainCompany = 0;
    });
    handleResetTableStatus();
  });

  /** 清除搜索 */
  const onClearSearch = useMemoizedFn(() => {
    updateCondition((d) => {
      d.likeStr = defaultCondition.likeStr;
      // 重置参数
      d.from = defaultCondition.from;
      d.sortKey = defaultCondition.sortKey;
      d.sortRule = defaultCondition.sortRule;
      d.isQueryMainCompany = 0;
    });
    handleResetTableStatus();
  });

  /** 清除筛选 */
  const onClearFilter = useMemoizedFn(() => {
    handleResetTableStatus();
    setScreenKey(shortId() + ISCLEARFILTER);
    updateCondition((d) => {
      filterKeys.forEach((keyItem) => {
        (d[keyItem] as string) = defaultCondition[keyItem as keyof PrivateDetailProps] as string;
      });
      // 重置参数
      d.likeStr = defaultCondition.likeStr;
      d.from = defaultCondition.from;
      d.sortKey = defaultCondition.sortKey;
      d.sortRule = defaultCondition.sortRule;
      d.isQueryMainCompany = 0;
    });
  });

  return {
    columns,
    exportTitle,
    condition,
    visible,
    loading,
    ...tableInfo,
    filterMenu,
    years,
    filterStatus,
    screenKey,
    setVisible,
    handleOpenModal,
    handleTableChange,
    handlePageChange,
    handleScreenChange,
    hanldeYearChange,
    onSearch,
    onClearSearch,
    onClearFilter,
  };
};
