import { useEffect, useMemo, useRef } from 'react';

import { useMemoizedFn } from 'ahooks';
import cn from 'classnames';
import { pick } from 'lodash';

import useStatisticTableData, { LoadType } from '@pages/area/areaFinancing/hooks/useStatisticTableData';

import { DEFAULT_PAGE_BOTTOM_MARGIN, DEFAULT_PAGE_TOP_MARGIN, getConfig } from '@/app';
import { Icon, Pagination } from '@/components';
import { Empty, Spin, Table as DzhTable } from '@/components/antd';
import ExportDoc, { EXPORT } from '@/components/exportDoc';
// import DzhTable from '@/components/tableFinance';
import { useConditionCtx } from '@/pages/area/areaFinancing/components/commonLayout/context';
import Filter from '@/pages/area/areaFinancing/components/commonTemplate/filter';
import DetailModal from '@/pages/area/areaFinancing/components/detailModal';
import NextNode from '@/pages/area/areaFinancing/components/nextNode';
import { useCtx } from '@/pages/area/areaFinancing/context';
import { formatNumber } from '@/utils/format';
import { shortId } from '@/utils/share';

import tableStyle from './style.module.less';

import S from '@/pages/area/areaFinancing/style.module.less';

export const [headHeight, screenHeight] = [83, 43];

interface ContentProps {
  defaultCondition: Record<string, any>;
  columns: any[];
  screenConfig: any[];
  /** 是否有额外筛选项 */
  extraMenu?: boolean;
  handleMenuChange: any;
  /** 表格接口调用函数 */
  apiName?: any;
  dataFormatFn: any[];
  /** 表格备注信息 */
  tableConf?: { remark: string };
  /** 导出信息 */
  exportInfo: {
    filename?: string;
    sheetIndex?: number | string;
  };
  headerFixConfig?: {
    screenTop: number | string;
    tableTop: number | string;
  };
  scrollX?: number;
}

