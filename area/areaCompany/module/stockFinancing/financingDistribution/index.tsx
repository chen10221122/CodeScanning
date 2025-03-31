import { useRef, useState } from 'react';

import CommonTemplate from '../templatePage';
import BlueTabWithLoading from '../templatePage/blueTabWithLoading';
import { TableColumnType } from '../templatePage/type';
import styles from './styles.module.less';
const currentYear = new Date().getFullYear();
const FinancingDistribution = () => {
  const stickyContainerRef = useRef(null);
  const [tabFilterCache, setTabFilterCache] = useState({ startYear: currentYear - 19, endYear: currentYear });
  const tabConfig = [
    {
      tabName: '按板块',
      tabKey: '0',
      tabContent: (
        <CommonTemplate
          pageConfig={{
            className: styles.plateWrapper,
            tabFilterCache,
            stickyContainerRef,
            setTabFilterCache,
            type: TableColumnType.Plate,
          }}
        />
      ),
    },
    {
      tabName: '按企业性质',
      tabKey: '1',
      tabContent: (
        <CommonTemplate
          pageConfig={{
            className: styles.enterpriseWrapper,
            tabFilterCache,
            stickyContainerRef,
            setTabFilterCache,
            type: TableColumnType.Nature,
          }}
        />
      ),
    },
    {
      tabName: '按产业',
      tabKey: '2',
      tabContent: (
        <CommonTemplate
          pageConfig={{
            className: styles.industryWrapper,
            tabFilterCache,
            stickyContainerRef,
            setTabFilterCache,
            type: TableColumnType.Industry,
          }}
        />
      ),
    },
  ];
  const [activeTab, setActiveTab] = useState('0');

  return (
    <div className={styles.container} ref={stickyContainerRef}>
      <BlueTabWithLoading
        // onTabChange={handleTabChange}
        activeKey={activeTab}
        setActiveTab={setActiveTab}
        tabConfig={tabConfig}
        destroyInactiveTabPane={true}
      />
    </div>
  );
};

export default FinancingDistribution;
