import { memo, useCallback, useEffect, useState } from 'react';

import { isEqual } from 'lodash';
import styled from 'styled-components';

import Icon from '@/components/icon';

const SortField = ({ sortOpt, currentSort, setCurrentSort }) => {
  // 处理排序
  const handleChgSort = useCallback(() => {
    if (isEqual(currentSort?.key, sortOpt?.key)) {
      let sortRule = '';
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
        return { ...old, rule: sortRule };
      });
    } else {
      setCurrentSort(sortOpt);
    }
  }, [currentSort, setCurrentSort, sortOpt]);

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
      <Icon symbol={sortIco} />
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
    margin-top: -1px;
    margin-left: 2px;
  }
`;
