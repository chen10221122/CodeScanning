import { useEffect, useState } from 'react';

import img_01 from '@/assets/images/area/header_item01.png';
import img_02 from '@/assets/images/area/header_item02.png';
import img_03 from '@/assets/images/area/header_item03.png';
import img_04 from '@/assets/images/area/header_item04.png';
import img_05 from '@/assets/images/area/header_item05.png';
import ChartLayout from '@/pages/area/areaEconomy/components/mainTop/chartLayout';
import { formatNumber } from '@/utils/format';

// 上方卡片默认配置
const defaultChartConfig = [
  {
    data: {
      title: 'GDP(亿元)',
      colorType: 0,
    },
    widthChart: true,
  },
  {
    data: {
      title: 'GDP增速(%)',
      colorType: 1,
    },
    widthChart: true,
  },
  {
    data: {
      title: '人口(万人)',
      colorType: 2,
    },
    widthChart: true,
  },
  {
    data: {
      title: '一般公共预算收入(亿元)',
      colorType: 0,
    },
    widthChart: true,
  },
  {
    data: {
      title: '政府性债务余额(亿元)',
      colorType: 1,
    },
    widthChart: true,
  },
  {
    data: {
      title: '下属辖区',
    },
    widthChart: false,
    backgroundImg: img_01,
  },
  {
    data: {
      title: '融资平台',
    },
    widthChart: false,
    backgroundImg: img_02,
  },
  {
    data: {
      title: '融资平台有息债务(亿元)',
      text: '',
    },
    widthChart: false,
    backgroundImg: img_03,
  },
  {
    data: {
      title: '地方债余额(亿元)',
    },
    widthChart: false,
    backgroundImg: img_05,
  },
  {
    data: {
      title: '专项债项目',
    },
    widthChart: false,
    backgroundImg: img_04,
  },
];

// 头部卡片数据结构
const getColumnData = (item: never, opts = {}) => {
  return Object.assign(
    {
      text: formatNumber(item['latestValue']),
      valueArr: item['valueArr'],
      changedValue: item['changedValue'],
      changedType: item['changedType'],
      smallUnit: true,
      unit: '亿',
    },
    opts,
  );
};

function ChartLayOutContainer({
  mainTopData,
  areaDataInfo,
  hasGdpYear,
}: {
  mainTopData: never[];
  areaDataInfo: any;
  hasGdpYear: any;
}) {
  // 头部卡片配置
  const [chartConfigArr, setChartConfigArr] = useState<any>(defaultChartConfig);

  // 根据接口渲染头部卡片
  useEffect(() => {
    const lastyear = hasGdpYear ? hasGdpYear + '年' : '';

    if (mainTopData?.length && areaDataInfo) {
      setChartConfigArr([
        {
          data: getColumnData(mainTopData[0], {
            title: `${lastyear}GDP`,
            colorType: 0,
          }),
          widthChart: true,
        },
        {
          data: getColumnData(mainTopData[1], {
            title: `${lastyear}GDP增速`,
            text: formatNumber(mainTopData[1]['latestValue'], 2),
            colorType: 1,
            unit: '%',
          }),
          widthChart: true,
        },
        {
          data: getColumnData(mainTopData[2], {
            title: `${lastyear}人口`,
            colorType: 2,
            unit: '万',
          }),
          widthChart: true,
        },
        {
          data: getColumnData(mainTopData[3], {
            title: `${lastyear}一般公共预算收入`,
            colorType: 0,
          }),
          widthChart: true,
        },
        {
          data: getColumnData(mainTopData[4], {
            title: `${lastyear}地方政府债务余额`,
            colorType: 1,
            tooltipText:
              '地方政府债务余额采用全省、全市、全区县口径，在数据采集过程中存在部分地区未披露，则采集市级口径。若仍未有披露，则取一般债余额与专项债余额的合计，未披露的指标以0代替，可能会造成部分年份数据间的差距较大。',
          }),
          widthChart: true,
        },
        {
          data: {
            title: '下属辖区',
            text: (areaDataInfo as any)?.childregionCount == 0 ? '-' : (areaDataInfo as any)?.childregionCount, // eslint-disable-line
            unit: (areaDataInfo as any)?.childregionCount == 0 ? '' : '个', // eslint-disable-line
          },
          widthChart: false,
          backgroundImg: img_01,
        },
        {
          data: {
            title: '城投平台',
            text: (areaDataInfo as any)?.financingPlatformInfo?.total,
            unit: '家',
          },
          widthChart: false,
          backgroundImg: img_02,
        },
        {
          data: {
            title: '城投平台有息债务',
            text: formatNumber(mainTopData[5]['latestValue']),
            tooltipText:
              '城投平台有息债务是该地区行政区划下所有的城投公司的有息债务余额合计，部分城投平台因存在控股关系，剔除重复计算部分。有息债务余额=短期债务+长期债务，其中，短期债务=短期借款+一年内到期的非流动负债+应付短期债券+拆入资金+卖出回购金融资产款+向中央银行借款+吸收存款及同业存放+交易性金融负债，长期债务=长期借款+应付长期债券+长期应付款+租赁负债。数据主要来源于城投平台公司发债的信息披露。实际统计中，存在部分城投平台未发债或未公开披露有息债务数据，会造成城投平台有息债务的低估。',
            unit: '亿',
          },
          widthChart: false,
          backgroundImg: img_03,
        },
        {
          data: {
            title: '地方债余额',
            text: formatNumber((areaDataInfo as any)?.distributionstatInfo?.amount),
            tooltipText:
              '地方债余额是该地区政府（省、自治区、直辖市、含经省级政府批准自办债券发行的计划单列市政府）发行的一般债券和专项债券累计额的合计。其中，计划单列市和省、自治区、直辖市分别按地区统计，省级有计划单列市的，计划单列市单独统计，省级不在对计划单列市合并统计。存量统计截止到当天日期。',
            unit: '亿',
          },
          widthChart: false,
          backgroundImg: img_05,
        },
        {
          data: {
            title: '专项债项目',
            text: (areaDataInfo as any)?.stat_count?.projectNum,
            tooltipText:
              '专项债项目是该地区政府（省、自治区、直辖市、含经省级政府批准自办债券发行的计划单列市政府）债券存续期内的专项债建设项目个数的合计。专项债项目个数统计截止到当天日期，部分项目可能涉及多个专项债,剔除重复计算部分。',
            unit: '个',
          },
          widthChart: false,
          backgroundImg: img_04,
        },
      ]);
    } else {
      setChartConfigArr(defaultChartConfig);
    }
  }, [areaDataInfo, mainTopData, hasGdpYear]);

  return <ChartLayout list={chartConfigArr} />;
}

export default ChartLayOutContainer;
