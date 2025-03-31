import styled from 'styled-components';

export const Divider = styled.div`
  background-color: #f6f6f6;
  height: 6px;
`;

export const Container = styled.div`
  overflow: initial !important;
  width: 100% !important;
  padding-bottom: ${(props) => props.padding ?? '20px'};
  background: #fff;
  .ant-table-thead {
    .align-left {
      text-align: left !important;
    }
    .align-right {
      text-align: right !important;
    }
  }

  .card-title {
    position: relative;
    padding-left: 9px;
    font-size: 15px;
    font-weight: 500;
    text-align: left;
    color: #141414;
    line-height: 15px;
    &:before {
      content: '';
      display: block;
      position: absolute;
      left: 0;
      top: 0;
      width: 3px;
      height: 14px;
      border-radius: 2px;
      background: #ff9347;
    }
  }

  .sticky-top {
    position: sticky;
    top: 102px;
    height: 4px;
    background-color: #fff;
    z-index: 7;
  }

  .sticky-bottom {
    position: sticky;
    top: 106px;
    height: 8px;
    margin-bottom: 4px;
    background-color: #fff;
    z-index: 7;
  }

  .screen-wrap {
    padding-top: 4px !important;
    background-color: #fff;
    width: 100%;
    box-sizing: border-box;
    position: relative;
    z-index: 1;

    .select-wrap {
      min-height: 15px;
      > div:nth-of-type(2) {
        margin-left: 10px;
      }

      .ant-radio-group {
        .ant-radio-checked::after {
          display: none;
        }
      }

      // 修改antd自带的样式
      .ant-radio-group {
        margin-right: 8px;
        .ant-radio-wrapper {
          margin-right: 16px;
          font-size: 13px;
          .ant-radio {
            & ~ span {
              padding: 0;
            }
            padding-right: 6px;
            /* top: 0.1em; */
            top: 1px;
            .ant-radio-inner {
              width: 12px;
              height: 12px;
              &::after {
                width: 12px;
                height: 12px;
                margin-top: -6px;
                margin-left: -6px;
                background-color: #fff;
              }
            }
          }
          &.ant-radio-wrapper-checked {
            color: #0171f6 !important;
            .ant-radio-checked {
              .ant-radio-inner {
                padding: 2px;
                background-color: #0171f6;
              }
            }
          }
        }
      }
      .question-icon {
        font-size: 13px;
        width: 14px;
        height: 13px;
        line-height: 13px;
        color: #0171f5;
        margin-right: 4px;
        vertical-align: middle;
        // transform: translateY(-1px);
        cursor: pointer;
      }
      .question-text {
        //cursor: pointer;
        font-size: 13px;
      }
      .select-wrap-top {
        width: 100%;
        display: flex;
        flex-flow: row;
      }
      .select-right {
        height: 15px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding-right: 0;
        flex: 1;
        .ant-input-search-button {
          height: 16px;
        }
        .area-menu {
          color: rgba(0, 0, 0, 0.75);
          .menu-icon-reset,
          .menu-has-selected,
          .menu-active {
            padding-right: 14px;
          }
        }
      }
      .export-excel {
        margin-left: 10px;
        position: relative;
      }
    }
    .selected-wrap {
      width: calc(100% - 90px);
      padding: 2px 0 16px 0;
      display: flex;
      flex-flow: row;
      &.has-length {
        padding-bottom: 4px;
      }
      > div {
        &:first-of-type {
          width: 85px;
          &.has-length {
            top: 2px;
            position: relative;
          }
        }
        &:last-of-type {
          flex: 1;
        }
      }
    }
    .screen-wrap-second {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #5c5c5c;
      .screen-left-wrap {
        display: flex;
        align-items: center;
        .ant-radio-group {
          .ant-radio-checked::after {
            display: none;
          }
        }
      }
      // 修改antd自带的样式
      .ant-radio-group {
        margin-right: 8px;
        .ant-radio-wrapper {
          margin-right: 16px;
          font-size: 13px;
          .ant-radio {
            & ~ span {
              padding: 0;
            }
            padding-right: 6px;
            /* top: 0.1em; */
            top: 1px;
            .ant-radio-inner {
              width: 12px;
              height: 12px;
              &::after {
                background-color: #fff;
              }
            }
          }
          &.ant-radio-wrapper-checked {
            color: #0171f6 !important;
            .ant-radio-checked {
              .ant-radio-inner {
                padding: 2px;
                background-color: #0171f6;
              }
            }
          }
        }
      }
    }
  }
  .custom-area-economy-screen-wrap {
    z-index: 4;
    position: sticky;
  }
  #areaEconomySpecialDebtProjectsScreenContainer {
    z-index: 5;
  }
  /* &#special_debt_projects_container,
  &#area-economy-platforms-container {
    .ant-dropdown {
      z-index: 3;
    }
  } */

  .area-economy-table-wrap,
  .similar-table {
    @media screen and (max-width: 1279px) {
      .ant-table-sticky-scroll {
        background: transparent;
        border: none;
        bottom: 11px !important;
      }
    }
    .ant-pagination {
      padding-bottom: 0 !important;
    }
    th::before {
      display: none;
    }
    .region-name {
      display: flex;
      align-items: center;
      justify-content: center;
      .icon-region {
        margin-left: 4px;
      }

      .overview-container {
        width: auto !important;
      }
    }
  }

  .special-debt {
    .ant-table-thead > tr > th {
      padding: 5px 24px 5px 24px;
    }
    .ant-table-tbody > tr > td {
      padding: 5px 24px 5px 24px;
    }
  }

  .investmentPlatform {
    .ant-table-thead > tr > th,
    .ant-table-tbody > tr > td {
      padding: 5px 12px !important;
      font-weight: 400 !important;
      border-bottom: 1px solid #ebf1fc;
      box-sizing: border-box;
      line-height: 1.5em;

      &:not(:last-child) {
        border-right: 1px solid #f2f4f9;
      }
    }
    .ant-table-tbody > tr:first-child > td {
      padding: 0px 12px 0px 12px !important;
    }
  }
  /*
  .divider {
    position: absolute;
    top: 0;
    left: -20px;
    right: -20px;
    height: 6px;
    background: #f6f6f6;
    z-index: 10;
  } */

  .table-remark {
    margin-top: 12px;
    font-size: 13px;
    font-weight: 300;
    color: #8c8c8c;
    line-height: 14px;
  }

  .count-list {
    //margin-top: 12px;
    display: flex;
    flex-wrap: wrap;
    list-style: none;
    justify-content: space-between;
    margin-bottom: 12px;
    .count-list-item {
      position: relative;
      height: 70px;
      flex-basis: calc(20% - 10px);
      padding: 9px 0 12px 20px;
      border: 1px solid #e9f5ff;
      border-radius: 3px;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.5), rgba(242, 249, 255, 1));
      > .content {
        font-size: 18px;
        font-family: ArialMT;
        color: #ff7500;
        line-height: 27px;
        margin-bottom: 2px;
        .unit {
          display: inline-block;
          margin-left: 2px;
          font-size: 13px;
          font-weight: 400;
          color: #141414;
        }
      }

      > .label {
        font-size: 13px;
        font-weight: 400;
        color: #5c5c5c;
        line-height: 20px;
      }

      &:nth-of-type(1):after {
        background: url(${require('@/assets/images/area/item_bg1.png')}) no-repeat center bottom;
      }

      &:nth-of-type(2) :after {
        background: url(${require('@/assets/images/area/item_bg2.png')}) no-repeat center bottom;
      }

      &:nth-of-type(3):after {
        background: url(${require('@/assets/images/area/item_bg3.png')}) no-repeat center bottom;
      }

      &:nth-of-type(4):after {
        background: url(${require('@/assets/images/area/item_bg4.png')}) no-repeat center bottom;
      }

      &:nth-of-type(5):after {
        background: url(${require('@/assets/images/area/item_bg5.png')}) no-repeat center bottom;
      }

      &:after {
        content: '';
        position: absolute;
        right: 0;
        bottom: 0;
        width: 52px;
        height: 52px;
        background-size: contain !important;
      }
    }
  }

  .page-wrap {
    text-align: right;
    padding: 10px 0 0;
  }
  .table-content {
    position: relative;
    td a {
      color: #141414;
    }
  }
  .orange-title {
    color: #ff7500;
  }
  .table-title {
    margin-right: 8px;
  }
  .chart {
    width: 100%;
    height: 250px;
  }

  .trace-link-span {
    color: #025cdc;
    cursor: pointer;
    text-decoration: underline;
  }

  .clamp-col {
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  .similar-table {
    border-radius: 4px;
    // .ant-table-wrapper {
    //   min-width: 1180px;
    // }
    .ant-table-tbody > tr.ant-table-row > td.ant-table-cell:nth-last-child(2) {
      border-right: 1px solid transparent;
    }
    .ant-table-tbody > tr.ant-table-row > td.ant-table-cell:last-child {
      padding-right: 0 !important;
      border-radius: 4px 0 0 4px;
      border-left: 1px solid #ebf1fc;
    }
    .ant-table-tbody > tr.ant-table-row:hover > td.ant-table-cell:not(:first-child, :last-child) {
      background: rgba(1, 113, 246, 0.04) !important;
    }
    tr {
      td:first-child {
        background: #f7fbff !important;
      }
      td:last-child {
        background: #f7fbff !important;
        color: #025cdc !important;
        padding: 0 !important;
        width: 70px !important;
      }
      &:hover {
        td:first-child,
        td:last-child {
          background: #f7fbff !important;
        }
        td:last-child:hover {
          background: #006dff !important;
          color: #fff !important;
        }
      }
    }
    /* td {
      padding: 5px 24px !important;
      font-size: 13px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      color: #262626;
      line-height: 20px;
      height: 54px;
      background-color: #fff !important;
    } */

    .similar-title {
      width: 143px;
      opacity: 1;
      font-size: 13px;
      font-weight: 400;
      text-align: left;
      color: #262626;
      line-height: 20px;
      background: #f7fbff;
      padding-left: 24px !important;
    }
    .similar-region-cell-padding {
      padding: 7px 16px !important;
    }
    .region-name {
      position: relative;
      text-align: center;
      //line-height: 20px;
      overflow: hidden;
      .name {
        display: inline-block;
        opacity: 1;
        font-size: 13px;
        font-weight: 400;
        text-align: center;
        color: #141414;
        line-height: 20px;
      }
      .overflow-ellipsis {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .long {
        max-width: 115px;
        margin-right: 5px;
      }
      .w100 {
        width: 100%;
      }

      .icon-region {
        display: inline-block;
        width: 21px;
        height: 20px;
        background: url(${require('@/assets/images/area/icon-region.svg')}) no-repeat center center;
        background-size: contain;
        flex-shrink: 0;
      }
    }
    .region-value {
      opacity: 1;
      font-size: 13px;
      font-weight: 400;
      text-align: center;
      color: #141414;
      line-height: 20px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .similar-more-wrap {
      position: relative;
      width: 100%;
      display: inline-block;
      .similar-more {
      }
    }
  }

  .similar-economy-popover {
    .ant-popover-inner-content {
      color: #fff;
      //background: rgba(0, 0, 0, 0.75);
      box-shadow: 0px 9px 28px 8px rgba(0, 0, 0, 0.05), 0px 6px 16px 0px rgba(0, 0, 0, 0.08),
        0px 3px 6px -4px rgba(0, 0, 0, 0.12);
      border-radius: 2px;
      padding: 5px 8px;
      font-size: 14px;
      font-weight: 400;
      line-height: 23px;
    }

    .ant-popover-content > .ant-popover-arrow {
      border-right-color: rgba(0, 0, 0, 0.65);
      border-bottom-color: rgba(0, 0, 0, 0.65);
    }
  }

  .table-under-link {
    color: #025cdc !important;
    &:hover {
      cursor: pointer;
      text-decoration: underline;
    }
  }

  .hover-underline {
    color: #025cdc !important;
    &:hover {
      cursor: pointer;
      text-decoration: underline;
    }
  }
  .special-debt-projects {
    display: flex;
    margin: 0px 0 16px 0;
    align-items: flex-start;
    justify-content: space-between;
    align-items: center;
    .chartContainer {
      width: 40%;
      margin-right: 14px;
      border: 1px solid #efefef;
      border-radius: 2px;
      align-self: stretch;
      display: flex;
      align-items: center;
      .chart {
        width: 100%;
        min-height: 280px;
        height: 100%;
      }
    }

    .table-wrap {
      width: 60%;
      th::before {
        display: none;
      }
    }
  }
  //项目明细
  .specific-table {
    .ant-table-thead > tr > th:not(last-of-type),
    .ant-table-tbody > tr.ant-table-row > td.ant-table-cell:not(:last-of-type) {
      border-right: 1px solid #f1f6fe;
    }
  }

  .underArea-table,
  .specialDebt-table {
    .ant-table-thead th {
      text-align: center !important;
    }
    .ant-table-container {
      &:after {
        display: none;
      }
    }
  }

  .project_classify_table {
    .ant-table-container {
      border-bottom: 1px solid #ebf1fc;
      border-left: 1px solid #ebf1fc;
      border-right: 1px solid #ebf1fc;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      .ant-table-body {
        //scrollbar-color: #cfcfcf transparent;
        overflow: overlay !important;

        .browser_firefox & {
          scrollbar-color: #cfcfcf transparent;
        }

        &:hover {
          ::-webkit-scrollbar,
          ::-webkit-scrollbar-thumb {
            visibility: visible;
          }
        }
        ::-webkit-scrollbar,
        ::-webkit-scrollbar-thumb {
          visibility: hidden;
        }
        ::-webkit-scrollbar {
          width: 6px; /*对垂直流动条有效*/
        }
        ::-webkit-scrollbar-thumb {
          border-radius: 4px;
          background: #cfcfcf;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #b0b0b0;
        }
      }
    }
    .ant-table-container table > thead > tr:first-child th {
      text-align: left !important;
    }
    .ant-table-container table > thead > tr:first-child th:not(:first-child) {
      text-align: right !important;
    }
    .ant-table-thead > tr > th:not(:last-child),
    .ant-table-tbody > tr > td:not(:last-child) {
      border: none;
    }
    .ant-table-container table > tbody > tr td {
      border-right: none !important;
    }
    .ant-table-container table > thead > tr th {
      border-right: none !important;
    }
    .ant-table-container {
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      .ant-table-body {
        &::-webkit-scrollbar-thumb {
          background-color: transparent;
        }

        &:hover {
          &::-webkit-scrollbar-thumb {
            background-color: #c0c6cf;
          }
        }
      }
    }
    .ant-table-tbody > tr.ant-table-row:nth-of-type(even) > td {
      background-color: #fff;
    }
    .ant-table-tbody > tr.ant-table-row:nth-of-type(odd) > td {
      background-color: #f9fbff;
    }
  }

  .area-menu {
    position: relative;
    right: -10px;

    .horizontal {
      width: 500px;
    }
  }
  .search {
    display: inline-block;
    margin-left: 24px;
  }
  .ant-table-thead th.ant-table-column-has-sorters:hover {
    background-color: #f8faff;
  }
  .ant-table-column-sorter {
    margin-left: 2px;
    height: 18px;
  }
`;

