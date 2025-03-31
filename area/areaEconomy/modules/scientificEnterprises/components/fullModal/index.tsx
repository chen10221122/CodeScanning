import { FC, memo } from 'react';

import styled, { createGlobalStyle } from 'styled-components';

import { Modal } from '@/components/antd';
import CommonLoading from '@/components/commonLoading';

const Loading = CommonLoading as any;

const FullModal: FC<any> = ({
  title,
  content,
  visible,
  setVisible,
  pending = true,
  container = document.body,
  resetPage,
}) => {
  return (
    <div style={{ display: visible ? 'block' : 'none' }}>
      <GlobalStyle />
      <Modal
        type="maskScroll"
        title={title}
        visible={visible}
        onCancel={() => {
          resetPage(1);
          setVisible(false);
        }}
        destroyOnClose={true}
        footer={null}
        width={1000}
        centered={false}
        bodyStyle={{ padding: '0 0 24px', position: 'relative' }}
        getContainer={() =>
          (document.getElementById('tech_enterprise_common_header_loop_text') as HTMLElement) || container
        }
        maskStyle={{
          zIndex: 18,
          background: 'rgba(0,0,0,.34)',
        }}
        maskClosable={false}
      >
        <Loading show={pending} inline={false}>
          <ModalContent>{content}</ModalContent>
        </Loading>
      </Modal>
    </div>
  );
};

export default memo(FullModal);

const GlobalStyle = createGlobalStyle`
  .card-wrap{
    /* 12 + 8 px UI 要求距离底部 20px 勿删 */
    padding-bottom: 12px;
  }
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  min-height: 100px;
`;
