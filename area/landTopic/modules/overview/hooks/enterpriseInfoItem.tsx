import { ReactNode, memo } from 'react';

import cn from 'classnames';
import styled from 'styled-components';

import { LINK_XIN_SIGHT } from '@/configs/routerMap';
import { highlight } from '@/utils/dom';
import { dynamicLink } from '@/utils/router';
import { urlJoin, urlQueriesSerialize } from '@/utils/url';

const TAG_KEYS = [
  { key: 'listed', name: '上市', value: 1 },
  { key: 'investment', name: '城投', value: 1 },
  { key: 'bond', name: '发债', value: 1 },
  { key: 'centralEnterprise', name: '央企', value: 1 },
  { key: 'stateOwned', name: '国企', value: 1 },
  { key: 'privateEnterprise', name: '民企', value: 1 },
  { key: 'estate', name: '房企', value: 1 },
];

const EnterpriseInfoItem = ({
  enterpriseInfoItem,
  keyword,
  row,
  history,
  tip,
  jumpCompany,
}: {
  enterpriseInfoItem: any;
  keyword?: string;
  row: any;
  history: any;
  tip?: ReactNode;
  jumpCompany: (code: string) => void;
}) => {
  const { sitCode2, groupTop, ratio } = enterpriseInfoItem;
  const tags = TAG_KEYS.reduce((pre, { key, name, value }) => {
    if (enterpriseInfoItem[key] === value) {
      pre.push(name);
    }
    return pre;
  }, [] as string[]);
  return (
    <Container style={{ width: tip ? `calc(100% - ${18}px)` : '100%' }}>
      <span
        title={groupTop}
        className={cn('ellipsis', { 'link-underline': sitCode2 })}
        onClick={() => jumpCompany(sitCode2)}
      >
        {highlight(groupTop, keyword)}
      </span>
      <span className="ratio">
        (持股{ratio})
        <label
          className="ratio-icon"
          onClick={() => {
            const startITCode = row.partyInfo?.[0]?.code || '';
            const startName = row.partyInfo?.[0]?.name || '';
            if (startITCode && sitCode2) {
              history.push(
                urlJoin(
                  dynamicLink(LINK_XIN_SIGHT, { project: 'lianlu' }),
                  urlQueriesSerialize({
                    start: startName,
                    startITCode,
                    end: groupTop,
                    endITCode: sitCode2,
                  }),
                ),
              );
            }
          }}
        />
      </span>
      {tags.map((tag) => (
        <span key={tag} className="enterprise-tag">
          {tag}
        </span>
      ))}
      {tip}
    </Container>
  );
};

export default memo(EnterpriseInfoItem);

const Container = styled.div`
  width: 100%;
  display: inline-flex;
  align-items: center;
  .company {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-right: 4px;
  }
  .company-link {
    &:hover {
      color: #025cdc;
      cursor: pointer;
    }
  }
  .ratio {
    white-space: nowrap;
    .ratio-icon {
      display: inline-block;
      width: 13px;
      height: 13px;
      margin-left: 4px;
      margin-top: -2px;
      vertical-align: middle;
      background: url(${require('@/pages/bond/billOverdue/images/ratio.svg')}) no-repeat center;
      background-size: cover;
      cursor: pointer;
    }
  }
  .enterprise-tag {
    display: inline-block;
    white-space: nowrap;
    background: #eff8fe;
    border-radius: 2px;
    line-height: 18px;
    color: #1faef5;
    padding: 0 4px;
    margin-left: 4px;
  }
  &:not(:first-of-type) {
    padding-top: 6px;
  }
`;
