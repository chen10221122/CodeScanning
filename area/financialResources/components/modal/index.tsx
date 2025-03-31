import styled from 'styled-components';

import { Modal } from '@/components/antd';

interface Props {
  modalVisible: boolean;
  setModalVisible: Function;
  modalTitle: JSX.Element | string;
  content: JSX.Element;
  getContainer: () => HTMLElement;
}

export default function DetailModal({ modalVisible, setModalVisible, modalTitle, content, getContainer }: Props) {
  return (
    <>
      <ModalStyle
        visible={modalVisible}
        title={modalTitle}
        width={1000}
        footer={null}
        style={{ top: 21 }}
        onCancel={() => {
          setModalVisible(false);
        }}
        destroyOnClose
        getContainer={getContainer}
      >
        {content}
      </ModalStyle>
    </>
  );
}

const ModalStyle = styled(Modal)`
  .ant-modal-content {
    .ant-modal-close-x {
      position: absolute;
      top: 22px;
      right: -10px;
    }
    .ant-modal-close-x {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      -webkit-box-align: center;
      align-items: center;
      -webkit-box-pack: center;
      justify-content: center;
      background: rgb(255, 255, 255);
      box-shadow: rgba(0, 0, 0, 0.09) 0px 2px 9px 2px, rgba(0, 0, 0, 0.16) 0px 1px 2px -2px;
    }
  }
  .ant-modal-header {
    padding: 24px 32px 16px;
    border-bottom: none;
    .ant-modal-title {
      line-height: 27px;
      font-size: 18px;
    }
  }
  .ant-modal-body {
    height: calc(100vh - 74px - 67px);
    padding: 0 6px 32px 32px;
    .ant-pagination {
      padding-bottom: 0 !important;
    }
  }
  .content {
    overflow-y: auto;
    overflow-y: overlay;
    height: 100%;
    padding-right: 14px;
    scrollbar-gutter: stable;
    position: relative;
    .chart-title {
      height: 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      color: #8c8c8c;
      font-size: 12px;
    }
    .export-xls-btn {
      height: 22px;
      line-height: 22px;
    }
    .ant-table-thead {
      .ant-table-column-sorters {
        .ant-table-column-sorter {
          margin-left: 4px;
        }
      }
      .ant-table-column-has-sorters {
        text-align: center;
        .ant-table-column-sorters {
          justify-content: center;
          align-items: flex-start;
          .ant-table-column-title {
            flex: initial;
          }
        }
      }
    }
  }
`;
