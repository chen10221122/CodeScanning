/**
 * 债券融资-多级表头页面
 */
import { useMemo, useEffect, FC } from 'react';

import { useMemoizedFn } from 'ahooks';
import { Service } from 'ahooks/lib/useRequest/src/types';
import dayJs from 'dayjs';

import { Table } from '@/components/antd';
import Pagination from '@/components/Pagination';
import DetailModal from '@/pages/area/areaCompany/components/detailModal';
import Filter from '@/pages/area/areaCompany/components/filterInfo';
import { CONTIAINERID } from '@/pages/area/areaCompany/components/moduleTemplate/config';
import TableWithLoading, { LoadingTips } from '@/pages/area/areaCompany/components/moduleTemplate/tableWithLoading';
import SingleModuleWrapper from '@/pages/area/areaCompany/components/moduleWrapper/singleModuleWrapper';
import { REGIONAL_PAGE } from '@/pages/area/areaCompany/configs';
import { PAGESIZE, TABLESTICKY } from '@/pages/area/areaCompany/const';
import useBondFinancialFilter from '@/pages/area/areaCompany/hooks/useBondFinancialFilter';
import { useDispatch, useSelector } from '@/pages/area/areaF9/context';
import { useParams } from '@/pages/area/areaF9/hooks';
import { useLoading } from '@/utils/hooks';

import { getDetailModalType, getBottomRemark } from './config';
import useDetailColumns from './hooks/useDetailColumns';
import useDetailData from './hooks/useDetailData';
import useTableData from './hooks/useTableData';

export interface ModuleTemplateProps {
  /** 标题 */
  title: string;
  /** 表格分页的条数，默认是50条 */
  pageSize?: number;
  /** 筛选组件需要的pageid */
  pageType: REGIONAL_PAGE;
  /** 保存搜索记录的key值 */
  searchDataKey?: string;
  /** 默认列表请求参数 */
  defaultCondition: Record<string, any>;
  /** 明细弹窗导出的moduleType */
  moduleType?: string;
  /** 列表请求api */
  listApiFunction: Service<Promise<Record<string, any>>, any[]>;
  /** 明细列表请求api */
  detailListApiFunction: Service<Promise<Record<string, any>>, any[]>;
  /** 获取表格columns的hook */
  useColumnsHook: (props: any) => Record<string, any>;
  /** 打开明细弹窗 */
  onOpenModal?: Function;
}

