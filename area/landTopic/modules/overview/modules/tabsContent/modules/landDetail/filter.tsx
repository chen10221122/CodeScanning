import { FC, memo, useRef } from 'react';

import { Flex } from '@dzh/components';
import { useMemoizedFn } from 'ahooks';
import dayjs from 'dayjs';

import Tooltip from '@pages/area/landTopic/components/tooltip';
import type { FilterType } from '@pages/area/landTopic/modules/overview/modules/tabsContent/modules/landDetail';

import ExportDoc from '@/components/exportDoc';
import { Options, ScreenType, Screen } from '@/components/screen';
import TopicSearch from '@/components/topicSearch';
import TabNum from '@/pages/area/landTopic/components/tabNum';

import type { WritableDraft } from 'immer';

import S from '@pages/area/landTopic/styles.module.less';

const OPTIONS: Options[] = [
  {
    title: '所处阶段',
    option: {
      type: ScreenType.SINGLE,
      cancelable: false,
      children: [
        { name: '不限', value: '', unlimited: true, active: true, filed: 'stage' },
        { name: '土地出让', value: '1', filed: 'stage' },
        { name: '土地公示', value: '2', filed: 'stage' },
        { name: '合同签订', value: '3', filed: 'stage' },
      ],
    },
    formatTitle: (selected) => (
      <>
        <div className="tab-screen-label">所处阶段:</div>
        {selected[0]?.name}
      </>
    ),
  },
  {
    title: '计划开发周期',
    option: {
      type: ScreenType.SINGLE,
      cancelable: false,
      children: [
        { name: '不限', value: '', unlimited: true, active: true, filed: 'planDevelopCycle' },
        { name: '<1年', value: '(0,1)', filed: 'planDevelopCycle' },
        { name: '1-3年', value: '[1,3)', filed: 'planDevelopCycle' },
        { name: '3-5年', value: '[3,5)', filed: 'planDevelopCycle' },
        { name: '5-10年', value: '[5,10)', filed: 'planDevelopCycle' },
        { name: '>10年', value: '[10,*)', filed: 'planDevelopCycle' },
      ],
    },
    formatTitle: (selected) => (
      <>
        <div className="tab-screen-label">
          计划开发周期:
          <Tooltip title="计划开发周期 = 计划竣工时间 - 计划开工时间" />
        </div>
        {selected[0]?.name}
      </>
    ),
  },
];

interface Props {
  total: number;
  companyNum: number;
  exportCondition: any;
  filterKey: string;
  onChange: (f: (draft: WritableDraft<FilterType>) => void | FilterType) => void;
}

const TOPIC_SEARCH_STYLE = { marginLeft: '13px' };

const Filter: FC<Props> = ({ total, companyNum, exportCondition, filterKey, onChange }) => {
  const keywordRef = useRef('');
  const handleSearch = useMemoizedFn((keyword: string) => {
    keywordRef.current = keyword;
    onChange((draft) => {
      draft.keyword = keyword;
    });
  });

  const onScreenChange = useMemoizedFn((_, allSelected) => {
    const results = allSelected.reduce((pre: any, { value, filed }: { value: string; filed: string }) => {
      if (value) {
        if (pre[filed]) {
          pre[filed] = `${pre[filed]},${value}`;
        } else {
          pre[filed] = value;
        }
      }
      return pre;
    }, {});
    onChange((draft) => (draft.keyword ? { ...results, keyword: draft.keyword } : { ...results }));
  });

  const onClear = useMemoizedFn(() => handleSearch(''));
  const onSearchChange = useMemoizedFn((value) => (keywordRef.current = value));
  return (
    <div className="tab-content-filter">
      <Flex align="center" key={filterKey}>
        <Screen options={OPTIONS} onChange={onScreenChange} />
        <TopicSearch
          style={TOPIC_SEARCH_STYLE}
          onClear={onClear}
          onChange={onSearchChange}
          onSearch={handleSearch}
          dataKey="land_topic_overview_land_detail"
          placeholder="宗地编号/地块名称/企业/电子监管号/土地坐落"
          focusedWidth={320}
        />
      </Flex>
      <div className={S['num-export']}>
        <TabNum total={total} landTotal={companyNum} />
        <ExportDoc condition={exportCondition} filename={`招拍挂_土地出让明细_${dayjs().format('YYYYMMDD')}`} />
      </div>
    </div>
  );
};

export default memo(Filter);
