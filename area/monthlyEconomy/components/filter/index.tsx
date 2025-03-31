import { FC, memo, useEffect, useRef, useState, useCallback, useMemo } from 'react';

import Screen, { ScreenType, Options, RowItem, quickAreaOptions } from '@dzh/screen';
import { useMemoizedFn } from 'ahooks';
import { isEmpty, cloneDeep } from 'lodash';
import styled from 'styled-components';

import { getConfig } from '@/app';
import vipSvg from '@/assets/images/common/vip.svg';
import { Icon } from '@/components';
import { TransferSelect } from '@/components/transferSelectNew';
import { AREA_REMEMBER_KEY } from '@/configs/constants';
import { MONTHLY_ECONOMY_SEARCH } from '@/configs/localstorage';
import UpdateTipComponents from '@/pages/area/components/areaUpdateTip';
import { useCtx, AreaCodeType, defaultAreaMap, defaultOrder } from '@/pages/area/monthlyEconomy/getContext';
import { ScreenAreaItemType } from '@/pages/bond/areaFinancingPlatform/components/filter';
import { initUniqueKeyMenu, makeResult } from '@/pages/bond/areaFinancingPlatform/components/filter/handleAreaConfig';
import useRequest from '@/utils/ahooks/useRequest';
import { useImmer, useQuery, useGetAuth } from '@/utils/hooks';
import { recursion, shortId } from '@/utils/share';

import AreaSearch from '../areaSearch';
import uesIndicatorCfg from './uesIndicatorCfg';
import useFilter, { AreaItem, SelectItems } from './useFilter';

const { formatSelectAllTitle, hasAreaSelectAll, getAllAreaTree } = quickAreaOptions;
const isXinsight = getConfig((d) => d.platform.IS_XINSIGHT_APP);
export const setConditionItem = (condition: { [a: string]: any }, arr: RowItem[], objKey?: string) => {
  if (arr.length) {
    if (objKey === 'regionCode') condition['regionName'] = [];
    arr.forEach((o) => {
      let key = objKey || o.key;
      if (condition[key]) {
        if (condition[key].indexOf(o.value) === -1) condition[key].push(o.value);
      } else {
        condition[key] = [o.value];
      }
      if (objKey === 'regionCode') condition['regionName'].push(o.name);
    });
  }
};

const getAreaCodeRelation = (obj: AreaCodeType, o: AreaItem) => {
  if (o.value) obj[o.value] = o.name;
  if (o.children) o.children.forEach((d) => getAreaCodeRelation(obj, d));
};

type Props = {
  isClearFilter?: boolean;
  handleSearchArea?: (obj: SelectItems) => void;
  setScreenKey?: Function;
  handleAreaClick: () => void;
};

