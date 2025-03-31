import { FC } from 'react';

import styled from 'styled-components';

import ExportDoc from '@/components/exportDoc';
import { LINK_ENTERPRISE_BLACKLIST } from '@/configs/routerMap';
import MoreBtn from '@/pages/area/areaEconomy/components/traceBtn/moreBtn';

export interface IExportDocOptions {
  condition: any;
  filename: string;
  type?: string;
  downloadType?: string;
  module_type?: string;
  style?: React.CSSProperties;
  code?: string | number;
  [key: string]: any;
}

export type TabRightNodeProps = {
  count: number | string;
  exportDoc: IExportDocOptions;
  selectRows: Array<any>;
  hasSelected?: boolean;
};

const TabRightNode: FC<TabRightNodeProps> = ({ count, exportDoc, selectRows, hasSelected }) => {
  return (
    <CounterWapper hasSelected={hasSelected}>
      <span className="counter">
        共 <span className="count-num">{count ?? 0}</span> 条
      </span>
      <ExportDoc {...exportDoc} />

      <MoreBtnContainer>
        <MoreBtn linkTo={LINK_ENTERPRISE_BLACKLIST} />
      </MoreBtnContainer>
    </CounterWapper>
  );
};

export default TabRightNode;

const CounterWapper = styled.div<any>`
  & > * {
    display: inline-block;
  }
  .counter {
    font-size: 13px;
    font-weight: 400;
    color: #333;
    margin-right: 24px;
    .count-num {
      color: #ff9347;
    }
  }
`;

const MoreBtnContainer = styled.div`
  margin-left: 4px;
`;
