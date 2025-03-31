import styled from 'styled-components';

export const ContentContainer = styled.div<{ isLoading?: boolean }>`
  .area-company-single-container {
    display: ${({ isLoading }) => (isLoading ? 'none' : 'block')};
  }

  .ant-table-ping-right:not(.ant-table-has-fix-right) .ant-table-container::after {
    box-shadow: none;
  }
  .ant-table-container table > thead > tr:first-child th:first-child {
    padding: 6px 8px;
  }
  .ant-table-thead th.ant-table-column-has-sorters:hover {
    background: rgba(248, 250, 255);
  }
  .ant-table-column-sorters {
    white-space: nowrap;
    justify-content: center;
    align-items: center;
    .ant-table-column-sorter {
      height: 20px;
      padding-left: 4px;
      .ant-table-column-sorter-inner {
        width: 12px;
      }
    }
    .ant-table-column-title {
      height: 20px;
      flex: unset;
    }

    svg {
      margin-left: 4px;
    }

    > span {
      &:first-of-type {
        word-break: break-all;
        white-space: normal;
      }
    }
  }
  .ant-table-thead .screen-wrapper > div {
    margin: 0 auto;
  }

  .ant-table-sticky-scroll {
    z-index: 4;
  }

  .ant-empty {
    margin: 28px 0 0;
    padding-bottom: 40px;
  }

  /* ul.ant-pagination {
    padding-bottom: 0px;
  } */

  .pagination-wrapper {
    padding-top: 8px;
    position: relative;
    left: 9px;
    ul {
      margin-bottom: 0px;
    }
  }

  > .ant-spin-nested-loading > .ant-spin-container {
    overflow: inherit;
  }

  > .ant-spin-nested-loading > div > .ant-spin {
    position: absolute;
  }

  .numberModal {
    color: #025cdc;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }

  .creditRating {
    display: flex;
    justify-content: center;
    span {
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: normal;
    }
    span:nth-of-type(2) {
      width: 15px;
    }
    > a {
      flex-shrink: 0;
    }
    img {
      width: 14px;
      height: 14px;
      position: relative;
      top: -2px;
      margin-left: 3px;
      cursor: pointer;
      image-rendering: -webkit-optimize-contrast;
    }
  }

  // 租赁融资-将到期事件-出租人popover
  .lessee-popover-content,
  .leaser-popover-content {
    ::-webkit-scrollbar {
      width: 6px !important;
    }
    ::-webkit-scrollbar-thumb {
      border-radius: 4px;
      background: #cfcfcf;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #b0b0b0;
    }
    max-width: 564px;
    // background: #fff;
    .ant-popover-inner {
      padding: 12px 4px 12px 0 !important;
      .ant-popover-inner-content {
        padding: 0 12px 0 16px !important;
        max-height: 300px;
        overflow-y: auto;
        .popover-text {
          display: inline-block;
          color: #141414;
          font-size: 13px;
        }
      }
    }

    .line {
      display: flex;
      align-items: flex-start;
      margin-bottom: 6px;
      &:last-child {
        margin-bottom: 0;
      }
      .word {
        margin-top: 2px;
        &.no-hover {
          cursor: default;
        }
        display: inline-block;
        line-height: 20px;
        white-space: wrap;
        cursor: pointer;
        font-size: 13px;
        font-weight: 400;
        // transform: translateY(2px);
        &:not(.no-hover):hover {
          color: #0171f6;
        }
        &.wrap {
          max-width: 208px;
        }
      }
    }
  }
`;

export const FirstEmpty = styled.div`
  height: 26px;
  font-size: 12px;
  color: #cccccc;
  line-height: 18px;
  padding-top: 8px;
`;

export const SingleLoadingDom = styled.div`
  height: 450px;
`;

export const MultiLoadingDom = styled.div`
  /* 与空状态保持一致 */
  height: 210px;
`;
