import createContext from '@/utils/createContext';

interface CommonState {
  overview: {
    statisticsIndicators: any[];
    statisticsDefault: any[];
    detailIndicators: any[];
    detailDefault: any[];
  };
  agreementTransfer: {
    statisticsIndicators: any[];
    statisticsDefault: any[];
    detailIndicators: any[];
    detailDefault: any[];
  };
}

export const [useCtx, Provider] = createContext<CommonState>({
  overview: {
    statisticsIndicators: [],
    statisticsDefault: [],
    detailIndicators: [],
    detailDefault: [],
  },
  agreementTransfer: {
    statisticsIndicators: [],
    statisticsDefault: [],
    detailIndicators: [],
    detailDefault: [],
  },
});
