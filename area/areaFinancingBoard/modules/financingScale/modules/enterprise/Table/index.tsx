import { memo, useCallback, useContext, useState, useMemo, useEffect } from 'react';

import { useMemoizedFn } from 'ahooks';
import dayJs from 'dayjs';
import styled from 'styled-components';

import { getCompanyScaleDetail } from '@/apis/area/areaFinancingBoard';
import { Table } from '@/components/antd';
import { getLevel } from '@/pages/area/areaEconomy/common';
import { Level } from '@/pages/area/areaEconomy/config';
import { useSelector } from '@/pages/area/areaF9/context';
import DetailModal from '@/pages/area/areaFinancingBoard/components/detailModal';
import { CompactTable } from '@/pages/area/areaFinancingBoard/components/moduleWrapper/styles';
import { REGIONAL_MODAL, MODAL_TYPE } from '@/pages/area/areaFinancingBoard/config';
import { useConditionCtx } from '@/pages/area/areaFinancingBoard/context';
import useAreaColumns from '@/pages/area/areaFinancingBoard/hooks/useAreaColumns';
import useCondition from '@/pages/area/areaFinancingBoard/hooks/useCondition';
import useDetailData from '@/pages/area/areaFinancingBoard/hooks/useDetailData';
import EFDetailModal from '@/pages/area/areaFinancingBoard/modules/stockMarket/modal';
import type { FinancingScaleList } from '@/pages/area/areaFinancingBoard/types';
import { getCensusAnalyseDetailData } from '@/pages/finance/financingLeaseNew/modules/censusAnalyse/api';
import useChooseColumn from '@/pages/finance/financingLeaseNew/modules/censusAnalyse/components/detailModal/useChooseColumn';
import { useImmer } from '@/utils/hooks';

import { FinancingScaleContext } from '../../../index';
import useColumns from './hooks/useColumns';
import useDetailColumns from './hooks/useDetailColumns';

const map = ['债券融资明细', '租赁融资明细', '应收账款融资明细', '股权融资明细'];

const censusAnalysedefaultCondition = {
  popKey: 'leaseEventDetail',
  from: 0,
  size: 50,
  dimension: 'scale',
  statisticType: 'total',
};

export enum Type {
  BOND_FINANCING = 0,
  LEASE_FINANCING = 1,
  RECEIVE_FINANCING = 2,
}

const detailListApiFunctionMap = new Map([
  [Type.BOND_FINANCING, getCompanyScaleDetail],
  [Type.LEASE_FINANCING, getCensusAnalyseDetailData],
  [Type.RECEIVE_FINANCING, getCompanyScaleDetail],
]);

