import { FC, useEffect, useMemo, useRef } from 'react';

import { Table, Modal } from '@dzh/components';
import dayjs from 'dayjs';
import styled from 'styled-components';

import { Empty, Spin } from '@/components/antd';
import ExportDoc from '@/components/exportDoc';
import { isCity, isCounty, isProvince } from '@/pages/area/areaEconomy/common';
import { useSelector } from '@/pages/area/areaF9/context';
import { TableWrapper, HeaderModalWrapper } from '@/pages/area/areaF9/modules/regionalFinancialResources/common/style';
import { EmptyContent } from '@/pages/area/financialResources/module/common/style';
import { detailType } from '@/pages/area/financialResources/module/common/type';
import { thousandSeparatorStringToNumber } from '@/utils/format';
import { useECharts } from '@/utils/hooks';

import useChartOption from './useChartOption';
import useColumns from './useColumns';
import useLogic from './useLogic';

import styles from '@/pages/area/financialResources/module/creditDetail/detail/style.module.less';

interface IProps {
  modalVisable: boolean;
  setModalVisable: (visable: boolean) => void;
  getContainer: () => HTMLElement;
  detail: detailType;
}

const Index: FC<IProps> = ({ modalVisable, setModalVisable, detail, getContainer }) => {
  const areaInfo = useSelector((store) => store.areaInfo);
  const { regionCode, regionName } = areaInfo || {};
  const contentRef = useRef(null);

  // 地区参数处理
  const region = useMemo(() => {
    const rebuildRegionCode = regionCode && String(regionCode);
    if (rebuildRegionCode) {
      if (isProvince(rebuildRegionCode)) return { regionCode: rebuildRegionCode };
      if (isCity(rebuildRegionCode)) return { regionCode: rebuildRegionCode };
      if (isCounty(rebuildRegionCode)) return { regionCode: rebuildRegionCode };
    }
  }, [regionCode]);

  const { firstLoaded, pager, condition, listData, loading } = useLogic(region, detail.code);

  const column = useColumns({ pager, regionName });
  const rebuildData = listData.map((item, index) => ({
    index,
    reportPeriod: item?.[1],
    totalCreditLimit: item?.[2] || '',
    ratio: item?.[3],
  }));
  const dateArray = useMemo(() => rebuildData.map((o) => o.reportPeriod), [rebuildData]);
  const stockArray = useMemo(
    () => rebuildData.map((o) => thousandSeparatorStringToNumber(o.totalCreditLimit)),
    [rebuildData],
  );
  const ratioArray = useMemo(() => rebuildData.map((o) => o.ratio), [rebuildData]);
  const option = useChartOption(dateArray, stockArray, ratioArray, regionName || '');
  const [chartRef, chartInstance] = useECharts(option);

  useEffect(() => {
    if (chartInstance) {
      chartInstance.setOption(option);
    }
  }, [chartInstance, option]);

  const content = useMemo(() => {
    return (
      <>
        {!firstLoaded && loading ? (
          <SpinWrapper>
            <Spin spinning={!firstLoaded} type={'thunder'} tip="加载中" />
          </SpinWrapper>
        ) : rebuildData?.length ? (
          <>
            <div className="chart-title">
              <span>亿元</span>
              <span>%</span>
            </div>
            <div className={styles.chart} ref={chartRef} style={{ marginBottom: '10px' }} />
            <TableWrapper>
              <Table
                columnLayout="fixed"
                columns={column as any}
                dataSource={rebuildData.reverse()}
                showSorterTooltip={false}
                scroll={{ x: '100%' }}
                sticky={{
                  offsetHeader: 0,
                  getContainer: () => contentRef.current!,
                }}
              />
            </TableWrapper>
          </>
        ) : null}
        {!loading && !rebuildData?.length ? (
          <EmptyContent>
            <Empty type={Empty.NO_DATA_NEW_IMG} />
          </EmptyContent>
        ) : null}
      </>
    );
  }, [column, firstLoaded, rebuildData, chartRef, loading]);

  return (
    <Modal.FullScreen
      title={`${detail.name}-${detail.columnName}`}
      extra={
        <HeaderModalWrapper>
          <div className="num">
            共 <span>{pager.total || '-'}</span> 条
          </div>
          <div>
            <ExportDoc
              condition={{
                ...condition,
                module_type: 'creditScaleHistoricalTrend',
                sheetNames: { '0': `${detail.name}-${detail.columnName}` },
                pageSize: '',
                skip: 0,
                exportFlag: true,
              }}
              filename={`${regionName}-${detail.name}-${detail.columnName}-${dayjs(new Date()).format('YYYYMMDD')}`}
            />
          </div>
        </HeaderModalWrapper>
      }
      open={modalVisable}
      onCancel={() => {
        setModalVisable(false);
      }}
      footer={null}
      destroyOnClose
      getContainer={getContainer}
      scrollRef={contentRef}
    >
      {content}
    </Modal.FullScreen>
  );
};

export default Index;

const SpinWrapper = styled.div`
  /* 解决加载icon不居中 */
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .ant-spin-container {
    height: 100%;
  }
`;
