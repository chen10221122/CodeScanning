import { memo } from 'react';

import { formatNumber } from '@/utils/format';

const emptyFilter = (val: number | string) => {
  return val || val === 0 ? val : '-';
};

interface IProps {
  data: {
    [key: string]: any;
  };
}
const PlatformInfo = ({ data }: IProps) => {
  const countList = [
    {
      label: '平台家数',
      value: emptyFilter(data?.total),
      unit: '家',
    },
    {
      label: '有息债务',
      value: emptyFilter(formatNumber(data?.interestBearingDebt)),
      unit: '亿元',
    },
    {
      label: '短期债务',
      value: emptyFilter(formatNumber(data?.shortTermDebt)),
      unit: '亿元',
    },
    {
      label: '债券融资',
      value: emptyFilter(formatNumber(data?.bondFinancing)),
      unit: '亿元',
    },
    {
      label: '非标融资',
      value: emptyFilter(formatNumber(data?.nonStandardFinancing)),
      unit: '亿元',
    },
  ];

  return (
    <ul className="count-list">
      {countList.map((o, i) => {
        return (
          <li className="count-list-item" key={i}>
            <p className="content">
              <span className="value">{o.value}</span>
              <span className="unit">{o.unit}</span>
            </p>
            <p className="label">{o.label}</p>
          </li>
        );
      })}
    </ul>
  );
};

export default memo(PlatformInfo);