const EnterpriseTable = ({ tableData, containerRef }: { tableData: FinancingScaleList[]; containerRef?: any }) => {
  const {
    state: { condition: EFCondition, visible: EFVisible, showTabs, detailModalConfig, type: EFType },
    update,
  } = useConditionCtx();
  useCondition(EFCondition);
  const { year } = useContext(FinancingScaleContext);
  const { areaInfo } = useSelector((store) => ({ areaInfo: store.areaInfo }));
  const [type, setType] = useState(0);
  // 债券融资弹窗数据
  const {
    condition,
    visible,
    loading: detailLoading,
    count,
    curPage,
    dataSource,
    setVisible,
    handleOpenModal: openBondFinancingModal,
    handleTableChange,
    handlePageChange: handleDetailPageChange,
  } = useDetailData({
    detailListApiFunction: detailListApiFunctionMap.get(type)!,
  });

  const [leaseParams, updateLeaseParams] = useImmer({
    regionCode: '',
    cityCode: '',
    countryCode: '',
  });

  useEffect(() => {
    if (areaInfo?.regionCode) {
      const level = getLevel(`${areaInfo.regionCode}`);
      switch (level) {
        case Level.PROVINCE:
          updateLeaseParams((draft) => {
            draft.regionCode = areaInfo.regionCode;
          });
          break;
        case Level.CITY:
          updateLeaseParams((draft) => {
            draft.cityCode = areaInfo.regionCode;
          });
          break;
        case Level.COUNTY:
          updateLeaseParams((draft) => {
            draft.countryCode = areaInfo.regionCode;
          });
          break;
      }
    }
  }, [areaInfo?.regionCode, updateLeaseParams]);

  const handleOpenModal = useCallback(
    (row, index) => {
      let extraParams: any = index === 0 ? { sortRule: 'desc', sortKey: 'issueDate', year } : {};
      extraParams =
        index === 1
          ? {
              registerStartDateFrom: year,
              registerStartDateTo: year,
              statisticPeriod: '3',
              ...leaseParams,
              ...censusAnalysedefaultCondition,
            }
          : extraParams;
      extraParams = index === 2 ? { sortRule: 'desc', sortKey: 'registerStartDate' } : extraParams;
      setType(index);
      extraParams = { ...extraParams, year };
      openBondFinancingModal(row, extraParams);
    },
    [openBondFinancingModal, year, leaseParams],
  );

  const [columns, x] = useColumns(handleOpenModal);

  //债券融资列表
  const bondFinancingColumns = useAreaColumns(curPage, REGIONAL_MODAL.BOND_FINANCING);
  // 应收账款融资明细
  const { columns: receiveFinancingColumns } = useDetailColumns(curPage, REGIONAL_MODAL.RECEIVE_FINANCING);
  // 租赁融资
  const { column } = useChooseColumn({ type: 'leaseEventNum' });
  const { columns: leaseFinancingColumns } = useDetailColumns(curPage, REGIONAL_MODAL.LEASE_FINANCING, column);

  const detailColumns = useMemo(() => {
    switch (type) {
      case Type.BOND_FINANCING:
        return bondFinancingColumns;
      case Type.LEASE_FINANCING:
        return leaseFinancingColumns;
      case Type.RECEIVE_FINANCING:
        return receiveFinancingColumns;
      default:
        return [];
    }
  }, [bondFinancingColumns, leaseFinancingColumns, receiveFinancingColumns, type]);

  const scrollX = useMemo(() => {
    return (
      (detailColumns as any).reduce((acc: number, cur: any) => acc + cur?.width || 0, 0) + detailColumns.length - 1
    );
  }, [detailColumns]);

  const detailTitle = useMemo(() => {
    return `${areaInfo?.regionName}${year}年${map[type]}`;
  }, [areaInfo?.regionName, type, year]);

  const module_type = useMemo(() => {
    switch (type) {
      case Type.BOND_FINANCING:
        return 'web_region_finance_bond_detail';
      case Type.LEASE_FINANCING:
        return 'financeLease_detail_leaseEventNum_total';
      case Type.RECEIVE_FINANCING:
        return 'web_region_finance_receive_detail';
      default:
        return [];
    }
  }, [type]);

  const detailModalPrefix = useMemo(() => `area-company-${type}`, [type]);

  const closeModal = useMemoizedFn(() => {
    update((d) => {
      d.visible = false;
      d.showTabs = false;
      d.type = '';
    });
  });

  return (
    <>
      <CompactTable>
        <MyTable
          type="stickyTable"
          columns={columns}
          dataSource={tableData}
          scroll={{ x }}
          stripe={false}
          border={false}
        />
      </CompactTable>
      <DetailModal
        visible={visible}
        setVisible={setVisible}
        count={count}
        title={detailTitle}
        tableConfig={{
          dataSource,
          columns: detailColumns,
          scroll: scrollX ? { x: scrollX } : null,
          restConfig: {
            sortDirections: ['descend', 'ascend'],
          },
        }}
        exportConfig={{
          condition: {
            ...condition,
            module_type,
          },
          filename: `${detailTitle}-${dayJs().format('YYYY.MM.DD')}`,
        }}
        loading={detailLoading}
        page={curPage}
        onPageChange={handleDetailPageChange}
        onTableChange={handleTableChange}
        detailModalPrefix={detailModalPrefix}
      />
      <EFDetailModal
        visible={(EFVisible && EFType === MODAL_TYPE.FINANCINGSCALE) || false}
        closeModal={closeModal}
        detailModalConfig={detailModalConfig}
        containerRef={containerRef}
        showTabs={showTabs}
      />
    </>
  );
};

export default memo(EnterpriseTable);

const MyTable = styled(Table)`
  .circle {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    margin-right: 4px;
  }
  .bold {
    font-weight: bold;
  }
`;
