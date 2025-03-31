import { useCallback, useContext, useMemo, useState } from 'react';

import { useSelector } from '@/pages/area/areaF9/context';
import { useConditionCtx } from '@/pages/area/areaFinancingBoard/context';
import { FinancingScaleContext } from '@/pages/area/areaFinancingBoard/modules/financingScale/index';

import { DetailModalTypeEnum } from '../type';

export default function useTab(setScreenValues: any, isFirstLoadRef: React.MutableRefObject<boolean>) {
  const { update } = useConditionCtx();

  const { year } = useContext(FinancingScaleContext);

  const { areaInfo } = useSelector((store) => ({ areaInfo: store.areaInfo }));

  const tabConfig = useMemo(
    () => [
      {
        name: 'A股IPO',
        key: DetailModalTypeEnum.StockAIpo,
        defaultCondition: { equityType: 'IPO', sortKey: 'issueDate' },
      },
      {
        name: 'A股再融资',
        key: DetailModalTypeEnum.StockARefinance,
        defaultCondition: { equityType: '公开增发,定向增发,配股', sortKey: 'issueDate' },
      },
      {
        name: '新三板定增',
        key: DetailModalTypeEnum.NewThirdAdd,
        defaultCondition: { equityType: '公开增发,定向增发,配股', sortKey: 'issueDate' },
      },
      {
        name: '创投融资',
        key: DetailModalTypeEnum.VC,
        defaultCondition: { sortKey: 'publishDate' },
      },
    ],
    [],
  );

  const [tab, setTab] = useState(tabConfig[0].key);

  const onTabChange = useCallback(
    (item) => {
      setTab(item.key);
      update((d) => {
        d.detailModalConfig.title = `${areaInfo?.regionName || ''}${year}年${item.key}`;
        d.detailModalConfig.modalType = item.key;
        const defaultCondition = d.detailModalConfig.defaultCondition;
        d.detailModalConfig.defaultCondition = Object.assign({
          ...defaultCondition,
          ...item.defaultCondition,
        });
      });
      isFirstLoadRef.current = true;
      setScreenValues([]);
    },
    [update, areaInfo?.regionName, year, setScreenValues, isFirstLoadRef],
  );

  return { tabConfig, tab, onTabChange, setTab };
}
