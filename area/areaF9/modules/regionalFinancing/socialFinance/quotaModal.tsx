import { useCallback, useEffect, useMemo } from 'react';

import { cloneDeep } from 'lodash';
import { createGlobalStyle } from 'styled-components';

import { chartColor } from '@/assets/styles';
import { Empty, Modal } from '@/components/antd';
import Table from '@/components/table';
import { useECharts } from '@/utils/hooks';

import { formatThreeNumber } from './utils';

const chartColorArr = Object.keys(chartColor).map((o) => (chartColor as any)[o]);

const QuotaModal = ({
  modalData,
  show,
  onClose,
}: {
  modalData: {
    value: any;
    title: string;
  };
  show: boolean;
  onClose: Function;
}) => {
  const { value, title } = modalData;
  // 格式化数据
  const data = useMemo(() => {
    if (value) {
      let xAxisData: Array<any> = [];
      let dataResource: Array<any> = [];
      let chartData: Array<any> = [];
      let retDataTemp = {};
      for (let key in value) {
        if (key !== 'key') {
          if (key !== 'quota') {
            xAxisData.unshift(key?.replace('年', ''));
            chartData.unshift(value[key] || '-');
            (retDataTemp as any)[key?.replace('年', '')] = value[key] || '-';
          } else {
            (retDataTemp as any)['quota'] = value['quota']?.value;
          }
        } else {
          (retDataTemp as any)[key] = value[key];
        }
      }
      dataResource.push(retDataTemp);
      return {
        xAxisData,
        chartData,
        dataResource,
        quotaValue: value?.quota?.value,
      };
    }
  }, [value]);

  // 表格
  // const columns = useMemo(() => {
  //   if (data?.xAxisData) {
  //     return [
  //       {
  //         title: '年份',
  //         align: 'left',
  //         key: 'quota',
  //         dataIndex: 'quota',
  //         width: 148,
  //       },
  //       ...cloneDeep(data?.xAxisData)
  //         ?.reverse()
  //         ?.map((col: any) => ({
  //           title: col.replace('年', ''),
  //           align: 'right',
  //           key: col,
  //           dataIndex: col,
  //           width: 90,
  //           render(record: any) {
  //             return <>{formatThreeNumber(record) || '-'}</>;
  //           },
  //         })),
  //     ];
  //   }
  // }, [data?.xAxisData]);

  const tableConfig = useMemo(() => {
    let tableData = ['年份', ...(cloneDeep(data?.xAxisData as [])?.reverse() || [])];
    let len = tableData?.length;
    return {
      style: { border: '1px solid #e8ecf4', borderRadius: '4px 4px 0px 0px', fontSize: '13px' },
      data: [
        tableData,
        tableData.map((o: any, i: number) => {
          return i ? <span>{(data?.dataResource?.[0] || {})[o] || '-'}</span> : <span>{data?.quotaValue}</span>;
        }),
      ],
      stickyConfig: {
        left: 1,
      },
      columnWidth: tableData.map((o: any, i: number) => (i ? (len > 8 ? 90 : ~~(670 / (len - 1))) : 148)),
      rowStyleConfig: {
        borderBottom: '1px solid #e8ecf4',
        0: { background: '#f7fbff', textAlign: 'right', color: '#262626', height: '32px', boxSizing: 'border-box' },
        1: { border: 'none' },
      },
      cellStyleConfig: { padding: '6px 12px', justifyContent: 'flex-end', borderRight: '1px solid #f2f4f9' },
      colStyleConfig: {
        justifyContent: 'flex-end',
        0: { textAlign: 'left', justifyContent: 'flex-start' },
        [len - 1]: { borderRight: 'none' },
      },
    };
  }, [data]);

  // 关闭弹窗
  const handleCancel = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  const option = useMemo(
    () => ({
      barWidth: '25%',
      barMaxWidth: '34',
      grid: {
        top: '15%',
        left: 0,
        right: '2%',
        bottom: '15%',
        containLabel: true,
      },
      title: {
        text: data?.quotaValue,
        padding: [5, 0, 0, 0],
        left: 0,
        textStyle: {
          color: '#434343',
          fontSize: 12,
          fontWeight: 400,
        },
      },
      tooltip: {
        show: true,
        confine: true,
        backgroundColor: 'rgba(255,255,255, 0.88)',
        extraCssText: 'box-shadow: 1px 1px 5px 0px rgba(0,0,0,0.20)',
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
          shadowStyle: {
            color: 'rgba(61, 127, 243, .04)',
          },
        },
        textStyle: {
          color: '#3c3c3c',
          fontSize: 12,
          fontWeight: 500,
        },
        formatter(params: any) {
          const cur = params?.[0];
          const marker = `<span style="display: inline-block; margin-right: 6px; width: 8px; height: 8px; border-radius: 2px; background-color:${cur?.color}; vertical-align: middle"></span>`;
          const name = `<span>${cur?.seriesName || '-'}：</span>`;
          const value = `<span>${cur?.value && !isNaN(+cur?.value) ? formatThreeNumber(cur?.value) : '-'}</span>`;
          const content = `<div style="margin-bottom: 6px;display: flex;align-items: center;font-weight: 400;"><div>${
            marker + name
          }</div><div>${value}</div></div>`;
          return (
            `<div style="font-size: 14px; margin-bottom: 3px; font-weight: 400;">${cur?.name || '-'}</div>` + content
          );
        },
      },
      legend: {
        selectedMode: false,
        bottom: '0%',
        itemWidth: 8,
        itemHeight: 8,
        fontSize: 12,
        selected: {
          name: true,
        },
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: 'true',
          axisPointer: {
            type: 'shadow',
          },
          axisTick: {
            show: 'true',
            alignWithLabel: true,
          },
          axisLine: {
            lineStyle: {
              color: '#dfdfdf',
            },
          },
          axisLabel: {
            color: 'rgb(0,0,0,.75)',
            rotate: '0',
            fontSize: 10,
          },
          data: data?.xAxisData?.map((item: any) => ({
            value: item,
            textStyle: {
              color: '#8c8c8c',
            },
          })),
        },
      ],
      yAxis: [
        {
          type: 'value',
          // name: data?.quotaValue,
          nameTextStyle: {
            color: '#3c3c3c',
            align: 'left',
          },
          axisTick: {
            show: 'true',
            interval: 0,
            alignWithLabel: 'true',
          },
          axisLine: {
            lineStyle: {
              color: '#dfdfdf',
            },
          },
          axisLabel: {
            show: true,
            color: 'rgb(0,0,0,.75)',
            interval: 0,
            fontSize: 10,
          },
          splitLine: false,
        },
      ],
      series: [
        {
          type: 'bar',
          name: data?.quotaValue,
          data: data?.chartData,
        },
      ],
      color: chartColorArr,
    }),
    [data],
  );
  const [chartRef, chartInstance] = useECharts(option as any);

  useEffect(() => {
    if (chartInstance) {
      chartInstance.setOption(option as any);
    }
  }, [chartInstance, option]);

  return (
    <>
      <GlobalStyle />
      <Modal
        type="titleWidthBgAndMaskScroll"
        width={860}
        title={title}
        visible={show}
        onCancel={handleCancel}
        footer={null}
        wrapClassName="areaEconomy-social-finance-info-modal"
      >
        {Object.keys(value)?.length ? (
          <>
            <div className="chart" ref={chartRef} />
            {
              // @ts-ignore: 忽略tableConfig未传的参数
              <Table
                className={(data?.xAxisData as any)?.length > 7 ? 'socian-finance-modal-table' : ''}
                // type="blueBorderInterlace"
                // rowKey={(record: any) => record?.quota}
                // scroll={{
                //   x: true,
                // }}
                // columns={columns}
                // dataSource={data?.dataResource}
                {...tableConfig}
                vScroll={false}
              />
            }
          </>
        ) : (
          <Empty type={Empty.NO_DATA} />
        )}
      </Modal>
    </>
  );
};

const GlobalStyle = createGlobalStyle`
  .areaEconomy-social-finance-info-modal{
    .chart {
      width: 100%;
      height: 230px;
      margin-bottom: 17px;
    }
    .socian-finance-modal-table {
      /* 滚动条后出现 防止高度抖动 */
      position: relative;
      &>div:first-child {
        margin-bottom: 12px;
        & ~ div {
          position: absolute !important;
          bottom: 0;
        }
      }
    }

    /* 内容元素 */
    .ant-modal-content{
      .ant-modal-body{
        max-height: 600px;
        overflow-y: auto;
        min-height: 152px;
        padding: 16px 20px 20px;
        .table{
          border-radius: 2px;
          overflow: hidden;
          >div{
            font-size: 13px;
            >div:first-child{
              color: #262626 !important;
            }
            >div:not(:first-child){
              color: #141414;
              &:hover div{
                background: #f5f9ff;
              }
            }
          }
        }
      }
    }
  }
`;
export default QuotaModal;
