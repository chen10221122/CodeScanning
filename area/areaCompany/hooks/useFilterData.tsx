import { useState, useEffect } from 'react';

import dayjs from 'dayjs';
import { cloneDeep, isArray, isEmpty, last } from 'lodash';

import RangeInput from '@/components/antd/rangeInput';
import { ScreenType, Options, WithExpand } from '@/components/screen';
import { getScreenData, getMoreScreenInfo } from '@/pages/area/areaCompany/api/screenApi';
import {
  screenOption,
  revokeEnterpriseScreenOption,
  LeasingScreenOption,
  CompanySpecialDefaultOptionMap,
} from '@/pages/area/areaCompany/components/filterInfo/menuConf';
import {
  ScreenTitleMap,
  ScreenListMap,
  REGIONAL_PAGE,
  DateRangeSelectPage,
  InfiniteIntervalIsEmpty,
  NeedFormatDatePage,
  InMoreCustomRangeTitleList,
  InMoreOrdinaryTitleList,
  InMoreTimeTitleList,
  ReplaceAmountScreenMap,
  NeedReplaceAmountName,
} from '@/pages/area/areaCompany/configs';
import {
  formatFilterTitle,
  addParamsKey,
  getRecentTimeFromNow,
  initJurisdictionsOption,
  formatInMoreTitle,
  filterEmptyOption,
  formatTitle,
} from '@/pages/area/areaCompany/utils/filter';
import { useSelector } from '@/pages/area/areaF9/context';
import { useParams } from '@/pages/area/areaF9/hooks';
import useRequest from '@/utils/ahooks/useRequest';

