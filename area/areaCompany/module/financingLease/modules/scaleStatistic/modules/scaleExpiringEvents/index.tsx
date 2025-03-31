import { FC, useState, useMemo } from 'react';

import { useCreation, useMemoizedFn } from 'ahooks';
import dayjs from 'dayjs';
import styled, { createGlobalStyle } from 'styled-components';

import { transformRegionCode } from '@pages/area/areaCompany/module/financingLease/modules/scaleStatistic';
import { useParams } from '@pages/area/areaF9/hooks';

import { Spin, Empty } from '@/components/antd';

import DetailModal from '../../components/detailModal';
import useChooseColumn from '../../components/detailModal/useChooseColumn';
import { CommonScreen, willExpireDisabledDate, defaultValueDateBySeason, DATE } from '../../components/screen';
import Table from '../../components/table';
import { ChangeFilter, DetailModalExportType } from '../../config';
import useHandleDetailModal from '../../hooks/useHandleDetailModal';
import useHandleTableData from '../../hooks/useHandleTableData';
import { RequestParamsCommonType } from '../../types';
import { useScreenConfig } from './useScreenConfig';
import { columnConfig } from './useTableConfig';

const initParams: RequestParamsCommonType = {
  from: 0,
  size: 50,
  dimension: 'scale',
  statisticType: 'willExpire',
  endDateFrom: DATE.nowDate.format('YYYY-MM'),
  endDateTo: DATE.nextYear.format('YYYY-MM'),
};

const ScaleExpiringEvents: FC = () => {
  const { regionCode } = useParams();
  const [ctrl, setCtrl] = useState('1');

  const { screenData, loading: scLoading } = useScreenConfig({ ctrl });

  const [restProp, setRestProp] = useState<Record<string, any>>({ endDateFrom: '', endDateTo: '' });

  /** 默认日期联动筛选 */
  const initDate = useCreation(() => {
    let fmt: string;
    if (ctrl === '3') {
      fmt = 'YYYY';
    } else {
      fmt = 'YYYY-MM';
    }
    return {
      endDateFrom: DATE.nowDate.format(fmt),
      endDateTo: DATE.nextYear.format(fmt),
    };
  }, [ctrl]);

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
      ...initDate,
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
    handleNumModalWithWillExpire,
    closeNumModal,
  } = useHandleDetailModal({
    ctrl,
    tableParamsData,
    restProp,
    setRestProp,
  });

  const handleScreenChange = useMemoizedFn((changeType, data) => {
    const typeData = data[0]?.value;
    if (changeType === 'statisticTime') {
      const [start, end] = defaultValueDateBySeason.get(typeData)![1];
      const pickerFormat = typeData === '3' ? 'YYYY' : 'YYYY-MM';
      let dateRange;
      /** 按照季度处理默认日期 */
      if (typeData === '2') {
        let start_year = dayjs(start).format('YYYY'),
          end_year = dayjs(end).format('YYYY'),
          start_month = monthConvertToSeasonTime(start, 'start'),
          end_month = monthConvertToSeasonTime(end, 'end');
        dateRange = {
          endDateFrom: `${start_year}-${start_month}`,
          endDateTo: `${end_year}-${end_month}`,
        };
      } else {
        dateRange = {
          endDateFrom: dayjs(start).format(pickerFormat),
          endDateTo: dayjs(end).format(pickerFormat),
        };
      }

      setCtrl(data[0]?.value);
      updateIntegration({ statisticPeriod: typeData, ...dateRange });
    }
    if (changeType === 'rangePick') {
      const [start, end] = data;
      const pickerFormat = ctrl === '3' ? 'YYYY' : 'YYYY-MM';
      let dateRange;
      if (ctrl === '2') {
        dateRange = {
          endDateFrom: dayjs(start).format(pickerFormat),
          endDateTo: dayjs(end).add(2, 'month').format(pickerFormat),
        };
      } else {
        dateRange = {
          endDateFrom: dayjs(start).format(pickerFormat),
          endDateTo: dayjs(end).format(pickerFormat),
        };
      }
      updateIntegration(dateRange);
    }
  });

  const { column } = useChooseColumn({ type: modalType });
  const tableTsx = useMemo(() => {
    return (
      <Table
        data={tableResultData?.data.list}
        total={total}
        loading={loading}
        paginationSize={50}
        quarterFormat={ctrl}
        currentPage={curentPage}
        indicators={columnConfig}
        currentSort={currentSort}
        setCurrentSort={setCurrentSort}
        onClickNumModal={handleNumModalWithWillExpire}
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
    handleNumModalWithWillExpire,
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
          config={screenData}
          screenRef={screenRef}
          tableData={tableResultData?.data}
          disabledDate={willExpireDisabledDate}
          dispatchChange={handleScreenChange}
          onAreaChange={handleFilterChangeMemo(ChangeFilter.AREA)}
          onIndustryChange={handleFilterChangeMemo(ChangeFilter.INDUSTRY)}
          onLesseeClassifyChange={handleFilterChangeMemo(ChangeFilter.LESSEE_TYPE)}
          exportInfo={{
            exportCondition: {
              ...tableParamsData.requestParams,
              module_type: 'financeLease_scale_willExpire',
              from: '0',
              size: '1000',
            },
            fileName: '租赁融资事件按规模统计-将到期事件',
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
          visible={visible}
          total={detailTotal}
          loading={detailLoading}
          exportFileName={`按规模统计-将到期事件-${title}`}
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

export const monthConvertToSeasonTime = (time: any, type: 'start' | 'end') => {
  const fmtToMonth = Number(dayjs(time).format('MM'));
  switch (true) {
    case fmtToMonth <= 3:
      return type === 'start' ? '01' : '03';
    case fmtToMonth <= 6:
      return type === 'start' ? '04' : '06';
    case fmtToMonth <= 9:
      return type === 'start' ? '07' : '09';
    default:
      return type === 'start' ? '10' : '12';
  }
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
export const ModalWrapper = createGlobalStyle<{ isScroll: boolean }>`
  .lease_detail_modal{
    /* 修改antd默认样式 */
    .ant-modal-content {
      .ant-modal-body {
        padding-right: ${(isScroll) => (isScroll ? '18px' : '32px')} !important;
        height: calc(100% - 80px);
        .modal_table {
          height: 100%;
          overflow: auto;
          .ant-table-thead > tr > th {
            text-align: center !important;
          }
        }
      }
    }
    .modal_title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .title{
          font-size: 18px;
          font-weight: 500;
          color: #141414;
          line-height: 27px;
      }
      .modal_right{
        display: flex;
        align-items: center;
        .total{
              font-size: 13px;
              color:#8c8c8c !important;
              line-height: 18px;
              display: flex;
              align-items: center;
                .number{
                  color: #141414 !important;
                  padding: 0 3px;
                }
          }
        .primary-hover,.export-xls-btn {
          margin-left: 24px;
          margin-top: 4px;
          }
        .export-disable {
            margin-left: 24px;
        }
      }
      .export-excel {
        margin-left: 10px;
        position: relative;
      }
    }
  }
`;
export default ScaleExpiringEvents;

// const LinkStyle = styled.div`
//   font-size: 13px;
//   font-weight: 400;
//   cursor: pointer;
//   color: #025cdc;
//   line-height: 20px;
// `;
