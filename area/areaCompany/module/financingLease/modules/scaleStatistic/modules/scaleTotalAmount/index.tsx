import { FC, useState, useMemo } from 'react';

import { useMemoizedFn } from 'ahooks';
import dayjs from 'dayjs';
import styled from 'styled-components';

import { transformRegionCode } from '@pages/area/areaCompany/module/financingLease/modules/scaleStatistic';
import { useParams } from '@pages/area/areaF9/hooks';

import { Spin, Empty } from '@/components/antd';

import useChooseColumn from '../..//components/detailModal/useChooseColumn';
import DetailModal from '../../components/detailModal';
import { CommonScreen, totalDisabledDate, defaultValueDateBySeason, DATE } from '../../components/screen';
import Table from '../../components/table';
import { ChangeFilter, DetailModalExportType } from '../../config';
import useHandleDetailModal from '../../hooks/useHandleDetailModal';
import useHandleTableData from '../../hooks/useHandleTableData';
import { RequestParamsCommonType } from '../../types';
import { monthConvertToSeasonTime } from '../scaleExpiringEvents';
import { useScreenConfig } from './useScreenConfig';
import { columnConfig } from './useTableConfig';

const initParams: RequestParamsCommonType = {
  from: 0,
  size: 50,
  dimension: 'scale',
  statisticType: 'total',
  registerStartDateFrom: DATE.prevYear.format('YYYY-MM'),
  registerStartDateTo: DATE.nowDate.format('YYYY-MM'),
};

