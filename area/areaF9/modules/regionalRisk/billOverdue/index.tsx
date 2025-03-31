import { KeepAlive } from 'react-activation';

import { Tabs } from '@dzh/components';
import styled from 'styled-components';

import { Tooltip } from '@/components/antd';
import HeaderRight from '@/pages/bond/billOverdue/components/headerRight';
import { Provider } from '@/pages/bond/billOverdue/context';
import Acceptor from '@/pages/bond/billOverdue/modules/acceptor';
import RelatedBond from '@/pages/bond/billOverdue/modules/relatedBond';

export enum OverdueType {
  acceptor,
  related,
}
const tooltipInfo = (
  <span style={{ fontSize: '12px', color: '#434343' }}>
    根据上海票据交易所披露的逾期名单，对承兑人做股权穿透，把满足一定持股比例的发债/上市股东（包含承兑人自身）作为关联主体
  </span>
);
const SubjectTitle = () => {
  return (
    <div className="title-wrapper">
      <div className="title-name">关联主体统计</div>
      <Tooltip
        color="#fff"
        arrowPointAtCenter
        placement={'bottom'}
        overlayStyle={{ maxWidth: '208px', color: '#434343', lineHeight: '18px' }}
        title={tooltipInfo}
        getTooltipContainer={() => document.getElementById('f9-bill-page') || document.body}
      >
        <div className="question-icon"></div>
      </Tooltip>
    </div>
  );
};
const TabsList = [
  { title: '承兑人票据逾期', key: OverdueType.acceptor, module: Acceptor },
  { title: SubjectTitle(), key: OverdueType.related, module: RelatedBond },
];

const BillOverdue = () => {
  return (
    <Wrapper id="f9-bill-page">
      <Tabs
        defaultActiveKey="acceptor"
        hideSplitBorder={false}
        tabBarExtraContent={
          <>
            <HeaderRight isF9={true} />
          </>
        }
        className="wrapper-tabs"
      >
        {TabsList.map((item) => {
          return (
            <Tabs.TabPane tab={item.title} key={item.key}>
              <KeepAlive key={item.key}>
                <item.module isF9={true}></item.module>
              </KeepAlive>
            </Tabs.TabPane>
          );
        })}
      </Tabs>
    </Wrapper>
  );
};
const Entry = () => {
  return (
    <Provider>
      <BillOverdue />
    </Provider>
  );
};

export default Entry;
const Wrapper = styled.div`
  height: 100%;
  overflow: hidden;
  .ant-tabs.ant-tabs-top.ant-tabs-middle.wrapper-tabs {
    position: relative;
    overflow: visible;
    height: 100%;
    .ant-tabs-nav {
      border-radius: 6px;
      position: sticky;
      top: 0;
      z-index: 10;
      background-color: #fff;
      margin: 0 20px;
      padding: 10px 0 0 0;
      &:before {
        z-index: 10;
        border-bottom: 1px solid rgba(1, 113, 246, 0.2);
      }
      .ant-tabs-ink-bar.ant-tabs-ink-bar-animated {
        opacity: 0;
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
          .title-wrapper {
            display: flex;
            align-items: center;
            .question-icon {
              width: 13px;
              height: 13px;
              margin-left: 4px;
              background: url(${require('@/pages/area/areaF9/modules/regionalRisk/billOverdue/images/question.png')})
                no-repeat;
              background-size: cover;
            }
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
          .question-icon {
            background: url(${require('@/pages/area/areaF9/modules/regionalRisk/billOverdue/images/question_active.png')})
              no-repeat;
            background-size: cover;
          }
        }
      }
    }
    .ant-tabs-content {
      height: 100%;
      .ant-tabs.ant-tabs-top.bottom-bar-tabs {
        .ant-tabs-nav {
          padding-top: 0;
          margin: 0 16px 0 0;
          height: 25px;
          z-index: 9;
          border-radius: 0 !important;
          border-bottom: none !important;
          .ant-tabs-tab {
            padding: 3px 10px;
            height: 24px;
            font-size: 12px;
            line-height: 18px;
            background: #f5f6f9;
            border-radius: 2px 2px 0px 0px;
          }
          .ant-tabs-tab.ant-tabs-tab-active {
            background: #eff6ff;
            border-radius: 2px 2px 0px 0px;
          }
          .ant-tabs-tab-active > .ant-tabs-tab-btn {
            color: #0171f6;
          }
          .ant-tabs-extra-content {
            display: flex;
            align-items: center;
            .close {
              width: 12px;
              height: 12px;
              cursor: pointer;
            }
          }
        }
      }
    }
  }
`;
