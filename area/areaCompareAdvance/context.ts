import React from 'react';

import { AreaCompare } from '@/apis/area/type.define';
import { ContextState, AreaSelectModalType } from '@/pages/area/areaCompareAdvance/types';
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

export enum LIMIT_SELECT {
  VIP = 100,
  NORMAL = 8,
}

// for modal context
export const AreaContext = React.createContext<ContextType>({} as ContextType);

export const [useCtx, Provider] = createContext<ContextState>({
  count: {},
  inViewport: true,
  areaChangeIndex: -1,
  indicator: '',
  indicatorName: '',
  chartModalVisible: false,
  // showModal: true,
  // showPayLimit: true,
  isEmptyLineOpen: true,
  isToolOpen: false,
  isExpandAll: true,
  firstMainLoading: true,
  indicatorLen: 0,
  selectedAreaDataWithSelfLevel: [],
  areaSelectType: AreaSelectModalType,
} as unknown as ContextState);
