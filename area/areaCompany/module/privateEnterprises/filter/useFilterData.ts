import { useEffect, useMemo, useState } from 'react';

import { useMemoizedFn } from 'ahooks';
import dayjs from 'dayjs';
import { WritableDraft } from 'immer';
import { cloneDeep } from 'lodash';

import { Options, ScreenType, MultipleTilingOption } from '@/components/screen';
import { CompanyFilterResultType } from '@/pages/area/areaCompany/configs';
import { trimComma, initJurisdictionsOption } from '@/pages/area/areaCompany/utils/filter';
import { useSelector } from '@/pages/area/areaF9/context';
import { useImmer } from '@/utils/hooks';
import { shortId } from '@/utils/share';

import {
  rangOption,
  registeredCapital,
  dateOfEstablishment,
  moreScreen,
  moreScreenNamesMap,
  rangNameMap,
  initDefaultFilter,
  getEstablishDateValue,
} from './config';
import useGetFilter from './useGetFilter';

const levelCodes = [null, 'provinceCode', 'cityCode', 'countyCode'];
const industryKeyMap = new Map([
  ['industryCodeLevel1', 'industryCode1'],
  ['industryCodeLevel2', 'industryCode2'],
  ['industryCodeLevel3', 'industryCode3'],
  ['industryCodeLevel4', 'industryCode4'],
]);

