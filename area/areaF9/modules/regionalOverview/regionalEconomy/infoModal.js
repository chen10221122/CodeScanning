import { useCallback, useEffect, useMemo } from 'react';

import { cloneDeep, isUndefined } from 'lodash';
import { createGlobalStyle } from 'styled-components';

import missVCAIcon from '@/assets/images/area/missVCA.svg';
import { chartColor } from '@/assets/styles';
import { Empty, Modal, Table } from '@/components/antd';
// import Table from '@/components/table';
// import { formatNumber } from '@/utils/format';
import { useECharts } from '@/utils/hooks';

import { CustomValueType, formatValue } from './utils';

const chartColorArr = Object.keys(chartColor).map((o) => chartColor[o]);

const sortOrder = (a, b) => {
  if (a?.includes('-') || b?.includes('-')) {
    // sort for yyyy-mm
    return b.split('-').join('') - a.split('-').join('');
  } else {
    // sort for yyyy or yyyymm
    return b - a;
  }
};

const sortByOrder = (rule) => (a, b) => {
  let _d;
  if (a?.includes('-') || b?.includes('-')) {
    _d = b.split('-').join('') - a.split('-').join('');
  } else {
    _d = b - a;
  }
  return rule === 'asc' ? -1 * _d : _d;
};

function InfoModal({
  title,
  unit,
  data,
  name,
  show,
  onClose,
  hasChart,
  chartType,
  tabIndex,
  isCustom,
  customValueType,
}) {
  const handleCancel = useCallback(() => {
    onClose instanceof Function && onClose();
  }, [onClose]);

  const option = useMemo(
    () => ({
      barWidth: '25%',
      barMaxWidth: '34',
      grid: {
        top: '15%',
        // left: '5%',
        left: 0,
        right: '2%',
        bottom: '13%',
        containLabel: true,
      },
      title: {
        text: name,
        padding: [3, 0, 0, 0],
        textStyle: {
          color: '#3c3c3c',
          fontSize: 12,
          fontWeight: 400,
        },
      },
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
        formatter(params) {
          let str = '';
          if (params && params.length) {
            let item = params[0];
            let title = `<span style='font-size: 12px; color: #3c3c3c;'>${item?.name}</span><br/>`;
            let dotHtml = `<span style='display:inline-block;vertical-align:middle;margin-right:5px;border-radius:7px;width:7px;height:7px;background-color:${item?.color};'></span>`;
            str =
              title +
              dotHtml +
              `<span style='font-size: 12px; color: #3c3c3c;'>${item?.seriesName}: ${formatValue(unit, item?.value)}${
                isCustom && customValueType === CustomValueType.PERCENTAGESTRING ? '%' : ''
              }</span>`;
          }
          return str;
        },
      },
      legend: {
        selectedMode: false,
        bottom: '0%',
        itemWidth: 8,
        itemHeight: 8,
        // fontSize: 8,
        selected: {
          name: true,
        },
        data: [name],
        textStyle: {
          padding: [0, 0, -2, 0],
        },
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: 'true',
          animation: false,
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
          data: Object.keys(data)?.sort(sortByOrder('asc')),
        },
      ],
      yAxis: [
        {
          type: 'value',
          // name,
          // nameTextStyle: {
          //   color: '#3c3c3c',
          //   // TODO 字与最左边对齐
          //   align: 'left',
          // },
          animation: false,
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
            formatter(value) {
              return `${value}${isCustom && customValueType === CustomValueType.PERCENTAGESTRING ? '%' : ''}`;
            },
          },
          splitLine: false,
        },
      ],
      series: [
        {
          type: chartType ?? 'bar',
          name: name,
          data: Object.keys(data)
            .sort(sortByOrder('asc'))
            .map((o) => {
              const val = data[o]?.mValue || data[o]?.mvalue;
              return data[o] && !isUndefined(val)
                ? isCustom && customValueType === CustomValueType.PERCENTAGESTRING
                  ? val.slice(0, val.length - 1)
                  : val
                : '-';
            }),
          // data: data,
          animation: false,
        },
      ],
      color: chartColorArr,
    }),
    [chartType, customValueType, data, isCustom, name, unit],
  );
  const [chartRef, chartInstance] = useECharts(option);

  const TblSetting = useMemo(() => {
    const yearList = Object.keys(cloneDeep(data) || {}).sort(sortOrder);

    return {
      dataSource: [data || {}],
      type: 'stickyTable',
      // isStatic: true,
      // stripe: true,
      scroll: {
        x: 'max-content',
      },
      sticky: {
        // offsetHeader: 114,
        getContainer: () => document.getElementById('tabsWrapper'),
      },
      columns: [
        {
          title: '年份',
          width: 195,
          align: 'left',
          fixed: 'left',
          dataIndex: 'indictor',
          render: (_, record) => {
            return name;
          },
        },
        ...yearList.map((item, i, arr) => {
          const len = arr.length;
          return {
            title: item,
            width: len <= 5 ? 90 : 130,
            align: 'right',
            dataIndex: item,
            onCell: (record) => {
              return {
                className: record[item].isMissVCA === '1' ? 'missVCA' : '',
              };
            },
            render: (_, record) => {
              const val = record[item]?.mValue || record[item]?.mvalue;
              // return record[item] && !isUndefined(val) ? formatNumber(val) : '-';
              return formatValue(unit, val);
            },
          };
        }),
      ],
    };
  }, [data, name, unit]);

  useEffect(() => {
    if (chartInstance) {
      chartInstance.setOption(option);
    }
  }, [chartInstance, option, chartType]);

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
        wrapClassName="economy-info-modal"
      >
        {Object.keys(data)?.length ? (
          <>
            {hasChart && chartType ? <div className="chart" ref={chartRef} /> : null}
            <Table {...TblSetting} />
            {/* <Table className="table" {...tableConfig} type="blueBorderInterlace" vScroll={false} /> */}
          </>
        ) : (
          <Empty type={Empty.NO_DATA} />
        )}
      </Modal>
    </>
  );
}
InfoModal.defaultProps = {
  title: '',
  data: {},
  show: false,
};

