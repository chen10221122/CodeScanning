import React from 'react';

import styled from 'styled-components';

const Summary = ({ data }) => {
  return (
    <SummaryWrapper>
      <Card>
        <div className="title">违约家数</div>
        <div className="content">
          <div className="nums">{data.orgCount || 0}</div>
          <div className="unit">家</div>
        </div>
      </Card>
      <Card>
        <div className="title">违约只数</div>
        <div className="content">
          <div className="nums">{data.defaultCount || 0}</div>
          <div className="unit">只</div>
        </div>
      </Card>
      <Card>
        <div className="title">违约金额</div>
        <div className="content">
          <div className="nums">{data.defaultAmount || 0}</div>
          <div className="unit">亿</div>
        </div>
      </Card>
      <Card>
        <div className="title">已偿还</div>
        <div className="content">
          <div className="nums">{data.repayAmount || 0}</div>
          <div className="unit">亿</div>
        </div>
      </Card>
    </SummaryWrapper>
  );
};

export default React.memo(Summary);

const SummaryWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  background: #ffffff;
  padding-top: 16px;
  padding-bottom: 4px;
`;

const Card = styled.div`
  flex: 1;
  height: 100px;
  background: #ffffff;
  border-radius: 3px;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.06);
  padding: 16px 0 0 24px;
  position: relative;
  &:not(:last-child) {
    margin-right: 16px;
  }
  &:nth-child(1) {
    background: url(${require('@/assets/images/default/ico_one.png')}) no-repeat;
    background-size: 100%;
  }
  &:nth-child(2) {
    background: url(${require('@/assets/images/default/ico_two.png')}) no-repeat;
    background-size: 100%;
  }
  &:nth-child(3) {
    background: url(${require('@/assets/images/default/ico_three.png')}) no-repeat;
    background-size: 100%;
  }
  &:nth-child(4) {
    background: url(${require('@/assets/images/default/ico_four.png')}) no-repeat;
    background-size: 100%;
  }
  .title {
    font-size: 14px;
    color: #262626;
    line-height: 18px;
  }
  .content {
    display: flex;
    align-items: flex-end;
    margin-top: 4px;
    .nums {
      font-size: 24px;
      font-weight: 500;
      color: #ff7500;
      line-height: 24px;
    }
    .unit {
      font-size: 14px;
      line-height: 18px;
      color: #666666;
      align-self: flex-end;
      margin-left: 4px;
    }
  }
`;
