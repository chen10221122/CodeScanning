import { useState, useEffect, useRef } from 'react';

import { useRequest } from 'ahooks';
import dayjs from 'dayjs';

import { useParams } from '@/pages/area/areaF9/hooks';
import { getAreaRankList } from '@/pages/area/areaF9/modules/regionalOverview/areaRank/api';
import { useImmer } from '@/utils/hooks';

const defaultParams = { category: '', skip: 0, sortKey: 'announcementDate', sortRule: 'desc', pageSize: 99999 };
const CURRENTTOTAL = 5;

export const useAreaTag = () => {
  const [list, setList] = useState<Record<string, any>[]>([]);
  const [allCount, setAllCount] = useState(0);
  const [condition, updateCondition] = useImmer<Record<string, any>>(defaultParams);
  const isToPrevYear = useRef(true);
  const { regionCode } = useParams();

  // const api_prefix = '/finchinaAPP/v1';

  // export const getAreaRankTags = ({ regionCode }: { regionCode: string }) => {
  //   return request.get(`${api_prefix}/finchina-economy/v1/area/list/region_tags`, {
  //     params: { regionCode },
  //   });
  // };

  const { run } = useRequest(getAreaRankList, {
    manual: true,
    onSuccess(res: any) {
      if (res && res.data && res.data.total) {
        setList(res.data.data?.slice(0, CURRENTTOTAL) || []);
        setAllCount(res.data.total || 0);
      } else {
        if (isToPrevYear.current) {
          // 只会倒推一年
          isToPrevYear.current = false;
          // 无数据拿上一年的
          updateCondition((d) => {
            d.year = dayjs().subtract(1, 'year').year();
          });
        }
      }
    },
    onError() {
      setList([]);
      setAllCount(0);
    },
  });

  useEffect(() => {
    if (regionCode) {
      updateCondition((d) => {
        d.region = regionCode;
        d.year = dayjs().year();
      });
    }
  }, [regionCode, updateCondition]);

  useEffect(() => {
    if (condition.region) {
      run(condition);
    }
  }, [run, condition]);

  return { areaList: list, areaAllCount: allCount, areaCondition: condition };
};
