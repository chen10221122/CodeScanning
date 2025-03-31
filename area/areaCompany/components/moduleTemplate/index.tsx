/**
 * 模块模板
 * 对请求管理、表格管理、筛选管理
 * 只需要传请求函数、筛选对应的模块、表格columns即可
 */

import { FC, createElement, useState, useMemo, useEffect, useRef, memo } from 'react';

import { useRequest, useMemoizedFn } from 'ahooks';
import dayjs from 'dayjs';
import { isFunction } from 'lodash';

import { WrapperProps } from '@/pages/area/areaCompany/components/moduleWrapper';
import MultiModuleWrapper, {
  SubModuleProps,
} from '@/pages/area/areaCompany/components/moduleWrapper/multiModuleWrapper';
import SingleModuleWrapper from '@/pages/area/areaCompany/components/moduleWrapper/singleModuleWrapper';
import {
  REGIONAL_PAGE,
  ScreenParamsType,
  CompanyScreenParamsType,
  exportNameMap,
  isPostExportPages,
  exportTitleIsBranchName,
} from '@/pages/area/areaCompany/configs';
import { NOTITLESCROLLTOP, TABLESTICKY, SUBTABLESTICKY, PAGESIZE, SUBPAGESIZE } from '@/pages/area/areaCompany/const';
import { useDispatch, useSelector } from '@/pages/area/areaF9/context';
import { useParams } from '@/pages/area/areaF9/hooks';
import { useImmer, useLoading } from '@/utils/hooks';

import {
  TemplateKeyEnums,
  defaultSpecialParamKeyMap,
  defaultParamsNeedLists,
  CONTIAINERID,
  SPLITSORTREG,
  TemplateProps,
} from './config';
import useRenderTable from './useRenderTable';
import useTemplateFilter, { UseFilterProps as ImportUseFilterProps } from './useTemplateFilter';

export { TemplateKeyEnums } from './config';
export type UseFilterProps = ImportUseFilterProps;

