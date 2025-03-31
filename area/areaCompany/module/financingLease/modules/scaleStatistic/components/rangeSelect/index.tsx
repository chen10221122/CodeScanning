import { useEffect, useState } from 'react';

import { useMemoizedFn } from 'ahooks';
import dayJs, { Dayjs } from 'dayjs';
import styled from 'styled-components';

import RangePicker from '@/components/antd/rangePicker';

interface RangeSelectProps {
  onChange: (range: any, d?: any) => void;
  defaultValue: [Dayjs, Dayjs];
  disabledDate?: (date: Dayjs) => boolean;
  containerRef?: any;
  picker?: any;
}

export default function RangeSelect({ onChange, defaultValue, disabledDate, containerRef, picker }: RangeSelectProps) {
  const [rangeValue, setRangeValue] = useState<[Dayjs, Dayjs]>();

  const handleRangeChange = useMemoizedFn((date: any) => {
    setRangeValue(date);
    onChange(date);
  });

  useEffect(() => {
    const [start, end] = defaultValue;
    start && end && setRangeValue([dayJs(start), dayJs(end)]);
  }, [setRangeValue, defaultValue]);

  return (
    <Swapper className="time_picker">
      <RangePicker
        size="small"
        separator="至"
        value={rangeValue}
        disabledDate={disabledDate}
        picker={picker}
        onChange={(date: any) => handleRangeChange(date)}
        getPopupContainer={() => (containerRef?.current as HTMLElement) || document.body}
      />
    </Swapper>
  );
}

const Swapper = styled.div``;
