import { SideMenuData, TitleNameEnums, SubTitleKeyEnums, SubTitleNameMap } from './types';

// 目录树配置
export const menuArray = [
  {
    label: '银行业金融资源',
    children: [SubTitleKeyEnums.LoanScale, SubTitleKeyEnums.BankDistribution],
  },
  {
    label: '债券融资(非金融企业)',
    children: [
      SubTitleKeyEnums.AreaBondNormalInventory,
      SubTitleKeyEnums.AreaBondNormalFinancing,
      SubTitleKeyEnums.AreaBondNormalIssue,
      SubTitleKeyEnums.AreaBondNormalReturn,
    ],
  },
  {
    label: '债券融资(金融企业)',
    children: [
      SubTitleKeyEnums.AreaBondFinancialInventory,
      SubTitleKeyEnums.AreaBondFinancialFinancing,
      SubTitleKeyEnums.AreaBondFinancialIssue,
      SubTitleKeyEnums.AreaBondFinancialReturn,
    ],
  },
  {
    label: '租赁融资',
    isVip: true,
    children: [
      SubTitleKeyEnums.AreaLeaseTotalInvest,
      SubTitleKeyEnums.AreaLeaseFlow,
      SubTitleKeyEnums.AreaLeaseExpirationEvent,
    ],
  },
  {
    label: '股权融资',
    children: [
      SubTitleKeyEnums.AreaStockA,
      SubTitleKeyEnums.AreaPlatform,
      SubTitleKeyEnums.AreaIpo,
      SubTitleKeyEnums.AreaStockHK,
      SubTitleKeyEnums.AreaStockThird,
      SubTitleKeyEnums.AreaVc,
    ],
  },
];
// 需要VIP的节点
export const VIP_MENU_KEYS = [
  TitleNameEnums[3] + SubTitleKeyEnums.AreaLeaseTotalInvest,
  TitleNameEnums[3] + SubTitleKeyEnums.AreaLeaseFlow,
  TitleNameEnums[3] + SubTitleKeyEnums.AreaLeaseExpirationEvent,
];
/** 目录树 */
export const sideMenuData: SideMenuData[] = menuArray.map((item, idx) => ({
  label: item.label,
  isVip: item.isVip,
  children: item.children.map((code) => {
    const title = SubTitleNameMap.get(code);
    return {
      parentName: item.label,
      key: TitleNameEnums[idx] + code,
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
