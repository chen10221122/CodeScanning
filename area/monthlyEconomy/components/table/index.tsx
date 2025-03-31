import { FC, memo, useEffect, useRef } from 'react';

import { Table } from '@dzh/components';
import { useScroll } from 'ahooks';
import styled from 'styled-components';

import { OpenDataSourceDrawer } from '@/components/dataSourceDrawer';
import { TITLE_HEIGHT } from '@/pages/area/monthlyEconomy/components/title';
import { tblDataItem, TblEl, useCtx } from '@/pages/area/monthlyEconomy/getContext';
import useMemoizedFn from '@/pages/dataView/components/dzhTable/hooks/useMemoizedFn';

import useColumns from './hooks/useColumns';

interface IndicObjType {
  indicName: string;
  updateType?: number;
  child?: [
    {
      indicName: string;
      updateType?: number;
    },
  ];
}

export interface UpdateDataItemType {
  regionCode: string;
  indicObj: IndicObjType[];
}

export interface PropType {
  tableData: tblDataItem[];
  hiddenEmptyCols: boolean;
  updateData: UpdateDataItemType[];
  handleOpenModal: (info: any, data?: any[]) => void;
  /**分页加载页面 */
  setTableLoading: (value: boolean) => void;
  openDataSource?: OpenDataSourceDrawer;
}
export const pageSize = 50;

const TableContent: FC<PropType> = ({
  tableData,
  hiddenEmptyCols,
  updateData,
  handleOpenModal,
  setTableLoading,
  openDataSource,
}) => {
  const {
    update,
    state: { condition, tblData, current, container, sortName, scrollLeft },
  } = useCtx();

  const pageRef = useRef(1);
  /** 表格加载loading */
  const conditionRef = useRef(condition);
  const isFirstRef = useRef(true);
  const tableEle = document.querySelector('.dzh-table-wrapper .ant-table-body');
  const scroll = useScroll(tableEle);

  const { trackCellClickColumns, tblScrollSetting, handleTblData } = useColumns({
    updateData,
    tableData,
    hiddenEmptyCols,
    handleOpenModal,
    openDataSource,
  });
  /** 滚动定位 */
  useEffect(() => {
    if (scrollLeft) {
      tableEle?.scroll({ left: scrollLeft });
    }
  }, [scrollLeft, tableEle]);

  const onPageChange = useMemoizedFn((page, isScroll = false) => {
    if (pageRef.current !== page) {
      update((o) => {
        if (scroll?.left) {
          o.scrollLeft = scroll?.left;
        }
      });
    }
    pageRef.current = page;
    // 添加翻页loading
    setTableLoading && setTableLoading(true);
    update((o) => {
      o.current = page;
    });
    setTimeout(() => {
      setTableLoading && setTableLoading(false);
      if (container && isScroll) {
        // container.scroll({ top: TITLE_HEIGHT, behavior: 'smooth' });
        container.scroll({ top: TITLE_HEIGHT });
      }
    }, 500);
  });

  const handleChange = useMemoizedFn((pagination, filters, sorter) => {
    if (sorter) {
      update((d) => {
        d.sortData = sorter;
        if (sorter.order) {
          let sortStr = sorter.order === 'descend' ? ':desc' : ':asc';
          d.sortName = sorter.field + sortStr;
        } else {
          d.sortName = '';
        }
        if (scroll?.left) {
          d.scrollLeft = scroll?.left;
        }
      });
    }
  });

  useEffect(() => {
    if (isFirstRef.current) {
      if (sortName || condition.regionCode || condition.endDate) isFirstRef.current = false;
      return;
    }
    onPageChange(1);
  }, [sortName, onPageChange, condition.regionCode, condition.endDate]);

  useEffect(() => {
    if (tableData.length) handleTblData(tableData);
  }, [tableData, handleTblData]);

  useEffect(() => {
    conditionRef.current = condition;
  }, [condition]);

  return (
    <>
      <TableWrap
        id="monthly-table"
        noPage={!(tblData?.length > pageSize)}
        dataSource={tblData}
        columns={trackCellClickColumns}
        scroll={tblScrollSetting}
        showSorterTooltip={false}
        onChange={handleChange}
        rowKey={(record: TblEl) => {
          return record ? record?.regionCode4 : record;
        }}
        sticky={{
          offsetHeader: 40,
          getContainer: () => container || document.body,
        }}
        pagination={
          tblData?.length > 50
            ? {
                current,
                pageSize,
                hideOnSinglePage: true,
                size: 'small',
                showSizeChanger: false,
                onChange: (page: number) => onPageChange(page, true),
              }
            : false
        }
      />
    </>
  );
};

export default memo(TableContent);

const TableWrap = styled(Table)<{ noPage: boolean }>`
  .ant-table-container {
    .ant-table-column-sorter {
      transform: translateY(-1px);
    }
    .ant-table-thead > tr > th {
      .dzh-table-resize-container {
        .ant-table-column-title span,
        .dzh-table-resize-content {
          white-space: normal;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
        }
        .dzh-table-resize-content {
          -webkit-line-clamp: 1;
        }
        .ant-table-column-title span {
          -webkit-line-clamp: 3;
        }
      }
    }
    .ant-table-body table .ant-table-tbody .ant-table-row {
      .ant-table-cell span,
      a {
        white-space: normal;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 1;
        display: -webkit-box;
        -webkit-box-orient: vertical;
      }
      .cell-class {
        background-color: #ffd6d6 !important;
        &:hover {
          background-color: #ffd6d6 !important;
          cursor: pointer;
        }
      }
      .first-update {
        background-color: #ffe9d7 !important;
        &:hover {
          background-color: #ffe9d7 !important;
          cursor: pointer;
        }
      }
    }
    &:after {
      display: none;
    }
    .ant-table-wrapper {
      padding-bottom: 4px;
    }
  }
  .detail-span {
    cursor: pointer;
    i {
      vertical-align: -3px;
    }
  }
  .why-icon {
    margin-left: 4px;
    vertical-align: -2px;
  }

  .ant-table-column-has-sorters {
    padding: 5px 12px !important;
  }

  .ant-table-column-sorters {
    white-space: nowrap;
    justify-content: center;
    align-items: center;
    .ant-table-column-title {
      flex: unset;
    }

    a svg {
      margin-left: 4px;
    }

    > span {
      &:first-of-type {
        word-break: break-all;
        white-space: normal;
      }
    }
  }

  .ant-table-column-sort {
    background: white;
  }

  td a i {
    font-style: normal;
    color: rgba(254, 58, 47, 1);
  }

  .ant-table-tbody {
    tr {
      td:last-of-type {
        border-right: none;
      }
    }
  }
  .ant-table-tbody > tr {
    &.ant-table-row {
      &:not(.focus-link):hover {
        > .cell-class {
          background-color: #ffd6d6 !important;
        }
        > .first-update {
          background-color: #ffe9d7 !important;
        }
      }
    }
  }

  .ant-table-container table > thead > tr:first-child th:first-child,
  .ant-table-tbody > tr > td:first-child {
    padding: 0px 8px !important;
  }
`;

export const LinkStyle = styled.div`
  color: #025cdc;
  text-decoration: underline;
  cursor: pointer;
  display: inline-block;
`;
