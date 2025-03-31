import { memo } from 'react';

import styled from 'styled-components';

const DataBanner = ({
  data: { creditLineTotal, creditLineUsed, creditLineNotUsed },
}: {
  data: { creditLineTotal: string; creditLineUsed: string; creditLineNotUsed: string };
}) => {
  return (
    <Wrapper>
      <div className="item">
        <div className="title">授信总额度</div>
        <div className="num">{creditLineTotal}</div>
        <div className="unit">亿元</div>
      </div>
      <div className="item">
        <div className="title">已使用总额度</div>
        <div className="num">{creditLineUsed}</div>
        <div className="unit">亿元</div>
      </div>
      <div className="item">
        <div className="title">未使用总额度</div>
        <div className="num">{creditLineNotUsed}</div>
        <div className="unit">亿元</div>
      </div>
    </Wrapper>
  );
};

export default memo(DataBanner);

const Wrapper = styled.div`
  height: 40px;
  background: #f8faff;
  border-radius: 2px;
  margin-bottom: 8px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  .item {
    display: flex;
    font-weight: 500;
    align-items: center;
    .title {
      font-size: 12px;
      color: #5c5c5c;
    }
    .num {
      font-size: 18px;
      color: #ff7500;
      margin: 0 2px 0 12px;
    }
    .unit {
      color: #434343;
      font-size: 12px;
    }
  }
`;
