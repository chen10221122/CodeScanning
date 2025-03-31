import { useCallback, useEffect, useRef, useState, useMemo } from 'react';

import cn from 'classnames';
import styled from 'styled-components';

import { getAreaLevel } from '@/apis/area/areaEconomy';
import { getCityInvestPlatformStatistics } from '@/apis/area/platforms';
import { Empty, Row, Spin } from '@/components/antd';
import SkeletonScreen from '@/components/skeletonScreen';
import { LINK_AREA_FINANCING_PLATFORM } from '@/configs/routerMap';
import MoreBtn from '@/pages/area/areaEconomy/components/traceBtn/moreBtn';
import { useCtx } from '@/pages/area/areaEconomy/provider/getContext';
import * as S from '@/pages/area/areaEconomy/style';
import useTableData, { InitParams } from '@/pages/bond/areaFinancingPlatform/useFinancingPlateform';
import useAnchor from '@/pages/detail/hooks/useAnchor';
import useLoading from '@/pages/detail/hooks/useLoading';
import useRequest from '@/utils/ahooks/useRequest';

import { isCounty } from '../../common';
import { getAreaChildCodes } from '../../common/getAreaChild';
import { DEFAULT_INDEXES, PAGE_SIZE, SELFS, DEFAULT_INDEXES_COUNT, CONTAINS } from '../../config/platforms';
import { ChangeScreenStyle } from '../../style';
import useChangeTabError from '../../useChangeTabError';
import ExportDoc from './components/export';
import Filter from './components/filter';
import HelpText from './components/helpText';
import PlatformInfo from './components/platformInfo';
import Table from './components/table';

// 获取默认请求参数
const defaultParams = {
  size: PAGE_SIZE,
  from: 0,
  sortKey: 'CR0202_001',
  sortRule: 'desc',
  indexes: DEFAULT_INDEXES, // 默认指标
};
const getInitParams = (regionCode: string) => ({
  ...defaultParams,
  regionCode: regionCode + ',' + getAreaChildCodes(regionCode),
});

