import { FC, memo } from 'react';

import { SourceListProp } from '@/pages/area/areaF9/modules/regionalOverview/industryPlaning/api';
import { SubTitleStyle } from '@/pages/area/areaF9/style';

import SourceItem from './sourceItem';
import { SourceStyle } from './style';

const Source: FC<{
  data: SourceListProp[];
}> = ({ data }) => {
  return (
    <SourceStyle>
      <SubTitleStyle className="industry-planing-source-title">来源</SubTitleStyle>
      {data.map((item) => (
        <SourceItem key={item.title} {...item} />
      ))}
    </SourceStyle>
  );
};

export default memo(Source);
