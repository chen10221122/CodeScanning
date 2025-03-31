import { useRef } from 'react';

import { useMemoizedFn } from 'ahooks';
import styled from 'styled-components';

import { Screen, RowItem } from '@/components/screen';
import TopicSearch from '@/components/topicSearch';
import { AREA_BLACK_HISTORY } from '@/configs/localstorage';

import useMenusConfig from './useMenusConfig';

interface IProps {
  onChange: (data: any) => void;
  hash: number;
  options: {
    data: any[]; // 筛选数据
    inputSearchType?: any; // 搜索的类型
    placeholder?: string; // 输入框提示文件
    scrollWrap?: () => HTMLElement; // 如果有搜索输入框，则需要该属性
  };
}

function Filter({ onChange, options, hash }: IProps) {
  const filterRef = useRef<any>({
    searchFilter: [],
    optionFilter: [],
  });

  const { menusConfig } = useMenusConfig({ data: options.data });

  // 菜单渲染父组件
  const getPopContainer = useMemoizedFn(() => document.getElementById('black_list_filter_params')!);

  const handleScreen = useMemoizedFn((_, items: RowItem[]) => {
    filterRef.current.optionFilter = items;
    onChange([...filterRef.current.searchFilter, ...filterRef.current.optionFilter]);
  });

  // 搜索框点击清空的时候执行的函数
  const handleSearchClear = useMemoizedFn(() => {
    filterRef.current.searchFilter = [];
    onChange([...filterRef.current.searchFilter, ...filterRef.current.optionFilter]);
  });

  // 搜索框变化的时候执行的函数
  const handleSearch = useMemoizedFn((value) => {
    const arr = [
      {
        values: 'SEARCH_INPUT_INFO',
        code: '',
        type: 'keyword',
        keyword: value,
        isRelation: false,
        companyInfo: {},
        uniqueValue: 'input_search_keyword',
      },
    ];
    filterRef.current.searchFilter = arr;
    onChange([...filterRef.current.searchFilter, ...filterRef.current.optionFilter]);
  });

  return (
    <FilterContainer key={hash} id="black_list_filter_params">
      <Screen getPopContainer={getPopContainer} options={menusConfig} onChange={handleScreen} />
      {/*@ts-ignore*/}
      <TopicSearch
        placeholder="请输入机构名称"
        style={{ marginLeft: '17px' }}
        maxSaveLen={17}
        focusedWidth={256}
        dataKey={AREA_BLACK_HISTORY}
        onClear={handleSearchClear}
        onSearch={handleSearch}
      />
    </FilterContainer>
  );
}

export default Filter;

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
`;
