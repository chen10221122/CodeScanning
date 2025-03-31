import React from 'react';

import { AreaCompare } from '@/apis/area/type.define';
import createContext from '@/utils/createContext';

export interface ContextType {
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  areaData: AreaCompare.areaIndicator[];
  setAreaData: (f: (draft: AreaCompare.areaIndicator[]) => void | AreaCompare.areaIndicator[]) => void;
  setAreas: (f: (draft: AreaCompare.areaItem[]) => void | AreaCompare.areaItem[]) => void;
  scrollTop: number;
  indicators: AreaCompare.indicator[] | null;
  setSearchAreaData: (f: (draft: AreaCompare.areaItem[][]) => void | AreaCompare.areaItem[][]) => void;
  openSource: boolean;
  hoverIdx: number;
  setHoverIdx: React.Dispatch<React.SetStateAction<number>>;
  // ToggleIndicator: (f: (draft: string[]) => void | string[]) => void;
}

// for modal context
export const AreaContext = React.createContext<ContextType>({} as ContextType);

type ContextState = {
  count: {
    [p: string]: number;
  };
  /** 切换地区的下标值,用于地区切换弹窗 */
  areaChangeIndex: number;
  level: number;
  limited: number;
  remainCount: number;
  /** 带有省本级的选中地区数据 */
  selectedAreaDataWithSelfLevel: any;
  inViewport: boolean;
  /** 指标弹窗开关 */
  chartModalVisible: boolean;
  indicator: string;
  indicatorName: string;
  /** 已选指标id集合 */
  indexIds: string[];
  /** 已选指标树 */
  indicatorTree: any[];
  /** 年份 */
  date: string;
};

export const [useCtx, Provider] = createContext<ContextState>({
  count: {},
  inViewport: true,
  areaChangeIndex: -1,
  indicator: '',
  indicatorName: '',
  chartModalVisible: false,
  selectedAreaDataWithSelfLevel: [
    { value: '110000', isSelfLevel: true },
    { value: '310000', isSelfLevel: true },
    { value: '120000', isSelfLevel: true },
    { value: '500000', isSelfLevel: true },
  ],
} as ContextState);