function Content({
  defaultCondition,
  columns,
  screenConfig,
  handleMenuChange,
  apiName,
  dataFormatFn,
  extraMenu,
  tableConf,
  exportInfo = {},
  scrollX,
  headerFixConfig = { screenTop: screenHeight, tableTop: headHeight },
}: ContentProps) {
  const isInitRef = useRef(false);
  const {
    state: { condition, error, tabFilterCache },
    update,
  } = useConditionCtx();
  const {
    state: { fullLoading, wrapperRef },
  } = useCtx();
  useEffect(
    function initCondition() {
      if (defaultCondition && !condition && !isInitRef.current) {
        isInitRef.current = true;
        update((d) => {
          d.condition = Object.assign(
            defaultCondition,
            pick(tabFilterCache, ['regionCode', 'cityCode', 'countryCode', 'regionLevel']),
          );
        });
      }
    },
    [condition, defaultCondition, tabFilterCache, update],
  );
  const handleReset = useMemoizedFn(() => {
    isInitRef.current = false;
    update((d) => {
      d.condition = undefined;
    });
  });

  const exportParams = useMemo(() => {
    return {
      condition: { ...condition, sheetIndex: exportInfo.sheetIndex },
      module_type: 'Region_Finance_import',
      filename: exportInfo.filename,
      type: EXPORT,
    };
  }, [condition, exportInfo.filename, exportInfo.sheetIndex]);

  const { tableData, handleTableChange, current, total, loading, onPageChange, loadType } = useStatisticTableData({
    apiName,
    dataFormatFn,
  });

  /**
   * 表格加载控制
   * 分页加载和筛选加载loading区分
   */
  const loadingIndicator = useMemo(() => {
    if (!loading || fullLoading || loadType !== LoadType.TABLE) return false;
    return {
      wrapperClassName: cn(tableStyle.tableLoading, {
        [tableStyle.loadingPosition]: headerFixConfig.screenTop !== '43',
      }),
      indicator: (
        <span className={tableStyle.loadingTips}>
          <Icon
            style={{ width: 28, height: 28, marginTop: 20 }}
            image={require('@/assets/images/common/loading.gif')}
          />
          <span className={tableStyle.loadingText}>加载中</span>
        </span>
      ),
    };
  }, [fullLoading, headerFixConfig.screenTop, loadType, loading]);

  if (fullLoading) {
    return (
      <Spin
        type="fullThunder"
        spinning={true}
        className={S.fullLoading}
        style={{
          top: getConfig((d) => d.css.pageTopMargin, DEFAULT_PAGE_TOP_MARGIN),
          bottom: getConfig((d) => d.css.pageBottomMargin, DEFAULT_PAGE_BOTTOM_MARGIN),
        }}
      />
    );
  }

  return (
    <div className={S.templateWrapper}>
      <div className={S.templateContent}>
        <div
          className={S.menu}
          style={{ top: headerFixConfig.screenTop, paddingLeft: headerFixConfig.screenTop ? 10 : 0 }}
        >
          {screenConfig && condition && error?.returncode !== 500 ? (
            <Filter screenConfig={screenConfig} handleMenuChange={handleMenuChange} extraMenu={extraMenu} />
          ) : null}
          {condition && error?.returncode !== 500 ? (
            <div className={S.menuRight}>
              <span className={S.count}>
                共计 <span>{formatNumber(total, 0)}</span> 条
              </span>
              <ExportDoc {...exportParams} />
            </div>
          ) : null}
        </div>
        <div className={S.tableWrapper}>
          <Spin
            type="thunder"
            spinning={(!condition && !fullLoading) || (loading && !fullLoading && loadType !== LoadType.TABLE)}
            style={{ position: 'absolute', minHeight: '400px' }}
          >
            <div>
              {tableData.length && !fullLoading ? (
                //@ts-ignore
                <DzhTable
                  rowKey={() => shortId()}
                  type="stickyTable"
                  // 前端分页，只使用其功能，未使用其样式
                  pagination={{
                    current,
                    total,
                    pageSize: 50,
                  }}
                  className={cn(tableStyle.tableStyleWrapper, { [tableStyle.isLoading]: loading })}
                  onChange={handleTableChange}
                  sticky={{
                    offsetHeader: headerFixConfig.tableTop,
                    getContainer: () => wrapperRef || window,
                  }}
                  loading={loadingIndicator}
                  columns={columns}
                  showSorterTooltip={false}
                  dataSource={tableData}
                  scroll={{ x: scrollX ? scrollX : '100%' }}
                  // scroll={{ x: condition?.regionLevel === '3' ? 1034 : 1034 }}
                />
              ) : null}
              {total > 50 ? (
                <div className={S.pagerWrapper}>
                  <Pagination total={total} current={current} pageSize={50} onChange={onPageChange} />
                </div>
              ) : null}
              {total > 0 && tableConf?.remark ? <div className={S.remark}>{tableConf.remark}</div> : null}
            </div>
            {condition && !loading && !fullLoading && tableData.length < 1 ? (
              <>
                <div className={S.emptyWrapper} />
                <Empty
                  type={error?.returncode === 500 ? Empty.LOAD_FAIL_BIG : Empty.NO_DATA_IN_FILTER_CONDITION}
                  onClick={handleReset}
                />
              </>
            ) : null}
          </Spin>
        </div>
      </div>
      {!loading && condition && <NextNode />}
    </div>
  );
}
export default function CommonTemplate({ pageConfig }: any) {
  return (
    <>
      <Content
        {...pageConfig}
        columns={pageConfig.columns}
        screenConfig={pageConfig.screenConfig}
        handleMenuChange={pageConfig.handleMenuChange}
        defaultCondition={pageConfig.defaultCondition}
        apiName={pageConfig.apiName}
        dataFormatFn={pageConfig.dataFormatFn}
        headerFixConfig={pageConfig.headerFixConfig}
      />
      <DetailModal />
    </>
  );
}
