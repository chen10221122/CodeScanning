import createContext from '@/utils/createContext';

interface CommonState {
  firstLoading: boolean;
  noData: boolean;
}

export const defaultContext: CommonState = {
  firstLoading: true,
  noData: false,
};

export const [useCtx, Provider] = createContext<CommonState>(defaultContext);
