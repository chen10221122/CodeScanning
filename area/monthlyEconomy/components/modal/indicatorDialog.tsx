import { FC, memo, useCallback, ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { Table, Popover } from '@dzh/components';
import { useMemoizedFn } from 'ahooks';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { cloneDeep, isNumber } from 'lodash';
import styled from 'styled-components';

// import attention from '@/assets/images/area/attention.svg';
import missVCAIcon from '@/assets/images/area/missVCA.svg';
import { Empty, Modal } from '@/components/antd';
import { OpenDataSourceDrawer } from '@/components/dataSourceDrawer';
import ExportDoc from '@/components/exportDoc';
import { LINK_AREA_F9, LINK_INFORMATION_TRACE } from '@/configs/routerMap';
import { CaliberNotes } from '@/pages/area/areaF9/style';
import useUpdateTip from '@/pages/area/monthlyEconomy/components/updateTip';
import useUpdateModalInfo from '@/pages/area/monthlyEconomy/components/updateTip/hooks/useModalBaseInfo';
import UpdateModal from '@/pages/area/monthlyEconomy/components/updateTip/modal';
import { TblEl, useCtx } from '@/pages/area/monthlyEconomy/getContext';
import { formatNumber } from '@/utils/format';
import { useECharts } from '@/utils/hooks';
import { dynamicLink } from '@/utils/router';
import { getTextWidth } from '@/utils/share';
import { urlJoin, urlQueriesSerialize } from '@/utils/url';

type PropsType = {
  close: () => void;
  data: TblEl[];
  currentDate: string;
  endDate: string | undefined;
  condition?: any;
  handleOpenModal?: (record: any, o: string, year?: any) => void;
  pageCode?: string;
  hideUpdateTip?: boolean;
  openDataSource?: OpenDataSourceDrawer;
};
const LinkStyles = { color: '#025cdc', textDecoration: 'underline' };

const IndicatorDialog: FC<PropsType> = ({
  close,
  data,
  currentDate,
  endDate,
  condition,
  pageCode = 'regionalEconomyAll',
  hideUpdateTip = true,
  openDataSource,
}) => {
  const [chartRef, chartInstance, reInit] = useECharts({});
  const domRef = useRef(null);
  const {
    state: { indicator, indicatorUnit, realIndicator, container, openSource: listOpenSource },
  } = useCtx();
  const [isEmpty, setIsEmpty] = useState(false);

  const {
    UpdateTipCref,
    // UpdateTipScreenCref,
    traceSource,
    traceCref,
    setTraceSource,
    handleTipSwitch,
    handleTblCell,
  } = useUpdateTip({ defaultSource: listOpenSource, isLastMonth: pageCode !== 'regionalEconomyAll' });

  const { modalInfo, openModal, closeModal } = useUpdateModalInfo();

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
    setTraceSource(listOpenSource);
    handleTipSwitch(true);
    close();
  });

  const setting = useMemo(
    () => ({
      width: 860,
      isEmpty,
      height: 485,
      title: `${currentDate} - ${realIndicator}(${indicatorUnit})`,
      type: 'titleWidthBgAndMaskScroll',
      contentId: 'AreaInoDialog',
      footer: !isEmpty ? UpdateTipCref : null,
      onCancel: handleCloseModal,
      getContainer: () => container,
      destroyOnClose: true,
    }),
    [isEmpty, currentDate, realIndicator, indicatorUnit, UpdateTipCref, handleCloseModal, container],
  );

  // 当table某一列特别宽时，其列内容对齐方式应为沿着列名文本最右侧对齐
  const thirdCol = useMemo(() => {
    const title = `${indicator}(${indicatorUnit})`;
    const textWidth = getTextWidth(title);

    return {
      title,
      textWidth,
    };
  }, [indicator, indicatorUnit]);

  const TblSetting = useMemo(() => {
    return {
      dataSource: cpData,
      rowKey: (record: TblEl) => record.regionCode4,
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
          title: () => <span>{`${realIndicator}(${indicatorUnit})`}</span>,
          dataIndex: indicator,
          align: 'right',
          onCell: (record: any) => {
            const isUpdateItem = record.indicatorList.find((item: any) => item.indicName === indicator);
            return {
              ...(!record[indicator]
                ? {}
                : handleTblCell({
                    isUpdateItem: isUpdateItem?.updateValue,
                    onClick: () => {
                      openModal(
                        {
                          title: `${record.regionName}_${realIndicator}(${indicatorUnit})`,
                          regionCode: record?.regionCode4 || '',
                          indicName: `${realIndicator}`,
                          indicName2: `${indicator}`,
                          unit: `(${indicatorUnit})`,
                          year: endDate || '',
                          pageCode,
                          projectCode: isUpdateItem?.projCode,
                          regionName: record.regionName,
                        },
                        !(record[indicator + '_guId'] || record[indicator + '_posId']) && isUpdateItem?.child
                          ? isUpdateItem.child
                          : [],
                      );
                    },
                    defaultClassName: '',
                  })),
              style: {
                '--text-width': `${thirdCol.textWidth}px`,
              },
            };
          },
          render: (text, record) => {
            let result: string | ReactElement = '';
            if (text !== null && text !== undefined && text !== '') {
              //fix bug6240,数据为0也要展示
              result = formatNumber(text);
              if (traceSource && (record[indicator + '_guId'] || record[indicator + '_posId'])) {
                const isUpdateItem = record.indicatorList.find(
                  (item: any) => item.indicName === indicator,
                )?.updateValue;
                result = isUpdateItem ? (
                  <LinkStyle>{result}</LinkStyle>
                ) : record[indicator + '_posId'] ? (
                  <LinkStyle
                    data-prevent // 必须
                    onClick={() => openDataSource && openDataSource({ posIDs: record[indicator + '_posId'] })}
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
              }
              //口径注释添加
              let caliberDesc = record[indicator + '_caliberDesc'] || '';
              return caliberDesc ? (
                <CaliberNotes>
                  <div className="top">{result}</div>
                  <Popover
                    placement="bottomLeft"
                    content={caliberDesc}
                    arrowPointAtCenter={true}
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
              // return result;
            } else {
              return '-';
            }
          },
        },
      ] as ColumnsType<TblEl>,
    };
  }, [
    cpData,
    indicator,
    realIndicator,
    traceSource,
    endDate,
    openModal,
    handleTblCell,
    pageCode,
    thirdCol,
    indicatorUnit,
    openDataSource,
  ]);

  const renderChart = useCallback(
    (copyData) => {
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
            barMinWidth: 1,
            barMaxWidth: 50,
            data: myData,
            color: ['#3986fe'],
          },
        ],
      };

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
    }
  }, [cpData, indicator, setIsEmpty, renderChart]);
  return (
    <ModalStyle visible={!!indicator} {...setting}>
      <div className="content app-scrollbar-small" ref={domRef}>
        <div className="graph-container">
          {!isEmpty ? (
            <div className="top">
              <div className="unit">{indicatorUnit}</div>
              <div className="right">
                <div className="source">
                  {/**溯源按钮 */}
                  {traceCref}
                  {/**更新提示按钮 */}
                  {/* {UpdateTipScreenCref} */}
                </div>
                {condition ? (
                  <div className="export">
                    <ExportDoc
                      condition={{
                        ...condition,
                        sort: `${indicator}:desc`,
                        indicName: indicator,
                        module_type: 'regional_economies_month_quarter',
                        sheetNames: { 0: '月度季度经济' },
                        exportFlag: true,
                        isPost: true,
                        dealMissData: true,
                      }}
                      filename={`${currentDate}${realIndicator}(${indicatorUnit})-${dayjs().format('YYYYMMDD')}`}
                    />
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
          <div className={`graph`} ref={chartRef} />
        </div>
        <Empty type={Empty.NO_DATA_NEW} />
        <TableStyle {...TblSetting} pagination={false} />
        {/* {!isEmpty && UpdateTipCref} */}
        <UpdateModal {...modalInfo} onClose={closeModal} container={domRef.current!} />
        {/* {contetHolder} */}
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

  .ant-table-header {
    overflow: visible !important;
  }
  .ant-table .ant-table-container .ant-table-thead > tr > th {
    text-align: center !important;
    position: relative;

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
  .ant-modal-footer {
    border: none;
    padding: 0 24px 7px 24px;
    .update-bottom-tip {
      padding-top: 7px !important;
    }
  }
  .ant-modal-body {
    padding-right: 0 !important;
    padding-top: 12px;
    padding-bottom: 0 !important;
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
// export const CaliberNotes = styled.span`
//   .top {
//     position: relative;
//     z-index: 1;
//   }
//   .icon {
//     position: absolute;
//     top: 8px;
//     right: 0;
//     width: 14px;
//     height: 14px;
//     background: url(${attention});
//   }
// `;
