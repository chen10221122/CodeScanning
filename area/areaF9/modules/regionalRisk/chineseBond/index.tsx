import { memo, useState } from 'react';
import { KeepAlive } from 'react-activation';

import { Tabs } from '@/components/antd';
import Next from '@/pages/area/areaF9/components/next';
import Content from '@/pages/area/areaF9/modules/regionalRisk/chineseBond/components/commonContent';
import { EPAGETYPE } from '@/pages/default/bondDefault/modules/defaultOffshore/hooks/useColumns';

import styles from '@/pages/area/areaF9/modules/regionalRisk/chineseBond/style.module.less';

const Index = () => {
  const [activeTab, setActiveTab] = useState<string>(EPAGETYPE.SUBJECT);
  const tabsConfig = [
    {
      name: '违约主体名单',
      key: EPAGETYPE.SUBJECT,
    },
    {
      name: '债券违约明细',
      key: EPAGETYPE.BOND,
    },
  ];
  // 切换tab，改变数据源
  const tabChange = (tab: string) => {
    setActiveTab(tab);
  };
  return (
    <>
      <div className={styles['risk-chinese-page-wrapper']} id="contentScrollDom">
        <Tabs onTabClick={tabChange} type="card" activeKey={activeTab}>
          {tabsConfig.map((tab) => {
            return (
              <Tabs.TabPane key={tab.key} tab={tab.name}>
                <KeepAlive key={tab.key} name={tab.key} id={tab.key}>
                  <Content pageType={tab.key}></Content>
                </KeepAlive>
              </Tabs.TabPane>
            );
          })}
        </Tabs>
        <Next></Next>
      </div>
    </>
  );
};
export default memo(Index);
