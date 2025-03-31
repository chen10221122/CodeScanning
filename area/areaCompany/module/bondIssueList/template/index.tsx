import { useMemo, useEffect, FC, useRef } from 'react';
// import ReactDOM from 'react-dom';

import { useSafeState, useSize } from 'ahooks';
import { Service } from 'ahooks/lib/useRequest/src/types';
import dayjs from 'dayjs';
import { slice, map } from 'lodash';
import styled from 'styled-components';

import Table from '@/components/columnPlanTable';
import { ClumnProps } from '@/components/columnPlanTable/useTableColumns';
import Filter from '@/pages/area/areaCompany/components/filterInfo/filterWrap';
import { CONTIAINERID } from '@/pages/area/areaCompany/components/moduleTemplate/config';
import TableWithLoading from '@/pages/area/areaCompany/components/moduleTemplate/tableWithLoading';
import SingleModuleWrapper from '@/pages/area/areaCompany/components/moduleWrapper/singleModuleWrapper';
import { REGIONAL_PAGE } from '@/pages/area/areaCompany/configs';
import { PAGESIZE } from '@/pages/area/areaCompany/const';
import CumRightModal from '@/pages/area/areaCompany/module/bondIssueList/components/cumRightModal';
import useFilter from '@/pages/area/areaCompany/module/bondIssueList/hooks/useFilter';
import { useDispatch, useSelector } from '@/pages/area/areaF9/context';
import { useParams } from '@/pages/area/areaF9/hooks';
import { useLoading } from '@/utils/hooks';

import { BondIssueModuleCode, FILTER_DEFAULT_HEIGHT } from '../constants';
import useTableData from './useTableData';

export interface ModuleTemplateProps {
  /** 标题 */
  title: string;
  /** 表格分页的条数，默认是50条 */
  pageSize?: number;
  /** 筛选组件需要的pageId */
  pageType: REGIONAL_PAGE;
  /** 默认列表请求参数 */
  defaultCondition: Record<string, any>;
  /** 列表请求api */
  listApiFunction: Service<Promise<Record<string, any>>, any[]>;
  /** 获取表格columns的hook */
  useColumnsHook: (props: any) => Record<string, any>[];
  /** 导出的moduleType */
  moduleType: string;
  /** 列缓存的moduleCode */
  moduleCode: BondIssueModuleCode;
}

