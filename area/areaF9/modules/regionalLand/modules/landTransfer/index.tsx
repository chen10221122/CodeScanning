import { FC, memo, useState, useMemo, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import { Table, PaginationProps, Empty } from '@dzh/components';
// import { LockLayer } from '@dzh/pro-components';
import { useMemoizedFn, useSize, useDebounceEffect } from 'ahooks';
import dayjs from 'dayjs';
import shortid from 'shortid';
import styled from 'styled-components';

import { useParams } from '@pages/area/areaF9/hooks';
import WrapperContainer from '@pages/area/areaF9/modules/regionalLand/components/wrapperContainer';

import { Spin } from '@/components/antd';
import Chart from '@/pages/area/areaF9/modules/regionalLand/components/chart/chart';
import DetailsModal from '@/pages/area/areaF9/modules/regionalLand/components/detailsModal';
import {
  ScreeTimeType,
  LAND_TRANSFER_CHARTDATA,
  StatisticsScopeType,
} from '@/pages/area/areaF9/modules/regionalLand/const';
import HeaderFilter from '@/pages/area/areaF9/modules/regionalLand/modules/landTransfer/components/headerFilter';
import { Provider, useCtx } from '@/pages/area/areaF9/modules/regionalLand/modules/landTransfer/provider';
import useColumns from '@/pages/area/areaF9/modules/regionalLand/modules/landTransfer/useColumns';
import useData from '@/pages/area/areaF9/modules/regionalLand/modules/landTransfer/useData';
import { extractedData } from '@/pages/area/areaF9/modules/regionalLand/utils';
import { getAreaLevel } from '@/pages/bond/cityInvestSpread/utils';
import useLoading from '@/pages/detail/hooks/useLoading';
import { IRootState } from '@/store';
import { removeObjectNil } from '@/utils/share';

import styles from '@/pages/area/areaF9/modules/regionalLand/modules/landTransfer/styles.module.less';

const Main: FC = () => {
  const {
    state: { dateFilter, otherFilter },
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
    timeStatisticsType: ScreeTimeType.YEAR,
    transferDate: `(*,${dayjs().endOf('year').format('YYYY-MM-DD')}]`,
  };

  const newParams = useMemo(() => {
    return removeObjectNil({
      [date]: `(*,${dayjs().endOf('year').format('YYYY-MM-DD')}]`,
      ...otherFilter,
      sort: sort.sortKey ? `${sort.sortKey}:${sort.sortRule}` : '',
      ...areaCodeObj,
      timeStatisticsType: ScreeTimeType.YEAR,
      statisticsScope: StatisticsScopeType.HAS_CHILDREN,
    });
  }, [date, otherFilter, areaCodeObj, sort]);

  useEffect(() => {
    // 只在新旧参数不同时才更新
    if (JSON.stringify(params) !== JSON.stringify(newParams)) {
      setParams(newParams);
    }
  }, [newParams, params]);

  const modalPramas = useMemo(
    () =>
      removeObjectNil({
        [date]: `[${modalData?.detailDate}]`,
        ...areaCodeObj,
        statisticsScope: StatisticsScopeType.HAS_CHILDREN,
        stage: modalData?.stage || '',
      }),
    [date, areaCodeObj, modalData],
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
        : 58,
  });
  const { dataSource, loading, total } = useData(params);
  const skeletonLoading = useLoading(loading);
  const hasPay = useSelector((store: IRootState) => store.user.info).havePay;
  const showLockLayer = !hasPay && total > 3;
  const containerRef = useRef<HTMLDivElement>(null);
  const { height: tableHeight = 0 } = useSize(containerRef) || {};

  const pagination: PaginationProps | false = useMemo(
    () =>
      !showLockLayer && total > 50
        ? {
            current: currentPage,
            total,
            pageSize: 50,
            size: 'small',
            showSizeChanger: false,
            hideOnSinglePage: true,
            onchange,
          }
        : false,
    [currentPage, showLockLayer, total],
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

  useEffect(() => {
    // 首次进入页面横滚动条不出现问题
    if (!skeletonLoading) {
      window.dispatchEvent(new Event('resize'));
    }
  }, [skeletonLoading]);

  // echart图相关数据处理，传给chart组件
  const chartData = useMemo(() => {
    const sortedData = [...dataSource].sort((a, b) => Number(a.date) - Number(b.date));
    // const properties = ['date', 'landArea', 'landDealPrice', 'landDealTotalArea'];
    const formatedData = extractedData(LAND_TRANSFER_CHARTDATA, sortedData);
    const { date, landArea, landDealPrice, landDealTotalArea } = formatedData;
    const xAxisData = date;
    const data = [
      {
        data: landArea,
        name: '推出面积(万㎡)',
        type: 'bar',
        color: '#3B87FF',
        barWidth: 12,
      },
      {
        data: landDealTotalArea,
        name: '土地成交总面积(万㎡)',
        type: 'bar',
        color: '#51DEFF',
        barWidth: 12,
      },
      {
        data: landDealPrice,
        name: '成交土地均价(元/㎡)',
        type: 'smoothLine',
        color: '#FF9630',
        barWidth: 50,
        yAxisIndex: 1,
      },
    ];
    const legendData = [
      {
        name: '推出面积(万㎡)',
        icon: 'rect',
      },
      {
        name: '土地成交总面积(万㎡)',
        icon: 'rect',
      },
      {
        name: '成交土地均价(元/㎡)',
      },
    ];
    const yAxisData = [
      {
        text: '万㎡',
        padding: [1, 0, 0, 0],
        left: 0,
        textStyle: {
          color: '#494949',
          fontSize: 12,
          fontWeight: 400,
        },
      },
      {
        text: '元/㎡',
        padding: [1, 0, 0, 0],
        right: 0,
        textStyle: {
          color: '#494949',
          fontSize: 12,
          fontWeight: 400,
        },
      },
    ];
    return { xAxisData, data, legendData, yAxisData, legendBottom: 12, gridBottom: 27, itemGap: 20 };
  }, [dataSource]);

  // 导出参数，传给headerFilter组件
  const condition = {
    module_type: 'annual_landtransfer_web',
    sheetNames: { '0': '历年土地趋势' },
    ...params,
    exportFlag: true,
    frequency: 1,
    isPost: true,
    picCol: 12,
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
              {/* <Spin type="square" spinning={loading} tip="加载中"> */}
              <div className="social-finance-chart-wrapper" ref={DrawImgDomRef}>
                <Chart chartData={chartData} />
              </div>
              <div className={styles['social-finance-table-wrapper']} ref={containerRef}>
                <Table
                  sticky={{
                    offsetHeader: 36,
                    getContainer: () => (document.getElementById('main-container') as HTMLDivElement) || document.body,
                  }}
                  pagination={pagination}
                  loading={{ spinning: loading, type: 'square', translucent: true, keepCenter: true }}
                  onlyBodyLoading
                  scroll={{ x: '100%' }}
                  onChange={onTableChange}
                  columns={columns}
                  dataSource={dataSource}
                />
              </div>
              {/* </Spin> */}
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
      title="历年土地出让趋势"
      content={Content}
      showLockLayer={showLockLayer}
      loading={skeletonLoading}
      tableLoading={loading}
      offsetTop={tableHeight + 200}
      backup={true}
      filter={filter}
    ></WrapperContainer>
  );
};

const LandTransfer = () => {
  return (
    <Provider>
      <Main />
    </Provider>
  );
};
export default memo(LandTransfer);

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
    margin-bottom: 0px;
  }
`;
