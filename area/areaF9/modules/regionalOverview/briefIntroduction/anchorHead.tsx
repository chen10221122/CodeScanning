import { useState } from 'react';

import { useMemoizedFn } from 'ahooks';
import cn from 'classnames';
import styled from 'styled-components';

import { Anchor } from '@/components/antd';

interface Iprops {
  anchorList: string[];
  source: string;
}
export default ({ anchorList, source }: Iprops) => {
  const scrollEl: any = document.getElementsByClassName('side-page-content')?.[0];
  const [currAnchor, setCurrAnchor] = useState(anchorList?.[0] || '地区概况');

  const handleChange = useMemoizedFn((currentActiveLink) => {
    if (currentActiveLink) {
      const title = currentActiveLink.split('_')[0].split('#')[1];
      setCurrAnchor(title);
    }
  });

  return (
    <AnchorWrapper
      affix={false}
      offsetTop={39}
      getContainer={() => scrollEl || window}
      onChange={handleChange}
      getCurrentAnchor={() => currAnchor}
    >
      <div className="anchor-container">
        <div>
          {anchorList.map((itemTitle: string) => (
            <Anchor.Link
              key={itemTitle}
              title={itemTitle}
              href={`#${itemTitle}`}
              className={cn({ active: itemTitle === currAnchor })}
            />
          ))}
        </div>
        <div>
          来源:&nbsp;&nbsp;<span>{source || '-'}</span>
        </div>
      </div>
    </AnchorWrapper>
  );
};

const AnchorWrapper = styled(Anchor)`
  position: sticky;
  top: 0;
  left: 0;
  max-width: 860px;
  padding: 8px 0 4px;
  margin-left: 0 !important;
  background: #ffffff;

  .anchor-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    > div:first-child {
      display: flex;
    }
    > div:nth-child(2) {
      display: flex;
      align-items: center;
      width: auto;
      height: 20px;
      font-size: 12px;
      font-weight: 400;
      color: #878787;
      line-height: 20px;
      > span {
        display: block;
        width: auto;
        height: 20px;
        font-size: 13px;
        font-weight: 400;
        color: #141414;
        line-height: 20px;
      }
    }
  }
  .ant-anchor {
    display: flex;
    padding-left: 0 !important;
    .ant-anchor-ink {
      position: absolute;
      top: initial;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 1px;
      background: #cce3fd;
    }
  }
  .ant-anchor-link {
    height: 25px;
    margin-right: 1px;
    padding: 4px 10px;
    font-size: 12px;
    text-align: center;
    line-height: 18px;
    background: #f5f6f9;
    font-weight: 400;
    white-space: nowrap;
    border-radius: 2px 2px 0px 0px;

    .ant-anchor-link-title {
      color: #262626;
      :hover {
        color: #262626;
      }
    }
    &.active {
      background: #eff6ff;
      .ant-anchor-link-title {
        color: #0171f6 !important;
        font-weight: 500;
        &:hover {
          color: #0171f6 !important;
        }
      }
    }
  }
`;
