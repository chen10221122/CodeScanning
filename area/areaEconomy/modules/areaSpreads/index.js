import React, { useCallback, useEffect, useMemo, useState } from 'react';

import dayjs from 'dayjs';
import { cloneDeep } from 'lodash';

import { chartColor } from '@/assets/styles';
import { Empty, Row, Table, Radio } from '@/components/antd';
import ExportDoc from '@/components/exportDoc';
import Icon from '@/components/icon';
import SkeletonScreen from '@/components/skeletonScreen';
import { AREA_IS_CHANGE_STATUS } from '@/configs/localstorage';
import { useTab } from '@/libs/route';
import useAnchor from '@/pages/detail/hooks/useAnchor';
import useLoading from '@/pages/detail/hooks/useLoading';
import { useECharts } from '@/utils/hooks';

import * as S from '../../style';
import useChangeTabError from '../../useChangeTabError';
import InfoModal from './infoModal';
import useAreaSpreads from './useAreaSpreads';

const chartColorArr = Object.keys(chartColor).map((o) => chartColor[o]);
const { href } = window.location;

export const STPYPE_KEY_NAME_OBJ = {
  all: '全部债项',
  aaa: 'AAA',
  aaPlus: 'AA+',
  aa: 'AA',
  province: '省级',
  city: '地市级',
  district: '区县级',
};

const emptyCodes = ['653000'];

