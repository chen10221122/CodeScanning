import { memo } from 'react';

import styled from 'styled-components';

import { tabOptions } from '../config/tabsConfig';

export type IInstitutionCount = { [key: string]: string };
type IItem = { isActive?: boolean; title: string; count: string; onChange: () => void };
type ITabs = { currTabkey: string; onChange: (value: string) => void; institutionCount: IInstitutionCount };

const TabItem = ({ isActive, title, count, onChange }: IItem) => {
  return (
    <div className={`item ${isActive ? 'active' : ''}`} onClick={onChange}>
      {isActive && <div className="active-bg" />}
      <div className="title">{title}</div>
      <div className="count">{count}家</div>
    </div>
  );
};
const Tabs = ({ currTabkey, onChange, institutionCount }: ITabs) => {
  const idx = tabOptions.findIndex((it) => it.value === currTabkey);
  return (
    <TabWrapper>
      {tabOptions.map(({ title, value, countKey }) => (
        <TabItem
          title={title}
          isActive={currTabkey === value}
          count={institutionCount[countKey] ?? '-'}
          key={value}
          onChange={onChange.bind(this, value)}
        />
      ))}
      <div className="line" style={{ left: 5 + idx * 106 + 'px' }}></div>
    </TabWrapper>
  );
};

export default memo(Tabs);
const TabWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 51px;
  border-bottom: 1px solid #ffd5b2;
  position: relative;
  margin-top: 12px;
  .item {
    border: 1px solid #efefef;
    padding-top: 1px;
    height: 100%;
    width: 96px;
    margin-left: 9px;
    margin-right: 1px;
    padding-left: 12px;
    border-bottom: none !important;
    cursor: pointer;
    opacity: 0.7;
    position: relative;
    .title {
      font-size: 15px;
      font-weight: 400;
      text-align: left;
      color: #ff7500;
      line-height: 23px;
      margin-top: 4px;
      position: relative;
    }
    .count {
      font-size: 13px;
      font-weight: 400;
      text-align: left;
      color: #5c5c5c;
      line-height: 20px;
      position: relative;
    }
    &:not(.active):hover {
      border-color: #ffd5b2;
      opacity: 1;
    }
  }

  .active {
    border: 1px solid #ffd5b2;
    border-top: 2px solid #ff7500;
    border-bottom: 1px solid #fff !important;
    position: relative;
    z-index: 11;
    opacity: 1;
    padding-top: 0px;
    ::before,
    ::after {
      content: '';
      position: absolute;
      width: 8px;
      height: 8px;
      border: 1px solid #ffd5b2;
      background-color: #fff;
      border-top: none;
      bottom: -2px;
    }
    ::before {
      left: -8px;
      border-bottom-right-radius: 50%;
      border-left: none;
    }
    ::after {
      right: -8px;
      border-bottom-left-radius: 50%;
      border-right: none;
    }
  }
  .active-bg {
    background-image: url(${require('../../../images/activeBg.png')});
    background-size: cover;
    position: absolute;
    width: 100%;
    height: 49px;
    top: 0;
    left: 0;
  }
  .line {
    position: absolute;
    left: 5px;
    bottom: -1px;
    height: 1px;
    width: 106px;
    background-color: #fff;
    z-index: 10;
  }
`;
