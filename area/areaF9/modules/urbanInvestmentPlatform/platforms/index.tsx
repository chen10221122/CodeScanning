import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useSize } from 'ahooks';
import cn from 'classnames';
import styled from 'styled-components';

import { WrapperContainer } from '@pages/area/areaF9/components';
import { useParams } from '@pages/area/areaF9/hooks';

import { getAreaLevel } from '@/apis/area/areaEconomy';
import { getCityInvestPlatformStatistics } from '@/apis/area/platforms';
import { Empty, Spin } from '@/components/antd';
import { LINK_AREA_FINANCING_PLATFORM } from '@/configs/routerMap';
import MoreBtn from '@/pages/area/areaEconomy/components/traceBtn/moreBtn';
import * as S from '@/pages/area/areaEconomy/style';
import { ChangeScreenStyle } from '@/pages/area/areaF9/style';
import { getAreaChildCodes, isCounty } from '@/pages/area/areaF9/utils';
import CityAddToBrowser from '@/pages/bond/areaFinancingPlatform/components/CityAddToBrowser';
import useGetInit1wData from '@/pages/bond/areaFinancingPlatform/components/CityAddToBrowser/useGetInit1wData';
import { transferSelectedRowToList } from '@/pages/bond/areaFinancingPlatform/components/filter';
import useTableData, { InitParams } from '@/pages/bond/areaFinancingPlatform/useFinancingPlateform';
import useAnchor from '@/pages/detail/hooks/useAnchor';
import useLoading from '@/pages/detail/hooks/useLoading';
import useRequest from '@/utils/ahooks/useRequest';

