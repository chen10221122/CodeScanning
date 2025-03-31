import { memo, useCallback, useState, useMemo } from 'react';

import dayJs from 'dayjs';

import { Table } from '@/components/antd';
import { getNetFinancingDetailList, getBondIssueDetailList } from '@/pages/area/areaCompany/api/regionFinancingApi';
import { useSelector } from '@/pages/area/areaF9/context';
import DetailModal from '@/pages/area/areaFinancingBoard/components/detailModal';
import { CompactTable } from '@/pages/area/areaFinancingBoard/components/moduleWrapper/styles';
import { REGIONAL_MODAL } from '@/pages/area/areaFinancingBoard/config';
import useAreaColumns from '@/pages/area/areaFinancingBoard/hooks/useAreaColumns';
import useDetailData from '@/pages/area/areaFinancingBoard/hooks/useDetailData';
import type { BondNetFinancingList } from '@/pages/area/areaFinancingBoard/types';

import useColumns from './useColumns';

interface Props {
  tableData: BondNetFinancingList[];
  params: {
    timeType: string;
    bondType: string;
  };
  county: boolean;
}

export enum TYPE {
  NET_FINANCING_AMOUNT = '1', //净融资额
  BOND_ISSUED = '2', //新发行债券只数
}

const map = {
  [TYPE.NET_FINANCING_AMOUNT]: '债券净融资明细',
  [TYPE.BOND_ISSUED]: '新发行债券明细',
};

const FinancingTable = ({ tableData, params, county }: Props) => {
  const { areaInfo } = useSelector((store) => ({ areaInfo: store.areaInfo }));
  const [type, setType] = useState(TYPE.NET_FINANCING_AMOUNT);

  const reqUrl = useMemo(() => {
    return type === TYPE.NET_FINANCING_AMOUNT ? getNetFinancingDetailList : getBondIssueDetailList;
  }, [type]);

  // 弹窗数据
  const {
    condition,
    visible,
    loading: detailLoading,
    count,
    curPage,
    dataSource,
    setVisible,
    handleOpenModal: openNetFinancingAmountModal,
    handleTableChange,
    handlePageChange: handleDetailPageChange,
  } = useDetailData({ detailListApiFunction: reqUrl });

  const handleOpenModal = useCallback(
    (row, index: TYPE) => {
      const extraParams = {
        sortRule: 'desc',
        sortKey: index === TYPE.NET_FINANCING_AMOUNT ? 'changeDate' : 'issueDate',
        bondTypeExclude: '010000,030000,040000',
        ...params,
      };

      setType(index);
      openNetFinancingAmountModal(row, extraParams);
    },
    [openNetFinancingAmountModal, params],
  );

  const [columns, x] = useColumns(handleOpenModal, county);

  //净融资额弹窗列表
  const netFinancingAmountColumns = useAreaColumns(curPage, REGIONAL_MODAL.NET_FINANCING_AMOUNT);

  //新发行债券只数弹窗列表
  const bondIssuedColumns = useAreaColumns(curPage, REGIONAL_MODAL.BOND_ISSUED);

  const detailTitle = useMemo(() => {
    return `${areaInfo?.regionName}${map[type]}`;
  }, [areaInfo?.regionName, type]);

  const detailColumns = useMemo(() => {
    switch (type) {
      case TYPE.NET_FINANCING_AMOUNT:
        return netFinancingAmountColumns;
      case TYPE.BOND_ISSUED:
        return bondIssuedColumns;
      default:
        return [];
    }
  }, [bondIssuedColumns, netFinancingAmountColumns, type]);

  const scrollX = useMemo(() => {
    return (
      (detailColumns as any).reduce((acc: number, cur: any) => acc + cur?.width || 0, 0) + detailColumns.length - 1
    );
  }, [detailColumns]);

  const detailModalPrefix = useMemo(() => `area-bondNetFinancing-${type}`, [type]);

  const module_type = useMemo(() => {
    switch (type) {
      case TYPE.NET_FINANCING_AMOUNT:
        return 'financing_bond_net_financing_detail';
      case TYPE.BOND_ISSUED:
        return 'bond_financing_issue_detail';
      default:
        return '';
    }
  }, [type]);

  return (
    <>
      <CompactTable>
        <Table
          type="stickyTable"
          columns={columns}
          dataSource={tableData}
          scroll={{ x, y: 139 }}
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
    </>
  );
};

export default memo(FinancingTable);
