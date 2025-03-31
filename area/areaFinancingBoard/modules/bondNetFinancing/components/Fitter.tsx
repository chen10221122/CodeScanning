import { useRef, useCallback, useMemo, memo } from 'react';

import { Screen, Options, ScreenType, RowItem } from '@/components/screen';

interface Props {
  setCondition: React.Dispatch<
    React.SetStateAction<{
      timeType: string;
      bondType: string;
    }>
  >;
}

const Fitter = ({ setCondition }: Props) => {
  const domRef = useRef(null);

  const dataConfig: Options[] = useMemo(
    () => [
      {
        title: '按年度',
        option: {
          type: ScreenType.SINGLE,
          default: '1',
          children: [
            {
              name: '按年度',
              value: '1',
              key: 'timeType',
            },
            {
              name: '按季度',
              value: '2',
              key: 'timeType',
            },
          ],
        },
      },
      {
        title: '债券类型',
        option: {
          type: ScreenType.SINGLE,
          children: [
            {
              name: '全部债项',
              value: '',
              key: 'bondType',
            },
            {
              name: '城投债',
              value: '1',
              key: 'bondType',
            },
            {
              name: '产业债',
              value: '2',
              key: 'bondType',
            },
            {
              name: '地方政府债',
              value: '3',
              key: 'bondType',
            },
            {
              name: '金融债',
              value: '4',
              key: 'bondType',
            },
            {
              name: '公募债',
              value: '5',
              key: 'bondType',
            },
            {
              name: '私募债',
              value: '6',
              key: 'bondType',
            },
            {
              name: '地方债+城投债',
              value: '1,3',
              key: 'bondType',
            },
          ],
        },
      },
    ],
    [],
  );

  const onChange = useCallback(
    (_: RowItem[], allSelectedRows: RowItem[]) => {
      const obj: Record<string, any> = {};
      allSelectedRows.forEach((item) => {
        obj[item.key] = item.value;
      });
      setCondition(() => {
        return { timeType: '', bondType: '', ...obj };
      });
    },
    [setCondition],
  );
  return (
    <div ref={domRef} style={{ marginRight: 16 }}>
      <Screen options={dataConfig} onChange={onChange} getPopContainer={() => domRef.current!} />
    </div>
  );
};

export default memo(Fitter);
