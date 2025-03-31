import createContext from '@/utils/createContext';

export enum GraphModuleName {
  /** 地区分布 */
  Area = 'area',
  /** 年份分布 */
  Year = 'year',
  /** 存续周期 */
  Duration = 'duration',
  /** 企业规模 */
  Enterprise = 'enterprise',
  /** 经营状态 */
  Status = 'status',
}

export type GraphCtxProps = {
  [key in GraphModuleName]: {
    isLoadEnd: boolean;
    error?: boolean | Error;
    empty?: boolean;
  };
};

const defaultCtx = {
  [GraphModuleName.Area]: { isLoadEnd: false },
  [GraphModuleName.Year]: { isLoadEnd: false },
  [GraphModuleName.Duration]: { isLoadEnd: false },
  [GraphModuleName.Enterprise]: { isLoadEnd: false },
  [GraphModuleName.Status]: { isLoadEnd: false },
};

export const [useCtx, Provider] = createContext<GraphCtxProps>(defaultCtx);
