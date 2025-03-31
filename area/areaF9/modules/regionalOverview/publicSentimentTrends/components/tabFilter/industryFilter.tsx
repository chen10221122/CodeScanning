import { forwardRef, memo, useImperativeHandle, useMemo, useRef } from 'react';

import styled from 'styled-components';

import TabFilter, { TabFilterRef, FilterItem, OnFilterChange } from '@/components/tabFilter';

interface Props {
  /** tab数据 */
  tabDataList: Array<FilterItem>;
  /** 更多行业 */
  industryDataList: Array<FilterItem>;
  /** 筛选受控值 */
  tabFilterValues: {
    tileValues?: string[];
    moreScreenValues?: string[];
  };
  onChange: OnFilterChange;
}

const ITEM_TITLE_FIELD = 'name';
const SCREEN_OPTION = { ellipsis: 9 };

/** 对tabDataList转化，取name和id */
const transformSelect = (data: Array<FilterItem>) => {
  const result: Array<FilterItem> = [];
  const omitNameSet = new Set(['不限', '更多行业']);

  data.forEach((item) => {
    if (!omitNameSet.has(item.name)) {
      result.push({
        name: item.name,
        value: item.id,
      });
    }
  });

  return result;
};

const NewFilter = forwardRef<unknown, Props>(({ tabDataList, industryDataList, tabFilterValues, onChange }, ref) => {
  const filterRef = useRef<TabFilterRef>();

  useImperativeHandle(ref, () => ({
    handleRest: filterRef.current?.reset,
  }));

  const transformedTabList = useMemo(() => transformSelect(tabDataList), [tabDataList]);

  const filterData = useMemo(() => {
    // 别问为什么要复制8个出来，问就是产品的要求🐶
    return [...transformedTabList.slice(0, 8), ...transformedTabList, ...industryDataList];
  }, [transformedTabList, industryDataList]);

  return (
    <TabFilterWithStyle
      ref={filterRef}
      filterData={filterData}
      onChange={onChange}
      itemTitleField={ITEM_TITLE_FIELD}
      values={tabFilterValues}
      allBtnValue=""
      moreOption={SCREEN_OPTION}
    />
  );
});

export default memo(NewFilter);

const TabFilterWithStyle = styled(TabFilter)`
  padding-bottom: 8px;
`;
