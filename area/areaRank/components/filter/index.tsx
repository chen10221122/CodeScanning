import { useEffect, useMemo, useRef, useState } from 'react';

import { useMemoizedFn } from 'ahooks';
import dayjs from 'dayjs';

import { useCtx } from '@pages/area/areaRank/provider';

import ExportDoc from '@/components/exportDoc';
import { Screen, Options, ScreenType } from '@/components/screen';
import TopicSearch from '@/components/topicSearch';
import { AREA_RANK } from '@/configs/localstorage';
import { formatNumber } from '@/utils/format';

import S from '../../styles.module.less';

const options: Options[] = [
  /*{
    title: '发布单位',
    option: {
      type: ScreenType.MULTIPLE,
      children: [
        { name: '企业预警通', value: '1', key: 'department' },
        { name: '赛迪顾问', value: '2', key: 'department' },
        { name: '财经战略研究院', value: '3', key: 'department' },
        { name: '中小城市研究院', value: '4', key: 'department' },
        { name: '其他', value: '5', key: 'department' },
      ],
      hideSearch: true,
    },
  },*/
  {
    title: '年度',
    option: {
      type: ScreenType.SINGLE,
      children: Array.from({ length: dayjs().year() - 2014 }, (k, i) => ({
        name: `${dayjs().year() - i}`,
        value: `${dayjs().year() - i}`,
        key: 'year',
      })),
      hideSearch: true,
    },
  },
];
const Filter = () => {
  const {
    state: { rankCount, screenCondition, activeCategory },
    update,
  } = useCtx();
  const cRef = useRef<{ clearValue: () => void }>();
  const onClear = () => {
    update((d) => {
      d.screenCondition.keyWord = '';
    });
  };
  const onSearch = (v: string) => {
    update((d) => {
      d.screenCondition.keyWord = v;
    });
  };
  const [values, setValues] = useState<any>([[undefined], [undefined]]);
  const handleChange = useMemoizedFn((option, options: Record<string, any>[]) => {
    let obj: Record<string, any> = {};
    ['year', 'department'].forEach((o) => {
      obj[o] = options
        .filter((item) => item.key === o)
        .map((t) => t.value)
        .join(',');
    });
    setValues([[obj['year']]]);
    update((d) => {
      Object.keys(obj).forEach((k) => {
        d.screenCondition[k as 'year' | 'department'] = obj[k];
      });
    });
  });
  useEffect(() => {
    if (screenCondition.resetScreenFlag) {
      setValues([[undefined]]);
      cRef.current?.clearValue();
    }
  }, [screenCondition.resetScreenFlag]);
  const isHotList = useMemo(() => {
    return activeCategory === 'hot' ? { isHotList: '1' } : {};
  }, [activeCategory]);

  return (
    <div className={S.filterContainer}>
      <Screen values={values} options={options} onChange={handleChange} />
      <TopicSearch
        onClear={onClear}
        style={{ marginLeft: 18 }}
        onChange
        onSearch={onSearch}
        dataKey={AREA_RANK}
        cref={cRef}
      />
      <div className={S.filterRight}>
        <div className={S.count}>
          共 <span>{formatNumber(rankCount ? rankCount : 0, 0)}</span> 条
        </div>
        <ExportDoc
          condition={{
            module_type: 'region_list',
            ...screenCondition,
            category: activeCategory && ['hot', 'all'].includes(activeCategory) ? '' : activeCategory,
            ...isHotList,
          }}
          filename={`地区榜单${dayjs().format('YYYYMMDD')}`}
        />
      </div>
    </div>
  );
};
export default Filter;
