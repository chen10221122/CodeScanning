import { useEffect, useRef } from 'react';

import { useBoolean } from 'ahooks';
import { isEqual } from 'lodash';

import { useCtx } from '../provider/ctx';

export const useFullMaskLoading = () => {
  const {
    state: { selectedAreaList, selectedTarget, chartLoading },
  } = useCtx();
  const [fullLoading, { setTrue, setFalse }] = useBoolean(false);
  const targetRef = useRef();
  const areaRef = useRef();

  useEffect(() => {
    if (!isEqual(selectedAreaList, areaRef.current) || !isEqual(selectedTarget, targetRef.current)) {
      setTrue();
    }
  }, [selectedAreaList, selectedTarget, setTrue]);

  useEffect(() => {
    if (!chartLoading && fullLoading) {
      setFalse();
    }
  }, [chartLoading, setFalse, fullLoading]);

  return fullLoading;
};
