import { memo } from 'react';

import styled from 'styled-components';

import Icon from '@/components/icon';
import { useCtx } from '@/pages/area/areaCompareAdvance/context';

const IndicHeaderCell = () => {
  const {
    state: { isExpandAll },
    update,
  } = useCtx();

  return (
    <IndicCell>
      <span className="title">指标名称</span>

      <div
        className="expand-retract"
        onClick={() => {
          update((draft) => {
            draft.isExpandAll = !isExpandAll;
          });
        }}
      >
        <span>{!isExpandAll ? '展开' : '收起'}</span>
        <Icon
          image={require('../../imgs/retract.png')}
          style={{ transform: !isExpandAll ? 'rotate(-180deg)' : 'unset' }}
          size={9}
        />
      </div>
    </IndicCell>
  );
};

export default memo(IndicHeaderCell);

const IndicCell = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .expand-retract {
    font-size: 11px;
    color: #434343;
    margin-right: 4px;
    cursor: pointer;

    > span {
      margin-right: 2px;
    }

    &:hover {
      color: #0171f6;
    }

    i {
      vertical-align: -1px;
    }
  }
`;
