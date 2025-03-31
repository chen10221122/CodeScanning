import { ReactNode, useMemo, useState, useEffect } from 'react';

import { useMemoizedFn } from 'ahooks';
import { isString, isUndefined, isFunction } from 'lodash';

import { useCtx } from '@pages/area/landTopic/components/transferSelect/context';
// import { DefaultPlan } from '@pages/area/landTopic/components/transferSelect/modules/templateOverlay/usePlanApi';
import { selectItem } from '@pages/area/landTopic/components/transferSelect/types';

interface Props {
  /** 用户自定义title方法 */
  formatTitle?: (selectedRows: selectItem[]) => ReactNode;
  /** 最长显示字符 */
  ellipsis?: number;
}

/**
 * 处理当前显示的标题
 * @returns 当前显示的标题showTitle
 */
export default function useTitle({ formatTitle, ellipsis }: Props) {
  const {
    state: { title, curSelectPlanId, allPlan, confirmSelected },
    update,
  } = useCtx();

  const sliceLength = useMemo(() => (isUndefined(ellipsis) || ellipsis <= 0 ? 8 : ellipsis), [ellipsis]);
  const [showTitle, setTitle] = useState<ReactNode>(() =>
    isString(title) && title.length > sliceLength ? `${title.substring(0, sliceLength)}…` : title,
  );

  /* 处理ellipsis */
  const setEllipsisTitle = useMemoizedFn((titleRes) => {
    if (titleRes) {
      if (isString(titleRes) && titleRes.length > sliceLength) setTitle(`${titleRes.substring(0, sliceLength)}…`);
      else setTitle(titleRes);
    } else setTitle(title);
  });

  useEffect(() => {
    if (isFunction(formatTitle)) {
      const formatTitleRes = formatTitle(confirmSelected);
      setEllipsisTitle(formatTitleRes ? formatTitleRes : title);
    } else {
      /* 有选中模板id,且选中模板id存在时，将模板名称设成title,且不限长度 */
      if (curSelectPlanId) {
        const selectPlan = allPlan.find((item) => item.planId === curSelectPlanId);

        if (selectPlan) {
          //当前方案为‘系统方案’时
          /* if (selectPlan.description === DefaultPlan.IsDefault) {
            setTitle(`我的指标方案`);
          } else {
            setTitle(`${selectPlan?.planName}`);
          } */
          setTitle(`${selectPlan?.planName}`);
        } else {
          setEllipsisTitle(title);
          update((draft) => (draft.curSelectPlanId = undefined));
        }
      } else setEllipsisTitle(title);
    }
  }, [allPlan, curSelectPlanId, formatTitle, confirmSelected, setEllipsisTitle, sliceLength, title, update]);
  return showTitle;
}
