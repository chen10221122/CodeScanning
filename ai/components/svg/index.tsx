import withComponentMap from './base';
import Area from './images/area.svg?react';
import AreaHover from './images/area_hover.svg?react';
import Back from './images/back.svg?react';
import BackHover from './images/back_hover.svg?react';
import Bond from './images/bond.svg?react';
import BondHover from './images/bond_hover.svg?react';
import Company from './images/company.svg?react';
import CompanyHover from './images/company_hover.svg?react';
import Copy from './images/copy.svg?react';
import CopyHover from './images/copy_hover.svg?react';
import Reload from './images/reload.svg?react';
import ReloadHover from './images/reload_hover.svg?react';
import Search from './images/search.svg?react';
import SearchHover from './images/search_hover.svg?react';
import Zan from './images/zan.svg?react';
import ZanHover from './images/zan_hover.svg?react';

const ComponentMap = {
  copy: {
    hover: CopyHover,
    default: Copy,
  },
  reload: {
    hover: ReloadHover,
    default: Reload,
  },
  back: {
    hover: BackHover,
    default: Back,
  },
  zan: {
    hover: ZanHover,
    default: Zan,
  },
  search: {
    hover: SearchHover,
    default: Search,
  },
  company: {
    hover: CompanyHover,
    default: Company,
  },
  area: {
    hover: AreaHover,
    default: Area,
  },
  bond: {
    hover: BondHover,
    default: Bond,
  },
};

// Iamge 组件 作为基类 接受 ComponentMap 生成不同的组件
const Image = withComponentMap(ComponentMap);
export default Image;
