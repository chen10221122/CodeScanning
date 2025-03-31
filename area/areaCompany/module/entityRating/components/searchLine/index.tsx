import React, { useRef } from 'react';

import dayjs from 'dayjs';

import CombinationDropdownSelect from '@/components/combinationDropdownSelect';
import ExportDoc from '@/components/exportDoc';
import { Screen } from '@/components/screen';
import Search from '@/components/topicSearch';
import { DEFAULT_FULL_BOND_SEARCH } from '@/configs/localstorage';
import {
  Filter,
  FilterConditionWrap,
  Operating,
  ScreenWrapper,
} from '@/pages/area/areaCompany/module/entityRatingOversea/style';
import { formatNumber } from '@/utils/format';

import { menuConfig as screenOption } from './screenConf';

const FilterCondition = ({
  totalCount,
  title,
  onScreenChange,
  condition,
}: {
  totalCount: number;
  title: string;
  onScreenChange: (condition: any) => any;
  condition?: any;
}) => {
  const filterElRef = useRef<any>();
  const screenRef = useRef<any>();
  const searchRef = useRef();

  return (
    <FilterConditionWrap ref={filterElRef}>
      {/* 筛选操作 */}
      {screenOption ? (
        <Filter>
          <ScreenWrapper ref={screenRef}>
            <Screen
              options={screenOption as any[]}
              onChange={onScreenChange('screen')}
              getPopContainer={() => screenRef.current as unknown as HTMLElement}
            />
          </ScreenWrapper>

          <CombinationDropdownSelect
            onChange={onScreenChange('subId')}
            style={{
              marginRight: 24,
            }}
          />
          <Search
            focusedWidth={250}
            cref={searchRef}
            placeholder="搜索"
            onClear={() => {
              onScreenChange('search')?.('');
            }}
            onSearch={onScreenChange('search')}
            dataKey={DEFAULT_FULL_BOND_SEARCH}
          />
        </Filter>
      ) : null}
      {/* 搜素导出操作 */}
      <Operating>
        <div className="count">
          共 <span>{totalCount ? formatNumber(totalCount, 0) : '0'}</span> 条
        </div>
        <ExportDoc
          condition={{ ...condition, module_type: 'main_rating_isR', downloadType: 'export', exportFlag: true }}
          filename={`${title}-${dayjs(new Date()).format('YYYYMMDD')}`}
        />
      </Operating>
    </FilterConditionWrap>
  );
};

export default React.memo(FilterCondition);