const Filter: FC<Props> = ({ isClearFilter, handleSearchArea, setScreenKey, handleAreaClick }) => {
  const { update } = useCtx();

  const domRef = useRef<HTMLDivElement>(null);
  const keywordRef = useRef('');
  const [area, setArea] = useState<RowItem[] | undefined>([]);
  const [indicators, setIndicators] = useImmer<RowItem[] | undefined>([]);
  const { regionCode, year: defaultYear, getChild, getSelf } = useQuery();
  const [areaConfigData, setAreaConfigData] = useState<Options[]>([]);
  const [yearScreenKey, setYearScreenKey] = useState(shortId()); // 年度筛选组件的key
  const [MonthScreenKey, setMonthScreenKey] = useState(shortId()); //月度筛选组件的key
  const [areaScreenKey, setAreaScreenKey] = useState(shortId()); // 地区筛选组件的key
  const [areaScreenValues, setAreaScreenValues] = useState([]);
  const [year, setYear] = useState<RowItem[] | undefined>([]); //年份
  const [month, setMonth] = useState<RowItem[] | undefined>([]); //月份
  /** 是否清空搜索框 */
  const [isClearSearch, setIsClearSearch] = useState(false);
  const { loading, data: dateInfo } = useFilter();
  const { havePay, svip } = useGetAuth();

  /** 初始年份 */
  const initYear = useMemo(() => {
    return defaultYear ?? dateInfo?.year;
  }, [defaultYear, dateInfo]);

  const { indicatorList } = uesIndicatorCfg();

  /** 初始指标筛选 */
  const defaultSelectIndicators = useMemo(() => {
    let list = cloneDeep(indicatorList && indicatorList[0]?.children);
    const res = list?.map((o: any) => {
      const temp = o?.associatedKey || [];
      return temp[0];
    });
    return res;
  }, [indicatorList]);

  const yearConfig: Options[] = useMemo(() => {
    if (initYear) {
      let yearOption = [];
      for (let i = new Date().getFullYear(); i > 2022; i--) {
        const Y = i.toString();
        yearOption.push({
          name: Y,
          value: Y,
          key: 'year',
        });
      }

      return [
        {
          title: '年份',
          option: {
            type: ScreenType.SINGLE,
            children: yearOption,
            default: initYear,
            cancelable: false,
          },
          formatTitle: (selectedRows) => {
            return `${selectedRows[0].name}年`;
          },
        },
      ];
    }

    return [];
  }, [initYear]);

  const monthConfig: Options[] = useMemo(() => {
    let option = [];
    for (let i = 12; i > 0; i--) {
      let M = i > 9 ? `${i}` : `0${i}`;
      option.unshift({
        name: M,
        value: M,
        key: 'month',
      });
    }
    return [
      {
        title: '月份',
        option: {
          type: ScreenType.SINGLE,
          children: option,
          default: dateInfo?.month,
          cancelable: false,
        },
        formatTitle: (selectedRows) => {
          return `${selectedRows[0].name}月`;
        },
      },
    ];
  }, [dateInfo]);

  const areaConfig = useMemo(
    () => (!isEmpty(areaConfigData) ? initUniqueKeyMenu(areaConfigData, regionCode, getChild, getSelf) : []),
    [getChild, getSelf, areaConfigData, regionCode],
  );

  const vipIcon = useMemo(
    () => (
      <span>
        <Icon
          image={vipSvg}
          size={12}
          className="vip-icon"
          style={{
            verticalAlign: '-2px',
            marginLeft: '2px',
          }}
        />
      </span>
    ),
    [],
  );

  /* url 默认选中地区逻辑 */
  useEffect(() => {
    if (areaConfig.length) {
      const defaultAreas = areaConfig[0]?.option?.defaults;
      if (defaultAreas?.length) {
        setAreaScreenValues(defaultAreas);
        setArea(defaultAreas);
      }
    }
  }, [areaConfig]);

  useRequest(getAllAreaTree, {
    onSuccess(data) {
      setAreaConfigData([
        {
          title: (
            <span style={{ marginLeft: 0 }} onClick={handleAreaClick}>
              地区{vipIcon}
              <UpdateTipComponents position={{ x: 26, y: -20 }} visibleKey="monthlyEconomy_UpdateTipComponents" />
            </span>
          ),
          option: {
            type: ScreenType.MULTIPLE_THIRD_AREA,
            children: makeResult(data.data),
            formatSelectAllTitle,
            hasAreaSelectAll,
            isIncludingSameLevel: false,
            limit: svip && havePay ? -1 : 1000,
            dynamic: true,
            areaMemorizeKey: isXinsight ? '' : AREA_REMEMBER_KEY,
            // @ts-ignore
            defaults: data.remember?.split(',') || [],
          },
          formatTitle: (selectedRows) => {
            return selectedRows.map((item) => item.name).join(',');
          },
        },
      ]);
    },
    defaultParams: [true, false, AREA_REMEMBER_KEY],
    formatResult: ({ data, remember }: any) => {
      return {
        remember,
        data: recursion<ScreenAreaItemType>(data as ScreenAreaItemType[], (item) => {
          item.label = item.name;
          if (item.province || item.city) {
            const v = item.value;
            if (item.sameLevelValue) {
              // 解决地方城投债 跳转 地方融资平台
              // 传递的 regincode 与地区筛选框中 value不同 导致的 问题
              item.value = item.regionCode;
              item.wholeCode = v;
            }
            if (item.province) {
              delete item.province;
              item.provinceSelf = true;
            } else {
              delete item.city;
              item.citySelf = true;
            }
          }
        }),
      };
    },
  });

  const handleSearch = useCallback(() => {
    let condition: { [a: string]: any } = {
      from: 0, //  起始值
      keyword: keywordRef.current, // 模糊搜索关键字，匹配地区简称
      size: 10000, // 每页显示条数
      sort: '', // 排序规则，如地区生产总值: desc，多个逗号分割
    };

    if (year?.length && month?.length) {
      condition.endDate = year[0].value + month[0].value;
    }
    if (indicators) setConditionItem(condition, indicators, 'indicName');
    if (area) setConditionItem(condition, area, 'regionCode');

    if ((year && year.length) || defaultYear) {
      if (!condition.regionCode) {
        //默认地区
        condition.regionCode = Object.keys(defaultAreaMap);
        condition.regionName = Object.values(defaultAreaMap);
      }
      if (condition.regionCode || condition.keyword) {
        update((o) => {
          if (condition.keyword) delete condition.regionCode;
          o.condition = condition;
          o.sortName = condition?.indicName ? condition?.indicName[0] + ':desc' : '';
        });
      }
      setIsClearSearch(false);
    }
  }, [indicators, year, month, area, defaultYear, update]);

  /** 地区筛选 */
  const areaChange = useCallback(
    (currentSelected, allSelected) => {
      update((d) => {
        d.sortData = defaultOrder;
        d.scrollLeft = 0;
      });
      setIsClearSearch(true);
      keywordRef.current = '';
      setArea(allSelected);
      let regionCodeArr: any = [];
      allSelected.forEach((o: any) => {
        regionCodeArr.push(o.value);
      });
      setAreaScreenValues(regionCodeArr);
      let areaObj: AreaCodeType = {};
      allSelected.forEach((o: AreaItem) => getAreaCodeRelation(areaObj, o));

      update((o) => {
        o.areaCodeRelation = { ...o.areaCodeRelation, ...areaObj };
      });
    },
    [update],
  );

  /** 年份筛选 */
  const yearChange = useMemoizedFn((_currentSelected, allSelected) => {
    setYear(allSelected);
    update((d) => {
      d.year = allSelected[0].value;
      d.sortData = defaultOrder;
      d.scrollLeft = 0;
    });
  });
  /** 月份筛选 */
  const monthChange = useMemoizedFn((currentSelected, allSelected) => {
    setMonth(allSelected);
    update((d) => {
      d.month = allSelected[0].value;
      d.sortData = defaultOrder;
      d.scrollLeft = 0;
    });
  });

  useEffect(() => {
    if (initYear)
      update((o) => {
        o.year = initYear;
      });
  }, [update, initYear]);

  useEffect(() => {
    handleSearch();
  }, [indicators, year, month, area, handleSearch]);

  /** 筛选无数据，恢复默认 */
  useEffect(() => {
    if (isClearFilter) {
      setYearScreenKey(shortId());
      setMonthScreenKey(shortId());
      setAreaScreenKey(shortId());
      setScreenKey?.(shortId());
      setArea([]);
      setIsClearSearch(true);
      keywordRef.current = '';
      update((o) => {
        o.condition.endDate = initYear + dateInfo?.month;
        o.condition.keyword = '';
      });
    }
  }, [defaultSelectIndicators, initYear, dateInfo, isClearFilter, setScreenKey, update]);

  /** 指标筛选 */
  const handleChange = useMemoizedFn((selectedRows) => {
    update((d) => {
      d.indicatorInfo = selectedRows;
      d.sortData = defaultOrder;
      d.scrollLeft = 0;
    });
    setIndicators(() => selectedRows);
  });

  /** 搜索下拉选中 */
  const handleSelectClick = useMemoizedFn((selectItems: SelectItems | undefined) => {
    if (selectItems) {
      setAreaScreenValues([]);
      update((d) => {
        d.sortData = defaultOrder;
        d.scrollLeft = 0;
      });
    }
    if (!selectItems || selectItems.label === '全国') {
      keywordRef.current = '';
    } else {
      keywordRef.current = selectItems.label;
      handleSearchArea?.(selectItems);
    }
    handleSearch();
  });

  /** 清空搜索选项 */
  const handleDeselect = useMemoizedFn(() => {
    setArea([]);
    keywordRef.current = '';
    handleSearch();
    handleSearchArea?.({ label: '', value: '', key: '' });
  });

  if (loading || !initYear) return null;

  return (
    <Wrapper ref={domRef}>
      <Screen
        key={yearScreenKey}
        options={yearConfig}
        onChange={yearChange}
        getPopContainer={() => domRef.current || document.body}
      />
      <Screen
        key={MonthScreenKey}
        options={monthConfig}
        onChange={monthChange}
        getPopContainer={() => domRef.current || document.body}
      />
      <Screen
        key={areaScreenKey}
        options={areaConfig}
        dropdownVisible={[havePay ? undefined : false]}
        onChange={areaChange}
        getPopContainer={() => domRef.current || document.body}
        values={[areaScreenValues]}
      />
      {indicatorList.length ? (
        <TransferSelect
          title="指标"
          data={indicatorList}
          moduleCode="ydjdjjdq"
          forbidEmptyCheck
          pageCode=""
          onChange={handleChange}
          getPopupContainer={() => domRef.current || document.body}
        />
      ) : null}
      {/* 地区搜索 */}
      <AreaSearch
        isClearSearch={isClearSearch}
        onSelectClick={handleSelectClick}
        dataKey={MONTHLY_ECONOMY_SEARCH}
        onDeselect={handleDeselect}
      />
    </Wrapper>
  );
};

export default memo(Filter);

const Wrapper = styled.div`
  float: left;
  height: 40px;
  line-height: 20px;
  padding: 12px 0 8px 0;
  position: relative;
  display: flex;
  align-items: center;

  > div {
    margin-right: 24px;
    vertical-align: middle;

    ul li .prefix-icon {
      line-height: 22px;
    }
  }
  > div:nth-child(4) {
    /* margin-right: 0; */
  }
`;
