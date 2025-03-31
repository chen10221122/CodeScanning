import styled from 'styled-components';

export const ContentStyle = styled.div`
  padding: 0 20px 20px;

  .ant-typography {
    margin-bottom: 0;
    color: #262626;

    /* antd的组件font-size为奇数 计算错误 */
    font-size: 12px;
    /* 放大了 所以宽度应该减小 */
    width: 92%;
    padding: 0.5px 0 0.4px;
    cursor: pointer;
    /* x y 都放大 */
    transform: scale(1.08);
    transform-origin: left;
    .ant-typography-copy {
      display: none !important;
      transform: scale(0.926);
    }
    .hover-no-bg {
      white-space: nowrap;
      margin-left: 4px;
      font-size: 13px;
      line-height: 1em;
      color: #0171f6;
      &:hover {
        text-decoration: underline;
      }
    }
    &:hover {
      span:not(ant-typography-expand):not(.hover-no-bg) {
        background-color: transparent;
        color: #0171f6;
      }
      .ant-typography-copy {
        display: inline-block !important;
        position: absolute;
        right: 0;
        margin-left: 0;
        padding: 0 5px !important;
      }
    }
  }

  .dzh-table .ant-table-tbody > tr:nth-child(odd of .ant-table-row) > td {
    .ant-typography-copy {
      background-color: #fff !important;
    }
  }
  .dzh-table .ant-table-tbody > tr:nth-child(even of .ant-table-row) > td {
    .ant-typography-copy {
      background-color: #fff !important;
    }
  }

  .dzh-table .ant-table {
    .ant-table-thead > tr > th.pd-8,
    .ant-table-tbody > tr > td.pd-8 {
      padding-left: 8px;
      padding-right: 8px;
    }
  }
`;