const FinanceModuleTemplate: FC<ModuleTemplateProps> = ({
  title,
  pageType,
  pageSize,
  moduleType,
  moduleCode,
  defaultCondition,
  listApiFunction,
  useColumnsHook,
}) => {
  const dispatch = useDispatch();

  const screenRef = useRef(null);

  const [visualColumn, onSetVisualColumn] = useSafeState([]);

  const { code: regionCode } = useParams();

  const { cumRightModalVisable, areaInfo } = useSelector((store) => ({
    areaInfo: store.areaInfo,
    cumRightModalVisable: store?.cumRightModalVisable,
  }));

  /** 表格默认参数 */
  const initCondition = useMemo(
    () => ({
      from: 0,
      regionCode,
      size: PAGESIZE,
      sortKey: 'issueDateStart',
      sortRule: 'desc',
      ...defaultCondition,
    }),
    [regionCode, defaultCondition],
  );

  /** 表格数据处理hook */
  const {
    param,
    error,
    pager,
    loading,
    tableData,
    keywordRef,
    renderFilter,
    screenValues,
    handleClear,
    handleReload,
    handMenuChange,
    handleSortChange,
    handlePageChange,
    handFilterClear,
    handFilterSearch,
    handleExpirationChange,
  } = useTableData({ pageType, pageSize, initCondition, listApiFunction });

  const columns = useColumnsHook({ curPage: pager.current, keyword: keywordRef.current });

  /** 页面基础筛选 */
  const { screenLoading, screenKey, menuOption } = useFilter(pageType);

  const isLoading = useLoading(screenLoading, loading);

  useEffect(() => {
    dispatch((draft) => {
      draft.curModuleFirstLoading = isLoading;
    });
  }, [isLoading, dispatch]);

  const size = useSize(screenRef);
  const headFixedPosition = useMemo(() => {
    if (size?.height) {
      const nowSize = Number(size.height) + 12;
      if (nowSize > FILTER_DEFAULT_HEIGHT) return { isWrap: true, size: nowSize };
    }
    return { isWrap: false, size: FILTER_DEFAULT_HEIGHT };
  }, [size?.height]);

  /** 筛选项 */
  const filterMenu = useMemo(() => {
    return (
      renderFilter && (
        <div ref={screenRef}>
          <Filter
            isIncludeBondMarket
            screenKey={screenKey}
            screenValues={screenValues}
            screenMenu={menuOption}
            onFilterChange={handMenuChange}
            onFilterSearch={handFilterSearch}
            onFilterClear={handFilterClear}
            dynamicDropdownTop={headFixedPosition.isWrap ? 72 : 38}
            filterSearchKey={'non-financial-bond-issuelist'}
            onIncludeBondMarketChange={handleExpirationChange}
            exportInfo={{
              moduleType,
              usePost: false,
              total: pager.total,
              pageParams: {
                ...param,
                /** 动态列导出入参，去除了原始列的首尾(序号和操作列) */
                dynamicIndicators: map(slice(visualColumn, 1, -1), (col: ClumnProps) => col.key).toString(),
              },
              filename: `${areaInfo?.regionName}债券发行列表${dayjs().format('YYYY-MM-DD')}`,
            }}
          />
        </div>
      )
    );
  }, [
    renderFilter,
    screenKey,
    screenValues,
    menuOption,
    handMenuChange,
    handFilterSearch,
    handFilterClear,
    headFixedPosition.isWrap,
    handleExpirationChange,
    moduleType,
    pager.total,
    param,
    visualColumn,
    areaInfo?.regionName,
  ]);

  /** 节点domId集合 */
  const DOM_ID = useMemo(
    () => ({
      tableContent: `area-company-${title}`,
      tableAfter: `table-after-dom-${title}`,
    }),
    [title],
  );

  const tableContainer = useMemo(() => {
    const { tableContent, tableAfter } = DOM_ID;
    return (
      <TableWithLoading
        noDelay
        loading={loading}
        hasPagination={false}
        tableAfterId={tableAfter}
        tableContentId={tableContent}
        scrollDom={document.getElementById(CONTIAINERID)}
        containerDom={document.getElementById('area-company-container')}
      >
        <Table
          pager={pager}
          hasSettingColumn
          loading={loading}
          columns={columns}
          pageCode={regionCode}
          tableData={tableData}
          headFixedPosition={headFixedPosition.size}
          moduleCode={moduleCode}
          targetSelector={CONTIAINERID}
          handleSort={handleSortChange}
          onChangePage={handlePageChange}
          onSetVisualColumn={onSetVisualColumn}
        />
      </TableWithLoading>
    );
  }, [
    DOM_ID,
    loading,
    pager,
    columns,
    regionCode,
    tableData,
    headFixedPosition,
    moduleCode,
    handleSortChange,
    handlePageChange,
    onSetVisualColumn,
  ]);

  return (
    <ModuleMain>
      <SingleModuleWrapper
        title={title}
        error={error}
        isEmpty={false}
        loading={loading}
        isFilterOverFlow
        onClear={handleClear}
        onReload={handleReload}
        filterDom={filterMenu as React.ReactElement}
        contentDom={tableContainer}
      />
      <CumRightModal
        onCancel={() => {
          dispatch((draft) => {
            draft.cumRightModalVisable = false;
          });
        }}
        visible={cumRightModalVisable}
      />
    </ModuleMain>
  );
};

export default FinanceModuleTemplate;

const ModuleMain = styled.div`
  .ant-table-tbody > tr > td,
  .ant-table-thead > tr > th {
    padding: 6px 12px;
  }

  .ownershipType {
    color: #025cdc;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
`;
