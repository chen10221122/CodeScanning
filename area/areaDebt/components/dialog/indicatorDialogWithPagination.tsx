import { FC, memo, ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { Popover, Table, Spin, Empty } from '@dzh/components';
import { useMemoizedFn } from 'ahooks';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { isNil, cloneDeep } from 'lodash';
import styled from 'styled-components';

import { IndicatorResultType } from '@dataView/provider';

import missVCAIcon from '@/assets/images/area/missVCA.svg';
import { Modal } from '@/components/antd';
import { OpenDataSourceDrawer } from '@/components/dataSource';
import ExportDoc from '@/components/exportDoc';
import { getIndicatorResData, countDecimalPlaces } from '@/components/transferSelectNew/modules/customModal/utils';
import { LINK_AREA_F9, LINK_INFORMATION_TRACE } from '@/configs/routerMap';
import useUpdateTip, { inModalInitparams } from '@/pages/area/areaDebt/components/updateTip';
import { flatData } from '@/pages/area/areaDebt/components/updateTip/formatData';
import useUpdateModalInfo from '@/pages/area/areaDebt/components/updateTip/hooks/useModalBaseInfo';
import UpdateModal from '@/pages/area/areaDebt/components/updateTip/modal';
import { specialIndicList } from '@/pages/area/areaDebt/components/updateTip/specialConf';
import { TblEl, useCtx } from '@/pages/area/areaDebt/getContext';
import { CaliberNotes } from '@/pages/area/areaF9/style';
import { formatNumber } from '@/utils/format';
import { useECharts } from '@/utils/hooks';
import { dynamicLink } from '@/utils/router';
import { getTextWidth } from '@/utils/share';
import { urlJoin, urlQueriesSerialize } from '@/utils/url';

import { unitObj } from '../filter/indicator';

type PropsType = {
  close: () => void;
  data: TblEl[];
  year: string | undefined;
  condition?: any;
  handleOpenModal?: (record: any, o: string, year?: any) => void;
  pageCode?: string;
  hideUpdateTip?: boolean;
  pagination?: {
    total: number;
    currentIndictorPage: number;
    pageSize: number;
    hideOnSinglePage?: boolean;
    onChange: Function;
    pageNum?: number;
  };
  loading?: boolean;
  error?: any;
  openDataSource?: OpenDataSourceDrawer;
};
const LinkStyles = { color: '#025cdc', textDecoration: 'underline' };
function sortHelper<T extends unknown>(
  a: T | null | undefined,
  b: T | null | undefined,
  isDescending: boolean,
  compareFn: (a: T, b: T) => number,
) {
  if (isNil(a) && isNil(b)) return 0;

  if (isNil(a)) return isDescending ? -1 : 1;

  if (isNil(b)) return isDescending ? 1 : -1;

  return compareFn(a, b);
}
/** 有分页器，请求接口的弹窗版本 */
const IndicatorDialog: FC<PropsType> = ({
  close,
  data,
  year,
  condition,
  pageCode = 'regionalEconomyAll',
  hideUpdateTip = true,
  pagination,
  loading = false,
  openDataSource,
  error,
}) => {
  const [chartRef, chartInstance, reInit] = useECharts({});
  const domRef = useRef<HTMLDivElement | null>(null);
  const {
    state: { indicator, realIndicator, container, openSource: listOpenSource, customIndicator },
  } = useCtx();
  const [isEmpty, setIsEmpty] = useState(false);
  // 新增可自定义指标后需给导出配置user
  const { info } = useSelector((state: any) => state.user);
  /**指标是否自定义且计算格式为百分比 */
  const isCustomPercent = customIndicator && customIndicator.resultType === IndicatorResultType.StringPercent;
  const getUserFromReduxState = useMemoizedFn(() => info?.basic_info?.user);
  const {
    UpdateTipCref,
    // UpdateTipScreenCref,
    openUpdate,
    traceSource,
    traceCref,
    setTraceSource,
    handleTipSwitch,
    tipLoading,
    tipData,
    getTipData,
    handleTblCell,
  } = useUpdateTip({ defaultSource: listOpenSource, isLastMonth: pageCode !== 'regionalEconomyAll', missVCA: true });

  const { modalInfo, openModal, closeModal, contetHolder } = useUpdateModalInfo();

  useEffect(() => {
    if (condition?.regionCode && condition?.endDate && realIndicator && !!indicator) {
      if (customIndicator) {
        // 自定义指标不需要调用新闻日志更新
        return;
      }
      getTipData({
        ...inModalInitparams,
        endDate: condition?.endDate,
        days: openUpdate.days,
        regionCode: condition?.regionCode,
        indicName: realIndicator,
        pageCode,
      });
    }
  }, [
    condition?.regionCode,
    condition?.endDate,
    data,
    indicator,
    getTipData,
    openUpdate.days,
    realIndicator,
    pageCode,
    customIndicator,
  ]);

  const cpData = useMemo(() => {
    return cloneDeep(data || [])?.sort((a: any, b: any) => {
      if (isCustomPercent) {
        let valueB = b[indicator] ? b[indicator].replace(/%/g, '') : null;
        let valueA = a[indicator] ? a[indicator].replace(/%/g, '') : null;
        return sortHelper(valueA, valueB, false, (a, b) => b - a);
      } else {
        return sortHelper(a[indicator], b[indicator], false, (a, b) => b - a);
      }
    });
  }, [data, indicator, isCustomPercent]);

  /** 关闭弹窗时重置溯源/隐藏空行状态 */
  const handleCloseModal = useMemoizedFn(() => {
    setTraceSource(listOpenSource);
    handleTipSwitch(true);
    close();
  });

  const setting = useMemo(
    () => ({
      width: 860,
      height: 458,
      isEmpty,
      title: `${year}年 - ${customIndicator ? customIndicator.title : `${indicator}${unitObj[indicator]}`}
      `,
      type: 'titleWidthBgAndMaskScroll',
      contentId: 'AreaInoDialog',
      // footer: hideUpdateTip ? null : UpdateTipCref,
      footer: null,
      onCancel: handleCloseModal,
      getContainer: () => container,
      destroyOnClose: true,
    }),
    [isEmpty, year, indicator, handleCloseModal, container, customIndicator],
  );

  const inModalUpdateTipInfoFlat: any[] = useMemo(() => {
    return flatData(tipData, 'regionCode');
  }, [tipData]);

  // 当table某一列特别宽时，其列内容对齐方式应为沿着列名文本最右侧对齐
  const thirdCol = useMemo(() => {
    const title = customIndicator ? customIndicator.title : indicator + unitObj[indicator];
    const textWidth = getTextWidth(title);
    return {
      title,
      textWidth,
    };
  }, [indicator, customIndicator]);

  const TblSetting = useMemo(() => {
    const paginationSetting = pagination
      ? {
          ...pagination,
          onChange: (page: number) => {
            pagination?.onChange(page);
            domRef.current?.scroll({ top: 0 });
          },
        }
      : false;
    return {
      pagination: paginationSetting,
      dataSource: cpData,
      rowKey: (record: TblEl) => record.regionCode4,
      // className: 'app-table',
      type: 'stickyTable',
      sticky: {
        offsetHeader: 0,
        getContainer: () => domRef.current || window,
      },
      loading: { spinning: tipLoading || loading, translucent: true, type: 'square' },
      columns: [
        {
          title: '序号',
          width: Math.max(
            String(((pagination?.currentIndictorPage || 1) - 1) * (pagination?.pageSize || 10000)).length * 16,
            42,
          ),
          align: 'center',
          className: 'idx',
          render: (_txt, _record, index) =>
            pagination ? pagination?.pageSize * (pagination?.currentIndictorPage - 1) + index + 1 : index + 1,
        },
        {
          title: '地区',
          width: 390,
          align: 'center',
          dataIndex: 'regionName',
          render: (txt, record) => {
            return (
              <Link
                style={{ color: '#025cdc' }}
                to={() =>
                  urlJoin(
                    dynamicLink(LINK_AREA_F9, { key: 'regionEconomy', code: record.regionCode4 }),
                    urlQueriesSerialize({
                      code: record.regionCode4,
                    }),
                  )
                }
              >
                {txt}
              </Link>
            );
          },
        },
        {
          title: () => <span>{thirdCol.title}</span>,
          dataIndex: customIndicator ? customIndicator.indexId : indicator,
          align: 'right',
          onCell: (record: any) => {
            // const nameList: string[] = ['工业增加值1', '工业增加值2'];
            const isUpdateItem = inModalUpdateTipInfoFlat.find(
              (updateItem: any) =>
                updateItem?.regionCode === record?.regionCode4 && updateItem?.indicName === realIndicator,
            );
            return {
              ...(!record[indicator] || customIndicator
                ? {}
                : handleTblCell({
                    isUpdateItem,
                    onClick: () => {
                      openModal(
                        {
                          title: `${record.regionName}_${indicator}${unitObj[indicator]}`,
                          regionCode: record?.regionCode4 || '',
                          indicName: `${indicator}`,
                          indicName2: `${realIndicator}`,
                          unit: `${unitObj[indicator]}`,
                          year: year || '',
                          pageCode,
                          regionName: record.regionName,
                        },
                        specialIndicList.includes(indicator),
                        !record[indicator + '_guId'] && isUpdateItem?.child ? isUpdateItem.child : [],
                      );
                    },
                    isMissVCA: record[`${indicator}_isMissVCA`] === 1,
                    defaultClassName: '',
                  })),
              style: {
                '--text-width': `${thirdCol.textWidth}px`,
              },
            };
          },
          render: (text, record) => {
            let result: string | ReactElement = '';
            const noTraceList: string[] = ['城投平台有息债务', '城投平台有息债务(本级)'];
            const isSpecial = specialIndicList.includes(indicator);
            if (text !== null && text !== undefined && text !== '') {
              //fix bug6240,数据为0也要展示
              result = formatNumber(text);
              if (customIndicator) {
                return getIndicatorResData(text);
              }
              if (traceSource) {
                if (record[indicator + '_guId'] || record[indicator + '_posId']) {
                  const isUpdateItem = inModalUpdateTipInfoFlat.find(
                    (updateItem: any) =>
                      updateItem?.regionCode === record?.regionCode4 && updateItem?.indicName === realIndicator,
                  );
                  result =
                    isUpdateItem && openUpdate.isUpdate ? (
                      <LinkStyle>{result}</LinkStyle>
                    ) : record[indicator + '_posId'] && openDataSource ? (
                      <LinkStyle
                        style={LinkStyles}
                        data-prevent // 必须
                        onClick={() => openDataSource({ posIDs: record[indicator + '_posId'], jumpToPdf: true })}
                      >
                        {result}
                      </LinkStyle>
                    ) : (
                      <Link
                        style={LinkStyles}
                        to={() =>
                          urlJoin(
                            dynamicLink(LINK_INFORMATION_TRACE),
                            urlQueriesSerialize({
                              guId: record[indicator + '_guId'],
                            }),
                          )
                        }
                      >
                        {result}
                      </Link>
                    );
                } else if (isSpecial && !noTraceList.includes(indicator)) {
                  /** 计算指标溯源 */
                  result = (
                    <LinkStyle
                      onClick={() => {
                        openModal(
                          {
                            title: `${record.regionName}_${indicator}${unitObj[indicator]}`,
                            regionCode: record?.regionCode4 || '',
                            indicName: `${indicator}`,
                            unit: `${unitObj[indicator]}`,
                            year: year || '',
                            pageCode,
                            regionName: record.regionName,
                          },
                          true,
                        );
                      }}
                    >
                      {result}
                    </LinkStyle>
                  );
                }
              }
              return record[indicator + '_caliberDesc'] ? (
                <CaliberNotes>
                  <div className="top">{result}</div>
                  <Popover
                    placement="bottomLeft"
                    content={record[indicator + '_caliberDesc']}
                    arrowPointAtCenter
                    overlayStyle={{
                      maxWidth: '208px',
                    }}
                  >
                    <span className="icon"></span>
                  </Popover>
                </CaliberNotes>
              ) : (
                result
              );
            } else {
              return '-';
            }
          },
        },
      ] as ColumnsType<TblEl>,
    };
  }, [
    pagination,
    cpData,
    tipLoading,
    loading,
    customIndicator,
    indicator,
    thirdCol,
    inModalUpdateTipInfoFlat,
    handleTblCell,
    realIndicator,
    openModal,
    year,
    pageCode,
    traceSource,
    openUpdate,
    openDataSource,
  ]);

  const [chartData, setChartData] = useState([]);
  const renderChart = useMemoizedFn((copyData) => {
    // [ 产品要求 ，为零展示。]
    // copyData = copyData.filter((o: any) => o[indicator]);
    // if (copyData.length > 50) copyData.length = 50;
    /**需求本身不存在排序规则，只是恰好接口给出的数据是有序的，但是%新增后产品要求必须排序，全部统一成降序规则 */
    let sortResData = copyData.sort((a: any, b: any) => {
      if (isCustomPercent) {
        let valueB = b[indicator] ? b[indicator].replace(/%/g, '') : null;
        let valueA = a[indicator] ? a[indicator].replace(/%/g, '') : null;
        return sortHelper(valueA, valueB, false, (a, b) => b - a);
      } else {
        return sortHelper(a[indicator], b[indicator], false, (a, b) => b - a);
      }
    });
    let xAxis = sortResData.map((o: { regionName: string }) => {
      return o.regionName;
    });
    let myData = sortResData.map((o: any) => {
      if (typeof o[indicator] === 'number') {
        let floatCount = countDecimalPlaces(o[indicator]) || 2;
        return o[indicator].toFixed(floatCount);
      } else if (isCustomPercent) {
        let value = o[indicator] ? o[indicator].replace(/%/g, '') : null;
        /**22822_2新增数据类型，统一到数据浏览器的数据类型，为10 */
        return o[indicator] ? value : null;
      }
      return o[indicator];
    });
    let option = {
      color: ['#D4E4FD'],
      tooltip: {
        textStyle: {
          color: '#3c3c3c',
        },
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
          shadowStyle: {
            color: 'rgba(61, 127, 243, .04)',
          },
        },
        extraCssText: 'box-shadow: 0.02rem 0.02rem 0.1rem 0 rgba(0,0,0,0.20); padding: 3px 8px;border-radius: 0.04rem;',
        formatter(params: any) {
          let str = '';
          if (params && params.length) {
            let item = params[0];
            let dotHtml = `<span style='display:inline-block;vertical-align:middle;margin-right:5px;border-radius:7px;width:7px;height:7px;background-color:${item.color};'></span>`;
            str =
              dotHtml +
              `<span style='font-size: 12px; color: #3c3c3c;'>${item.name}: ${getIndicatorResData(item.value)}${
                isCustomPercent ? '%' : ''
              }</span>`;
          }
          return str;
        },
      },
      grid: {
        left: 0,
        right: 8,
        bottom: 16,
        top: 10,
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          data: xAxis,
          minInterval: 0,
          axisLabel: {
            show: true,
            fontSize: 10,
            interval: 'auto',
            // rotate: 45,
            color: '#595959',
          },
          axisLine: {
            lineStyle: {
              color: '#e2e6ec',
            },
          },
          nameTextStyle: {
            color: '#595959',
          },
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          axisLabel: {
            color: '#595959',
            formatter: isCustomPercent ? '{value}%' : '{value}',
          },
          nameTextStyle: {
            color: '#595959',
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            lineStyle: {
              type: 'dotted',
              color: '#efefef',
            },
          },
        },
      ],
      series: [
        {
          name: customIndicator ? null : indicator,
          type: 'bar',
          // barWidth: 10,
          barMinWidth: 1,
          barMaxWidth: 50,
          data: myData,
          color: ['#3986fe'],
          // backgroundStyle: {
          //   shadowColor: 'red',
          // },
        },
      ],
    };
    setChartData(myData);
    if (chartInstance) {
      reInit(option);
    }
  });

  useEffect(() => {
    if (pagination?.currentIndictorPage === 1) {
      renderChart(cpData);
      indicator && setIsEmpty(!cpData?.find((o: any) => !!o[indicator]));
    } else if (!pagination && !isEmpty) renderChart(cpData.slice(0, 50));
  }, [cpData, indicator, setIsEmpty, renderChart, pagination, isEmpty, chartData.length]);

  const graphContainer = useMemo(() => {
    return (
      <div className="graph-container">
        {cpData?.length > 0 ? (
          <div className="top">
            <div className="unit">{unitObj[indicator]}</div>
            <div className="right">
              <div className="source">
                {customIndicator ? null : traceCref}
                {/* {UpdateTipScreenCref} */}
              </div>

              {condition ? (
                <div className="export">
                  <ExportDoc
                    condition={{
                      ...condition,
                      sort: customIndicator ? '' : `${realIndicator}:desc`,
                      indicName: customIndicator ? '' : realIndicator,
                      indexId: customIndicator ? customIndicator.indexId : '',
                      userID: getUserFromReduxState(),
                      indexSort: customIndicator ? `${customIndicator.indexId}:desc` : '',
                      module_type: 'web_area_economy_indic_compare_new',
                      exportFlag: true,
                      isPost: true,
                      dealMissData: true,
                    }}
                    filename={`${year}年${
                      customIndicator ? customIndicator.title : indicator + unitObj[indicator]
                    }${dayjs().format('YYYYMMDD')}`}
                  />
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
        <div className={`graph`} ref={chartRef} />
      </div>
    );
  }, [
    chartRef,
    condition,
    cpData?.length,
    customIndicator,
    getUserFromReduxState,
    indicator,
    realIndicator,
    traceCref,
    year,
  ]);

  return (
    <ModalStyle visible={!!indicator} {...setting}>
      <Spin spinning={loading || tipLoading} type="thunder">
        <div className="content app-scrollbar-small" ref={domRef} style={{ minHeight: '400px' }}>
          {graphContainer}
          {/* @ts-ignore */}
          <TableStyle {...TblSetting} />
          {customIndicator || hideUpdateTip ? null : UpdateTipCref}
          <UpdateModal {...modalInfo} onClose={closeModal} container={domRef.current!} />
          {contetHolder}
          <Empty type={Empty.NO_DATA} />
        </div>
      </Spin>
    </ModalStyle>
  );
};

export default memo(IndicatorDialog);

const TableStyle = styled(Table)`
  .ant-table-container .ant-table-tbody > tr.ant-table-row:not(.focus-link):hover > td {
    &.cell-class {
      background-color: #ffd6d6 !important;
    }
    &.first-update {
      background-color: #ffe9d7 !important;
    }
  }

  .ant-table-tbody {
    > tr > td {
      padding-right: calc((100% - 42px - 390px - var(--text-width)) / 2);

      &.cell-class {
        background-color: #ffd6d6 !important;
        cursor: pointer;
        &:hover {
          background-color: #ffd6d6 !important;
        }
      }
      &.first-update {
        background-color: #ffe9d7 !important;
        cursor: pointer;
        &:hover {
          background-color: #ffe9d7 !important;
        }
      }
      &.missVCA {
        background: right center / 14px no-repeat url(${missVCAIcon});
      }
    }
  }

  .ant-table-container {
    //table {
    border-top: none !important;
    //}
  }

  .ant-table-thead
    > tr
    > th:not(:last-child):not(.ant-table-selection-column):not(.ant-table-row-expand-icon-cell):not([colspan])::before,
  .ant-table-container:before {
    display: none;
  }

  table {
    & > thead > tr > th:last-child,
    & > tbody > tr > td:last-child {
      border-right: none;
    }
  }

  .ant-table-header {
    overflow: visible !important;
  }
  .ant-table .ant-table-container .ant-table-thead > tr > th {
    text-align: center !important;
    position: relative;
    border-top: 1px solid #ebf1fc;

    &.ant-table-cell {
      padding-right: 0 !important;
      padding-left: 0 !important;
    }

    &:before {
      content: '';
      position: absolute;
      top: -4px;
      left: 0;
      right: 0;
      height: 3px;
      background: #fff;
    }

    span {
      display: inline-block;
      text-align: right;
    }
  }

  td {
    &.idx {
      padding-left: 0 !important;
      padding-right: 0 !important;
    }

    span {
      display: inline-block;
      text-align: right;
    }
  }
  .ant-table-sticky-scroll-bar {
    visibility: hidden !important;
  }
`;

const ModalStyle = styled((props) => <Modal {...props} />)`
  .ant-modal-body {
    padding-right: 0 !important;
    padding-top: 15px;
    padding-left: 24px;
    padding-bottom: 7px !important;
  }
  .ant-modal-footer {
    border: none;
    padding: 0 24px 7px 24px;
    .update-bottom-tip {
      padding-top: 7px !important;
    }
  }
  .ant-modal-content .ant-modal-header .process-title .content {
    white-space: nowrap !important;
  }
  .content {
    overflow: hidden auto !important;
    width: 100% !important;
    max-height: 393px;
    overflow-y: auto;
    overflow-y: overlay;
    position: relative;
    padding-right: 24px;

    .graph-container {
      //position: sticky;
      //top: 0;
      //z-index: 99;
      background: #fff;
      .top {
        display: flex;
        justify-content: space-between;
        .right {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .export {
          /* margin-left: 18px; */
          /* float: right; */
        }
        .unit {
          /* float: left; */
          font-size: 12px;
          color: #595959;
        }
      }
    }
  }

  .dzh-pagination {
    display: ${(props) => (props.isEmpty ? 'none' : 'flex')};
  }

  .unit,
  .export,
  .source,
  .graph-container,
  .update-bottom-tip,
  .ant-table {
    display: ${(props) => (props.isEmpty ? 'none' : 'block')};
  }
  .source {
    display: flex;
    font-size: 12px;

    > div:first-child {
      margin-right: 24px;
    }
    .trace-text {
      height: 20px;
      font-size: 13px;
      text-align: left;
      color: #262626;
      line-height: 20px;
    }
  }
  .graph {
    height: 208px;
  }

  .dzh-empty-container {
    display: ${(props) => (props.isEmpty ? 'block' : 'none')};
  }
`;

export const LinkStyle = styled.div`
  color: #025cdc;
  text-decoration: underline;
  cursor: pointer;
`;
