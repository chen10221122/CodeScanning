import styled from 'styled-components';

import { DEFAULT_PAGE_OFFSET, getConfig } from '@/app';
import addActiveIcon from '@/pages/enterprise/enterpriseScreen/img/add-active.png';
import addIcon from '@/pages/enterprise/enterpriseScreen/img/add.png';

export const PageWrapper = styled.div`
  min-height: calc(100vh - ${getConfig((d) => d.css.pageOffset, DEFAULT_PAGE_OFFSET + 60)}px);
  background: #ffffff;
  padding: 0 0 16px;
  .ant-scrolling-effect {
    overflow: visible !important;
    width: 100% !important;
  }
`;

export const FilterWrap = styled.div`
  position: sticky;
  top: 42px;
  z-index: 5;
`;

export const FilterConditionWrap = styled.div`
  background: #fff;
  height: 35px;
  padding: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  top: -2px;
  z-index: 2;

  .screen-wrapper {
    align-items: center;
  }
`;

export const Filter = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`;

export const ScreenWrapper = styled.div`
  padding-right: 24px;
`;

export const Operating = styled.div`
  width: fit-content;
  display: flex;
  align-items: center;
  i {
    line-height: 17px !important;
  }
  .count {
    font-size: 13px;
    color: #8c8c8c;
    margin-right: 24px;
    span {
      color: #333333;
    }
  }
  .pick {
    margin-right: 24px;

    .pick-text {
      font-size: 13px;
      font-weight: 400;
      text-align: left;
      color: ${({ selectRows }) => (selectRows?.length ? '#333333' : '#bfbfbf!important')};
      /* color: #333333; */
      cursor: ${({ selectRows }) => (selectRows?.length ? 'pointer' : 'no-drop')};
      line-height: 20px;
      position: relative;
      &::before {
        content: '';
        display: inline-block;
        width: 14px;
        height: 14px;
        background: ${({ selectRows }) =>
          selectRows?.length ? `url(${addActiveIcon} no-repeat center` : `url(${addIcon} no-repeat center`};
        background-size: 14px 14px;
        margin-right: 4px;
        transform: translateY(1px);
      }
    }
  }
`;

export const DefaultContainer = styled.div`
  width: 100%;
  min-width: calc(1280px-213px);
  margin: 0 auto;

  &:before {
    display: table;
    content: ' ';
  }

  &:after {
    clear: both;
  }

  padding: 0px;
`;

export const WrapLine = styled.div`
  color: #141414;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  display: -webkit-box !important;
  -webkit-line-clamp: 1 !important;
  -webkit-box-orient: vertical !important;
  box-sizing: border-box;
`;
