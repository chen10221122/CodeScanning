import styled from 'styled-components';

export const Row = styled.div`
  display: flex;
  margin-bottom: 6px;
  &:last-child {
    margin-bottom: 0;
  }
  > div:not(:last-child) {
    margin-right: 6px;
  }
  > div {
    flex-grow: 1;
  }
`;

export const Wrapper = styled.div<{
  height?: number;
  ratio?: number;
  mini?: boolean;
  gap?: number;
  backgroundImg?: boolean;
}>`
  border: 1px solid #f4f4f4;
  border-radius: 4px;
  height: ${({ height }) => (height ? height + 'px' : '328px')};
  width: ${({ ratio, gap = 1 }) => (ratio ? `calc((100% - 12*${gap}px) * ${ratio} / 100)` : '100%')};
  padding: ${({ mini }) => (mini ? '8px 12px 6px 12px' : '8px 12px 12px 12px')};
  background-color: #ffffff;
  background-image: ${({ backgroundImg }) => (backgroundImg ? `url(${require('./bg@2x.png')})` : 'none')};
  background-size: 310px auto;
  background-position: right;
  background-repeat: no-repeat;
  .link {
    color: #025cdc;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
  .ant-spin-nested-loading:has(.empty-classname) {
    height: 100%;
    .ant-spin-container {
      height: 100%;
    }
  }
`;

export const CommonTable = styled.div`
  .ant-table-cell-fix-left-last {
    border-right: none !important;
  }
  .ant-table-thead > tr:not(.ant-table-measure-row) > th,
  .ant-table-tbody > tr:not(.ant-table-measure-row) > td {
    height: 28px !important;
    padding-top: 4px !important;
    padding-bottom: 4px !important;
    white-space: pre-line;
  }
  .ant-table-ping-right:not(.ant-table-has-fix-right) .ant-table-container::after {
    box-shadow: none;
  }
  .ant-table-container {
    .ant-table-body {
      overflow: overlay !important;
      scrollbar-gutter: stable;
      ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      ::-webkit-scrollbar-thumb {
        background-color: transparent;
      }
      &:hover {
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-thumb {
          background-color: #c0c6cf;
        }
      }
    }
  }
  .ant-table {
    border: none;
    .ant-table-container {
      border: none;
    }
    /* .ant-table-thead > tr > .ant-table-cell-fix-left-last {
      border-right: 1px solid #ebf1fc !important;
    } */
    .ant-table-thead > tr:last-child > th {
      border-bottom: none !important;
    }
    .ant-table-thead > tr:first-child > th {
      border-top: none !important;
    }
    .ant-table-thead > tr:first-child > th:nth-child(-n + 2) {
      border-bottom: none !important;
    }
    .ant-table-tbody > tr > td {
      border: none;
    }
  }
`;

export const CompactTable = styled(CommonTable)`
  .ant-table {
    .ant-table-thead > tr > th {
      border: none !important;
    }
    .ant-table-thead > tr:last-child > th {
      &:first-child {
        text-align: left !important;
      }
      &:nth-child(n + 2) {
        text-align: right !important;
      }
    }
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

export const Left = styled.div`
  display: flex;
  align-items: center;
  justify-content: left;
`;

export const Center = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
