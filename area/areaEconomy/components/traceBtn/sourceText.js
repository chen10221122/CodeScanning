import { memo } from 'react';

import styled from 'styled-components';

import { Tooltip } from '@/components/antd';
import Icon from '@/components/icon';

const sourceText = ({ placement }) => {
  return (
    <Wrap className="source">
      <Tooltip
        title={
          <div style={{ fontSize: '13px' }}>
            财汇资讯新增数据溯源功能,便于用户快速査询指标数据来源。目前部分指标可溯源,更多指标溯源将陆续上线。
          </div>
        }
        placement={placement}
      >
        <i>
          <Icon style={{ width: 14, height: 14, position: 'relative' }} symbol="iconico_zhuanti_shiyongzhong2x" />
        </i>
      </Tooltip>
      <span>溯源</span>
    </Wrap>
  );
};
export default memo(sourceText);
const Wrap = styled.div`
  display: flex;
  align-items: center;
  span {
    margin: 0px 8px 0 6px;
    vertical-align: text-bottom;
    font-size: 13px;
    font-weight: 400;
    color: #595959;
  }
  svg {
    cursor: pointer;
  }
`;
