import { useEffect, useRef } from 'react';

import { message } from 'antd';

import { useCtx } from '@pages/area/landTopic/components/transferSelect/context';

/**
 * 处理message的隐藏
 */
export default function useTipVisible() {
  const {
    state: { tipInfo, tipDelay },
    update,
  } = useCtx();

  useEffect(() => {
    if (tipInfo.outDropdown && tipInfo.visible) {
      message.success(tipInfo.text);
    }
  }, [tipInfo]);

  /** 存放定时器任务 */
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (tipInfo.visible)
      //@ts-ignore
      timeoutRef.current = setTimeout(() => {
        update((draft) => {
          draft.tipInfo = { ...draft.tipInfo, visible: false };
        });
      }, tipDelay);
    return () => timeoutRef.current && clearTimeout(timeoutRef.current);
  }, [tipDelay, tipInfo.visible, update]);
}
