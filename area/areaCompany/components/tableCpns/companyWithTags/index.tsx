import { memo } from 'react';

import cn from 'classnames';
import styled from 'styled-components';

import { BondFicancialParams } from '@/pages/area/areaCompany/api/regionFinancingApi';
import { LinkToBond } from '@/pages/area/areaCompany/components/tableCpns/linkToF9';
import { highlight } from '@/utils/dom';

export default memo(
  ({
    type,
    data,
    pageParams,
    handleOpenModal,
  }: {
    type: 'company' | 'co';
    data: Record<string, any>;
    pageParams?: BondFicancialParams;
    handleOpenModal?: Function;
  }) => {
    const { name, code, tags, hasRedNews } = data;
    const hasRed = hasRedNews === '1';
    const content = pageParams?.text ? highlight(name, pageParams.text) : name;

    return (
      <LineEllipsis hasRed={hasRed}>
        <div className="companys" title={name}>
          <div className={cn('company-name', { 'blue-text': code })}>
            <LinkToBond code={code} type={type} name={content} />
          </div>

          {tags?.length ? (
            <div className="tags">
              {tags.map((tag: string) => (
                <span>{tag}</span>
              ))}
            </div>
          ) : null}
        </div>

        {hasRed ? (
          <span
            className="important-state"
            onClick={() => handleOpenModal?.(data.code, data.name, data.count, 'company')}
          >
            <span className="text">风险</span>
            <span className="count">{data.count > 999 ? '999+' : data.count}</span>
            <span className="arrow"></span>
          </span>
        ) : null}
      </LineEllipsis>
    );
  },
);

const LineEllipsis = styled.div<{ hasRed: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  .companys {
    display: flex;
    width: calc(100% - ${({ hasRed }) => (hasRed ? '46px' : '0px')});
    .blue-text {
      color: #025cdc;
    }
    .company-name {
      text-align: left;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .tags {
      flex: none;
      span {
        display: inline-block;
        width: 32px;
        height: 18px;
        font-size: 12px;
        background: #ebf6ff;
        border-radius: 2px;
        text-align: center;
        color: #0086ff;
        line-height: 18px;
        margin-left: 4px;
      }
    }
  }
  .red-new {
    height: 18px;
    font-size: 12px;
    font-weight: 400;
    text-align: center;
    color: #262626;
    line-height: 18px;
    margin-left: 18px;
    position: relative;
    flex: none;
    &:hover {
      color: #0171f6;
      cursor: pointer;
    }
    &::before {
      content: '';
      position: absolute;
      top: 2px;
      left: -14px;
      width: 13px;
      height: 14px;
      background: url(${require('@/pages/area/areaCompany/assets/red_new.svg')}) no-repeat center;
      background-size: 100% 100%;
    }
  }
  .important-state {
    margin-left: 4px;
    padding: 2px 4px;
    white-space: nowrap;
    border-radius: 4px;
    background: linear-gradient(90deg, rgb(239 47 49 / 4%), rgb(239 47 49 / 4%));
    color: #ef2f31;
    line-height: 18px;
    font-size: 12px;
    cursor: pointer;
    .count {
      margin: 0 4px;
    }
    .arrow {
      display: inline-block;
      border-width: 4px 0px 3px 4px;
      border-style: solid;
      border-color: transparent #ef2f31 transparent;
    }
  }
`;
