import { memo, ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useMemoizedFn, useRequest } from 'ahooks';
import { ColumnsType } from 'antd/es/table';
import cn from 'classnames';
import dayjs from 'dayjs';
import { isUndefined } from 'lodash';
import styled from 'styled-components';

import { getGuid } from '@/apis/area/areaCompare';
import { Empty, Modal, Table, Spin } from '@/components/antd';
import ExportDoc from '@/components/exportDoc';
import { LINK_INFORMATION_TRACE } from '@/configs/routerMap';
import { useCtx } from '@/pages/area/areaCompareAdvance/context';
import { updateAuditYear, getIndicAndUnit } from '@/pages/area/areaCompareAdvance/utils';
import useUpdateTip from '@/pages/area/areaDebt/components/updateTip';
import { TblEl } from '@/pages/area/areaDebt/getContext';
import { formatNumber } from '@/utils/format';
import { useECharts } from '@/utils/hooks';
import { urlJoin, urlQueriesSerialize } from '@/utils/url';

import SortField from './SortField';
import useData from './useData';
const IndicatorDialog = ({ wrapRef }: { wrapRef: any }) => {
  const [chartRef, chartInstance, reInit] = useECharts({});
  /** 只用了区域经济的溯源模板，不需要更新数据 */
  const { traceSource, traceCref, setTraceSource } = useUpdateTip({});

  const {
    state: { indicatorModalVisible, date, indicatorParams, handleOpenModal, openSource },
    update,
  } = useCtx();

  const [currentSort, setCurrentSort] = useState<{ key: string; rule: string; value: string }>({
    key: date,
    value: date,
    rule: 'desc',
  });
  const history = useHistory();

  // 获取guid
  const { run } = useRequest(getGuid, {
    manual: true,
    onSuccess: (res: any) => {
      const guId = res?.data;
      if (guId) history.push(urlJoin(LINK_INFORMATION_TRACE, urlQueriesSerialize({ guId })));
    },
  });

  useEffect(() => {
    if (openSource) {
      setTraceSource(true);
    }
  }, [openSource, setTraceSource]);

  const { modalData, loading } = useData({ singleSort: currentSort.rule });

  const domRef = useRef(null);
  const [isEmpty, setIsEmpty] = useState(false);

  /** 关闭弹窗时重置溯源/隐藏空行状态 */
  const handleCloseModal = useMemoizedFn(() => {
    setTraceSource(false);
    update((draft) => {
      draft.indicatorModalVisible = false;
    });
  });

  const {
    updatedData,
    indexId,
    defaultParamMap,
    indicName,
    indicValue,
    indicatorUnit,
    extraProperties,
    isCalIndicator,
    isNormalIndicator,
  } = useMemo(() => {
    const updatedData = updateAuditYear(indicatorParams, [date]);
    const { data, value } = updatedData || {};
    const { indexId, extraProperties, defaultParamMap } = data || {};
    const { indicName, unit } = getIndicAndUnit(extraProperties?.indicName || '');

    const indicCode = Number(extraProperties?.type?.split('region_windows_')[1] || 0);
    const isCalIndicator = indicCode > 0 && indicCode < 24;
    const isNormalIndicator = extraProperties?.type === 'region_guid';

    return {
      updatedData,
      indexId,
      indicValue: value || '',
      defaultParamMap,
      indicName,
      indicatorUnit: unit,
      isCalIndicator,
      extraProperties,
      isNormalIndicator,
    };
  }, [date, indicatorParams]);

  const setting = useMemo(
    () => ({
      width: 860,
      isEmpty,
      title: `${updatedData?.value}`,
      type: 'titleWidthBgAndMaskScroll',
      contentId: 'AreaInoDialog',
      footer: null,
      onCancel: handleCloseModal,
      getContainer: () => wrapRef.current || document.body,
      destroyOnClose: true,
    }),
    [isEmpty, updatedData?.value, handleCloseModal, wrapRef],
  );

  const TblSetting = useMemo(() => {
    return {
      pagination: false,
      dataSource: modalData,
      rowKey: (record: TblEl) => record.area,
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
          dataIndex: 'area',
        },
        {
          title: (
            <SortField
              sortOpt={{ key: date, value: date, rule: 'desc' }}
              currentSort={currentSort}
              setCurrentSort={setCurrentSort}
            />
          ),
          dataIndex: 'date',
          align: 'center',
          render: (text, record) => {
            let result: string | ReactElement = '';
            if (text !== null && text !== undefined && text !== '') {
              result = formatNumber(text);
              /** 打开溯源开关就是放出guid的数据，在数据处理时就要处理成普通数据和溯源数据 */
              const isLink =
                traceSource && (isNormalIndicator || isCalIndicator) && isUndefined(extraProperties?.canJump);
              result = (
                <span
                  className={cn({ linkStyle: isLink })}
                  onClick={() => {
                    if (isLink) {
                      if (isCalIndicator) {
                        // 打开计算指标弹窗
                        handleOpenModal?.(
                          {
                            title: `${record?.area}_${indicName}_${indicatorUnit}`,
                            regionCode: record?.regionCode,
                            indicName,
                            unit: indicatorUnit,
                            year: date,
                            pageCode: 'regionalEconomyCompareTool',
                            regionName: record?.area,
                          },
                          true,
                        );
                      } else {
                        run({
                          businessCodeInfo: [record?.regionCode, '3'],
                          indexParam: {
                            indexId,
                            paramMap: defaultParamMap,
                          },
                        });
                      }
                    }
                  }}
                >
                  {text}
                </span>
              );
              return result;
            } else {
              return '-';
            }
          },
        },
      ] as ColumnsType<TblEl>,
    };
  }, [
    modalData,
    date,
    currentSort,
    traceSource,
    isNormalIndicator,
    isCalIndicator,
    extraProperties?.canJump,
    handleOpenModal,
    indicName,
    indicatorUnit,
    run,
    indexId,
    defaultParamMap,
  ]);

  const renderChart = useMemoizedFn((copyData) => {
    // [ 产品要求 ，为零展示。]
    // copyData = copyData.filter((o: any) => o[indicatorParams?.value]);
    // if (copyData.length > 50) copyData.length = 50;

    let xAxis = copyData.map((o: { area: string; date: string }) => o.area);
    let myData = copyData.map((o: { area: string; date: string }) => o.date);

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
              `<span style='font-size: 12px; color: #3c3c3c;'>${item.name}: ${
                item.value.includes('.') ? formatNumber(item.value) : formatNumber(item.value, 0) || '-'
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
            fontSize: 12,
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
          name: updatedData?.value,
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
    if (modalData) {
      setIsEmpty(false);
      renderChart(modalData);
    } else {
      setIsEmpty(true);
    }
  }, [setIsEmpty, renderChart, modalData]);

  const unit = useMemo(() => {
    const { value, data } = updatedData;
    const matchUnit = data?.headName.match(/\(([^)]+)\)[^)]*$/)?.[1];
    return matchUnit && !value?.includes(matchUnit) ? matchUnit : '';
  }, [updatedData]);

  return (
    <ModalStyle visible={indicatorModalVisible} {...setting}>
      <Spin type={'thunder'} spinning={loading}>
        <div className="content app-scrollbar-small" ref={domRef}>
          <div className="graph-container">
            <div className="top">
              <div className="unit">{unit}</div>
              <div className="right">
                {(isNormalIndicator || isCalIndicator) && <div className="source">{traceCref}</div>}
                <div className="export">
                  <ExportDoc
                    condition={{
                      date,
                      isPost: true,
                      exportFlag: true,
                      regionCodes: modalData.map((item) => item.regionCode).toString(),
                      module_type: 'region_compare_single_index',
                      singleHeadName: updatedData?.data?.headName || indicValue,
                      indexParamList: [
                        {
                          indexId: indexId,
                          paramMap: defaultParamMap,
                        },
                      ],
                      sheetName: `${indicValue}`,
                    }}
                    filename={`${date}年${indicValue}对比-${dayjs().format('YYYYMMDD')}`}
                  />
                </div>
              </div>
            </div>
            <div className="graph" ref={chartRef} />
          </div>
          <Empty type={Empty.NO_DATA} />
          <TableStyle {...TblSetting} />
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

  .linkStyle {
    color: #025cdc;
    text-decoration: underline;
    cursor: pointer;
  }
`;

const ModalStyle = styled((props) => <Modal {...props} />)`
  .ant-modal-body {
    padding: 15px 4px 16px 24px !important;
  }

  .ant-modal-wrap {
    z-index: 5 !important;
  }

  .content {
    overflow: hidden auto !important;
    width: 100% !important;
    max-height: 393px;
    overflow-y: auto;
    overflow-y: overlay;
    position: relative;
    padding-right: 14px;

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
