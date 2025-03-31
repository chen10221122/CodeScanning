import { memo } from 'react';

import styled from 'styled-components';

import Detail from './detail';
import Map from './map';

export interface GraphItem {
  regionName: string;
  indicValue: string;
}
export interface InfoItem {
  name: string;
  value: string;
  url: string;
}
interface Iprops {
  data: {
    dataSource?: string;
    indicGraph?: GraphItem[];
    indicYear?: string;
    regionName?: string;
    url?: string;
    infos?: InfoItem[];
    indicValue?: string;
    [key: string]: any;
  };
  regionCode: string;
  closePopover: (show: boolean) => void;
}

export default memo(({ data, regionCode, closePopover }: Iprops) => {
  const { indicGraph, indicYear, regionName, indicValue, ...restDetailInfo } = data;

  return (
    <SynopsisWrapper>
      <Map
        regionCode={regionCode}
        indicGraph={indicGraph}
        indicYear={indicYear}
        regionName={regionName}
        indicValue={indicValue}
      />
      <Detail {...restDetailInfo} closePopover={closePopover} />
    </SynopsisWrapper>
  );
});

const SynopsisWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 1067px;
  height: 485px;
  background: #ffffff;
  padding: 24px 20px;
`;
