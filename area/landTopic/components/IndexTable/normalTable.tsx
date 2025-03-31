import { FC, memo, useEffect, useMemo, useRef, useState } from 'react';

import { Table, TableProps } from '@dzh/components';
import { useInViewport } from 'ahooks';
import { isUndefined } from 'lodash';
import styled from 'styled-components';

const SORT_DIRECTIONS = ['descend', 'ascend'];

const NormalTable: FC<TableProps<Record<string, any>>> = (props) => {
  const [mountView, setMountView] = useState<boolean | undefined>(undefined);
  const tableRef = useRef<HTMLDivElement>(null);
  const scroll = useMemo(() => ({ x: '100%' }), []);

  const [inViewport] = useInViewport(tableRef);

  /* 解决可能出现的表头消失问题，保证每次表格挂载时父节点是可见的 */
  useEffect(() => {
    if (!isUndefined(inViewport) && isUndefined(mountView)) {
      setMountView(inViewport);
    }
    if (inViewport && mountView === false) {
      setMountView(true);
    }
  }, [inViewport, mountView]);

  return (
    <div ref={tableRef}>
      {inViewport || mountView ? (
        <StyledTable scroll={scroll} sortDirections={SORT_DIRECTIONS as any} {...props} />
      ) : null}
    </div>
  );
};

export default memo(NormalTable);

const StyledTable = styled(Table)`
  .ant-table {
    .ant-table-thead > tr > th:last-child {
      width: 48px;
    }
    .ant-table-body table col:last-child {
      width: 0 !important;
    }
    .ant-table-container .ant-table-tbody tr:not(.ant-table-measure-row) td {
      &:last-child {
        display: none;
      }
      &:nth-last-child(2) {
        border-right: none;
      }
    }
  }

  .ant-table-column-sorters {
    width: fit-content;
    display: inline-flex;
    &::after {
      display: none;
    }
    .ant-table-column-sorter {
      margin-left: 4px;
      height: 18px;
    }
  }

  th .screen-wrapper > div {
    font-size: 12px;
    padding-bottom: 0;
  }
`;
