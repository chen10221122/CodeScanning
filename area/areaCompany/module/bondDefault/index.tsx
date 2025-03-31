import { useState } from 'react';

import { useMemoizedFn } from 'ahooks';
import styled from 'styled-components';

import Tab from '@/components/tabBarWithExport';
import ModuleWrapper from '@/pages/area/areaCompany/components/moduleWrapper';
import DefaultDetail from '@/pages/area/areaCompany/module/bondDefault/defaultBond';
import DefaultSubject from '@/pages/area/areaCompany/module/bondDefault/defaultSubject';

const tabConf = [
  {
    name: '债券违约主体',
    content: null,
    key: 'area-default-subject',
  },
  {
    name: '债券违约明细',
    content: null,
    key: 'area-default-bond',
  },
];

export default () => {
  const [actived, setActived] = useState<string>(tabConf[0].key);

  const onTabChange = useMemoizedFn((t) => {
    setActived(t);
  });

  return (
    <Wrapper title="债券违约" id="areaBondDefault" loading={false} useOutLoadingStatus noTitleWrapper moduleWithTab>
      <div className="area-bond-default-tab-sticky-wrapper">
        <Tab tabConf={tabConf} defaultActiveKey={tabConf[0].key} onChange={onTabChange} />
      </div>
      {actived === 'area-default-subject' ? <DefaultSubject /> : <DefaultDetail />}
    </Wrapper>
  );
};

const Wrapper = styled((props) => <ModuleWrapper {...props} />)`
  .area-bond-default-tab-sticky-wrapper {
    position: sticky;
    top: 10px;
    background: #fff;
    z-index: 4;
    .ant-tabs-top {
      position: relative;
      overflow: visible;
      .ant-tabs-nav {
        background-color: #fff;
        margin: 0;
        box-shadow: none !important;
        &:before {
          z-index: 10;
          border-bottom: 1px solid rgba(1, 113, 246, 0.2);
        }
        .ant-tabs-ink-bar {
          visibility: hidden;
        }
        .ant-tabs-nav-wrap {
          .ant-tabs-tab {
            background: #f5f6f9;
            border-radius: 2px 2px 0px 0px;
            border: none !important;
            padding: 4px 16px 5px;
            font-size: 14px;
            font-weight: 400;
            color: #262626;
            line-height: 21px;
            .ant-tabs-tab-btn {
              transition: none;
            }
          }
          .ant-tabs-tab + .ant-tabs-tab {
            margin-left: 2px;
          }
          .ant-tabs-tab.ant-tabs-tab-active {
            background: #0171f6;
            .ant-tabs-tab-btn {
              color: #ffffff;
              font-weight: 500;
            }
          }
        }
      }
    }
  }
`;
