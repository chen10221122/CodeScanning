import { useRef, useState } from 'react';

import styled from 'styled-components';

import CommonTemplate from '../templatePage';
import { TableColumnType } from '../templatePage/type';
import styles from './styles.module.less';
const currentYear = new Date().getFullYear();
const StockScaleStatistic = () => {
  const stickyContainerRef = useRef(null);
  const [tabFilterCache, setTabFilterCache] = useState({ startYear: currentYear - 19, endYear: currentYear });
  return (
    <div ref={stickyContainerRef} className={styles.scrollWrap}>
      <Title>股权融资规模统计</Title>
      <CommonTemplate
        pageConfig={{
          className: styles.templateWrapper,
          stickyContainerRef,
          tabFilterCache,
          setTabFilterCache,
          type: TableColumnType.Scale,
          headerFixConfig: { screenTop: 0, tableTop: 40 },
        }}
      />
    </div>
  );
};
const Title = styled.div`
  padding: 12px 0 0 20px;
  position: relative;
  font-size: 15px;
  font-weight: 500;
  &:before {
    position: absolute;
    content: '';
    left: 11px;
    width: 3px;
    height: 14px;
    bottom: 6px;
    background: #ff9347;
    border-radius: 2px;
  }
`;
export default StockScaleStatistic;
