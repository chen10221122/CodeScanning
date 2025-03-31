import { useEffect, useRef } from 'react';

import dayjs from 'dayjs';

import ExportDoc from '@/components/exportDoc';
import { LINK_AREA_RANK } from '@/configs/routerMap/area';
import MoreBtn from '@/pages/area/areaEconomy/components/traceBtn/moreBtn';
import { useCtx } from '@/pages/area/areaEconomy/modules/areaRank/provider';
import { useCtx as useRegionCodeCtx } from '@/pages/area/areaEconomy/provider/getContext';
import { formatNumber } from '@/utils/format';

import S from '../../styles.module.less';

const Filter = () => {
  const {
    state: { rankCount, screenCondition, activeCategory },
  } = useCtx();
  const {
    state: { code: regionCode },
  } = useRegionCodeCtx();
  const cRef = useRef<{ clearValue: () => void }>();

  useEffect(() => {
    if (screenCondition.resetScreenFlag) {
      cRef.current?.clearValue();
    }
  }, [screenCondition.resetScreenFlag]);

  return (
    <div className={S.filterContainer}>
      <div className={S.filterRight}>
        <div className={S.count}>
          共 <span>{formatNumber(rankCount ? rankCount : 0, 0)}</span> 条
        </div>
        <ExportDoc
          condition={{
            module_type: 'region_list',
            ...screenCondition,
            region: regionCode,
            category: activeCategory === 'all' ? '' : activeCategory,
          }}
          filename={`地区榜单${dayjs().format('YYYYMMDD')}`}
        />
        <MoreBtn linkTo={LINK_AREA_RANK} style={{ marginLeft: '24px' }} />
      </div>
    </div>
  );
};
export default Filter;
