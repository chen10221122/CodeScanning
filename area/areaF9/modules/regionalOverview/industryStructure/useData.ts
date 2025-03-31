import { useCallback, useEffect, useRef, useState } from 'react';

import dayjs from 'dayjs';
import { get, range, min, max, difference, orderBy } from 'lodash';

import { useParams } from '@pages/area/areaF9/hooks';

import { getTblData } from '@/apis/area/areaDebt';
import { formatNumber } from '@/utils/format';
import { useAsync } from '@/utils/hooks';

import { useSelector } from '../../../context';
import { IIndustryName, IndustryName, startDate } from './industryStructure';

export interface IRequestData {
  endDate: string;
  regionCode: string;
  size?: number;
}

interface IItem {
  key: IIndustryName | 'total';
  name: string;
  [key: string]: string | number;
}

type IList = any[];
const defaultData: IList = [];
// type getData = (params: IRequestData) => Promise<IResponseData>;

const getColumnData = (list: any[], key: IIndustryName) => {
  return (list?.filter((item: any) => item.indicName === key) || [])[0] || {};
};

/** bug38193 根据原来老代码补全接口缺失年份数据 */
const completeDataFn = (originList: any[]) => {
  const dateList = originList.map((list) => list.endDate);
  const numericYears = dateList.map(Number);
  const completeYearArray = range(min(numericYears)!, max(numericYears)! + 1).map(String);
  const completeMiddle = difference(completeYearArray, dateList).map((item) => ({
    endDate: item,
    indicatorList: [
      {
        indicCode: '',
        indicName: '',
        mValue: '-',
      },
    ],
  }));
  return orderBy([...originList, ...completeMiddle], 'endDate', 'desc');
};

// 数据处理增加合计和百分比
const filterData = (data: IList[]) => {
  const result: IItem[] = Object.keys(IndustryName).map((key: string) => ({
    key: key as IIndustryName,
    name: IndustryName[key as IIndustryName],
  }));
  const totalData: IItem = { name: '合计', key: 'total' as const };
  data.forEach((item: any, idx) => {
    const list: IList = get(item, 'indicatorList', []);
    if (list.length) {
      const totalGdp = list.reduce((total: number, it: any) => total + parseFloat(it.mValue || 0), 0);
      const totalGdpFix = totalGdp.toFixed(2);
      totalData[`mValue_${idx}`] = totalGdpFix;
      totalData[`value_${idx}`] = formatNumber(totalGdpFix);
      totalData[`percent_${idx}`] = totalGdp ? '100.00' : '-';
      result.forEach((it, index) => {
        const { mValue, guid } = getColumnData(list, it.key as IIndustryName);
        result[index][`mValue_${idx}`] = mValue;
        result[index][`value_${idx}`] = mValue ? formatNumber(mValue) : '';
        result[index][`percent_${idx}`] = mValue ? ((mValue * 100) / +totalGdpFix).toFixed(2) : '';
        result[index][`guid_${idx}`] = guid;
      });
    }
  });
  result.unshift(totalData);
  return result;
};

// 默认获取有数据的两年数据
const getTwoYearList = (data: IList) => {
  let result: IList = [];
  data.find((it: any) => {
    if (it?.indicatorList?.length) {
      result.push(it);
    }
    return result.length === 2;
  });
  return result;
};

// 获取全量数据，当前年份做结束年份
const endDate = dayjs().format('YYYY');

//获取产业结构数据 加上 默认筛选参数
const getIndtstryStrructure = async (params: IRequestData) => {
  const indicName = Object.keys(IndustryName);
  const res = await getTblData({ ...params, indicName, endDate: `[${startDate},${endDate})` });
  if (res.returncode === 0) {
    return get(res, 'data.data', []).sort((a: any, b: any) => +b.endDate - +a.endDate);
  }
  return res;
};

export default function useData() {
  const { code } = useParams();
  const lastYear = useSelector((store) => store.lastYear);

  const [date, setDate] = useState(lastYear);
  const dataSourceRef = useRef(defaultData);
  const [indicatorList, setIndicatorList] = useState(defaultData);
  const { data, execute, pending, error } = useAsync(getIndtstryStrructure);
  useEffect(() => {
    if (error) {
      setIndicatorList(defaultData);
    }
  }, [error]);

  useEffect(() => {
    dataSourceRef.current = completeDataFn(Array.isArray(data) ? data : defaultData);
    let list = getTwoYearList(dataSourceRef.current);
    const date = get(list, '[0].endDate', lastYear);
    // 数组第一项为开始年份，则有数据的年份只有一年，且为起始年份，起始年份做数组第二项，前一年为空
    if (date === startDate) {
      list = [{}, list[0]];
      setDate(String(+date + 1));
    } else {
      setDate(date);
    }
    setIndicatorList(filterData(list));
  }, [data, lastYear]);

  useEffect(() => {
    if (code && lastYear) {
      execute({ regionCode: code, endDate: lastYear });
    }
  }, [code, execute, lastYear]);

  const menuChange = useCallback(
    (cur) => {
      if (cur[0]) {
        document.querySelector('#regional_economy_right .ant-table-body')?.scrollTo({ top: 0, behavior: 'smooth' });
        const date = cur[0]?.value || '';
        const idx = dataSourceRef.current.findIndex((it) => it?.endDate === date);
        const list: IList = [dataSourceRef.current[idx], dataSourceRef.current[idx + 1]];
        setIndicatorList(filterData(list));
        setDate(date);
      }
    },
    [setDate],
  );
  return { loading: Boolean(pending), indicatorList, menuChange, date, code, error, execute };
}
