import { FC } from 'react';

import cn from 'classnames';
import styled from 'styled-components';

import { PLATFORM } from '../const';

interface IProps {
  platform: keyof typeof PLATFORM;
  total: number;
  // 筛选条件
  handleAddToEnterpriseDataView?: Function;
}

const Index: FC<IProps> = ({ platform, total, handleAddToEnterpriseDataView }) => {
  return (
    <AddDataView onClick={total ? () => handleAddToEnterpriseDataView?.() : () => void 0}>
      <span
        className={cn('pick-text', {
          'pick-disabled': !total,
        })}
      >
        添加至{PLATFORM[platform]}
      </span>
    </AddDataView>
  );
};

export default Index;

const AddDataView = styled.div`
  .pick-text {
    font-size: 12px;
    color: #141414;
    cursor: pointer;
    line-height: 18px;
    position: relative;
    vertical-align: middle;
    &::before {
      content: '';
      display: inline-block;
      width: 10px;
      height: 10px;
      background: url(${require('./img/add-active.png')}) no-repeat center;
      background-size: 10px 10px;
      margin-right: 4px;
      /* vertical-align: text-top; */
    }
  }
  .pick-disabled {
    color: #bfbfbf !important;
    cursor: not-allowed;
    &:before {
      background: url(${require('./img/add.png')}) no-repeat center;
      background-size: 12px 12px;
      vertical-align: text-top;
    }
  }
`;
