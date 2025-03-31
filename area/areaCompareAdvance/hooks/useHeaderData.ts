import { useCallback, useEffect, useRef, useState } from 'react';

import { useMemoizedFn, useRequest } from 'ahooks';

import {
  getInitYear,
  getIndicators,
  getIndexFlag,
  changeIndexFlag,
  getUserIndexList,
  saveUserIndexList,
} from '@/apis/area/areaCompare';
import { selectItem } from '@/components/transferSelect/types';
import { formatIndicator } from '@/pages/area/areaCompareAdvance/config';
import { useCtx } from '@/pages/area/areaCompareAdvance/context';
import useAreaOperate from '@/pages/area/areaCompareAdvance/hooks/useAreaOperate';
import useJump from '@/pages/area/areaCompareAdvance/hooks/useJump';
import { PagePlatform } from '@/pages/dataView/provider/pagePlatformContext';

import type { CheckboxChangeEvent } from 'antd/es/checkbox';

const useHeaderData = () => {
  const {
    state: { areaSelectCode, jumpCodes },
    update,
  } = useCtx();

  const { screenRequestData, addArea } = useAreaOperate();
  const { handleJump } = useJump();

  /** 刚进入页面不需要调用保存指标接口 */
  const isInitRef = useRef(true);
  /** 判断有没有从接口拿到指标key集合 */
  // const hasIndexIds = useRef(false);
  // 指标树
  const [indicatorList, setIndicatorList] = useState([]);
  // '记住指标'勾选状态
  // const [checked, setChecked] = useState(false);
  // // '记住指标'id
  // const [planId, setPlanId] = useState('');
  // '记住地区'勾选状态
  const [areaChecked, setAreaChecked] = useState(false);
  // '记住地区'id
  const [regionPlanId, setRegionPlanId] = useState('');
  const preAreaCodeRef = useRef('');

  // 查询默认年份
  useRequest(getInitYear, {
    onSuccess: (res: any) => {
      const date = res.data.split('-')[0];
      update((d) => {
        d.date = date;
      });
    },
  });

  // 查询指标开关状态
  const { loading: flagLoading } = useRequest(getIndexFlag, {
    onSuccess: (res: any) => {
      const { /* indexFlag, */ regionFlag } = res?.data || {};
      // const indexRes = indexFlag === '1';
      const regionRes = regionFlag === '1';
      // setChecked(indexRes);
      setAreaChecked(regionRes);
      // 获取上次选中的指标数据和地区数据
      getUserRun();
      // if (!indexRes) hasIndexIds.current = true;
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
      const { /* planId, indexIds = [], */ regionPlanId, regionInfo = [] } = res?.data || {};
      // 地区跳转时，地区code需要拼接areaSelectCode
      const regionCodeList = regionInfo.map((d: any) => d.regionCode).concat(areaSelectCode?.split(',') || []);
      // 去重后再转成字符串
      const regionCodeStr = Array.from(new Set(regionCodeList)).join(',');

      // setPlanId(planId || '');
      setRegionPlanId(regionPlanId || '');
      update((d) => {
        // if (checked) d.indexIds = indexIds;
        if (areaChecked) {
          preAreaCodeRef.current = regionCodeStr;
          d.areaSelectCode = regionCodeStr;
        }
      });
      // hasIndexIds.current = true;
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
      let indicatorLen = { len: 0 };
      data.forEach((list: Record<string, any>) => {
        const children = list?.children || [];
        if (list.title !== '常用指标') {
          formatIndicator(defaultData.children, children, indicatorLen);
        }
      });

      data?.length &&
        update((draft) => {
          draft.firstMainLoading = false;
          draft.indicatorLen = indicatorLen.len;
        });
      setIndicatorList(data);
    },
  });

  useEffect(() => {
    run(PagePlatform.Area);
  }, [run]);

  // 地区清空时，去掉勾选
  useEffect(() => {
    if (!areaSelectCode && !isInitRef.current) {
      setAreaChecked(false);
      // 记住地区状态改为未勾选
      checkRun({ flag: '0', type: 'region' });
    }
  }, [areaSelectCode, checkRun]);

  // 地区有变化时，需要保存已选地区
  useEffect(() => {
    if (areaChecked && areaSelectCode && preAreaCodeRef.current !== areaSelectCode) {
      preAreaCodeRef.current = areaSelectCode;
      saveUserRun({ regionCodes: areaSelectCode, planId: regionPlanId, type: 'region' });
    }
  }, [areaChecked, areaSelectCode, regionPlanId, saveUserRun]);

  /** 时间筛选 */
  const handleYearChanged = useCallback(
    (y) => {
      const date = y[0]?.value;
      update((d) => {
        d.date = date;
      });
      screenRequestData({ date });
    },
    [screenRequestData, update],
  );

  /** 指标筛选 */
  const handleIndicChange = useMemoizedFn((selectedRows: selectItem[], selectedTree: selectItem[]) => {
    const indexIds = selectedRows.map((d: selectItem) => d.indexId);
    // console.log('selectedRows==', selectedRows, 'selectedTree', selectedTree);
    update((d) => {
      d.indexIds = indexIds;
      d.indicatorTree = selectedTree;
    });
    screenRequestData({ indicatorTreeList: selectedTree, indexIdList: indexIds });
    // 如果记住指标是选中状态，就调接口保存选中的指标
    // if (checked && !isInitRef.current) {
    //   saveUserRun({ indexIds: indexIds.join(','), planId });
    // }
    if (isInitRef.current) {
      setTimeout(() => {
        if (jumpCodes) {
          handleJump(jumpCodes || []);
          return;
        } else if (areaSelectCode) {
          // 首次进入页面，勾选了记住地区就需要调地区接口
          addArea(areaSelectCode.split(','));
        }
      });
    }
    isInitRef.current = false;
  });

  /** 勾选记住指标 */
  const handleCheckChange = useMemoizedFn((e: CheckboxChangeEvent) => {
    const flag = e.target.checked;
    // setChecked(flag);
    // 保存记住指标状态
    checkRun({ flag: flag ? '1' : '0' });
    /* if (flag) {
      saveUserRun({ indexIds: indexIds.join(','), planId });
    } */
  });

  /** 勾选记住地区 */
  const handleAreaChange = useMemoizedFn((e: CheckboxChangeEvent) => {
    const flag = e.target.checked;
    setAreaChecked(flag);
    // 保存记住地区状态
    checkRun({ flag: flag ? '1' : '0', type: 'region' });
  });

  return {
    handleYearChanged,
    loading,
    indicatorList,
    handleIndicChange,
    flagLoading,
    // checked,
    handleCheckChange,
    // hasIndexIds,
    areaChecked,
    handleAreaChange,
  };
};

export default useHeaderData;
