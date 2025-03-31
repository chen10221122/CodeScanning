import { FC, memo } from 'react';

import cn from 'classnames';
import styled from 'styled-components';

import BackTop from '@/components/backTop';
import Next from '@/pages/area/areaF9/components/next';

import Styles from './style.module.less';

export interface WrapperProps {
  children: any;
}

const ModuleWrapper: FC<WrapperProps> = ({ children }) => {
  return (
    <IndexContainer>
      <div className={cn(Styles.wrapper)}>{children}</div>
      <Next />
      <BackTop target={() => document.getElementById('area-financing-board-wrapper') || document.body} />
    </IndexContainer>
  );
};

export default memo(ModuleWrapper);

const IndexContainer = styled.div`
  width: 100% !important;
  height: 100%;
  overflow: overlay !important;
  /* scrollbar-gutter: stable; */
  min-width: 1050px;

  /* #area-company-detail-modal-tableID {
    height: calc(100vh - 206px);
    @media screen and (max-width: 1279px) {
      height: calc(100vh - 218px);
    }
  } */

  .wrapper-title {
    position: relative;
    margin-left: 2px;
    height: 20px;
    font-family: PingFangSC, PingFangSC-Medium;
    font-size: 13px;
    font-weight: 500;
    line-height: 20px;
    color: #262626;
    /* &::before {
      position: absolute;
      left: -8px;
      top: 4px;
      width: 2px;
      height: 13px;
      background: #ff9347;
      border-radius: 2px;
      content: '';
    } */
  }
`;
