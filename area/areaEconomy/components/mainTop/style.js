import styled, { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  .area-rate-detail{
    left: -50px !important;
    top: 35px !important;
    z-index: 1060 !important;
    //width: 1090px;
    /* min-width: 1000px;
    width: calc(100vw - 180px); */

    .ant-popover-inner{
      transform: translateX(${(props) => props.popoverLeft}px);
    }

    .ant-popover-inner-content{
      padding: 31px 24px !important;
      /* overflow-x: auto; */
    }

    .ant-popover-content{
      .ant-popover-arrow{
        z-index: 12;
        left: 120px !important;
      }
    }
  }
`;

// 头部布局
export const Container = styled.div`
  min-width: 980px;
  box-sizing: border-box;
  width: 100%;
  .area-top {
    width: 100%;
    min-width: 980px;
    box-sizing: border-box;
    > .title {
      position: sticky !important;
      z-index: 109;
      top: 0px;
      background-color: #fafafa;
      height: 54px;
      display: flex;
      padding: 8px 20px;
      align-items: center;
      position: relative;

      /* 标题 */
      h1 {
        margin: 0;
        z-index: 2;
        font-size: 24px;
        font-weight: 500;
        color: #262626;
        font-weight: 600;
        line-height: 33px;
      }

      .divider {
        height: 36px;
        border: 1px solid;
        border-image: linear-gradient(180deg, #ffffff 4%, #e9e9e9 49%, #fdfdfd 94%) 1 1;
        margin: 0 15px 0 8px;
        position: relative;
        transform: scaleX(0.5);
      }

      .divider_empty {
        width: 1px;
        height: 36px;
        position: relative;
      }

      .rate {
        cursor: pointer !important;
        height: 33px;
        font-size: 16px;
        font-weight: 400;
        text-align: left;
        color: #6a4b30;
        line-height: 1px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .rate-word {
          background: url(${require('@/assets/images/area/rate-word.png')}) no-repeat center;
          display: inline-block;
          width: 84px;
          height: 14px;
          background-size: contain;
        }

        .rate-star-wrap {
          background: #f2f2f2;
          border-radius: 2px;
          height: 16px;
          padding: 0 4px;
          transform: translateX(-4px);
        }

        .rate-num {
          margin-right: 6px;
          color: #ff9032;
          font-size: 12px;
          font-weight: BoldMT;
          color: #ff9032;
          line-height: 16px;
          margin-right: 6px;
          display: inline-block;
        }
        .rate-chart {
          display: inline-block;
          position: relative;
          top: -1px;
          .ant-rate-star:not(:last-child) {
            margin-right: 4px !important;
          }

          .ant-rate-star > div:hover,
          .ant-rate-star > div:focus {
            -webkit-transform: scale(1) !important;
            transform: scale(1) !important;
          }
          .rate-start {
            color: #ff9032;
            font-size: 10px;
          }
        }
      }

      .toptools-wrap {
        display: flex;
        align-items: center;
        position: absolute;
        right: 24px;
        .trial-wrap {
          & > span {
            position: static;
          }
          margin-right: 22px;
          .iconfont {
            font-size: 12px;
          }
        }
        .split-margin {
          /* border: 1px solid #ececec; */
          height: 15px;
          margin-right: 16px;
        }
      }
    }
    > .border_bottom_title {
      position: sticky !important;
      z-index: 108;
      top: 54px;
      height: 4px;
      background: #f6f6f6;
    }
  }

  .tab-outer-wrap {
    background: white;
    padding: 0 0 0 24px;
    border-bottom: 1px solid #0171f6;
    .active-line {
      width: 22px;
      height: 2px;
    }
  }

  @media (min-width: 1366px) {
    .area-top {
      > .title {
        padding-left: 68px;
        padding-right: 68px;

        .toptools-wrap {
          right: 68px !important;
        }
      }
    }
    .sticky-tab {
      margin: 0 48px;
    }
    .inner-tab {
      .ant-tabs-nav {
        margin: 0 48px;
      }
    }
    .tab-outer-wrap {
      padding: 0 0 0 72px;
    }
  }

  @media (min-width: 600px) and (max-width: 1285px) {
    .area-top {
      > .title {
        .toptools-wrap {
          right: 20px;
        }
      }
    }
  }
`;
