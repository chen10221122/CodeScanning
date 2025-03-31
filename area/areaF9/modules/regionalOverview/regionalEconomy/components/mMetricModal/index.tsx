import { FC, memo, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { Modal } from '@dzh/components';
import styled, { createGlobalStyle } from 'styled-components';

import { useModal } from '@/app/components/modal/NoPayNotice';
import CustomIndicatorModal from '@/components/transferSelectNew/modules/customModal';
import { ModalSourceType } from '@/components/transferSelectNew/modules/customModal/type';
import { DeleteModalParamsType } from '@/components/transferSelectNew/modules/customModal/useCustomIndicator';
import MMetricModal, { ModalType as MModalType } from '@/components/transferSelectNew/modules/templateModal';
import { ModalCallLocation } from '@/components/transferSelectNew/modules/templateModal/types';
import { IRootState } from '@/store';

import { ModalType, SelectItem } from '../../types';
import { IInitData, Provider, useCtx, useInitCtx } from './context';
import exampleImg from './exampleImg.png';

interface Props {
  indicatorList?: any[];
  /** 将confirmData对应的原始数据返回给使用者 */
  onConfirmChange: (confirmData: SelectItem[], isDefault: boolean, selectedNodeParamMap?: Record<string, any>) => void;
  visible: boolean;
  modalType: ModalType;
  onCancel?: () => void;
  initData: IInitData;
  /** 是否开启拖拽，默认开启 */
  drag?: boolean;
  customParam: any;
}

const Inner: FC<Props> = ({ onConfirmChange, visible, modalType, onCancel, initData, drag = true, customParam }) => {
  const {
    state: { resetFlag, selectedNodeParamMap, selectedNodes },
    update,
  } = useCtx();
  const [noPayModal, contentHolder] = useModal();
  const hasPay = useSelector((store: IRootState) => store.user.info).havePay;

  const {
    customIndicator,
    modal,
    setModal,
    deleteModal,
    setDeleteModal,
    onDeletdOk,
    editModal,
    setEditModal,
    getUserCustomAreaIndicators,
  } = customParam;

  useEffect(() => {
    if (hasPay && visible && getUserCustomAreaIndicators) getUserCustomAreaIndicators();
  }, [hasPay, visible, getUserCustomAreaIndicators]);

  useInitCtx({ modalType, initData });

  useEffect(() => {
    if (!hasPay) {
      if (visible)
        noPayModal.open({
          permission: {
            exampleImageUrl: exampleImg,
            onClose: onCancel,
            description: '暂不支持自定义指标功能，成为正式用户即可无限次编辑',
            showVipIcon: true,
          },
          className: 'no-pay-modal',
        });
      else noPayModal.close();
    }
  }, [hasPay, noPayModal, onCancel, visible]);

  useEffect(() => {
    if (hasPay && visible && update) {
      update((d) => {
        d.editModalVisible = hasPay && visible;
      });
    }
  }, [hasPay, update, visible]);

  return (
    <>
      {contentHolder}
      <CustomIndicatorModal
        modal={modal}
        setModal={setModal}
        allCustomIndicator={customIndicator.children}
        refreshCustom={getUserCustomAreaIndicators}
        modalTitle="新建自定义指标"
        sourceType={ModalSourceType.modal}
        trackType="customIndex-areaF9"
      ></CustomIndicatorModal>
      {/* 删除自定义指标弹窗 */}
      <Modal.Info
        type="warning"
        title="确定要删除此指标吗？"
        content={deleteModal.modalStatus ? '此指标已被引用，删除后引用指标将不可使用！' : ''}
        visible={deleteModal.show}
        onCancel={() =>
          setDeleteModal((base: DeleteModalParamsType) => {
            return { ...base, show: false, modalStatus: false };
          })
        }
        cancelText="再想想"
        zIndex={1210}
        onOk={() => onDeletdOk()}
      />
      {/* 编辑自定义指标弹窗 */}
      <CustomIndicatorModal
        trackType="customIndex-areaF9"
        modal={editModal}
        setModal={setEditModal}
        allCustomIndicator={customIndicator.children}
        refreshCustom={getUserCustomAreaIndicators}
        modalTitle="自定义指标管理"
        sourceType={ModalSourceType.modal}
      ></CustomIndicatorModal>
      <MyModal
        modalType={MModalType.EDIT}
        modalCallLocation={ModalCallLocation.AreaF9}
        drag={drag}
        onConfirmChange={(selectList: any) => {
          onConfirmChange(selectList, !resetFlag, selectedNodeParamMap);
        }}
        onCancel={onCancel}
        zIndex={100}
        mask={true}
        tableCurrentSelectedIndicator={selectedNodes}
      />
    </>
  );
};

const MetricModal: FC<Props> = ({ visible, modalType, onConfirmChange, onCancel, initData, ...prop }) => {
  return (
    <>
      <Provider>
        <GlobalStyle />
        <Inner
          onConfirmChange={onConfirmChange}
          visible={visible}
          modalType={modalType}
          onCancel={onCancel}
          initData={initData}
          {...prop}
        />
      </Provider>
    </>
  );
};

export default memo(MetricModal);

const MyModal = styled(MMetricModal)`
  // .ant-modal-content {
  //   height: calc(100vh - 160px) !important;
  //   .ant-modal-header {
  //     padding: 7px 50px !important;
  //     .ant-modal-title {
  //       font-size: 16px;
  //       line-height: 24px;
  //       font-weight: 500;
  //       color: #141414;
  //       &::before {
  //         height: 18px;
  //         width: 18px;
  //         left: -26px;
  //       }
  //     }
  //     &::after {
  //       left: 0;
  //       right: 0;
  //     }
  //   }
  // }

  // .content {
  //   padding: 2px 8px;
  //   font-size: 12px;
  //   font-weight: 400;
  //   text-align: left;
  //   color: #262626;
  //   line-height: 18px;
  //   text-shadow: 0 2px 9px 2px rgba(0, 0, 0, 0.09);
  //   position: relative;
  //   display: flex;
  //   align-items: flex-start;

  //   &.no-margin {
  //     margin-bottom: 0;
  //   }
  // }
`;

const GlobalStyle = createGlobalStyle`
  .transform-selected-modal{
    display: flex;
    align-items: center;
    .ant-modal {
      top: 80px !important;
      bottom: 80px !important;
      .ant-modal-content .ant-modal-close{
        top: -7px ;
        right: calc(50% - 450px - 8px);
      }
    }
  }
  .no-pay-modal {
    h3 span img {
      top: 6px;
    }
  }
`;
