export enum Frequency {
  MONTH = 1, // 月
  QUARTER = 2, // 季度
  HULF_YEAR = 3, // 半年
  YEAR = 4, // 年
}

export const FrequencyText = {
  [Frequency.MONTH]: '月',
  [Frequency.QUARTER]: '季',
  [Frequency.HULF_YEAR]: '半年',
  [Frequency.YEAR]: '年',
};

export const FrequencySelectItems = [
  { name: FrequencyText[Frequency.MONTH], value: Frequency.MONTH },
  { name: FrequencyText[Frequency.QUARTER], value: Frequency.QUARTER },
  { name: FrequencyText[Frequency.HULF_YEAR], value: Frequency.HULF_YEAR },
  { name: FrequencyText[Frequency.YEAR], value: Frequency.YEAR },
];
