import { ComponentType, memo, useEffect, useMemo, useRef } from 'react';

import styled from 'styled-components';

import tableConfig from '../config/tableConfig';
import { TabsMap } from '../config/tabsConfig';

interface IProps {
  requestParams: any;
  currTabkey: string;
  setCount: (count: number) => void;
  filterConditionRef?: any;
}

const Table = ({ requestParams, currTabkey, setCount, filterConditionRef }: IProps) => {
  const TableRef = useRef<ComponentType<any>>(tableConfig[currTabkey]);
  const params = useMemo(() => {
    let data: any = { ...requestParams };
    // 基金请求参数需要特殊处理
    if (TabsMap.JJ === currTabkey) {
      data.intelligentSort = data.intelligentSort ?? 'FD0016_006';
      if (data.areas) {
        data.regionCode = data.areas;
      }
    } else {
      data.companyType = currTabkey;
    }
    return data;
  }, [requestParams, currTabkey]);
  useEffect(() => {
    TableRef.current = tableConfig[currTabkey];
  }, [currTabkey]);
  const resField = useMemo(() => ['list', 'totalCount'], []);
  const scroll = useMemo(() => ({ x: 891 }), []);
  const TableComponent = useMemo(() => TableRef.current, []);

  return (
    <Wrap>
      <TableComponent
        key={currTabkey}
        params={params}
        type={currTabkey}
        scroll={scroll}
        pageSize={requestParams.pagesize}
        getCount={setCount}
        resField={resField}
        conditionHeight={'100'}
        filterConditionRef={filterConditionRef}
        tabTitle={''} // 自定义title,默认为空
        sticky={{
          offsetHeader: 37,
          getContainer: () => document.querySelector('.main-container') || window,
        }}
      />
    </Wrap>
  );
};

export default memo(Table);

const Wrap = styled.div`
  background: #fff;
  width: 100%;
  .ant-table .ant-table-sticky-scroll {
    opacity: 1;
    background: #fbfbfb;
    border-top: none;
    .ant-table-sticky-scroll-bar,
    .ant-table-sticky-scroll-bar-active {
      opacity: 0.6;
    }
    @media (max-width: 1279px) {
      &::before {
        content: '';
        pointer-events: none;
        position: absolute;
        z-index: 0;
        bottom: -12px;
        width: 100%;
        height: 24px;
        background: linear-gradient(
          to top,
          rgba(255, 255, 255, 1) 50%,
          rgba(255, 255, 255, 0.3) 60%,
          rgba(255, 255, 255, 0) 100%
        );
      }
    }
  }

  .condition {
    background: #fff;
    .full-title {
      line-height: 52px;
      font-size: 16px;
      font-style: normal;
      color: #333;
      background: #fff;
      height: 52px;
      margin: 0;
      padding-left: 20px;
      border-bottom: 1px solid #f7f7f7;
      position: relative;
    }
  }
`;
