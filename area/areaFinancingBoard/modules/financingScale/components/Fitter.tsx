import { useRef, useCallback, useMemo, memo } from 'react';

import { Screen, Options, ScreenType, RowItem } from '@/components/screen';

interface Props {
  setYear: React.Dispatch<React.SetStateAction<string>>;
}

const startYear = new Date().getFullYear(); // 获取当前年份

export const years = new Array(10).fill(startYear).map((item, i) => (item - i).toString());

const data = years.map((item) => {
  return {
    name: item + '年',
    value: item,
  };
});

const Fitter = ({ setYear }: Props) => {
  const domRef = useRef(null);

  const dataConfig: Options[] = useMemo(
    () => [
      {
        title: '按年度',
        option: {
          type: ScreenType.SINGLE,
          default: data[0].value,
          children: data,
        },
      },
    ],
    [],
  );

  const onChange = useCallback(
    (current: RowItem[]) => {
      let year = current[0].value;
      setYear(year);
    },
    [setYear],
  );
  return (
    <div ref={domRef}>
      <Screen options={dataConfig} onChange={onChange} getPopContainer={() => domRef.current!} />
    </div>
  );
};

export default memo(Fitter);
