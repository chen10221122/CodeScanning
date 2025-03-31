import { memo } from 'react';

import styled from 'styled-components';

import TableFinance from '@/components/tableFinance';

const Table = ({ columns, dataSource, scroll, sticky, pagination, stripe, ...restProps }) => {
  return (
    <TableWrapper>
      <TableFinance
        columns={columns}
        dataSource={dataSource}
        stripe={stripe}
        scroll={scroll}
        sticky={sticky}
        pagination={pagination}
        {...restProps}
      />
    </TableWrapper>
  );
};

export default memo(Table);
const TableWrapper = styled.div`
  .ant-table-thead > tr > {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box; /*必须结合的属性 ，将对象作为弹性伸缩盒子模型显示 。*/
    -webkit-line-clamp: 1; /*用来限制在一个块元素显示的文本的行数。*/
    -webkit-box-orient: vertical; /*必须结合的属性 ，设置或检索伸缩盒对象的子元素的排列方式 。*/
  }
  .ant-table-thead > tr > th {
    vertical-align: middle;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    -webkit-line-clamp: 2; /*用来限制在一个块元素显示的文本的行数。*/
  }
  .ant-table-tbody .clickedRow > td {
    background: #fff7ea !important;
  }
  .ant-table-tbody > .clickedRow:nth-of-type(odd) > td {
    background: #fff7ea !important;
  }
  .ant-table-tbody > .clickedRow:hover:not(.ant-table-expanded-row) > td {
    background-color: #fff7ea !important;
  }
  .ant-table-container {
    border-top: none;
  }
  .ant-table-tbody > tr > td:nth-child(2) {
    padding: 5px 12px;
  }
  .ant-table-tbody > tr > td {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .ant-table-tbody > tr > td > div {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .ant-table-tbody > tr > td:nth-child(2) {
    color: #595959;
  }
  .ant-table-thead > tr > th:first-child {
    padding: 7px 0px 7px;
  } //序号列padding设置，防止三位数序号会折行
  .ant-table-thead > tr > th:nth-child(2) {
    overflow: hidden;
  }
  .ant-table-tbody > tr > td:first-child {
    padding: 5px 0px;
    border-right: 1px solid #e8ecf4;
  }
  .ant-table-header.ant-table-sticky-holder {
    //表头固定
    z-index: 2 !important;
    border-top: 1px solid #f2f4f9;
    top: ${(props) => props.headFixedPosition}px !important;
  }
`;
