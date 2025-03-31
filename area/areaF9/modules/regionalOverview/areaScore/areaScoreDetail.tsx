import { memo, useState, useMemo, useRef } from 'react';

import { Empty } from '@dzh/components';
// import { ProModalHelp } from '@dzh/pro-components';
import Screen from '@dzh/screen';
import { useMemoizedFn } from 'ahooks';
import dayJs from 'dayjs';
import styled from 'styled-components';

import ExportDoc from '@/components/exportDoc';
// import Explain from '@/pages/area/areaF9/assets/icon_explain.svg';
import Titlebg from '@/pages/area/areaF9/assets/titlebg.png';
import CustomTable from '@/pages/area/areaF9/modules/regionalOverview/areaScore/components/customTable/custom';
import BarChart from '@/pages/area/areaF9/modules/regionalOverview/areaScore/components/echarts/bar';
import LineChart from '@/pages/area/areaF9/modules/regionalOverview/areaScore/components/echarts/line';
import RadarChart from '@/pages/area/areaF9/modules/regionalOverview/areaScore/components/echarts/radar';
import Introduce from '@/pages/area/areaF9/modules/regionalOverview/areaScore/components/introduce';
import DetailModal from '@/pages/area/areaF9/modules/regionalOverview/areaScore/components/model/detail';
import EchartModal from '@/pages/area/areaF9/modules/regionalOverview/areaScore/components/model/echartModal';
import ScoreComment from '@/pages/area/areaF9/modules/regionalOverview/areaScore/components/scoreComment';
import {
  // dataConfig,
  rankConfig,
  currentYearString,
  rankTypes,
} from '@/pages/area/areaF9/modules/regionalOverview/areaScore/const';
import useMenuConfig from '@/pages/area/areaF9/modules/regionalOverview/areaScore/hooks/useMenuConfig';

// import { Modal } from '@/components/antd';

interface Props {
  modelInfo: any;
  screenYearChange: any;
  screenRankChange: Function;
  historyData: any;
  code: any;
  regionName?: string;
  detailData: any;
  detailLoading?: any;
  detailError: any;
  isHeightOverflow: any;
  condition: any;
  fLoading: boolean;
  containerRef: any;
  haveDataYear: string;
}

// const defaultEchartModalParams = {
//   title: '弹窗标题',
// };

