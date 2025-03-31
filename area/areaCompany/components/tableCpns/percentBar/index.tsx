import { memo } from 'react';

import styled from 'styled-components';

import { BondFicancialParams } from '@/pages/area/areaCompany/api/regionFinancingApi';
import biggerImg from '@/pages/area/areaCompany/assets/bigger.svg';

const PercentBar = ({ data, handleOpenModal, pageParams }: { data: Record<string, any[]>, handleOpenModal: Function, pageParams: BondFicancialParams }) => {
  // 只显示偿还金额的趋势图
  const amountList = data?.valueList?.filter(d => d?.name?.length !== 10).map(list => {
    return Number(list?.amount || 0);
  });
  const hasValue = amountList.some(d => d);
  const maxValue = Math.max(...amountList);

  return (<Content>
    {amountList?.length ? (
      <>
        <div className='bar-wrap'>
          {amountList.map(val => (
            <span className='bar-item' style={{ height: `${val / maxValue * 100}%` }}></span>
          ))}
        </div>
        {hasValue ? <img src={biggerImg} alt="放大" className='big-img' onClick={() => handleOpenModal('trend', data, pageParams)} /> : null}
      </>
    ) : '-'}
  </Content>)
}
export default memo(PercentBar);

const Content = styled.div`
  width: calc(100% + 24px);
  height: calc(100% + 12px);
  margin-left: -12px;
  display: flex;
  justify-content: center;
  position: relative;
  &:hover {
    .big-img {
      visibility: visible;
    }
  }
  .bar-wrap {
    height: 22px;
    display: flex;
    align-items: flex-end;
    position: absolute;
    bottom: 0px;
    .bar-item {
      width: 9px;
      margin-right: 5px;
      background-color: #3986fe;
      border-radius: 2px 2px 0px 0px;
      &:last-child {
        margin-right: 0px;
      }
    }
  }
  .big-img {
    width: 13px;
    height: 13px;
    position: absolute;
    top: 3px;
    right: 3px;
    cursor: pointer;
    visibility: hidden;
  }
`;
