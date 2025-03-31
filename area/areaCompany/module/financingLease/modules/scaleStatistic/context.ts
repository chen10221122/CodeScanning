import createMiniStore from '@/utils/createMiniStore';

import { ChangeFilter } from './config';
import { Context } from './types';

const defaultContext = {
  loading: false,
  error: false,
  pageLoaded: false,
  key: undefined,
  showFullAreaName: false,
  activeAll: {
    [ChangeFilter.AREA]: false,
    [ChangeFilter.INDUSTRY]: false,
    [ChangeFilter.LESSEE_TYPE]: false,
    [ChangeFilter.LESSOR_TYPE]: false,
    [ChangeFilter.LESSOR_NATURE]: false,
    [ChangeFilter.LISTING_BONDISSUANCE]: false,
  },
};

export const { Provider, useDispatch, useSelector } = createMiniStore<Context>(defaultContext);
