import { useMemo } from 'react';

import { isArray } from 'lodash';
import styled from 'styled-components';

import { formatNumber } from '@/utils/format';

import { formatIndic } from './config';
interface Iprops {
  regionName: string;
  indicYear?: string;
  data: any[];
}

const renderColumnsItem = (list: any, nopdd: boolean) => {
  return (
    <ColumnsItem nopdd={nopdd}>
      {isArray(list) &&
        list?.map((item: any) => (
          <div className="indic-item">
            <div className="top">
              <div className="value">{formatNumber(item?.value || '') || '-'}</div>
              <div className="unit">{item?.unit || ''}</div>
            </div>
            <div className="name" title={item?.indicName || ''}>
              {item?.indicName || ''}
            </div>
          </div>
        ))}
    </ColumnsItem>
  );
};

const MainIndic = ({ regionName, data, indicYear }: Iprops) => {
  const finalData = useMemo(() => formatIndic(data, indicYear), [data, indicYear]);
  return (
    <MainIndicWrapper>
      <div className="area-main-indic-title">{regionName || ''}主要指标</div>
      <div className="area-indic">{finalData?.map((item: any[], idx: number) => renderColumnsItem(item, !idx))}</div>
    </MainIndicWrapper>
  );
};

export default MainIndic;

const MainIndicWrapper = styled.div`
  position: relative;
  &::after {
    content: '';
    display: block;
    position: absolute;
    top: -4px;
    right: -19px;
    width: 65px;
    height: 52px;
    background: url(${require('../../../assets/indic-bg.png')}) no-repeat #fff;
    background-size: 100% auto;
    background-color: transparent;
  }
  .area-indic {
    display: flex;
    padding-left: 10px;
  }
  .area-main-indic-title {
    position: relative;
    width: auto;
    font-size: 14px;
    font-weight: 400;
    color: #141414;
    line-height: 23px;
    margin-bottom: 11px;
    padding-left: 8px;
    &::before {
      content: '';
      display: inline-block;
      position: absolute;
      left: 0;
      top: 4px;
      width: 2px;
      height: 14px;
      background: #ff9347;
      border-radius: 2px;
    }
  }
`;

const ColumnsItem = styled.div<{ nopdd: boolean }>`
  flex: 1;
  padding-left: ${({ nopdd }) => (nopdd ? 0 : 9)}px;
  padding-bottom: 20px;
  .indic-item {
    padding: 9px 0;
    .top {
      display: flex;
      align-items: center;
    }
    .unit {
      display: inline-block;
      width: auto;
      height: 12px;
      font-size: 10px;
      font-weight: 400;
      text-align: left;
      color: #5c5c5c;
      line-height: 12px;
      white-space: nowrap;
    }
    .value {
      width: auto;
      height: 18px;
      font-size: 14px;
      font-weight: 400;
      text-align: left;
      color: #141414;
      line-height: 18px;
      white-space: nowrap;
    }
    .name {
      overflow: hidden;
      width: 148px;
      height: 14px;
      margin-top: 4px;
      /* margin-bottom: 10px; */
      font-size: 11px;
      font-weight: 400;
      text-align: left;
      color: #8c8c8c;
      line-height: 14px;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
`;
