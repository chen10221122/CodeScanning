import { useRef, useState } from 'react';

import { useMemoizedFn, useRequest, useUpdateEffect } from 'ahooks';
import dayjs from 'dayjs';
import { produce } from 'immer';
import { cloneDeep, isArray } from 'lodash';

import { getAdminDistrict, getAllRegionDictAreaTree, getBondFinancingFilter } from '@pages/area/areaFinancing/api';
import {
  BondFinancingInfoMap,
  defaultBondCategoryObj,
  defaultYearObj,
  getTabType,
  TabType,
} from '@pages/area/areaFinancing/components/bondTemplate/index';
import { BondFinancingColumnType } from '@pages/area/areaFinancing/components/bondTemplate/type';
import { useConditionCtx } from '@pages/area/areaFinancing/components/commonLayout/context';
import { useCtx } from '@pages/area/areaFinancing/context';

import { quickAreaOptions, RowItem, ScreenType, ThirdSelectRowItem } from '@/components/screen';

import { customDateRangeRender, customDateRender, YearOptionEnum } from './config';

const { getRootSelected } = quickAreaOptions;

/** 债券融资筛选枚举 */
export enum FilterEnum {
  /* 时间 */
  Year = 'year',
  /* 行业 */
  Industry = 'industryCode',
  /* 债券类型 */
  BondType = 'firstBondType',
  /* 债券大类 */
  BondCategory = 'bondCategory',
  /* 企业性质 */
  EnterpriseNature = 'enterpriseNature',
  /* 企业类型 */
  EnterpriseType = 'enterpriseType',
  /* 主体评级 */
  SubjectRating = 'subjectRating',
  /* 债项评级 */
  DebtRating = 'debtRating',
  /* 统计口径 */
  StatisticCaliber = 'sCaliber',
  /* 统计范围 */
  SRange = 'sRange',
  /* 更多筛选 */
  More = 'more',
  /* 地区组合 */
  AreaGroup = 'areaGroup',
  /* 地区类型 */
  AreaType = 'areaType',
  /* 地区 */
  Area = 'area',
}
const currentYear = new Date().getFullYear();
/** 年份日期区间 */
const yearList = (year: number, length: number, calcType: 'add' | 'sub', isNew?: boolean) => {
  return Array.from({ length }).map((_, index) => ({
    name: isNew && !index ? '最新' : calcType === 'sub' ? String(year - index) : String(year + index),
    value: calcType === 'sub' ? String(year - index) : String(year + index),
    key: 'yearSingle',
    active: !index,
  }));
};
const getDateChild = (
  yearType: YearOptionEnum,
  yearOption: { startYear: number; length: number; calcType: 'add' | 'sub'; isNew?: boolean },
) => {
  let list: RowItem[] = [];
  const { startYear, length, calcType, isNew } = yearOption;
  switch (yearType) {
    case YearOptionEnum.Date:
      list = [customDateRender, ...yearList(startYear, length, calcType)];
      break;
    case YearOptionEnum.DateRange:
      list = [...yearList(startYear, length, calcType, isNew), customDateRangeRender];
      break;
  }
  return list;
};
enum AreaTypeEnum {
  /** 行政区 */
  AdminDistrict = 'AdminDistrict',
  /** 城市圈 */
  UrbanCircle = 'UrbanCircle',
  /** 都市圈 */
  CityCircle = 'CityCircle',
  /** 百强县 */
  County = 'County',
}
const AreaApiMap = new Map([
  [AreaTypeEnum.UrbanCircle, { code: '3', type: 'plate' }],
  [AreaTypeEnum.CityCircle, { code: '4', type: 'plate' }],
  [AreaTypeEnum.County, { code: '', type: 'county' }],
]);
// 直辖市
const directCity = ['110000', '120000', '310000', '500000'];
/** 地区 */
let areaGroupOption: any = {
  filterType: FilterEnum.AreaGroup,
  config: [
    {
      title: '',
      label: '地区',
      filterType: FilterEnum.AreaType,
      option: {
        type: ScreenType.SINGLE,
        cancelable: false,
        children: [
          { name: '行政区', value: AreaTypeEnum.AdminDistrict, active: true },
          { name: '城市群', value: AreaTypeEnum.UrbanCircle },
          { name: '都市圈', value: AreaTypeEnum.CityCircle },
          { name: '百强县', value: AreaTypeEnum.County },
        ],
      },
    },
    {
      title: '全部',
      filterType: FilterEnum.Area,
      option: {
        formatSelectAllTitle: (parentRow: any, selected: any, level: number) => {
          if (directCity.includes(parentRow?.value) && level === 1) return '全部';
          return level === 0 ? '全国(省/直辖市)' : level === 1 ? '全部(地级市)' : '全部';
        },
        limit: 1000,
        hasSelectAll: true,
        // 含下属区县选项
        hasAreaSelectAll: (selected: ThirdSelectRowItem | undefined) => {
          return !directCity.includes(selected?.value);
        },
        type: ScreenType.MULTIPLE_THIRD_AREA,
        children: [],
      },
    },
  ],
};
// 香港、澳门、台湾
const filterArea = ['710000', '810000', '820000'];