const GlobalStyle = createGlobalStyle`
  .economy-info-modal{
    min-width: 100vw !important;
    display: flex;
    align-items: center;
    .chart {
      width: 100%;
      height: 230px;
      margin-bottom: 17px;
    }

    .ant-table-header{
      .ant-table-thead{
        >tr>th:first-child{
          text-align: left !important;
        }
        >tr>th:not(:first-child){
          text-align: right !important;
        }
      }
    }
    .ant-table-ping-right:not(.ant-table-has-fix-right) .ant-table-container::after{
      box-shadow:none !important;
    }

    /* 内容元素 */
    .ant-modal {
      min-width: 1279px;
    }
    .ant-modal-content{
      margin-left: ${(1280 - 860) / 2}px;
      .ant-modal-body{
        max-height: 600px;
        overflow-y: auto;
        min-height: 152px;
        padding: 12px 20px 20px;//24px 20px;
        .table{
          border-top: none!important;
          border-radius: 2px;
          overflow: hidden;
          >div{
            font-size: 13px;
            >div:first-child{
              color: #262626 !important;
            }
            >div:not(:first-child){
              color: #141414;
              /* 此处注掉是为了解决弹窗打开时，图表会先放大再复原的闪一下 */
              /* &:hover div{
                background: #f5f9ff;
              } */
            }
            > div {
              div:first-child {
                border-right: 1px solid #E8ECF4!important;
              }
            }
          }
        }
        .ant-table-tbody > tr > td.missVCA {
          background: right center / 14px no-repeat url(${missVCAIcon});
        }
      }
    }
  }
`;
export default InfoModal;