export default () => {
  const {
    state: { code: regionCode, mainLoading },
  } = useCtx();

  const paramsRef = useRef<InitParams>(defaultParams);
  const [tableData, setTableData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  // 创建一个新的参数 表示单签选中的 是 含下属辖区 还是 本级
  const [currentRadio, setCurrentRadio] = useState(isCounty(regionCode) ? SELFS : CONTAINS);
  // 请求配置参数
  const requestConfig = useMemo(
    () => ({
      manual: true,
      formatResult(data: any) {
        return data?.data;
      },
    }),
    [],
  );
  // 获取table数据
  let { data, getTableData, dataLength, maxData, error, pending: tableLoading } = useTableData(paramsRef.current);
  // 获取平台信息接口
  const {
    data: platformData,
    run: queryPlatformData,
    loading,
    error: platformError,
  } = useRequest(getCityInvestPlatformStatistics, requestConfig);

  // 获取地区等级 9999900067
  const { data: levelData, run: getAreaLevelData, error: areaError } = useRequest(getAreaLevel, requestConfig);

  // 获取平台信息方法
  const getPlatformData = useCallback(
    ({ isContainJurisdiction }: { isContainJurisdiction: string }) => {
      queryPlatformData({
        regionCode: paramsRef.current.regionCode,
        indexes: DEFAULT_INDEXES_COUNT,
        isContainJurisdiction,
      });
    },
    [queryPlatformData],
  );

  // 筛选条件变化重新请求数据
  const reloadData = useCallback(() => {
    const { size, from, indexes } = defaultParams;
    paramsRef.current = { ...paramsRef.current, size, from, indexes };
    setCurrentPage(1);
    // 获取table数据
    getTableData(paramsRef.current);
  }, [getTableData, setCurrentPage]);
  const tableError: any = error;
  // 切换地区
  useEffect(() => {
    paramsRef.current = getInitParams(regionCode);
    // 获取地区等级
    getAreaLevelData({ regionCode });
    reloadData();
    // 获取平台数据
    getPlatformData({ isContainJurisdiction: isCounty(regionCode) ? SELFS : CONTAINS });
  }, [regionCode, reloadData, getAreaLevelData, getPlatformData]);

  useEffect(() => {
    setTableData(data);
  }, [data, dataLength]);

  // 表格分页变化
  const handleTableChange = useCallback(
    async (current: number) => {
      if (current) {
        Object.assign(paramsRef.current, {
          from: (current - 1) * 50,
          size: 50,
        });
        if (paramsRef.current.indexes) await getTableData(paramsRef.current);
        setCurrentPage(current);
      }
    },
    [getTableData],
  );
  // 排序和请求
  const [currentSort, setCurrentSort] = useState({ key: 'CR0202_001', value: '城投评分', rule: 'desc' });
  const handleSortChange = useCallback(
    async (currentSort) => {
      paramsRef.current.sortKey = currentSort.key ? currentSort.key : 'CR0202_001';
      /* 主体评级的排序实际上是反着的，找中台说api就这样，api是老的改不了，就前端自己处理下 */
      if (currentSort.key === 'BD0320_001') {
        if (currentSort.rule === 'asc') {
          paramsRef.current.sortRule = 'desc';
        } else {
          paramsRef.current.sortRule = 'asc';
        }
      } else {
        paramsRef.current.sortRule = currentSort.rule ? currentSort.rule : 'desc';
      }
      if (paramsRef.current.indexes) await getTableData(paramsRef.current);
    },
    [getTableData],
  );

  const changeTabError = useChangeTabError([platformError, tableError, areaError]);

  // 模块内筛选滚动条隐藏，筛选完成回到顶部
  useEffect(() => {
    const container = document.getElementById('area_economy_container') as HTMLBaseElement;
    if (tableLoading && container) {
      container.style.overflow = 'hidden';
    } else {
      container.style.overflow = '';
    }
  }, [tableLoading]);

  // 筛选项变动
  const handleMenuChange = useCallback(
    (currentSelected) => {
      const data = currentSelected.reduce((obj: any, item: any) => {
        return {
          ...obj,
          [item.projectValue]: obj[item.projectValue] ? obj[item.projectValue] + ',' + item.value : item.value,
        };
      }, {});
      const { regionCode, sortKey, sortRule, likeStr } = paramsRef.current;
      paramsRef.current = { regionCode, sortKey, sortRule, likeStr, ...data };

      setTimeout(reloadData, 300);
    },
    [reloadData],
  );

  const handleRadioChange = useCallback(
    (e) => {
      const { value } = e.target;
      paramsRef.current.regionCode =
        value === SELFS ? regionCode : regionCode + ',' + getAreaChildCodes(regionCode, levelData?.level);
      setCurrentRadio(value);
      reloadData();
      // 获取平台数据
      getPlatformData({ isContainJurisdiction: value });
    },
    [regionCode, reloadData, levelData, getPlatformData],
  );

  const handleSearch = useCallback(
    (str) => {
      paramsRef.current.likeStr = str;
      reloadData();
    },
    [reloadData],
  );

  const [hash, setHash] = useState(0);

  const resetCondition = useCallback(() => {
    // 清除筛选项
    setHash(Math.random());
    // 重置请求
    const value = isCounty(regionCode) ? SELFS : CONTAINS;
    setCurrentRadio(value);
    const { sortKey, sortRule, size, from, indexes } = paramsRef.current;
    paramsRef.current = {
      regionCode: value === SELFS ? regionCode : regionCode + ',' + getAreaChildCodes(regionCode, levelData?.level),
      likeStr: '',
      sortKey,
      sortRule,
      size,
      from,
      indexes,
    };
    reloadData();
    // 获取平台数据
    getPlatformData({ isContainJurisdiction: value });
  }, [getPlatformData, levelData?.level, regionCode, reloadData]);

  const isLoading = useLoading(loading);
  const isTableLoading = useLoading(tableLoading);
  useAnchor(isLoading);
  const show = platformData?.total > 0;

  return (
    <>
      {isLoading || isTableLoading ? (
        <div style={{ height: 'calc(100vh - 264px)' }}>
          <SkeletonScreen num={2} firstStyle={{ paddingTop: '23px' }} otherStyle={{ paddingTop: '22px' }} />
        </div>
      ) : null}
      <S.Container
        id="area-economy-platforms-container"
        style={{ opacity: +!(isLoading || isTableLoading), paddingBottom: '4px' }}
      >
        {changeTabError ? (
          // retry函数需要将几个请求都加上
          <Empty type={Empty.LOAD_FAIL} onClick={reloadData} style={{ marginTop: '123px' }} />
        ) : (
          <Container>
            <div className="sticky-top" />
            <div className="screen-wrap custom-area-economy-screen-wrap">
              <Row className="select-wrap">
                <div className="select-right">
                  <HelpText />
                  <MoreBtn linkTo={`${LINK_AREA_FINANCING_PLATFORM}?regionCode=${regionCode}`} />
                </div>
              </Row>
              {show && (
                <div key={hash} className="screen-wrap-second" id="areaEconomyPlatformScreenContainer">
                  {/* 筛选 */}
                  <Filter
                    key={regionCode}
                    isCounty={isCounty(regionCode)}
                    onRadioChange={handleRadioChange}
                    onSeach={handleSearch}
                    levelData={levelData}
                    regionCode={regionCode}
                    onMenuChange={handleMenuChange}
                  />
                  <ExportDoc currentRadio={currentRadio} tableParams={paramsRef.current} total={dataLength} />
                </div>
              )}
            </div>
            <div className="sticky-bottom" style={{ marginBottom: 0 }} />
            <div className={cn('area-economy-table-wrap')}>
              {tableError && ![202, 203, 204, 100].includes(tableError.returncode) ? (
                <Empty type={Empty.MODULE_LOAD_FAIL} onClick={reloadData} />
              ) : show && tableData?.length ? (
                <ChangeScreenStyle>
                  <Spin type="square" spinning={tableLoading && !mainLoading}>
                    {/* 信息卡片 */}
                    {show && tableError?.returncode !== 202 ? <PlatformInfo data={platformData} /> : null}
                    <Table
                      key={tableData.length}
                      onTableChange={handleTableChange}
                      maxData={maxData}
                      count={dataLength}
                      tableData={tableData}
                      currentPage={currentPage}
                      onSortChange={handleSortChange}
                      setCurrentSort={setCurrentSort}
                      currentSort={currentSort}
                      error={error}
                      searchKey={paramsRef.current.likeStr}
                    />
                  </Spin>
                </ChangeScreenStyle>
              ) : (
                <>
                  {(!tableLoading && !show) || tableError?.returncode === 202 ? (
                    <Empty type={Empty.NO_NEW_RELATED_DATA} className="noNewRelatedData" />
                  ) : (
                    !tableLoading && (
                      <Empty
                        type={Empty.NO_DATA_IN_FILTER_CONDITION}
                        className="noNewRelatedData"
                        onClick={resetCondition}
                      />
                    )
                  )}
                </>
              )}
            </div>
          </Container>
        )}
      </S.Container>
    </>
  );
};

const Container = styled.div`
  .custom-area-economy-screen-wrap {
    z-index: 99 !important;
    position: relative;
    top: 0 !important;
    padding-bottom: 0 !important;
  }

  .screen-wrap .select-wrap {
    min-height: 0;
  }

  .select-right {
    height: 0 !important;
    transform: translateY(-28px);
    z-index: 99;
  }

  .custom-area-economy-screen-wrap {
    top: 86px;
  }
`;
