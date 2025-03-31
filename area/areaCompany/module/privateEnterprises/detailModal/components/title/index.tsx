import { FC, useMemo } from 'react';

import styled from 'styled-components';

import { Screen, ScreenType, Options, RowItem } from '@/components/screen';

interface TitleProps {
  title: string;
  years: Record<string, any>[];
  onYearChange: (cur: RowItem[], all: RowItem[], idx: number) => void;
}

const getConfig: (years: Record<string, any>[]) => Options[] = (years) => {
  const op = years.map((item, idx) => ({
    ...(item as RowItem),
    key: 'tagYear',
    active: !idx,
  }));
  return [
    {
      title: '榜单年份',
      option: {
        cancelable: false,
        default: op[0].value,
        type: ScreenType.SINGLE,
        children: op,
      },
    },
  ];
};
const TitleContianer: FC<TitleProps> = ({ title, years, onYearChange }) => {
  const yearConfig = useMemo(() => (years && years.length ? getConfig(years) : []), [years]);

  return (
    <TitleStyle>
      <span className="title-header">{title}</span>
      <Screen options={yearConfig} onChange={onYearChange} />
    </TitleStyle>
  );
};

export default TitleContianer;

const TitleStyle = styled.div`
  display: flex;
  align-items: center;
  /* margin-bottom: 4px; */
  .title-header {
    height: 27px;
    font-size: 18px;
    font-weight: 500;
    color: #141414;
    line-height: 27px;
    margin-right: 12px;
  }
`;
