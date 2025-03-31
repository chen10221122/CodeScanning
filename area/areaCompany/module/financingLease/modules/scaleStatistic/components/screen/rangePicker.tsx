import { useMemoizedFn } from 'ahooks';

import { RangeSelect } from '@/components/screen';

export const Picker = ({
  type,
  onChange,
  disabledDate,
  ...restProps
}: {
  type: 'quarter' | 'year' | 'month';
  onChange: (changeType: string, data: any) => void;
  [key: string]: any;
}) => {
  const handleRangeChange = useMemoizedFn((value: any) => {
    onChange('range', value);
  });

  return (
    <>
      <RangeSelect
        compact
        onChange={handleRangeChange}
        disabledDate={disabledDate}
        customPicker={{
          picker: type,
          foldNode: <div>自定义</div>,
          separator: '到',
          placeholder: ['起始', '结束'],
        }}
        {...restProps}
      />
    </>
  );
};
