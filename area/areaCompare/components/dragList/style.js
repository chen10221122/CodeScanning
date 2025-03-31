import styled from 'styled-components';

import { ItemHeight } from '../../styles';

export const IndicatorList = styled.div`
  margin-top: ${(prop) => (prop.isScroll ? '160px' : '70px')};

  > dl {
    &:first-of-type {
      border-top: 1px solid #ebf1fc;
    }
  }

  dl {
    text-align: right;

    dd {
      opacity: 1;
      font-size: 13px;
      font-family: ArialMT;
      text-align: right;
      color: #141414;
      // line-height: 13px;

      &.link {
        color: #0171f6;
        cursor: pointer;
        text-decoration: underline;
      }
    }
  }

  dt {
    // background: #f9fbff;
  }

  dt,
  dd {
    //border: solid #ebf1fc;
    //border-width: 0 0 1px 0;
    margin: 0;
    padding: 0 18px 0 0;

    &.none {
      margin-bottom: -${ItemHeight}px;
      visibility: hidden;
    }
  }

  .ant-rate-star:not(:last-child) {
    margin-right: 1px;
  }

  .rate-start {
    color: #ff7500;
    font-size: 10px;
  }
`;

export const CardStyle = styled.div`
  /* flex: 1; */
  position: relative;
  background: #fff;
  width: 126px;

  .handler {
    height: 90px;
    // padding: 1px 0 0 0;
    padding: 10px 8px 0 0;
    position: sticky;
    z-index: 2;
    background: #fff;

    &.fixed {
      position: fixed !important;
      top: 62px !important;
      width: 126px !important;
      &:before {
        background: #fff;
        content: '';
        position: absolute;
        top: -9999px;
        left: 0;
        right: 0;
        bottom: 0;
      }
    }

    .card-title {
      background: #fff;
      border: 1px solid #f6f6f6;
      border-radius: 4px;
      // box-shadow: 0 8px 20px 0 rgba(230, 230, 230, 0.5);
      //padding: 25px 18px 12px;
      position: relative;
      height: 70px;
      text-align: center;
      z-index: 1;

      .remove {
        position: absolute;
        top: -7px;
        right: -6px;
        width: 14px;
        height: 14px;
        color: #cecece;
        background: #ffffff;
        line-height: 16px;
        border-radius: 50%;
        z-index: 1;
      }

      .add {
        position: absolute;
        right: -118px;
        width: 108px;
        height: 70px;
        border-radius: 4px;
        background: #fff;
        color: #0171f6;
        font-size: 12px;
        border: 1px solid #f6f6f6;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .remove-all {
        position: absolute;
        top: 36px;
        right: -26px;
        // border: 1px solid rgba(42, 134, 255, 0.5);
        width: 25px;
        height: 34px;
        border-radius: 0 2px 2px 0;
        color: #0171f6;
        display: flex;
        align-items: center;
        justify-items: center;
        line-height: 14px;
        font-size: 12px;
        background: #ebf4ff;
        padding: 4px 5px;
      }

      > span {
        display: block;
        font-size: 16px;
        color: #0e0e0e;
        line-height: 20px;
        margin: 0 0 4px;

        //&.area-name {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
        //}
      }

      .inner {
        position: relative;
        height: 51px;
        display: flex;
        align-items: center;
        justify-content: center;

        .name {
          /* padding-left: 12px; */
          display: flex;
          flex-direction: column;
          min-width: 50px;
          align-items: center;
          opacity: 1;
          font-size: 13px;
          font-family: PingFangSC, PingFangSC-Regular;
          font-weight: 400;
          text-align: center;
          color: #0e0e0e;

          /* span {
            max-width: 100px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          } */
        }
      }

      .btn-container {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 18px;
        background: #f5faff;

        a {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .replace-text {
          display: inline-flex;
          font-weight: 400;
          color: #0171f6;
          margin-left: 4px;
          transform: scale(${12 / 14});
          transform-origin: center center;

          .ant-dropdown-trigger {
            > span {
              display: none;
            }
          }
        }
      }
    }
  }
`;

export const ViewPort = styled.div`
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
`;
