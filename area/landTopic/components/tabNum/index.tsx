import { memo } from 'react';

import styled from 'styled-components';

import { divisionNumber } from '@/utils/format';

const TabNum = ({ total, landTotal }: { total: number; landTotal: number }) => {
  return (
    <CountWrap>
      共&nbsp;<span className="count">{divisionNumber(total)}</span>&nbsp;条，成交土地&nbsp;
      <span className="count">{divisionNumber(landTotal)}</span>&nbsp;条
    </CountWrap>
  );
};

export default memo(TabNum);

const CountWrap = styled.div`
  font-size: 13px;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  text-align: right;
  color: #3c3c3c;
  line-height: 20px;
  .count {
    color: #ff7500;
  }
`;
