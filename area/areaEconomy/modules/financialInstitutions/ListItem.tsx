import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useMemoizedFn } from 'ahooks';
import { get, isEmpty } from 'lodash';
import styled from 'styled-components';

import { Empty, Spin } from '@/components/antd';
import SkeletonScreen from '@/components/skeletonScreen';
import { useCtx } from '@/pages/area/areaEconomy/provider/getContext';
import useLoading from '@/pages/detail/hooks/useLoading';

import { getLevel } from '../../common';
import { getAreaChildCodes } from '../../common/getAreaChild';
import { Level } from '../../config';
import { ChangeScreenStyle } from '../../style';
import Export from './components/export';
import Table from './components/table';
import { tabOptions } from './config/tabsConfig';

const PAGE_SIZE = 10;
interface IParams {
  skip: number;
  pagesize: number;
  isQueryDetailedRegion: number; // 默认查询字段
  companyType?: string;
  areas?: string;
  districtCode?: string;
}

function ListItem({ title, titleID, currTabkey, institutionCount, setIsFirstLoading, updateLoadings }: any) {
  const { state } = useCtx();
  const mainLoading = state.mainLoading;

  const [tableLoading, setTableLoading] = useState(false);
  const [count, setCount] = useState(0);

  const isLoading = useLoading(tableLoading as boolean);

  // 默认请求参数
  const defaultParams = useRef<IParams>({
    skip: 0,
    pagesize: PAGE_SIZE,
    isQueryDetailedRegion: 1,
    companyType: currTabkey,
  });
  // 排序规则请求参数
  const sortParams = useRef<any>({});
  // 请求参数
  const [requestParams, setRequestParams] = useState<IParams & { [key: string]: any }>(defaultParams.current);

  const filterConditionRef = useRef({
    setSkip: useMemoizedFn((currentSkip: number, currentKey) => {
      // 切换 page 的时候先定位
      const titleDom = document.getElementById(`financialInstitutions_${currentKey}`);
      titleDom &&
        titleDom.scrollIntoView({
          block: 'start',
        });
      // 请求分页数据
      setRequestParams({ ...requestParams, skip: currentSkip });
    }),
    sortChange: useMemoizedFn((type: any, value: any, name = 'sort', sortRule = 'desc') => {
      // 减少 重复请求
      if ((requestParams[name] === value && requestParams.sortRule === sortRule) || (!requestParams[name] && !value)) {
        return;
      }
      sortParams.current = value ? { [name]: value, sortRule } : { [name]: undefined, sortRule: undefined };
      setRequestParams({ ...requestParams, ...sortParams.current, skip: 0 });
    }),
  });

  // 改变数量
  const handleChangeCount = useCallback(
    (count) => {
      setCount(count);
      setTableLoading(false);
      updateLoadings((d: any) => {
        d[currTabkey] = false;
      });
    },
    [currTabkey, updateLoadings],
  );

  //地区改变执行的方法
  useEffect(() => {
    delete defaultParams.current.areas;
    delete defaultParams.current.districtCode;
    const code = state.code;
    const level = getLevel(code);
    let codes: any = {};
    if (level === Level.PROVINCE) {
      codes.areas = code;
    } else if (level === Level.CITY) {
      const childCodes = getAreaChildCodes(code, level);
      codes.districtCode = code + (childCodes ? ',' + childCodes : '');
    } else if (level === Level.COUNTY) {
      codes.districtCode = code;
    }
    defaultParams.current = { ...defaultParams.current, ...codes };
    setRequestParams({ ...defaultParams.current });
  }, [state.code]);

  const regionName = useMemo(() => get(state, 'areaInfo.regionInfo[0].regionName', ''), [state]);

  // 当前tab 页有无数据
  const hasData = useMemo(() => {
    const { countKey } = tabOptions.find((it) => it.value === currTabkey) || {};
    return isEmpty(institutionCount) || ((countKey && institutionCount[countKey]) ?? 0) > 0;
  }, [currTabkey, institutionCount]);

  useEffect(() => {
    if (hasData) {
      setTimeout(() => {
        setIsFirstLoading(false);
      }, 500);
    }
    // 如果没数据，那么也置为 false
    if (!hasData) {
      updateLoadings((d: any) => {
        d[currTabkey] = false;
      });
    }
  }, [currTabkey, hasData, setIsFirstLoading, updateLoadings]);

  useEffect(() => {
    setTableLoading(true);
    updateLoadings((d: any) => {
      d[currTabkey] = true;
    });
  }, [currTabkey, requestParams, updateLoadings]);

  return (
    <div>
      <FilterContainer className="filter-container">
        <div className="card-title">{title}</div>
        <Export total={count} currTabkey={currTabkey} requestParams={requestParams} regionName={regionName} />
      </FilterContainer>
      <div style={{ position: 'relative' }}>
        <DomVisiabled id={titleID} currTabkey={currTabkey} />
      </div>
      {hasData ? (
        <>
          {isLoading && (
            <div style={{ height: '200px' }}>
              <SkeletonScreen num={1} firstStyle={{ paddingTop: '23px' }} />
            </div>
          )}
          <div style={isLoading ? { opacity: '0', position: 'fixed', zIndex: -10 } : {}}>
            <ChangeScreenStyle>
              <Spin type="square" spinning={tableLoading && !mainLoading}>
                <Table
                  key={currTabkey}
                  requestParams={requestParams}
                  currTabkey={currTabkey}
                  setCount={handleChangeCount}
                  filterConditionRef={filterConditionRef}
                />
              </Spin>
            </ChangeScreenStyle>
          </div>
        </>
      ) : (
        <Empty type={Empty.NO_SMALL_RELATED_DATA} style={{ height: '200px' }} />
      )}
    </div>
  );
}

export default ListItem;

const FilterContainer = styled.div`
  position: sticky;
  z-index: 7;
  top: 102px;
  margin: 6px 0 2px 0 !important;
  padding: 10px 0;
  box-sizing: content-box;
  background-color: #fff;
`;

const DomVisiabled = styled.div<{ currTabkey: string }>`
  position: absolute;
  width: 10px;
  height: 1px;
  top: ${({ currTabkey }) => (currTabkey === 'bank' ? '-186px' : '-144px')};
`;
