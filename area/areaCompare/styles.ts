// import styled from 'styled-components';
import styled, { createGlobalStyle } from 'styled-components';

import { appbarHeight } from '@/app/less.config';

export const ItemHeight = 32;
export const TitleHeight = 32;
export const PaddingLeft = 8;
export const PaddingRight = 8;

export const GlobalStyle = createGlobalStyle`
.ant-select-item-option-selected:not(.ant-select-item-option-disabled) {
  background-color: #F4F9FF;
}
`;

export const OuterLay = styled.div<{ dynamicPadding: number; sticky: boolean }>`
  //height: 100%;
  flex: auto;
  //overflow: auto;
  //overflow: overlay;
  background-color: #fff;
  background-size: 100% auto;
  width: 100%;
  min-width: 1280px;
  display: flex;
  overflow: unset !important;

  &.noPower {
    filter: blur(4px);
  }

  .ant-btn-primary {
    box-shadow: none;
    background: #0171f6;
  }

  .container-custom {
    width: ${({ dynamicPadding }) => `calc(100vw  - ${dynamicPadding * 2}px)`};
    min-width: 1280px;
    margin: ${({ dynamicPadding }) => `0 ${dynamicPadding}px`};
  }

  .container {
    position: relative;
    // padding-top: 84px;
  }

  .title-wrapper {
  }

  h1 {
    // font-size: 26px;
    // font-weight: 500;
    // text-align: left;
    // color: #000;
    // line-height: 1;
    // position: absolute;
    // top: 31px;
    // left: 77px;
    // margin-top: 0;
  }

  .main {
    background: #fff;
    padding-top: 6px;
    // border-radius: 6px 6px 0 0;

    .func-area {
      line-height: 60px;
      padding: 0 32px;
      border-bottom: 1px solid #f5f5f5;

      .fr {
        float: right;
        .ant-btn-primary {
          border-color: #81b8ff;
        }

        .ant-btn-link {
          color: #434343;
          i {
            display: inline-block;
            margin-right: 5px;
          }
        }
      }
    }

    .content {
      display: flex;
      padding: 0 0 32px 24px;

      &.max {
        .max {
          color: #ff7500;
        }
      }

      &.min {
        .min {
          color: #ff7500;
        }
      }

      &.equal {
        .equal {
          display: none;
        }
      }

      &.sticky {
        .opt-select {
          //position: fixed;
          //top: 54px;
          //width: 206px;

          &:before {
            // content: '';
            // position: fixed;
            // top: 54px;
            // left: 0;
            // right: 0;
            // height: 126px;
            // background: #fff;
          }
          /*
          .inner {
            position: relative;
            z-index: 2;
          }*/
        }
      }

      dl {
        line-height: ${ItemHeight}px;
        color: #000;
        margin: 0;
        overflow: hidden;

        dd {
          transition: max-height 0.3s, padding-top 0.3s, padding-bottom 0.3s;
          max-height: ${ItemHeight}px;

          &.third {
            border: none;
            max-height: none;
            padding-left: 0;
            padding-right: 0;
          }
        }

        .level1 {
          color: #ff9933;
          font-weight: 500;
        }

        .level2 {
          text-indent: 14px;
        }
        .level3 {
          text-indent: 28px;
        }
        .level4 {
          text-indent: 42px;
        }

        .title-chart-vip {
          display: flex;
          align-items: center;
          i {
            flex-shrink: 0;
          }
        }

        .text-label {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-right: 4px;
        }

        .icon-wrap {
          display: inline-flex;
        }

        dt {
          min-height: ${TitleHeight}px;
          line-height: ${TitleHeight - 1}px;
          color: #141414;
          font-size: 13px;
          font-weight: normal;

          &.first-line {
            height: 30px;
            line-height: 30px;
            background: #fff;
          }
        }

        dt,
        dd {
          position: relative;
          border-bottom: 1px solid #ebf1fc;

          &.hover {
            // border-bottom-color: rgb(129, 184, 255);
            background: #0171f60a;
          }

          &.line_2 {
            max-height: 58px;
            padding-top: 8px;
            padding-bottom: 8px;
            line-height: 20px;
          }
        }
      }

      .filter-indicator {
        width: ${({ dynamicPadding }) => `calc(100vw - 12px - ${dynamicPadding * 2}px)`};
        min-width: 1280px;
        height: 70px;
        margin-left: -24px;
        padding-bottom: 10px;
        display: flex;
        flex-direction: column;
        position: sticky;
        top: 91px;
        z-index: 3;
        .filter-export {
          height: 28px;
          line-height: 20px;
          padding: 4px 24px 4px 32px;
          background-color: #fff;
          display: flex;
          justify-content: space-between;
          .filter-wrap {
            display: flex;
            align-items: center;
            .screen-wrapper :not(:last-child) {
              margin-right: 24px;
            }
            .check-wrap {
              height: 20px;
              .ant-checkbox {
                transform: scale(0.75);
                top: 3px;
                margin-right: 2px;
              }
              .ant-checkbox + span {
                padding-left: 0;
                padding-right: 0;
              }
              .text {
                display: inline-block;
                font-size: 13px;
                font-weight: 400;
                color: #262626;
                line-height: 20px;
              }
              .update-help-img {
                width: 12px;
                height: 12px;
                margin-left: 2px;
                margin-bottom: 4px;
                cursor: pointer;
              }
            }
            .ant-tooltip-placement-top {
              /* padding-bottom: 4px; */
              .remark-pop {
                font-size: 12px;
                font-weight: 400;
                text-align: left;
                color: #262626;
                line-height: 18px;
                padding: 2px;
              }
            }
          }
          .export-wrap {
            display: flex;
            align-items: center;
          }
        }
        .indicators {
          height: 32px;
          padding: 0px 24px 0px 32px;
          background-color: ${({ sticky }) => (sticky ? '#fff' : '#fafbfd')};
          position: relative;
          .ant-affix {
            position: absolute !important;
            top: 0px !important;
          }
          .ant-anchor {
            display: flex;
            .ant-anchor-ink {
              display: none;
            }
            .ant-anchor-link {
              font-size: 13px;
              font-weight: 400;
              line-height: 32px;
              padding: 0;
              &:not(:last-child) {
                margin-right: 32px;
              }
              .ant-anchor-link-title {
                color: #333;
              }
            }
            .ant-anchor-link-active > .ant-anchor-link-title {
              font-weight: 500;
              color: #ff7500;
            }
          }
        }
      }

      .drag-area {
        flex: auto;
        //z-index: 3;
        //border-bottom: 1px solid #ebf1fc;
        display: flex;
        position: relative;
        margin-right: 24px;
        overflow-x: overlay;
        .right-empty-filling:last-child .indicatorList {
          border-right: 1px solid #ebf1fc;
        }
        .right-empty-filling {
          dd,
          dt {
            padding-right: 0;
            font-size: 0;
          }
        }
        dl {
          .line_2 {
            /* line-height: 40px; */
          }
        }

        &.noData {
          flex-direction: column;

          .patch-head {
            display: none;
          }
        }

        .add-area {
          padding: 0 0 0 80px;
          z-index: 3;
          background: #fff url(${require('@/assets/images/area/add_area.png')}) no-repeat right bottom;
          background-size: auto 100%;
          height: 90px;
          position: sticky;
          top: 0;

          h3 {
            // color: #262626;
            // font-weight: normal;
            // font-size: 13px;
            // line-height: 1;
            // margin: 17px 0 8px 0;
            margin-top: 17px;
            opacity: 1;
            font-size: 14px;
            font-family: PingFangSC, PingFangSC-Medium;
            font-weight: 500;
            text-align: left;
            color: #141414;
            line-height: 14px;
          }

          p {
            color: #8c8c8c;
            line-height: 1;
            font-size: 12px;
            margin: 0 0 8px;
          }

          .ant-btn {
            height: 22px !important;
            width: 68px !important;

            span {
              font-size: 12px !important;
              position: relative;
              top: -2px;
            }
          }
        }
      }
    }

    .add-fix {
      position: absolute;
      right: 0;
      top: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      z-index: 2;
      width: 34px;
      height: 70px;
      text-align: center;
      background: linear-gradient(270deg, #1f85fe, #2da0ff);
      border-radius: 6px 0px 0px 6px;
      cursor: pointer;

      span {
        font-size: 12px;
        font-weight: 400;
        color: #ffffff;
        margin-top: 6px;
      }
    }
  }
`;

