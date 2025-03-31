import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Table } from '@dzh/components';
import { useMemoizedFn, useSize, useUpdateEffect } from 'ahooks';
import dayjs from 'dayjs';
import styled from 'styled-components';

// import { Icon } from '@/components';
import { Empty, Spin } from '@/components/antd';
import BackTop from '@/components/backTop';
import ExportDoc from '@/components/exportDoc';
import Pagination from '@/components/Pagination';
import TileSingleMultipleSelect from '@/components/TileSingleMultipleSelect';
import { useTab } from '@/libs/route';
import { WrapperContainer } from '@/pages/area/areaF9/components';
import { useSelector } from '@/pages/area/areaF9/context';
import * as S from '@/pages/area/areaF9/style';
import { ExternalEntry } from '@/pages/bond/cityInvestSpreadInstrument/components/externalEntry';
import { CurveType } from '@/pages/bond/cityInvestSpreadInstrument/provider';
import TimePicker from '@/pages/detail/modules/bond/areaCastleThrow/modules/spreadAnalysis/components/timePicker';
import { formatNumber } from '@/utils/format';
import { useECharts } from '@/utils/hooks';

import InfoModal from './infoModal';
import useAreaSpreads from './useAreaSpreads';

const { href } = window.location;
const PAGESIZE = 50;
// const emptyCodes = [];

