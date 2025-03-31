import { useState, createContext, memo } from 'react';
import KeepAlive, { fixContext } from 'react-activation';

import { LINK_AREA_REGIONSOCIALFINANCE } from '@/configs/routerMap';
import { useSelector } from '@/pages/area/areaF9/context';
import SeeMore from '@/pages/area/areaFinancingBoard/components/seeMore';
// import useAreaInfo from '@/pages/area/areaFinancingBoard/hooks/useAreaInfo';
import { dynamicLink } from '@/utils/router';
import { urlJoin } from '@/utils/url';

import { Wrapper, Header } from '../../components/moduleWrapper/styles';
import Fitter from './components/Fitter';
import Tab from './components/Tab';
import useTab, { TabType } from './hooks/useTab';
import Enterprise from './modules/enterprise';
import Region from './modules/region';

interface Context {
  year: string; //年度
  setYear: React.Dispatch<React.SetStateAction<string>>;
  // loading: boolean;
  setRenderScreen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const FinancingScaleContext = createContext<Context>({
  year: '',
  // loading: true,
  setYear: () => {},
  setRenderScreen: () => {},
});

fixContext(FinancingScaleContext);

//企业融资规模
const FinancingScale = ({ county }: { county: boolean }) => {
  const { areaInfo } = useSelector((store) => ({ areaInfo: store.areaInfo }));
  const { tabConfig, tab, onTabChange } = useTab();
  const [year, setYear] = useState('');
  const [renderScreen, setRenderScreen] = useState(true);

  return (
    <FinancingScaleContext.Provider value={{ year, setYear, setRenderScreen }}>
      <Wrapper height={237} ratio={64} mini>
        <Header>
          <Tab {...{ tabConfig, tab, onTabChange, county }} />
          <div style={{ display: tab === TabType.ENTERPRISE ? '' : 'none' }}>
            {renderScreen ? <Fitter setYear={setYear} /> : null}
          </div>
          <div style={{ display: tab === TabType.REGION ? '' : 'none' }}>
            <SeeMore
              link={urlJoin(dynamicLink(LINK_AREA_REGIONSOCIALFINANCE, { code: areaInfo?.regionCode as string }))}
            />
          </div>
        </Header>
        {tab === TabType.ENTERPRISE ? (
          <KeepAlive id={tab} name={tab}>
            <Enterprise />
          </KeepAlive>
        ) : null}
        {tab === TabType.REGION ? (
          <KeepAlive id={tab} name={tab}>
            <Region />
          </KeepAlive>
        ) : null}
      </Wrapper>
    </FinancingScaleContext.Provider>
  );
};

export default memo(FinancingScale);
