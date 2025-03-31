import { FC, memo, ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { useMemoizedFn } from 'ahooks';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { cloneDeep, isNumber } from 'lodash';
import styled from 'styled-components';

import { Empty, Modal, Table } from '@/components/antd';
import ExportDoc from '@/components/exportDoc';
import { LINK_AREA_F9, LINK_INFORMATION_TRACE } from '@/configs/routerMap';
import useUpdateTip from '@/pages/area/areaDebt/components/updateTip';
import { TblEl } from '@/pages/area/areaDebt/getContext';
import { formatNumber } from '@/utils/format';
import { useECharts } from '@/utils/hooks';
import { dynamicLink } from '@/utils/router';
import { urlJoin, urlQueriesSerialize } from '@/utils/url';

type PropsType = {
  /** 弹框数据可以外侧传进来也可以在内部写 */
  data: TblEl[];
  condition?: any;
  visible: boolean;
  onClose: () => void;
  indicator: string;
  indicatorName: string;
};

const IndicatorDialog: FC<PropsType> = ({ data, condition, visible, onClose, indicator, indicatorName }) => {
  const [chartRef, chartInstance, reInit] = useECharts({});
  /** 只用了区域经济的溯源模板，不需要更新数据 */
  const { traceSource, traceCref, setTraceSource } = useUpdateTip({});

  const domRef = useRef(null);
  const [isEmpty, setIsEmpty] = useState(false);

  const cpData = useMemo(
    () =>
      cloneDeep(data).sort((a: any, b: any) => {
        if (typeof b[indicator] !== 'number') return -1;
        return b[indicator] - a[indicator];
      }),
    [data, indicator],
  );

  /** 关闭弹窗时重置溯源/隐藏空行状态 */
  const handleCloseModal = useMemoizedFn(() => {
    setTraceSource(false);
    onClose?.();
  });

  const setting = useMemo(
    () => ({
      width: 860,
      isEmpty,
      title: `${indicator}`,
      type: 'titleWidthBgAndMaskScroll',
      contentId: 'AreaInoDialog',
      footer: null,
      onCancel: handleCloseModal,
      getContainer: () => document.body,
      destroyOnClose: true,
    }),
    [indicator, isEmpty, handleCloseModal],
  );

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
          render: (_, __, index) => index + 1,
        },
        {
          title: '地区',
          width: 219,
          align: 'left',
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
          title: () => <span>{indicator}</span>,
          dataIndex: indicator,
          align: 'center',
          render: (text, record) => {
            let result: string | ReactElement = '';
            if (text !== null && text !== undefined && text !== '') {
              result = formatNumber(text);
              /** 打开溯源开关就是放出guid的数据，在数据处理时就要处理成普通数据和溯源数据 */
              if (traceSource) {
                if (record[indicator + '_guId']) {
                  result = (
                    <Link
                      style={{ color: '#025cdc', textDecoration: 'underline' }}
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
                }
              }
              return result;
            } else {
              return '--';
            }
          },
        },
      ] as ColumnsType<TblEl>,
    };
  }, [cpData, indicator, traceSource]);

  const renderChart = useMemoizedFn((copyData) => {
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
        extraCssText: 'box-shadow: 0.02rem 0.02rem 0.1rem 0 rgba(0,0,0,0.20); padding: 3px 8px;border-radius: 0.04rem;',
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

    if (chartInstance) {
      reInit(option);
    }
  });

  useEffect(() => {
    if (indicator) {
      const isEmpty = !cpData.find((o: any) => isNumber(o[indicator]));

      setIsEmpty(isEmpty);
      if (!isEmpty) renderChart(cpData.slice(0, 50));
      // if (!isEmpty) renderChart(cpData);
    }
  }, [cpData, indicator, setIsEmpty, renderChart]);

  return (
    <ModalStyle visible={visible} {...setting}>
      <div className="content app-scrollbar-small" ref={domRef}>
        <div className="graph-container">
          <div className="top">
            <div className="unit">--</div>
            <div className="right">
              <div className="source">{traceCref}</div>
              {condition ? (
                <div className="export">
                  <ExportDoc
                    condition={{
                      ...condition,
                      sort: `${indicatorName}:desc`,
                      indicName: indicatorName,
                      // sheetNames: {
                      //   0: `${indicator}${unitObj[indicator]}`,
                      // },
                      module_type: 'web_area_economy_indic_compare',
                      exportFlag: true,
                      isPost: true,
                    }}
                    filename={`${indicator}${dayjs().format('YYYYMMDD')}`}
                  />
                </div>
              ) : null}
            </div>
          </div>
          <div className="graph" ref={chartRef} />
        </div>
        <Empty type={Empty.NO_DATA} />
        <TableStyle {...TblSetting} />
      </div>
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
  }

  .content {
    overflow: hidden auto !important;
    width: 100% !important;
    max-height: 393px;
    overflow-y: auto;
    overflow-y: overlay;
    position: relative;
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

  .ant-empty {
    display: ${(props) => (props.isEmpty ? 'block' : 'none')};
  }
`;

export const LinkStyle = styled.div`
  color: #025cdc;
  text-decoration: underline;
  cursor: pointer;
`;
