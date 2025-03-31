import { useRef, useState } from 'react';

import { useMemoizedFn, useRequest } from 'ahooks';
import { get } from 'lodash';

import { getDialogList } from '@/apis/ai';

export interface IHistoryItem {
  currentSessionId: string;
  dialogFirstMsg: string;
}
export const useHistoryList = (userId: string) => {
  const cacheHistoryList = useRef<IHistoryItem[]>([]);
  const [historyList, setHistoryList] = useState<IHistoryItem[]>([]);
  const { run: runHistoryList } = useRequest(() => getDialogList({ userId }), {
    manual: true,
    refreshDeps: [userId],
    onSuccess: (res) => {
      const newList = get(res, 'data.data') as IHistoryItem[];

      cacheHistoryList.current = newList.filter((o) => !!o.currentSessionId);
      setHistoryList([...cacheHistoryList.current]);
    },
  });
  const handleSearch = useMemoizedFn((keyword: string) => {
    const newList = keyword
      ? cacheHistoryList.current.filter((o) => o.dialogFirstMsg.includes(keyword))
      : cacheHistoryList.current;
    setHistoryList(newList);
  });
  const changeHistoryList = useMemoizedFn((list: IHistoryItem[] | ((o: IHistoryItem[]) => IHistoryItem[])) => {
    if (typeof list === 'function') {
      const newList = list(cacheHistoryList.current);
      cacheHistoryList.current = newList;
      setHistoryList(newList);
    } else {
      cacheHistoryList.current = list;
      setHistoryList(list);
    }
  });
  return {
    historyList,
    runHistoryList,
    setHistoryList: changeHistoryList,
    handleSearch,
    cacheHistoryList,
  };
};
