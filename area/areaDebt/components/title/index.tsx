import { FC, memo, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';

import styled from 'styled-components';

import { getConfig } from '@/app';
import HelpUpdateRemind from '@/components/dialog/helpUpdateRemind/areaHelp';
import TrialButton from '@/components/trialButton';
import { LINK_AREA_MONTHLY_ECONOMY } from '@/configs/routerMap';
import Feedback from '@/pages/area/areaDebt/components/feedBack';
import { useCtx } from '@/pages/area/areaDebt/getContext';
import { HotSpecialSubject } from '@/pages/area/monthlyEconomy/components/title';
import type { IRootState } from '@/store';
import { useHistory } from '@/utils/router';

import HelpText from './helpText';
import UpdateText from './updateText';

const hideAreaUpdateLog = !getConfig((d) => d.modules.hideAreaUpdateLog);
export const TITLE_HEIGHT = 36;

const Title: FC = () => {
  const uInfo = useSelector((store: IRootState) => store.user.info);
  const {
    state: { requestNum },
  } = useCtx();
  const history = useHistory();
  const domRef = useRef(null);

  /** 判断是否是vip用户 */
  const auth = useMemo(() => {
    return Object.prototype.hasOwnProperty.call(uInfo, 'havePay') && !uInfo.havePay;
  }, [uInfo]);

  const rightContentList = useMemo(
    () =>
      hideAreaUpdateLog
        ? [
            {
              title: '帮助说明',
              content: <HelpText />,
            },
            {
              title: '更新日志',
              content: <UpdateText />,
            },
          ]
        : [
            {
              title: '帮助说明',
              content: <HelpText />,
            },
          ],
    [],
  );

  return (
    <WrapperStyle ref={domRef} havePay={auth}>
      <div className="title">
        <div>
          <div className="head-inner">
            <div className="head-con">
              <h1>区域经济数据大全</h1>

              <div className="right">
                {auth ? (
                  <TrialButtonStyle>
                    {requestNum ? (
                      <>
                        <TrialButton
                          // @ts-ignore
                          powerTip={'刷新、加载、筛选、搜索均记录体验次数，成为VIP会员即可无限次查看'}
                          placement={'bottomRight'}
                          requestNumText={requestNum}
                        />
                        <span className="line"></span>
                      </>
                    ) : null}
                  </TrialButtonStyle>
                ) : null}
                <HotSpecialSubject style={{ width: '112px' }}>
                  <span onClick={() => history.push(LINK_AREA_MONTHLY_ECONOMY)}>月度季度经济大全</span>
                </HotSpecialSubject>
                <div className="help-and-back">
                  <HelpUpdateRemind
                    leftAnchorList={rightContentList.map((d) => d.title)}
                    rightContentList={rightContentList}
                    updatedVersionDate="2023-5-18"
                    pageCode="qyjjdq"
                  />
                  {getConfig((d) => d.modules.hideFeedback) ? null : (
                    <Feedback rootRef={domRef} defaultTitle="区域经济大全"></Feedback>
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
  height: ${TITLE_HEIGHT}px;

  .title {
    background: #ffffff;
    background-size: 100% 100%;
    height: ${TITLE_HEIGHT}px;
    line-height: 36px;
    border-bottom: 1px solid rgba(1, 113, 246, 0.3);
    position: relative;

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