export default () => {
  const {
    pending: loading,
    needData,
    areaInfo,
    error,
    getAreaSpreadsRecentDayExecute,
    code,
    onRadioChange,
    chartLoading,
  } = useAreaSpreads();
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

  const changeTabError = useChangeTabError([error]);

  const [modal, setModal] = useState({
    show: false,
    title: '',
    name: '',
  });

  const handleShowModal = useCallback(
    (name, key) => {
      let seriesData = cloneDeep(needData?.chartData?.seriesData?.filter((o) => o.name === name)[0]);
      seriesData.lineStyle = {
        width: 2,
        shadowColor: chartColorArr[0] + '33',
        shadowBlur: 3,
        shadowOffsetY: 4,
      };
      seriesData.markLine = {
        symbol: ['none', 'none'], //去掉箭头
        data: [
          {
            silent: false,
            lineStyle: {
              type: 'dotted',
              color: '#3398DB',
            },
            label: {
              show: true,
              position: 'end',
              formatter: '25%',
            },
            yAxis: needData?.tableData[6][key],
          },
          {
            silent: false,
            lineStyle: {
              type: 'dotted',
              color: '#3398DB',
            },
            label: {
              position: 'end',
              formatter: '50%',
            },
            yAxis: needData?.tableData[7][key],
          },
          {
            silent: false,
            lineStyle: {
              type: 'dotted',
              color: '#3398DB',
            },
            label: {
              position: 'end',
              formatter: '75%',
            },
            yAxis: needData?.tableData[8][key],
          },
        ],
      };

      setModal({
        show: true,
        title: name + '利差分位数图',
        name: name,
        xDate: needData?.chartData?.xDate,
        seriesData: seriesData,
        tableData: seriesData,
        hasData: seriesData?.data?.length,
      });
    },
    [needData],
  );

  const handleClose = useCallback(() => {
    setModal((base) => {
      return { ...base, show: false };
    });
  }, []);

  const columns = [
    {
      title: areaInfo?.regionInfo?.length ? areaInfo?.regionInfo[0].regionName + '(BP)' : '(BP)',
      align: 'left',
      width: '165px',
      dataIndex: 'paramsName',
      render: (text) => {
        return <span>{text}</span>;
      },
    },
  ];

  Object.keys(STPYPE_KEY_NAME_OBJ).forEach((item) => {
    const currentColDataLen = needData?.tableData?.filter((colItem) => colItem[item] && colItem[item] !== '-').length;
    columns.push({
      title: (
        <span
          onClick={() => {
            if (currentColDataLen) {
              handleShowModal(STPYPE_KEY_NAME_OBJ[item], item);
            }
          }}
        >
          <span className="table-title">{STPYPE_KEY_NAME_OBJ[item]}</span>
          {currentColDataLen ? (
            <Icon style={{ cursor: 'pointer' }} symbol="iconico_diquf9_zhexiantu2x" />
          ) : (
            <Icon
              size={13}
              style={{ cursor: 'not-allowed', verticalAlign: '-2px' }}
              image={require('@/pages/area/areaEconomy/images/diquf9_zhexiantu@2x.png')}
            />
          )}
        </span>
      ),
      // className: 'padding-10',
      dataIndex: item,
      width: '145px',
      align: 'right',
      render: (text) => {
        return <div>{text || '-'}</div>;
      },
    });
  });

  const option = useMemo(
    () => ({
      tooltip: {
        confine: true,
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
        position: function (point, params, dom) {
          let posDis = window.innerWidth - dom.offsetWidth;
          return posDis < point[0] ? [posDis, '10%'] : [point[0], '10%'];
        },
        backgroundColor: 'rgba(255, 255, 255, 0.88)',
        extraCssText: 'box-shadow: 2px 2px 10px 0 rgba(0,0,0,0.20); padding: 14px 14px;border-radius: 4px;z-index:2',
      },
      color: chartColorArr,
      legend: {
        bottom: '0',
        data: ['全部债项', 'AAA', 'AA+', 'AA', '省级', '地市级', '区县级'],
        textStyle: { color: '#8c8c8c', padding: [2, 0, 0, 0] },
        itemGap: 40,
        icon: 'rect',
        itemWidth: 7,
        itemHeight: 7,
      },
      grid: {
        top: '15%',
        left: '25',
        right: '0',
        bottom: '30',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: ['20%', '20%'],
        data: needData?.chartData?.xDate,
        axisLine: {
          lineStyle: {
            color: '#CACACA',
            fontSize: 10,
          },
        },
        axisTick: {
          inside: true,
        },
        axisLabel: {
          color: '#8C8C8C',
          rotate: 35,
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
            fontSize: 10,
          },
        },
        axisLabel: {
          color: '#8C8C8C',
        },
      },
      series: needData?.chartData?.seriesData,
    }),
    [needData?.chartData?.seriesData, needData?.chartData?.xDate],
  );

  const [chartRef, chartInstance] = useECharts(option, 'svg', href, false);

  // 加载失败重新加载
  const retryGetData = useCallback(() => {
    if (code) {
      getAreaSpreadsRecentDayExecute({
        regionCode: code,
        SType: '11,12,13,14,21,22,23',
      });
    }
  }, [code, getAreaSpreadsRecentDayExecute]);

  useEffect(() => {
    if (chartInstance && needData?.chartData?.xDate?.length) {
      chartInstance.setOption(option);
    }
  }, [chartInstance, needData, option]);

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

  const show = needData?.chartData?.seriesData?.length || needData?.tableData?.length;

  return loading && sessionStorage.getItem(AREA_IS_CHANGE_STATUS) !== '1' ? (
    <div style={{ height: 'calc(100vh - 274px)' }}>
      <SkeletonScreen num={2} firstStyle={{ paddingTop: '23px' }} otherStyle={{ paddingTop: '22px' }} />
    </div>
  ) : (
    <S.Container>
      {modal.show ? <InfoModal {...modal} onClose={handleClose} /> : null}

      {changeTabError ? (
        <Empty type={Empty.LOAD_FAIL} onClick={retryGetData} style={{ marginTop: '123px' }} />
      ) : (
        <>
          {emptyCodes.indexOf(code) === -1 ? (
            <>
              <div className="sticky-top" />
              <div className="screen-wrap custom-area-economy-screen-wrap">
                <Row className="select-wrap">
                  <Radio.Group onChange={onRadioChange} defaultValue={1}>
                    <Radio value={1}>近一年</Radio>
                    <Radio value={3}>近三年</Radio>
                  </Radio.Group>

                  <div className="select-right" style={{ transform: 'translateY(5px)' }}>
                    <ExportDoc
                      condition={{
                        regionCode: areaInfo?.regionInfo[0]?.regionCode,
                        module_type: 'spread_region_analysis',
                      }}
                      filename={`地区利差${dayjs(new Date()).format('YYYYMMDD')}`}
                    />
                  </div>
                </Row>
              </div>
              <div className="sticky-bottom" style={{ height: '2px' }} />
              <div>
                {show && !chartLoading ? (
                  needData?.chartData?.seriesData?.length ? (
                    <div className="chart" ref={chartRef} style={{ marginBottom: '10px' }} />
                  ) : (
                    <Empty
                      type={Empty.NO_SMALL_RELATED_DATA}
                      style={{ height: '250px', marginBottom: '10px', paddingTop: '30px' }}
                    />
                  )
                ) : null}
              </div>
            </>
          ) : (
            <div style={{ height: '12px' }}></div>
          )}

          {!chartLoading && (
            <div className="area-economy-table-wrap">
              {error && ![202, 203, 204, 100].includes(error?.returncode) ? (
                <Empty type={Empty.MODULE_LOAD_FAIL} onClick={retryGetData} />
              ) : show && needData?.tableData?.length ? (
                <Table columns={columns} start="24" end="35" type="stickyTable" dataSource={needData?.tableData} />
              ) : (
                <>
                  {!loading && !show ? <Empty type={Empty.NO_NEW_RELATED_DATA} className="noNewRelatedData" /> : null}
                </>
              )}
            </div>
          )}
        </>
      )}
    </S.Container>
  );
};
