import { memo, useMemo, useRef } from 'react';

import { useSize } from 'ahooks';
import styled from 'styled-components';

import { WrapperContainer } from '@pages/area/areaF9/components';
import AreaScoreDetail from '@pages/area/areaF9/modules/regionalOverview/areaScore/areaScoreDetail';

// import { Spin } from '@/components/antd';
import useScore from '@/pages/area/areaF9/modules/regionalOverview/areaScore/useScore';
import useLoading from '@/utils/hooks/useLoading';

// import { formatNumber } from '@/utils/format';
const AreaScore = () => {
  const {
    modelInfo,
    screenYearChange,
    screenRankChange,
    historyLoading,
    historyData,
    code,
    regionName,
    detailData,
    detailLoading,
    detailError,
    condition,
    modelInfoPending,
    haveDataYear,
    yearLoading,
  }: any = useScore();
  // console.log('modelInfo', modelInfo);
  const containerRef = useRef(null);

  const fLoading = useLoading(historyLoading, detailLoading, modelInfoPending, yearLoading) || detailLoading;

  const size = useSize(containerRef.current);

  const isHeightOverflow = useMemo(() => {
    return size?.height && size.height < 743 + 48;
  }, [size?.height]);

  const content = (
    <AreaScoreDetail
      modelInfo={modelInfo}
      screenYearChange={screenYearChange}
      screenRankChange={screenRankChange}
      historyData={historyData}
      code={code}
      regionName={regionName}
      detailData={detailData}
      // detailLoading={detailLoading}
      // detailLoading={true}
      detailError={detailError}
      isHeightOverflow={isHeightOverflow}
      condition={condition}
      fLoading={fLoading}
      haveDataYear={haveDataYear}
      containerRef={containerRef}
    />
  );

  return (
    <AreaScoreBox>
      <WrapperContainer
        loading={fLoading}
        // loading={true}
        content={content}
        // loadingTop={34}
        // title="区域评分"
        containerRef={containerRef}
        isShowHeader={false}
        containerStyle={{
          minWidth: '930px',
          overflow: 'hidden scroll',
        }}
      ></WrapperContainer>
    </AreaScoreBox>
  );
};
export default memo(AreaScore);
const AreaScoreBox = styled.div`
  height: 100%;
  background: #f6f6f6;
  overflow: hidden !important;
  > div.spining-wrap-box {
    z-index: 2;
    // position: relative;
    position: absolute;
    // height: 100%;
    width: 100%;
    // z-index: 1001;
    background: #fff;
  }
  .main-container {
    overflow-y: scroll !important;
    // padding-right: 2px;
    .main-content {
      // background: #f6f6f6;
      // height: calc(100% - 48px);
      // min-height: 743px;
      // height: 743px;
      padding: 0;
    }
  }
`;

// const SpinWrapper = styled.div`
//   /* 解决加载icon不居中 */
//   height: 100%;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   .ant-spin-container {
//     height: 100%;
//   }
//   .loading-container {
//     position: relative;
//     top: 0;
//   }
// `;
