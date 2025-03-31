import styled from 'styled-components';

import { baseColor } from '@/assets/styles';

import AreaIcon from '../../images/svg/area.svg?react';
import BondIcon from '../../images/svg/bond.svg?react';
import CompanyIcon from '../../images/svg/company.svg?react';
import SearchIcon from '../../images/svg/search.svg?react';
import IconImage from '../svg';
export default function Tags({
  isFindFunction,
  toggleApi,
  isMain,
}: {
  isFindFunction: boolean;
  toggleApi: () => void;
  isMain?: boolean;
}) {
  return !isMain ? (
    <AnswerTags>
      <IconImage type="search" text="找功能" onClick={toggleApi} active={isFindFunction} />
      <IconImage type="company" text="问企业" />
      <IconImage type="area" text="查地区" />
      <IconImage type="bond" text="问债券" />
    </AnswerTags>
  ) : (
    <MainTags>
      <li onClick={toggleApi} className={isFindFunction ? 'active' : ''}>
        <SearchIcon />
        找功能
      </li>
      <li>
        <CompanyIcon />
        问企业
      </li>
      <li>
        <AreaIcon />
        查地区
      </li>
      <li>
        <BondIcon />
        问债券
      </li>
    </MainTags>
  );
}

const MainTags = styled.ul`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 16px;
  li {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 82px;
    height: 30px;
    background: linear-gradient(106deg, #fbfdff 13%, #fefeff 91%);
    border: 1px solid #e9f4ff;
    border-radius: 9px;
    cursor: pointer;
    &:hover,
    &.active {
      background: linear-gradient(249deg, rgba(49, 244, 255, 0.1), rgba(26, 110, 255, 0.1));
      color: ${baseColor.primary};
    }
    svg {
      margin-right: 4px;
    }
  }
`;

const AnswerTags = styled.ul`
  display: flex;
  gap: 16px;
  margin-bottom: 8px;
  width: 100%;
  & > span {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 69px;
    height: 29px;
    background: #ffffff;
    border: 1px solid #e5e5e5;
    border-radius: 9px;
    cursor: pointer;
    color: #808080;
    > span {
      margin-top: 2px;
    }
    &:hover,
    &.active {
      color: #262626;
    }
  }
`;
