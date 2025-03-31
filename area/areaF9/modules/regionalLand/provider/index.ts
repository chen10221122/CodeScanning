import createContext from '@/utils/createContext';

interface CommonState {
  /**招拍挂 */
  overview: {
    /**全部指标 */
    detailIndicators: any[];
    /**默认选中指标 */
    detailDefault: any[];
  };
  /**协议划拨 */
  agreementTransfer: {
    detailIndicators: any[];
    detailDefault: any[];
  };
}

export const [useCtx, Provider] = createContext<CommonState>({
  overview: {
    detailIndicators: [],
    detailDefault: [],
  },
  agreementTransfer: {
    detailIndicators: [],
    detailDefault: [],
  },
});
