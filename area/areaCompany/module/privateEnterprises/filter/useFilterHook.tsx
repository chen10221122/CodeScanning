import { useMemo } from 'react';

import Filter from '@/pages/area/areaCompany/components/filterInfo';
import { UseFilterProps } from '@/pages/area/areaCompany/components/moduleTemplate';
import { useSelector } from '@/pages/area/areaF9/context';
import { useParams } from '@/pages/area/areaF9/hooks';
import { useImmer } from '@/utils/hooks';

import useFilterData from './useFilterData';

const defaultFilterStatus = {
  loading: true,
  error: false,
};

const useTemplateFilter = ({ title, exportInfo, refreshPageKey, listApiFunction }: UseFilterProps) => {
  const { regionCode } = useParams();
  const { areaInfo, branchId } = useSelector((store) => ({
    areaInfo: store.areaInfo,
    branchId: store.curNodeBranchId,
    branchName: store.curNodeBranchName,
    areaTreeLoading: store.areaTreeLoading,
    industryLoading: store.industryLoading,
  }));

  /** 筛选首次加载 */
  const [filterStatus, updateFilterStatus] = useImmer<typeof defaultFilterStatus>(defaultFilterStatus);
  // const branchidRef = useRef('');

  /** 切换节点时重置筛选loading */
  // useEffect(() => {
  //   if (branchidRef.current !== branchId) {
  //     updateFilterStatus((oldStatus: any) => {
  //       oldStatus.loading = defaultFilterStatus.loading;
  //       oldStatus.error = defaultFilterStatus.loading;
  //     });
  //     branchidRef.current = branchId;
  //   }
  // }, [branchId, updateFilterStatus]);

  /** 处理筛选的逻辑 */
  const { onClearFilter, filterResult, ...restFilterInfo } = useFilterData({
    regionCode,
    refreshPageKey: refreshPageKey!,
    regionLevel: areaInfo?.level || 0,
    onChangeFilterStatus: updateFilterStatus,
  });

  const filter = useMemo(() => {
    if (restFilterInfo) {
      const {
        // screenValues,
        switchChecked,
        onFilterChange,
        onClearSearch,
        onSearch,
        filterMenu,
        screenKey,
        onSwitchChange,
      } = restFilterInfo;

      return (
        <Filter
          // screenValues={screenValues}
          onFilterChange={onFilterChange}
          onClearSearch={onClearSearch}
          onSearch={onSearch}
          exportInfo={exportInfo}
          // rangeSelectInfo={rangeSelectInfo}
          screenMenu={filterMenu}
          screenKey={screenKey}
          isRepeatSwitch={true}
          repeatSwitchChecked={switchChecked}
          onSwitchChange={onSwitchChange as any}
          listApiFunction={listApiFunction}
          searchDataKey={`${branchId}_${title}`}
        />
      );
    } else {
      return null;
    }
  }, [restFilterInfo, exportInfo, listApiFunction, branchId, title]);

  return {
    // filterStatus,
    filter: filterStatus.loading ? null : filter,
    filterFistLoading: filterStatus.loading,
    filterResult,
    onClearFilter,
  };
};

export default useTemplateFilter;
