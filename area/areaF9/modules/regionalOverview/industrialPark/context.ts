import { createContext } from 'react';
import { fixContext } from 'react-activation';

import type { TableData } from './modules/main/type';

export interface Context {
  aMap: React.MutableRefObject<any>;
  mapStatus: boolean;
  isOpenEnterprise: boolean;
  enterpriseParams: {
    devZoneName: string;
    devZoneCode: string;
  };
  isOpenMap: boolean;
  mapParams: {
    devZoneName: string;
    devZoneCode: string;
    devZoneSquare: string;
    devZoneArea: string;
    centerCoordinates: string;
    closureCoordinates: string;
    areaCode: string;
  };
  setAreaCode: React.Dispatch<React.SetStateAction<string>>;
  handleOpenEnterpriseModal: (row: TableData) => void;
  setEnterpriseFalse: () => void;
  handleOpenMapModal: (row: TableData) => void;
  setMapFalse: () => void;
}

const IndustrialParkContext = createContext<Context>({} as Context);

fixContext(IndustrialParkContext);

export default IndustrialParkContext;
