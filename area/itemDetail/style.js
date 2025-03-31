import styled from 'styled-components';

export const Container = styled.div`
  width: 1060px !important;
  margin: 0 auto;
  background: #fff;
  border-radius: 2px;
  padding: 20px 32px 16px;

  .special-debt-ul-title {
    color: #025cdc;
    &:hover {
      cursor: pointer;
      text-decoration: underline;
    }
  }

  .project-financing {
    display: flex;
    flex-wrap: wrap;
    list-style: none;
    justify-content: space-between;
    margin-bottom: 0;
    li {
      position: relative;
      flex-basis: calc(25% - 8px);
      height: 70px;
      padding: 14px 20px 12px 20px;
      align-items: center;
      margin-bottom: 10px;
      background: linear-gradient(174deg, rgba(235, 244, 255, 0.5), rgba(247, 250, 254, 0.06) 57%);
      border-radius: 3px;
      border: 1px solid #efefef;

      > div:first-of-type {
        font-size: 18px;
        text-align: left;
        color: #ff7500;
        line-height: 18px;
        margin-bottom: 8px;
        span {
          display: inline-block;
          font-size: 12px;
          vertical-align: bottom;
          font-weight: 400;
          text-align: left;
          color: #262626;
          transform: translateY(1px);
        }
      }
      > .name {
        font-size: 13px;
        font-weight: 400;
        text-align: left;
        color: #8c8c8c !important;
        line-height: 18px;
        position: relative;
        z-index: 10;
      }

      .bg-wrap {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 48px;
        height: 48px;
      }

      &:first-child {
        .bg-wrap {
          background: url(${require('@/assets/images/area/details/1.svg')}) no-repeat center center;
          background-size: 100% 100%;
        }
      }
      &:nth-child(2) {
        .bg-wrap {
          background: url(${require('@/assets/images/area/details/2.svg')}) no-repeat center center;
          background-size: 100% 100%;
        }
      }
      &:nth-child(3) {
        .bg-wrap {
          background: url(${require('@/assets/images/area/details/3.png')}) no-repeat center center;
          background-size: 100% 100%;
        }
      }
      &:nth-child(4) {
        .bg-wrap {
          background: url(${require('@/assets/images/area/details/7.svg')}) no-repeat center center;
          background-size: 100% 100%;
        }
      }
      &:nth-child(5) {
        .bg-wrap {
          background: url(${require('@/assets/images/area/details/8.svg')}) no-repeat center center;
          background-size: 100% 100%;
        }
      }
      &:nth-child(6) {
        .bg-wrap {
          background: url(${require('@/assets/images/area/details/5.svg')}) no-repeat center center;
          background-size: 100% 100%;
        }
      }
      &:nth-child(7) {
        .bg-wrap {
          background: url(${require('@/assets/images/area/details/6.svg')}) no-repeat center center;
          background-size: 100% 100%;
        }
      }
      &:nth-child(8) {
        .bg-wrap {
          background: url(${require('@/assets/images/area/details/4.svg')}) no-repeat center center;
          background-size: 100% 100%;
        }
      }
    }
  }
  .special-debt-ul {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    li {
      padding: 15px 8px 15px 12px;
      background: #ffffff;
      //border: 1px solid #e6e6e6;
      border: 1px solid rgb(230, 230, 230, 50%);
      border-radius: 4px;
      flex-basis: calc(50% - 5px);
      margin-bottom: 10px;
      display: flex;
      > div:first-of-type {
        width: 28px;
      }
      > div:last-of-type {
        flex: 1;
        min-width: 0;
        > div:first-of-type {
          font-size: 16px;
          font-weight: 500;
          color: #111111;
          line-height: 20px;
        }
        .sub-title {
          margin: 4px 0 14px 0;
          line-height: 1em;
        }
        dl {
          display: flex;
          &:first-of-type {
            margin-bottom: 5px;
          }
          dt {
            font-weight: 300 !important;
            width: 20%;
            display: block;
            text-align: left;
            font-size: 15px;
            color: #8c8c8c;
            line-height: 15px;
            letter-spacing: 0px;
          }
          dd {
            font-weight: 400 !important;
            width: 30%;
            text-align: right;
            padding-right: 22px;
            font-size: 15px;
            color: #111111;
            line-height: 15px;
          }
        }
      }
    }
  }
`;
export const Title = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  .header-title-wrap {
    display: flex;
    .header-title {
      font-size: 20px;
      font-weight: 500;
      color: #262626;
      line-height: 24px;
      margin-bottom: 16px;
      white-space: pre-wrap;
    }
    .title-tag-wrap {
      white-space: nowrap;
      .title-tag {
        height: 20px;
        color: #0171f6;
        border: 1px solid rgba(1, 113, 246, 0.2);
        border-radius: 2px;
        padding: 2px 6px;
        font-size: 12px;
        line-height: 18px;
        &:first-of-type {
          margin-left: 10px;
          margin-right: 6px;
        }
      }
    }
  }
  .header-func {
    width: 300px;
    display: flex;
    justify-content: end;
    font-size: 13px;
    color: #141414;
    line-height: 24px;
    .book-download {
      cursor: pointer;
    }
  }
`;
export const Card = styled.div`
  margin-bottom: 16px;
  .title {
    font-size: 15px;
    font-weight: 500;
    color: #141414;
    line-height: 23px;
    position: relative;
    padding: 6px 0 6px 8px;
    &:before {
      content: '';
      display: block;
      position: absolute;
      left: 0;
      top: 50%;
      margin-top: -8px;
      width: 3px;
      height: 14px;
      background: #ff9347;
      border-radius: 2px;
    }
  }
  .intro-content {
    font-size: 14px;
    color: #262626;
    line-height: 21px;
  }
  .style-table {
    font-size: 13px;
    font-weight: 400;
    color: #262626;
    line-height: 20px;
    td {
      padding: 5px 24px !important;
      border: 1px solid #e8ecf4;
    }
    td.title-class {
      background: #f9fbff !important;
    }
    &.val-right .content-class {
      text-align: right;
    }
    .hover-underline {
      font-size: 13px;
      font-weight: 400;
      color: #025cdc !important;
      line-height: 20px;
    }
  }
`;
