import { useRef, useMemo } from 'react';

import { AreaCompare } from '@/apis/area/type.define';
import { AreaShareParams, getAreasListFromString } from '@/pages/area/areaEconomy/modules/similar/utils';
import { useQuery } from '@/utils/hooks';

type AreaCompareList = AreaCompare.areaItem[][];
type AreaSharedQuery = Record<keyof AreaShareParams, string | undefined>;

const DIVIDER = ',';

export default function useShareSelectedAreas() {
  // set ref
  const query = useQuery<AreaSharedQuery>();
  const queryRef = useRef(query);

  const { year, res } = useMemo(() => {
    const query = queryRef.current,
      year = query.year,
      names = query.areas?.split(DIVIDER),
      codes = query.codes?.split(DIVIDER);
    if (!year || !names || !codes || names.length !== codes.length) return { year: '', res: [] };
    let res: AreaCompareList = [];
    names.forEach((name, i) => {
      let areaItem: AreaCompare.areaItem[] = [];
      const districts = getAreasListFromString(name);
      const districtsNumber = districts.length;
      districts.forEach((district, j) => {
        const LAST_LEVEL = j === districtsNumber - 1;
        areaItem.push({
          value: LAST_LEVEL ? codes[i] : '',
          label: district,
          end: LAST_LEVEL,
        });
      });
      res.push(areaItem);
    });
    return {
      year,
      res,
    };
  }, []);

  return {
    sharedAreas: res,
    year: year,
  };
}
