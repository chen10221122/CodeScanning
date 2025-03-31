import { memo } from 'react';

import LineEllipsis from './lineEllipsis';

interface Props {
  province: string;
  city: string;
  county: string;
  line?: number;
}

/* 所属地区 */
const Area = ({ province, city, county, line = 1 }: Props) => {
  if (!province) {
    return <>-</>;
  } else if (!city && county) {
    return <LineEllipsis text={`${province}-${county}`} line={line} />; //直辖市
  } else if (!city && !county) {
    return <LineEllipsis text={province} line={line} />;
  } else if (city && !county) {
    return <LineEllipsis text={`${province}-${city}`} line={line} />;
  } else {
    return <LineEllipsis text={`${province}-${city}-${county}`} line={line} />;
  }
};

export default memo(Area);
