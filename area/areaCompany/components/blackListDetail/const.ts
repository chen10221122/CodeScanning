export const registerCapital = [
  ['10亿及以上', '[1000000000,*)'],
  ['1-10亿', '[100000000,1000000000)'],
  ['5000万-1亿', '[50000000,100000000)'],
  ['1000-5000万', '[10000000,50000000)'],
  ['1000万以下', '[0,10000000)'],
].map(([name, value]) => ({
  name: name as string,
  value,
  field: 'registerCapital',
}));

export const blackListRegisterCapital = [
  ['5000万及以上', '[50000000,*)'],
  ['1000万-5000万', '[10000000,50000000)'],
  ['500-1000万', '[5000000,10000000)'],
  ['100-500万', '[1000000,5000000)'],
  ['0-100万', '[0,1000000)'],
].map(([name, value]) => ({
  name: name as string,
  value,
  field: 'registerCapital',
}));

export const registerStatus = [
  ['在营', '1'],
  ['吊销', '2,21,22'],
  ['注销', '3'],
  ['迁出', '4'],
  ['撤销', '5'],
  ['其他', '8,6,9_02,9_03,9_04,9_05,999999'],
].map(([name, value]) => ({
  name,
  value,
  field: 'registerStatus',
}));
// export const registerStatus = [
//   ['在营', '在营'],
//   ['吊销', '吊销'],
//   ['注销', '注销'],
//   ['迁出', '迁出'],
//   ['撤销', '撤销'],
//   ['其他', '其他'],
// ].map(([name, value]) => ({
//   name,
//   value,
//   field: 'registerStatus',
// }));

export const establishDate = [
  ['1年内', '1年内'],
  ['1-5年', '1-5年'],
  ['5-10年', '5-10年'],
  ['10-15年', '10-15年'],
  ['15年以上', '15年以上'],
].map(([name, value]) => ({
  name,
  value,
  field: 'establishDate',
}));
