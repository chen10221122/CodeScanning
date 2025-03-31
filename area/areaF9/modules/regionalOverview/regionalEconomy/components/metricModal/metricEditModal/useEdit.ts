import { useRef, useState } from 'react';

import { useMemoizedFn } from 'ahooks';
import { isArray } from 'lodash';

import type { ConfigType, NormalChildItem } from '@dataView/components/Indicators';

// 指标参数编辑
export default function useEdit(indexId: string, actionDefault: ConfigType) {
  const [value, setValue] = useState<NormalChildItem[] | undefined>(() => {
    if (isArray(actionDefault)) {
      return actionDefault.map((item) => item?.children?.[0] || {});
    } else {
      return actionDefault?.actions?.['default']?.map((item) => item?.children?.[0] || {});
    }
  });
  const changedInnerIndicatorsRef = useRef<NormalChildItem[]>(value || []);
  const changedIndicatorsRef = useRef<NormalChildItem[]>(value || []);

  const [, markPrevent, restorePrevent] = usePrevent();

  const saveChangedIndicators = (originIndicators?: NormalChildItem[], targetIndicators?: NormalChildItem[]) => {
    changedIndicatorsRef.current = originIndicators || [];
    changedInnerIndicatorsRef.current = targetIndicators || [];
  };

  const onConfirm = useMemoizedFn(() => {
    if (changedInnerIndicatorsRef.current) {
      restorePrevent();
      // processExtendIndicators({ [indicator.key]: changedInnerIndicatorsRef.current });
      // console.log(changedInnerIndicatorsRef.current);
    }
  });

  const onCancel = useMemoizedFn((popQueue = true) => {
    restorePrevent();
    setValue(changedIndicatorsRef.current);
  });

  const onChange = useMemoizedFn(
    (
      allRows: NormalChildItem[],
      allInnerRows: NormalChildItem[],
      mutateRows: { row: NormalChildItem; mutateValue: any }[],
    ) => {
      markPrevent();
      saveChangedIndicators(allRows, allInnerRows);
      setValue(allRows);
    },
  );

  return { value, onChange, onConfirm, onCancel };
}

function usePrevent() {
  const isPreventRef = useRef(false);

  const markPrevent = () => {
    isPreventRef.current = true;
  };

  const restorePrevent = () => {
    setTimeout(() => {
      isPreventRef.current = false;
    }, 500);
  };

  return [isPreventRef, markPrevent, restorePrevent] as const;
}
