import { ComponentType } from 'react';

import { YH, ZQ, BX, XT, ZL, JJ } from '@/pages/area/areaEconomy/modules/financialInstitutions/tableSource_full';

import { TabsMap } from './tabsConfig';

//  table 组件映射
const config: { [key: string]: ComponentType<any> } = {
  [TabsMap.YH]: YH,
  [TabsMap.ZQ]: ZQ,
  [TabsMap.BX]: BX,
  [TabsMap.XT]: XT,
  [TabsMap.ZL]: ZL,
  [TabsMap.JJ]: JJ,
};

export default config;
