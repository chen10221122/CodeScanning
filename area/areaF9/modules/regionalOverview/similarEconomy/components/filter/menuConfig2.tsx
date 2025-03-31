import { useMemo } from 'react';

import { RangeInput } from '@dzh/components';
import { Options, ScreenType } from '@dzh/screen';
export default function useMenuConfig(initYear: string) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const yearOption: { name: string; value: string; key: string }[] = [];
  for (let i = new Date().getFullYear(); i > new Date().getFullYear() - 10; i--) {
    let s = i.toString();
    yearOption.push({
      name: s,
      value: s,
      key: 'endDate',
    });
  }

  const yearMenu: Options[] = useMemo(() => {
    return [
      {
        title: '年份',
        option: {
          type: ScreenType.SINGLE,
          default: initYear,
          children: yearOption,
          cancelable: false,
        },
        formatTitle: (selectedRows: any[]) => {
          return selectedRows.map((item: { name: any }) => item.name).join(',');
        },
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initYear]);

  const deviationMenu: Options[] = useMemo(() => {
    return [
      {
        title: '偏离度绝对值',
        ellipsis: 11,
        option: {
          type: ScreenType.SINGLE,
          default: '[-5,5]',
          children: [
            ...[
              ['≤5%', '[-5,5]'],
              ['≤15%', '[-15,15]'],
              ['≤20%', '[-20,20]'],
              ['≤30%', '[-30,30]'],
            ].map(([name, value]) => ({ name, value, projectValue: 'balance' })),
            {
              name: '自定义',
              value: null,
              key: 'deviationRange',
              render: () => <RangeInput useConfirm unit="%" />, // 参考样式 租赁融资事件 https://dev.qyyjt.cn/finance/financingLease/overview
            },
          ],
        },
        formatTitle: (selectedRows: { value: string | string[]; name: string }[]) => {
          let text = '';
          if (selectedRows.length) {
            text =
              selectedRows[0].name === '自定义'
                ? '[' + (selectedRows[0].value as string[])?.join(',') + ']'
                : selectedRows.map((item) => item.name)?.join(',');
          }
          return <span>{'偏离度绝对值' + text}</span>;
        },
        overlayStyle: { zIndex: 101 },
      },
    ];
  }, []);

  return { yearMenu, deviationMenu };
}
