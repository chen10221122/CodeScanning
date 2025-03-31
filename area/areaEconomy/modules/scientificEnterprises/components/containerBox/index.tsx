import { FC, ReactElement } from 'react';

import styled from 'styled-components';

type TBox = {
  /** 标题 */
  cardTitle: string;
  /** 副标题 */
  label: string;
  /** 正文 */
  content: ReactElement;
};

const Box: FC<Partial<TBox>> = ({ cardTitle = '地区分布', label = '（合肥市）', content }) => {
  return (
    <BoxWapper>
      <div className="head-line">
        <span className="card-name">{cardTitle}</span>
        <span className="area-label">{label ? `（${label}）` : ''}</span>
      </div>
      {content ?? '-'}
    </BoxWapper>
  );
};

export default Box;

const BoxWapper = styled.div`
  height: 252px;
  min-width: 527px;
  border: 1px solid #efefef;
  border-radius: 4px;
  padding-top: 12px;
  padding-bottom: 20px;
  font-size: 13px;
  font-weight: 500;
  flex: 1;
  .head-line {
    width: 100%;
    height: 18px;
    padding-left: 28px;
    .card-name {
      color: #141414;
      line-height: 18px;
      &::before {
        content: '';
        display: inline-block;
        width: 2px;
        height: 12px;
        background-color: #ff7419;
        border-radius: 1px;
        position: relative;
        top: 1px;
        left: -6px;
      }
    }
    .area-label {
      display: inline-block;
      font-size: 12px;
      color: #434343;
      line-height: 18px;
      font-weight: normal;
    }
  }
`;