const useFilterData = ({
  regionCode,
  regionLevel,
  refreshPageKey,
  onChangeFilterStatus,
}: {
  refreshPageKey: string;
  regionCode: string;
  regionLevel: number;
  onChangeFilterStatus: (
    f: (
      draft: WritableDraft<{
        loading: boolean;
        error: boolean;
      }>,
    ) => void | {
      loading: boolean;
      error: boolean;
    },
  ) => void;
}) => {
  const { areaTree, industryInfo } = useSelector((state) => ({
    areaTree: state?.areaTree || [],
    industryInfo: state?.industryInfo || [],
    branchId: state.curNodeBranchId,
  }));

  /** 关键词搜索 */
  const [keyword, setKeyword] = useState('');
  const [switchChecked, setSwitchChecked] = useState(false);
  /** 清除筛选时需重置 */
  const [screenKey, setScreenKey] = useState(shortId());
  /** 筛选项配置 */
  const [filterMenu, updateFilterMenu] = useImmer<Options[]>([]);
  /** 筛选受控values */
  // const [screenValues, updateScreenValues] = useImmer<ScreenValues>([]);
  /** 筛选处理结果，列表请求入参用 */
  const [filterResult, updateFilterResult] = useImmer<CompanyFilterResultType>({
    ...(initDefaultFilter as CompanyFilterResultType),
  });

  const onBefore = useMemoizedFn(() => {
    onChangeFilterStatus((d) => {
      d.loading = true;
      d.error = false;
    });
  });
  const onSuccess = useMemoizedFn((res: Record<string, any>) => {
    if (res && res.data) {
      updateFilterMenu((d) => {
        const tempMoreScreen = cloneDeep(moreScreen);
        res.data.forEach((item: Record<string, any>) => {
          if (item.children && item.children.length) {
            if (Array.from(moreScreenNamesMap.keys()).includes(item.name)) {
              // 更多筛选
              (tempMoreScreen.option as MultipleTilingOption).children!.push({
                title: item.name,
                cancelable: true,
                multiple: item.multiple,
                hasSelectAll: item.hasSelectAll,
                data: item.children.map((child: Record<string, any>) => ({
                  ...child,
                  inMore: true,
                  key: moreScreenNamesMap.get(item.name),
                })),
              });
            } else if (Array.from(rangNameMap.keys()).includes(item.name)) {
              // 入选榜单
              const tempRange = cloneDeep(rangOption);
              tempRange.option.children?.push(
                ...item.children.map((child: Record<string, any>) => ({
                  ...child,
                  key: rangNameMap.get(item.name),
                })),
              );
              d[1] = tempRange;
            }
          }
        });
        (tempMoreScreen.option as MultipleTilingOption).children!.push(registeredCapital, dateOfEstablishment);
        d[3] = tempMoreScreen;
        if (!d[1]) d[1] = rangOption;
      });
    }

    onChangeFilterStatus((d) => {
      d.loading = false;
    });
  });
  const onError = useMemoizedFn(() => {
    updateFilterMenu((d) => []);
    onChangeFilterStatus((d) => {
      d.loading = false;
      d.error = true;
    });
  });
  const { run } = useGetFilter({
    onBefore,
    onSuccess,
    onError,
  });

  /** 下属辖区筛选配置 */
  const jurisdictionOption = useMemo(
    () => (areaTree ? initJurisdictionsOption({ list: areaTree, code: regionCode }) : undefined),
    [areaTree, regionCode],
  );
  /** 国标行业筛选配置 */
  const industryOption = useMemo(
    () =>
      industryInfo
        ? {
            title: '行业',
            option: {
              ellipsis: 8,
              type: ScreenType.MULTIPLE_THIRD,
              hasSelectAll: false,
              children: industryInfo,
              cascade: true,
              formatTitle: (rows: any) => {
                if (!rows.length) return '行业';
                return rows.map((row: any) => row.name).join(',');
              },
            },
          }
        : undefined,
    [industryInfo],
  );

  /** 默认的地区code key */
  const initAreaCodeKey = useMemo(() => levelCodes[regionLevel] || '', [regionLevel]);

  /** 更新筛选配置 */
  useEffect(() => {
    if (jurisdictionOption) {
      updateFilterMenu((d) => {
        d[0] = jurisdictionOption as Options;
      });
    }
  }, [updateFilterMenu, jurisdictionOption]);
  useEffect(() => {
    if (industryOption) {
      updateFilterMenu((d) => {
        d[2] = industryOption as Options;
      });
    }
  }, [updateFilterMenu, industryOption]);

  /** 请求 */
  useEffect(() => {
    if (regionCode && refreshPageKey) {
      run({
        regionCode,
        codeFirst: refreshPageKey,
      });
    }
  }, [run, regionCode, refreshPageKey]);

  /** 默认 */
  useEffect(() => {
    updateFilterResult((d) => {
      d[initAreaCodeKey] = regionCode;
      d.areaCode = regionCode;
    });
  }, [initAreaCodeKey, regionCode, updateFilterResult]);

  /** 清除搜索 */
  const onClearSearch = useMemoizedFn(() => {
    setKeyword('');
    updateFilterResult((d) => {
      d.keyWord = '';
    });
  });

  /** 清除筛选 */
  const onClearFilter = useMemoizedFn(() => {
    updateFilterResult(() => ({
      ...(initDefaultFilter as CompanyFilterResultType),
      regionCode,
      areaCode: regionCode,
      [initAreaCodeKey]: regionCode,
    }));
    setKeyword('');
    setScreenKey(shortId());
    setSwitchChecked(false);
  });

  /** 搜索 */
  const onSearch = useMemoizedFn((txt: string) => {
    setKeyword(txt);
    updateFilterResult((d) => {
      d.keyWord = txt;
    });
  });

  /** 筛选 */
  const onFilterChange = useMemoizedFn((_: any, allSelected: any, idx: number) => {
    const initRes = { ...initDefaultFilter } as CompanyFilterResultType;
    const filterArea = allSelected.filter((selectItem: any) => selectItem?._key === 'area');
    if (!filterArea.length) {
      /** 未筛选下属辖区时，取头部的地区code */
      initRes[initAreaCodeKey] = regionCode;
    }

    allSelected.forEach((selectItem: any) => {
      if (selectItem?._key === 'area') {
        /**  ------------------- 下属辖区筛选 ---------------------- */
        initRes.areaCode = (initRes['areaCode'] || '') + `${selectItem.value},`;
        // if (selectItem.key === 1 && selectItem.value !== '100000') {
        //   initRes.provinceCode = (initRes.provinceCode ?? '') + `${selectItem.value},`;
        // } else {
        //   const codeKey = levelCodes[selectItem.key] || '';
        //   initRes[codeKey] = (initRes[codeKey] ?? '') + `${selectItem.value},`;
        // }
      } else if (selectItem.key.includes('industryCodeLevel')) {
        /**  ------------------- 国标行业筛选 ---------------------- */
        const industryKey = industryKeyMap.get(selectItem.key) || '';
        initRes[industryKey] = (initRes[industryKey] ?? '') + `${selectItem.value},`;
      } else if (selectItem.key === 'tagCode') {
        /**  ------------------- 入选榜单 ---------------------- */
        initRes.tagCode = (initRes.tagCode || '') + `${selectItem.value},`;
      } else if (selectItem?.inMore) {
        /**  ------------------- 更多筛选 ---------------------- */
        const key = selectItem?._key || selectItem?.key;
        switch (key) {
          /** 登记状态 企业类型 上市发债*/
          case 'regStatus':
          case 'enterpriseNature':
          case 'listingOrIssuance':
            initRes[key] = (initRes[key] || '') + `${selectItem.value},`;
            break;
          /** 注册资本 */
          case 'regCapital':
            if (Array.isArray(selectItem.value)) {
              const val = `[${Number(selectItem.value[0]) * 10000},${Number(selectItem.value[1]) * 10000})`;
              initRes[key] = (initRes[key] || '') + `${val ? `${val},` : ''}`;
            } else {
              initRes[key] = (initRes[key] || '') + `${selectItem.value ? `${selectItem.value},` : ''}`;
            }
            break;
          /** 成立日期 */
          case 'establishDate':
            if (Array.isArray(selectItem.value)) {
              const val = `[${dayjs(selectItem.value[0]).format('YYYY-MM-DD')},${dayjs(selectItem.value[1]).format(
                'YYYY-MM-DD',
              )})`;
              initRes[key] = (initRes[key] || '') + `${val ? `${val},` : ''}`;
            } else {
              const val = getEstablishDateValue(selectItem.value) || '';
              initRes[key] = (initRes[key] || '') + `${val ? `${val},` : ''}`;
            }
            break;
          default:
            break;
        }
      }
    });

    const res = trimComma(initRes);
    /** 保留搜索和企业去重，表格重置 */
    res.keyWord = keyword;
    res.isUnRepeated = switchChecked;
    res.regionCode = regionCode;
    updateFilterResult(() => res as CompanyFilterResultType);
  });

  /** 企业去重 */
  const onSwitchChange = useMemoizedFn((checked: boolean) => {
    updateFilterResult((d) => {
      d.isUnRepeated = checked;
    });
    setSwitchChecked(checked);
  });

  return {
    screenKey,
    // screenValues,
    keyword,
    filterResult,
    filterMenu,
    switchChecked,
    onClearSearch,
    onSearch,
    onFilterChange,
    onClearFilter,
    onSwitchChange,
  };
};

export default useFilterData;
