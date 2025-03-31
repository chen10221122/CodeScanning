import { memo } from 'react';

import classNames from 'classnames';

import { NormalLink } from '@/pages/area/areaCompany/components/tableCpns/linkToF9';

interface Props {
  type: string;
  code: string;
  text: string;
}

const CompanyLink = ({ type, code, text }: Props) => {
  return (
    <NormalLink type={type} code={code}>
      <span className={classNames({ 'link pointer': code })}>{text || '-'}</span>
    </NormalLink>
  );
};

export default memo(CompanyLink);
