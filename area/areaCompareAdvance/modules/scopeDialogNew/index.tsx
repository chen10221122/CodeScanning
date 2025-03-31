import { FC, memo } from 'react';

// import { useRequest } from 'ahooks';
import styled from 'styled-components';

// import { getDetailMsg, getComprehensiveScore } from '@/apis/area/areaEconomy';
import { Modal, Spin } from '@/components/antd';
import AreaRateDetail from '@/components/areaEchartTable/areaRateDetail';

// import useMainTop from '@/components/areaEchartTable/useMainTop';
import useRateData from './useRateData';

// import { getAreaScore } from '@/apis/area/areaCompare';

// import AreaRateDetail from './areaRateDetail';

interface IProps {
  visible: boolean;
  onCancel: () => void;
  regionInfo: {
    regionCode: string;
    regionName: string;
    date: any;
  };
  fivePointComplexScore: number;
}

const AreaScope: FC<IProps> = ({
  visible,
  onCancel,
  regionInfo: { regionCode, regionName, date },
  fivePointComplexScore,
}) => {
  const { loading, info } = useRateData(regionCode, visible, date);

  return (
    <ModalWithStyle
      title={'地区综合得分_' + regionName}
      visible={visible}
      footer={null}
      destroyOnClose
      onCancel={onCancel}
      width={1000}
      centered
      type="titleWidthBgAndMaskScroll"
      contentId=""
    >
      {loading ? (
        <Spin type={'fullThunder'} />
      ) : info ? (
        <AreaRateDetail
          data={info?.indicScoreList}
          leftTitleContent={null}
          complexScore={info?.complexScore}
          type="small"
          fivePointComplexScore={fivePointComplexScore + ''}
          scrollY={350}
        />
      ) : null}
    </ModalWithStyle>
  );
};
export default memo(AreaScope);

const ModalWithStyle = styled(Modal)`
  .ant-modal-body {
    height: 418px;
    padding: 16px 2px 16px 24px;
  }

  .score-wrapper {
    width: 100%;
  }
  .left {
    .chart {
      width: 312px;
    }
  }
  .right {
    // max-height: 386px;
    padding-right: 12px;
  }
`;
