import { FC, memo, useMemo, useEffect, useState, useRef, ReactNode } from 'react';

import { useMemoizedFn } from 'ahooks';
import styled, { createGlobalStyle } from 'styled-components';

import { useCtx } from '@pages/area/landTopic/components/transferSelect/context';
import Foot from '@pages/area/landTopic/components/transferSelect/modules/templateModal/foot';
import Header from '@pages/area/landTopic/components/transferSelect/modules/templateModal/header';
import SelectContent from '@pages/area/landTopic/components/transferSelect/modules/templateModal/selectContent';
import { DefaultPlan } from '@pages/area/landTopic/components/transferSelect/modules/templateOverlay/usePlanApi';
import { SelectItem } from '@pages/area/landTopic/components/transferSelect/types';

import ErrorMessage from '@/components/advanceSearch/components/extraModal/errorMessage';
import { Modal } from '@/components/antd';

export const ErrorMessageStyle = { top: '7px', left: '308px', transform: 'translateX(0)', minWidth: 'max-content' };

export enum ModalType {
  EDIT,
  ADD,
}

interface Props {
  modalType: ModalType;
  /** 将confirmData对应的原始数据返回给使用者 */
  onConfirmChange: (confirmData: SelectItem[]) => void;
  selectedModalTitle?: ReactNode;
  [key: string]: any;
}

const TemplateModal: FC<Props> = ({ modalType, onConfirmChange, selectedModalTitle, ...restProps }) => {
  const {
    state: { allPlan, editModalVisible, addModalVisible, curEditPlan, curSelectPlanId, tipInfo, noPlan, defaultSelect },
    update,
  } = useCtx();
  const curEditPlanIdRef = useRef('');
  const curSelectPlanIdRef = useRef('');
  const [checkedNodes, setCheckedNodes] = useState<SelectItem[]>([]);
  const [newPlanName, setNewPlanName] = useState('我的模板');

  const isAddModal = useMemo(() => modalType === ModalType.ADD, [modalType]);

  useEffect(() => {
    if (noPlan) {
      setCheckedNodes([...defaultSelect]);
    }
  }, [noPlan, defaultSelect]);

  useEffect(() => {
    if (!isAddModal && !noPlan) {
      let usePlane = false;
      if (curSelectPlanId && curSelectPlanIdRef.current !== curSelectPlanId) {
        /**弹框外部选择方案 */
        curSelectPlanIdRef.current = curSelectPlanId;
        curEditPlanIdRef.current = '';
        usePlane = true;
      }
      if (curEditPlan && curEditPlanIdRef.current !== curEditPlan?.planId) {
        /**弹框内部选择方案 */
        curEditPlanIdRef.current = curEditPlan?.planId;
        usePlane = true;
      }
      setCheckedNodes(() => (usePlane ? curEditPlan?.content || [] : checkedNodes));
    }
  }, [curEditPlan, curSelectPlanId, checkedNodes, isAddModal, noPlan]);

  /** 取消操作 */
  const onCancel = useMemoizedFn(() => {
    update((draft) => {
      if (isAddModal) {
        draft.addModalVisible = false;
        !noPlan && setCheckedNodes([]);
      } else {
        draft.editModalVisible = false;
        draft.curEditPlan = undefined;
      }
      draft.tipInfo = {
        ...(draft.tipInfo || {}),
        visible: false,
      };
    });
  });

  /** 展示的是否是默认模板 */
  const showDefault = useMemo(() => {
    const defaultPlan = allPlan.find((item) => item.description === DefaultPlan.IsDefault);
    return curEditPlan?.planId === defaultPlan?.planId;
  }, [allPlan, curEditPlan?.planId]);

  return (
    <>
      <GlobalStyle />
      <MyModal
        // title={isAddModal ? '新建模版' : '选择指标'}
        title={
          selectedModalTitle ??
          (!showDefault ? <Header setNewPlanName={setNewPlanName} isAddModal={isAddModal} /> : '指标筛选')
        }
        type="maskScroll"
        width={800}
        visible={isAddModal ? addModalVisible : editModalVisible}
        destroyOnClose={false}
        onCancel={onCancel}
        footer={null}
        zIndex={isAddModal ? 1101 : 1100}
        wrapClassName={'app-dialog transform-selected-modal'}
        mask={!(isAddModal && editModalVisible)}
      >
        {tipInfo.outDropdown ? null : (
          <ErrorMessage
            visible={tipInfo.visible}
            type={tipInfo.type}
            content={tipInfo.text}
            style={ErrorMessageStyle}
          />
        )}
        <SelectContent
          isAddModal={isAddModal}
          checkedNodes={checkedNodes}
          setCheckedNodes={setCheckedNodes}
          {...restProps}
        />
        <Foot
          isAddModal={isAddModal}
          newPlanName={newPlanName}
          onCancel={onCancel}
          checkedNodes={checkedNodes}
          onConfirmChange={onConfirmChange}
        />
      </MyModal>
    </>
  );
};

export default memo(TemplateModal);

const MyModal = styled(Modal)`
  .ant-modal-content {
    height: calc(100vh - 160px) !important;
    .ant-modal-header {
      padding: 7px 50px !important;
      .ant-modal-title {
        font-size: 16px;
        line-height: 30px;
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
    .ant-modal {
      top: 80px !important;
      .ant-modal-content .ant-modal-close{
      top: -7px ;
      right: calc(50% - 400px - 8px);
    }
    }
  }
`;
