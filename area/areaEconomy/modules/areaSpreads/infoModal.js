import { useCallback, useEffect, useMemo } from 'react';

import { createGlobalStyle } from 'styled-components';

import { chartColor } from '@/assets/styles';
import { Modal } from '@/components/antd';
import Table from '@/components/table';
import { useECharts } from '@/utils/hooks';

import { Empty } from '../../../../../components/antd';

const chartColorArr = Object.keys(chartColor).map((o) => chartColor[o]);

export const handleTableData = (xData, yData) => {
  if (!(Array.isArray(xData) && Array.isArray(yData))) {
    return [[], []];
  }
  const newXData = [...xData];
  const newYData = [...yData];

  if (newXData.length < newYData.length) {
    newXData.length = newYData.length;
  }

  if (newXData.length > newYData.length) {
    newYData.length = newXData.length;
  }

  return [newXData.reverse(), newYData.reverse()];
};

function InfoModal({ name, title, xDate, seriesData, tableData, show, onClose, hasData }) {
  // console.log(name, title, seriesData,hasData,'ooooooooo')

  const isshow = seriesData.data.filter((item) => {
    return item !== '-';
  }).length;

  const option = useMemo(
    () => ({
      tooltip: {
        show: true,
        confine: true,
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
          shadowStyle: {
            color: 'rgba(61, 127, 243, .04)',
          },
        },
        textStyle: {
          color: '#fff',
          fontSize: 13,
          fontWeight: 500,
          lineHeight: 18,
        },
        position: function (pos, params, dom, rect, size) {
          let obj = {};
          obj.bottom = '10%';
          obj['left'] = pos[0] > size.viewSize[1] / 2 ? pos[0] - 120 : pos[0] + 20;
          return obj;
        },
      },
      color: chartColorArr,
      legend: {
        selectedMode: false,
        bottom: '0',
        data: [name],
        itemGap: 40,
        icon: 'rect',
        itemWidth: 12,
        itemHeight: 7,
      },
      grid: {
        top: '12%',
        left: '12',
        right: '30',
        bottom: '20%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: xDate,
        axisLine: {
          lineStyle: {
            color: '#CACACA',
          },
        },
        axisLabel: {
          color: '#8C8C8C',
        },
      },
      yAxis: {
        name: 'BP',
        nameTextStyle: {
          color: '#3C3C3C',
        },
        scale: true,
        splitLine: {
          show: false,
        },
        axisLine: {
          lineStyle: {
            color: '#CACACA',
          },
        },
        axisLabel: {
          color: '#8C8C8C',
        },
      },
      series: seriesData,
    }),
    [name, seriesData, xDate],
  );
  const [chartRef, chartInstance] = useECharts(option, 'svg', 'noresize');
  const tableConfig = useMemo(() => {
    const [newXData, newYData] = handleTableData(xDate, tableData?.data || []);

    let thead = xDate ? ['日期', ...newXData] : ['日期'];
    let reverseData = newYData;
    // console.log(thead, '头', tableData);
    return {
      style: { border: '1px solid #ebf1fc' },
      data: [
        thead,
        thead.map((o, i) => {
          return i ? <span>{reverseData[i - 1] ? reverseData[i - 1] : '-'}</span> : <span>{name}</span>;
        }),
      ],
      stickyConfig: {
        left: 1,
      },
      columnWidth: thead.map((o, i) => (!i ? 120 : 100)),
      rowStyleConfig: {
        borderBottom: '1px solid #ebf1fc',
        0: { background: '#f7fbff', textAlign: 'flex-end', color: 'rgba(0,0,0,0.85)' },
      },
      cellStyleConfig: { padding: '5px 12px', justifyContent: 'flex-end', borderRight: '1px solid #ebf1fc' },
      colStyleConfig: {
        justifyContent: 'center',
        0: { textAlign: 'left', justifyContent: 'flex-start' },
        [tableData.length - 1]: { borderRight: '0px solid #ebf1fc' },
      },
    };
  }, [name, tableData, xDate]);

  useEffect(() => {
    if (show && chartInstance && xDate?.length) {
      // console.log(xDate, seriesData, option, '图');
      chartInstance.setOption(option);
    }
  }, [chartInstance, option, seriesData, show, xDate]);

  const handleCancel = useCallback(() => {
    onClose instanceof Function && onClose();
  }, [onClose]);

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
        wrapClassName="areaspread-info-modal"
      >
        {isshow ? (
          <>
            <div className="chart" ref={chartRef}></div>
            <Table className="table" {...tableConfig} vScroll={false} />
          </>
        ) : (
          <Empty type={Empty.NO_DATA} />
        )}
      </Modal>
    </>
  );
}
InfoModal.defaultProps = {
  title: '利差',
  tableData: [],
  show: false,
};

const GlobalStyle = createGlobalStyle`
  .areaspread-info-modal{
    .chart {
      width: 100%;
      height: 230px;
      margin-bottom: 17px;
    }

    /* 内容元素 */
    .ant-modal-content{
      .ant-modal-body{
        max-height: 600px;
        min-height: 152px;
        overflow-y: auto;
        padding: 24px 20px;
        .table{
          /* 滚动条后出现 防止高度抖动 */
          position: relative;
					border-radius: 4px;
          &>div:first-child {
            margin-bottom: 12px;
            & ~ div {
              position: absolute !important;
              bottom: 0;
            }
          }

          >div{
            font-size: 13px;
            >div:first-child{
              color: #262626 !important;
            }
            >div {
							div:last-child{
								border-right: none!important;
							}
						}
            >div:not(:first-child){
              &:hover{
                >div{
                  background: #f5f9ff;
                }
              }
            }
          }
        }
      }
    }
  }
`;
export default InfoModal;
