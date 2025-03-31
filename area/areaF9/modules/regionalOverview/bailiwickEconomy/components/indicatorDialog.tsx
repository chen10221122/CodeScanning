import { FC, memo, useCallback, ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { useMemoizedFn } from 'ahooks';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { cloneDeep, isNumber } from 'lodash';
import styled from 'styled-components';

import missVCAIcon from '@/assets/images/area/missVCA.svg';
import { Empty, Modal, Table } from '@/components/antd';
import { OpenDataSourceDrawer } from '@/components/dataSource';
import ExportDoc from '@/components/exportDoc';
import { LINK_AREA_F9, LINK_INFORMATION_TRACE } from '@/configs/routerMap';
import { unitObj } from '@/pages/area/areaDebt/components/filter/indicator';
import useUpdateTip, { inModalInitparams } from '@/pages/area/areaDebt/components/updateTip';
import { flatData } from '@/pages/area/areaDebt/components/updateTip/formatData';
import useUpdateModalInfo from '@/pages/area/areaDebt/components/updateTip/hooks/useModalBaseInfo';
import UpdateModal from '@/pages/area/areaDebt/components/updateTip/modal';
import { specialIndicList } from '@/pages/area/areaDebt/components/updateTip/specialConf';
import { TblEl } from '@/pages/area/areaDebt/getContext';
import { formatNumber } from '@/utils/format';
import { useECharts } from '@/utils/hooks';
import { dynamicLink } from '@/utils/router';
import { getTextWidth } from '@/utils/share';
import { urlJoin, urlQueriesSerialize } from '@/utils/url';

import { useCtx } from '../context';

type PropsType = {
  close: () => void;
  data: TblEl[];
  year: string | undefined;
  condition?: any;
  pageCode?: string;
  hideUpdateTip?: boolean;
  handleOpenModal?: (record: any, o: string, year?: any) => void;
  openDataSource?: OpenDataSourceDrawer;
};
const LinkStyles = { color: '#025cdc', textDecoration: 'underline' };

const IndicatorDialog: FC<PropsType> = ({
  close,
  data,
  year,
  condition,
  pageCode = 'areaF9DistrictEconomy',
  hideUpdateTip = true,
  openDataSource,
}) => {
  const [chartRef, chartInstance, reInit] = useECharts({});
  const domRef = useRef(null);
  const {
    state: { indicator, realIndicator, openSource: listOpenSource },
  } = useCtx();
  const [isEmpty, setIsEmpty] = useState(false);

  const {
    UpdateTipCref,
    // UpdateTipScreenCref,
    openUpdate,
    traceSource,
    traceCref,
    handleTipSwitch,
    setTraceSource,
    // tipLoading,
    tipData,
    getTipData,
    handleTblCell,
  } = useUpdateTip({ defaultSource: listOpenSource, isLastMonth: pageCode !== 'regionalEconomyAll', missVCA: true });

  const { modalInfo, openModal, closeModal, contetHolder } = useUpdateModalInfo();

  useEffect(() => {
    if (condition?.regionCode && condition?.endDate && realIndicator) {
      getTipData({
        ...inModalInitparams,
        endDate: condition?.endDate,
        days: openUpdate.days,
        regionCode: condition?.regionCode,
        indicName: realIndicator,
        pageCode,
      });
    }
  }, [condition?.regionCode, condition?.endDate, indicator, getTipData, openUpdate.days, realIndicator, pageCode]);

  const cpData = useMemo(() => {
    const newdata = cloneDeep(data)?.find((item: any) => typeof item[indicator] === 'number');
    return newdata
      ? cloneDeep(data).sort((a: any, b: any) => {
          if (typeof b[indicator] !== 'number') return -1;
          return b[indicator] - a[indicator];
        })
      : [];
  }, [data, indicator]);

  const inModalUpdateTipInfoFlat: any[] = useMemo(() => {
    return flatData(tipData, 'regionCode');
  }, [tipData]);

  const handleCloseModal = useMemoizedFn(() => {
    setTraceSource(listOpenSource);
    handleTipSwitch(true);
    close();
  });

  const setting = useMemo(
    () => ({
      width: 860,
      isEmpty,
      title: `${year}年 - ${indicator}${unitObj[indicator]}`,
      type: 'titleWidthBgAndMaskScroll',
      contentId: 'AreaInoDialog',
      footer: hideUpdateTip ? null : UpdateTipCref,
      onCancel: handleCloseModal,
      //fix bug35094,区域经济：下辖区域经济趋势弹框打不开
      getContainer: () => document.querySelector('.dzh-container-right') as HTMLElement,
      destroyOnClose: true,
    }),
    [isEmpty, year, indicator, hideUpdateTip, UpdateTipCref, handleCloseModal],
  );

  // 当table某一列特别宽时，其列内容对齐方式应为沿着列名文本最右侧对齐
  const thirdCol = useMemo(() => {
    const title = indicator + unitObj[indicator];
    const textWidth = getTextWidth(title);

    return {
      title,
      textWidth,
    };
  }, [indicator]);

  const TblSetting = useMemo(() => {
    return {
      pagination: false,
      dataSource: cpData,
      rowKey: (record: TblEl) => record.regionCode4,
      className: 'app-table',
      type: 'stickyTable',
      sticky: {
        offsetHeader: 0,
        getContainer: () => domRef.current || window,
      },
      columns: [
        {
          title: '序号',
          width: 42,
          align: 'center',
          className: 'idx',
          render: (txt, record, index) => index + 1,
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
          dataIndex: indicator,
          align: 'right',
          onCell: (record: any) => {
            // const nameList: string[] = ['工业增加值1', '工业增加值2'];
            const isUpdateItem = inModalUpdateTipInfoFlat.find(
              (updateItem: any) =>
                updateItem?.regionCode === record?.regionCode4 && updateItem?.indicName === realIndicator,
            );
            return {
              ...(!record?.[indicator]
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
                    isMissVCA: record[indicator + '_isMissVCA'] === 1,
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
                      <span
                        style={{ color: '#025cdc', textDecoration: 'underline', cursor: 'pointer' }}
                        data-prevent // 必须
                        onClick={() => openDataSource({ posIDs: record[indicator + '_posId'], jumpToPdf: true })}
                      >
                        {result}
                      </span>
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
              return result;
            } else {
              return '--';
            }
          },
          // render: (txt) => <span>{typeof txt !== 'undefined' && txt !== '' ? formatNumber(txt) : '--'}</span>,
        },
      ] as ColumnsType<TblEl>,
    };
  }, [
    cpData,
    indicator,
    traceSource,
    year,
    openUpdate.isUpdate,
    inModalUpdateTipInfoFlat,
    realIndicator,
    openModal,
    handleTblCell,
    pageCode,
    thirdCol.title,
    thirdCol.textWidth,
    openDataSource,
  ]);

  const renderChart = useCallback(
    (copyData) => {
      // [ 产品要求 ，为零展示。]
      // copyData = copyData.filter((o: any) => o[indicator]);
      // if (copyData.length > 50) copyData.length = 50;

      let xAxis = copyData.map((o: { regionName: string }) => {
        return o.regionName;
      });

      let myData = copyData.map((o: any) => {
        if (typeof o[indicator] === 'number') {
          return o[indicator].toFixed(2);
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
          extraCssText:
            'box-shadow: 0.02rem 0.02rem 0.1rem 0 rgba(0,0,0,0.20); padding: 3px 8px;border-radius: 0.04rem;',
          formatter(params: any) {
            let str = '';
            if (params && params.length) {
              let item = params[0];
              let dotHtml = `<span style='display:inline-block;vertical-align:middle;margin-right:5px;border-radius:7px;width:7px;height:7px;background-color:${item.color};'></span>`;

              str =
                dotHtml +
                `<span style='font-size: 12px; color: #3c3c3c;'>${item.name}: ${formatNumber(item.value)}</span>`;
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
            name: indicator,
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

      // if (xAxis.length > 20) {
      //   Object.assign(option, {
      //     dataZoom: [
      //       {
      //         start: 0,
      //         endValue: xAxis[20],
      //         height: 9,
      //       },
      //     ],
      //   });
      // }

      if (chartInstance) {
        reInit(option);
      }
    },
    [chartInstance, indicator, reInit],
  );

  useEffect(() => {
    if (indicator) {
      const isEmpty = !cpData.find((o: any) => isNumber(o[indicator]));

      setIsEmpty(isEmpty);
      if (!isEmpty) renderChart(cpData.slice(0, 50));
      // if (!isEmpty) renderChart(cpData);
    }
  }, [cpData, indicator, setIsEmpty, renderChart]);

  return (
    <ModalStyle visible={!!indicator} {...setting}>
      <div className="content app-scrollbar-small" ref={domRef}>
        <div className="graph-container">
          {cpData?.length > 0 ? (
            <div className="top">
              <div className="unit">{unitObj[indicator]}</div>
              <div className="right">
                <div className="source">
                  {traceCref}
                  {/* {UpdateTipScreenCref} */}
                </div>
                {condition ? (
                  <div className="export">
                    <ExportDoc
                      condition={{
                        ...condition,
                        sort: `${realIndicator}:desc`,
                        indicName: realIndicator,
                        // sheetNames: {
                        //   0: `${indicator}${unitObj[indicator]}`,
                        // },
                        module_type: 'web_area_economy_indic_compare_new',
                        exportFlag: true,
                        isPost: true,
                      }}
                      filename={`${year}年${indicator}${unitObj[indicator]}${dayjs().format('YYYYMMDD')}`}
                    />
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
          <div className={`graph`} ref={chartRef} />
        </div>
        <Empty type={Empty.NO_DATA} />
        <TableStyle {...TblSetting} />
        {/* {hideUpdateTip ? null : UpdateTipCref} */}
        <UpdateModal {...modalInfo} onClose={closeModal} container={domRef.current!} />
        {contetHolder}
      </div>
    </ModalStyle>
  );
};

export default memo(IndicatorDialog);

const TableStyle = styled(Table)`
  .ant-table-container {
    //table {
    border-top: none !important;
    //}
  }

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
        background: right calc((100% - var(--text-width)) / 2 - 7px) center / 14px no-repeat url(${missVCAIcon});
      }
    }
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
  .ant-table-tbody > tr > td {
    border-bottom: none;
    height: 30px;
  }
  .ant-table-tbody > tr.ant-table-row:nth-of-type(odd) > td {
    background-color: #f9fbff;
  }
  .ant-table-tbody > tr.ant-table-row:nth-of-type(even) > td {
    background-color: #ffffff;
  }
`;

const ModalStyle = styled((props) => <Modal {...props} />)`
  .ant-modal-body {
    padding-right: 0 !important;
    padding-top: 15px;
    padding-bottom: 0 !important;
  }

  .ant-modal-footer {
    border: none;
    padding: 0 24px 7px 24px;
    .update-bottom-tip {
      padding-top: 7px !important;
    }
  }

  .content {
    position: relative;
    // overflow: scroll !important;
    width: 100% !important;
    max-height: 393px;
    padding-right: 32px;

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
  .ant-modal-body .content {
    overflow: auto !important;
  }

  .unit,
  .export,
  .source,
  .graph,
  .ant-table {
    display: ${(props) => (props.isEmpty ? 'none' : 'block')};
  }
  .source {
    display: flex;
    font-size: 12px;
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

  .ant-empty {
    display: ${(props) => (props.isEmpty ? 'block' : 'none')};
  }
`;

export const LinkStyle = styled.div`
  color: #025cdc;
  text-decoration: underline;
  cursor: pointer;
`;
