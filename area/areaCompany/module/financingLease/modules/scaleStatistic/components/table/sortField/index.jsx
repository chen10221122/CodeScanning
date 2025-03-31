import { memo, useMemo } from 'react';

import { useMemoizedFn } from 'ahooks';
import { isEqual } from 'lodash';
import styled from 'styled-components';

import Icon from '@/components/icon';

const SortField = ({ sortOpt, currentSort, setCurrentSort, sortChange, align = 'center' }) => {
  // 处理排序
  const handleChgSort = useMemoizedFn(() => {
    if (isEqual(currentSort?.key, sortOpt?.key)) {
      let sortRule = '',
        curr = {};
      switch (currentSort?.rule) {
        case 'asc':
          sortRule = '';
          break;
        case 'desc':
          sortRule = 'asc';
          break;
        case '':
          sortRule = 'desc';
          break;
        default:
          break;
      }
      setCurrentSort((old) => {
        old.rule = sortRule;
        curr = Object.assign({}, old);
        return curr;
      });
      sortChange(curr);
    } else {
      setCurrentSort(sortOpt);
      sortChange(sortOpt);
    }
  });

  /** 排序图标 */
  let sortIco = '';

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
  sortIco = isEqual(currentSort?.key, sortOpt?.key) && icoStr ? icoStr : 'iconico_weixuanzhong';

  const withSortTitle = useMemo(() => {
    return (
      <SortFieldWrap onClick={handleChgSort} align={align}>
        <span title={sortOpt.value}>{sortOpt.value}</span>
        <span>
          <Icon symbol={sortIco} />
        </span>
      </SortFieldWrap>
    );
  }, [align, handleChgSort, sortIco, sortOpt.value]);

  return withSortTitle;
};

export default memo(SortField);

const SortFieldWrap = styled.div`
  /* display: flex;
  justify-content: ${({ align }) => {
    return align ?? 'center';
  }};
  align-items: center; */
  cursor: pointer;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  .icon {
    margin-left: 2px;
  }
`;
