import { memo, useMemo } from 'react';

import styled from 'styled-components';

import { Modal } from '@/components/antd';
import { useSelector } from '@/pages/area/areaF9/context';

interface Props {
  onCancel: Function;
  visible: boolean;
}

const CumRightModal = ({ onCancel, visible }: Props) => {
  const { cumRightInfo } = useSelector((store) => ({
    cumRightInfo: store?.cumRightInfo,
  }));

  const content = useMemo(() => {
    return (
      <div className="content-main">
        {cumRightInfo.map(({ termNum, termType, termContent }) => (
          <div className="content-wrap">
            <div className="title">{`${termNum}、${termType}`}</div>
            <div className="content">{termContent}</div>
          </div>
        ))}
      </div>
    );
  }, [cumRightInfo]);
  return (
    <Modal
      type="titleWidthBgAndMaskScroll"
      title="条款明细"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      destroyOnClose={true}
      width={682}
      bodyStyle={{ padding: 0 }}
      wrapClassName="process-modal review-process-modal"
      centered
    >
      <ContentWrap>{content}</ContentWrap>
    </Modal>
  );
};

export default memo(CumRightModal);

const ContentWrap = styled.div`
  width: 100%;
  color: #3c3c3c;
  padding: 16px 0 20px 32px;

  .content-main {
    margin-right: 6px;
    padding-right: 26px;
    min-height: 152px;
    max-height: 381px;
    overflow: hidden;
    overflow-y: auto;

    &:hover {
      &::-webkit-scrollbar,
      &::-webkit-scrollbar-thumb {
        visibility: visible;
      }
    }
    &::-webkit-scrollbar,
    &::-webkit-scrollbar-thumb {
      visibility: hidden;
    }
    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-thumb {
      background: #cfcfcf;
      border-radius: 6px;
    }
  }
  .content-wrap:not(:last-of-type) {
    margin-bottom: 16px;
  }
  .title {
    height: 21px;
    font-size: 14px;
    font-weight: 500;
    line-height: 21px;
  }
  .content {
    font-size: 14px;
    font-weight: 400;
    line-height: 26px;
  }
`;
