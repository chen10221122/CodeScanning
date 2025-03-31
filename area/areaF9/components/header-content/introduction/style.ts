import styled, { createGlobalStyle } from 'styled-components';

import { getPrefixCls, getStyledPrefixCls } from '@/utils/getPrefixCls';

export const prefix = getPrefixCls('areaf9-header-detail');
export const css = getStyledPrefixCls('areaf9-header-detail');

export const Title = styled.div<{ width?: number; mgb?: number }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 23px;
  font-size: 15px;
  font-weight: 500;
  color: #141414;
  line-height: 23px;
  margin-bottom: ${({ mgb }) => mgb || 8}px;
  padding-left: 10px;

  &::before {
    content: '';
    display: inline-block;
    position: absolute;
    left: 0;
    top: 4px;
    width: ${({ width }) => width || 3}px;
    height: 14px;
    background: #ff9347;
    border-radius: 2px;
  }
`;

export const GlobalStyle = createGlobalStyle`
    ${css('copy-success-popover')}{
        /* left: 368px !important; */
        height: 34px;
        width: 70px;
        .ant-popover-content,.ant-popover-inner{
          height: 100%;
        }
        .ant-popover-inner-content{
          width: auto;
          height: 100%;
          padding: 0;
          font-size: 12px;
          font-weight: 400;
          color: #3c3c3c;
          line-height: 34px;
          text-align: center;
          white-space: nowrap;
        }
        .ant-popover-arrow{
          left: 60px !important;
        }
    }
`;
