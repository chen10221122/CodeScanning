// import { DatePicker } from '@dzh/components';
// import dayJs, { Dayjs } from 'dayjs';
// import { isArray } from 'lodash';

import { Options, ScreenType } from '@/components/screen';

// const { RangePicker } = DatePicker;

// const curYear = dayJs().year();
// const curDayStr = dayJs().format('YYYY-MM-DD');
// const disabledDate = (date: Dayjs) => date?.isAfter(dayJs());

// const dateList = [
//   { name: `${curYear}`, value: `[${curYear}-01-01,${curYear}-12-31]`, active: true },
//   { name: `${curYear - 1}`, value: `[${curYear - 1}-01-01,${curYear - 1}-12-31]` },
//   { name: `${curYear - 2}`, value: `[${curYear - 2}-01-01,${curYear - 2}-12-31]` },
//   { name: '近一年', value: `[${dayJs().subtract(1, 'year').format('YYYY-MM-DD')},${curDayStr}]` },
//   { name: '近三年', value: `[${dayJs().subtract(3, 'year').format('YYYY-MM-DD')},${curDayStr}]` },
//   { name: '近五年', value: `[${dayJs().subtract(5, 'year').format('YYYY-MM-DD')},${curDayStr}]` },
//   {
//     name: '自定义日期',
//     value: null,
//     render: () => (
//       /* @ts-ignore */
//       <RangePicker size="small" allowClear={false} disabledDateStart={disabledDate} disabledDateEnd={disabledDate} />
//     ),
//   },
// ];

export const getOptions = (isDetail: boolean): Options[] => {
  const typeList = [
    { name: '成交起始日', value: 'dealDate', active: isDetail, field: 'type' },
    { name: '合同签订日', value: 'contractSignDate', field: 'type' },
  ];
  return [
    {
      title: '类型 ',
      option: {
        type: ScreenType.SINGLE,
        cancelable: false,
        children: isDetail
          ? typeList
          : [{ name: '出让起始日', value: 'transferDate', active: true, field: 'type' }, ...typeList],
      },
      formatTitle: (selected) => {
        return selected[0]?.name;
      },
    },
    // {
    //   title: '日期',
    //   ellipsis: 22,
    //   option: {
    //     type: ScreenType.SINGLE,
    //     cancelable: false,
    //     children: dateList.map((item) => ({ ...item, field: 'date' })),
    //   },
    //   formatTitle: (selected) => {
    //     const { name, value } = selected[0];
    //     return isArray(value)
    //       ? `${dayJs(value[0]).format('YYYY-MM-DD')}至${dayJs(value[1]).format('YYYY-MM-DD')}`
    //       : name;
    //   },
    // },
  ];
};
