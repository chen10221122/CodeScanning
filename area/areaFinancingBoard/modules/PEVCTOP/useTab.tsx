import { useCallback, useMemo, useState } from 'react';

export enum TabType {
  EVENT = 'event',
  FINANCING = 'financing',
}

export default function useTab() {
  const tabConfig = useMemo(
    () => [
      {
        name: '按事件数',
        key: TabType.EVENT,
      },
      {
        name: '按融资额',
        key: TabType.FINANCING,
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
