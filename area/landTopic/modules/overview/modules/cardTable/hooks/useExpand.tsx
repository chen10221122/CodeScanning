import { useEffect, useState } from 'react';

import { useMemoizedFn } from 'ahooks';

import { IncrementArea } from '@pages/area/landTopic/modules/overview/modules/cardTable';
import { getRegion } from '@pages/area/landTopic/modules/overview/modules/cardTable/utils';
import { useCtx } from '@pages/area/landTopic/modules/overview/provider';
interface Props {
  incrementCallBackRef: React.MutableRefObject<(() => void) | undefined>;
  setIncrementArea: React.Dispatch<React.SetStateAction<IncrementArea>>;
}

const useExpand = ({ incrementCallBackRef, setIncrementArea }: Props) => {
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [hasExpandedRows, setHasExpandedRows] = useState<string[]>([]); // 记录所有展开过的行，折叠后再展开就不重复请求数据了
  const {
    state: {
      areaLists: { areaCounty },
      dateFilter,
      otherFilter,
      areaFilter,
    },
  } = useCtx();

  useEffect(() => {
    setExpandedRows([]);
    setHasExpandedRows([]);
  }, [dateFilter, otherFilter, areaFilter]);

  const onChangeOpenKeys = useMemoizedFn((key: string, expand: boolean) => {
    if (expand) {
      if (!hasExpandedRows.includes(key)) {
        const region = getRegion(areaCounty, key, 1);
        const { children } = region || {};
        if (children?.length) {
          const curIncrementArea = children.reduce(
            (pre: IncrementArea, { value, areaLevel }: { value: string; areaLevel: number }) => {
              const areaKey = areaLevel === 2 ? 'cityCode' : 'countyCode';
              if (pre[areaKey]) {
                pre[areaKey] = `${pre[areaKey]},${value}`;
              } else {
                pre[areaKey] = value;
              }
              return pre;
            },
            { parentCode: key },
          );
          setIncrementArea(curIncrementArea);
          incrementCallBackRef.current = () => {
            setExpandedRows([...expandedRows, key]);
            setHasExpandedRows([...hasExpandedRows, key]);
          };
        }
      } else {
        setExpandedRows([...expandedRows, key]);
      }
    } else {
      setExpandedRows(expandedRows.filter((item) => item !== key));
    }
  });

  return { expandedRows, onChangeOpenKeys };
};

export default useExpand;
