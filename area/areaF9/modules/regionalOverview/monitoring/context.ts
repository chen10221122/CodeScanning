import { ThirdSelectRowItem } from '@dzh/screen';

import createMiniStore from '@/utils/createMiniStore';

export interface ModalStatus {
  visible: boolean;
  data: Record<string, any>;
}

interface MonitoringCtxProps {
  /** 筛选缓存数据 */
  cacheData: {
    industryCache?: ThirdSelectRowItem[];
  };

  /** 全局弹窗状态 */
  modalStatus: {
    /** 趋势弹窗 */
    trendModal: ModalStatus;
    /** 负面新闻弹窗 */
    newsDetailModal: ModalStatus;
    /** vip弹窗 */
    vipModal: boolean;
  };
}

export const getDefaultModalStatus = () => ({
  visible: false,
  data: {},
});
export const trendModalDefaultStatus = getDefaultModalStatus();
export const newsDetailModalDefaultStatus = getDefaultModalStatus();

export const initMonitoringCtx: MonitoringCtxProps = {
  cacheData: {
    industryCache: undefined,
  },
  modalStatus: {
    trendModal: trendModalDefaultStatus,
    newsDetailModal: newsDetailModalDefaultStatus,
    vipModal: false,
  },
};

export const { Provider, useDispatch, useSelector } = createMiniStore(initMonitoringCtx);
