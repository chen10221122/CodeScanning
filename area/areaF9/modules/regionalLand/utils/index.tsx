/**
 * 每隔三位用，隔开
 * @param target 数字或字符串
 * @example formatThreeNumber('1300') 1,300
 * @attention 如果传入的number类型小数位都为0，转化后小数位会丢失
 */
export const formatThreeNumber = (target: number | string): string => {
  if (typeof target === 'number') {
    target = String(target);
  }
  const formatReg = target?.includes('.') ? /(?=(\B)(\d{3})+\.)/g : /(?=(\B)(\d{3})+$)/g;
  let ret = '';
  let symbol = '';
  if (target?.[0] === '-') {
    symbol = target[0];
    target = target.substring(1) || '';
  }
  for (let i = 0; i < target?.length; i++) {
    let cur = target?.[i];
    if (/\d|[.]/g.test(cur)) ret += cur;
  }
  return symbol + ret.replace(formatReg, ',');
};

// 格式化年月季类型的日期，用于明细弹窗传参
export const formatTime = (date: string) => {
  const yearRegex = /^(\d{4})$/; // 年份格式
  const monthRegex = /^(\d{4})-(\d{2})$/; // 年月格式
  const quarterRegex = /^(\d{4})年([一二三四])季度$/; // 年季度格式
  const halfYearRegex = /^(\d{4})年(上半年|下半年)$/; // 上半年或下半年格式

  // 处理年份格式（例：'2024'）
  const yearMatch = date.match(yearRegex);
  if (yearMatch) {
    const year = yearMatch[1];
    return [`${year}-01-01`, `${year}-12-31`];
  }

  // 处理年月格式（例：'2024-10'）
  const monthMatch = date.match(monthRegex);
  if (monthMatch) {
    const year = monthMatch[1];
    const month = monthMatch[2].padStart(2, '0'); // 确保月份格式是两位数
    const lastDay = new Date(Number(year), Number(month), 0).getDate(); // 获取该月的最后一天
    return [`${year}-${month}-01`, `${year}-${month}-${lastDay}`];
  }

  // 处理年季度格式（例：'2024年四季度'）
  const quarterMatch = date.match(quarterRegex);
  if (quarterMatch) {
    const year = quarterMatch[1];
    const quarter = quarterMatch[2];
    let startMonth, endMonth;
    switch (quarter) {
      case '一':
        startMonth = 1;
        endMonth = 3;
        break;
      case '二':
        startMonth = 4;
        endMonth = 6;
        break;
      case '三':
        startMonth = 7;
        endMonth = 9;
        break;
      case '四':
        startMonth = 10;
        endMonth = 12;
        break;
      default:
        return '';
    }
    const startDate = `${year}-${startMonth.toString().padStart(2, '0')}-01`;
    const endDate = `${year}-${endMonth.toString().padStart(2, '0')}-${new Date(Number(year), endMonth, 0).getDate()}`;
    return [startDate, endDate];
  }
  // 处理半年格式（例：'2024年上半年'）
  const halfYearMatch = date.match(halfYearRegex);
  if (halfYearMatch) {
    const year = halfYearMatch[1];
    const halfYear = halfYearMatch[2];
    let startMonth, endMonth;
    if (halfYear === '上半年') {
      startMonth = 1; // 1月-6月
      endMonth = 6;
    } else if (halfYear === '下半年') {
      startMonth = 7; // 7-12月
      endMonth = 12;
    } else {
      return '';
    }
    const startDate = `${year}-${startMonth.toString().padStart(2, '0')}-01`;
    const endDate = `${year}-${endMonth.toString().padStart(2, '0')}-${new Date(Number(year), endMonth, 0).getDate()}`;
    return [startDate, endDate];
  }
  return '';
};

// 从表格中提取需要的数据
export const extractedData = (properties: string[], sortedData: any[]) => {
  return properties.reduce((acc: { [key: string]: any[] }, property: string) => {
    acc[property] = sortedData.map((item) => item[property]);
    return acc;
  }, {});
};

// 格式化日期，用于图数据按年份升序
export const formatDate = (date: string) => {
  const yearRegex = /^(\d{4})$/; // 年份格式
  const monthRegex = /^(\d{4})-(\d{2})$/; // 年月格式
  const quarterRegex = /^(\d{4})年([一二三四])季度$/; // 年季度格式
  const halfYearRegex = /^(\d{4})年(上半年|下半年)$/; // 上半年或下半年格式

  // 处理年份格式（例：'2024'）
  const yearMatch = date.match(yearRegex);
  if (yearMatch) {
    const year = yearMatch[1];
    return `${year}`;
  }

  // 处理年月格式（例：'2024-10'）
  const monthMatch = date.match(monthRegex);
  if (monthMatch) {
    const year = monthMatch[1];
    const month = monthMatch[2].padStart(2, '0'); // 确保月份格式是两位数
    return `${year}${month}`;
  }

  // 处理年季度格式（例：'2024年四季度'）
  const quarterMatch = date.match(quarterRegex);
  if (quarterMatch) {
    const year = quarterMatch[1];
    const quarter = quarterMatch[2];
    let startMonth;
    switch (quarter) {
      case '一':
        startMonth = 1;
        break;
      case '二':
        startMonth = 4;
        break;
      case '三':
        startMonth = 7;
        break;
      case '四':
        startMonth = 10;
        break;
      default:
        return '';
    }
    return `${year}${startMonth.toString().padStart(2, '0')}`;
  }
  // 处理半年格式（例：'2024年上半年'）
  const halfYearMatch = date.match(halfYearRegex);
  if (halfYearMatch) {
    const year = halfYearMatch[1];
    const halfYear = halfYearMatch[2];
    let startMonth;
    if (halfYear === '上半年') {
      startMonth = 1; // 1月-6月
    } else if (halfYear === '下半年') {
      startMonth = 7; // 7-12月
    } else {
      return '';
    }
    return `${year}${startMonth.toString().padStart(2, '0')}`;
  }
  return '';
};
