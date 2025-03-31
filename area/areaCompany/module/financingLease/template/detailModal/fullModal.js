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
  container = document.body,
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
  #censusAnalyseMountedId{
    .ant-modal-header {
      padding: 24px 32px 12px 32px !important;
    }
  }
  // 承租人出租人popover
  .financingLease_censusAnalyse_popover_content{
    width: 300px;
    // background: #fff;
    .ant-popover-inner{
      padding: 8px 4px 8px 0 !important;
      .ant-popover-inner-content{
        padding: 0 12px 0 16px !important;
        min-height: 120px;
        max-height: 200px;
        overflow-y: auto;
        .popover-text{
          display: inline-block;
          color: #141414;
          font-size: 13px;
        }

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
          border-radius: 6px;
          background: #cfcfcf;
        }
      }
    }
    
    .line{
      // display: flex;
      // align-items: flex-start;
      margin-bottom: 6px;
      &:last-child{
        margin-bottom: 0;
      }
      .word{
        margin-top: 2px;
        margin-right: 4px;
        &.no-hover{
          cursor: default;
        }
        display: inline-block;
        line-height: 20px;
        white-space: wrap;
        font-size: 13px;
        font-weight: 400;
        color: #141414;
        cursor: pointer;
        &:not(.no-hover):hover{
          color: #025cdc;
        }
        &.wrap{
          max-width: 208px;
        }
      }
      .tag {
        display: inline-block;
        padding: 0 3px;
        border-radius: 2px;
        font-size: 12px;
        height: 18px;
        line-height: 18px;
        font-weight: 400;
        min-width: 30px;
        text-align: center;
        box-sizing: border-box;
        margin-right: 4px;
        margin-top: 2px;
      }
    }
  }
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  min-height: 100px;
`;
