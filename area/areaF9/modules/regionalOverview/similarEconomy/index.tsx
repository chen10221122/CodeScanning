import { FC, useMemo } from 'react';
// import KeepAlive from 'react-activation';

import { Tabs } from '@dzh/components';
import styled from 'styled-components';

import SimilarEconomyBox from '@/pages/area/areaF9/modules/regionalOverview/similarEconomy/similarEconomyBox';
import SimilarScoreBox from '@/pages/area/areaF9/modules/regionalOverview/similarEconomy/similarScoreBox';

import { Provider } from './context';
import { Provider2 } from './context2';

const Main: FC = () => {
  // const onChange = (key: string) => {
  //   // eslint-disable-next-line no-console
  //   console.log(key);
  // };

  const tabConfig = useMemo(() => {
    return [
      {
        tab: '相似经济',
        key: '1',
        content: (
          <Provider>
            <SimilarEconomyBox />
          </Provider>
        ),
      },
      {
        tab: '相似评分',
        key: '2',
        content: (
          <Provider2>
            <SimilarScoreBox />
          </Provider2>
        ),
      },
    ];
  }, []);

  return (
    <OutTabBox>
      <Tabs type="primary-card">
        {tabConfig.map((item) => (
          <Tabs.TabPane tab={item.tab} key={item.key}>
            {item.content}
          </Tabs.TabPane>
        ))}
      </Tabs>
    </OutTabBox>
  );
};

export default () => {
  return <Main />;
};

const OutTabBox = styled.div`
  height: 100%;
  padding: 10px 0 0 0;

  .ant-tabs {
    height: 100%;
    .ant-tabs-nav {
      margin: 0 16px 0 20px !important;
    }
    .ant-tabs-content {
      height: 100%;
      .main-container {
        padding: 0;
        scrollbar-gutter: auto;
        overflow-y: scroll !important;
        .main-content {
          padding-right: 4px;
          // padding: 0;
          // height: calc(100% - 48px);
          // padding: 0 16px 0 20px;
          // height: calc(100% - 48px);
        }
      }
    }
  }
`;
