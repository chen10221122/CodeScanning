import { useEffect, useRef } from 'react';

import { cloneDeep, isUndefined } from 'lodash';

import { useCtx } from '@pages/area/landTopic/components/transferSelect/context';
import usePlanApi, {
  DefaultPlan,
  DEFAULT_PLAN_NAME,
  NEW_DEFAULT_PLAN_NAME,
  PlanItem,
} from '@pages/area/landTopic/components/transferSelect/modules/templateOverlay/usePlanApi';

/**
 * 初始化模板列表，如果该用户一个模板都没有，自动新建一个系统默认的模板
 */
export default function useInitPlan() {
  const {
    state: { allPlan, hasGetPlanFlag, moduleCode, pageCode, defaultSelect, noPlan },
  } = useCtx();

  const { refreshPlan, confirmAddPlan, updateBatchPlan } = usePlanApi();

  const initFlag = useRef(false);

  /* 获取过模板后发现没有系统默认的模板，就自动新增一个系统默认模板 */
  useEffect(() => {
    if (
      !initFlag.current && // 加个限制防止因网络问题出现上一个请求未返回，下一个请求又发出的问题
      hasGetPlanFlag &&
      defaultSelect.length &&
      allPlan.findIndex((item) => item.description === DefaultPlan.IsDefault) === -1
    ) {
      initFlag.current = true;
      confirmAddPlan({
        content: JSON.stringify(defaultSelect),
        planName: NEW_DEFAULT_PLAN_NAME,
        remark: DefaultPlan.IsDefault,
        description: DefaultPlan.IsDefault,
      });
    }
  }, [allPlan, confirmAddPlan, hasGetPlanFlag, defaultSelect]);

  /** 解决历史遗漏问题，发现有多个系统模板，就删除多余的只保留一个 */
  useEffect(() => {
    if (hasGetPlanFlag && allPlan.length) {
      const defaultPlans = allPlan.filter((item) => item.description === DefaultPlan.IsDefault);
      if (defaultPlans.length > 1) {
        const copyPlan = cloneDeep(allPlan);
        let defaultPlanCount = 0;
        updateBatchPlan(
          copyPlan.reverse().reduce((pre, cur, index) => {
            if (cur.description !== DefaultPlan.IsDefault || defaultPlanCount < 1) {
              pre.push({
                planId: cur.planId,
                planName: cur.planName,
                sort: index,
              });
              if (cur.description === DefaultPlan.IsDefault) defaultPlanCount += 1;
            }
            return pre;
          }, [] as PlanItem[]),
          false,
        );
      }
    }
  }, [allPlan, hasGetPlanFlag, updateBatchPlan]);

  /* 
    因为需求变更要把系统默认方案名称改掉，这里就检查进行修改，检测到旧名称改成新的
    如果系统模板指标里没有 parentKey，也更新一下
  */
  useEffect(() => {
    if (hasGetPlanFlag && allPlan.length) {
      const defaultPlan = allPlan.find((item) => item.description === DefaultPlan.IsDefault);
      const noParentKey = isUndefined(defaultPlan?.content?.[0]?.parentKey);

      if (defaultPlan?.planName === DEFAULT_PLAN_NAME || noParentKey) {
        const copyPlan = cloneDeep(allPlan);
        updateBatchPlan(
          copyPlan.reverse().reduce((pre, cur, index) => {
            const newItem: any = {
              planId: cur.planId,
              planName: cur.description === DefaultPlan.IsDefault ? NEW_DEFAULT_PLAN_NAME : cur.planName,
              sort: index,
            };
            if (cur.planId === defaultPlan?.planId && noParentKey) {
              newItem.content = JSON.stringify(defaultSelect);
            }
            pre.push(newItem);
            return pre;
          }, [] as PlanItem[]),
          false,
        );
      }
    }
  }, [allPlan, defaultSelect, hasGetPlanFlag, updateBatchPlan]);

  /** noPlan 为假时，初次获取一次模板数据，才有后续模版操作 */
  useEffect(() => {
    if (!noPlan && (moduleCode || pageCode)) refreshPlan();
  }, [moduleCode, pageCode, refreshPlan, noPlan]);
}
