import { memo, useCallback, useEffect, useState } from 'react';

import styled from 'styled-components';

import { getAreaLevel } from '@/apis/area/areaEconomy';
import { Empty, Spin } from '@/components/antd';
import SkeletonScreen from '@/components/skeletonScreen';
import { AREA_IS_CHANGE_STATUS } from '@/configs/localstorage';
import { isCounty } from '@/pages/area/areaEconomy/common/index';
import { useCtx } from '@/pages/area/areaEconomy/provider/getContext';
import useAnchor from '@/pages/detail/hooks/useAnchor';
import useLoading from '@/pages/detail/hooks/useLoading';
import useRequest from '@/utils/ahooks/useRequest';

import useChangeTabError from '../../useChangeTabError';
import Filter from './components/Filter';
import SpecialDebtProjects from './components/specialDebtProjects';
import useSpecialDebtProjects from './components/specialDebtProjects/useSpecialDebtProjects';
import SpecificItems from './components/specificItems';
import useSpecificItems from './components/specificItems/useSpecificItems';

const LocalDept = () => {
  const {
    // @ts-ignore 忽略selectedYear的类型
    state: { code, selectedYear },
  } = useCtx();
  // 添加一个切换的状态
  const [searchType, setSearchType] = useState('screenType');
  // 筛选项状态
  const [hash, setHash] = useState(0);
  const { pending: specialDebtLoading, resetChange, ...specialDebtProps } = useSpecialDebtProjects({ setSearchType });
  const {
    pending: itemLoading,
    condition: itemCondition,
    ...itemProps
  } = useSpecificItems({ specialDebtLoading, setSearchType });
  const { error: specialDebtError, execute: specialDebtExecute } = specialDebtProps;
  const { execute: itemExecute } = itemProps;

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

  // 模块内筛选滚动条隐藏，筛选完成回到顶部
  useEffect(() => {
    const container = document.getElementById('area_economy_container');
    if (container) {
      container.style.overflow = specialDebtLoading ? 'hidden' : '';
    }
  }, [specialDebtLoading]);

  // 判断是否是进入tab页的第一次错误
  const changeTabError = useChangeTabError([specialDebtError]);
  // 判断是否两个请求都没有数据
  const isEmpty = !specialDebtProps.tableData?.length && !itemProps.tableData?.length;

  const retryGetData = useCallback(() => {
    itemExecute({
      regionCode: code,
      year: selectedYear === '-' ? '' : selectedYear,
      skip: 0,
      pagesize: 50,
      isQueryThisLevel: isCounty(code) ? '1' : '2',
    });
    specialDebtExecute({
      regionCode: code,
      year: '',
      executiveLevel: isCounty(code) ? '3' : '',
    });
  }, [itemExecute, specialDebtExecute, code, selectedYear]);

  // 清除筛选项
  const clearCondition = useCallback(() => {
    // 清除筛选项
    setHash(Math.random());
    // 重置请求筛选
    resetChange();
  }, [resetChange]);

  if (isLoading && sessionStorage.getItem(AREA_IS_CHANGE_STATUS) !== '1') {
    return (
      <div style={{ height: 'calc(100vh - 264px)' }}>
        <SkeletonScreen num={2} firstStyle={{ paddingTop: '23px' }} otherStyle={{ paddingTop: '22px' }} />
      </div>
    );
  }

  return (
    <>
      {changeTabError ? (
        <Empty type={Empty.LOAD_FAIL} onClick={retryGetData} style={{ marginTop: '123px' }} />
      ) : (
        <>
          {/* 如果 selectedYear 为 - 或 不存在 ，表示当前选择下，都没有数据 */}
          {(selectedYear === '-' || !selectedYear) && isEmpty && !specialDebtLoading && !itemLoading ? (
            <Empty type={Empty.NO_NEW_RELATED_DATA} className="noNewRelatedData" />
          ) : (
            <Container>
              <Filter
                itemCondition={itemCondition}
                loading={specialDebtLoading}
                levelData={levelData}
                hash={hash}
                {...specialDebtProps}
              />

              {/* 全局的loading判断，如果是 切换筛选项，那么就展示 全局的loading， 如果只是改变项目明细的页数，就展示 项目明细的loading */}
              {selectedYear && selectedYear !== '-' && isEmpty ? (
                <Empty type={Empty.NO_DATA_IN_FILTER_CONDITION} className="noNewRelatedData" onClick={clearCondition} />
              ) : (
                <Spin
                  wrapperClassName="container-loading"
                  type="square"
                  spinning={(specialDebtLoading || itemLoading) && searchType === 'screenType'}
                >
                  <SpecialDebtProjects title="项目类别统计" loading={specialDebtLoading} {...specialDebtProps} />
                  <div style={{ height: '6px', background: '#fafbfc', margin: '0 -20px' }} />

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
      )}
    </>
  );
};

export default memo(LocalDept);

const Container = styled.div`
  .container-loading > div > .ant-spin .ant-spin-dot {
    top: 25%;
  }
`;