const ModuleTemplate: FC<TemplateProps> = ({
  title,
  pageType,
  listApiFunction,
  useColumnsHook,
  handleSuccess,
  handleLoaded,
  handleError,
  specialParamKeyMap = defaultSpecialParamKeyMap,
  defaultCondition,
  filterKeyLists,
  moduleType,
  isSubModuleItem,
  iconPath,
  id,
  paramsNeedLists = defaultParamsNeedLists,
  refreshPageKey,
  specialStyleStr,
  hasDefaultFilter,

  needColumnCustomStyle = true,
  useFilterHook,
  getModuleTypeByCondition,
}) => {
  const dispatch = useDispatch();
  const { regionCode } = useParams();
  const { areaInfo, branchName, areaTreeLoading, industryLoading } = useSelector((store) => ({
    areaInfo: store.areaInfo,
    branchId: store.curNodeBranchId,
    branchName: store.curNodeBranchName,
    areaTreeLoading: store.areaTreeLoading,
    industryLoading: store.industryLoading,
  }));

  const isRefreshPageRef = useRef(false);
  const isMountFilterChangeRef = useRef(true);
  const prevConditionRef = useRef('');
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  // 表格排序icon是否在加载
  const [sortIconLoded, setSortIconLoaded] = useState(true);
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [condition, updateCondition] = useImmer<Record<string, any>>(defaultCondition);

  const { run, error } = useRequest(listApiFunction, {
    manual: true,
    onSuccess(res: Record<string, any>) {
      if (isFunction(handleSuccess)) {
        const { data, totalCount } = handleSuccess(res);
        setData(data);
        setTotalCount(totalCount);
      } else {
        setData(res && res.data ? res.data.data : []);
        setTotalCount(res && res.data ? res.data.total : 0);
      }
      isFunction(handleLoaded) && handleLoaded(title);
      setLoading(false);
      isRefreshPageRef.current = false;
    },
    onError() {
      isFunction(handleError) && handleError();
      setData([]);
      setTotalCount(0);
      isFunction(handleLoaded) && handleLoaded(title);
      setLoading(false);
      isRefreshPageRef.current = false;
    },
  });

  const isLoading = useLoading(loading);

  const sortKey = useMemo(() => {
    if (specialParamKeyMap.has(TemplateKeyEnums.sort)) {
      return {
        sort: specialParamKeyMap.get(TemplateKeyEnums.sort) || TemplateKeyEnums.sort,
      };
    } else {
      return {
        sortKey: specialParamKeyMap.get(TemplateKeyEnums.sortKey) || TemplateKeyEnums.sortKey,
        sortType: specialParamKeyMap.get(TemplateKeyEnums.sortType) || TemplateKeyEnums.sortType,
      };
    }
  }, [specialParamKeyMap]);

  // 从默认参数中找到的默认排序字段，多个只会拿第一个
  const defaultSortInfo = useMemo(() => {
    if (sortKey.sort) {
      return defaultCondition[sortKey.sort].split(SPLITSORTREG);
    } else {
      return [
        defaultCondition[sortKey.sortKey!].split(SPLITSORTREG)[0],
        defaultCondition[sortKey.sortType!].split(SPLITSORTREG)[0],
      ];
    }
  }, [sortKey, defaultCondition]);

  // 大模块和小模块的一些区分开的变量
  const currentModule = useMemo(
    () => ({
      pageSize: isSubModuleItem ? SUBPAGESIZE : PAGESIZE,
      tableSticky: isSubModuleItem ? SUBTABLESTICKY : TABLESTICKY,
      wrapperComponent: (isSubModuleItem ? MultiModuleWrapper : SingleModuleWrapper) as FC<
        Partial<WrapperProps & SubModuleProps>
      >,
      title: isSubModuleItem ? 'subTitle' : 'title',
    }),
    [isSubModuleItem],
  );

  // 导出配置
  const exportInfo = useMemo(
    () => ({
      total: totalCount,
      pageParams: {
        ...condition,
        // 导出一万条
        size: 10000,
        pagesize: 10000,
      },
      moduleType: isFunction(getModuleTypeByCondition) ? getModuleTypeByCondition(condition) : moduleType,
      filename: `${areaInfo?.regionName || ''}-${
        exportNameMap.get(pageType) || (exportTitleIsBranchName.includes(pageType) ? branchName : title) || ''
      }-${dayjs(new Date()).format('YYYY.MM.DD')}`,
      usePost: isPostExportPages.includes(pageType),
    }),
    [totalCount, condition, moduleType, title, pageType, areaInfo, branchName, getModuleTypeByCondition],
  );

  /** 筛选相关 */
  const useHook = useMemo(() => useFilterHook || useTemplateFilter, [useFilterHook]);
  const { filter, filterFistLoading, filterResult, onClearFilter } = useHook({
    title,
    pageType,
    listApiFunction,
    refreshPageKey,
    exportInfo,
  });

  const { tableContainer, updateColumnsProps, resetTablePageStatus, resetTableStatus } = useRenderTable({
    defaultCondition,
    defaultSortInfo,
    data,
    totalCount,
    loading,
    isLoading,
    specialParamKeyMap,
    currentModule,
    specialStyleStr,
    id,
    title,
    useColumnsHook,
    updateCondition,
    setSortIconLoaded,
    needColumnCustomStyle,
  });

  const firstLoading = useMemo(
    /** 租赁融资和吊销注销页面的筛选不走接口 */
    () => {
      if (isRefreshPageRef.current) {
        return loading;
      } else {
        return isLoading || sortIconLoded || filterFistLoading || areaTreeLoading || industryLoading;
      }
    },
    [isLoading, loading, sortIconLoded, areaTreeLoading, industryLoading, filterFistLoading],
  );

  // 兼容
  useEffect(() => {
    if (pageType === REGIONAL_PAGE.COMPANY_LISTED_RESERVE && regionCode) {
      updateCondition((d) => {
        d.areaCode = regionCode;
        // 未选中下属辖区不传regionCode
        d.regionCode = filterResult.regionCode === regionCode ? '' : filterResult.regionCode;
      });
    }
  }, [pageType, regionCode, filterResult, updateCondition]);

  // refreshPageKey变化重置页面状态
  useEffect(() => {
    if (refreshPageKey) {
      isRefreshPageRef.current = true;
      isMountFilterChangeRef.current = true;
      // setTotalCount(0);
      setLoading(true);
      onClearFilter();
      resetTablePageStatus();
      updateCondition((d) => {
        d = { ...defaultCondition };
        return d;
      });
    }
  }, [refreshPageKey, defaultCondition, /*  defaultSortInfo, */ updateCondition, onClearFilter, resetTablePageStatus]);

  /**
   * 单模块：如果滚动条在标题以下，loading结束回到标题下；如果滚动条在标题上，loading结束回到顶部
   * 多模块：滚动条位置不动
   */
  useEffect(() => {
    const wrap = document.getElementById(CONTIAINERID);
    if (wrap) {
      if (loading) {
        wrap.setAttribute('style', `overflow-y: hidden !important`);
      } else {
        if (!isSubModuleItem) {
          wrap.scrollTop = wrap.scrollTop < NOTITLESCROLLTOP ? 0 : NOTITLESCROLLTOP;
        }
      }
    }
    return () => {
      if (wrap) {
        wrap.style.overflowY = '';
      }
    };
  }, [loading, isSubModuleItem]);

  // 筛选触发的condition修改，重置表格状态
  useEffect(() => {
    if (isMountFilterChangeRef.current) {
      isMountFilterChangeRef.current = false;
    } else {
      if (filterResult && filterKeyLists) {
        updateCondition((d) => {
          filterKeyLists.forEach((filterKey) => {
            const resKey = specialParamKeyMap.get(filterKey as TemplateKeyEnums) || filterKey;
            d[filterKey] = filterResult[resKey as keyof (ScreenParamsType | CompanyScreenParamsType)];
          });
        });
        resetTableStatus();
      }
    }
  }, [refreshPageKey, filterKeyLists, filterResult, specialParamKeyMap, resetTableStatus, updateCondition]);

  // 更新store
  useEffect(() => {
    dispatch((d) => {
      d.curModuleFirstLoading = firstLoading;
    });
  }, [firstLoading, dispatch]);

  // 发送请求
  useEffect(() => {
    if (
      Object.keys(condition).some((key) => paramsNeedLists.some((needKey) => needKey.includes(key)) && condition[key])
    ) {
      updateColumnsProps((d) => {
        d.restParams = condition;
      });
      if (prevConditionRef.current !== JSON.stringify(condition)) {
        prevConditionRef.current = JSON.stringify(condition);
        setLoading(true);
        run({
          ...condition,
        });
      }
    }
  }, [run, paramsNeedLists, condition, updateColumnsProps]);

  // 重新加载
  const handleReload = useMemoizedFn(() => {
    run({
      ...condition,
    });
  });

  // 重置筛选
  const handleClear = useMemoizedFn(() => {
    onClearFilter();
    resetTableStatus();
  });

  return createElement(currentModule.wrapperComponent, {
    [currentModule.title]: title,
    iconPath,
    filterDom: filter,
    contentDom: tableContainer,
    loading: loading,
    firstLoading,
    error,
    isEmpty: !firstLoading && !totalCount,
    hasDefaultFilter,
    onReload: handleReload,
    onClear: handleClear,
  });
};

export default memo(ModuleTemplate);
