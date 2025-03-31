import { useEffect, useMemo, useRef } from 'react';

import { cloneDeep } from 'lodash';
import styled from 'styled-components';

import { chartColor } from '@/assets/styles';
import { Empty, Row, Table, Spin } from '@/components/antd';
import { AREA_IS_CHANGE_STATUS } from '@/configs/localstorage';
import { useTab } from '@/libs/route';
import LgEmpty from '@/pages/area/areaEconomy/components/LgEmpty';
import { useECharts } from '@/utils/hooks';

import * as S from '../../../../style';
import { ChangeScreenStyle } from '../../../../style';
import '@/pages/area/index.css';

export const CONTAINS = '1'; // 含下属辖区
export const SELFS = '0'; // 本级

const chartColorArr = Object.keys(chartColor).map((o) => chartColor[o]);

export default ({ title, condition, tableData, loading, execute, error }) => {
  const tableWrap = useRef();
  const columns = [
    {
      title: '项目类别',
      dataIndex: 'key',
      width: 193,
      align: 'left',
      render: (text, _, index) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {text !== '总计' && (
              <div
                style={{
                  marginRight: '6px',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: `${chartColorArr[index % chartColorArr.length]}`,
                }}
              />
            )}
            <span>{text || '-'}</span>
          </div>
        );
      },
    },
    {
      title: '项目个数',
      width: 168,
      dataIndex: 'projectNum',
      align: 'right',
      render: (text) => {
        return <span>{text || '-'}</span>;
      },
    },
    {
      title: '投资额(亿)',
      width: 168,
      align: 'right',
      dataIndex: 'totalAmount',
      render: (text) => {
        return <span>{text ? parseFloat(text).toFixed(2) : '-'}</span>;
      },
    },
    {
      title: '比例(%)',
      width: 168,
      align: 'right',
      dataIndex: 'rate',
      render: (text) => {
        return <span>{text ? parseFloat(text).toFixed(2) : '-'}</span>;
      },
    },
  ];
  const option = useMemo(
    () => ({
      tooltip: {
        textStyle: {
          color: '#3c3c3c',
        },
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        extraCssText: 'box-shadow: 2px 2px 10px 0 rgba(0,0,0,0.20); padding: 14px 14px;border-radius: 4px; z-index: 2;',
      },
      animation: false,
      color: chartColorArr,
      grid: {
        top: 20,
        left: 49,
        right: 49,
        bottom: 58,
        containLabel: true,
      },
      legend: {
        show: false,
        orient: 'horizontal',
        top: '230',
        data: tableData.map((o) => o.key),
        textStyle: { color: '#8c8c8c', padding: [2, 0, 0, 0] },
        itemGap: 14,
        // left: 5,
        width: '100%',
        icon: 'rect',
        itemWidth: 7,
        itemHeight: 7,
        itemStyle: {
          lineHeight: 12,
          fontSize: 12,
        },
      },
      series: [
        {
          name: '',
          type: 'pie',
          radius: 50,
          center: ['50%', '50%'],
          data: tableData.map((o) => {
            return { value: o?.totalAmount ? parseFloat(o.totalAmount).toFixed(2) : '-', name: o?.key };
          }),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    }),
    [tableData],
  );

  const [chartRef, chartInstance] = useECharts(option, 'svg');

  useEffect(() => {
    if (tableWrap.current && chartRef.current) {
      chartRef.current.style.height = tableWrap.current.clientHeight + 'px';
    }
  }, [tableWrap, option, tableData.length, chartRef]);

  useEffect(() => {
    if (chartInstance) {
      chartInstance.setOption(option);
    }
  }, [chartInstance, option]);

  // 监听尺寸变化
  useEffect(() => {
    const resize = () => {
      chartInstance?.current?.resize();
    };

    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
    };
  }, [chartInstance]);

  useTab({
    onActive() {
      if (chartInstance) {
        chartInstance?.current?.resize();
      }
    },
  });

  const newTableData = useMemo(() => {
    if (Array.isArray(tableData) && tableData.length) {
      let newArr = cloneDeep(tableData);

      const total = { key: '总计', projectNum: 0, totalAmount: 0, rate: 0 };
      newArr.forEach(({ projectNum: num, totalAmount: amount, rate: rat }) => {
        total.projectNum += parseFloat(num || 0);
        total.totalAmount += parseFloat(amount || 0);
        total.rate += parseFloat(rat || 0);
      });

      newArr.push(total);
      return newArr;
    }
    return tableData;
  }, [tableData]);

  return (
    <Container>
      <S.Container id="special_debt_projects_container" padding={0}>
        <div className="sticky-top" />
        <div className="screen-wrap">
          <Row className="select-wrap">
            <div className="card-title">{title}</div>
          </Row>
        </div>
        <div className="sticky-bottom" />
        <div>
          {error && ![202, 203, 204, 100].includes(error?.returncode) ? (
            <Empty type={Empty.MODULE_LOAD_FAIL} onClick={() => execute({ ...condition })} />
          ) : tableData?.length ? (
            <ChangeScreenStyle>
              <Spin type="square" spinning={loading && sessionStorage.getItem(AREA_IS_CHANGE_STATUS) !== '1'}>
                <div className="special-debt-projects">
                  <div className="chartContainer">
                    <div className="chart" ref={chartRef} />
                  </div>
                  <div ref={tableWrap} className="table-wrap area-economy-table-wrap">
                    <Table
                      rowKey="key"
                      stripe={true}
                      columns={columns}
                      type="stickyTable"
                      className="project_classify_table"
                      dataSource={newTableData}
                      scroll={{
                        y: 352,
                      }}
                    />
                  </div>
                </div>
              </Spin>
            </ChangeScreenStyle>
          ) : (
            <LgEmpty show={!loading && !tableData?.length} type={Empty.NO_DATA_LG} />
          )}
        </div>
      </S.Container>
    </Container>
  );
};

const Container = styled.div`
  .ant-table-body {
    /* overflow: overlay !important; */
    ::-webkit-scrollbar {
      width: 10px;
      height: 10px;
    }
    ::-webkit-scrollbar-thumb {
      background-color: rgba(0, 0, 0, 0.12);
      border: 2px solid transparent;
      border-radius: 8px;
      background-clip: padding-box;
    }
    ::-webkit-scrollbar-thumb:hover {
      background-color: rgba(0, 0, 0, 0.24);
    }
    ::-webkit-scrollbar-track {
      background-color: transparent;
    }
  }
`;
