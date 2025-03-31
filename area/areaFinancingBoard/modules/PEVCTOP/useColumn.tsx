import { useMemo } from 'react';

const colors = ['#FFA200', '#8199A6', '#C19774', '#BCBCBC', '#BCBCBC', '#BCBCBC'];

const useColumn = (year: string[]) => {
  const [firstYear, secondYear, thirdYear] = year;
  const columns = useMemo(
    () => [
      {
        title: '排名',
        dataIndex: 'rank',
        width: 50,
        align: 'left',
        className: 'pdd-8',
        render: (text: string, obj: any, i: number) => <span style={{ color: colors[i] }}>{text || '-'}</span>,
      },
      {
        title: `${firstYear || '-'}`,
        dataIndex: 'year1',
        width: 100,
        align: 'right',
        className: 'pdd-8',
        render: (text: string, obj: any, i: number) => <span>{text || '-'}</span>,
      },
      {
        title: `${secondYear || '-'}`,
        dataIndex: 'year2',
        width: 100,
        align: 'right',
        className: 'pdd-8',
        render: (text: string, obj: any, i: number) => <span>{text || '-'}</span>,
      },
      {
        title: `${thirdYear || '-'}`,
        dataIndex: 'year3',
        width: 100,
        align: 'right',
        className: 'pdd-8',
        render: (text: string, obj: any, i: number) => <span>{text || '-'}</span>,
      },
    ],
    [firstYear, secondYear, thirdYear],
  );

  const scrollX = useMemo(() => {
    return columns.reduce((acc, cur) => acc + cur.width, 0);
  }, [columns]);

  return { scrollX, columns };
};

export default useColumn;
