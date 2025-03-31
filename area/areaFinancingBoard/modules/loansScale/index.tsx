import { useMemo } from 'react';

import styled from 'styled-components';

import { withLazyLoad } from '@pages/detail/common/components';

import { Spin } from '@/components/antd';
import Screen from '@/components/screen/screen';
import ModuleTitle from '@/pages/area/areaFinancingBoard/components/moduleTitle';
import { Wrapper } from '@/pages/area/areaFinancingBoard/components/moduleWrapper/styles';

import Item from './item';
import useLogic from './useLogic';

const PROVINCE_MODULE_HEIGHT = 90;
const REGION_MUDULE_HEIGHT = 63;
const WRAPPER_ID = 'areaFinancingBoard-loansScale';

//银行业存贷款规模
const LoansScale = () => {
  const { loading, isProvince, onChange, options, tableData } = useLogic();

  const headerRight = useMemo(() => {
    return (
      <Screen
        options={options}
        onChange={onChange}
        getPopContainer={() => document.getElementById(WRAPPER_ID) || document.body}
      />
    );
  }, [onChange, options]);

  return (
    <Wrapper height={isProvince ? PROVINCE_MODULE_HEIGHT : REGION_MUDULE_HEIGHT} id={WRAPPER_ID} backgroundImg>
      <ModuleTitle
        title="银行业存贷款规模"
        rightComp={headerRight}
        style={{ paddingBottom: isProvince ? '8px' : '5px' }}
      />
      <Spin type="square" spinning={loading}>
        {tableData.length > 0 ? (
          <Content isProvince={isProvince}>
            {tableData.map((item: any, index: number) => (
              <Item
                key={index}
                direction={isProvince ? 'column' : 'row'}
                data={item}
                isSlash={index !== tableData.length - 1}
              />
            ))}
          </Content>
        ) : (
          <Empty margin={isProvince ? '5px 0 0 2px' : '0 0 0 2px'}>暂无相关数据</Empty>
        )}
      </Spin>
    </Wrapper>
  );
};

export default withLazyLoad(LoansScale, 90);

const Content = styled.div<{ isProvince: boolean }>`
  display: flex;
  /* justify-content: space-between; */
  margin-left: 2px;
  > div:last-child {
    flex-basis: ${({ isProvince }) => (isProvince ? '6%' : 'unset')};
  }
  > div {
    width: ${({ isProvince }) => (isProvince ? 'calc(100% / 7)' : 'calc(100% / 4)')};
  }
`;

const Empty = styled.div<{ margin: string }>`
  margin: ${({ margin }) => margin || '0 0 0 5px'};
  height: 18px;
  font-size: 12px;
  color: #8c8c8c;
  line-height: 18px;
`;