export const useFilterData = (pageType: REGIONAL_PAGE, onChangeFilterStatus: any) => {
  const { regionCode } = useParams();
  const { areaTree, industryInfo, branchId } = useSelector((state) => ({
    areaTree: state?.areaTree || [],
    industryInfo: state?.industryInfo || [],
    branchId: state.curNodeBranchId,
  }));

  const [option, setOption] = useState<Options[]>([]);

  /** 区域融资页面-获取筛选项 */
  const { run: getFinancingFilterData } = useRequest(getScreenData, {
    manual: true,
    onSuccess: (res: any) => {
      const options: Options[] =
        ScreenListMap.get(pageType)?.map((screenItemKey: string) => {
          const { name, paramsKey } = ScreenTitleMap.get(screenItemKey) || {};
          const itemList = res?.data?.[screenItemKey] || [];
          const isMultipleThird = itemList?.findIndex((item: any) => item?.children?.length) > -1;
          return {
            title: name || '',
            option: {
              type: isMultipleThird ? ScreenType.MULTIPLE_THIRD : ScreenType.MULTIPLE,
              cancelable: false,
              formatTitle: (rows: any) => {
                if (rows[0]?.name === '不限') return name;
                return rows.map((row: any) => row?.oldName)?.join(',');
              },
              children: [
                ...(!isMultipleThird
                  ? [
                      {
                        name: '不限',
                        value: '',
                        unlimited: true,
                        key: paramsKey,
                      },
                    ]
                  : []),
                ...(itemList.length ? formatFilterTitle(itemList, paramsKey) : []),
              ],
              hasSelectAll: false,
              default: [''],
            },
          };
        }) || [];
      setOption(options);
      onChangeFilterStatus((oldStatus: any) => {
        oldStatus.loading = false;
        oldStatus.error = false;
      });
    },
    onError: (err: any) => {
      if (err.returncode === 100) {
        const options: Options[] =
          ScreenListMap.get(pageType)?.map((screenItemKey: string) => {
            const { name, paramsKey } = ScreenTitleMap.get(screenItemKey) || {};
            return {
              title: name || '',
              option: {
                type: ScreenType.MULTIPLE,
                cancelable: false,
                children: [
                  {
                    name: '不限',
                    value: '',
                    unlimited: true,
                    key: paramsKey,
                  },
                ],
                hasSelectAll: false,
                default: [''],
              },
            };
          }) || [];
        setOption(options);
      }
      onChangeFilterStatus((oldStatus: any) => {
        oldStatus.loading = false;
        oldStatus.error = err?.returncode !== 100;
      });
    },
  });

  /** 区域企业页面-获取更多筛选项 */
  const { run: moreRun, data: moreScreenInfo } = useRequest(getMoreScreenInfo, {
    manual: true,
    onSuccess: () => {
      onChangeFilterStatus((oldStatus: any) => {
        oldStatus.loading = false;
        oldStatus.error = false;
      });
    },
    onError: (err: any) => {
      onChangeFilterStatus((oldStatus: any) => {
        oldStatus.loading = false;
        oldStatus.error = err?.returncode !== 100;
      });
    },
  });

  /** 根据接口数据配置区域企业页面筛选项 */
  useEffect(() => {
    if (
      pageType !== REGIONAL_PAGE.COMPANY_REVODE &&
      !isEmpty(areaTree) &&
      !isEmpty(industryInfo) &&
      moreScreenInfo?.data &&
      regionCode
    ) {
      const needFormatDate = NeedFormatDatePage.includes(pageType);
      const emptyInfinite = InfiniteIntervalIsEmpty.includes(pageType);
      const initopt = CompanySpecialDefaultOptionMap.get(pageType) || screenOption;
      const opt: Options[] = cloneDeep(initopt).map((i) => {
        if (i.title === '下属辖区') {
          return initJurisdictionsOption({ list: areaTree, code: regionCode });
        } else if (i.title === '国标行业') {
          i.option.children = industryInfo;
          return i;
        } else if (i.title === '更多筛选') {
          if (!moreScreenInfo?.data?.length) {
            i.title = 'isEmpty';
            return i;
          }
          let overlayClassName = 'area-enterprise-screen-more-date';
          i.option.children = moreScreenInfo?.data?.map((moreItem: any) => {
            if (InMoreOrdinaryTitleList.includes(moreItem.name)) {
              return {
                ...moreItem,
                title: moreItem.name,
                data: addParamsKey(moreItem.children, moreItem.value, true),
              };
            } else if (InMoreTimeTitleList.includes(moreItem.name)) {
              const rule = needFormatDate ? 'YYYY-MM-DD' : 'YYYYMMDD';
              const list = addParamsKey(
                moreItem.children.filter((item: any) => item.name !== '自定义'),
                moreItem.value,
                true,
              );
              return {
                title: moreItem.name,
                cancelable: true,
                calendar: {
                  _key: moreItem.value,
                  inMore: true,
                },
                ranges:
                  moreItem.name === '评级日期'
                    ? list
                    : list.map((rangeItem: any) => {
                        let value = rangeItem.vaule;
                        switch (rangeItem.name) {
                          case '3年内':
                            value = getRecentTimeFromNow(3, rule);
                            break;
                          case '3-10年':
                            value = getRecentTimeFromNow([3, 10], rule);
                            break;
                          case '10年以上':
                            value = `[${emptyInfinite ? '' : '*'},${dayjs().subtract(10, 'year').format(rule)})`;
                            break;
                          case '1年内':
                            value = getRecentTimeFromNow(1, rule);
                            break;
                          case '1-3年':
                            value = getRecentTimeFromNow([1, 3], rule);
                            break;
                          case '3-5年':
                            value = getRecentTimeFromNow([3, 5], rule);
                            break;
                          case '半年内':
                            value = getRecentTimeFromNow(0.5, rule);
                            break;
                        }
                        return { ...rangeItem, value };
                      }),
                customPicker: {
                  disabledDate: () => false,
                },
              };
            } else if (InMoreCustomRangeTitleList.includes(moreItem.name)) {
              overlayClassName = 'area-enterprise-screen-more-range';
              return {
                ...moreItem,
                title: moreItem.name,
                cancelable: true,
                data: moreItem.children.map((item: any) => {
                  if (item.name === '自定义') {
                    return {
                      name: '自定义',
                      value: null,
                      key: moreItem.value,
                      inMore: true,
                      render: () => {
                        const unit = moreItem.name === '注册资本' ? '万' : '%';
                        return (
                          <WithExpand<[start: string, end: string]>
                            formatTitle={(value: any) => <div>{formatInMoreTitle(value, unit)}</div>}
                          >
                            <RangeInput unit={unit} />
                          </WithExpand>
                        );
                      },
                    };
                  }
                  return { ...item, key: moreItem.value, inMore: true };
                }),
              };
            }
            return { ...moreItem, key: moreItem.value, inMore: true };
          });
          i.overlayClassName = overlayClassName;
          return i;
        } else if (i.title === '注册资本') {
          const isChangeTitle = NeedReplaceAmountName.includes(branchId);
          if (isChangeTitle) {
            i.title = '注册资本/开办资金';
            i.formatTitle = (rows: any) => formatTitle(rows, '万', '注册资本/开办资金');
          }
          if (emptyInfinite) {
            const newList = i.option.children?.map((item: any) => ({ ...item, value: item?.value?.replace('*', '') }));
            i.option.children = newList;
          }
          return i;
        }
        return i;
      });

      if (ReplaceAmountScreenMap.get(branchId)) {
        const isChangedKey = ReplaceAmountScreenMap.get(branchId) as string[];
        const inMoreItem = (last(opt)?.option?.children as any)?.filter((moreItem: any) =>
          isChangedKey.includes(moreItem?.value),
        );
        const amountItem = opt?.[2];

        const newOpt = opt.map((item: any) => {
          if (item?.title?.includes('注册资本')) {
            const { title, multiple, data, hasSelectAll } = inMoreItem?.[0] || {};
            return {
              title: title ?? 'isEmpty',
              option: {
                type: multiple ? ScreenType.MULTIPLE_THIRD : ScreenType.SINGLE,
                formatTitle: (rows: any) => {
                  if (!rows.length) return title;
                  return rows
                    .map((row: any) => {
                      if (row.name === '不限') return title;
                      /** 需要交换的只有参控上市公司比例是单选 */
                      if (isArray(row.value)) return formatTitle(rows, '%');
                      return row.name;
                    })
                    .join(',');
                },
                multiple,
                hasSelectAll,
                hideSearch: true,
                children: multiple
                  ? data || []
                  : data?.map((item: any) => {
                      if (item.name === '不限') return { ...item, value: '不限', unlimited: true };
                      if (item.name === '自定义') {
                        return {
                          ...item,
                          name: '自定义',
                          value: null,
                          render: () => <RangeInput unit="%" inline={true} useConfirm={true} />,
                        };
                      }
                      return item;
                    }) || [],
                default: multiple ? [] : '不限',
              },
            };
          } else if (item?.title === '更多筛选') {
            const newList = item?.option?.children?.map((child: any) => {
              if (child.value === inMoreItem?.[0]?.value) {
                return {
                  title: amountItem.title,
                  multiple: true,
                  hasSelectAll: true,
                  data: amountItem.option?.children?.map((item: any) => {
                    if (item.name === '自定义') {
                      return {
                        name: '自定义',
                        value: '',
                        key: 'amount',
                        render: () => {
                          return (
                            <WithExpand<[start: string, end: string]>
                              formatTitle={(value: any) => <div>{formatInMoreTitle(value, '万')}</div>}
                            >
                              <RangeInput unit={'万'} />
                            </WithExpand>
                          );
                        },
                      };
                    }
                    return item;
                  }),
                };
              }
              return child;
            });
            item.option.children = newList;
          }
          return item;
        });
        setOption(filterEmptyOption(newOpt));
        return;
      }
      setOption(filterEmptyOption(opt));
    }
  }, [areaTree, industryInfo, moreScreenInfo?.data, pageType, regionCode, branchId]);

  /** 吊销/注销企业 根据接口数据配置下属辖区，国标行业筛选项 */
  useEffect(() => {
    if (pageType === REGIONAL_PAGE.COMPANY_REVODE && !isEmpty(areaTree) && !isEmpty(industryInfo) && regionCode) {
      const opt: Options[] = revokeEnterpriseScreenOption.map((i) => {
        if (i.title === '下属辖区') {
          return initJurisdictionsOption({ list: areaTree, code: regionCode });
        }
        if (i.title === '国标行业') {
          i.option.children = industryInfo;
          return i;
        }
        return i;
      });
      setOption(opt);
    }
  }, [areaTree, industryInfo, pageType, regionCode]);

  /** 区域融资 - 租赁融资筛选配置 */
  useEffect(() => {
    if (pageType >= 5 && pageType <= 7) {
      const info = DateRangeSelectPage.get(pageType);
      if (info?.filterKey) {
        const opt = info.filterKey.map((itemKey: string) => {
          return LeasingScreenOption.find((item: any) => item.option.children[0].key === itemKey);
        }) as Options[];
        setOption(opt);
      }
    }
  }, [pageType, regionCode]);

  return {
    screenMenu: option,
    getFinancingFilterData,
    moreRun,
  };
};
