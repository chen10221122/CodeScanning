import { useContext, useMemo } from 'react';

import { Table, Spin } from '@dzh/components';

import Pagination from '@/components/Pagination';
import { TableWrapper } from '@/pages/area/areaF9/modules/regionalOverview/industrialPark/modules/main/table/index';
import { convertStringToNumber } from '@/utils/format';
import { shortId } from '@/utils/share';

import ParkEnterpriseContext from '../context';
import useColumn from './useColumns';
const TableFinance = () => {
  const {
    debounceScreenHeadHeight = 33,
    loading,
    onlyBodyLoading,
    condition,
    tableData,
    count,
    handleTableChange,
    handlePageChange,
  } = useContext(ParkEnterpriseContext);

  const columns = useColumn(condition.from, condition.parkKeywords);
  const total = convertStringToNumber(count);

  const Scroll = useMemo(() => {
    let x = 0;
    if (columns.length)
      columns.forEach((o: any) => {
        x += o.width ? o.width : 0;
      });
    return x ? { x } : undefined;
  }, [columns]);

  return (
    <TableWrapper>
      <Table
        columns={columns}
        dataSource={tableData}
        bordered
        rowKey={() => shortId()}
        onlyBodyLoading={onlyBodyLoading}
        scroll={Scroll}
        sticky={{
          offsetHeader: onlyBodyLoading || !loading ? debounceScreenHeadHeight : 0,
          getContainer: () => (document.querySelector('.side-page-content') as HTMLElement) || document.body,
        }}
        onChange={handleTableChange}
        pagination={false}
        loading={{ spinning: loading, translucent: true, indicator: <Spin type="square" tip="加载中" /> }}
      />
      {total > condition.size ? (
        <Pagination
          current={condition.page}
          pageSize={condition.size}
          total={total}
          onChange={handlePageChange}
          style={{ padding: '8px 0 0 0', margin: 0 }}
          align={'left'}
        />
      ) : null}
    </TableWrapper>
  );
};

export default TableFinance;
