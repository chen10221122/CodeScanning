import { FC, useMemo } from 'react';

import dayjs from 'dayjs';

import { getPrivateList, PrivateListProps } from '@/pages/area/areaCompany/api/regionFinancingApi';
// import DetailModal from '@/pages/area/areaCompany/components/detailModal';
import ModuleTemplate from '@/pages/area/areaCompany/components/moduleTemplate';
import { FilterHookRet } from '@/pages/area/areaCompany/components/moduleTemplate/config';
import ModuleWrapper from '@/pages/area/areaCompany/components/moduleWrapper';
import { useSelector } from '@/pages/area/areaF9/context';
import { useParams } from '@/pages/area/areaF9/hooks';

import {
  defaultCondition,
  filterKeyLists,
  pageModuleMap,
  specialParamKeyMap,
  pageType,
  paramsNeedLists,
} from './config';
import DetailModal from './detailModal';
import useDetailModal from './detailModal/useDetailModal';
import useFilterHook from './filter/useFilterHook';
import useGetColumns from './useColumns';

const PrivateEnterprises: FC = () => {
  const areaInfo = useSelector((store) => store.areaInfo);
  const { module } = useParams();

  const {
    columns,
    exportTitle,
    title,
    condition,
    visible,
    loading,
    count,
    page,
    dataSource,
    filterMenu,
    years,
    filterStatus,
    desc,
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
  } = useDetailModal();

  const useColumns = useGetColumns(handleOpenModal);

  const curModule = useMemo(() => {
    const moduleInfo = pageModuleMap.has(module) ? pageModuleMap.get(module)! : pageModuleMap.get('global')!;
    return {
      defaultCondition: {
        ...defaultCondition,
        codeFirst: moduleInfo.treeNode,
      } as PrivateListProps,
      title: moduleInfo.title,
      treeNode: moduleInfo.treeNode,
    };
  }, [module]);

  return (
    <ModuleWrapper title={curModule.title}>
      <ModuleTemplate
        title={curModule.title}
        listApiFunction={getPrivateList}
        pageType={pageType}
        defaultCondition={curModule.defaultCondition}
        filterKeyLists={filterKeyLists}
        moduleType=""
        getModuleTypeByCondition={({ isUnRepeated }) =>
          isUnRepeated ? 'web_enterprise_rank_list' : 'un_web_enterprise_rank_list'
        }
        useColumnsHook={useColumns}
        specialParamKeyMap={specialParamKeyMap}
        refreshPageKey={curModule.treeNode}
        useFilterHook={useFilterHook as (props: unknown) => FilterHookRet}
        paramsNeedLists={paramsNeedLists}
        // UI的要求
        needColumnCustomStyle={false}
      />
      <DetailModal
        visible={visible}
        setVisible={setVisible}
        count={count}
        title={title}
        filterConfig={{
          loading: filterStatus.loading,
          filterMenu,
          years,
          desc,
          screenKey,
        }}
        tableConfig={{
          dataSource,
          columns,
        }}
        exportConfig={{
          condition: {
            ...condition,
            from: 0,
            size: 1000,
            module_type: 'web_enterprise_rank_detail',
            sheetNames: { '0': title },
          },
          filename: `${areaInfo?.regionName || ''}-${condition.tagYear}${
            condition.tagYear ? '年' : ''
          }${exportTitle}-${dayjs().format('YYYY.MM.DD')}`,
        }}
        loading={loading}
        page={page}
        onPageChange={handlePageChange}
        onTableChange={handleTableChange}
        onFilterChange={handleScreenChange}
        onYearChange={hanldeYearChange}
        onSearch={onSearch}
        onClearSearch={onClearSearch}
        onClearFilter={onClearFilter}
      />
    </ModuleWrapper>
  );
};

export default PrivateEnterprises;
