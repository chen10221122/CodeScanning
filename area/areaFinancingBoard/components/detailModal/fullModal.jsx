import { memo } from 'react';

import { useMemoizedFn } from 'ahooks';
import styled, { createGlobalStyle } from 'styled-components';

import { Modal } from '@/components/antd';
import CommonLoading from '@/components/commonLoading';

const FullModal = ({
  title,
  content,
  visible,
  setVisible,
  pending = true,
  container,
  closeModalCallback = () => void 0,
  ...restProps
}) => {
  const handleModalClose = useMemoizedFn(() => {
    setVisible(false);
    closeModalCallback?.();
  });

  return (
    <div style={{ display: visible ? 'block' : 'none' }}>
      <GlobalStyle />
      <Modal
        type="maskScroll"
        title={<div className="full-title">{title}</div>}
        visible={visible}
        onCancel={handleModalClose}
        destroyOnClose={true}
        footer={null}
        width={1000}
        centered={false}
        bodyStyle={{ padding: '0 0 32px', position: 'relative' }}
        getContainer={container}
        maskStyle={{
          // top: HEADER_HEIGHT - 1,
          zIndex: 18,
          background: 'rgba(0,0,0,.34)',
        }}
        maskClosable={false}
        {...restProps}
      >
        <CommonLoading show={pending} inline={false}>
          <ModalContent>{content}</ModalContent>
        </CommonLoading>
      </Modal>
    </div>
  );
};

export default memo(FullModal);

const GlobalStyle = createGlobalStyle`
  .card-wrap{
    padding-bottom: 12px;
  }
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  min-height: 100px;
  height: 100%;

  .ant-table-tbody > tr > td {
    padding: 6px 12px 6px 12px;
  }
  .ant-table-thead > tr > th {
    padding: 7px 12px 7px 12px;
  }

  .ant-table-ping-right:not(.ant-table-has-fix-right) .ant-table-container::after {
    box-shadow: none;
  }
  .ant-table-container table > thead > tr:first-child th:first-child {
    padding: 6px 8px;
  }
  .ant-table-thead th.ant-table-column-has-sorters:hover {
    background: rgba(248, 250, 255);
  }
  .ant-table-column-sorters {
    white-space: nowrap;
    justify-content: center;
    display: flex;
    .ant-table-column-sorter {
      padding-left: 4px;
      .ant-table-column-sorter-inner {
        width: 12px;
      }
    }
    .ant-table-column-title {
      flex: unset;
    }

    /* svg {
      margin-left: 4px;
    } */

    > span {
      &:first-of-type {
        word-break: break-all;
        white-space: normal;
      }
    }
  }
`;