export default function useBondScreen(type: BondFinancingColumnType) {
  const {
    state: { screenAreaData },
    update,
  } = useCtx();

  const {
    state: { isFirstLoad },
    update: updateCondition,
  } = useConditionCtx();
  // 接口返回的筛选数据（不包含地区及日期）
  const [screenData, setScreenData] = useState<any>();
  // 筛选配置
  const [screenConfig, setScreenConfig] = useState<any[]>();
  // 当前选中的地区类型
  const activeAreaTypeRef = useRef(AreaTypeEnum.AdminDistrict);
  const filterReqInfo = BondFinancingInfoMap.get(type);

  useRequest(getAdminDistrict, {
    ready: !screenAreaData,
    onSuccess: (res: any) => {
      // 保存到公共仓库,后续同类型债券融资页面无需请求
      update((d) => {
        d.screenAreaData = {};
        if (res.data?.length) {
          d.screenAreaData[AreaTypeEnum.AdminDistrict] = res.data.filter(
            (o: Record<string, any>) => !filterArea.includes(o.value),
          );
        }
      });
    },
    onError: () => {},
  });
  useRequest(getBondFinancingFilter, {
    defaultParams: [
      {
        titleFilter: '0',
        orgType: filterReqInfo.defaultCondition.orgType,
        pageType: filterReqInfo.exportInfo.pageType,
        tabType: filterReqInfo.defaultCondition.tabType,
      },
    ],
    ready: !!type,
    onSuccess: (res: any) => {
      setScreenData(res.data);
    },
    onError: () => {},
  });
  // 获取动态表头，将其保存至公共状态
  useRequest(getBondFinancingFilter, {
    defaultParams: [{ titleFilter: '1', orgType: '1', pageType: '1', tabType: '1' }],
    onSuccess: (res: any) => {
      update((d) => {
        d.dynamicColumnTitle = res.data;
      });
    },
    onError: () => {},
  });

  useUpdateEffect(() => {
    // 接口返回
    if (screenData?.length) {
      // 债券偿还页面
      const isBondReturn = [
        BondFinancingColumnType.NormalReturnByType,
        BondFinancingColumnType.FinancialReturnByType,
      ].includes(type);
      // 债券存量页面
      const isBondInventory = [
        BondFinancingColumnType.NormalInventoryByType,
        BondFinancingColumnType.FinancialInventoryByType,
      ].includes(type);
      const dateOption = {
        title: `最新`,
        formatTitle: (row: any[]) => {
          if (row.length) {
            // 日期范围
            if (isArray(row[0].value)) {
              const val = row[0].value;
              return `${dayjs(val[0]).format('YYYY-MM-DD')}至${dayjs(val[1]).format('YYYY-MM-DD')}`;
            } else {
              if (
                isBondInventory &&
                typeof row[0].value === 'object' &&
                dayjs(row[0].value).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD')
              ) {
                return '最新';
              }
              return typeof row[0].value === 'object' ? `${dayjs(row[0].value).format('YYYY-MM-DD')}` : row[0].name;
            }
          }
          return '日期';
        },
        filterType: FilterEnum.Year,
        ellipsis: 30,
        option: {
          type: ScreenType.SINGLE,
          cancelable: false,
          // 债券存量日期筛选组件不同
          children: getDateChild(isBondInventory ? YearOptionEnum.Date : YearOptionEnum.DateRange, {
            startYear: currentYear,
            length: isBondReturn ? 5 : 10,
            calcType: isBondReturn ? 'add' : 'sub',
            isNew: !isBondReturn,
          }),
        },
      };

      let res: any = getTabType(type) === TabType.ByYear ? [areaGroupOption] : [dateOption, areaGroupOption];
      const bondCategory = screenData.find((o: Record<string, any>) => o.value === FilterEnum.BondCategory);
      const industry = screenData.find((o: Record<string, any>) => o.value === FilterEnum.Industry);
      const bondType = screenData.find((o: Record<string, any>) => o.value === FilterEnum.BondType);
      const enType = screenData.find((o: Record<string, any>) => o.value === FilterEnum.EnterpriseType);
      const otherOptions = screenData.filter(
        (o: Record<string, any>) =>
          o.value &&
          ![FilterEnum.Industry, FilterEnum.BondType, FilterEnum.EnterpriseType, FilterEnum.BondCategory].includes(
            o.value,
          ),
      );
      [industry, bondCategory, bondType, enType]
        .filter((o) => o)
        .forEach((o: any) => {
          let option = {
            filterType: o.value,
            title: o.name,
            formatTitle: (rows: RowItem[]) =>
              getRootSelected(
                o.children,
                rows.map((o) => o.value),
              )
                .map((d) => d.name)
                .join(','),
            option: {
              hasSelectAll: false,
              multiple: o.multiple,
              cancelable: !!o.multiple,
              cascade: true,
              type: o.multiple
                ? FilterEnum.EnterpriseType === o.value
                  ? ScreenType.MULTIPLE_THIRD
                  : ScreenType.MULTIPLE
                : ScreenType.SINGLE,
              children: o.children || [],
              key: o.value,
            },
          };
          res.push(option);
        });
      // 更多筛选
      res.push({
        title: '更多筛选',
        filterType: FilterEnum.More,
        option: {
          type: ScreenType.MULTIPLE_TILING,
          ellipsis: 5,
          children: otherOptions.map((o: any) => {
            return {
              explain:
                o.value === FilterEnum.StatisticCaliber
                  ? '不考虑行权代表根据公告确定的偿还信息。考虑行权代表根据行权条款预估的偿还信息。'
                  : '',
              title: o.name,
              hasSelectAll: o.hasSelectAll,
              multiple: o.multiple,
              cancelable: o.multiple,
              type: o.multiple ? ScreenType.MULTIPLE : ScreenType.SINGLE,
              data:
                o.children.map((t: Record<string, any>) => ({
                  ...t,
                  key: o.value,
                  // 统计范围及统计口径默认选中
                  active:
                    (o.value === FilterEnum.SRange && t.value === '1') ||
                    (o.value === FilterEnum.StatisticCaliber && t.value === '0'),
                })) || [],
              filterType: o.value,
            };
          }),
        },
      });
      // 默认选中行政区
      if (screenAreaData?.[AreaTypeEnum.AdminDistrict]) {
        const areaGroupItem = res.find((d: Record<string, any>) => d.filterType === FilterEnum.AreaGroup);
        areaGroupItem.config[1].option.children = cloneDeep(screenAreaData[activeAreaTypeRef.current]);
        areaGroupItem.config[1].formatTitle = (rows: RowItem[]) => {
          return rows.map((d) => d.name).join(',');
        };
        /*areaGroupItem.config[1].formatTitle = (rows: any[]) => {
          return getRootSelected(
            areaTree,
            rows.map((o: Record<string, any>) => o.value),
          )
            .map((d: Record<string, any>) => d.name)
            .toString();
        };*/
      }
      setScreenConfig(res);
    }
  }, [screenData, screenAreaData?.[AreaTypeEnum.AdminDistrict], type, setScreenConfig]);

  // 地区类型变化
  const handleAreaTypeChange = useMemoizedFn((type: AreaTypeEnum) => {
    activeAreaTypeRef.current = type;
    if (!type) return;
    // 城市群 都市圈有默认值故不触发change
    const isDefaultActive = [AreaTypeEnum.CityCircle, AreaTypeEnum.UrbanCircle].includes(activeAreaTypeRef.current);

    function updateAreaOption(data?: any) {
      setScreenConfig(
        produce((draft) => {
          const areaGroupItem = draft.find((d: Record<string, any>) => d.filterType === FilterEnum.AreaGroup);
          const areaTree = data ? data : screenAreaData![activeAreaTypeRef.current];
          // 城市群、都市群，配置特殊处理
          areaGroupItem.config[1].option.formatSelectAllTitle = isDefaultActive
            ? (parentRow: any, selected: any, level: number) => {
                return level === 1 ? '全部(城市)' : '全部';
              }
            : (parentRow: any, selected: any, level: number) => {
                if (directCity.includes(parentRow?.value) && level === 1) return '全部';
                return level === 0 ? '全国(省/直辖市)' : level === 1 ? '全部(地级市)' : '全部';
              };
          areaGroupItem.config[1].option.children = areaTree;
          areaGroupItem.config[1].option.hasSelectAll = activeAreaTypeRef.current !== AreaTypeEnum.County;
        }),
      );
    }

    if (screenAreaData?.[type]) {
      updateAreaOption();
      if (isDefaultActive) return;
      updateCondition((d) => {
        d.condition!.regionCode = screenAreaData[type]
          .map((o: Record<string, any>) => o.realValue || o.value)
          .join(',');
      });
    } else if (type !== AreaTypeEnum.AdminDistrict) {
      // 获取城市圈等地区数据
      getAllRegionDictAreaTree(AreaApiMap.get(type)!).then((res: any) => {
        const transformData = res.data?.map((o: Record<string, any>) => {
          if (o.children?.length) {
            // 默认选中 城市群默认长江三角洲，都市圈默认首都都市圈
            if (['300002', '400002'].includes(o.value)) {
              o.children.forEach((t: Record<string, any>) => {
                t.active = true;
                t.children?.forEach((item: Record<string, any>) => {
                  item.active = true;
                });
              });
            }
            return {
              ...o,
              disabled: true,
              realValue: o.children
                ?.map(
                  (o: Record<string, any>) => o.value,
                  // [o.value].concat(o.children?.map((t: Record<string, any>) => t.value)).join(','),
                )
                .join(','),
            };
          }

          return o;
        });

        if (transformData) {
          update((d) => {
            d.screenAreaData![type] = transformData;
          });
          updateAreaOption(transformData);
          if (isDefaultActive) return;
          updateCondition((d) => {
            d.condition!.areaType = type;
            d.condition!.regionCode = transformData?.map((o: Record<string, any>) => o.realValue || o.value).join(',');
          });
        }
      });
    }
  });
  /** 统计列表筛选变化逻辑 */
  const handleMenuChange = useMemoizedFn((changeType: FilterEnum, allData: Record<string, any>[]) => {
    if (isFirstLoad) return;
    switch (changeType) {
      case FilterEnum.AreaType: {
        if (!allData?.length) return;
        handleAreaTypeChange(allData[0].value);
        break;
      }
      case FilterEnum.Area:
        if (!allData.length) {
          updateCondition((d) => {
            d.condition!.regionCode = screenAreaData![activeAreaTypeRef.current]
              .map((o: Record<string, any>) => o.realValue || o.value)
              .join(',');
          });
          return;
        }
        updateCondition((d) => {
          d.condition!.regionCode = allData.map((o) => o.realValue || o.value).join(',');
        });
        break;
      case FilterEnum.Year: {
        const val = allData?.[0].value;
        if (val) {
          // 日期范围
          if (isArray(val)) {
            updateCondition((d) => {
              d.condition!.changeDate = `[${dayjs(val[0]).format('YYYY-MM-DD')},${dayjs(val[1]).format('YYYY-MM-DD')}]`;
            });
          } else {
            if (
              [
                BondFinancingColumnType.NormalInventoryByType,
                BondFinancingColumnType.FinancialInventoryByType,
              ].includes(type)
            ) {
              // 债券存量统计特殊处理
              if (typeof val === 'object') {
                const singleDate = dayjs(val).format('YYYY-MM-DD');
                updateCondition((d) => {
                  d.condition!.changeDate = `[${singleDate},${singleDate}]`;
                });
              } else {
                updateCondition((d) => {
                  d.condition!.changeDate = `[${val}-01-01,${val}-12-31]`;
                });
              }
            } else {
              // 选中最新
              if (String(currentYear) === String(val)) {
                updateCondition((d) => {
                  if (
                    [
                      BondFinancingColumnType.NormalFinancingByType,
                      BondFinancingColumnType.FinancialFinancingByType,
                    ].includes(type)
                  ) {
                    d.condition!.changeDate = defaultYearObj.financing;
                  } else if (
                    [BondFinancingColumnType.NormalIssueByType, BondFinancingColumnType.FinancialIssueByType].includes(
                      type,
                    )
                  ) {
                    d.condition!.changeDate = defaultYearObj.issue;
                  } else {
                    d.condition!.changeDate = defaultYearObj.return;
                  }
                });
              } else {
                updateCondition((d) => {
                  d.condition!.changeDate = `[${val}-01-01,${val}-12-31]`;
                });
              }
            }
          }
        }
        break;
      }
      case FilterEnum.Industry:
        updateCondition((d) => {
          d.condition!.industryCode = allData.map((o) => o.value).join(',');
        });
        break;
      case FilterEnum.BondCategory:
        updateCondition((d) => {
          if (!allData?.length) {
            // 金融、非金融，债券大类默认值不同
            d.condition!.bondCategory =
              d.condition?.orgType === '1' ? defaultBondCategoryObj.financial : defaultBondCategoryObj.normal;
          } else {
            d.condition!.bondCategory = allData.map((o) => o.value).join(',');
          }
        });
        break;
      case FilterEnum.EnterpriseType:
        updateCondition((d) => {
          d.condition!.firstEnterpriseType = allData
            .filter((o) => o.level === 0)
            .map((o) => o.value)
            .join(',');
          d.condition!.secondEnterpriseType = allData
            .filter((o) => o.level === 2)
            .map((o) => o.value)
            .join(',');
        });
        break;
      case FilterEnum.BondType:
        updateCondition((d) => {
          d.condition!.firstBondType = allData
            .filter((o) => o.level === 0)
            .map((o) => o.value)
            .join(',');
          d.condition!.secondBondType = allData
            .filter((o) => o.level === 2)
            .map((o) => o.value)
            .join(',');
        });
        break;
      case FilterEnum.More:
        [
          FilterEnum.EnterpriseNature,
          FilterEnum.SubjectRating,
          FilterEnum.DebtRating,
          FilterEnum.SRange,
          FilterEnum.StatisticCaliber,
        ].forEach((key) => {
          updateCondition((d) => {
            d.condition![key] = allData
              .filter((o) => o.key === key)
              .map((o) => o.value)
              .join(',');
          });
        });
        break;
    }
  });

  return {
    screenConfig,
    handleMenuChange,
    hideSelectAll: [AreaTypeEnum.CityCircle, AreaTypeEnum.UrbanCircle].includes(activeAreaTypeRef.current),
  };
}
