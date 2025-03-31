import createContext from '@/utils/createContext';

import { ITechEnterpriseContext } from '../types';

/** 企业状态 */
export enum ENTERPRISE_STATUS {
  /** 已撤销 */
  REVOKED = 2,
  /** 未撤销 */
  NOT_REVOKE = 1,
}

export const defaultSelectArea = { name: '全国', shortName: '全国', value: '100000', key: 1 };

export const [useCtx, Provider] = createContext<ITechEnterpriseContext>({
  areaTree: [],
  loopList: [],
  selectedAreaList: [defaultSelectArea],
  enterpriseStatus: ENTERPRISE_STATUS.NOT_REVOKE,
  selectedTarget: undefined,
  chartLoading: false,
  fullLoading: true,
  areaOrTagChangeMaskLoading: false,
  emptyStatus: false,
});
