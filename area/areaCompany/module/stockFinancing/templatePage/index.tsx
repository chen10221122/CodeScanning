import { useEffect, useMemo, useRef } from 'react';

import { useMemoizedFn, useSize } from 'ahooks';
import { Table } from 'antd';
import cn from 'classnames';
import dayjs from 'dayjs';
import { pick } from 'lodash';

import { DetailModalTypeEnum } from '@pages/area/areaCompany/components/financingModal/type';
import Next from '@pages/area/areaF9/components/next';
import { useParams } from '@pages/area/areaF9/hooks';
import { isCity, isCounty, isProvince } from '@pages/area/areaF9/utils';

import { Icon, Pagination } from '@/components';
import { Empty, Spin, Table as DzhTable } from '@/components/antd';
import BackTop from '@/components/backTop';
import ExportDoc, { EXPORT } from '@/components/exportDoc';
import DetailModal from '@/pages/area/areaCompany/components/financingModal';
import { formatNumber } from '@/utils/format';
import { shortId } from '@/utils/share';

import { Provider, useConditionCtx } from './context';
import Filter from './filter';
import S from './outer.module.less';
import tableStyle from './style.module.less';
import { TableColumnType, TableInfoMap } from './type';
import useScreen from './useScreen';
import useTableColumns from './useTableColumns';
import useTableData, { LoadType } from './useTableData';

export const [headHeight] = [83];
interface ContentProps {
  type: TableColumnType;
  /** 表格接口调用函数 */
  apiName?: any;
  dataFormatFn?: any[];
  /** 表格备注信息 */
  tableConf?: { remark: string };
  headerFixConfig?: {
    screenTop: number | string;
    tableTop: number | string;
  };
  [key: string]: any;
}

