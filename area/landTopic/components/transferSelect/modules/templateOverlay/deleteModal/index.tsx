import { useMemo, memo, FC } from 'react';

import { useMemoizedFn } from 'ahooks';
import { cloneDeep } from 'lodash';
import { createGlobalStyle } from 'styled-components';

import { useCtx } from '@pages/area/landTopic/components/transferSelect/context';
import usePlanApi, {
  DefaultPlan,
  PlanItem,
} from '@pages/area/landTopic/components/transferSelect/modules/templateOverlay/usePlanApi';
import { SelectItem } from '@pages/area/landTopic/components/transferSelect/types';

import { Modal } from '@/components/antd';
import { Image } from '@/components/layout';

export const DEFAULT_DELETE_INFO = {
  planId: '',
  visible: false,
  remark: DefaultPlan.NotDefault,
};

export interface DeleteInfo {
  planId: string;
  visible: boolean;
  remark: DefaultPlan;
}

interface Props {
  myPlan: PlanItem[];
  deleteConfirmInfo: DeleteInfo;
  onResetDeleteInfo: () => void;
  /** 将confirmData对应的原始数据返回给使用者 */
  onConfirmChange: (confirmData: SelectItem[]) => void;
}

const DeleteModal: FC<Props> = ({ myPlan, deleteConfirmInfo, onResetDeleteInfo, onConfirmChange }) => {
  /* 我的模板的一些操作 */
  const { updateBatchPlan } = usePlanApi();
  const {
    state: { curSelectPlanId, allPlan, hide },
    update,
  } = useCtx();

  const onOk = useMemoizedFn(() => {
    const copyPlan = cloneDeep(myPlan);
    /* 确认删除，过滤掉要删除的模板，并调用更新接口 */
    updateBatchPlan(
      copyPlan.reverse().reduce((pre, cur) => {
        if (cur.planId !== deleteConfirmInfo.planId)
          pre.push({
            planId: cur.planId,
            planName: cur.planName,
            sort: pre.length,
            /* 如果删除的是默认模板，就把系统模板设成默认的， */
            remark:
              deleteConfirmInfo.remark === DefaultPlan.IsDefault && cur.description === DefaultPlan.IsDefault
                ? DefaultPlan.IsDefault
                : cur?.remark,
          });
        return pre;
      }, [] as PlanItem[]),
      true,
    );
    if (curSelectPlanId === deleteConfirmInfo.planId) {
      const systemPlan = allPlan.find((item) => item.description === DefaultPlan.IsDefault);
      if (systemPlan) {
        const { content, planId } = systemPlan;
        update((draft) => {
          draft.confirmSelected = content ?? [];
          draft.curSelectPlanId = planId;
        });
        onConfirmChange(content ?? []);
        hide();
      }
    }
    onResetDeleteInfo();
  });

  /** 删除模板确认弹窗,这里没用公共组件里的confirmModal，不知道为啥用了之后点击弹窗外面，dropDown会关闭，所以只好自己写了个 */
  const delModalConfig = useMemo(
    () => ({
      visible: deleteConfirmInfo.visible,
      closeIcon: (
        <Image
          src={require('@/assets/images/blank/close.png')}
          src1x={require('@/assets/images/blank/close.png')}
          src2x={require('@/assets/images/blank/close@2x.png')}
        />
      ),
      width: 438,
      closable: true,
      maskClosable: false,
      className: 'yjt-confirm-dialog transferSelect-addNewPlan-dialog',
      centered: true,
      zIndex: 1100,
      onCancel: onResetDeleteInfo,
      onOk,
    }),
    [deleteConfirmInfo, onOk, onResetDeleteInfo],
  );

  return (
    <>
      <GlobalStyle />
      <Modal {...delModalConfig}>
        <div className={'confirmIcon'}>
          <Image
            src={require('@/assets/images/modal/alarm.png')}
            src1x={require('@/assets/images/modal/alarm.png')}
            src2x={require('@/assets/images/modal/alarm@2x.png')}
          />
        </div>
        <div className={'confirmText'}>确定要删除此模板吗？</div>
      </Modal>
    </>
  );
};

export default memo(DeleteModal);

const GlobalStyle = createGlobalStyle`
  .transferSelect-addNewPlan-dialog{
    .ant-modal-body{
      height: 136px;
      font-size: 18px;
      font-weight: 500;
      text-align: center;
      color: #111111;
      line-height: 23px;
      position: relative;
      .confirmIcon {
        position: relative;
        bottom: 77px;
      }
      .confirmText {
        position: relative;
        bottom: 41px;
      }
    }
    .ant-modal-footer {
      border-top: none;
      text-align: center;
      padding-bottom: 16px;
      padding-top: 0;
    }
  }
`;