export const SideWidth = 224;
export const fontStyle = `13px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'`;

export const SideStyle = styled.div`
  flex: none;
  width: ${SideWidth}px;
  position: relative;
  font: ${fontStyle};
  //border-bottom: 1px solid #ebf1fc;

  .opt-select {
    padding: 17px 48px 0 10px;
    height: 90px;
    line-height: 22px;
    color: rgba(0, 0, 0, 0.65);
    position: sticky;
    top: 0;
    background: #fff;
    z-index: 2;
    .clear-btn {
      position: absolute;
      right: 18px;
      top: 14px;
      font-size: 12px;
      color: #8c8c8c;
      cursor: pointer;
    }

    h2 {
      opacity: 1;
      font-size: 14px;
      font-family: PingFangSC, PingFangSC-Medium;
      font-weight: 500;
      text-align: left;
      color: #141414;
      line-height: 14px;
      margin-bottom: 6px;
    }

    .ant-checkbox-group {
      label {
        margin: 0;
        line-height: 12px;
        font-size: 12px;
        color: rgba(0, 0, 0, 0.65);

        .ant-checkbox {
          transform: scale(${12 / 16});
        }
      }
    }
  }

  .title {
    border-left: 1px solid #ebf1fc;
    // background: #f9fbff;
    > dl {
      &:first-of-type {
        border-top: 1px solid #ebf1fc;
      }
    }

    dl {
      dt,
      dd {
        border-right: 1px solid #ebf1fc;
        margin: 0;
        padding-left: ${PaddingLeft}px;
        padding-right: ${PaddingRight}px;
      }

      dt {
        &.first-line {
          opacity: 1;
          font-weight: 500;
          color: #ff9933;

          .has-tooltip {
            position: relative;
            top: -2px;
            cursor: default;
            color: #0171f6;
            margin: 0 6px 0 0;
            font-size: 13px !important;

            ~ span {
              font-size: 13px !important;
              padding-right: 6px;
            }
          }

          button[role='switch'] {
            position: relative;
            top: -1px;
            height: 13px;
            line-height: 13px;

            .ant-switch-handle {
              top: 1px;
            }
          }

          .ant-select-selector {
            font-size: 13px !important;
          }

          .ant-select {
            .ant-select-arrow {
              right: 13px;
            }
          }
        }

        a {
          line-height: 1;
          color: #0171f6;
          margin-left: 4px;
        }
      }
    }
  }
`;

export const FixedBanner = styled.div`
  width: 100vw;
  height: 150px;
  position: fixed;
  background: #fff;
  top: ${appbarHeight};
  box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.06);
`;
export const FixedLine = styled.div`
  width: 100vw;
  height: 1px;
  position: fixed;
  background: #efefef;
  top: calc(90px + ${appbarHeight});
`;

export const TitleWrapperBG = styled.div`
  height: 36px;
  width: 100%;
  background: #fff;
  /* fix bug 6132 【dev】地区比较拖动出框bug */
  position: fixed;
  top: ${appbarHeight};
  z-index: 1;
`;