function Content({
  tabFilterCache,
  setTabFilterCache,
  type,
  dataFormatFn,
  tableConf,
  headerFixConfig = { screenTop: 43, tableTop: headHeight },
  stickyContainerRef,
  className,
}: ContentProps) {
  // 获取地区代码
  const { regionCode } = useParams();

  const isInitRef = useRef(false);
  const containerRef = useRef(null);
  const screenRef = useRef(null);
  const {
    state: { condition, error, visible, detailModalConfig },
    update,
  } = useConditionCtx();

  const size = useSize(screenRef);
  const offsetHeaderTop = useMemo(() => {
    if (size?.height && headerFixConfig?.screenTop) return Number(size.height) + Number(headerFixConfig.screenTop);
    return headerFixConfig.tableTop;
  }, [headerFixConfig.screenTop, headerFixConfig.tableTop, size?.height]);
  // 各表格不同配置信息
  const { apiName, exportInfo, defaultCondition } = TableInfoMap.get(type) || {
    apiName: '',
    exportInfo: { filename: '' },
    defaultCondition: {},
  };
  const { screenConfig, handleMenuChange } = useScreen({ type, tabFilterCache, setTabFilterCache });
  const { tableData, summaryData, handleTableChange, current, total, loading, onPageChange, loadType } = useTableData({
    apiName,
    dataFormatFn,
  });
  useEffect(
    function initCondition() {
      if (defaultCondition && !condition && !isInitRef.current && screenConfig && regionCode) {
        isInitRef.current = true;
        update((d) => {
          d.isFirstLoad = true;
          let provinceCode = '',
            cityCode = '',
            countyCode = '';
          if (isProvince(regionCode)) {
            provinceCode = regionCode;
          }
          if (isCity(regionCode)) {
            cityCode = regionCode;
          }
          if (isCounty(regionCode)) {
            countyCode = regionCode;
          }

          d.condition = {
            ...defaultCondition,
            ...pick(tabFilterCache || {}, ['startYear', 'endYear']),
            provinceCode,
            cityCode,
            countyCode,
          };
        });
      }
    },
    [condition, defaultCondition, regionCode, screenConfig, tabFilterCache, update],
  );

  // 重置
  const handleReset = useMemoizedFn(() => {
    isInitRef.current = false;
    update((d) => {
      d.condition = undefined;
    });
  });

  const exportParams = useMemo(() => {
    return {
      condition: {
        ...condition,
      },
      module_type: exportInfo?.module_type,
      filename: exportInfo.filename + dayjs().format('YYYYMMDD'),
      type: EXPORT,
    };
  }, [condition, exportInfo.filename, exportInfo?.module_type]);

  const { columns, tableScrollWidth, withModalCell } = useTableColumns({ tableType: type, tableData });

  /**
   * 表格加载控制
   * 分页加载和筛选加载loading区分
   */
  const loadingIndicator = useMemo(() => {
    if (!loading || loadType !== LoadType.TABLE) return false;
    return {
      wrapperClassName: tableStyle.tableLoading,
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
  }, [loadType, loading]);
  const closeModal = useMemoizedFn(() => {
    update((d) => {
      d.visible = false;
    });
  });
  return (
    <>
      <div className={cn(S.templateWrapper, className)} ref={containerRef}>
        <div className={S.templateContent}>
          <div ref={screenRef} className={cn(S.menu)} style={{ top: headerFixConfig.screenTop }}>
            {screenConfig && condition && error?.returncode !== 500 ? (
              <Filter screenConfig={screenConfig} handleMenuChange={handleMenuChange} tabFilterCache={tabFilterCache} />
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
          <div className={cn(S.tableWrapper, { [S.minHeight]: !tableData.length })}>
            <Spin
              type="thunder"
              spinning={!condition || (loading && loadType !== LoadType.TABLE)}
              style={{ position: 'absolute', minHeight: '400px' }}
            >
              <div>
                {tableData.length ? (
                  <DzhTable
                    rowKey={() => shortId()}
                    type="stickyTable"
                    className={cn(tableStyle.tableStyleWrapper, 'statisticTable', {
                      [tableStyle.isLoading]: loading,
                      [tableStyle.summaryTable]: summaryData,
                    })}
                    onChange={handleTableChange}
                    sticky={{
                      offsetHeader: offsetHeaderTop,
                      getContainer: () => stickyContainerRef.current || containerRef.current || document.body,
                    }}
                    noSelectRow={true}
                    loading={loadingIndicator}
                    columns={columns}
                    showSorterTooltip={false}
                    dataSource={tableData}
                    scroll={{ x: tableScrollWidth || '100%' }}
                    summary={() => {
                      const d = summaryData;
                      return d ? (
                        <Table.Summary fixed>
                          <Table.Summary.Row>
                            <Table.Summary.Cell align={'center'} index={0}></Table.Summary.Cell>
                            <Table.Summary.Cell align={'center'} index={1}>
                              合计
                            </Table.Summary.Cell>
                            <Table.Summary.Cell align={'right'} index={2}>
                              {d.financingAmount?.financingAmount}
                            </Table.Summary.Cell>
                            <Table.Summary.Cell align={'right'} index={3}>
                              {d.gdp}
                            </Table.Summary.Cell>
                            <Table.Summary.Cell align={'right'} index={4}>
                              {d.rate}
                            </Table.Summary.Cell>
                            <Table.Summary.Cell align={'right'} index={5}>
                              {withModalCell({
                                val: d.aShareIPO.amount,
                                modalType: DetailModalTypeEnum.StockAIpo,
                                row: d,
                                defaultCondition: { equityType: 'IPO' },
                              })}
                            </Table.Summary.Cell>
                            <Table.Summary.Cell align={'right'} index={6}>
                              {d.aShareIPO.financingAmount}
                            </Table.Summary.Cell>
                            <Table.Summary.Cell align={'right'} index={7}>
                              {withModalCell({
                                val: d.aShareRefinance.amount,
                                modalType: DetailModalTypeEnum.StockARefinance,
                                row: d,
                                defaultCondition: { equityType: '公开增发,定向增发,配股' },
                              })}
                            </Table.Summary.Cell>
                            <Table.Summary.Cell align={'right'} index={8}>
                              {d.aShareRefinance.financingAmount}
                            </Table.Summary.Cell>
                            <Table.Summary.Cell align={'right'} index={9}>
                              {withModalCell({
                                val: d.newThreeIncrease.amount,
                                modalType: DetailModalTypeEnum.NewThirdAdd,
                                row: d,
                                defaultCondition: {},
                              })}
                            </Table.Summary.Cell>
                            <Table.Summary.Cell align={'right'} index={10}>
                              {d.newThreeIncrease.financingAmount}
                            </Table.Summary.Cell>
                            <Table.Summary.Cell align={'right'} index={11}>
                              {withModalCell({
                                val: d.ventureCapital.amount,
                                modalType: DetailModalTypeEnum.VC,
                                row: d,
                                defaultCondition: {},
                              })}
                            </Table.Summary.Cell>
                            <Table.Summary.Cell align={'right'} index={12}>
                              {d.ventureCapital.financingAmount}
                            </Table.Summary.Cell>
                          </Table.Summary.Row>
                        </Table.Summary>
                      ) : null;
                    }}
                  />
                ) : null}
                {total > 50 ? (
                  <div className={S.pagerWrapper}>
                    <Pagination total={total} current={current} pageSize={50} onChange={onPageChange} />
                  </div>
                ) : null}
                {total > 0 && tableConf?.remark ? <div className={S.remark}>{tableConf.remark}</div> : null}
              </div>
              {condition && !loading && tableData.length < 1 ? (
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
        {!loading ? <Next /> : null}
      </div>

      <BackTop target={() => stickyContainerRef.current || containerRef.current || document.body} />
      <DetailModal
        visible={visible || false}
        closeModal={closeModal}
        detailModalConfig={detailModalConfig}
        containerRef={containerRef}
      />
    </>
  );
}
export default function FinancingTemplate({ pageConfig }: { pageConfig: ContentProps }) {
  return (
    <Provider>
      <Content {...pageConfig} />
    </Provider>
  );
}
