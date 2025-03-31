import { Options, ScreenType } from '@dzh/screen';
import dayjs from 'dayjs';
import { cloneDeep, isEmpty } from 'lodash';

interface FilterItem {
  name: string;
  value: string;
  count: number;
  children?: FilterItem[] | null;
}

export interface ScreenItem {
  name: string;
  value: string;
  key: number | string;
  _key?: string;
  children?: ScreenItem[];
  [k: string]: any;
}

interface AreaItem {
  name: string;
  value: string;
  children?: AreaItem[];
  [key: string]: any;
}

interface AreaProps {
  list: AreaItem[];
  code: string;
  /** 地区筛选新配置 适用于舆情动态下的节点 */
  isNewAreaScreen?: boolean;
}

/** 筛选项加统计数字 */
export const formatFilterTitle: any = (list: FilterItem[], key: string) => {
  if (list.length) {
    return list.map((item: FilterItem) => ({
      ...item,
      name: `${item.name}(${item.count})`,
      oldName: item.name,
      key,
      children: formatFilterTitle(item?.children || [], key),
    }));
  }
  return null;
};

export const addParamsKey: any = (list: ScreenItem[], _key: string, more: boolean, key = '_key') => {
  return list.map((item: any) => ({
    ...item,
    [key]: _key,
    inMore: more,
    children: item?.children?.length ? addParamsKey(item.children, _key, more, key) : undefined,
  }));
};

export const trimComma = (o: Record<string, any>) => {
  const obj = cloneDeep(o);
  Object.keys(obj).forEach((i) => {
    if (String(obj[i]).endsWith(',')) {
      obj[i] = obj[i].replace(/,$/gi, '');
    } else if (String(obj[i]).endsWith(';')) {
      obj[i] = obj[i].replace(/;$/gi, '');
    }
  });
  return obj;
};

export const formatToNormalDate = (d: Date, rule = 'YYYYMMDD') => {
  return dayjs(d).format(rule);
};

/** 获取近n年区间 */
/** 拓展：增加半年制的筛选(story#27177) */
export const getRecentTimeFromNow = (yearCount: number | number[], rule = 'YYYYMMDD') => {
  const now: Date = new Date();
  const nowATime: string = dayjs(now).format(rule);
  const nowMonth: string = dayjs(now).format('MM-DD');
  let res = [];
  if (Array.isArray(yearCount) && !isEmpty(yearCount)) {
    const bigNum = Math.max(...yearCount);
    const smallNum = Math.min(...yearCount);
    res = [
      formatToNormalDate((now.getFullYear() - bigNum + '-' + nowMonth) as unknown as Date, rule),
      formatToNormalDate((now.getFullYear() - smallNum + '-' + nowMonth) as unknown as Date, rule),
    ];
    return `[${res[0]},${res[1]})`;
  } else if ((yearCount as number) % 1 === 0.5) {
    // 获取跳差的月份
    const sixMonthsChange = dayjs(now).subtract((yearCount as number) * 12, 'month');
    res = [sixMonthsChange.format(rule), nowATime];
    return `[${res[0]},${res[1]})`;
  }
  res = [
    formatToNormalDate((now.getFullYear() - (yearCount as number) + '-' + nowMonth) as unknown as Date, rule),
    nowATime,
  ];
  return `[${res[0]},${res[1]})`;
};

/** 找下属辖区 */
export const findAreaJurisdictions: (props: AreaProps) => AreaItem = ({ list, code }: AreaProps) => {
  const provinceLevel = list.find((provinceItem: AreaItem) => provinceItem.value === code) as any;
  if (provinceLevel) return provinceLevel;
  const provinceInfo = list.find((provinceItem: AreaItem) => {
    const children = findAreaJurisdictions({ list: provinceItem?.children || [], code })?.children || [];
    return children.length > 0;
  }) as any;
  if (provinceInfo?.children) {
    return findAreaJurisdictions({ list: provinceInfo.children, code });
  }
  return {};
};

