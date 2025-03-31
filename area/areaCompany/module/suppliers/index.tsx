import { FC, useMemo } from 'react';

import dayjs from 'dayjs';

import { getSuppliersListData } from '@/pages/area/areaCompany/api/regionFinancingApi';
import DetailModal from '@/pages/area/areaCompany/components/detailModal';
import ModuleTemplate from '@/pages/area/areaCompany/components/moduleTemplate';
import ModuleWrapper from '@/pages/area/areaCompany/components/moduleWrapper';
import { REGIONAL_PAGE } from '@/pages/area/areaCompany/configs';
import { useSelector } from '@/pages/area/areaF9/context';
import { useParams } from '@/pages/area/areaF9/hooks';

import { defaultCondition, filterKeyLists, pageModuleMap, specialParamKeyMap } from './config';
import useGetColumns from './useColumns';
// import useDetailColumns from './useDetailColumns';
import useDetailModal from './useDetailModal';

const Suppliers: FC<any> = () => {
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
    setVisible,
    handleOpenModal,
    handleTableChange,
    handlePageChange,
  } = useDetailModal();

  // const columns = useDetailColumns({ curPage: page });

  const useColumns = useGetColumns(handleOpenModal);

  const curModule = useMemo(() => {
    const moduleInfo = pageModuleMap.has(module) ? pageModuleMap.get(module)! : pageModuleMap.get('central')!;
    return {
      defaultCondition: { ...defaultCondition, treeNode: moduleInfo.treeNode },
      pageType: moduleInfo.pageType,
      title: moduleInfo.title,
    };
  }, [module]);

  return (
    <ModuleWrapper title={curModule.title}>
      <ModuleTemplate
        title={curModule.title}
        listApiFunction={getSuppliersListData}
        pageType={curModule.pageType as REGIONAL_PAGE}
        defaultCondition={curModule.defaultCondition}
        filterKeyLists={filterKeyLists}
        moduleType="region_supplier_list"
        useColumnsHook={useColumns}
        specialParamKeyMap={specialParamKeyMap}
        refreshPageKey={module}
      />
      <DetailModal
        visible={visible}
        setVisible={setVisible}
        count={count}
        title={title}
        tableConfig={{
          dataSource,
          columns,
        }}
        exportConfig={{
          condition: {
            ...condition,
            from: 0,
            size: 1000,
            module_type: 'region_supplier_detail',
          },
          filename: `${areaInfo?.regionName || ''}-${exportTitle}-${dayjs().format('YYYY.MM.DD')}`,
        }}
        loading={loading}
        page={page}
        onPageChange={handlePageChange}
        onTableChange={handleTableChange}
      />
    </ModuleWrapper>
  );
};

export default Suppliers;