import ExportDoc from './components/export';
import Filter from './components/filter';
import HelpText from './components/helpText';
import PlatformInfo from './components/platformInfo';
import Table from './components/table';
import { CONTAINS, DEFAULT_INDEXES, DEFAULT_INDEXES_COUNT, PAGE_SIZE, SELFS } from './platforms';

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
  const { regionCode } = useParams();

  const paramsRef = useRef<InitParams>(defaultParams);
  const filterWrapper = useRef<HTMLDivElement>(null);
  const { height: filterHeight } = useSize(filterWrapper) || {};
  const [tableData, setTableData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  // 创建一个新的参数 表示单签选中的 是 含下属辖区 还是 本级
  const [currentRadio, setCurrentRadio] = useState(isCounty(regionCode) ? SELFS : CONTAINS);
  // 自选组合参数
  const [combinationKey, setCombinationKey] = useState<{ subId?: string }>({});
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
    // error: infoError,
  } = useRequest(getCityInvestPlatformStatistics, requestConfig);
  // 获取地区等级 9999900067
  const { data: levelData, run: getAreaLevelData } = useRequest(getAreaLevel, requestConfig);

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
    paramsRef.current = getInitParams(regionCode!);
    // 获取地区等级
    getAreaLevelData({ regionCode });
    reloadData();
    // 获取平台数据
    getPlatformData({ isContainJurisdiction: isCounty(regionCode) ? SELFS : CONTAINS });
  }, [regionCode, reloadData, getAreaLevelData, getPlatformData]);

  useEffect(() => {
    setTableData(data);
  }, [data, dataLength]);
  // 自选组合切换
  useEffect(() => {
    paramsRef.current.subId = combinationKey.subId ? combinationKey.subId : '';
    setTimeout(reloadData, 300);
  }, [combinationKey, reloadData]);
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
  const { get1wTableData, addToBrowserLoading } = useGetInit1wData();
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

  // 模块内筛选滚动条隐藏，筛选完成回到顶部
  useEffect(() => {
    const wrap = document.querySelector('.main-container') as Element;
    if (tableLoading && wrap) {
      wrap.scrollTop = 0;
    }
  }, [tableLoading]);
  const handleAddToBrowser = () => {
    const browserData1wParams = {
      ...paramsRef.current,
      indexes: 'ITName,ITCode2',
      from: 0,
      size: 10000,
      isBrowser: true,
    };
    get1wTableData(browserData1wParams);
  };
  // 筛选项变动
  const handleMenuChange = useCallback(
    (currentSelected, allSlectedList) => {
      const data = transferSelectedRowToList(allSlectedList).reduce((obj: any, item: any) => {
        return {
          ...obj,
          [item.projectValue]: obj[item.projectValue] ? obj[item.projectValue] + ',' + item.value : item.value,
        };
      }, {});
      const { regionCode, sortKey, sortRule, likeStr, subId } = paramsRef.current;
      paramsRef.current = { regionCode, sortKey, sortRule, likeStr, subId, ...data };
      setTimeout(reloadData, 300);
    },
    [reloadData],
  );

  const handleRadioChange = useCallback(
    (e) => {
      const { value } = e.target;
      paramsRef.current.regionCode =
        value === SELFS ? regionCode : regionCode + ',' + getAreaChildCodes(regionCode!, levelData?.level);
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
      regionCode: value === SELFS ? regionCode : regionCode + ',' + getAreaChildCodes(regionCode!, levelData?.level),
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
  const isPagination = dataLength > PAGE_SIZE;
  const Content = useMemo(() => {
    return (
      <PlatformsContainer>
        <S.Container
          id="area-economy-platforms-container"
          style={{ opacity: +!(isLoading || isTableLoading), paddingBottom: isPagination ? '4px' : '20px' }}
        >
          <div>
            <div className={cn('area-economy-table-wrap')}>
              {tableError ? (
                <Empty type={Empty.NO_NEW_RELATED_DATA} className="new-no-data" onClick={reloadData} />
              ) : show && tableData?.length ? (
                <ChangeScreenStyle>
                  <Spin type="square" spinning={tableLoading}>
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
                      filterHeight={filterHeight ? filterHeight + 4 : 4}
                      searchKey={paramsRef.current.likeStr}
                    />
                  </Spin>
                </ChangeScreenStyle>
              ) : (
                <>
                  {(!tableLoading && !show) || tableError?.returncode === 202 ? (
                    <Empty type={Empty.NO_NEW_RELATED_DATA} className="new-no-data" />
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
          </div>
        </S.Container>
      </PlatformsContainer>
    );
  }, [
    currentPage,
    currentSort,
    dataLength,
    error,
    handleSortChange,
    handleTableChange,
    isLoading,
    isTableLoading,
    maxData,
    platformData,
    reloadData,
    resetCondition,
    show,
    tableData,
    tableError,
    tableLoading,
    isPagination,
    filterHeight,
  ]);
  return (
    <WrapperContainer
      loadingHideContent={true}
      loading={isLoading || isTableLoading}
      content={Content}
      containerStyle={{
        minWidth: '930px',
      }}
      headerRightContent={
        <>
          <HelpText />
          <MoreBtn linkTo={`${LINK_AREA_FINANCING_PLATFORM}?regionCode=${regionCode}`} />
        </>
      }
      headerBottomContent={
        <FilterContainer className="screen-wrap custom-area-economy-screen-wrap">
          {show && (
            <div key={hash} className="screen-wrap-second" id="areaEconomyPlatformScreenContainer">
              {/* 筛选 */}
              <div ref={filterWrapper}>
                <Filter
                  key={regionCode}
                  isCounty={isCounty(regionCode)}
                  onRadioChange={handleRadioChange}
                  onSeach={handleSearch}
                  levelData={levelData}
                  regionCode={regionCode}
                  onMenuChange={handleMenuChange}
                  onCombinationChange={setCombinationKey}
                />
              </div>
              <div className="filter-right">
                <CityAddToBrowser
                  addToBrowserLoading={addToBrowserLoading}
                  tableDataIsEmpty={tableData.length === 0}
                  handleAddToBrowser={() => {
                    handleAddToBrowser();
                  }}
                ></CityAddToBrowser>
                <ExportDoc currentRadio={currentRadio} tableParams={paramsRef.current} total={dataLength} />
              </div>
            </div>
          )}
        </FilterContainer>
      }
    ></WrapperContainer>
  );
};

const PlatformsContainer = styled.div`
  .count-list {
    margin-bottom: 8px !important;

    .count-list-item {
      min-width: 172px;
    }
  }

  #areaFinancingPlatformTableDom {
    > div:nth-child(2) {
      height: 0 !important;
    }
  }
`;
const FilterContainer = styled.div`
  z-index: 99 !important;
  position: relative;
  top: 0 !important;
  padding-bottom: 0 !important;
  margin-top: 4px;

  .select-right {
    height: 0 !important;
    transform: translateY(-28px);
    z-index: 99;
  }

  .custom-area-economy-screen-wrap {
    top: 86px;
  }
  .screen-wrap-second {
    display: flex;
    justify-content: space-between;
    color: #5c5c5c;
    .screen-left-wrap {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      flex: 1;
      line-height: 28px;
      flex-shrink: 0;
      .area-scree-con {
        margin-right: 24px;
      }
      .ant-radio-group {
        .ant-radio-checked::after {
          display: none;
        }
      }
      .combination-select-wrapper {
        display: inline-block;
        margin-right: 13px;
      }
      .search {
        min-width: 175px;
        display: inline-block;
        .topicSearch-wrapper {
          height: 28px;
          line-height: 28px;
        }
      }
    }
    .filter-right {
      display: flex;
      align-items: center;
      flex-shrink: 0;
      height: 28px;
      flex-wrap: nowrap;
      flex-shrink: 0;
      margin-left: 40px;
    }

    // 修改antd自带的样式
    .ant-radio-group {
      margin-right: 8px;

      .ant-radio-wrapper {
        margin-right: 16px;
        font-size: 13px;

        .ant-radio {
          & ~ span {
            padding: 0;
          }

          padding-right: 6px;
          /* top: 0.1em; */
          top: 1px;

          .ant-radio-inner {
            width: 12px;
            height: 12px;

            &::after {
              width: 12px;
              height: 12px;
              margin-top: -6px;
              margin-left: -6px;
              background-color: #fff;
            }
          }
        }

        &.ant-radio-wrapper-checked {
          color: #0171f6 !important;

          .ant-radio-checked {
            .ant-radio-inner {
              padding: 2px;
              background-color: #0171f6;
            }
          }
        }
      }
    }
  }
`;
