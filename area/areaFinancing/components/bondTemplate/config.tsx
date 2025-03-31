import dayJs from 'dayjs';

import { DatePicker, RangePicker } from '@/components/antd';

/** 日期选择类型 */
enum YearOptionEnum {
  DateRange,
  Date,
}

const customDateRangeRender = {
  name: '',
  value: null,
  key: 'year',
  render: () => (
    <RangePicker
      size="small"
      keepValidValue={true}
      disabledDate={() => false}
      allowClear={false}
      format={'YYYY-MM-DD'}
    />
  ),
};

const customDateRender = {
  name: '自定义日期',
  value: dayJs(),
  key: 'date',
  active: true,
  render: () => (
    <DatePicker
      size="small"
      allowClear={false}
      format={(value) => `${value.format('YYYY-MM-DD')}${dayJs(value).isToday() ? '(最新)' : ''}`}
    />
  ),
};

export { YearOptionEnum, customDateRangeRender, customDateRender };
