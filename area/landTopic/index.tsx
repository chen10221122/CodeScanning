import { memo } from 'react';
import KeepAlive from 'react-activation';
import { useLocation } from 'react-router-dom';

import { Provider } from '@pages/area/landTopic/provider';

import HelpUpdateRemind from '@/components/dialog/helpUpdateRemind/areaHelp';
import { LINK_LAND_TOPIC_OVERVIEW, LINK_LAND_TOPIC_AGREEMENT_TRANSFER } from '@/configs/routerMap';
import { ProLayout, ProLayoutType, TopicNav } from '@/layouts/ProLayout';
import RouterView from '@/utils/router/routerView';

import HelpText from './modules/helpText';

import S from '@pages/area/landTopic/styles.module.less';

const navs = [
  {
    title: '招拍挂',
    to: LINK_LAND_TOPIC_OVERVIEW,
  },
  {
    title: '协议划拨',
    to: LINK_LAND_TOPIC_AGREEMENT_TRANSFER,
  },
];

const AnchorList = ['帮助说明'];

const HelpContent = [
  {
    title: '帮助说明',
    content: <HelpText />,
  },
];

const Main = () => {
  const location = useLocation();
  return (
    <ProLayout layout={ProLayoutType.TAB_TOPIC} className={S['my-pro-layout']}>
      <ProLayout.Header>
        <div className={`full-height ${S['help-header']}`}>
          <TopicNav navs={navs} />
          <HelpUpdateRemind
            leftAnchorList={AnchorList}
            rightContentList={HelpContent}
            updatedVersionDate="2023-5-18"
            pageCode="land_topic_Help"
          />
        </div>
      </ProLayout.Header>
      <ProLayout.Content>
        <KeepAlive id={location.pathname}>
          <RouterView />
        </KeepAlive>
      </ProLayout.Content>
    </ProLayout>
  );
};

const LandTopic = () => {
  return (
    <Provider>
      <Main />
    </Provider>
  );
};

export default memo(LandTopic);
