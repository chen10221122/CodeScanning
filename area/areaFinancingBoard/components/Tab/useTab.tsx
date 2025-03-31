import { useCallback, useMemo, useState } from 'react';

export enum TabType {
  GRAPH = 'graph',
  TABLE = 'table',
}

export default function useTab(index = 0) {
  const tabConfig = useMemo(
    () => [
      {
        name: '图形',
        key: TabType.GRAPH,
      },
      {
        name: '表格',
        key: TabType.TABLE,
      },
    ],
    [],
  );

  const [tab, setTab] = useState(tabConfig[index].key);

  const onTabChange = useCallback((item) => {
    setTab(item.key);
  }, []);

  return { tabConfig, tab, onTabChange };
}
