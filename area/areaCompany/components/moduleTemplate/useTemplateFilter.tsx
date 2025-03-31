/**
 * 将筛选逻辑抽离出来，便于后期迭代添加新的筛选。
 * 1. template中需要传入筛选的配置、处理函数以及状态
 */

import { useMemo, useEffect, useRef } from 'react';

import Filter from '@/pages/area/areaCompany/components/filterInfo';
import { REGIONAL_PAGE, DateRangeSelectPage } from '@/pages/area/areaCompany/configs';
import { useFilterBaseInfo } from '@/pages/area/areaCompany/hooks/useFilterBaseInfo';
import { useSelector } from '@/pages/area/areaF9/context';
import { useParams } from '@/pages/area/areaF9/hooks';
import { useImmer } from '@/utils/hooks';

import { TemplateProps } from './config';

const defaultFilterStatus = {
  loading: true,
  error: false,
};

interface FilterProps {
  /** 导出配置 */
  exportInfo: {
    total: number;
    pageParams: any;
    moduleType: string;
    usePost: boolean;
    filename?: string;
  };
}

export type UseFilterProps = Pick<TemplateProps, 'title' | 'pageType' | 'listApiFunction' | 'refreshPageKey'> &
  FilterProps;

const useTemplateFilter = ({ title, pageType, listApiFunction, refreshPageKey, exportInfo }: UseFilterProps) => {
  const { regionCode } = useParams();
  const { areaInfo, branchId } = useSelector((store) => ({
    areaInfo: store.areaInfo,
    branchId: store.curNodeBranchId,
    branchName: store.curNodeBranchName,
    areaTreeLoading: store.areaTreeLoading,
    industryLoading: store.industryLoading,
  }));

  /** 筛选首次加载 */
  const [filterStatus, setFilterStatus] = useImmer<typeof defaultFilterStatus>(defaultFilterStatus);
  const branchidRef = useRef('');

  /** 为true表示 筛选除了【下属辖区】和【国标行业】之外不走接口 */
  const noFilterRequest = useMemo(() => pageType > 4 && pageType < 9, [pageType]);

  /** 切换节点时重置筛选loading */
  useEffect(() => {
    if (branchidRef.current !== branchId) {
      setFilterStatus((oldStatus: any) => {
        oldStatus.loading = !noFilterRequest;
        oldStatus.error = false;
      });
      branchidRef.current = branchId;
    }
  }, [branchId, noFilterRequest, setFilterStatus]);

  /** 处理筛选的逻辑 */
  const { onClearFilter, filterResult, ...restFilterInfo } = useFilterBaseInfo({
    pageType,
    regionCode,
    regionLevel: areaInfo?.level || 0,
    branchId,
    tagCode: pageType === REGIONAL_PAGE.COMPANY_SCIENCE_TECHNOLOGY ? refreshPageKey : '',
    onChangeFilterStatus: setFilterStatus,
  });

  /** 筛选的第一次loading */
  const filterFistLoading = useMemo(
    () => (noFilterRequest ? false : filterStatus.loading),
    [noFilterRequest, filterStatus.loading],
  );

  const filter = useMemo(() => {
    if (restFilterInfo) {
      const {
        screenValues,
        onFilterChange,
        onClearSearch,
        onSearch,
        onRangeChange,
        filterMenu,
        screenKey,
        onSwitchChange,
      } = restFilterInfo;

      const { rangeSelectInfo, isSwitch } = DateRangeSelectPage.get(pageType) || {
        rangeSelectInfo: undefined,
        isSwitch: false,
      };
      const getTblDataApi = pageType < 5 || pageType > 7 ? listApiFunction : undefined;
      return (
        <Filter
          screenValues={screenValues}
          onFilterChange={onFilterChange}
          onClearSearch={onClearSearch}
          onSearch={onSearch}
          exportInfo={exportInfo}
          onRangeChange={onRangeChange}
          rangeSelectInfo={rangeSelectInfo}
          screenMenu={filterMenu}
          screenKey={screenKey}
          isSwitch={isSwitch}
          onSwitchChange={onSwitchChange}
          listApiFunction={getTblDataApi}
          searchDataKey={`${branchId}_${title}`}
        />
      );
    } else {
      return undefined;
    }
  }, [restFilterInfo, exportInfo, pageType, listApiFunction, branchId, title]);

  return {
    filterStatus,
    filter,
    filterFistLoading,
    filterResult,
    onClearFilter,
  };
};

export default useTemplateFilter;
