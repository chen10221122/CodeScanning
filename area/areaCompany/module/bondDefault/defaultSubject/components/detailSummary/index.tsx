import { memo, useMemo } from 'react';

import styled from 'styled-components';

type TProps = {
  offShore: boolean;
  data?: any;
};

/** 弹窗内概览信息 境内境外模块共用 */
const DetailSummary = ({ offShore, data }: TProps) => {
  const renderConf = useMemo(() => {
    if (offShore) {
      return [
        { title: '违约只数:', nums: data?.defaultNumberCount ? data.defaultNumberCount : '-', unit: '只' },
        { title: '违约金额:', nums: data?.defaultAmountCount ? data.defaultAmountCount : '-', unit: '亿美元' },
      ];
    } else {
      return [
        { title: '违约只数:', nums: data?.count ?? 0, unit: '只' },
        { title: '违约金额:', nums: data?.defaultAmount ?? 0, unit: '亿' },
        { title: '已偿还:', nums: data?.repayAmount ?? 0, unit: '亿' },
        { title: '偿还进度:', nums: data?.repayProgress ?? 0, unit: '%' },
      ];
    }
  }, [offShore, data]);

  return (
    <Container>
      <Wapper offShore={offShore}>
        {renderConf.map((i, idx) => {
          return (
            <div className="item" key={idx}>
              <span className="text">{i.title}</span>
              <span className={`text count ${i.nums === '-' ? 'emptyColor' : ''}`}>{i.nums}</span>
              <span className="text unit-text">{i.nums === '-' ? '' : i.unit}</span>
            </div>
          );
        })}
      </Wapper>
    </Container>
  );
};

export default memo(DetailSummary);

const Container = styled.div`
  margin-bottom: 8px;
  margin-right: 16px;
`;

const Wapper = styled.div<{ offShore: boolean }>`
  width: 100%;
  height: 40px;
  background: #f8faff;
  /* box-shadow: 0px 2px 9px 2px rgba(0, 0, 0, 0.09); */
  display: flex;
  flex-wrap: nowrap;
  .item {
    width: calc(100% / ${({ offShore }) => (offShore ? 2 : 4)});
    padding: 10px 0 10px 16px;
    .text {
      font-size: 14px;
      font-weight: 400;
      color: #434343;
      line-height: 21px;
      text-shadow: 0px 2px 9px 2px rgba(0, 0, 0, 0.09);
    }
    .count {
      color: #fe3a2f;
      margin-left: 8px;
    }
    .emptyColor {
      color: #434343;
    }
    .unit-text {
      color: #111111;
    }
    &:not(:first-child)::before {
      content: '';
      display: inline-block;
      width: 1px;
      height: 16px;
      background-color: #e3e9ef;
      /* box-shadow: 0px 2px 9px 2px rgba(0, 0, 0, 0.09); */
      position: relative;
      left: -16px;
      top: 3px;
    }
  }
`;
