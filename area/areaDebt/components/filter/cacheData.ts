import { getLocalStorageData, setLocalStorageData } from '@/utils/localstorageWithExpiretime';

const AREA_DEBT_CACHE_YEAR = 'area_debt_cache_year';

// 从localStorage中获取缓存数据
export function getCacheYear() {
  const localCacheData = getLocalStorageData(AREA_DEBT_CACHE_YEAR);
  if (localCacheData) {
    const { data, isExpires } = localCacheData;
    if (!isExpires && data) {
      return data;
    }
  }
  return null;
}

// 设置缓存数据 到localStorage中
export function setCacheYear(data: any) {
  setLocalStorageData({ key: AREA_DEBT_CACHE_YEAR, data, expiretime: 1000 * 60 * 60 * 24 * 1 });
}
