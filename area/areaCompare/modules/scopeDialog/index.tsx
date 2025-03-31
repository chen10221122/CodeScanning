import { FC, memo, useState, useEffect } from 'react';

import { useRequest } from 'ahooks';
import styled from 'styled-components';

import { getAreaScore } from '@/apis/area/areaCompare';
import { Modal, Spin } from '@/components/antd';

import AreaRateDetail from './areaRateDetail';

interface IProps {
  visible: boolean;
  onCancel: () => void;
  regionInfo: {
    regionCode: string;
    regionName: string;
  };
}

const AreaScope: FC<IProps> = ({ visible, onCancel, regionInfo: { regionCode, regionName } }) => {
  const [data, setData] = useState([]);

  // 改变指标开关状态
  const { loading, run } = useRequest(getAreaScore, {
    manual: true,
    onSuccess: (res) => {
      setData(res?.data?.[0] || []);
    },
  });

  useEffect(() => {
    if (visible && regionCode) run(regionCode);
  }, [run, regionCode, visible]);

  return (
    <ModalWithStyle
      title={'地区综合得分_' + regionName}
      visible={visible}
      footer={null}
      destroyOnClose
      onCancel={onCancel}
      width={860}
      centered
      type="titleWidthBgAndMaskScroll"
      contentId=""
    >
      {loading ? <Spin type={'fullThunder'} /> : <AreaRateDetail data={data} />}
    </ModalWithStyle>
  );
};
export default memo(AreaScope);

const ModalWithStyle = styled(Modal)`
  .ant-modal-body {
    height: 418px;
    padding: 16px 2px 16px 24px;
  }
`;
