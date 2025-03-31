export const PAGESIZE = 50;
export const STARTHMS = '000000';
export const ENDHMS = '235959';

export enum ModuleEnum {
  /**区域动态 */
  AREA = 'area',
  /**行业动态 */
  INDUSTRY = 'industry',
  /**企业动态 */
  COMPANY = 'company',
}

export const modulTypeMap = new Map([
  ['regionTrends', 'area'],
  ['industryTrends', 'industry'],
  ['companyTrends', 'company'],
]);
