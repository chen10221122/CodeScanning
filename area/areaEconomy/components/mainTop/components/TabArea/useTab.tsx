import { useMemo } from 'react';

import loadable from '@loadable/component';

import { Path } from '@/pages/area/areaEconomy/config/pathConfig';

// 加载子模块
const loadableConfig = {
  fallback: <div style={{ position: 'relative', width: '100%', minHeight: '200px' }} />,
};

const RegionEconomy = loadable(() => import('@/pages/area/areaEconomy/modules/region'), loadableConfig),
  UnderArea = loadable(() => import('@/pages/area/areaEconomy/modules/underArea'), loadableConfig),
  SimilarEconomy = loadable(() => import('@/pages/area/areaEconomy/modules/similar'), loadableConfig),
  IndustryStructure = loadable(() => import('@/pages/area/areaEconomy/modules/industryStructure'), loadableConfig),
  RegionSocialFinance = loadable(() => import('@/pages/area/areaEconomy/modules/socialFinance'), loadableConfig),
  Platforms = loadable(() => import('@/pages/area/areaEconomy/modules/platforms'), loadableConfig),
  AreaSpreads = loadable(() => import('@/pages/area/areaEconomy/modules/areaSpreads'), loadableConfig),
  LocalDebtIssue = loadable(() => import('@/pages/area/areaEconomy/modules/localDebtIssue'), loadableConfig),
  SpecialDebtProjects = loadable(() => import('@/pages/area/areaEconomy/modules/specialDebt'), loadableConfig),
  ScientificEnterprises = loadable(
    () => import('@/pages/area/areaEconomy/modules/scientificEnterprises'),
    loadableConfig,
  ),
  FinancialInstitutions = loadable(
    () => import('@/pages/area/areaEconomy/modules/financialInstitutions'),
    loadableConfig,
  ),
  BlackList = loadable(() => import('@/pages/area/areaEconomy/modules/blackList'), loadableConfig),
  AreaViewpoint = loadable(() => import('@/pages/area/areaEconomy/modules/areaViewpoint'), loadableConfig),
  RegionalList = loadable(() => import('@/pages/area/areaEconomy/modules/areaRank'), loadableConfig),
  AreaPublish = loadable(() => import('@/pages/area/areaEconomy/modules/areaPublish'), loadableConfig);

// preload
RegionEconomy.preload();

export default function useTab() {
  const tabConf = useMemo(() => {
    return [
      {
        name: '区域经济',
        key: '1',
        innerTabCfg: {
          tabConf: [
            {
              name: '地区经济',
              content: <RegionEconomy />,
              key: Path.REGION_ECONOMY,
            },
            {
              name: '辖区经济',
              content: <UnderArea />,
              key: Path.UNDER_AREA,
            },
            {
              name: '相似经济',
              content: <SimilarEconomy />,
              key: Path.SIMILAR_ECONOMY,
            },
            {
              name: '产业结构',
              content: <IndustryStructure />,
              key: Path.INDUSTRY_STRUCTURE,
            },
          ],
        },
      },
      {
        name: '区域融资',
        key: '2',
        innerTabCfg: {
          tabConf: [
            {
              name: '地区社融',
              content: <RegionSocialFinance />,
              key: Path.REGION_SOCIAL_FINANCE,
            },
            {
              name: '地方债发行',
              content: <LocalDebtIssue />,
              key: Path.LOCAL_DEBT_ISSUE,
            },
            {
              name: '专项债项目',
              content: <SpecialDebtProjects />,
              key: Path.SPECIAL_DEBT_PROJECTS,
            },
          ],
        },
      },
      {
        name: '城投平台',
        key: '3',
        innerTabCfg: {
          tabConf: [
            {
              name: '城投平台',
              content: <Platforms />,
              key: Path.PLATFORMS,
            },
            {
              name: '地区利差',
              content: <AreaSpreads />,
              key: Path.AREA_SPREADS,
            },
          ],
        },
      },
      {
        name: '金融机构',
        key: '4',
        innerTabContent: <FinancialInstitutions />,
        innerTabCfg: {
          isQuick: true,
          tabConf: [
            {
              name: '银行',
              content: null,
              key: Path.FINANCIAL_INSTITUTIONS_BANK,
            },
            {
              name: '证券公司',
              content: null,
              key: Path.FINANCIAL_INSTITUTIONS_BOND,
            },
            {
              name: '保险公司',
              content: null,
              key: Path.FINANCIAL_INSTITUTIONS_INSURANCE,
            },
            {
              name: '信托公司',
              content: null,
              key: Path.FINANCIAL_INSTITUTIONS_TRUST,
            },
            {
              name: '租赁公司',
              content: null,
              key: Path.FINANCIAL_INSTITUTIONS_RENT,
            },
            {
              name: '基金公司',
              content: null,
              key: Path.FINANCIAL_INSTITUTIONS_FUND,
            },
          ],
        },
      },
      {
        name: '区域企业',
        key: '5',
        innerTabCfg: {
          tabConf: [
            {
              name: '科技型企业',
              content: <ScientificEnterprises />,
              key: Path.SCIENTIFIC_ENTERPRISES,
              isNew: true,
            },
            {
              name: '上市企业',
              content: <></>,
              key: '2',
              isWait: true,
            },
          ],
        },
      },
      {
        name: '榜单资质',
        key: '6',
        innerTabCfg: {
          tabConf: [
            {
              name: '地区榜单',
              content: <RegionalList />,
              key: Path.REGIONAL_LIST,
              isNew: true,
            },
            {
              name: '黑名单',
              content: <BlackList />,
              key: Path.BLACK_LIST,
              isNew: true,
            },
          ],
        },
      },
      {
        name: '区域资讯',
        key: '7',
        innerTabCfg: {
          tabConf: [
            {
              name: '区域舆情',
              content: <AreaPublish />,
              key: Path.AREA_PUBLISH,
            },
            {
              name: '区域观点',
              content: <AreaViewpoint />,
              key: Path.AREA_VIEWPOINT,
            },
          ],
        },
      },
    ];
  }, []);
  return { tabConf };
}
