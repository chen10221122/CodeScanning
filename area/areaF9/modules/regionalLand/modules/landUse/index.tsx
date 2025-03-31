import { FC, memo, useState, useMemo, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import { Table, PaginationProps, Empty } from '@dzh/components';
import { useMemoizedFn, useSize, useDebounceEffect } from 'ahooks';
import dayjs from 'dayjs';
import shortid from 'shortid';
import styled from 'styled-components';

import { useParams } from '@pages/area/areaF9/hooks';
import WrapperContainer from '@pages/area/areaF9/modules/regionalLand/components/wrapperContainer';

import { Spin } from '@/components/antd';
import Chart from '@/pages/area/areaF9/modules/regionalLand/components/chart/chart';
import DescriptionIcon from '@/pages/area/areaF9/modules/regionalLand/components/descriptionIcon';
import DetailsModal from '@/pages/area/areaF9/modules/regionalLand/components/detailsModal';
import { ScreeTimeType, LAND_USE_CHARTDATA, StatisticsScopeType } from '@/pages/area/areaF9/modules/regionalLand/const';
import { Provider, useCtx } from '@/pages/area/areaF9/modules/regionalLand/modules/landTransfer/provider';
import useData from '@/pages/area/areaF9/modules/regionalLand/modules/landTransfer/useData';
import HeaderFilter from '@/pages/area/areaF9/modules/regionalLand/modules/landUse/components/headerFilter';
import useColumns from '@/pages/area/areaF9/modules/regionalLand/modules/landUse/useColumns';
import { formatDate, extractedData } from '@/pages/area/areaF9/modules/regionalLand/utils';
import { getAreaLevel } from '@/pages/bond/cityInvestSpread/utils';
import useLoading from '@/pages/detail/hooks/useLoading';
import { IRootState } from '@/store';
import { removeObjectNil } from '@/utils/share';

import styles from '@/pages/area/areaF9/modules/regionalLand/modules/landTransfer/styles.module.less';

const Main: FC = () => {
  const {
    state: { dateFilter, otherFilter, chartType },
    update,
  } = useCtx();
  const DEFAULT_SORT = { sortKey: 'date', sortRule: 'desc' };

  // 拿地区code
  const { code } = useParams();
  // 拿地区级别,构建地区代码参数
  const level = getAreaLevel(`${code}`);
  // 参数之一：xx级地区代码
  const areaCodeObj = useMemo(() => {
    const key = level === '1' ? 'provinceCode' : level === '2' ? 'cityCode' : 'countyCode';
    return { [key]: code };
  }, [code, level]);
  // 参数之一：日期口径字段
  const date: string = Object.keys(dateFilter)[0] || 'transferDate';
  const [sort, setSort] = useState({ ...DEFAULT_SORT });
  const [params, setParams] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState<any>(); // 弹窗的数据
  const DrawImgDomRef = useRef<HTMLDivElement>(null);
  const [fileBase64, setFileBase64] = useState('');

  // 表格与弹窗的请求参数构建
  const initpramas = {
    ...areaCodeObj,
    sort: 'date:desc',
    statisticsScope: StatisticsScopeType.HAS_CHILDREN,
    // 所处阶段筛选成交宗数
    stage: '2,3',
    size: 50,
    from: 0,
    timeStatisticsType: ScreeTimeType.YEAR,
    transferDate: `(*,${dayjs().endOf('year').format('YYYY-MM-DD')}]`,
  };

  const newParams = useMemo(
    () =>
      removeObjectNil({
        [date]: `(*,${dayjs().endOf('year').format('YYYY-MM-DD')}]`,
        // contractSignDate: '(*,2024-11-13]',
        ...otherFilter,
        size: 50,
        from: 50 * (currentPage - 1),
        sort: sort.sortKey ? `${sort.sortKey}:${sort.sortRule}` : '',
        ...areaCodeObj,
        stage: '2,3',
        statisticsScope: StatisticsScopeType.HAS_CHILDREN,
      }),
    [date, otherFilter, areaCodeObj, sort, currentPage],
  );

  useEffect(() => {
    // 只在新旧参数不同时才更新
    if (JSON.stringify(params) !== JSON.stringify(newParams)) {
      setParams(newParams);
    }
  }, [newParams, params]);

  const modalPramas = useMemo(
    () =>
      removeObjectNil({
        /* detailDate在usecolums里处理了，无论中台返回的date是什么字符串，
        都对应处理成[yyyy-mm-dd,yyyy-mm-dd]格式*/
        [date]: `[${modalData?.detailDate}]`,
        ...areaCodeObj,
        statisticsScope: StatisticsScopeType.HAS_CHILDREN,
        // 包括年、月、季、半年
        ...otherFilter,
        stage: '2,3',
        // 区分土地用途
        landUsageFirstType: modalData?.landUsageFirstType || '',
        landUsageSecondType: modalData?.landUsageSecondType || '',
      }),
    [date, areaCodeObj, modalData, otherFilter],
  );

  // 表格相关方法数据
  const columns = useColumns({
    setModalVisible,
    setModalData,
    currentPage,
    dateWidth:
      otherFilter.timeStatisticsType === ScreeTimeType.MONTH
        ? 80
        : otherFilter.timeStatisticsType === ScreeTimeType.QUARTER
        ? 110
        : otherFilter.timeStatisticsType === ScreeTimeType.HALF_YEAR
        ? 110
        : 60,
  });
  const { dataSource, loading, total } = useData(params);
  const skeletonLoading = useLoading(loading);
  const hasPay = useSelector((store: IRootState) => store.user.info).havePay;
  const showLockLayer = !hasPay && total > 3;
  const containerRef = useRef<HTMLDivElement>(null);
  const { height: tableHeight = 0 } = useSize(containerRef) || {};

  useEffect(() => {
    // 首次进入页面横滚动条不出现问题
    if (!skeletonLoading) {
      window.dispatchEvent(new Event('resize'));
    }
  }, [skeletonLoading]);

  const pagination: PaginationProps | false = useMemo(
    () =>
      !showLockLayer && total > 50
        ? {
            current: currentPage,
            total,
            pageSize: 50,
            size: 'small',
            showSizeChanger: false,
            onchange,
          }
        : false,
    [currentPage, total, showLockLayer],
  );
  const onTableChange = useMemoizedFn((pagination, _, sorter, { action }) => {
    if (action === 'paginate') {
      setCurrentPage(pagination.current);
    }
    if (action === 'sort') {
      const { field, order } = sorter;
      if (order) {
        setSort({ sortKey: field, sortRule: order === 'ascend' ? 'asc' : 'desc' });
      } else {
        setSort({ sortKey: '', sortRule: '' });
      }
    }
  });

  const onCleanClick = useMemoizedFn(() => {
    // 初始化pramas
    setParams(initpramas);
    // 刷新筛选
    update((draft) => {
      draft.screenKey = shortid.generate();
    });
  });

  // echart图相关数据处理，传给chart组件
  const chartData = useMemo(() => {
    const sortedData = [...dataSource].sort((a, b) => Number(formatDate(a.date)) - Number(formatDate(b.date)));
    const formatedData = extractedData(LAND_USE_CHARTDATA, sortedData);
    const {
      date,
      landDealTotalPrice,
      landDealTotalPriceResidential,
      landDealTotalPriceBusiness,
      landDealTotalPriceMining,
      landDealTotalPriceOther,
      landDealTotalArea,
      landDealTotalAreaResidential,
      landDealTotalAreaBusiness,
      landDealTotalAreaMining,
      landDealTotalAreaOther,
      landDealTotalCount,
      landDealTotalCountResidential,
      landDealTotalCountBusiness,
      landDealTotalCountMining,
      landDealTotalCountOther,
    } = formatedData;
    const xAxisData = date;
    const data = [
      {
        data:
          chartType[0]?.value === 'money'
            ? landDealTotalPriceResidential
            : chartType[0]?.value === 'area'
            ? landDealTotalAreaResidential
            : landDealTotalCountResidential,
        name:
          chartType[0]?.value === 'money'
            ? '住宅用地(亿元)'
            : chartType[0]?.value === 'area'
            ? '住宅用地(万㎡)'
            : '住宅用地(宗)',
        color: '#3B87FF',
        barWidth: 16, // 将该条形图的宽度设为0
      },
      {
        data:
          chartType[0]?.value === 'money'
            ? landDealTotalPriceBusiness
            : chartType[0]?.value === 'area'
            ? landDealTotalAreaBusiness
            : landDealTotalCountBusiness,
        name:
          chartType[0]?.value === 'money'
            ? '商服用地(亿元)'
            : chartType[0]?.value === 'area'
            ? '商服用地(万㎡)'
            : '商服用地(宗)',
        color: '#7FB1FF',
        barWidth: 16,
      },
      {
        data:
          chartType[0]?.value === 'money'
            ? landDealTotalPriceMining
            : chartType[0]?.value === 'area'
            ? landDealTotalAreaMining
            : landDealTotalCountMining,
        name:
          chartType[0]?.value === 'money'
            ? '工矿仓储用地(亿元)'
            : chartType[0]?.value === 'area'
            ? '工矿仓储用地(万㎡)'
            : '工矿仓储用地(宗)',
        color: '#BBD5FF',
        barWidth: 16,
      },
      {
        data:
          chartType[0]?.value === 'money'
            ? landDealTotalPriceOther
            : chartType[0]?.value === 'area'
            ? landDealTotalAreaOther
            : landDealTotalCountOther,
        name:
          chartType[0]?.value === 'money'
            ? '其他用地(亿元)'
            : chartType[0]?.value === 'area'
            ? '其他用地(万㎡)'
            : '其他用地(宗)',
        color: '#E2EDFF',
        barWidth: 16,
      },
    ];
    const legendData = [
      {
        name:
          chartType[0]?.value === 'money'
            ? '住宅用地(亿元)'
            : chartType[0]?.value === 'area'
            ? '住宅用地(万㎡)'
            : '住宅用地(宗)',
        icon: 'rect',
      },
      {
        name:
          chartType[0]?.value === 'money'
            ? '商服用地(亿元)'
            : chartType[0]?.value === 'area'
            ? '商服用地(万㎡)'
            : '商服用地(宗)',
        icon: 'rect',
      },
      {
        name:
          chartType[0]?.value === 'money'
            ? '工矿仓储用地(亿元)'
            : chartType[0]?.value === 'area'
            ? '工矿仓储用地(万㎡)'
            : '工矿仓储用地(宗)',
        icon: 'rect',
      },
      {
        name:
          chartType[0]?.value === 'money'
            ? '其他用地(亿元)'
            : chartType[0]?.value === 'area'
            ? '其他用地(万㎡)'
            : '其他用地(宗)',
        icon: 'rect',
      },
    ];
    // Tooltip要加全部数据，但图上不要
    const AllDataforTooltip = {
      data:
        chartType[0]?.value === 'money'
          ? landDealTotalPrice
          : chartType[0]?.value === 'area'
          ? landDealTotalArea
          : landDealTotalCount,
      name:
        chartType[0]?.value === 'money'
          ? '全部用地(亿元)'
          : chartType[0]?.value === 'area'
          ? '全部用地(万㎡)'
          : '全部用地(宗)',
    };
    const yAxisData = [
      {
        text: chartType[0]?.value === 'money' ? '亿元' : chartType[0]?.value === 'area' ? '万㎡' : '宗',
        padding: [1, 0, 0, 0],
        left: 0,
        textStyle: {
          color: '#494949',
          fontSize: 12,
          fontWeight: 400,
        },
      },
    ];
    return {
      xAxisData,
      yAxisData,
      data,
      legendData,
      AllDataforTooltip,
      legendBottom: 12,
      gridBottom: 27,
      itemGap: 20,
    };
  }, [dataSource, chartType]);
  // 导出参数，传给headerFilter组件
  const condition = {
    module_type: 'landDeal_use_web',
    sheetNames: { '0': '土地成交统计(按土地用途)' },
    ...params,
    exportFlag: true,
    frequency: 1,
    isPost: true,
    picCol: 11,
  };
  const filter = (
    <HeaderFilter total={total} condition={condition} fileBase64={fileBase64} setCurrentPage={setCurrentPage} />
  );

  const Content = useMemo(() => {
    return (
      <Container>
        <>
          {dataSource?.length ? (
            <div className={styles['social-finance-module-loading']}>
              <div className="social-finance-chart-wrapper">
                <div className="chart-wrapper" ref={DrawImgDomRef}>
                  <Chart chartData={chartData} />
                </div>
              </div>
              <div className="description-icon">
                <DescriptionIcon
                  value={
                    '注：日期口径默认成交起始日，区域土地专题默认出让起始日。如需与区域土地专题对照数据，需统一日期口径。'
                  }
                />
              </div>
              <div className={styles['social-finance-table-wrapper']} ref={containerRef}>
                <Table
                  sticky={{
                    offsetHeader: 36,
                    getContainer: () => (document.getElementById('main-container') as HTMLDivElement) || document.body,
                  }}
                  pagination={pagination}
                  loading={{ spinning: loading, type: 'square', translucent: true }}
                  onlyBodyLoading
                  scroll={{
                    x: 1670,
                  }}
                  onChange={onTableChange}
                  columns={columns}
                  dataSource={dataSource}
                />
              </div>
            </div>
          ) : !skeletonLoading ? (
            <Spin type="thunder" spinning={loading} tip="加载中">
              <Empty type={Empty.NO_SCREEN_DATA} onCleanClick={onCleanClick} />
            </Spin>
          ) : null}
        </>

        {modalVisible ? (
          <DetailsModal
            show={modalVisible}
            modalPramas={modalPramas}
            otherData={modalData}
            setVisible={setModalVisible}
          />
        ) : null}
      </Container>
    );
  }, [
    columns,
    skeletonLoading,
    dataSource,
    modalVisible,
    pagination,
    loading,
    onTableChange,
    modalPramas,
    modalData,
    onCleanClick,
    chartData,
  ]);

  useDebounceEffect(
    () => {
      if (DrawImgDomRef.current && chartData) {
        let canvasList = DrawImgDomRef.current.querySelectorAll('canvas'),
          canvas = document.createElement('canvas'),
          ctx = canvas.getContext('2d');
        let height = 0,
          width = 0,
          len = canvasList.length;
        if (len) {
          const obj = getComputedStyle(canvasList[0]);

          height = parseInt(obj.height);
          width = parseInt(obj.width);
        }

        canvas.width = width + 20;
        canvas.height = height * len;

        if (ctx) {
          ctx.rect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = 'white';
          ctx.fill();

          canvasList.forEach((canvas, i) => {
            ctx && ctx.drawImage(canvas, 10, height * i, width, height);
          });
          setFileBase64(canvas.toDataURL('image/jpeg').replace('data:image/jpeg;base64,', ''));
        }
      }
    },
    [setFileBase64, chartData],
    // { wait: 500 },
  );

  return (
    <WrapperContainer
      title="土地成交统计（按土地用途）"
      content={Content}
      filter={filter}
      showLockLayer={showLockLayer}
      loading={skeletonLoading}
      tableLoading={loading}
      offsetTop={tableHeight + 200}
      backup={true}
    ></WrapperContainer>
  );
};

const LandUse = () => {
  return (
    <Provider>
      <Main />
    </Provider>
  );
};
export default memo(LandUse);

const Container = styled.div`
  .ant-empty {
    padding-top: 15vh;
  }
  .card-title {
    padding-left: 0px;
    font-weight: 400 !important;
    &::before {
      display: none;
    }
  }
  .social-finance-chart-wrapper {
    height: 227px;
    padding: 0;
  }
  .chart-wrapper {
    height: 227px;
  }
  .description-icon {
    margin: 0 0 6px 8px;
  }
`;
