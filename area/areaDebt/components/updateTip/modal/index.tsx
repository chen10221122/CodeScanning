import { OpenDataSourceDrawer } from '@/components/dataSource';

import CalculateIndicModal from './calculateIndicModal';
import IndicModal from './indicModal';

export interface Info {
  title: string;
  year: string;
  pageCode: string;
  /** 指标名称 - 用作计算指标更新弹窗中的请求参数，或者非计算指标更新弹窗中的表头显示 */
  indicName: string;
  regionCode: string;
  regionName?: string;
  /** 指标名称 - 用作非计算指标更新弹窗中的请求参数, 例如：页面显示GDP, 参数要传"地区生产总值" */
  indicName2?: string;
  unit?: string;
  activeTab?: number; // 当前激活tab
  tab2Info?: Record<string, any>;
}

export interface UpdateModalIprops {
  /** 是否是计算指标 */
  isCalculateIndic?: boolean;
  visible: boolean;
  /** 弹窗内的请求参数和标题信息 */
  info: Info;
  /** 关闭弹窗 */
  onClose: Function;
  /** 打开普通指标更新提示弹窗 */
  openOridinaryIndiCModal?: Function;
  /** 弹窗挂载的容器 */
  container: React.ReactDOM | React.ReactElement | HTMLElement;
  // 打开侧边 pdf 弹窗
  openDataSource?: OpenDataSourceDrawer;
}

export default ({ isCalculateIndic, ...restProps }: UpdateModalIprops) => {
  // CalculateIndicModal 债务率 IndicModal 政府性基金收入
  return isCalculateIndic ? <CalculateIndicModal {...restProps} /> : <IndicModal {...restProps} />;
};
