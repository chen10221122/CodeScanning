import { FC, memo } from 'react';

import cn from 'classnames';
import styled from 'styled-components';

import blueArrowIcon from '@/pages/finance/financingLease/images/blueArrow.svg';
import redArrowIcon from '@/pages/finance/financingLease/images/redArrow.svg';
export const HISTORY_OVERDUE = '历史逾期';
interface Props {
  data: string[];
  handleClick?: Function;
  /** 评级 */
  rate?: string;
  /** 兼容租赁融资 */
  isArea?: boolean;
}

const getAreaStyleMap = (key: string) => {
  switch (key) {
    case '高新技术企业':
    case '科技型中小企业':
    case '创新型中小企业':
    case '专精特新小巨人':
    case '专精特新“小巨人”':
    case '专精特新中小企业':
      return {
        color: '#ff7500',
        background: '#FFF4EB',
      };
    default:
      return {
        color: '#1FAEF5',
        background: '#E9F6FE',
      };
  }
};

const getStyleValue = (key: string) => {
  switch (key) {
    case '首次登记':
    case '香港上市':
    case '主板':
    case '科创板':
    case '创业板':
    case '北交所':
      return {
        color: '#1faef5',
        background: '#e9f6fe',
      };
    case '央企':
    case '央企子公司':
    case '国企':
    case '民企':
      return {
        color: '#0086FF',
        background: '#EBF6FF',
      };
    case '发债':
    case '城投子公司':
    case '城投':
      return {
        color: '#7686DE',
        background: '#F1F2FB',
      };
    case '高新技术企业':
    case '科技型中小企业':
    case '创新型中小企业':
    case '专精特新“小巨人”':
    case '专精特新中小企业':
      return {
        color: '#FF7500',
        background: '#fff4eb',
      };
    case '债券违约':
    case '非标违约':
    case '资不抵债':
    case '失信':
    case '立案调查':
      return {
        color: '#fb7171',
        background: '#fff4f4',
      };
    default:
      return {};
  }
};

const Index: FC<Props> = ({ data, handleClick, rate, isArea }) => {
  return (
    <Container>
      {data?.map((d) => {
        return d ? (
          <span
            onClick={() => handleClick?.(d)}
            className={cn('tag', { 'red-tag': d === HISTORY_OVERDUE, 'blue-tag': d === rate })}
            key={d}
            style={isArea ? getAreaStyleMap(d) : getStyleValue(d)}
          >
            {d}
          </span>
        ) : null;
      })}
    </Container>
  );
};

export default memo(Index);
const Container = styled.span`
  .tag {
    margin-right: 4px;
    display: inline-block;
    padding: 3px 4px;
    border-radius: 2px;
    font-size: 12px;
    height: 18px;
    line-height: 12px;
    font-weight: 400;
    color: #20aef5;
    min-width: 30px;
    text-align: center;
    box-sizing: border-box;
  }

  .red-tag {
    position: relative;
    padding: 2px 18px 2px 6px;
    color: #fe3a2f;
    border: 1px solid rgba(254, 58, 47, 0.2);
    border-radius: 2px;
    cursor: pointer;
    &::after {
      position: absolute;
      top: 3px;
      right: 6px;
      content: '';
      width: 10px;
      height: 10px;
      background: url(${redArrowIcon}) no-repeat center;
      background-size: contain;
    }
  }
  .blue-tag {
    position: relative;
    padding: 2px 18px 2px 6px;
    color: #0171f6;
    border: 1px solid rgba(1, 113, 246, 0.2);
    cursor: pointer;
    &::after {
      position: absolute;
      top: 3px;
      right: 6px;
      content: '';
      width: 10px;
      height: 10px;
      background: url(${blueArrowIcon}) no-repeat center;
      background-size: contain;
    }
  }
`;
