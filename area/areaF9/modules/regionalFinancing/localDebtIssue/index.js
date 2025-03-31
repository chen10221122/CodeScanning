import React, { useEffect, useMemo, useRef } from 'react';

import dayjs from 'dayjs';
import { cloneDeep } from 'lodash';
import styled from 'styled-components';

import { Empty, Table } from '@/components/antd';
import ExportDoc from '@/components/exportDoc';
import { Screen, ScreenType } from '@/components/screen';
import { useTab } from '@/libs/route';
import * as S from '@/pages/area/areaF9/style';
import useAnchor from '@/pages/detail/hooks/useAnchor';
import useLoading from '@/pages/detail/hooks/useLoading';
import { useECharts } from '@/utils/hooks';

import { WrapperContainer } from '../../../components';
import { FrequencySelectItems } from './type';
import useLocalDebtIssue from './useLocalDebtIssue';

const chartColorArr = ['#4DC972', '#75E5BF', '#34CACA', '#FAD237', '#F26279', '#3986FE'].reverse();
const { href } = window.location;
export default () => {
  const {
    pending: loading,
    columnsName,
    chartData,
    tableData,
    error,
    execute,
    condition,
    regionCode,
    handleFrequencyChange,
  } = useLocalDebtIssue();

  // 判断是否是进入tab页的第一次错误
  const changeTabError = useRef();
  const firstError = useRef();
  useEffect(() => {
    if (!changeTabError.current && !firstError.current) {
      if (error) {
        changeTabError.current = error;
        firstError.current = true;
      }
    } else {
      changeTabError.current = null;
    }
  }, [error]);

  const isLoading = useLoading(loading);
  useAnchor(isLoading);

  /** 处理加载状态的滚动条 */
  // useEffect(() => {
  //   const outerLayerDom = document.getElementById('tabsWrapper');
  //   if (isLoading && outerLayerDom) {
  //     outerLayerDom.style.overflowY = 'hidden';
  //   } else {
  //     outerLayerDom.style.overflowY = 'auto';
  //   }
  // }, [isLoading]);

  const option = useMemo(
    () => ({
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'none',
          label: {
            backgroundColor: '#6a7985',
          },
        },
        textStyle: {
          color: '#3c3c3c',
        },
        // position: function (point, params, dom) {
        //   dom.style.zIndex = 100;
        //   const posDis = window.innerWidth - dom.offsetWidth;
        //   if (point[0] > 1250) return { left: '80%', bottom: '14%' };
        //   if (point[0] > 1100) return { left: '72%', bottom: '14%' };
        //   return posDis < point[0] ? [posDis, '10%'] : [point[0], '10%'];
        // },
        position: function (point, params, dom, rect, size) {
          let x;
          // 设置固定高度
          const y = '0';
          const [pointX] = point;
          // 提示框大小
          const [boxWidth] = size.contentSize;
          // boxWidth > pointX 说明鼠标左边放不下提示框
          boxWidth > pointX ? (x = pointX + 10) : (x = pointX - boxWidth - 10); // 左边放的下
          return [x, y];
        },
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        extraCssText: 'box-shadow: 2px 2px 10px 0 rgba(0,0,0,0.20); padding: 14px 14px;border-radius: 4px;z-index:2',
      },
      color: chartColorArr,
      legend: {
        bottom: 0,
        data: chartData.map((o) => o.name),
        textStyle: { color: '#8c8c8c', padding: [2, 0, 0, 0] },
        itemGap: 40,
        icon: 'rect',
        itemWidth: 7,
        itemHeight: 7,
      },
      grid: {
        top: '10',
        left: '8',
        right: '8',
        bottom: '30',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: true,
        data: cloneDeep(columnsName).reverse(),
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
        name: '单位: 亿元',
        nameTextStyle: {
          color: '#434343',
        },
        type: 'value',
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
      series: chartData.map((o) => ({
        name: o.name,
        type: 'bar',
        stack: '债',
        data: cloneDeep(o.data)
          .reverse()
          .map((item) => {
            if (!item && item !== '0' && item !== 0) return '-';
            return parseFloat(item)?.toFixed(2) || '0.00';
          }),
      })),
    }),
    [chartData, columnsName],
  );

  const [chartRef, chartInstance] = useECharts(option, 'svg', href, false);

  const stick = useMemo(
    () => ({
      offsetHeader: 114,
      getContainer: () => document.getElementById('tabsWrapper') || window,
    }),
    [],
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  let columns = [
    {
      title: '类型',
      width: '149px',
      fixed: 'left',
      align: 'left',
      dataIndex: 'tableTitle',
      render: (text, row, i) => {
        // 第一行和第五行样式特殊处理
        const isSpecial = i === 0 || i === 4;
        return (
          <span style={{ color: isSpecial ? '#FF7500' : '', paddingLeft: isSpecial ? '' : '13px' }}>{text || '-'}</span>
        );
      },
    },
  ];
  columnsName.forEach((o) => {
    columns.push({
      title: o,
      width: '84px',
      // className: 'padding-10',
      dataIndex: o,
      align: 'right',
      render: (text) => {
        return <span>{text && !isNaN(text) ? parseFloat(text).toFixed(2) : '-'}</span>;
      },
    });
  });

  useEffect(() => {
    if (chartInstance) {
      chartInstance.setOption(option);
    }
  }, [chartInstance, option]);

  // 监听尺寸变化
  useEffect(() => {
    const resize = () => {
      chartInstance?.resize();
    };

    window.addEventListener('resize', resize);

    // 监听拖动左侧目录树导致的图表变化
    const contentViewDom = document.querySelector('.main-content');
    const resizeOb = new ResizeObserver((entries) => {
      requestAnimationFrame(() => resize());
    });
    resizeOb.observe(contentViewDom);

    return () => {
      resizeOb.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, [chartInstance]);

  useTab({
    onActive() {
      if (chartInstance) {
        chartInstance?.resize();
      }
    },
  });

  const menuConfig = useMemo(() => {
    return [
      {
        title: '频度',
        option: {
          type: ScreenType.SINGLE,
          children: FrequencySelectItems,
          default: FrequencySelectItems[0],
        },
      },
    ];
  }, []);

  const show = chartData?.length && columnsName?.length;

  const Content = useMemo(() => {
    return (
      <Container>
        <S.Container>
          {!loading && !show ? (
            <Empty type={Empty.NO_NEW_RELATED_DATA} className="new-no-data" />
          ) : (
            <>
              {show ? <div className="chart border-chart" ref={chartRef} /> : null}

              <div className="area-economy-table-wrap">
                {error && ![202, 203, 204, 100].includes(error?.returncode) ? (
                  <Empty type={Empty.MODULE_LOAD_FAIL} onClick={() => execute({ ...condition, regionCode })} />
                ) : show && tableData?.length ? (
                  <Table
                    scroll={{
                      x: 900,
                    }}
                    columns={columns}
                    type="stickyTable"
                    dataSource={tableData}
                    sticky={stick}
                  />
                ) : null}
              </div>
            </>
          )}
        </S.Container>
      </Container>
    );
  }, [chartRef, columns, condition, error, execute, loading, regionCode, show, stick, tableData]);

  return (
    <WrapperContainer
      error={error}
      loading={loading}
      content={Content}
      containerStyle={{
        minWidth: '930px',
      }}
      headerRightContent={
        <>
          <div style={{ marginRight: '24px' }}>
            <Screen options={menuConfig} onChange={handleFrequencyChange} />
          </div>
          <ExportDoc
            condition={{ ...condition, module_type: 'local_debt' }}
            filename={`地方债发行${dayjs(new Date()).format('YYYYMMDD')}`}
          />
        </>
      }
    ></WrapperContainer>
  );
};

const Container = styled.div`
  .custom-area-economy-screen-wrap {
    z-index: 99 !important;
    position: relative;
    top: 0 !important;
  }

  .screen-wrap {
    padding-top: 0px !important;
  }

  .screen-wrap .select-wrap {
    min-height: 0;
  }

  .select-right {
    height: 0 !important;
    transform: translateY(-20px);
    z-index: 99;
  }

  .custom-area-economy-screen-wrap {
    top: 86px;
  }
  .ant-table-ping-right:not(.ant-table-has-fix-right) .ant-table-container::after {
    box-shadow: none;
  }
`;
