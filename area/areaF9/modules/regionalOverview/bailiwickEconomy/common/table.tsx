import { FC, memo, useEffect, useState, useRef } from 'react';

import styled from 'styled-components';

import missVCAIcon from '@/assets/images/area/missVCA.svg';
import Empty from '@/components/antd/empty';
import { OpenDataSourceDrawer } from '@/components/dataSource';
import Table from '@/components/tableFinance';
import { pagesize } from '@/pages/bond/cityInvestMap/content';
import { useTableScrollSticky } from '@/utils/hooks';
import { shortId } from '@/utils/share';

import useTableInfo from './useTableData';

const TABLETOP = 70;

interface Props {
  /** 要查询的所有地区code */
  allRegionCode: string;
  /** 固定行的地区code,不传就没有固定行 */
  mainRegionCode?: string;
  /** 表格的粘性头部和滚动条 */
  sticky?: boolean | { offsetHeader?: number; offsetScroll?: number; getContainer?: () => HTMLElement };
  /** 表格loading */
  loading?: boolean | React.ReactNode;
  /** 表格挂载容器 */
  container?: HTMLDivElement | null;
  /** 是否需要把loading作为table的props传入 */
  showTableLoaidng?: boolean;
  handleTblCell?: Function;
  openModal: Function;
  openUpdate: any;
  pageCode?: string;
  UpdateTipCref: JSX.Element;
  openDataSource?: OpenDataSourceDrawer;
}

const Tbl: FC<Props> = ({
  allRegionCode,
  mainRegionCode,
  sticky,
  loading,
  showTableLoaidng = true,
  handleTblCell,
  openModal,
  openUpdate,
  pageCode,
  UpdateTipCref,
  openDataSource,
}) => {
  const tableWrapRef = useRef<HTMLDivElement>(null);
  const [tableKey, setTableKey] = useState(shortId());
  const { tblColumn, tblScroll, tableData, fixedRow, handleChange, pagination, reloadData } = useTableInfo({
    allRegionCode,
    mainRegionCode,
    handleTblCell,
    openModal,
    openUpdate,
    pageCode,
    openDataSource,
  });

  useEffect(() => {
    setTableKey(shortId());
  }, [fixedRow, tableData]);

  const hasStickyScroll = useTableScrollSticky({
    parentDom: document.querySelector('.main-container') as HTMLElement,
    currentDom: tableWrapRef,
    middleHeight: TABLETOP,
  });

  return (
    <TableWrapper
      hasPagination={tableData.length > pagesize}
      hasStickyScroll={hasStickyScroll}
      ref={tableWrapRef}
      data-prevent
    >
      {tableData.length ? (
        <>
          <Table
            columns={tblColumn}
            dataSource={tableData}
            pagination={pagination}
            scroll={tblScroll}
            rowClassName
            components
            noSelectRow
            fixedRow={fixedRow.length ? fixedRow : undefined}
            stripe={true}
            sticky={sticky}
            finance
            showSorterTooltip={false}
            key={tableKey}
            onChange={handleChange}
            loading={showTableLoaidng ? loading : undefined}
          />
          {UpdateTipCref}
        </>
      ) : (
        <Empty className="filter-nodata" type={Empty.NO_DATA_IN_FILTER_CONDITION} onClick={reloadData} />
      )}
    </TableWrapper>
  );
};

export default memo(Tbl);

const TableWrapper = styled.div<{ hasPagination: boolean; hasStickyScroll: boolean }>`
  /* 显示分页器时margin-bottom为0 */
  /* margin-bottom: ${(props) => (props.hasPagination ? '0' : '16px')}; */
  .ant-table-thead > tr:nth-child(1) > th {
    text-align: center !important;
    .ant-table-column-sorters {
      justify-content: center;
    }
  }
  .filter-nodata {
    padding-top: 85px;
  }
  .ant-table-container .ant-table-tbody > tr.ant-table-row:not(.focus-link):hover > td {
    &.cell-class {
      background-color: #ffd6d6 !important;
    }
    &.first-update {
      background-color: #ffe9d7 !important;
    }
    &.missVCA {
      background: right center / 14px no-repeat url(${missVCAIcon});
    }
  }

  .ant-table-tbody {
    > tr {
      > td {
        &.cell-class {
          background-color: #ffd6d6 !important;
          cursor: pointer;
          &:hover {
            background-color: #ffd6d6 !important;
          }
        }
        &.first-update {
          background-color: #ffe9d7 !important;
          cursor: pointer;
          &:hover {
            background-color: #ffe9d7 !important;
          }
        }
      }
      > .missVCA {
        background: right center / 14px no-repeat url(${missVCAIcon});
      }
    }
  }
  .ant-table-thead > tr:nth-child(2) > th {
    padding: 6px 12px;
    border-top: none;
    border-bottom: 1px solid #e8ecf4 !important;
    .ant-table-column-sorters {
      display: block;
    }
    .ant-table-column-sorter-full {
      display: none;
    }
    &::after {
      display: none;
    }
  }
  .ant-table-tbody > tr > td {
    padding: 6px 12px;
    font-size: 13px;
    font-weight: 400;
    line-height: 20px;
    color: #141414;
  }
  .ant-table-thead > tr > th:nth-child(1),
  .ant-table-tbody > tr > td:nth-child(1) {
    padding: 6px 0;
  }
  .ant-table-column-title {
    flex: unset;
    position: relative;
    z-index: 1;
  }
  .ant-table-column-sorters > span:first-of-type {
    word-break: break-all;
    white-space: normal;
  }

  .ant-table-column-sorter {
    margin-left: 5px;
    height: 20px;
    padding-top: 1px;
  }
  .ant-table-column-sort {
    background: none;
  }
  .ant-table-thead th.ant-table-column-has-sorters:hover {
    background: #f8faff;
  }

  .ant-table-sticky-scroll {
    display: ${({ hasStickyScroll }) => (hasStickyScroll ? 'block' : 'none')};
  }

  .link {
    color: #025cdc;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
`;
