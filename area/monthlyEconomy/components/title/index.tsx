import { FC, memo, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { ProModalHelp } from '@dzh/pro-components';
import { Space } from 'antd';
import styled from 'styled-components';

import { getConfig } from '@/app';
import Icon from '@/components/icon';
// import HelpUpdateRemind from '@/components/dialog/helpUpdateRemind';
import TrialButton from '@/components/trialButton';
import { LINK_AREA_DEBT } from '@/configs/routerMap';
import Feedback from '@/pages/area/monthlyEconomy/components/feedBack';
import { useCtx } from '@/pages/area/monthlyEconomy/getContext';
import type { IRootState } from '@/store';
import { useHistory } from '@/utils/router';

import HelpText from './helpText';
export const TITLE_HEIGHT = 36;

const Title: FC = () => {
  const uInfo = useSelector((store: IRootState) => store.user.info);
  const {
    state: { requestNum },
  } = useCtx();
  const [visible, setVisible] = useState(false);
  const history = useHistory();
  const domRef = useRef(null);

  /** 判断是否是vip用户 */
  const auth = useMemo(() => {
    return Object.prototype.hasOwnProperty.call(uInfo, 'havePay') && !uInfo.havePay;
  }, [uInfo]);
  const contentList = useMemo(
    () => [
      {
        title: '帮助说明',
        content: <HelpText />,
      },
    ],
    [],
  );

  const openModalHandel = () => {
    setVisible(!visible);
  };

  return (
    <WrapperStyle ref={domRef} havePay={auth}>
      <div className="title">
        <div>
          <div className="head-inner">
            <div className="head-con">
              <h1>月度经济数据大全</h1>
              <div className="right">
                {auth ? (
                  <TrialButtonStyle>
                    {requestNum ? (
                      <>
                        <TrialButton
                          //@ts-ignore
                          powerTip={'刷新、加载、筛选、搜索均记录体验次数，成为VIP会员即可无限次查看'}
                          placement={'bottomRight'}
                          requestNumText={requestNum}
                        />
                        <span className="line"></span>
                      </>
                    ) : null}
                  </TrialButtonStyle>
                ) : null}
                <HotSpecialSubject>
                  <span onClick={() => history.push(LINK_AREA_DEBT)}>区域经济大全</span>
                </HotSpecialSubject>
                <div className="help-and-back">
                  {/* <HelpUpdateRemind
                    leftAnchorList={rightContentList.map((d) => d.title)}
                    rightContentList={rightContentList}
                    updatedVersionDate="2023-5-18"
                    pageCode="qyjjdq"
                  /> */}
                  <HelpWrap>
                    <Space size={4} className="helpBtn" onClick={openModalHandel}>
                      <Icon unicode="&#xe704;" size={12} className="helpIcon" />
                      帮助
                    </Space>
                    <ProModalHelp title="帮助中心" visible={visible} onCancel={openModalHandel} content={contentList} />
                  </HelpWrap>
                  {getConfig((d) => d.modules.hideFeedback) ? null : (
                    <Feedback rootRef={domRef} defaultTitle="月度季度经济大全"></Feedback>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WrapperStyle>
  );
};

export default memo(Title);

const WrapperStyle = styled.div<any>`
  width: 100% !important;
  height: ${TITLE_HEIGHT}px;

  .title {
    background: #ffffff;
    background-size: 100% 100%;
    height: ${TITLE_HEIGHT}px;
    line-height: 36px;
    border-bottom: 1px solid rgba(1, 113, 246, 0.3);
    position: relative;

    @media (min-width: 1366px) {
      padding: 0 48px;
    }

    > div {
      position: relative;
      height: 100%;
    }

    .head-inner {
      padding: 0 24px;
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      z-index: 1;

      .head-con {
        display: flex;
        justify-content: space-between;

        .right {
          display: flex;
          justify-content: space-between;
          align-items: center;

          a {
            //margin-left: 33px;
            font-size: 12px;
            font-weight: 400;
            text-align: left;
            color: #141414;
            line-height: 18px;
            position: relative;
            top: 1px;
            .help {
              margin-left: 4px;
            }

            &::before {
              display: ${(props) => (props.havePay ? 'inline-block' : 'none')};
              position: absolute;
              content: '';
              height: 15px;
              width: 1px;
              left: -18px;
              top: 2px;
              background: #ececec;
            }
          }
          .help-and-back {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .txt {
              color: #141414;
            }
          }
        }
      }
    }
  }
  h1 {
    font-weight: 500;
    text-align: left;
    color: #141414;
    margin: 0 8px 0 0;
    font-size: 14px;
    display: inline-block;
    vertical-align: middle;
  }

  a {
    .iconfont {
      font-size: 12px;
      color: #0171f6;
      vertical-align: 0;
    }
  }
`;
const HelpWrap = styled.div`
  margin-left: 9px;
  .helpBtn {
    font-size: 13px;
    color: #141414;
    cursor: pointer;
    .helpIcon {
      vertical-align: 0;
      color: #0171f5;
    }
  }
`;
export const HotSpecialSubject = styled.div`
  position: relative;
  width: 95px;
  margin-left: 31px;
  font-size: 13px;
  color: #141414;
  span {
    cursor: pointer;
    :hover {
      color: #025cdc;
    }
    &::before {
      content: '';
      position: absolute;
      display: inline-block;
      width: 13px;
      height: 13px;
      top: 30%;
      left: -16px;
      background: url(${require('./images/hot.svg')});
      background-size: 100%;
    }
  }
`;

const TrialButtonStyle = styled.div`
  /* padding-right: 39px; */
  display: flex;

  span:first-child {
    top: 2px !important;
  }

  i.iconfont {
    font-size: 12px;
    top: -2px;
  }

  .power-text {
    color: #434343;
  }
  .line {
    width: 1px;
    height: 15px;
    background-color: #ececec;
    margin-left: 20px;
  }
`;
