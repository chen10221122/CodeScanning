import { memo } from 'react';
import { useSelector } from 'react-redux';

import styled from 'styled-components';

import { useCtx, LIMIT_SELECT } from '@/pages/area/areaCompareAdvance/context';

const BottomBar = () => {
  const havePay = useSelector((store: any) => store.user.info).havePay;

  const {
    state: { areaInfo, indexIds, indicatorLen },
  } = useCtx();

  return (
    <BottomWrap>
      <div className="selected-indicators">
        已选指标：
        <span>
          {indexIds?.length || 0}/{indicatorLen}
        </span>
      </div>
      <div className="selected-area">
        已选地区：
        <span>
          {areaInfo?.length || 0}/{havePay ? LIMIT_SELECT.VIP : LIMIT_SELECT.NORMAL}
        </span>
      </div>
    </BottomWrap>
  );
};

export default memo(BottomBar);

const BottomWrap = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
  position: absolute;
  bottom: 0;
  left: -8px;
  width: calc(100% + 16px);
  height: 26px;
  padding-right: 16px;
  background: #f8faff;
  border: 1px solid #e8ecf4;
  z-index: 1;

  .selected-area,
  .selected-indicators {
    font-size: 12px;
    color: #5c5c5c;
  }

  .selected-indicators {
    position: relative;
    margin-right: 16px;
    &::after {
      content: '';
      position: absolute;
      top: 3px;
      right: -9px;
      width: 1px;
      height: 11px;
      background-color: #bfbfbf;
    }
  }
`;