/** 配置下属辖区筛选项 */
export const initJurisdictionsOption = ({ list, code, isNewAreaScreen }: AreaProps) => {
  let optionList: any[] = [];
  const Jurisdictions = findAreaJurisdictions({ list: cloneDeep(list), code });
  if (Jurisdictions?.children && Jurisdictions?.value !== '100000') {
    optionList = Jurisdictions.children;
  } else if (Jurisdictions?.value === '100000') {
    const areaOption = cloneDeep(list);
    areaOption.shift();
    optionList = areaOption;
  } else {
    optionList = [];
  }

  // 3表示区县级
  const isDistrict = optionList[0]?.key === 3;
  const firstLevelName = isDistrict ? '全部' : '全部（地级市）';

  const newAreaScreenOption = isNewAreaScreen
    ? {
        hasAreaSelectAll: false,
        formatSelectAllTitle: (row: any, selected: any[], level: number) => {
          return level === 1 ? '全部' : firstLevelName;
        },
        // 组件内用到了_key属性，这里改一下
        children: addParamsKey(optionList, 'area', false, '__key'),
      }
    : {
        cancelable: true,
        hasSelectAll: false,
        hasAreaSelectAll: false,
        cascade: true,
        children: addParamsKey(optionList, 'area'),
      };

  return {
    title: '下属辖区',
    option: {
      type: isDistrict ? ScreenType.MULTIPLE : ScreenType.MULTIPLE_THIRD_AREA,
      ...newAreaScreenOption,
      formatTitle: (rows: any) => {
        if (!rows.length) return '下属辖区';
        return rows.map((row: any) => row.name).join(',');
      },
    },
  };
};

/** 获取一段时间区间 */
export const getRecentRange = (num: number, type: 'month' | 'week' | 'year', rule = 'YYYYMMDD') => {
  return `[${dayjs().subtract(num, type).format(rule)},${dayjs().format(rule)}]`;
};

/** 替换筛选配置中的某一组筛选项 */
export const replaceFilterItem = (all: Options[], key: string, newOption: Options[]) => {
  let res = cloneDeep(newOption);
  const target = all.find((item: any) => item.option?.children?.[0]?.key === key);
  if (target) {
    res = res.map((menuItem: Options) => {
      if (menuItem.title === target.title) {
        return target;
      } else {
        return menuItem;
      }
    });
  }
  return res;
};

const addUnit = (str: string, needJointUnit: boolean) => {
  return `${str}${needJointUnit ? '0000' : ''}`;
};

/** 自定义 注册资本/xxx比例 筛选结果处理 */
export const handleAmountOrRadioRange = (value: string[], infiniteIntervalVal: string, needJointUnit: boolean) => {
  let res = '';
  const [before, after] = value;
  if (before && after) {
    res = `[${addUnit(before, needJointUnit)},${addUnit(after, needJointUnit)});`;
  } else if (before) {
    res = `[${addUnit(before, needJointUnit)},${infiniteIntervalVal});`;
  } else if (after) {
    res = `[${infiniteIntervalVal},${addUnit(after, needJointUnit)});`;
  }
  return res;
};

export const formatInMoreTitle = (value: string[], unit: '万' | '%') => {
  let name = '';
  const [before, after] = value;
  if (before && after) {
    name = `${before}-${after}${unit}`;
  } else if (before) {
    name = `${before}${unit}以上`;
  } else if (after) {
    name = `${after}${unit}以内`;
  }
  return name;
};

export const formatTitle = (rows: any, unit: '万' | '%', title = '注册资本') => {
  let res = '';
  if (rows.length) {
    res = rows.reduce((str: string, obj: any) => {
      let name = '';
      if (obj.name === '自定义') {
        name = formatInMoreTitle(obj.value, unit);
      }
      return `${str ? str + ',' : ''}${name || obj.name}`;
    }, '');

    return res;
  }

  return title;
};

export const filterEmptyOption = (list: Options[]) => {
  return list.filter((item: Options) => item.title !== 'isEmpty');
};
