import { memo, useCallback, useRef, useState, useMemo } from 'react';

import dayJs from 'dayjs';
import styled from 'styled-components';

import { getRiskMonitorDetail, getRiskMonitor } from '@/apis/area/areaFinancingBoard';
import { Table, Spin } from '@/components/antd';
import { LINK_BOND_OVERDUE_DEBT, LINK_BOND_OVERDUE_BILL_ACCEPTOR } from '@/configs/routerMap';
import { useSelector } from '@/pages/area/areaF9/context';
import { Empty } from '@/pages/area/areaFinancingBoard/components';
import DetailModal from '@/pages/area/areaFinancingBoard/components/detailModal';
import { CompactTable } from '@/pages/area/areaFinancingBoard/components/moduleWrapper/styles';
import SeeMore from '@/pages/area/areaFinancingBoard/components/seeMore';
import useDetailData from '@/pages/area/areaFinancingBoard/hooks/useDetailData';
import useList from '@/pages/area/areaFinancingBoard/hooks/useList';
import { dynamicLink } from '@/utils/router';
import { urlJoin } from '@/utils/url';

import useBillOverdueColumns from './hooks/useBillOverdueColumns';
import useBondDefaultColumns from './hooks/useBondDefaultColumns';
import useColumns from './hooks/useColumns';
import useDebtOverdueColumns from './hooks/useDebtOverdueColumns';
import useNonStandardColumns from './hooks/useNonstandardColumns';
enum TYPE {
  BOND_DEFAULT, //债券违约
  DEBT_OVERDUE, //债务逾期
  BILL_OVERDUE, //票据逾期
  NON_STANDARD, //非标风险
}

const map = ['债券违约明细', '债务逾期明细', '票据逾期明细', '非标风险事件明细'];

/* 默认排序字段 */
const sort = ['latestDefaultDate', 'reportDate', 'endDate', 'disclosureDate'];

const EnterpriseTable = () => {
  const { areaInfo } = useSelector((store) => ({ areaInfo: store.areaInfo }));
  const tableRef = useRef(null);
  const [type, setType] = useState(TYPE.BILL_OVERDUE);
  const [num, setCompanyNum] = useState('0');
  // // 弹窗数据
  const {
    condition,
    visible,
    loading: detailLoading,
    count,
    curPage,
    dataSource,
    setVisible,
    handleOpenModal: openBondDefaultModal,
    handleTableChange,
    handlePageChange: handleDetailPageChange,
  } = useDetailData({ detailListApiFunction: getRiskMonitorDetail });

  const handleOpenModal = useCallback(
    (row, index) => {
      const { companyNum } = row;
      setCompanyNum(companyNum);
      const extraParams = {
        sortRule: 'desc',
        sortKey: sort[index],
      };

      setType(index);
      openBondDefaultModal(row, extraParams);
    },
    [openBondDefaultModal],
  );

  const { loading, data } = useList({ listApiFunction: getRiskMonitor, type: 'riskMonitoring' });

  const columns = useColumns(handleOpenModal);

  //债券违约弹窗列表
  const bondDefaultColumns = useBondDefaultColumns({
    curPage,
    tableRef,
    data: dataSource,
  });

  //债务逾期弹窗列表
  const debtOverdueColumns = useDebtOverdueColumns({
    curPage,
    tableRef,
    data: dataSource,
  });

  //票据逾期弹窗列表
  const billOverdueColumns = useBillOverdueColumns({
    curPage,
    tableRef,
    data: dataSource,
  });

  //非标风险弹窗列表
  const nonStandardColumns = useNonStandardColumns({
    curPage,
  });

  const detailTitle = useMemo(() => {
    return `${areaInfo?.regionName}${map[type]}`;
  }, [areaInfo?.regionName, type]);

  const detailColumns = useMemo(() => {
    switch (type) {
      case TYPE.BOND_DEFAULT:
        return bondDefaultColumns;
      case TYPE.DEBT_OVERDUE:
        return debtOverdueColumns;
      case TYPE.BILL_OVERDUE:
        return billOverdueColumns;
      case TYPE.NON_STANDARD:
        return nonStandardColumns;
      default:
        return [];
    }
  }, [billOverdueColumns, bondDefaultColumns, debtOverdueColumns, nonStandardColumns, type]);

  const scrollX = useMemo(() => {
    return (
      (detailColumns as any).reduce((acc: number, cur: any) => acc + cur?.width || 0, 0) + detailColumns.length - 1
    );
  }, [detailColumns]);

  const module_type = useMemo(() => {
    switch (type) {
      case TYPE.BOND_DEFAULT:
        return 'web_region_finance_bond_default_detail';
      case TYPE.DEBT_OVERDUE:
        return 'web_region_finance_debt_overdue_detail';
      case TYPE.BILL_OVERDUE:
        return 'web_region_finance_bill_overdue_detail';
      case TYPE.NON_STANDARD:
        return 'web_region_finance_non_standard_risk_detail';
      default:
        return '';
    }
  }, [type]);

  const seeMore = useMemo(() => {
    switch (type) {
      case TYPE.BOND_DEFAULT:
        return null;
      case TYPE.DEBT_OVERDUE:
        return <SeeMore fontSize={14} link={urlJoin(dynamicLink(LINK_BOND_OVERDUE_DEBT))} />;
      case TYPE.BILL_OVERDUE:
        return <SeeMore fontSize={14} link={urlJoin(dynamicLink(LINK_BOND_OVERDUE_BILL_ACCEPTOR))} />;
      case TYPE.NON_STANDARD:
        return null;
      default:
        return null;
    }
  }, [type]);

  const detailModalPrefix = useMemo(() => `area-risk-${type}`, [type]);

  const exportTitle = useMemo(() => {
    if (type !== 2) {
      return num;
    }
    return null;
  }, [num, type]);

  return (
    <>
      <Spin type="square" spinning={loading}>
        {data.length > 0 ? (
          <CompactTable>
            <div ref={tableRef}>
              <MyTable type="stickyTable" columns={columns} dataSource={data} stripe={false} border={false} />
            </div>
          </CompactTable>
        ) : (
          <Empty />
        )}
      </Spin>
      <DetailModal
        visible={visible}
        setVisible={setVisible}
        count={count}
        title={detailTitle}
        seeMore={seeMore}
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
          exportTitle,
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

export default memo(EnterpriseTable);

const MyTable = styled(Table)`
  .bold {
    font-weight: bold;
  }
`;