const AreaRateDetail = (props: Props) => {
  const {
    modelInfo,
    screenYearChange,
    screenRankChange,
    historyData,
    regionName,
    code,
    detailData,
    detailError,
    // detailLoading,
    isHeightOverflow,
    condition: paramsCondition,
    fLoading,
    containerRef,
    haveDataYear,
  } = props;
  const { complexScore, nationalRank, provinceRank, scoreDistributeList, position, indicatorScore, avgIndicatorScore } =
    modelInfo;
  // console.log('dataConfig', dataConfig, currentYear.toString());
  // const [rankType, setRankType] = useState(0);
  const [moreModalVisable, setMoreModalVisable] = useState(false);
  const [echartModalVisable, setEchartModalVisable] = useState(false);
  const [modalParams, setModalParams] = useState<any>();
  const listRef = useRef([]);
  const initListRef = useRef([]);

  const { dataConfig } = useMenuConfig(haveDataYear);

  const handleScreenChange = useMemoizedFn((cur) => {
    // console.log('cur', cur);
    // setYear(cur[0].value);
    screenYearChange(cur);
  });

  const handleScreenRankChange = useMemoizedFn((cur) => {
    // setRankType(cur[0].value);
    screenRankChange(cur);
  });

  const list = useMemo(() => {
    return detailData?.data.indicCommentList || [];
  }, [detailData?.data.indicCommentList]);
  const initList = useMemo(() => {
    return detailData?.data.indicOriginCommentList || [];
  }, [detailData?.data.indicOriginCommentList]);
  if (JSON.stringify(list) !== JSON.stringify(listRef.current)) {
    listRef.current = list;
  }
  if (JSON.stringify(initList) !== JSON.stringify(initListRef.current)) {
    initListRef.current = initList;
  }

  // 导出相关参数
  const condition = useMemo(() => {
    // console.log('paramsCondition', paramsCondition);
    return {
      module_type: 'area_f9_score_detail',
      exportFlag: true,
      year: paramsCondition.year,
      regionCode: code,
    };
  }, [code, paramsCondition.year]);

  const handleShowMoreClick = useMemoizedFn(() => {
    setMoreModalVisable(true);
  });

  const handleShowEChartModel = useMemoizedFn((params) => {
    // console.log(params);
    setEchartModalVisable(true);
    setModalParams(params);
  });

  const noData = useMemo(() => {
    return detailError || !detailData;
  }, [detailData, detailError]);

  const initYear = useMemo(() => {
    return haveDataYear || currentYearString;
  }, [haveDataYear]);

  return (
    <Wrap isHeightOverflow={isHeightOverflow}>
      {/* {detailLoading ? innerSpin : null} */}
      <div className="wrap-inner">
        <div className="score-box score-echart-area">
          <WrapHead className="score-head" fLoading={fLoading}>
            <div className="head-left">
              <span>区域评分</span>
            </div>
            <div className="head-right" id="score-head-right">
              <Screen
                options={dataConfig}
                initValues={[[initYear]]}
                onChange={handleScreenChange}
                getPopContainer={() => document.getElementById('score-head-right') || document.body}
              />
              <Introduce />
            </div>
          </WrapHead>

          <div className="score-content">
            <div className="left-echart">
              <div className="ranking-title">
                <div className="rank-score">
                  综合评分<span>{complexScore || '-'}</span>
                </div>
                <div className="rank-screen">
                  <Screen options={rankConfig} onChange={handleScreenRankChange} initValues={[[rankTypes[0].value]]} />
                  <span className="rank-num">
                    No.{paramsCondition.regionRange === '0' ? nationalRank || '-/-' : provinceRank || '-/-'}
                  </span>
                </div>
              </div>

              <div className="charts">
                <BarChart scoreDistributeList={scoreDistributeList} position={position} complexScore={complexScore} />
                <RadarChart
                  indicatorScore={indicatorScore}
                  avgIndicatorScore={avgIndicatorScore}
                  regionName={regionName}
                  regionRange={paramsCondition.regionRange}
                />
              </div>
            </div>

            <div className="history">
              <LineChart historyData={historyData} regionName={regionName} />
            </div>
          </div>
        </div>

        <div className="score-box score-detail">
          <div className="detail-box">
            <div className="score-head detail-head">
              <div className="head-left">
                <span>区域评分明细</span>
              </div>
              <div className="head-right">
                <div className="popover-explain">
                  <ExportDoc
                    condition={condition}
                    filename={`${regionName}_区域评分明细_${dayJs().format('YYYYMMDD')}`}
                  />
                </div>
              </div>
            </div>

            <div className="detail-table" id="detail-box-table">
              {noData ? (
                <Empty type={Empty.NO_RELATED_DATA} />
              ) : (
                // <ExpandTable handleShowModel={handleShowEChartModel} detailData={detailData} />
                <CustomTable
                  detailData={detailData}
                  containerRef={containerRef}
                  handleShowEChartModel={handleShowEChartModel}
                />
              )}
              {echartModalVisable ? (
                <EchartModal
                  modalParams={modalParams}
                  code={code}
                  year={paramsCondition.year}
                  regionName={regionName}
                  visible={echartModalVisable}
                  setVisible={setEchartModalVisable}
                />
              ) : null}
            </div>
          </div>
          <div className="comment-box">
            <ScoreComment
              list={listRef.current}
              initList={initListRef.current}
              handleShowMoreClick={handleShowMoreClick}
              noData={noData}
            />
            {moreModalVisable ? (
              <DetailModal title="评分点评" list={list} visible={moreModalVisable} setVisible={setMoreModalVisable} />
            ) : null}
          </div>
        </div>
      </div>
    </Wrap>
  );
};
export default memo(AreaRateDetail);
// const SpinWrapper = styled.div`
//   position:relative;
// `;

