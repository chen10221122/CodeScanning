import { memo, useEffect } from 'react';

import styled from 'styled-components';

import Table from '@/components/tableFinance';

const FullTable = ({ ...props }) => {
  // 解决筛选后出现双滚动条
  useEffect(() => {
    if (props?.dataSource) {
      window.dispatchEvent(new Event('resize'));
    }
  }, [props?.dataSource]);

  return <MTable {...props} stripe />;
};

export default memo(FullTable);

const MTable = styled(Table)`
  .ant-table-thead > tr > th {
    text-align: center !important;
  }

  .ant-pagination {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 8px 0 0 !important;
  }

  /* bond */
  .name.link {
    color: #025cdc;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    display: -webkit-box !important;
    -webkit-line-clamp: 1 !important;
    -webkit-box-orient: vertical !important;
    box-sizing: border-box;
    &:hover {
      cursor: pointer;
      text-decoration: underline;
    }
  }

  .highlight-text {
    color: #fe3a2f;
  }

  /* subject */
  .short-name,
  .course {
    font-size: 13px;
    color: #0171f6;
    cursor: pointer;
  }

  .detail {
    margin-left: 24px;
    color: #bfbfbf;
  }

  .default-nums {
    cursor: pointer;
    color: #025cdc;
  }
`;
