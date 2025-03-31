import { memo } from 'react';

import styled from 'styled-components';

import { BondFicancialParams } from '@/pages/area/areaCompany/api/regionFinancingApi';
import { LABELCOLOR, LABELTEXTCOLOR } from '@/pages/bond/overdue/hooks/useColumn';
import { highlight } from '@/utils/dom';

import CompanyLink from './CompanyLink';

interface Props {
  type: 'company' | 'co';
  data: Record<string, any>;
  pageParams?: BondFicancialParams;
}

const CompanyWithSpecialTags = ({ type, data, pageParams }: Props) => {
  const { name, code, tags } = data;
  const content = pageParams?.text ? highlight(name, pageParams.text) : name;

  return (
    <div>
      <span style={{ marginRight: '4px' }}>
        <CompanyLink code={code} type={type} text={content} />
      </span>
      {tags?.length
        ? tags.map((item: string, index: number) => (
            <LabelWrap
              key={index}
              style={{
                background: LABELCOLOR.get(item) || '#FEF4ED',
                color: LABELTEXTCOLOR.get(item) || '#FE934B',
              }}
            >
              {item}
            </LabelWrap>
          ))
        : null}
    </div>
  );
};

export default memo(CompanyWithSpecialTags);

export const LabelWrap = styled.span`
  line-height: 18px;
  font-size: 12px;
  padding: 2px 4px;
  margin-right: 4px;
  word-break: keep-all;
  display: inline-block;
`;
