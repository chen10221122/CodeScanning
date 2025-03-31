import { useEffect, useState } from 'react';

import { useMemoizedFn } from 'ahooks';
import dayjs from 'dayjs';

import { ScreenType, Options } from '@/components/screen';
import CommonLayout from '@/pages/area/areaFinanceResource/components/layout';
import Template from '@/pages/area/areaFinanceResource/components/template';
import { CommonResponse } from '@/utils/utility-types';

import { getBankList, getBankModalList } from '../../api';
import { useConditionCtx } from '../../components/layout/context';
import { sortMap } from '../../config';
import useTableData from '../../hooks/useTableData';
import useCommonScreen from '../../useCommonScreen';
import useColumns from './useColumns';

const areaLevelOption = [
  {
    title: '地区',
    option: {
      type: ScreenType.SINGLE,
      cancelable: false,
      children: [
        {
          name: '按省',
          value: '1',
          key: 'regionLevel',
        },
        {
          name: '按市',
          key: 'regionLevel',
          value: '2',
        },
        {
          name: '按区县',
          key: 'regionLevel',
          value: '3',
        },
      ],
    },
  },
];

const screenOptions: Options[] = [
  {
    title: '银行等级',
    option: {
      type: ScreenType.SINGLE,
      cancelable: false,
      children: [
        {
          name: '法人机构',
          value: '1',
          key: 'branchType',
        },
        {
          name: '一级分行',
          key: 'branchType',
          value: '2',
        },
        {
          name: '二级分行',
          key: 'branchType',
          value: '3',
        },
        {
          name: '其他营业网点',
          key: 'branchType',
          value: '4',
        },
      ],
    },
  },
];

const map = new Map<string, string>([
  ['1', 'provinceCode'],
  ['2', 'cityCode'],
  ['3', 'countyCode'],
]);

const Content = ({ containerId }: { containerId?: string }) => {
  const {
    state: { condition, isFirstLoad, tableData },
    update,
  } = useConditionCtx();
  const [emptyAttribute, setEmpty] = useState();
  const [value, setValue] = useState([['1']]);
  const [areaValue, setAreaValue] = useState<any>(['1', undefined]);
  useEffect(() => {
    update((d) => {
      d.ready = true;
      d.hiddenBlankColumn = false;
      d.modalRequestApi = getBankModalList;
      d.tableExport = 'regionalFinancialResource_areabank_distribution';
      d.exportName = `银行金融资源分布-${dayjs().format('YYYY.MM.DD')}`;
      d.condition = {
        skip: 0,
        pageSize: 50,
        branchType: '1',
        regionLevel: '1',
      };
    });
  }, [update]);
  const columns = useColumns(emptyAttribute, containerId);
  const { screenConfig } = useCommonScreen();

  const handleScreen = useMemoizedFn((cur, total, index) => {
    setValue((d) => {
      const copy = [...d];
      copy[index] = [cur[0]?.value];
      return copy;
    });
    if (cur[0]?.key === 'regionLevel') {
      setAreaValue([cur[0].value]);
    }
    // 创建一个空对象来存储不同key对应的值数组
    const keyValues: any = {};

    // 遍历对象数组，将相同key的value值添加到对应的值数组中
    cur.forEach((obj: any) => {
      if (!keyValues[obj.key]) {
        keyValues[obj.key] = []; // 初始化值数组
      }
      keyValues[obj.key].push(obj.realValue ?? obj.value);
    });

    // 创建一个新对象来存储拼接后的值
    const result: any = {};

    // 遍历keyValues对象，将每个值数组用逗号拼接起来，并存储到新对象中
    for (const key in keyValues) {
      result[key] = keyValues[key].join(',');
    }
    update((d) => {
      if (!cur[0]) {
        d.condition.provinceCode = '';
        d.condition.cityCode = '';
        d.condition.countyCode = '';
        d.tableLoading = true;
      } else {
        if (cur[0].key === 'regionLevel') {
          d.condition.provinceCode = '';
          d.condition.cityCode = '';
          d.condition.countyCode = '';
          d.condition.regionLevel = cur[0].value;
        } else if (cur[0].key === 'branchType') {
          for (const key in result) {
            d.condition[key] = result[key];
          }
        } else {
          const key = map.get(condition.regionLevel) || '';
          d.condition[key] = result[key];
        }
      }
      if (tableData.length) {
        d.ready = true;
        d.tableLoading = true;
      }
      if (cur[0]?.key === 'branchType') {
        d.sheetNames = { 0: `${cur[0].name}` };
      }
      d.condition.skip = 0;
    });

    if (document.getElementById(`${containerId ? containerId : 'areaFinancingWrapper'}`)) {
      (document.getElementById(`${containerId ? containerId : 'areaFinancingWrapper'}`) as HTMLElement).scrollTop = 0;
    }
  });

  const dataFormatFn = useMemoizedFn((data: CommonResponse<any>) => {
    update((d) => {
      d.tableData = data.data.data.map((item: any, index: number) => ({
        ...item,
        index: condition.skip + index + 1,
      }));
      d.total = data.data.total;
      d.tableLoading = false;
      if (isFirstLoad) {
        d.isFirstLoad = false;
      }
      const emptyObj: any = {};
      // 遍历对象数组的第一个对象，初始化统计对象的键
      for (const prop in data.data.data[0]) {
        emptyObj[prop] = true;
      }
      // 遍历对象数组，更新统计对象的值
      for (const obj of data.data.data) {
        for (const prop in obj) {
          if (obj[prop] !== 0) {
            emptyObj[prop] = false;
          }
        }
      }
      setEmpty(emptyObj);
    });
  });

  const handleSort = useMemoizedFn((pagination, filters, sorter, extra: { currentDataSource: []; action: any }) => {
    update((d) => {
      d.condition.sort = sorter.order ? `${sorter.field}:${sortMap.get(sorter.order) || ''}` : '';
      d.tableLoading = true;
      d.ready = true;
    });
  });

  const pageChangeFn = useMemoizedFn((cur) => {
    update((d) => {
      d.condition.skip = (cur - 1) * 50;
      // 不请求数据
      d.ready = false;
    });
  });

  useTableData({ api: getBankList, dataFormatFn });
  return (
    <Template
      pageConfig={{
        columns,
        screenConfig: screenOptions,
        handleScreen,
        handleSort,
        pageChangeFn,
        screenValue: value,
        fullData: true,
        areaFormConfig: screenConfig,
        areaLevelOption: areaLevelOption,
        areaValue: areaValue,
        containerId,
      }}
    />
  );
};

export default function LoanScale({ containerId }: { containerId?: string }) {
  return (
    <CommonLayout>
      <div style={{ flex: 1 }}>
        <Content containerId={containerId} />
      </div>
    </CommonLayout>
  );
}
