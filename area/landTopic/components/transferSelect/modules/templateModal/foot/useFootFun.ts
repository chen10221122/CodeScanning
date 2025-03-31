import { useMemoizedFn } from 'ahooks';

import { useCtx } from '@pages/area/landTopic/components/transferSelect/context';
import usePlanApi from '@pages/area/landTopic/components/transferSelect/modules/templateOverlay/usePlanApi';
import { SelectItem } from '@pages/area/landTopic/components/transferSelect/types';

import { TipType } from '@/components/advanceSearch/components/extraModal/errorMessage';
import { strHasEmoji } from '@/utils/share';
interface Props {
  checkedNodes: SelectItem[];
  onCancel: () => void;
  onConfirmChange: (confirmData: SelectItem[]) => void;
}

export default function useFootFun({ checkedNodes, onConfirmChange, onCancel }: Props) {
  const {
    state: { curEditPlan, allPlan, maxPlan },
    update,
  } = useCtx();

  /* 我的模板的一些操作 */
  const { addOrUpdatePlan, confirmAddPlan } = usePlanApi();
  /** 点击临时查看触发，返回selecting并关闭弹窗 */
  const tempCheck = useMemoizedFn(() => {
    onConfirmChange(checkedNodes);
    onCancel();
  });

  /** 点击另存模板触发，新增模板信息并关闭弹窗 */
  const saveNewPlan = useMemoizedFn(() => {
    update((draft) => {
      /* 新增时要做数量检查 */
      if (allPlan.length >= maxPlan + 1)
        draft.tipInfo = {
          visible: true,
          text: `我的模板上限 ${maxPlan} 个，已超出！`,
          type: TipType.error,
        };
      else {
        draft.confirmNewPlanModalVisible = true;
        /* draft.editModalVisible = false;
        draft.curEditPlan = undefined; */
      }
    });
  });

  /** 点击保存或者查看触发,有 name 表示新增，否则是修改 */
  const onOk = useMemoizedFn((name, newPlanName?) => {
    const content = JSON.stringify(checkedNodes);
    if (name === '' || (name && strHasEmoji(name))) {
      update((draft) => {
        draft.tipInfo = {
          visible: true,
          text: name === '' ? '模板名称不能为空！' : `不能保存表情符号！`,
          type: TipType.error,
        };
      });
      return;
    }
    if (name) {
      confirmAddPlan({
        content,
        planName: name,
      });
    } else {
      /* @ts-ignore */
      addOrUpdatePlan({
        ...curEditPlan,
        content,
        planName: newPlanName ? newPlanName : curEditPlan?.planName,
      });
      update((d) => {
        d.curSelectPlanId = curEditPlan?.planId;
      });
    }
    tempCheck();
    update((draft) => {
      draft.addModalVisible = false;
      draft.editModalVisible = false;
    });
  });

  return { tempCheck, saveNewPlan, onOk };
}
