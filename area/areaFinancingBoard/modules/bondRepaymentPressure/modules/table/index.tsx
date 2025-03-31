import { memo, useCallback, useState, useMemo } from 'react';

import dayJs from 'dayjs';

import { getBondRepayPressureDetail } from '@/apis/area/areaFinancingBoard';
import { Table } from '@/components/antd';
import { useSelector } from '@/pages/area/areaF9/context';
import DetailModal from '@/pages/area/areaFinancingBoard/components/detailModal';
import { CompactTable } from '@/pages/area/areaFinancingBoard/components/moduleWrapper/styles';
import { REGIONAL_MODAL } from '@/pages/area/areaFinancingBoard/config';
import useAreaColumns from '@/pages/area/areaFinancingBoard/hooks/useAreaColumns';
import useDetailData from '@/pages/area/areaFinancingBoard/hooks/useDetailData';
import type { BondRepaymentList } from '@/pages/area/areaFinancingBoard/types';

import useColumns from './useColumns';

const FinancingTable = ({ tableData, bondType }: { tableData: BondRepaymentList[]; bondType: string }) => {
  const { areaInfo } = useSelector((store) => ({ areaInfo: store.areaInfo }));
  const [detailTitle, setdetailTitle] = useState('');
  // // 弹窗数据
  const {
    condition,
    visible,
    loading: detailLoading,
    count,
    curPage,
    dataSource,
    setVisible,
    handleOpenModal: openBondRepaymentPressureModal,
    handleTableChange,
    handlePageChange: handleDetailPageChange,
  } = useDetailData({ detailListApiFunction: getBondRepayPressureDetail });

  const handleOpenModal = useCallback(
    (row) => {
      setdetailTitle(`${areaInfo?.regionName}债券偿还明细`);
      const extraParams = { sortRule: 'desc', sortKey: 'changeDate', bondType };
      openBondRepaymentPressureModal(row, extraParams);
    },
    [areaInfo?.regionName, openBondRepaymentPressureModal, bondType],
  );

  const [columns, x] = useColumns(handleOpenModal);

  const detailColumns = useAreaColumns(curPage, REGIONAL_MODAL.BOND_REPAY_PRESSURE);

  const scrollX = useMemo(() => {
    return (
      (detailColumns as any).reduce((acc: number, cur: any) => acc + cur?.width || 0, 0) + detailColumns.length - 1
    );
  }, [detailColumns]);

  return (
    <>
      <CompactTable>
        <Table
          type="stickyTable"
          columns={columns}
          dataSource={tableData}
          scroll={{ x, y: 150 }}
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
            module_type: 'web_region_finance_bond_repay_pressure_detail',
          },
          filename: `${detailTitle}-${dayJs().format('YYYY.MM.DD')}`,
        }}
        loading={detailLoading}
        page={curPage}
        onPageChange={handleDetailPageChange}
        onTableChange={handleTableChange}
        detailModalPrefix={'area-bondRepaymentPressure'}
      />
    </>
  );
};

export default memo(FinancingTable);
