import React, { useCallback } from 'react';

import { isEqual } from 'lodash';
import styled from 'styled-components';

import Icon from '@/components/icon';

const SortField = ({ sortOpt, currentSort, setCurrentSort }) => {
  const handleChgSort = useCallback(() => {
    isEqual(currentSort?.key, sortOpt?.key) ? setCurrentSort({}) : setCurrentSort(sortOpt);
  }, [currentSort, setCurrentSort, sortOpt]);

  return (
    <SortFieldWrapper onClick={() => handleChgSort()}>
      <span>{sortOpt.key}</span>
      <Icon symbol={isEqual(currentSort?.key, sortOpt?.key) ? 'iconico_jiangxu' : 'iconico_weixuanzhong'} />
    </SortFieldWrapper>
  );
};

export default React.memo(SortField);

const SortFieldWrapper = styled.div`
  cursor: pointer;
  .icon {
    margin-left: 5px;
  }
`;
