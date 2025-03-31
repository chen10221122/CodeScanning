import dayjs from 'dayjs';

import { getListedOrIssuseList } from '@/pages/area/areaCompany/api/regionFinancingApi';
import DetailModal from '@/pages/area/areaCompany/components/detailModal';
import ModuleTemplate from '@/pages/area/areaCompany/components/moduleTemplate';
import ModuleWrapper from '@/pages/area/areaCompany/components/moduleWrapper';
import { REGIONAL_PAGE } from '@/pages/area/areaCompany/configs';
import { PAGESIZE } from '@/pages/area/areaCompany/const';
import { useSelector } from '@/pages/area/areaF9/context';

import useGetColumns from './useColumns';
// import useDetailColumns from './useDetailColumns';
import useDetailModal from './useDetailModal';

const filterKeyLists = [
  'enterpriseNature',
  'establishmentDate',
  'industryCodeLevel1',
  'industryCodeLevel2',
  'industryCodeLevel3',
  'industryCodeLevel4',

  'listingOrIssuance',
  'actualControllerRatio',
  'firstShareholderRatio',

  'regionCode',
  'registeredCapital',
  'text',
];

const defaultCdt = {
  from: 0,
  sort: 'marketCap:desc,totalShareCapital:desc',
  size: PAGESIZE,
  treeNode: '900841',
};

const str = `.ant-table-tbody { tr{
  td:nth-child(5) { padding: 0 !important; }
  td:nth-child(6) { padding: 0 !important; }
  td:nth-child(7) { padding: 0 !important; }
  td:nth-child(8) { padding: 0 !important; }
}}`;

const paramsNeedLists = ['enterpriseNature', 'releaseStatus', 'text', 'regionCode', 'treeNode'];

const ListedEnterprise = () => {
  const areaInfo = useSelector((store) => store.areaInfo);

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

  return (
    <ModuleWrapper title="上市企业">
      <ModuleTemplate
        title="上市企业"
        listApiFunction={getListedOrIssuseList}
        pageType={REGIONAL_PAGE.COMPANY_LISTED_ENTERPRISE}
        defaultCondition={defaultCdt}
        filterKeyLists={filterKeyLists}
        paramsNeedLists={paramsNeedLists}
        moduleType="region_listed_enterprise_list"
        useColumnsHook={useColumns}
        specialStyleStr={str}
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
            module_type: 'region_listed_enterprise_detail',
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

export default ListedEnterprise;