const FinanceModuleTemplate: FC<ModuleTemplateProps> = (props) => {
  const dispatch = useDispatch();
  const { code: regionCode } = useParams();
  const { areaInfo, areaTreeLoading } = useSelector((store) => ({
    areaInfo: store.areaInfo,
    areaTreeLoading: store.areaTreeLoading,
  }));

  const {
    title,
    pageType,
    pageSize,
    defaultCondition,
    moduleType,
    searchDataKey,
    listApiFunction,
    useColumnsHook,
    detailListApiFunction,
    onOpenModal,
  } = props;

  /** 表格默认参数 */
  const initCondition = useMemo(
    () => ({
      regionCode,
      ...defaultCondition,
    }),
    [regionCode, defaultCondition],
  );

  // 页面筛选
  const { screenError, screenLoading, menuOption, screenReload } = useBondFinancialFilter(pageType);

  // 页面表格数据
  const {
    param,
    updateParam,
    loading,
    tableData,
    error,
    pageInfo: { curPage, totalCount },
    screenKey,
    screenValues,
    handleSearch,
    handleMenuChange,
    handleChange,
    handlePageChange,
    handleClear,
    handleReload,
  } = useTableData({ pageType, pageSize, initCondition, listApiFunction });

  // 弹窗数据
  const {
    title: detailTitle,
    condition,
    visible,
    loading: detailLoading,
    count,
    curPage: detailCurPage,
    dataSource,
    setVisible,
    handleOpenModal,
    handleTableChange,
    handlePageChange: handleDetailPageChange,
  } = useDetailData({ pageType, detailListApiFunction });

  const detailColumns = useDetailColumns({ curPage: detailCurPage, pageType });

  const domId = useMemo(
    () => ({
      tableContent: `area-company-${title}`,
      tableAfter: `table-after-dom-${title}`,
    }),
    [title],
  );

  /** 筛选项 */
  const filter = useMemo(() => {
    const { moduleType, types } = getDetailModalType(pageType);
    return (
      <Filter
        screenKey={screenKey}
        screenValues={screenValues}
        screenMenu={menuOption}
        onFilterChange={handleMenuChange}
        searchDataKey={searchDataKey}
        onSearch={handleSearch}
        onClearSearch={handleSearch}
        exportInfo={{
          total: totalCount,
          moduleType,
          usePost: false,
          pageParams: {
            ...param,
            from: 0,
            size: 10000,
            exportFlag: true,
            pageType: types,
            sheetNames: { '0': `${areaInfo?.regionName || ''}-${title}` },
          },
          filename: `${areaInfo?.regionName || ''}-${title}-${dayJs().format('YYYY.MM.DD')}`,
        }}
      />
    );
  }, [
    pageType,
    screenKey,
    screenValues,
    menuOption,
    totalCount,
    param,
    areaInfo?.regionName,
    title,
    searchDataKey,
    handleSearch,
    handleMenuChange,
  ]);

  const { originColumns = [], headLoading = false } = useColumnsHook({
    id: domId.tableContent,
    pageType,
    pageParams: param,
    titleArr: tableData?.[0]?.valueList,
    updateParam,
    handleOpenModal: onOpenModal || handleOpenModal,
  });
  const isLoading = useLoading(screenLoading, loading, headLoading, areaTreeLoading);

  useEffect(() => {
    dispatch((d) => {
      d.curModuleFirstLoading = isLoading;
    });
  }, [isLoading, dispatch]);

  const { columns, tableScroll } = useMemo(() => {
    const totalWidth = (originColumns as Record<string, any>[]).reduce(
      (prev, current, idx) => {
        // 序号列和固定列的宽度总和
        if (current.fixed || !idx) prev.fixedW += current.width || 0;
        else {
          // 双表头的宽度总和
          if (current.children) {
            prev.width += current.children.reduce((total: number, item: any) => (total += item.width), 0);
          } else {
            // 单表头但列不固定的宽度总和
            prev.width += current.width || 0;
          }
        }
        return prev;
      },
      { fixedW: 0, width: 0 },
    );
    return {
      columns: (originColumns as Record<string, any>[]).map((item, idx) => ({
        ...item,
        ...(item?.children
          ? {
              children: item.children.map((d: any) => ({
                ...d,
                width: idx ? `${((d.width / totalWidth.width) * 100).toFixed(2)}%` : d.width,
              })),
            }
          : {
              width: idx ? `${((item.width / totalWidth.width) * 100).toFixed(2)}%` : item.width,
            }),
      })),
      // fixedW是序号列和固定列宽度
      tableScroll: totalWidth.width + totalWidth.fixedW,
    };
  }, [originColumns]);

  /** 表格 */
  const tableContainer = useMemo(() => {
    const { tableContent, tableAfter } = domId;
    return (
      <TableWithLoading
        tableContentId={tableContent}
        tableAfterId={tableAfter}
        scrollDom={document.getElementById(CONTIAINERID)}
        containerDom={document.getElementById('area-company-container')}
        loading={loading}
        hasPagination={totalCount > PAGESIZE}
      >
        <>
          <Table
            key={'tableKey'}
            isStatic
            className="double-table"
            showSorterTooltip={false}
            type="stickyTable"
            dataSource={tableData}
            columns={columns}
            sticky={{
              offsetHeader: TABLESTICKY,
              getContainer: () => document.getElementById(CONTIAINERID) || document.body,
            }}
            scroll={{
              x: tableScroll,
            }}
            sortDirections={['descend', 'ascend']}
            onChange={handleChange}
            loading={
              loading
                ? {
                    wrapperClassName: 'mount-table-loading',
                    tip: '加载中',
                    indicator: <LoadingTips />,
                  }
                : false
            }
          />
          {totalCount > PAGESIZE ? (
            <div className="pagination-wrapper">
              <Pagination
                current={curPage}
                pageSize={PAGESIZE}
                total={totalCount}
                onChange={handlePageChange}
                align={'left'}
              />
            </div>
          ) : null}
        </>
      </TableWithLoading>
    );
  }, [loading, curPage, totalCount, columns, tableData, tableScroll, domId, handleChange, handlePageChange]);

  const pageError = useMemo(() => error || screenError || columns.length < 2, [error, screenError, columns]);

  const onReload = useMemoizedFn(() => {
    if (columns.length > 1) {
      if (screenError) {
        screenReload();
      }
      handleReload();
    } else {
      window.location.reload();
    }
  });

  return (
    <>
      <SingleModuleWrapper
        title={title}
        error={pageError}
        isEmpty={false}
        loading={loading}
        onClear={handleClear}
        onReload={onReload}
        filterDom={filter}
        contentDom={tableContainer}
      />

      {onOpenModal ? null : (
        <DetailModal
          visible={visible}
          setVisible={setVisible}
          count={count}
          title={detailTitle}
          tableConfig={{
            dataSource,
            columns: detailColumns,
            restConfig: {
              sortDirections: ['descend', 'ascend'],
            },
          }}
          exportConfig={{
            condition: {
              ...condition,
              from: 0,
              size: 1000,
              module_type: moduleType,
            },
            filename: `${detailTitle}-${dayJs().format('YYYY.MM.DD')}`,
          }}
          loading={detailLoading}
          bottomRemark={getBottomRemark(pageType)}
          page={detailCurPage}
          onPageChange={handleDetailPageChange}
          onTableChange={handleTableChange}
        />
      )}
    </>
  );
};

export default FinanceModuleTemplate;
