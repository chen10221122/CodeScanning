import { SideMenuData, SubTitleKeyEnums, SubTitleNameMap } from './types';

// 目录树配置
export const menuArray = [
  {
    label: '区域银行业金融资源',
    children: [SubTitleKeyEnums.LoanScale, SubTitleKeyEnums.BankDistribution],
  },
];
/** 目录树 */
export const sideMenuData: SideMenuData[] = menuArray.map((item, idx) => ({
  label: item.label,
  children: item.children.map((code) => {
    const title = SubTitleNameMap.get(code);
    return {
      parentName: item.label,
      key: code,
      label: title || '',
      // 文字过多显示省略号
      title: title || '',
    };
  }),
}));

function flatMenu() {
  function _flatMenu(data: any[]) {
    let result: Record<string, any>[] = [];
    data.forEach((item) => {
      if (item.children?.length) {
        result = result.concat(_flatMenu(item.children));
      } else {
        result.push(item);
      }
    });
    return result;
  }
  return _flatMenu(sideMenuData) || [];
}

export const flatMenuData = flatMenu();

export const sortMap = new Map<string, string>([
  ['ascend', 'asc'],
  ['descend', 'desc'],
]);
