import { FC, useEffect, useRef } from 'react';

import styled from 'styled-components';

import ExportDoc from '@/components/exportDoc';
import { Screen, RowItem, Options } from '@/components/screen';
import TopicSearch from '@/components/topicSearch';
import { formatNumberWithVIP } from '@/utils/format';

import { ISCLEARFILTER } from '../../config';

interface FilterProps {
  exportConfig: {
    condition: Record<string, any>;
    filename: string;
  };
  count: number;
  screenKey: string;
  filterMenu: Options[];
  onFilterChange: (cur: RowItem[], all: RowItem[], idx: number) => void;
  onSearch: Function;
  onClearSearch: Function;
}

const FilterContainer: FC<FilterProps> = ({
  exportConfig,
  count,
  screenKey,
  filterMenu,
  onFilterChange,
  onSearch,
  onClearSearch,
}) => {
  const searchRef = useRef<Record<string, any>>();

  // 手动触发清除搜索!!
  useEffect(() => {
    if (searchRef.current && screenKey.includes(ISCLEARFILTER)) {
      searchRef.current.clearValue();
    }
  }, [screenKey]);

  return (
    <FilterStyle>
      <LeftScreen>
        {/* 筛选增多可能会有性能问题，这里暂时没什么影响 */}
        <Screen key={screenKey} options={filterMenu} onChange={onFilterChange} />
        <TopicSearch
          cref={searchRef}
          onClear={onClearSearch}
          maxSaveLen="20"
          placeholder="搜索"
          onSearch={onSearch}
          hasHistory={true}
          focusedWidth={220}
          dataKey={'private_detail_search'}
        />
      </LeftScreen>
      <RightExport>
        <div className="right-title-content">
          共<span className="right-title-content-count">{formatNumberWithVIP(count, 0)}</span>条
        </div>
        <ExportDoc {...exportConfig} />
      </RightExport>
    </FilterStyle>
  );
};

export default FilterContainer;

const FilterStyle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 8px 32px 8px 0;
  height: 20px;
`;
const LeftScreen = styled.div`
  display: flex;
  align-items: center;
  > div {
    margin-right: 24px;
  }
`;
const RightExport = styled.div`
  display: flex;
  align-items: center;
  .right-title-content {
    font-size: 12px;
    color: #666666;
    line-height: 18px;
    margin-right: 24px;
    font-weight: 400;
    .right-title-content-count {
      color: #ff7500;
      margin: 0 2px;
    }
  }
`;
