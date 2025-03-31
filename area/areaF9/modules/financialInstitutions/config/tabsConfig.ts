// tabs 枚举
export enum TabsMap {
  YH = 'bank',
  ZQ = 'bond',
  BX = 'insurance',
  XT = 'trust',
  ZL = 'rent',
  JJ = 'fund',
}

// export type ITabsMap = keyof typeof TabsMap;

export const tabOptions = [
  { title: '银行', value: TabsMap.YH, countKey: 'bankNumber' },
  { title: '证券', value: TabsMap.ZQ, countKey: 'bondNumber' },
  { title: '保险', value: TabsMap.BX, countKey: 'insuranceNumber' },
  { title: '信托', value: TabsMap.XT, countKey: 'trustNumber' },
  { title: '租赁', value: TabsMap.ZL, countKey: 'rentNumber' },
  { title: '基金', value: TabsMap.JJ, countKey: 'fundNumber' },
];
