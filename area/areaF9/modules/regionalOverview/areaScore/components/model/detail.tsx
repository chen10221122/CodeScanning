import { memo } from 'react';

import { Modal } from '@dzh/components';
import styled from 'styled-components';

// import { Modal } from '@/components/antd';

interface Props {
  title: string | undefined;
  list: string[];
  visible: boolean;
  setVisible: Function;
}

const DetailModal = (props: Props) => {
  const { visible, setVisible, title, list } = props;

  const onCancel = () => {
    setVisible(false);
  };
  return (
    <Modal.Content
      destroyOnClose={true}
      // type="titleWidthBgAndMaskScroll"
      className="comment-box-detail-modal"
      width={680}
      // style={{ bottom: 0, paddingBottom: 0 }}
      centered
      maskClosable
      footer={null}
      visible={visible}
      title={title}
      onCancel={onCancel}
    >
      <ScoreModel>
        {list.map((item, i) => (
          <div className="list" key={`${item}${i}`} dangerouslySetInnerHTML={{ __html: item }}></div>
        ))}
      </ScoreModel>
    </Modal.Content>
  );
};

export default memo(DetailModal);
const ScoreModel = styled.div`
  // padding-top: 12px;
  // padding: 12px 26px 0;
  // margin-bottom: 20px;
  max-height: 396px;
  overflow-y: auto;

  .list {
    font-size: 13px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-align: justify;
    color: #434343;
    line-height: 22px;
    & ~ .list {
      margin-top: 10px;
    }

    em {
      font-style: normal;
      // font-family: PingFangSC, PingFangSC-Medium;
      // font-weight: 600;
    }

    &:not(:first-child) {
      em:first-child {
        color: #ff7500;
      }
    }
  }
`;
