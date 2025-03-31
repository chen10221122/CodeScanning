import { useEffect, useRef } from 'react';

import { cloneDeep, get } from 'lodash';

import { Path } from '@/pages/area/areaEconomy/config/pathConfig';
import { useCtx } from '@/pages/area/areaEconomy/provider/getContext';
import { useImmer } from '@/utils/hooks';

import { isMunicipality } from '../../common';
import { Level } from '../../config';

type ILevel = typeof Level[keyof typeof Level];

const initTabsConfig = [
  { tab: '区域经济', key: Path.REGION_ECONOMY },
  { tab: '辖区经济', key: Path.UNDER_AREA },
  { tab: '相似经济', key: Path.SIMILAR_ECONOMY },
  { tab: '产业结构', key: Path.INDUSTRY_STRUCTURE, isNew: true },
  { tab: '城投平台', key: Path.PLATFORMS },
  { tab: '金融机构', key: Path.FINANCIAL_INSTITUTIONS, isNew: true },
  { tab: '地区利差', key: Path.AREA_SPREADS },
  { tab: '地方债发行', key: Path.LOCAL_DEBT_ISSUE },
  { tab: '专项债项目', key: Path.SPECIAL_DEBT_PROJECTS },
  { tab: '地区社融', key: Path.REGION_SOCIAL_FINANCE },
  { tab: '区域观点', key: Path.AREA_VIEWPOINT, isNew: true },
  { tab: '区域舆情', key: Path.AREA_PUBLISH, isNew: true },
];

const levelTwoExclude = [Path.LOCAL_DEBT_ISSUE, Path.REGION_SOCIAL_FINANCE];
const levelThreeExclude = [Path.UNDER_AREA, Path.INDUSTRY_STRUCTURE, Path.LOCAL_DEBT_ISSUE, Path.REGION_SOCIAL_FINANCE];
const planSingleCityExclude = [Path.REGION_SOCIAL_FINANCE];

const getConfigByLevel = (level: ILevel) => {
  const config = cloneDeep(initTabsConfig);
  if (level === Level.CITY) {
    return config.filter((item) => !levelTwoExclude.includes(item.key));
  } else if (level === Level.COUNTY) {
    return config.filter((item) => !levelThreeExclude.includes(item.key));
  }
  return config;
};

//计划单列市大连-210200、青岛-370200、宁波-330200、厦门-350200、深圳-440300
const planSingleCity = [210200, 370200, 330200, 350200, 440300];

export default function useTabsConfig() {
  // 初始化当前的地区行政级别
  const cacheLevel = useRef<ILevel>(Level.PROVINCE);
  const [tabsConfig, setTabsConfig] = useImmer(cloneDeep(initTabsConfig));
  const { state } = useCtx();
  const areaInfo = state && state?.areaInfo;
  const regionCode = state.code;
  useEffect(() => {
    //计划单列市虽然是地级市也要显示地方债发行
    if (planSingleCity.includes(+regionCode)) {
      cacheLevel.current = 0;
      const config = cloneDeep(initTabsConfig).filter((item) => !planSingleCityExclude.includes(item.key));
      setTabsConfig(() => config);
      return;
    }
    if (areaInfo) {
      let level = get(areaInfo, 'regionInfo[0].level', 1);
      // 省直辖县级行政区，level = 3 逻辑
      if (isMunicipality(regionCode)) {
        level = Level.COUNTY;
      }
      if (level !== cacheLevel.current) {
        cacheLevel.current = level;
        setTabsConfig(() => getConfigByLevel(level));
      }
    }
  }, [areaInfo, setTabsConfig, regionCode]);

  return { tabsConfig, setTabsConfig };
}
