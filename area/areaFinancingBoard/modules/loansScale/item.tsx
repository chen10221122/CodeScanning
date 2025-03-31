import { FC } from 'react';

import styled from 'styled-components';

interface IProps {
  direction: 'row' | 'column';
  data: { mValue: string; unit: string; indicName: string };
  isSlash: boolean;
}

const Item: FC<IProps> = ({ direction, data, isSlash }) => {
  const { mValue, unit, indicName } = data;
  return (
    <ItemWrapper direction={direction} isSlash={isSlash}>
      {direction === 'row' && <span className="item-name">{indicName || '-'}</span>}
      {direction === 'column' && <span className="item-name">{indicName || '-'}</span>}
      <div className="item-info" title={mValue ? `${mValue}亿` : ''}>
        {/* <span className="num">{mValue || '-'}</span> */}
        {mValue || '-'}
        {mValue && <span className="unit">{unit || '-'}</span>}
      </div>
    </ItemWrapper>
  );
};

const ItemWrapper = styled.div<{ direction: 'row' | 'column'; isSlash: boolean }>`
  display: inline-flex;
  flex-direction: ${({ direction }) => direction};
  align-items: ${({ direction }) => (direction === 'row' ? 'center' : 'flex-start')};
  /* flex: ${({ direction }) => (direction === 'column' ? '12.5%' : '20%')}; */
  position: relative;
  &:not(:last-child) {
    margin-right: 16px;
  }
  .item-info {
    width: 100%;
    height: 24px;
    vertical-align: middle;
    display: inline-flex;
    justify-content: flex-start;
    align-items: center;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    line-height: 24px;
    overflow: hidden;
    font-size: 16px;
    font-family: ArialMT;
    font-weight: normal;
    text-align: left;
    color: #141414;
    /* .num {
      height: 24px;
      margin-right: 2px;
      font-size: 16px;
      font-family: ArialMT;
      color: #141414;
      line-height: 24px;
    } */
    .unit {
      height: 18px;
      font-size: 12px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      color: #3c3c3c;
      margin-left: 2px;
      line-height: 18px;
      vertical-align: text-top;
    }
  }
  .item-name {
    height: 18px;
    font-size: 12px;
    font-weight: 300;
    color: #5c5c5c;
    line-height: 18px;
    position: relative;
    margin-left: 6px;
    white-space: nowrap;
    margin-right: ${({ direction }) => (direction === 'row' ? '16px' : 'none')};
    font-family: PingFangSC, PingFangSC-Regular;
    &::before {
      position: absolute;
      top: 7px;
      left: -6px;
      width: 4px;
      height: 4px;
      background: linear-gradient(270deg, #d2eaff, #82b3ff);
      border-radius: 1px;
      content: '';
    }
  }
`;

export default Item;
