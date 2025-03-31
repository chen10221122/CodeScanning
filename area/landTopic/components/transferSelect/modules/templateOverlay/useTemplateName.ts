import { useState, useEffect, useRef } from 'react';

import { useMemoizedFn, useUpdateEffect } from 'ahooks';
import { isUndefined } from 'lodash';

import { useCtx } from '@pages/area/landTopic/components/transferSelect/context';

import { useInputComposition } from '@/utils/hooks';
import { strHasEmoji, getLimitString } from '@/utils/share';

interface Props {
  inputId: string;
  visible: boolean;
  onTipChange?: (v: string) => void;
  defaultTitle?: string;
}

export const NewNameMaxLen = 16;

export default function useTemplateName({ inputId, visible, onTipChange, defaultTitle }: Props) {
  const {
    state: { allPlan },
  } = useCtx();

  const [title, setTitle] = useState(defaultTitle ?? '');
  let isChineseInput = useInputComposition(`#${inputId}`, visible);

  const updateTitle = useMemoizedFn((text) => {
    let len = 0;
    text.split('').forEach((s: string) => {
      len += /[\u4E00-\u9FA5]/.test(s) ? 2 : 1;
    });
    if (/* textRef.current === text && */ len > NewNameMaxLen) {
      onTipChange?.(`最多${NewNameMaxLen / 2}个汉字或${NewNameMaxLen}个字符！`);

      updateTitle(getLimitString(text, NewNameMaxLen));
    } else if (strHasEmoji(text)) {
      onTipChange?.('不能保存表情符号！');
    } else {
      textRef.current = text;
      setTitle(text);
    }
  });

  // useEffect(() => {
  //   if (!isUndefined(defaultTitle)) updateTitle(defaultTitle);
  // }, [defaultTitle, updateTitle]);

  const textRef = useRef('');

  useEffect(() => {
    if (visible && isUndefined(defaultTitle)) {
      /* ui提的，默认名字不能与已有名字重复，所以这里做个判断 */
      for (let index = 1; index <= allPlan.length + 1; index++) {
        if (allPlan.every(({ planName }) => planName !== `我的模板${index}`)) {
          updateTitle(`我的模板${index}`);
          break;
        }
      }
    }
    if (visible && !isUndefined(defaultTitle)) {
      // updateTitle(defaultTitle);
      textRef.current = defaultTitle;
      setTitle(defaultTitle);
    }
  }, [visible, updateTitle, allPlan, defaultTitle]);

  const onChange = useMemoizedFn((e) => {
    let text = e.target.value;
    updateTitle(text);
  });

  useUpdateEffect(() => {
    if (!isChineseInput) {
      let text = getLimitString(textRef.current, NewNameMaxLen);
      updateTitle(text);
    }
  }, [isChineseInput, updateTitle]);

  return { title, onChange };
}