const ScaleTotalAmount: FC = () => {
  const { regionCode } = useParams();

  const [ctrl, setCtrl] = useState('1');

  const { screenData, loading: scLoading } = useScreenConfig({ ctrl });

  const [restProp, setRestProp] = useState<Record<string, any>>({ registerStartDateFrom: '', registerStartDateTo: '' });

  const {
    total,
    loading,
    screenRef,
    curentPage,
    currentSort,
    firstLoading,
    renderFilter,
    tableResultData,
    setCurrentSort,
    updateIntegration,
    clearCurrentFilter,
    handleFilterChangeMemo,
    tableParamsData,
    debounceScreenHeadHeight,
  } = useHandleTableData({
    initParams: {
      ...initParams,
      ...transformRegionCode(regionCode),
    },
  });

  const {
    title,
    visible,
    modalType,
    detailTotal,
    detailLoading,
    detailParamsData,
    detailResultData,
    curentDetailPage,
    handlePageChange,
    handleNumModalWithTotal,
    closeNumModal,
  } = useHandleDetailModal({
    ctrl,
    tableParamsData,
    restProp,
    setRestProp,
  });

  const { column } = useChooseColumn({ type: modalType });

  const handleScreenChange = useMemoizedFn((changeType, data) => {
    const typeData = data[0]?.value;

    if (changeType === 'statisticTime') {
      const [start, end] = defaultValueDateBySeason.get(typeData)![0];
      const pickerFormat = typeData === '3' ? 'YYYY' : 'YYYY-MM';
      let dateRange;
      /** 按照季度处理默认日期 */
      if (typeData === '2') {
        let start_year = dayjs(start).format('YYYY'),
          end_year = dayjs(end).format('YYYY'),
          start_month = monthConvertToSeasonTime(start, 'start'),
          end_month = monthConvertToSeasonTime(end, 'end');
        dateRange = {
          registerStartDateFrom: `${start_year}-${start_month}`,
          registerStartDateTo: `${end_year}-${end_month}`,
        };
      } else {
        dateRange = {
          registerStartDateFrom: dayjs(start).format(pickerFormat),
          registerStartDateTo: dayjs(end).format(pickerFormat),
        };
      }
      setCtrl(typeData);
      updateIntegration({ statisticPeriod: typeData, ...dateRange });
    }
    if (changeType === 'rangePick') {
      const [start, end] = data;
      const pickerFormat = typeData === '3' ? 'YYYY' : 'YYYY-MM';
      let dateRange;
      if (ctrl === '2') {
        dateRange = {
          registerStartDateFrom: dayjs(start).format(pickerFormat),
          registerStartDateTo: dayjs(end).add(2, 'month').format(pickerFormat),
        };
      } else {
        dateRange = {
          registerStartDateFrom: dayjs(start).format(pickerFormat),
          registerStartDateTo: dayjs(end).format(pickerFormat),
        };
      }
      updateIntegration(dateRange);
    }
  });
  const tableTsx = useMemo(() => {
    return (
      <Table
        data={tableResultData?.data.list}
        total={total}
        quarterFormat={ctrl}
        loading={loading}
        paginationSize={50}
        currentPage={curentPage}
        indicators={columnConfig}
        currentSort={currentSort}
        setCurrentSort={setCurrentSort}
        onClickNumModal={handleNumModalWithTotal}
        headFixedPosition={debounceScreenHeadHeight}
        onSortChange={handleFilterChangeMemo(ChangeFilter.SORT)}
        onPageChange={handleFilterChangeMemo(ChangeFilter.PAGE_CHANGE)}
      />
    );
  }, [
    ctrl,
    curentPage,
    currentSort,
    debounceScreenHeadHeight,
    handleFilterChangeMemo,
    handleNumModalWithTotal,
    loading,
    setCurrentSort,
    tableResultData?.data.list,
    total,
  ]);
  return firstLoading || scLoading ? (
    <div className="full-empty-content">
      <Spin type={'thunder'} />
    </div>
  ) : (
    <PageWrapper>
      {renderFilter ? (
        <CommonScreen
          total={total}
          config={screenData as any}
          screenRef={screenRef}
          tableData={tableResultData?.data}
          disabledDate={totalDisabledDate}
          onAreaChange={handleFilterChangeMemo(ChangeFilter.AREA)}
          onIndustryChange={handleFilterChangeMemo(ChangeFilter.INDUSTRY)}
          onLesseeClassifyChange={handleFilterChangeMemo(ChangeFilter.LESSEE_TYPE)}
          dispatchChange={handleScreenChange}
          exportInfo={{
            exportCondition: {
              ...tableParamsData.requestParams,
              module_type: 'financeLease_scale_total',
              from: '0',
              size: '1000',
            },
            fileName: '租赁融资事件按规模统计-投放总量',
          }}
        />
      ) : null}
      <div className={'tableWrapper'}>
        {!tableResultData?.data?.list?.length ? (
          <Empty type={Empty.NO_DATA_IN_FILTER_CONDITION} onClick={clearCurrentFilter} />
        ) : (
          tableTsx
        )}
      </div>

      {visible ? (
        <DetailModal
          title={title}
          loading={detailLoading}
          visible={visible}
          total={detailTotal}
          exportFileName={`按规模统计-投放总量-${title}`}
          exportCondition={{
            ...detailParamsData.requestParams,
            module_type: DetailModalExportType?.[modalType],
            from: '0',
            size: '1000',
          }}
          columnsConf={column}
          data={detailResultData?.data?.list}
          currentPage={curentDetailPage}
          onPageChange={handlePageChange}
          setVisible={closeNumModal}
        />
      ) : null}
    </PageWrapper>
  );
};

const PageWrapper = styled.div`
  .tableWrapper {
    height: calc(100% - 40px);
    margin-bottom: 16px;
  }
  .ant-table-container {
    .ant-table-thead {
      > tr {
        > th {
          div {
            // antd 排序的一些样式
            margin-top: 0 !important;
            /* margin-left: 4px; */
            align-items: center;
            padding: 0;
            // 可控制表头的 align 根据需要改
            justify-content: right !important;
            .ant-table-column-sorter-full {
              position: relative;
              top: 1px;
              margin-top: 0;
              /* margin-left: 4px; */
            }
            .ant-table-column-title {
              flex: initial;
              text-align: right;
              width: fit-content;
            }
          }
        }
        > th:first-child {
          padding: 6px 8px !important;
        }
        > th:nth-child(2) {
          div {
            // 第二列表头居中
            justify-content: center !important;
          }
        }
      }
    }
  }
`;
export default ScaleTotalAmount;
