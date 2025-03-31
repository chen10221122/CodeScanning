import { useCallback, useEffect, useRef, useState } from 'react';

import { useMemoizedFn, useRequest } from 'ahooks';

import {
  getIndicators,
  getIndexFlag,
  changeIndexFlag,
  getUserIndexList,
  saveUserIndexList,
} from '@/apis/area/areaCompare';
// import { Values } from '@/components/transferSelect';
import { selectItem } from '@/components/transferSelect/types';
import { formatIndicator } from '@/pages/area/areaCompare/common';
import { useCtx } from '@/pages/area/areaCompare/context';
import { PagePlatform } from '@/pages/dataView/provider/pagePlatformContext';

import type { CheckboxChangeEvent } from 'antd/es/checkbox';

const useFilterInfo = (setSelectYear: React.Dispatch<React.SetStateAction<string>>) => {
  const {
    state: { indexIds },
    update,
  } = useCtx();

  /** 刚进入页面不需要调用保存指标接口 */
  const isInitRef = useRef(true);
  /** 判断有没有从接口拿到指标key集合 */
  const hasIndexIds = useRef(false);
  // 已选指标一级标题
  const [anchorTitles, setAnchorTitles] = useState([]);
  // 指标树
  const [indicatorList, setIndicatorList] = useState([]);
  // 记住指标
  const [checked, setChecked] = useState(false);
  // 记住指标
  const [planId, setPlanId] = useState('');

  // 查询指标开关状态
  const { loading: flagLoading } = useRequest(getIndexFlag, {
    onSuccess: (res: any) => {
      const flag = res?.data === '1';
      setChecked(flag);
      // 勾选了保存，才会获取上次选中的指标数据
      if (flag) getUserRun();
      else hasIndexIds.current = true;
    },
  });
  // 改变指标开关状态
  const { run: checkRun } = useRequest(changeIndexFlag, {
    manual: true,
  });

  // 查询用户常用指标方案
  const { run: getUserRun } = useRequest(getUserIndexList, {
    manual: true,
    onSuccess: (res: any) => {
      const { planId, indexIds = {} } = res?.data || {};
      setPlanId(planId || '');
      update((d) => {
        d.indexIds = indexIds;
      });
      hasIndexIds.current = true;
    },
  });
  // 保存用户常用指标方案
  const { run: saveUserRun } = useRequest(saveUserIndexList, {
    manual: true,
  });

  // 获取指标树
  const { run, loading } = useRequest(getIndicators, {
    manual: true,
    onSuccess: (res) => {
      const data = res?.data || [];
      // 常用指标
      const defaultData = data.find((d: Record<string, any>) => d.title === '常用指标');

      data.forEach((list: Record<string, any>) => {
        const children = list?.children || [];
        if (list.title !== '常用指标') {
          formatIndicator(defaultData.children, children);
        }
      });
      setIndicatorList(data);
    },
  });

  useEffect(() => {
    run(PagePlatform.Area);
  }, [run]);

  /** 时间筛选 */
  const handleYearChanged = useCallback(
    (y) => {
      const date = y[0]?.value;
      setSelectYear(date);
      update((d) => {
        d.date = date;
      });
    },
    [setSelectYear, update],
  );

  /** 指标筛选 */
  const handleIndicChange = useMemoizedFn((selectedRows, selectedTree) => {
    const indexIds = selectedRows.map((d: selectItem) => d.indexId);
    // console.log('selectedRows=', selectedRows, selectedTree, 'indexIds==', indexIds);
    update((d) => {
      d.indexIds = indexIds;
      d.indicatorTree = selectedTree;
    });

    if (checked && !isInitRef.current) {
      saveUserRun({ indexIds: indexIds.join(','), planId });
    }
    isInitRef.current = false;
    setAnchorTitles(selectedTree.map((d: selectItem) => d.title));
  });

  /** 勾选记住指标 */
  const handleCheckChange = useMemoizedFn((e: CheckboxChangeEvent) => {
    const flag = e.target.checked;
    setChecked(flag);
    // 保存记住指标状态
    checkRun({ flag: flag ? '1' : '0' });
    if (flag) {
      saveUserRun({ indexIds: indexIds.join(','), planId });
    }
  });

  return {
    handleYearChanged,
    anchorTitles,
    loading,
    indicatorList,
    handleIndicChange,
    flagLoading,
    checked,
    handleCheckChange,
    hasIndexIds,
  };
};

export default useFilterInfo;
