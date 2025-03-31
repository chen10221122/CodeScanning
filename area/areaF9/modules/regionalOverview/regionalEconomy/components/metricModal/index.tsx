import { FC, memo, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import styled, { createGlobalStyle } from 'styled-components';

import { useModal } from '@/app/components/modal/NoPayNotice';
import ErrorMessage from '@/components/advanceSearch/components/extraModal/errorMessage';
import { Modal } from '@/components/antd';
import { IRootState } from '@/store';

import { IParam, ModalType, SelectItem } from '../../types';
import { IInitData, Provider, useCtx, useInitCtx } from './context';
import exampleImg from './exampleImg.png';
import Foot from './foot';
import SelectContent from './selectContent';

const ErrorMessageStyle = { top: '20px', minWidth: 'max-content' };

interface Props {
  indicatorList?: any[];
  /** 将confirmData对应的原始数据返回给使用者 */
  onConfirmChange: (
    confirmData: SelectItem[],
    isDefault: boolean,
    paramMap: Record<string, IParam | undefined>,
  ) => void;
  visible: boolean;
  modalType: ModalType;
  onCancel?: () => void;
  initData: IInitData;
  /** 是否开启拖拽，默认开启 */
  drag?: boolean;
}
// TODO 暂时保留，验证没问题再删
const Inner: FC<Props> = ({ onConfirmChange, visible, modalType, onCancel, initData, drag = true }) => {
  const hasPay = useSelector((store: IRootState) => store.user.info).havePay;
  useInitCtx({ modalType, initData, visible, drag });
  const {
    state: { selectedNodes, tipInfo, selectedNodeParam, editModalVisible },
  } = useCtx();
  const [checkedNodes, setCheckedNodes] = useState<SelectItem[]>(selectedNodes);
  const [checkedNodesParamMap, setCheckedNodesParamMap] =
    useState<Record<string, IParam | undefined>>(selectedNodeParam);
  useEffect(() => {
    setCheckedNodes(selectedNodes);
  }, [selectedNodes]);
  useEffect(() => {
    setCheckedNodesParamMap(selectedNodeParam);
  }, [selectedNodeParam]);

  return (
    <>
      <MyModal
        title={'选择指标'}
        type="maskScroll"
        width={800}
        visible={hasPay && editModalVisible}
        destroyOnClose={false}
        onCancel={onCancel}
        footer={null}
        zIndex={100}
        wrapClassName={'app-dialog transform-selected-modal'}
        mask={true}
      >
        {tipInfo?.visible && (
          <ErrorMessage
            visible={tipInfo?.visible ?? false}
            type={tipInfo?.type}
            content={tipInfo?.text ?? ''}
            style={ErrorMessageStyle}
          />
        )}
        <SelectContent
          checkedNodes={checkedNodes}
          checkedNodeparamMap={checkedNodesParamMap}
          setCheckedNodes={setCheckedNodes}
          setCheckedNodeParamMap={setCheckedNodesParamMap}
        />
        <Foot
          onCancel={onCancel!}
          checkedNodes={checkedNodes}
          checkedNodeParamMap={checkedNodesParamMap}
          onConfirmChange={onConfirmChange}
        />
      </MyModal>
    </>
  );
};

const MetricModal: FC<Props> = ({ visible, modalType, onConfirmChange, onCancel, initData, ...prop }) => {
  const [modal, contetHolder] = useModal();
  const hasPay = useSelector((store: IRootState) => store.user.info).havePay;
  useEffect(() => {
    if (!hasPay) {
      if (visible)
        modal.open({
          permission: {
            exampleImageUrl: exampleImg,
            onClose: onCancel,
            description: '暂不支持自定义指标功能，成为正式用户即可无限次编辑',
            showVipIcon: true,
          },
          className: 'no-pay-modal',
        });
      else modal.close();
    }
  }, [hasPay, modal, onCancel, visible]);

  return (
    <>
      <Provider>
        <GlobalStyle />
        {contetHolder}
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

const MyModal = styled(Modal)`
  .ant-modal-content {
    height: calc(100vh - 160px) !important;
    .ant-modal-header {
      padding: 7px 50px !important;
      .ant-modal-title {
        font-size: 16px;
        line-height: 24px;
        font-weight: 500;
        color: #141414;
        &::before {
          height: 18px;
          width: 18px;
          left: -26px;
        }
      }
      &::after {
        left: 0;
        right: 0;
      }
    }
  }
`;

const GlobalStyle = createGlobalStyle`
  .transform-selected-modal{
    display: flex;
    align-items: center;
    .ant-modal {
      top: 80px !important;
      .ant-modal-content .ant-modal-close{
        top: -7px ;
        right: calc(50% - 400px - 8px);
      }
    }
  }
  .no-pay-modal {
    h3 span img {
      top: 6px;
    }
  }
`;