const Wrap = styled.div<{ isHeightOverflow: boolean }>`
  height: 100%;
  width: 100%;
  // position: absolute;
  // top: 0;
  // padding-right: 6px;
  .wrap-inner {
    height: 100%;
  }
  .score-box {
    background: #ffffff;
    border: 1px solid #eeeeee;
    border-radius: 4px;
    padding: 0 12px;
    &.score-detail {
      // display: none !important;
      margin-top: 4px;
      padding-bottom: 12px;
      display: flex;
      .score-head {
        height: 32px;
        &.detail-head {
          position: sticky;
          top: 0;
          z-index: 5;
          background: #fff;
        }
      }
      .detail-box {
        // flex: 1;
        width: calc(100% - 254px);
        .detail-table {
          min-height: 436px;
          // height: calc(100vh - 452px);
          height: calc(100% - 44px);
        }
      }
      .comment-box {
        height: 100%;
        width: 254px;
        padding-left: 12px;
        position: sticky;
        top: 0;
        z-index: 5;
      }
    }
    .score-head {
      height: 34px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .head-left {
        display: flex;
        align-items: center;
        &:before {
          content: '';
          display: block;
          width: 2px;
          height: 12px;
          background: #ff9347;
          border-radius: 2px;
          margin-right: 6px;
        }
        span {
          font-size: 13px;
          font-family: PingFangSC, PingFangSC-Medium;
          font-weight: 500;
          color: #262626;
          line-height: 18px;
        }
      }
    }
  }
  .score-echart-area {
    height: 239px;
    .score-head {
      position: relative;
      // width: 100%;
      top: 0;
      left: 1px;
      background: #fff;
      padding: 0 12px 0 0;
      // border-top: 1px solid #eeeeee;
      border-radius: 4px 4px 0 0;
      .head-right {
        display: flex;
        align-items: center;
        .dzh-screen-screen-wrapper {
          height: 18px;
        }
      }
    }

    .score-content {
      // padding-top: 34px;
      display: flex;
      height: calc(100% - 34px);
      // height: 100%;
      .left-echart {
        flex: 1;
        // width: 72%;
        padding-right: 14px;
        min-width: 574px;
        .ranking-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          height: 32px;
          background: url(${Titlebg}) center/100% no-repeat;
          padding: 0 12px;
          .rank-score {
            display: flex;
            align-items: center;
            height: 100%;
            font-size: 13px;
            font-family: PingFangSC, PingFangSC-Regular;
            font-weight: 400;
            color: #262626;
            line-height: 18px;
            > span {
              margin-left: 6px;
              font-size: 17px;
              font-family: Arial, Arial-BoldMT;
              font-weight: 600;
              color: #0171f6;
              line-height: 21px;
            }
          }
          .rank-screen {
            display: flex;
            align-items: center;
            .rank-num {
              font-size: 12px;
              margin-left: 16px;
            }
            .dzh-screen-screen-wrapper .dzh-screen-screen-title-wrapper {
              font-family: PingFangSC, PingFangSC-Regular;
              font-weight: 400;
              line-height: 20px;
            }
          }
        }
        .charts {
          display: flex;
          height: calc(100% - 32px);
          > div {
            &.barline {
              width: 50%;
            }
            &.radar {
              width: 50%;
              max-width: 50%;
              flex: 1;
            }
          }
        }
      }
      .history {
        // min-width: 450px;
        width: 38%;
        margin-bottom: 16px;
        padding: 0 12px 0 18px;
        border-left: 1px solid #efefef;
        .linechart {
          height: 198px;
        }
      }
    }
  }

  // .comment-box-detail-modal-echart {
  //   .ant-modal-content {
  //     .ant-modal-header {
  //       padding: 4px 24px;
  //       background: url(${require('./imgs/title-bg.png')}) no-repeat center/100%;
  //       background-position: right;
  //       background-size: 440px 44px;
  //     }
  //     .ant-modal-close-x {
  //       height: 32px;
  //       line-height: 32px;
  //     }
  //   }
  // }
`;

const WrapHead = styled.div<{ fLoading: boolean }>`
  ${({ fLoading }) =>
    fLoading
      ? 'position: absolute !important;z-index: 5 !important;right:25px;left:13px !important;top:1px !important;'
      : ''}
`;
