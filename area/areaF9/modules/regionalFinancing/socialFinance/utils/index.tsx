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
