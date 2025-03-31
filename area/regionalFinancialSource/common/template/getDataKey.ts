import {
  AREA_F9_AREA_REGIONALFINANCIALSOURCE_FUND,
  AREA_F9_AREA_REGIONALFINANCIALSOURCE_FUTURES,
  AREA_F9_AREA_REGIONALFINANCIALSOURCE_INSURANCEINSURANCE,
  AREA_F9_AREA_REGIONALFINANCIALSOURCE_SEC,
} from '@/configs/localstorage';

import { pageFlag } from '../const';
import { PageFlag } from '../type';

const getDataKey = (flag: PageFlag) => {
  switch (flag) {
    case pageFlag.SEC:
      return AREA_F9_AREA_REGIONALFINANCIALSOURCE_SEC;
    case pageFlag.FUND:
      return AREA_F9_AREA_REGIONALFINANCIALSOURCE_FUND;
    case pageFlag.FUTURES:
      return AREA_F9_AREA_REGIONALFINANCIALSOURCE_FUTURES;
    case pageFlag.INSURANCEINSURANCE:
      return AREA_F9_AREA_REGIONALFINANCIALSOURCE_INSURANCEINSURANCE;
    default:
      return `area_f9_area_regionalfinancialsource_${pageFlag}`;
  }
};

export default getDataKey;
