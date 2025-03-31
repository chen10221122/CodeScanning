import { memo } from 'react';

import styled from 'styled-components';

import { Modal } from '@/components/antd';

const FullModal = ({
  title,
  content,
  visible,
  closeModal,
  pending = true,
  container = document.body,
  ...restProps
}) => {
  return (
    <div style={{ display: visible ? 'block' : 'none' }}>
      <Modal
        type="maskScroll"
        title={<div className="full-title">{title}</div>}
        visible={visible}
        onCancel={closeModal}
        destroyOnClose={true}
        footer={null}
        width={1000}
        centered={false}
        bodyStyle={{ padding: '0 0 24px', position: 'relative' }}
        getContainer={() => container}
        maskStyle={{
          // top: HEADER_HEIGHT - 1,
          zIndex: 18,
          background: 'rgba(0,0,0,.34)',
        }}
        maskClosable={false}
        {...restProps}
      >
        <ModalContent>{content}</ModalContent>
      </Modal>
    </div>
  );
};

export default memo(FullModal);
const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  min-height: 100px;
`;
