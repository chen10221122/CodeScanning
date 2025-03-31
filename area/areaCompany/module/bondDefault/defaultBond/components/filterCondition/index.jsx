import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { useUpdateEffect, useMemoizedFn } from 'ahooks';
import dayjs from 'dayjs';
import { isEqual } from 'lodash';

import { getDefaultCompleteDefaultBondFilter } from '@/apis/default';
import CombinationDropdownSelect from '@/components/combinationDropdownSelect';
import ExportDoc from '@/components/exportDoc';
import { Screen, ScreenType } from '@/components/screen';
import Search from '@/components/topicSearch';
import { DEFAULT_FULL_BOND_SEARCH } from '@/configs/localstorage';
import { flatMenu, formatMenu } from '@/pages/default/bondDefault/utils';
import { formatNumber } from '@/utils/format';
import { useImmer, useRequest } from '@/utils/hooks';
import { initUniqueKeyMenu } from '@/utils/topicCommon';

import { Filter, FilterConditionWrap, Operating, ScreenWrapper } from '../../../style';
import useBabelFilterData, { groupBy, keyMap } from '../../../utils/useBabelFilter';
import { configuation } from './menu';

const inner = ['市场', '违约原因', '企业性质', '城投债', '担保'];
const mapping = {
  债券类型: { type: ScreenType.MULTIPLE },
  行业: { type: ScreenType.MULTIPLE },
  地区: { type: ScreenType.MULTIPLE },
  更多: { type: ScreenType.MULTIPLE_TILING },
  自选组合: { type: ScreenType.SINGLE },
  市场: {},
  违约原因: { multiple: true, hasSelectAll: true },
  企业性质: { multiple: true, hasSelectAll: true },
  城投债: {},
  担保: {},
};

const originCondition = {
  text: '',
  bondType: '',
  market: '',
  reason: '',
  industry_code: '',
  area: '',
  enterprise_property: '',
  is_municipal: '',
  is_guarantee: '',
  sort: '',
  subId: '',
};

const FilterCondition = ({ getCondition, getConditionHeight, PAGE_SIZE, skipRef, count, regionInfo }) => {
  const { state } = useLocation();

  const filterElRef = useRef();
  const screenRef = useRef();
  const [keyword, setKeyword] = useState(() => {
    originCondition.text = state?.word;
    return state?.word;
  }); // 搜索词

  /** 自选组合 */
  const [subId, setSubId] = useState('');
  const searchRef = useRef();
  const [menuConfig, setMenuConfig] = useState([]);
  const lastCondition = useRef();
  const [condition, setCondition] = useImmer(originCondition);

  const echoInputVal = useMemoizedFn((v) => searchRef.current?.setInputValue(v));

  useUpdateEffect(() => {
    echoInputVal(state?.word);
  }, [state]);

  /** 搜索值变化回显 */
  useEffect(() => {
    echoInputVal(keyword);
  }, [echoInputVal, keyword]);

  useRequest(getDefaultCompleteDefaultBondFilter, {
    track: { once: true },
    defaultParams: [{}],
    formatResult: ({ data }) => data,
    onSuccess: (data) => {
      if (data) {
        const tmp = formatMenu({ data: flatMenu(data), menuConfig: configuation, inside: inner });
        setMenuConfig(initUniqueKeyMenu(tmp));
      }
    },
  });
  /* 搜索相关 */
  const handleSearch = useCallback(
    (value) => {
      skipRef.current = 0;
      setKeyword(value);
      setCondition((old) => ({ ...originCondition, ...old, skip: skipRef.current * PAGE_SIZE, text: value }));
    },
    [PAGE_SIZE, setCondition, skipRef],
  );

  useUpdateEffect(() => {
    if (!isEqual(condition, lastCondition.current)) {
      lastCondition.current = condition;
      getCondition(condition);
      let timer = setTimeout(() => {
        getConditionHeight?.(filterElRef.current && filterElRef.current.getBoundingClientRect());
      }, 200);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [condition, getCondition, getConditionHeight]);
  const [newConfig] = useBabelFilterData(menuConfig, mapping);

  /** 筛选配置 */
  const config = useMemo(() => newConfig.filter((item) => !['自选组合', '地区']?.includes(item.title)), [newConfig]);

  const handleChange = useCallback(
    (_, v1, idx) => {
      let keyValueObj = keyMap(groupBy(v1, 'key'));

      skipRef.current = 0;
      setCondition(() => ({
        ...originCondition,
        ...keyValueObj,
        subId: subId,
        text: keyword,
        skip: skipRef.current * PAGE_SIZE,
      }));
    },
    [PAGE_SIZE, keyword, setCondition, skipRef, subId],
  );

  const onCombinationChange = useMemoizedFn((_, all) => {
    const value = _[0]?.value || '';
    skipRef.current = 0;
    setSubId(value);
    setCondition((old) => ({
      ...originCondition,
      ...old,
      subId: value,
      text: keyword,
      skip: skipRef.current * PAGE_SIZE,
    }));
  });

  return (
    <FilterConditionWrap ref={filterElRef}>
      {/* 筛选操作 */}
      {menuConfig ? (
        <Filter>
          <ScreenWrapper ref={screenRef}>
            <Screen options={config} onChange={handleChange} getPopContainer={() => screenRef.current} />
          </ScreenWrapper>

          <CombinationDropdownSelect
            onChange={onCombinationChange}
            style={{
              marginRight: 24,
            }}
          />
          <Search
            focusedWidth={250}
            cref={searchRef}
            placeholder="搜索"
            onClear={() => {
              setKeyword('');
              setCondition((d) => {
                d.text = '';
              });
            }}
            onSearch={(value) => handleSearch(value)}
            dataKey={DEFAULT_FULL_BOND_SEARCH}
          />
        </Filter>
      ) : null}
      {/* 搜素导出操作 */}
      <Operating>
        <div className="count">
          共 <span>{count ? formatNumber(count, 0) : '0'}</span> 条
        </div>
        <ExportDoc
          condition={{
            ...condition,
            module_type: 'region_complete_default_bond',
            downloadType: 'export',
            exportFlag: true,
            ...regionInfo,
          }}
          filename={`债券违约明细-${dayjs(new Date()).format('YYYYMMDD')}`}
        />
      </Operating>
    </FilterConditionWrap>
  );
};

export default React.memo(FilterCondition);
