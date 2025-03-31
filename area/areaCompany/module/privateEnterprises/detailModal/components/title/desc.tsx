import { FC } from 'react';

import styled from 'styled-components';

import { LinkToFile } from '@/pages/area/areaCompany/components/tableCpns/openOrDownloadFiles';
import { DescProps, descMap } from '@/pages/area/areaCompany/module/privateEnterprises/config';

const Desc: FC<{ descInfo: DescProps }> = ({ descInfo }) => {
  return (
    <DescStyle>
      {Array.from(descMap.entries()).map(([title, key]) => {
        const val = descInfo[key as keyof DescProps];
        return val ? (
          <span className="desc-item" key={title}>
            <span className="desc-name">{title}：</span>
            <span className="desc-value">{title === '原文' ? <LinkToFile originalText={val} /> : val}</span>
          </span>
        ) : null;
      })}
    </DescStyle>
  );
};

export default Desc;

const DescStyle = styled.div`
  .desc-item {
    margin-right: 32px;
    .desc-name {
      height: 20px;
      font-size: 13px;
      color: #434343;
      line-height: 20px;
      margin-right: 4px;
    }
    .desc-value {
      height: 20px;
      font-size: 13px;
      color: #141414;
      line-height: 20px;
    }
  }
`;
