import { useMemo } from 'react';

import { useMemoizedFn } from 'ahooks';

import { Options, Screen, ScreenType } from '@/components/screen';

export const TableHeadFilter = ({ data, onChange }: { data?: any; onChange: any }) => {
  const options: Options[] = useMemo(() => {
    if (data) {
      return [
        {
          title: data.name,
          formatTitle: (row) => `${data.name} ${row.length || ''}`,
          option: {
            type: ScreenType.MULTIPLE,
            children: data.children?.map((o: Record<string, any>) => ({ ...o, key: data.value })),
          },
        },
      ];
    }
    return [];
  }, [data]);
  const handleChange = useMemoizedFn((selectedArr) => {
    onChange(data.value, selectedArr);
  });
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Screen options={options} onChange={handleChange} />
    </div>
  );
};
