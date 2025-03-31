import { CustomValueType } from '../../utils';

export const CardMetricTips = {
  REGION_10000276:
    '地方政府债务余额采用全省、全市、全区县口径，在数据采集过程中存在部分地区未披露，则采集市级口径。若仍未有披露，则取一般债余额与专项债余额的合计，未披露的指标以0代替，可能会造成部分年份数据间的差距较大。',
  REGION_10000297:
    '城投平台有息债务是该地区行政区划下所有的城投公司的有息债务余额合计，部分城投平台因存在控股关系，剔除重复计算部分。有息债务余额=短期债务+长期债务，其中，短期债务=短期借款+一年内到期的非流动负债+应付短期债券+交易性金融负债，长期债务=长期借款+应付长期债券。数据主要来源于城投平台公司发债的信息披露。实际统计中，存在部分城投平台未发债或未公开披露有息债务数据，会造成城投平台有息债务的低估。',
  地方债余额:
    '地方债余额是该地区政府（省、自治区、直辖市、含经省级政府批准自办债券发行的计划单列市政府）发行的一般债券和专项债券累计额的合计。其中，计划单列市和省、自治区、直辖市分别按地区统计，省级有计划单列市的，计划单列市单独统计，省级不在对计划单列市合并统计。存量统计截止到当天日期。',
  REGION_10000343:
    '地方债存量规模是该地区政府（省、自治区、直辖市、含经省级政府批准自办债券发行的计划单列市政府）发行的一般债券和专项债券累计额的合计。其中，计划单列市和省、自治区、直辖市分别按地区统计，省级有计划单列市的，计划单列市单独统计，省级不在对计划单列市合并统计。存量统计截止到当天日期。',
  专项债项目:
    '专项债项目是该地区政府（省、自治区、直辖市、含经省级政府批准自办债券发行的计划单列市政府）债券存续期内的专项债建设项目个数的合计。专项债项目个数统计截止到当天日期，部分项目可能涉及多个专项债,剔除重复计算部分。',
};

// export const HasImgIndexIds = ['REGION_10000010', 'REGION_10000297', 'REGION_10000409', 'REGION_10000343'];
export const CardMetricUnits = {
  REGION_10000343: '亿',
  地方债余额: '亿',
  专项债项目: '个',
};

export type Data = {
  title?: string;
  chartTitle?: string;
  text?: string;
  valueArr?: Array<any>; // 画图所需数据
  changedValue?: number;
  colorType?: any; // 0:蓝 1:绿 2:黄
  changedType?: 'up' | 'down'; // changedValue箭头上下 'up':'down'
  tooltipText?: string;
  unit?: string;
  smallUnit?: boolean;
  indexId?: string;
  chartValue?: Record<string, any>[];
  nationalRank?: {
    // 全国排名数据
    denominator: string;
    molecule: string;
  };
  provinceRank?: {
    // 省内排名数据
    denominator: string;
    molecule: string;
  };
  hasChart?: 0 | 1 | boolean;
  chartType?: string;
  // 是否加载成功
  success?: boolean;
  /** 是否自定义指标 */
  isCustom?: boolean;
  /** 自定义指标数据类型 */
  customValueType?: CustomValueType;
};

export interface CardItem {
  data: Data;
  backgroundImg?: string;
  withChart?: boolean;
}
