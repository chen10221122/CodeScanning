import { memo, useCallback, useEffect, useState } from 'react';

import { isEqual } from 'lodash';
import styled from 'styled-components';

import Icon from '@/components/icon';
// import TableTooltip from '../tooltip';

const SortField = ({ sortOpt, currentSort, setCurrentSort, sortChange, isLoop = false, ...props }) => {
  // const { TooltipTitle, placement } = props;
  // 处理排序
  const handleChgSort = useCallback(() => {
    if (isEqual(currentSort?.key, sortOpt?.key)) {
      let sortRule = '',
        curr = {};
      switch (currentSort?.rule) {
        case 'asc':
          sortRule = isLoop ? (sortOpt.rule === 'asc' ? 'desc' : '') : 'desc';
          break;
        case 'desc':
          sortRule = isLoop ? (sortOpt.rule === 'desc' ? 'asc' : '') : '';
          break;
        case '':
          sortRule = isLoop ? (sortOpt.rule ? sortOpt.rule : 'asc') : 'asc';
          break;
        default:
          break;
      }
      setCurrentSort((old) => {
        // old.rule = sortRule;
        // curr = Object.assign({}, old);
        curr = Object.assign({}, old, { rule: sortRule });
        return curr;
      });
      sortChange(curr);
    } else {
      setCurrentSort(sortOpt);
      sortChange(sortOpt);
    }
  }, [currentSort, setCurrentSort, sortChange, sortOpt, isLoop]);

  // 排序图标
  const [sortIco, setSortIco] = useState('');
  useEffect(() => {
    let icoStr = '';
    switch (currentSort?.rule) {
      case 'asc':
        icoStr = 'iconico_shengxu';
        break;
      case 'desc':
        icoStr = 'iconico_jiangxu';
        break;
      default:
        break;
    }
    setSortIco(isEqual(currentSort?.key, sortOpt?.key) && icoStr ? icoStr : 'iconico_weixuanzhong');
  }, [currentSort, sortOpt?.key]);

  return (
    <SortFieldWrap onClick={() => handleChgSort()}>
      <span>{sortOpt.value}</span>
      {/* {TooltipTitle ? <TableTooltip title={TooltipTitle} placement={placement} /> : null} */}
      <span>
        <Icon symbol={sortIco} />
      </span>
    </SortFieldWrap>
  );
};

export default memo(SortField);

const SortFieldWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  .icon {
    margin-left: 2px;
  }
`;
