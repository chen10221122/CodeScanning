import { useState } from 'react';

import { useMemoizedFn, useRequest } from 'ahooks';
import { message } from 'antd';

import { getCellTransformRequest } from '@dataView/api';
import { typeMap } from '@dataView/const';
import {
  IndicatorRowConfig,
  useEventSubscribe,
  useIndicatorHandler,
  useIndicatorParamsHelper,
} from '@dataView/provider';

import Modal from './modals';

export default function IssuerExtra() {
  const [title, setTitle] = useState<string>();
  const { getIndicator } = useIndicatorHandler();
  const { interfaceParams } = useIndicatorParamsHelper();
  const [modalInfo, setModalInfo] = useState<{
    visible?: boolean;
    type?: string;
    params?: Record<string, any>;
    extraProperties?: Record<string, any>;
  }>({});
  const { runAsync: requestCellModalInfo } = useRequest(getCellTransformRequest, {
    manual: true,
    debounceWait: 500,
    debounceLeading: true,
    debounceTrailing: false,
    onError: (e: any) => {
      if (e.type === 'Timeout') {
        message.error({ content: '请求超时，请稍后再试', duration: 3 });
      } else {
        message.error({ content: e.info || '请求异常，请稍后再试', duration: 3 });
      }
    },
  });

  useEventSubscribe('cellClick', (event) => {
    const target = event.event?.target as HTMLElement | undefined;
    if (target && target.dataset.clickArea === 'true') {
      const indicatorFiledKey = event.column.getColId();
      const indicator = getIndicator(indicatorFiledKey) as IndicatorRowConfig;
      if (indicator) {
        const type = indicator.extraProperties?.type;
        if (type) {
          setTitle(event.data!.name);
          requestCellModalInfo({
            businessCodeInfo: [event.data!.key, typeMap[event.data!.type as string]],
            indexParam: { indexId: event.column.getColId(), paramMap: interfaceParams?.[indicatorFiledKey] },
          }).then(({ data }) => {
            setModalInfo({
              visible: true,
              type,
              params: data,
              extraProperties: event.data![indicatorFiledKey].extraProperties,
            });
          });
        }
      }
    }
  });
  const handleVisibleChange = useMemoizedFn((v) => {
    setModalInfo((info) => ({ ...info, visible: v }));
  });

  return <Modal {...modalInfo} onVisibleChange={handleVisibleChange} title={title} />;
}
