import styled from 'styled-components';
interface ContentPropsType {
  hasPagination: boolean;
}
export const Wrapper = styled.div`
  width: 100% !important;
  height: 100%;
  overflow: hidden auto !important;
  scrollbar-gutter: stable;
  /**弹窗内的表格样式 */
  .ant-modal-wrap.process-modal {
    .ant-modal-content {
      .ant-modal-body {
        background: rgb(255, 255, 255);
        padding: 16px 0px 20px 24px !important;
      }
    }
    .ant-table {
      tr:not(.ant-table-measure-row) {
        td {
          padding: 6px 12px !important;
          .title.primary-hover {
            color: #141414;
            text-decoration: none;
            &:hover {
              color: #0171f6;
            }
            display: block;
          }
          .blue-link {
            color: #025cdc;
            &:hover {
              text-decoration: underline;
            }
            display: block;
          }
          .empty-td {
            display: inline-block;
            width: 100%;
            text-align: center !important;
            display: block;
          }
          .title.primary-hover,
          .blue-link {
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            padding: 0;
          }
        }
      }
      .ant-table-thead > tr > th {
        padding: 6px 0 !important;
        text-align: center !important;
      }
      .ant-table-thead > tr > th.pdd-8 {
        padding: 6px 8px !important;
      }
    }
  }
`;
export const Content = styled.div<ContentPropsType>`
  background: #fff;
  padding: 0 8px 0 20px;
  padding-bottom: ${(props) => (props.hasPagination ? '0px' : '16px')};
  min-height: calc(100% - 60px);
  .main-title {
    font-size: 15px;
    font-weight: 500;
    text-align: left;
    color: #141414;
    line-height: 23px;
    position: relative;
    margin-bottom: 0 !important;
    margin-top: 12px;

    &::before {
      content: '';
      display: inline-block;
      position: absolute;
      left: -8px;
      top: 4px;
      width: 3px;
      height: 14px;
      background: #ff9347;
      border-radius: 2px;
    }
  }
  .filter {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 5;
    background: #fff;
    height: 36px;
  }
  .filter-left {
    display: flex;
    align-items: center;
    .searchWrap {
      display: inline-block;
    }
    .screenWrap {
      display: inline-block;
      margin-right: 20px;
      .screen-wrapper {
        display: flex;
        align-items: center;
      }
    }
  }
  .filter-right {
    display: flex;
    align-items: center;
    .count {
      font-size: 13px;
      font-weight: 400;
      color: #8c8c8c;
      margin-right: 24px;
      .overdebt-num {
        color: #333;
        margin: 0 4px;
      }
    }
  }
  .control {
    display: flex;
    align-items: baseline;
    justify-content: center;

    img {
      margin-left: 4px;
      cursor: pointer;
      height: 12px;
      width: 12px;
      position: relative;
      top: 1px;
    }
  }
  .link {
    font-weight: 400;
    color: #025cdc;
    line-height: 20px;
    font-size: 13px;
    cursor: pointer;
    margin-right: 4px;
    color: rgb(2, 92, 220);
  }
  .labelChange {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
  }
  .labelChange::before {
    content: '';
    float: right;
    height: 40px;
  }
  .label {
    clear: both;
    display: inline-block;
  }
  .pointer {
    cursor: pointer;
  }
  .pointer:hover {
    text-decoration: underline;
  }
  .labelWrap {
    line-height: 18px;
    font-size: 12px;
    padding: 2px 4px;
    margin-right: 4px;
    word-break: keep-all; // 防止标签折行
    display: inline-block;
  }
  .ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    word-break: break-all;
    white-space: nowrap;
  }
  .f9-ellipsis-link {
    font-size: 13px;
    font-weight: 400;
    line-height: 20px;
    display: flex;
    align-items: center;
    .link {
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-all;
      white-space: nowrap;
    }
  }
  .mount-table-loading {
    .ant-spin-container {
      opacity: 1;
      overflow: visible !important;
      transition: none;
      &:after {
        top: 34px;
        opacity: 0.85;
        transition: none;
        z-index: 2 !important;
        height: calc(100% - 30px) !important;
      }
    }
    .ant-spin-spinning {
      transition: none;
      .loading-tips {
        width: 88px;
        height: 88px;
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 4px 22px 6px rgba(44, 44, 48, 0.07);
        margin-left: -44px;
        opacity: 1;
        margin-top: -44px;
        z-index: 1;

        .loading-text {
          font-size: 13px;
          color: #434343;
          line-height: 20px;
          margin-top: 6px;
          display: block;
        }
      }
    }
  }
  .historyNumber {
    color: #025cdc;
  }
  /**节点页面样式 */
  .ant-table-container {
    &:after {
      display: none;
    }
    .ant-table-header {
      .ant-table-thead {
        th {
          text-align: center !important;
          padding: 6px 12px !important;
          line-height: 20px !important;
          .copy-icon {
            vertical-align: -3px !important;
          }
        }
        th.pdd-8 {
          padding: 6px 8px !important;
        }
      }
    }

    .ant-table-tbody {
      tr > td.ant-table-cell {
        padding: 6px 12px !important;

        div.wrap-td {
          white-space: normal;
          a {
            color: #141414;
            width: 100%;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            display: inline-block;
            &:hover {
              color: #0171f6;
            }
          }
        }
        .blue-link {
          color: #025cdc;
          &:hover {
            text-decoration: underline;
          }
        }
      }
      tr > td.pdd-8 {
        padding: 6px 8px !important;
      }
    }
  }
  .reset-empty {
    margin-top: 15vh;
  }
`;
