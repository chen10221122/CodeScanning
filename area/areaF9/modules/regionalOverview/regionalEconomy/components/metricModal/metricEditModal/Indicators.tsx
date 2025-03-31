import { memo, useEffect, useRef, useState } from 'react';

import { useMemoizedFn } from 'ahooks';
import { flattenDeep, isArray, isEmpty, isUndefined } from 'lodash';
import styled, { css } from 'styled-components';

import Indicator from '@dataView/components/Indicators/components/Indicator';
import { IndicatorContextProvider, LayoutContextProvider } from '@dataView/components/Indicators/context';
import useChangeHelper from '@dataView/components/Indicators/hooks/useChangeHelper';
import useDefaultHandler from '@dataView/components/Indicators/hooks/useDefaultHandler';
import type { ConfigType, NormalChildItem, NormalConfig } from '@dataView/components/Indicators/types';

import useDataMap from './useDataMap';

interface IndicatorsProps {
  data?: ConfigType;
  indicatorKey: string;
  value?: NormalChildItem[];
  onChange?: (
    allRows: NormalChildItem[],
    allInnerRows: NormalChildItem[],
    // 突变的项
    mutateRows: { row: NormalChildItem; mutateValue: any }[],
  ) => void;
  layout?: 'horizontal' | 'vertical';
}

const Indicators = function Indicators({ data, indicatorKey, value, onChange, layout }: IndicatorsProps) {
  const actionTriggerRef = useRef('default');
  const dataTriggerRef = useRef<string>();
  // 是否触发了actionTrigger，在触发actionTrigger之后，表单面板会发生变化，此时之前抛出的value在新的表单中是无法选中的
  // 所以，对于新的表单，我们需要先获取其存在的默认值（获取的方式见useDefaultHandler），对默认值进行抛出处理，以更新value。
  const isTriggerChangeRef = useRef(false);

  const { rebuildData, getRaw, getRows } = useDataMap(indicatorKey, data);

  // 获取配置信息
  const getConfig = useMemoizedFn(
    (data?: ConfigType): { data?: NormalConfig[]; triggers?: NormalConfig[]; configs?: NormalConfig[] } => {
      if (data) {
        if (isArray(data)) {
          return { data };
        }
        if (data.actions) {
          dataTriggerRef.current = actionTriggerRef.current;
          const configs = data.configs || [];
          const triggers = data.actions[actionTriggerRef.current];
          return {
            data: [...configs, ...triggers],
            triggers,
            configs,
          };
        }
      }
      return {};
    },
  );

  const updateTriggerByValue = useMemoizedFn((value: NormalChildItem[]) => {
    const withTriggerValue = value.find((d) => d.actionTrigger);
    if (withTriggerValue) {
      actionTriggerRef.current = withTriggerValue.actionTrigger;
    } else {
      actionTriggerRef.current = 'default';
    }
  });

  const [renderData, setRenderData] = useState(() => {
    if (!isUndefined(value)) {
      updateTriggerByValue(value);
    }
    const { data } = getConfig(rebuildData);
    return data;
  });

  const indicatorsRef = useRef<NormalChildItem[][]>([]);

  useEffect(() => {
    if (!isUndefined(value)) {
      updateTriggerByValue(value);
      if (dataTriggerRef.current && dataTriggerRef.current !== actionTriggerRef.current) {
        const { data } = getConfig(rebuildData);
        setRenderData(data);
      }
    }
  }, [getConfig, rebuildData, updateTriggerByValue, value]);

  useEffect(() => {
    if (dataTriggerRef.current !== actionTriggerRef.current) {
      const { data } = getConfig(rebuildData);
      setRenderData(data);
    }
  }, [rebuildData, getConfig]);

  const updateActionTrigger = useMemoizedFn((state: string) => {
    if (rebuildData) {
      const actionTrigger = actionTriggerRef.current;
      if (!isArray(rebuildData)) {
        if (state !== actionTrigger) {
          isTriggerChangeRef.current = true;
          actionTriggerRef.current = state;
          const { data } = getConfig(rebuildData);
          setRenderData(data);
        }
      }
    }
  });
  const processChange = useChangeHelper({ onChange, getRaw });

  const { defaults } = useDefaultHandler({
    data: rebuildData,
    renderData,
    // value,
    onChange: processChange,
    isTriggerChangeRef,
    getRaw,
  });

  const mergeIndicators = useMemoizedFn(() => {
    return flattenDeep(indicatorsRef.current.filter(Boolean));
  });

  useEffect(() => {
    if (defaults) {
      indicatorsRef.current = defaults;
    }
  }, [defaults]);

  useEffect(
    function onDefaultChange() {
      if (defaults) {
        const indicators = mergeIndicators();
        if (!isEmpty(indicators)) {
          processChange([], indicators);
        }
      }
    },
    [defaults, mergeIndicators, processChange],
  );

  useEffect(
    function updateLevelRef() {
      if (renderData && value) {
        const r = (row: NormalChildItem, index: number) => {
          const raw = getRaw(row);
          if (raw) {
            const currentIndicators = indicatorsRef.current[index];
            if (value.includes(raw)) {
              if (!currentIndicators) {
                indicatorsRef.current[index] = [row];
              } else {
                if (
                  !currentIndicators.includes(row) &&
                  !currentIndicators.some((d) => d._selected && d._selected.includes(row))
                ) {
                  indicatorsRef.current[index].push(row);
                }
              }
            } else if (currentIndicators) {
              const oldIndicatorIndex = currentIndicators.indexOf(row);
              if (oldIndicatorIndex > -1) {
                indicatorsRef.current[index].splice(oldIndicatorIndex, 1);
              }
            }
          }
          if (row.children) {
            row.children.forEach((item: NormalChildItem) => r(item, index));
          }
        };

        renderData.forEach((row, index) => r(row, index));
      }
    },
    [getRaw, renderData, value],
  );

  const handleChange = useMemoizedFn((items: NormalChildItem[], index: number) => {
    indicatorsRef.current[index] = items;
    const indicators = mergeIndicators();
    processChange(items, indicators);
  });

  const [renderValue, setRenderValue] = useState(() => getRows(value));

  useEffect(() => {
    setRenderValue(getRows(value));
  }, [getRows, value]);

  useEffect(() => {
    if (renderData) {
      renderData.forEach((item) => {
        if (item.children) {
          item.children.forEach((config) => {
            config.disabled = item.disabled;
            config.readonly = item.readonly;
          });
        }
      });
    }
  }, [renderData]);

  if (!renderData) return null;

  return (
    <IndicatorContextProvider value={updateActionTrigger}>
      <LayoutContextProvider value={layout || 'horizontal'}>
        <Wrapper layout={layout}>
          {renderData.map((config, index) => (
            <InnerIndicators key={index} index={index} value={renderValue} data={config} onChange={handleChange} />
          ))}
        </Wrapper>
      </LayoutContextProvider>
    </IndicatorContextProvider>
  );
};

