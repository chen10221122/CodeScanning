import bx from '@/pages/full/financingInstitution/data/config_bx.js';
import jj from '@/pages/full/financingInstitution/data/config_jj.js';
import xt from '@/pages/full/financingInstitution/data/config_xt.js';
import yh from '@/pages/full/financingInstitution/data/config_yh.js';
import zl from '@/pages/full/financingInstitution/data/config_zl.js';
import zq from '@/pages/full/financingInstitution/data/config_zq.js';

import { TabsMap } from './tabsConfig';

const filterTitle = '地区';
const filterArea = (config: any[]) => config.filter((item) => item.title !== filterTitle);

const config: { [key: string]: any[] } = {
  [TabsMap.YH]: filterArea(yh),
  [TabsMap.ZQ]: filterArea(zq),
  [TabsMap.BX]: filterArea(bx),
  [TabsMap.XT]: filterArea(xt),
  [TabsMap.ZL]: filterArea(zl),
  [TabsMap.JJ]: filterArea(jj),
};

export default config;
