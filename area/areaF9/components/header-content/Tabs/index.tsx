import { memo } from 'react';
import KeepAlive from 'react-activation';

import styled from 'styled-components';

import ListTable from '@/pages/area/areaF9/components/header-content/Tag/listTable';
import { useTrackPageTabChangeFn } from '@/pages/detail/common/useTrackPageTabChange';
import Tab from '@/pages/detail/enterprise/components/tab';
import useTab from '@/pages/detail/enterprise/components/tab/useTab';

interface TabProps {
  /** 城市群、都市圈code */
  code: string;
  setCode: Function;
  /** 是否溯源 */
  traceSource: boolean;
  /** tab配置 */
  tabConfig: any;
  /** 是否是人口规模标签 */
  isCity?: boolean;
  /** 关闭内外层浮窗 */
  handleClose: () => void;
}

const Tabs = ({ traceSource, tabConfig, isCity, handleClose, code, setCode }: TabProps) => {
  const { tabs, tab, onTabChange } = useTab({ tabs: tabConfig });
  // const [code, setCode] = useState(tabConfig[0].code);
  // Tab切换埋点
  const trackPageTabChange = useTrackPageTabChangeFn(onTabChange, (raw) => {
    setCode(raw.code);

    if (tab !== raw.key) {
      return [{ title: raw.name }];
    }
  });

  return (
    <Container>
      <Tab tabs={tabs} tab={tab} onTabChange={trackPageTabChange} />
      <KeepAlive id={tab} name={tab}>
        <div className="table-container">
          <ListTable
            traceSource={traceSource}
            data={[]}
            handleClose={handleClose}
            isCity={isCity}
            code={code}
            title={tab}
          />
        </div>
      </KeepAlive>
    </Container>
  );
};

export default memo(Tabs);

export const Container = styled.div`
  > div:first-of-type {
    margin-right: 3px;
    padding: 0 14px;
  }
  .ka-wrapper {
    padding: 0;
  }

  .cut-off {
    box-shadow: none;
    padding-bottom: 0px;
    .tab {
      padding: 4px 12px;
      height: 30px;
      line-height: 20px;
      background: #ffffff;
      border: 1px solid #f2f4f9;
      border-radius: 4px 4px 0px 0px;
      font-size: 13px;
      font-weight: Regular;
      color: #434343;
    }
    .tab-active {
      background: #f8faff;
      font-weight: Medium;
      color: #0171f6;
    }
  }
`;
