import { memo, useCallback, useEffect, useMemo, useState } from 'react';

import styled from 'styled-components';

import { WrapperContainer } from '@pages/area/areaF9/components';
import { useParams } from '@pages/area/areaF9/hooks';

import { getAreaLevel } from '@/apis/area/areaEconomy';
import { Empty, Spin } from '@/components/antd';
import useAnchor from '@/pages/detail/hooks/useAnchor';
import useLoading from '@/pages/detail/hooks/useLoading';
import useRequest from '@/utils/ahooks/useRequest';

// import { isCounty } from '../../utils';
import Filter from './components/Filter';
import SpecialDebtProjects from './components/specialDebtProjects';
import useSpecialDebtProjects from './components/specialDebtProjects/useSpecialDebtProjects';
import SpecificItems from './components/specificItems';
import useSpecificItems from './components/specificItems/useSpecificItems';

const LocalDept = () => {
  const { code } = useParams();

  const [selectedYear, setSelectedYear] = useState();

  // 添加一个切换的状态
  const [searchType, setSearchType] = useState('screenType');
  // 筛选项状态
  const [hash, setHash] = useState(0);
  const {
    pending: specialDebtLoading,
    resetChange,
    isSelfs,
    ...specialDebtProps
  } = useSpecialDebtProjects({ setSearchType, setSelectedYear });
  const {
    pending: itemLoading,
    condition: itemCondition,
    ...itemProps
  } = useSpecificItems({ specialDebtLoading, setSearchType, setSelectedYear, selectedYear, isSelfs });
  // const { error: specialDebtError, execute: specialDebtExecute } = specialDebtProps;
  // const { execute: itemExecute } = itemProps;

  const isFiristLoading = useLoading((specialDebtLoading as boolean) || (itemLoading as boolean));

  // 获取地区等级 9999900067
  const { data: levelData, run: getAreaLevelData } = useRequest(getAreaLevel, {
    manual: true,
    formatResult(data: any) {
      return data?.data;
    },
  });

  // 切换地区，重新获取地区等级
  useEffect(() => {
    // 获取地区等级
    getAreaLevelData({ regionCode: code });
  }, [code, getAreaLevelData]);

  const isLoading = useLoading(itemLoading as boolean);
  useAnchor(isLoading);

  const isSpecificItemLoading = useLoading(itemLoading as boolean);

  // 判断是否两个请求都没有数据
  const isEmpty = !specialDebtProps.tableData?.length && !itemProps.tableData?.length;

  // const retryGetData = useCallback(() => {
  //   itemExecute({
  //     regionCode: code,
  //     year: selectedYear === '-' ? '' : selectedYear,
  //     skip: 0,
  //     pagesize: 50,
  //     isQueryThisLevel: isCounty(code) ? '1' : '2'
  //   });
  //   specialDebtExecute({
  //     regionCode: code,
  //     year: '',
  //     executiveLevel: isCounty(code) ? '3' : ''
  //   });
  // }, [itemExecute, specialDebtExecute, code, selectedYear]);

  // 清除筛选项
  const clearCondition = useCallback(() => {
    // 清除筛选项
    setHash(Math.random());
    // 重置请求筛选
    resetChange();
  }, [resetChange]);

  const loading = (specialDebtLoading || itemLoading) && searchType === 'screenType';

  useEffect(() => {
    const scrollYContainer = document.querySelector('.main-container') as HTMLDivElement;
    if (scrollYContainer) {
      scrollYContainer.style.overflowY = loading ? 'hidden' : 'overlay';
    }
  }, [loading]);

  const Content = useMemo(() => {
    return (
      <>
        {/* 如果 selectedYear 为 - 或 不存在 ，表示当前选择下，都没有数据 */}
        {(selectedYear === '-' || !selectedYear) && isEmpty && !specialDebtLoading && !itemLoading ? (
          <Empty type={Empty.NO_NEW_RELATED_DATA} className="new-no-data" />
        ) : (
          <Container>
            {/* 全局的loading判断，如果是 切换筛选项，那么就展示 全局的loading， 如果只是改变项目明细的页数，就展示 项目明细的loading */}
            {selectedYear && selectedYear !== '-' && isEmpty ? (
              <Empty type={Empty.NO_DATA_IN_FILTER_CONDITION} className="noNewRelatedData" onClick={clearCondition} />
            ) : (
              <Spin wrapperClassName="container-loading" type="square" spinning={loading}>
                <SpecialDebtProjects title="项目类别统计" loading={specialDebtLoading} {...specialDebtProps} />
                <SpecificItems
                  title="项目明细"
                  isSpecificItemLoading={isSpecificItemLoading}
                  loading={itemLoading}
                  searchType={searchType}
                  condition={itemCondition}
                  {...itemProps}
                />
              </Spin>
            )}
          </Container>
        )}
      </>
    );
  }, [
    clearCondition,
    isEmpty,
    isSpecificItemLoading,
    itemCondition,
    itemLoading,
    itemProps,
    loading,
    searchType,
    selectedYear,
    specialDebtLoading,
    specialDebtProps,
  ]);

  return (
    <WrapperContainer
      error={specialDebtProps?.error || itemProps?.error}
      loading={isFiristLoading}
      content={Content}
      containerStyle={{
        minWidth: '930px',
      }}
      topIsSticky={false}
      headerRightContent={
        <Filter
          itemCondition={itemCondition}
          loading={specialDebtLoading}
          levelData={levelData}
          hash={hash}
          {...specialDebtProps}
        />
      }
    ></WrapperContainer>
  );
};

export default memo(LocalDept);

const Container = styled.div`
  .container-loading > div > .ant-spin .ant-spin-dot {
    top: 25vh;
  }
  .module-empty {
    margin-bottom: 28px;
  }
`;
