import { memo } from 'react';

import { useMemoizedFn } from 'ahooks';
import styled from 'styled-components';

import Icon from '@/components/icon';
import imgSrc from '@/pages/area/areaCompareAdvance/imgs/retract.png';

const IndicHeaderCell = (props: any) => {
  const { isExpandAll, setIsExpandAll, title = '指标名称(权重)' } = props;

  const handleHeadClick = useMemoizedFn(() => {
    setIsExpandAll(!isExpandAll);
  });

  return (
    <IndicCell>
      <span className="title">{title}</span>

      <div className="expand-retract" onClick={handleHeadClick}>
        <span>{isExpandAll ? '收起' : '展开'}</span>
        <Icon image={imgSrc} style={{ transform: isExpandAll ? 'unset' : 'rotate(-180deg)' }} size={9} />
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
    font-weight: 400;

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
