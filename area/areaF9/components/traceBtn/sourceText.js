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
        <div className="tip">
          <Icon style={{ width: 14, height: 14, position: 'relative' }} symbol="iconico_zhuanti_shiyongzhong2x" />
        </div>
      </Tooltip>
      <div className="title">溯源</div>
    </Wrap>
  );
};

export default memo(sourceText);

const Wrap = styled.div`
  display: flex;
  align-items: center;

  .tip {
    display: flex;
  }

  .title {
    margin-left: 6px;
    font-size: 13px;
    font-weight: 400;
    color: #595959;
    line-height: 1;
  }

  svg {
    cursor: pointer;
  }
`;
