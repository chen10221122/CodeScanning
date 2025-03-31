import { useMemoizedFn } from 'ahooks';

import { getSearch } from '../../../utils';
import { useCtx } from '../context';
import { SearchResItem } from './index';

export default function useSearch() {
  const {
    state: { formatTreeData, fuzzySearch },
    update,
  } = useCtx();

  const searchChange = useMemoizedFn((keyword: string) => {
    let searchResults: SearchResItem[] = [];
    getSearch(formatTreeData, searchResults, keyword, fuzzySearch);
    const keywordAry = keyword.split('');
    /** 计算关键字命中率 */
    const getHitRate = (text: string) => {
      if (fuzzySearch) {
        const textAry = text.split('');
        const hitAry = textAry.filter((word) => keywordAry.includes(word));
        return textAry.length === 0 ? 0 : hitAry.length / textAry.length;
      } else {
        const unHitStr = text.split(keyword).join('');
        return text.length === 0 ? 0 : (text.length - unHitStr.length) / text.length;
      }
    };
    /* 还要根据关键字命中比例排个序 */
    searchResults.sort((a, b) => getHitRate(b.title) - getHitRate(a.title));
    update((draft) => {
      draft.searchRes = searchResults;
    });
  });

  return { searchChange };
}
