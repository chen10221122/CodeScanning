import { request } from '@/app/libs/request';

export interface RegionEconomyTreeItemInterface {
  /** 全称 */
  branchFullName: string;
  /** 节点ID */
  branchID: string;
  key: string;
  /** 节点名 */
  branchName: string;
  title: string;
  /** 节点路径 */
  branchPath: string;
  /** 节点显示名 */
  branchShowName: string;
  /** 节点显示名 */
  businessType: string;
  /** 同结构（嵌套） */
  childTree?: RegionEconomyTreeItemInterface[];
  children?: RegionEconomyTreeItemInterface[];
  /** 数据类别 */
  child_type: string;
  /** 是否默认折叠（0：不折叠；1：折叠） */
  closed: number;
  /** Excel导出（0：屏蔽导出，1：展示导出） */
  exportData: number;
  /** 是否禁止添加到常用（0：允许添加常用；1：禁止添加常用） */
  forbidAdd: number;
  /** 帮助文档 */
  helpLink: string;
  /** 图标 */
  icon: string;
  /** 是否数据节点 */
  isData: number;
  /** 限制跳转（0：无限制；1：无数据（灰、限制跳转）；2：待上线（限制跳转）） */
  limitOption: number;
  isHide: boolean;
  disabled: boolean;
  /** 节点类型 */
  nodeType: number;
  /** 原始图标 */
  originalIcon: string;
  /** 上级节点ID */
  rootBranchID: string;
  /** 页面横屏（0：不支持；1：支持） */
  rotate: number;
  /** 是否截长图（0：否；1：是） */
  screenShot: number;
  /** 显示更多（0：不显示；1：显示） */
  showMore: number;
  /** 显示父级（0：不显示；1：显示） */
  showParent: number;
  /** 显示顺序 */
  sort: number;
  /** 角标样式 */
  tag: Tag;
  /** 树唯一码 */
  treeId: string;
  /** 跳转url */
  url: string;
  /** 显示vip图标 */
  showVipIcon: boolean;
  /** 没有访问权限 */
  noAccess: boolean;
  /** 没有权限的具体信息内容 */
  noAccessDes: any;
  /** 隐藏在底部的下一页 */
  hiddenInNextPage?: boolean;
  /** 路径节点是否是最后的标识 */
  path?: string[];
}
export interface Tag {
  /** 角标底色 */
  color: string;
  /** 角标数字 */
  countLabel: string;
  /** 角标文字 */
  label: string;
  /** 角标地址 */
  url: string;
}

/** 获取目录树数据 */
export const getRegionEconomyTree = (
  regionCode: string,
): Promise<{ data: { data: { treeType: string; treeList: RegionEconomyTreeItemInterface[] }[] } }> => {
  return request.get('/finchinaAPP/directoryTree/getWebRegionEconomyTree.action', {
    params: { regionCode, version: 'V6.0.0' },
  });
};
/** 获取银行金融资源目录树数据 */
export const getBankRegionEconomyTree = (
  regionCode: string,
): Promise<{ data: { data: { treeType: string; treeList: RegionEconomyTreeItemInterface[] }[] } }> => {
  return request.get('/finchinaAPP/directoryTree/getBankWebRegionEconomyTree.action', {
    params: { regionCode, version: 'V6.0.0' },
  });
};
