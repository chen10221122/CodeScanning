import { useCallback, useMemo, useState } from 'react';

export enum TabType {
  ENTERPRISE = 'enterprise_financing_scale',
  REGION = 'region_society_financing',
}

export default function useTab() {
  const tabConfig = useMemo(
    () => [
      {
        name: '企业融资规模',
        key: TabType.ENTERPRISE,
      },
      {
        name: '地区社融',
        key: TabType.REGION,
      },
    ],
    [],
  );

  const [tab, setTab] = useState(tabConfig[0].key);

  const onTabChange = useCallback((item) => {
    setTab(item.key);
  }, []);

  return { tabConfig, tab, onTabChange };
}