export default () => {
  const {
    pending: loading,
    needData,
    error,
    // code,
    fetchParams,
    isChangeParam,
    currentPage,
    currentKey,
    setCurrentPage,
    handleClear,
    onDateChange,
    onScreenChange,
  } = useAreaSpreads();
  const areaInfo = useSelector((store) => store.areaInfo);
  const [firstLoading, setFirstLoading] = useState(true);
  const tableRef = useRef(null);
  const [modal, setModal] = useState({
    show: false,
    title: '',
    name: '',
  });

  const handleClose = useCallback(() => {
    setModal((base) => {
      return { ...base, show: false };
    });
  }, []);

  const [chartRef, chartInstance] = useECharts(needData?.chartData, 'svg', href, false);

  const contentLeft = document.querySelector('#area-left-node');

  const { width: contentLeftWidth } = useSize(contentLeft) || { width: 0 };

  const containerRef = useRef('');

  useUpdateEffect(() => {
    if (!loading) setFirstLoading(false);
  }, [loading]);

  useEffect(() => {
    if (chartInstance) {
      chartInstance.setOption(needData?.chartData, true);
    }
  }, [chartInstance, needData, needData?.chartData]);

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
      window.removeEventListener('resize', resize);
      resizeOb.disconnect();
    };
  }, [chartInstance]);

  useTab({
    onActive() {
      if (chartInstance) {
        chartInstance?.current?.resize();
      }
    },
  });

  /** loading样式 */
  // const loadingTip = useMemo(() => {
  //   if (loading) {
  //     return {
  //       className: 'sort-page-loading',
  //       indicator: (
  //         <span className="loading-tips">
  //           <Icon
  //             style={{ width: 24, height: 24, marginTop: '20px', zIndex: 1 }}
  //             image={require('@/assets/images/common/loading.gif')}
  //           />
  //           <span className="loading-text">加载中</span>
  //         </span>
  //       ),
  //     };
  //   }
  // }, [loading]);

  const renderEmpty = useMemo(() => {
    if (error) {
      return <Empty type={Empty.LOAD_FAIL_LG} style={{ marginTop: 60 }} onClick={handleClear} />;
    } else if (isChangeParam) {
      return <Empty type={Empty.NO_DATA_IN_FILTER_CONDITION} style={{ marginTop: 60 }} onClick={handleClear} />;
    } else {
      return <Empty type={Empty.NO_DATA_NEW_IMG} style={{ marginTop: 60 }} />;
    }
  }, [error, isChangeParam, handleClear]);

  const scroll = useMemo(
    () =>
      needData?.tableCols.reduce(
        (pre, cur) => {
          if (cur.width) return { x: pre.x + Number(cur.width) };
          else return pre;
        },
        { x: 0 },
      ),
    [needData?.tableCols],
  );

  const headerRight = useMemo(
    () => (
      <ExternalEntry
        extraLinkInfo={needData?.originData.map((curve) => ({
          title: curve.curveName?.split('-')[0],
          code: String(curve.order),
          description: CurveType.REGION,
          extraLinkData: {
            remainingYear: '',
            // chinaBand: '1',
            bondTimeLimit: '0',
            xzLevel: curve.curveName.endsWith('地级市') ? '2' : curve.curveName.endsWith('区县级') ? '3' : undefined,
            self: curve.curveName.endsWith('本级') ? '1' : '2',
          },
        }))}
      />
    ),
    [needData?.originData],
  );

  const integrateTableData = useMemo(() => {
    const start = (currentPage - 1) * PAGESIZE;
    const end = start + PAGESIZE;
    return needData?.tableData?.slice(start, end) || [];
  }, [currentPage, needData?.tableData]);

  // 滚动到顶部
  const scrollTop = useMemoizedFn(() => {
    const spreadAnalysisComparison = document.getElementById('areaAnalysis-scroll-con');
    if (spreadAnalysisComparison) {
      spreadAnalysisComparison?.scrollIntoView({
        block: 'start',
      });
    }
  });

  const container = document.querySelector('.main-container') || document.body;

  const popoverInfo = {
    helpContent: (
      <PopContent>
        {`根据归属于该地区城投样本券利差中位数计算得出(剔除永续债、ABS、可转债）。
        其中城投样本券利差为该债券的中债估值收益率与剩余期限相同的国开收益率差值。`}
        <br />
        {`含权债优先以期限较短的行权估值计算，如行权后此债券依然存续且无行权估值，则取到期估值计算。`}
      </PopContent>
    ),
  };

  return (
    <WrapperContainer
      containerRef={containerRef}
      loading={firstLoading}
      popoverInfo={popoverInfo}
      containerStyle={{ overflowX: 'hidden' }}
      content={
        <>
          <S.Container padding={'2px'}>
            {modal.show ? <InfoModal {...modal} onClose={handleClose} /> : null}
            <SpinContainer contentLeftWidth={contentLeftWidth}>
              <Spin spinning={!firstLoading && loading} type="square">
                {
                  <>
                    {/* {emptyCodes.indexOf(code) === -1 ? (
                  <>
                    <div>
                      {needData?.chartData?.series?.length ? (
                        needData.chartData.series.length ? (
                          <div className="chart border-chart area-sprend-chart" ref={chartRef} />
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
                  <div style={{ height: '2px' }}></div>
                )} */}
                    {integrateTableData?.length ? (
                      <>
                        <div className="chart border-chart area-sprend-chart" ref={chartRef} />
                        <ScrollContainer id="areaAnalysis-scroll-con"></ScrollContainer>
                        <TableContainer ref={tableRef}>
                          <Table
                            alignSync
                            bordered
                            tableLayout="fixed"
                            columnLayout="fixed"
                            selectable={false}
                            onlyBodyLoading
                            pagination={false}
                            columns={needData?.tableCols || []}
                            scroll={scroll}
                            dataSource={integrateTableData}
                            sticky={{
                              offsetHeader: 77,
                              getContainer: () => container,
                            }}
                            showSorterTooltip={false}
                          />
                          {needData?.tableData?.length > PAGESIZE ? (
                            <Pagination
                              current={currentPage}
                              pageSize={PAGESIZE}
                              total={needData?.tableData?.length}
                              style={{ paddingTop: '8px' }}
                              onChange={(page) => {
                                scrollTop();
                                setCurrentPage(page);
                              }}
                              align={'left'}
                            />
                          ) : null}
                        </TableContainer>
                      </>
                    ) : (
                      renderEmpty
                    )}
                  </>
                }
              </Spin>
            </SpinContainer>
          </S.Container>
          <BackTop target={() => document.querySelector('.main-container') || window} />
        </>
      }
      headerRightContent={headerRight}
      headerBottomContent={
        <HeaderBottomWrap>
          <div className="screen-wrap">
            <TimePicker onChange={onDateChange} currentKey={currentKey}></TimePicker>
            <TileSingleMultipleSelect
              title="发行方式"
              onChange={onScreenChange}
              values={[fetchParams['issueMode']]}
              options={[
                { name: '公募', value: '1', key: 'issueMode' },
                { name: '私募', value: '2', key: 'issueMode' },
              ]}
            />
            <TileSingleMultipleSelect
              title="中债隐含评级"
              onChange={onScreenChange}
              values={[fetchParams['cnBondEvaluateLevel']]}
              options={[
                { name: 'AAA', value: '2', key: 'cnBondEvaluateLevel' },
                { name: 'AA+', value: '4', key: 'cnBondEvaluateLevel' },
                { name: 'AA', value: '5', key: 'cnBondEvaluateLevel' },
                { name: 'AA(2)', value: '6', key: 'cnBondEvaluateLevel' },
                { name: 'AA-', value: '7', key: 'cnBondEvaluateLevel' },
              ]}
            />
          </div>
          <div className="total-export">
            <div className="total">
              共 <span>{formatNumber(needData?.tableData?.length, 0) || 0}</span> 条
            </div>
            <ExportDoc
              condition={{
                ...fetchParams,
                regionCode: areaInfo?.regionCode,
                module_type: 'bond-interest-analysis-region-overview',
              }}
              filename={`${areaInfo?.regionName}-城投利差-${dayjs(new Date()).format('YYYYMMDD')}`}
            />
          </div>
        </HeaderBottomWrap>
      }
    ></WrapperContainer>
  );
};

const SpinContainer = styled.div`
  .ant-spin-nested-loading {
    .ant-spin-blur {
      overflow: visible !important;
      opacity: 0.2;
    }

    .ant-spin-spinning {
      position: fixed !important;
      top: 20% !important;
      left: ${(props) => props.contentLeftWidth / 2}px !important;
    }
  }
`;

const ScrollContainer = styled.div`
  position: relative;
  bottom: 80px;
`;

const TableContainer = styled.div`
  .ant-table-thead > tr > th:first-child,
  .ant-table-tbody > tr > td:first-child {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
  margin-bottom: 14px;
`;

const PopContent = styled.div`
  width: 303px;
  font-size: 12px;
  line-height: 18px;
  color: #434343;
`;

const HeaderBottomWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 9px;
  .screen-wrap {
    display: flex;
    align-items: center;

    > div:nth-of-type(1) {
      margin-right: 24px;
    }
  }
  .total-export {
    display: flex;
    align-items: center;
    .total {
      font-size: 13px;
      color: #8c8c8c;
      margin-right: 24px;
      > span {
        color: black;
      }
    }
  }
`;
