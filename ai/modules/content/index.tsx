import { useMemoizedFn } from 'ahooks';
import styled from 'styled-components';

import QueryArea from '../../components/queryArea';
import One from './images/1.svg?react';
import Two from './images/2.svg?react';
import Three from './images/3.svg?react';
import Four from './images/4.svg?react';
import Check from './images/check.svg?react';
import Fire from './images/fire.svg?react';

const Content = () => {
  const getQuestion = useMemoizedFn(() => {});
  const toggle = useMemoizedFn(() => {});

  return (
    <Wrapper>
      <div className="content-wrapper">
        <div className="content-list">
          <ul className="left">
            <li>
              <div className="left-title">
                <Check />
                <span>找功能</span>
              </div>
              <div className="left-content">城投企业募集资金用途在哪个模块城投企业募集资金用途在哪个模块</div>
            </li>
            <li>
              <div className="left-title">
                <Check />
                <span>找功能</span>
              </div>
              <div className="left-content">城投企业募集资金用途在哪个模块城投企业募集资金用途在哪个模块</div>
            </li>
            <li>
              <div className="left-title">
                <Check />
                <span>找功能</span>
              </div>
              <div className="left-content">城投企业募集资金用途在哪个模块城投企业募集资金用途在哪个模块</div>
            </li>
            <li>
              <div className="left-title">
                <Check />
                <span>找功能</span>
              </div>
              <div className="left-content">城投企业募集资金用途在哪个模块城投企业募集资金用途在哪个模块</div>
            </li>
          </ul>
          <div className="right">
            <div className="line"></div>
            <div className="right-title">
              热门问答&nbsp;
              <Fire />
            </div>
            <div className="right-remark">大家关心的热门问题</div>
            <ul className="right-list">
              <li className="right-list-title">
                <One />
                <span>城投企业募集资金用途在哪个模块</span>
              </li>
              <li className="right-list-title">
                <Two />
                <span>城投企业募集资金用途在哪个模块城投企业募集资金用途在哪个模块</span>
              </li>
              <li className="right-list-title">
                <Three />
                <span>城投企业募集资金用途在哪个模块</span>
              </li>
              <li className="right-list-title">
                <Four />
                <span>城投企业募集资金用途在哪个模块</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="query-area-wrapper">
        <QueryArea getQuestion={getQuestion} isFindFunction={false} toggleApi={toggle} loading={false} />
      </div>
    </Wrapper>
  );
};

export default Content;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  max-width: 660px;
  margin: 0 auto;
  position: relative;
  .query-area-wrapper {
    position: absolute;
    bottom: 20px;
    left: 0;
    width: 100%;
  }
  .content-wrapper {
    background-image: url(${require('./images/main.webp')});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    width: 100%;
    height: 277px;
    margin-top: 49px;
    position: relative;
    .content-list {
      width: 646px;
      height: 199px;
      background: linear-gradient(248deg, #f3f7ff 0%, #ffffff 75%);
      border-radius: 19px;
      box-shadow: 4px 3px 10px 0px rgba(232, 241, 255, 0.68);
      position: absolute;
      top: 116px;
      left: 46px;
      z-index: 1;
      padding: 20px 18px 0;
      display: flex;
      .left {
        width: 404px;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        height: 100%;
        li {
          width: 50%;
          height: 50%;
          padding-right: 15px;
        }
        .left-title {
          display: flex;
          align-items: center;
          gap: 3px;
          font-size: 13px;
          font-family: PingFang SC, PingFang SC-Medium;
          font-weight: 500;
          text-align: left;
          color: #0171f6;
          line-height: 18px;
          margin-bottom: 6px;
        }
        .left-content {
          font-size: 12px;
          font-family: PingFang SC, PingFang SC-Regular;
          font-weight: 400;
          color: #45567e;
          line-height: 17px;
          cursor: pointer;
          &:hover {
            color: #0171f6;
          }
        }
      }
      .right {
        flex: 1;
        max-width: 204px;
        position: relative;
        padding-left: 16px;
        .line {
          position: absolute;
          top: 9px;
          left: 0;
          width: 1px;
          height: 140px;
          opacity: 0.56;
          border: 1px solid;
          border-image: linear-gradient(180deg, #f3f8ff 0%, #c8deff 53%, rgba(227, 238, 255, 0.57) 100%) 1 1;
        }
        .right-title {
          font-size: 13px;
          font-family: PingFang SC, PingFang SC-Semibold;
          font-weight: 600;
          text-align: left;
          color: #262626;
          line-height: 18px;
          margin-bottom: 4px;
        }
        .right-remark {
          font-size: 10px;
          font-family: PingFang SC, PingFang SC-Regular;
          font-weight: 400;
          color: #8795b4;
          line-height: 14px;
        }
        .right-list {
          padding-top: 3px;
          .right-list-title {
            display: flex;
            align-items: center;
            gap: 4px;
            margin-top: 16px;
            cursor: pointer;
            span {
              white-space: nowrap; /* 禁止换行 */
              overflow: hidden; /* 隐藏超出部分 */
              text-overflow: ellipsis;
              font-size: 12px;
              color: #45567e;
              line-height: 14px;
              max-width: 172px;
            }
          }
        }
      }
    }
  }
`;