export const TableWrapper = styled.div`
  .ant-table-container {
    border-color: #f1f6fe;
  }

  .ant-table-container .ant-table-tbody > tr.ant-table-row:not(.focus-link):hover > td {
    &.cell-class {
      background-color: #ffd6d6 !important;
    }
    &.first-update {
      background-color: #ffe9d7 !important;
    }
  }

  .ant-table-tbody {
    > tr > td {
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
      &.missVCA {
        background: right center / 14px no-repeat url(${require('@/assets/images/area/missVCA.svg')});
      }
    }
  }

  .ant-table {
    .ant-table-thead tr > th,
    .ant-table-tbody tr > td {
      padding: 4px 12px !important;
    }

    .ant-table-thead tr > th {
      border-bottom-color: #f1f6fe;
    }

    .ant-table-tbody tr > td {
      border-bottom-color: #f1f6fe !important;
    }

    .ant-table-tbody > tr:hover:not(.ant-table-expanded-row) > td {
      /* background-color: #ebf4fb !important; */
      /** f9城投分析，城投平台大全 弹窗里的表格样式 */
      background-color: #eef2fd !important;
    }
  }
`;

export const ChangeScreenStyle = styled.div`
  .ant-spin-nested-loading {
    & > div > .ant-spin {
      max-height: 400px !important;
    }
    .ant-spin-blur {
      overflow: initial;
      opacity: 0.1;
    }
  }
  /* 去除表格阴影 */
  .ant-table-ping-right:not(.ant-table-has-fix-right) .ant-table-container::after {
    box-shadow: none;
  }
`;
