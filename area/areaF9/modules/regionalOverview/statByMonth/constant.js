import { ScreenType } from '@/components/screen';

export const currentYear = new Date().getFullYear().toString();

export const options = [
  {
    title: '指标',
    option: {
      type: ScreenType.MULTIPLE,
      children: [
        {
          name: '累计值',
          value: '1',
        },
        {
          name: '当月值',
          value: '2',
        },
        {
          name: '当季值',
          value: '3',
        },
      ],
    },
  },
];

// export const DateMap = new Map([
//   ['01', '1月'],
//   ['02', '2月'],
//   ['03', '3月'],
//   ['04', '4月'],
//   ['05', '5月'],
//   ['06', '6月'],
//   ['07', '7月'],
//   ['08', '8月'],
//   ['09', '9月'],
//   ['10', '10月'],
//   ['11', '11月'],
//   ['12', '12月'],
// ])

// export const quarterMap = new Map([
//   ['03', 'Q1'],
//   ['06', 'Q2'],
//   ['09', 'Q3'],
//   ['12', 'Q4'],
// ])