export default memo(Indicators);

function InnerIndicators({
  data,
  value,
  index,
  onChange,
}: {
  data: NormalConfig;
  index: number;
  onChange?: (rows: NormalChildItem[], index: number) => void;
  value?: NormalChildItem[];
}) {
  const handleChange = useMemoizedFn((rows: NormalChildItem[]) => {
    onChange && onChange(rows, index);
  });

  return <Indicator data={data} onChange={handleChange} value={value} />;
}

const Wrapper = styled.div<{ layout?: 'horizontal' | 'vertical' }>`
  color: #141414;
  ${({ layout }) =>
    layout === 'vertical' &&
    css`
      margin-bottom: 15px;
      font-size: 13px;
    `}
  > div {
    align-items: center;
    &:not(:last-child) {
      margin-bottom: 10px;
    }
    .ant-select .ant-select-selector {
      height: 24px !important;
    }
    .ant-select:not(.ant-select-disabled):hover .ant-select-selector {
      border-color: rgb(196, 220, 245);
    }
    // .ant-select .ant-select-arrow span {
    //   background: url(${require('@dataView/images/icon_select_arrow_full.png')}) no-repeat center;
    // }
    // .ant-select.ant-select-open .ant-select-arrow span {
    //   background: url(${require('@dataView/images/icon_select_arrow_full_active.png')}) no-repeat center;
    // }
  }
`;
