import { useCallback, useMemo, useState } from 'react';

export enum TabType {
  PLATE = 'ipoPlate',
  ENTERPRISE = 'entType',
  INDUSTRY = 'industryType',
}

export default function useTab() {
  const tabConfig = useMemo(
    () => [
      {
        name: '板块',
        key: TabType.PLATE,
      },
      {
        name: '按企业性质',
        key: TabType.ENTERPRISE,
      },
      {
        name: '按产业',
        key: TabType.INDUSTRY,
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
