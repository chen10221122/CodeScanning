import { useState } from 'react';

import { useMemoizedFn } from 'ahooks';
import { isArray } from 'lodash';

import { SelectItem } from '@pages/area/landTopic/components/transferSelect';
import { useCtx } from '@pages/area/landTopic/components/transferSelect/context';

import { addOrUpdateMyPlan, batchUpdateMyPlan, getMyPlan } from '@/apis/common/myPlan';
import { TipType } from '@/components/advanceSearch/components/extraModal/errorMessage';
import useRequest from '@/utils/ahooks/useRequest';

export interface PlanItem {
  planId: string;
  planName: string;
  sort: number;
  /** 模板的具体选中指标 */
  content?: SelectItem[];
  /** 标识该模板是不是有默认标签 */
  remark?: DefaultPlan;
  /** 标识该模板是不是系统默认模板，系统默认模板不可删除、编辑 */
  description?: DefaultPlan;
}

/** 是否是默认模板的标识 */
export enum DefaultPlan {
  IsDefault = 'true',
  NotDefault = '',
}

interface res {
  data?: {
    planId: string;
    planName: string;
    sort: number;
    content?: string;
  }[];
}

/** 旧的模板的默认名称 */
export const DEFAULT_PLAN_NAME = '系统默认方案';

/** 新的模板的默认名称 */
export const NEW_DEFAULT_PLAN_NAME = '系统模板';

export default function usePlanApi() {
  const {
    state: { moduleCode, pageCode, maxPlan, allPlan, hide, defaultSelect, hasPay },
    update,
  } = useCtx();

  const [deleteFlag, setDeleteFlag] = useState(false); // 操作是否是删除标识
  const [addFlag, setAddFlag] = useState(false); // 操作是否是新增标识
  const [newPlanId, setNewPlanId] = useState<string>(); // 操作是否是新增标识

  const { run: getPlan } = useRequest(getMyPlan(moduleCode, pageCode) as () => Promise<any>, {
    manual: true,
    onSuccess: ({ data }: res) => {
      if (isArray(data)) {
        update((draft) => {
          /* 这里用reverse反转一下，因为ui要求倒序插入，但接口只能正序插，包括模板更新，也要倒序更新！！！，页面显示效果就和倒序插一样了 */
          draft.allPlan = data.reverse().reduce((pre, cur) => {
            cur.content = JSON.parse(cur?.content || JSON.stringify(defaultSelect));
            //@ts-ignore
            pre.push(cur);
            return pre;
          }, [] as PlanItem[]);
          draft.hasGetPlanFlag = true;
          if (data.length === 1) {
            draft.curSelectPlanId = data[0].planId;
          }
        });
        /* 删除某个模板，获取新的列表后要出删除提示 */
        if (deleteFlag) {
          update((draft) => {
            draft.tipInfo = {
              visible: true,
              text: '我的模板删除成功！',
              type: TipType.success,
            };
          });
          setDeleteFlag(false);
        }
        /* 新增模板时要将该新增模板选中 */
        if (addFlag && newPlanId) {
          update((draft) => {
            draft.curSelectPlanId = newPlanId;
          });
          setAddFlag(false);
          setNewPlanId(undefined);
        }
      }
    },
  });

  /** 新增或者单个更新模板 */
  const { run: addOrUpdatePlan } = useRequest(addOrUpdateMyPlan(moduleCode, pageCode), {
    manual: true,
    debounceWait: 100,
    onSuccess: (data: { data: string }) => {
      getPlan();
      /* 非初次新增系统默认模板时，才有提醒 */
      if (allPlan.findIndex((item) => item?.description === DefaultPlan.IsDefault) !== -1) {
        update((draft) => {
          draft.tipInfo = {
            visible: true,
            text: '你已成功保存我的模板！',
            type: TipType.success,
            outDropdown: true,
          };
        });
        if (addFlag) setNewPlanId(data.data);
      }
    },
  });

  const { run: updatePlan } = useRequest(batchUpdateMyPlan(moduleCode, pageCode), {
    manual: true,
    onSuccess: () => getPlan(),
  });

  /** 获取最新的模板信息 */
  const refreshPlan = useMemoizedFn(() => getPlan());

  /** 校验通过后调接口新增操作 */
  const confirmAddPlan = useMemoizedFn((planInfo) => {
    setAddFlag(true);
    addOrUpdatePlan(planInfo);
  });

  /** 批量更新已有的模板 */
  const updateBatchPlan = useMemoizedFn((planInfo, deleteFlag) => {
    updatePlan(planInfo);
    if (deleteFlag) setDeleteFlag(true);
  });

  /** 新建或者修改模板时点击触发，打开指标选择弹窗,planData存在时表示编辑，否则表示新增 */
  const openTemplateModal = useMemoizedFn((planData, needNumCheck = true) =>
    update((draft) => {
      /* planData存在时表示编辑，否则表示新增 */
      if (planData) {
        hide();
        draft.curEditPlan = planData;
        draft.editModalVisible = true;
      } else if (allPlan.length >= maxPlan + 1 && needNumCheck)
        /* 新增时要做数量检查,+1是因为有个系统默认模板 */
        draft.tipInfo = {
          visible: true,
          text: `我的模板上限 ${maxPlan} 个，已超出！`,
          type: TipType.error,
        };
      else {
        hide();
        // draft.addModalVisible = true;
        if (!hasPay) {
          draft.noPayDialogVisible = true;
        } else {
          draft.addModalVisible = true;
        }
      }
    }),
  );

  return {
    refreshPlan,
    updateBatchPlan,
    confirmAddPlan,
    addOrUpdatePlan,
    openTemplateModal,
  };
}
