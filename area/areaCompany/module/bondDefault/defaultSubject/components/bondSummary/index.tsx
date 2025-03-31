import { memo } from 'react';

import { useCreation } from 'ahooks';
import styled from 'styled-components';

import leftBottomBG from './LB.svg';
import rightTopBG from './RT.svg';

type TProps = {
  offShore: boolean;
  data?: any;
};

/** 🐶中台,空值返回空字符串,没办法用空值合并运算符 */
const emptyShw = (content: string | number, str: number | string = '-') => {
  return content ? content : str;
};

/** 概览信息 境内境外模块共用*/
const BondSummary = ({ offShore, data }: TProps) => {
  const renderWhat = useCreation(() => {
    if (offShore) {
      return [
        { title: '违约家数', unit: '家', value: emptyShw(data?.orgCount, 0) },
        { title: '违约只数', unit: '只', value: emptyShw(data?.defaultNumberCount, 0) },
        { title: '违约金额', unit: '亿美元', value: emptyShw(data?.defaultAmountCount, 0) },
      ];
    } else {
      return [
        { title: '违约家数', unit: '家', value: emptyShw(data?.orgCount, 0) },
        { title: '违约只数', unit: '只', value: emptyShw(data?.defaultCount, 0) },
        { title: '违约金额', unit: '亿', value: emptyShw(data?.defaultAmount, 0) },
        { title: '已偿还', unit: '亿', value: emptyShw(data?.repayAmount, 0) },
      ];
    }
  }, [offShore, data]);

  return (
    <Container>
      <SummaryWapper offShore={offShore}>
        {renderWhat.map((i, idx) => {
          return (
            <div className="summary-item" key={idx}>
              <span className="content">
                <span className="tips" />
                <span className="text">{i.title}</span>
                <span className="count">{i.value}</span>
                <span className="text">{i.unit}</span>
              </span>
            </div>
          );
        })}
      </SummaryWapper>
    </Container>
  );
};

export default memo(BondSummary);

const SummaryWapper = styled.div<{ offShore: boolean }>`
  width: 100%;
  height: 52px;
  border: 1px solid #f2f2f2;
  border-radius: 4px;
  background: url(${leftBottomBG}) no-repeat 100% 100%, url(${rightTopBG}) no-repeat 100% 100%, #fff;
  background-position: left bottom, right top;
  padding: 9px 30px;
  display: flex;
  flex-wrap: nowrap;
  & > :not(:first-child) {
    border-left: 1px solid;
    border-image: linear-gradient(180deg, #fbfdff, #f0f0f0 50%, #fbfdff) 1 1;
    padding-left: 15px;
  }
  .summary-item {
    width: calc(100% / ${({ offShore }) => (offShore ? 3 : 4)});
    height: 34px;
    padding-bottom: 7px;
    .content {
      margin-top: 6px;
      display: inline-block;
      .tips {
        display: inline-block;
        width: 3px;
        height: 12px;
        background: #0171f6;
        border-radius: 1px;
        margin-right: 5px;
        position: relative;
        top: 2px;
      }
      .text {
        font-size: 12px;
        font-weight: 400;
        text-align: left;
        color: #808080;
        line-height: 18px;
      }
      .count {
        font-size: 18px;
        text-align: left;
        color: #262626;
        line-height: 21px;
        margin-left: 6px;
        margin-right: 2px;
      }
    }
  }
`;

const Container = styled.div`
  padding-top: 12px;
  background: #fff;
`;
