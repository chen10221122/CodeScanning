import { useEffect, useState, useRef } from 'react';

import { useRequest, useMemoizedFn, useSafeState } from 'ahooks';
import dayjs from 'dayjs';
import { groupBy, mapValues, map, omit, keys, remove, isEmpty } from 'lodash';

import { ScreenValues } from '@/components/screen';
import { PAGESIZE } from '@/pages/area/areaCompany/const';
import { SearchFiled } from '@/pages/area/areaCompany/module/bondIssueList/constants';
import { scrollTo } from '@/utils/animate';
import { useImmer } from '@/utils/hooks';

import { HEADER_HEIGHT } from '../constants';
import { ModuleTemplateProps } from './';

interface IProps {
  initCondition: Record<string, any>;
}

const useTableData = ({
  listApiFunction,
  initCondition,
  pageSize = PAGESIZE,
}: IProps & Pick<ModuleTemplateProps, 'pageType' | 'listApiFunction' | 'pageSize'>) => {
  const keywordRef = useRef({ text: '', keyFiled: '' });
  const preScreenData = useRef({});

  const [tableData, setTableData] = useState<Record<string, any>[]>([]);
  const [screenValues, updateScreenValues] = useImmer<ScreenValues>([]);
  const [param, updateParam] = useImmer(initCondition);
  const [renderFilter, setRenderFilter] = useSafeState(true);
  const [pager, updatePager] = useImmer<{ pageSize: number; current: number; total: number }>({
    current: 1,
    total: 0,
    pageSize: PAGESIZE,
  });

  const { run, loading, error } = useRequest(listApiFunction, {
    manual: true,
    onSuccess(res: Record<string, any>) {
      const { data = [], total = 0 } = res.data;
      setTableData(data);
      updatePager((draftPager) => {
        draftPager.total = total;
      });
    },
    onError() {
      setTableData([]);
      updatePager((draftPager) => {
        draftPager.total = 0;
      });
    },
  });

  useEffect(() => {
    param && run(param);
  }, [run, param]);

  /** 筛选项操作 */
  const handMenuChange = useMemoizedFn((currentSelect, allSelect, index) => {
    defaultStatus();

    /** 日期筛选自定义处理 */
    const customDate = remove(allSelect, (item: any) => item.name === '自定义');
    let customParams: Record<string, string> = {};
    if (customDate?.length) {
      const {
        value: [start, end],
      } = customDate[0];
      const pickerFormat = 'YYYY-MM-DD';
      customParams = { changeDate: `[${dayjs(start).format(pickerFormat)},${dayjs(end).format(pickerFormat)}]` };
    }

    const keyValueMap = {
      ...mapValues(groupBy(allSelect, 'key'), (group) => map(group, 'value').toString()),
      ...customParams,
    };
    const removeKeyValue = mapValues(omit(preScreenData.current, keys(keyValueMap)), () => '');
    preScreenData.current = keyValueMap;

    updateParam((preData) => ({
      ...initCondition,
      ...preData,
      ...keyValueMap,
      ...removeKeyValue,
    }));
    updateScreenValues((screenDraft) => {
      screenDraft[index] = currentSelect;
    });
  });

  /** 滚动到头部事件 */
  const scrollToTop = useMemoizedFn(() => {
    scrollTo(HEADER_HEIGHT, {
      getContainer: () => document.querySelector('#area-company-index-container') as HTMLElement,
      duration: 0,
    });
  });

  const defaultStatus = useMemoizedFn(() => {
    scrollToTop();
    updatePager((draftPager) => {
      draftPager.current = 1;
    });
    updateParam((draft) => {
      draft.from = 0;
    });
  });

  /** 是否包含跨市场债券筛选 */
  const handleExpirationChange = useMemoizedFn((bool) => {
    defaultStatus();
    updateParam((draft) => {
      draft.crossMarket = bool.target.checked ? '1' : '0';
    });
  });

  /** 搜索 */
  const handFilterSearch = useMemoizedFn((text, type) => {
    defaultStatus();
    const keyFiled = isEmpty(type) ? Object.values(SearchFiled).toString() : type.toString();
    keywordRef.current = { text, keyFiled };
    updateParam((draft) => {
      draft.text = text;
      draft.keyFiled = keyFiled;
    });
  });

  /** 清空搜索 */
  const handFilterClear = useMemoizedFn(() => {
    defaultStatus();
    keywordRef.current = { text: '', keyFiled: '' };
    updateParam((draft) => {
      draft.text = '';
      draft.keyFiled = '';
    });
  });

  /** 表格排序 */
  const handleSortChange = useMemoizedFn((_, __, sorter) => {
    defaultStatus();
    updateParam((draft) => {
      draft.sortKey = sorter.field;
      draft.sortRule = sorter.order === 'ascend' ? 'asc' : 'desc';
    });
  });

  /** 翻页 */
  const handlePageChange = useMemoizedFn((page) => {
    scrollToTop();
    updateParam((draft) => {
      draft.from = (page - 1) * pageSize;
    });
    updatePager((draftPager) => {
      draftPager.current = page;
    });
  });

  /** 重新加载 */
  const handleReload = useMemoizedFn(() => {
    run({ ...param });
  });

  /** 重置筛选 */
  const handleClear = useMemoizedFn(() => {
    setRenderFilter(false);
    requestAnimationFrame(() => {
      setRenderFilter(true);
      // updateScreenValues(() => [[], [], [], []]);
      updateScreenValues((d) => d.map(item => []));
      updateParam(() => ({ ...initCondition }));
    });
  });

  return {
    error,
    pager,
    param,
    loading,
    tableData,
    keywordRef,
    renderFilter,
    screenValues,
    handleClear,
    handleReload,
    updateParam,
    handMenuChange,
    handleSortChange,
    handlePageChange,
    handFilterClear,
    handFilterSearch,
    handleExpirationChange,
  };
};
export default useTableData;
