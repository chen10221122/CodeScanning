import { useEffect, useRef, useState, useMemo } from 'react';

import shortid from 'shortid';

import { getSocianFinance } from '@/apis/area/areaEconomy';
import useRequest from '@/utils/ahooks/useRequest';

const screenOptionValueMap = ['03', '06', '09', '12'];

/**
  @params: 请求参数
  @DEFAULTSCREENINDEX: 默认的筛选index
  @isHandleChange：是否手动筛选，默认为false
*/
const useSocialFinanceData = (params: any, DEFAULTSCREENINDEX: number, isHandleChange: boolean) => {
  const dataRef = useRef();
  // 跳过筛选项自动变化的loading
  const [screenChange, setScreenChange] = useState<boolean>(false);
  const [formattedData, setFormattedData] = useState<any>();
  const [defaultScreenChanged, setDefaultScreenChanged] = useState<number>(DEFAULTSCREENINDEX);

  // 获得指标目录，通过返回的指标去请求对应的数据
  // const { data: quotaData } = useRequest(getSocianFinanceQuota, {
  //   manual: false,
  //   onSuccess(res: any) {
  //     // console.log(res)
  //   },
  //   onError(err) {
  //     console.log(err)
  //   }
  // })

  // 判断筛选是否正确，如果默认是年度判断是否包含上一年的数据，否则判断是否包含本年的数据
  const currentIncludes = useMemo(() => {
    const curYear = new Date().getFullYear();
    const currentYear = defaultScreenChanged === 3 ? curYear - 1 : curYear;
    return `${currentYear}${screenOptionValueMap[defaultScreenChanged]}`;
  }, [defaultScreenChanged]);

  const { data, loading, run, error } = useRequest(getSocianFinance, {
    manual: true,
    onSuccess(res: any) {
      // 判断非手动筛选情况下有没有数据 并且当前年也需要有数据
      if (!isHandleChange) {
        // 保证第一次进入页面的筛选和最新数据是匹配的：库中的数据可能延迟更新，比如2023-5，库中数据可能只到了2022-12
        if (!res?.data?.length || !res?.data?.[0]?.dateIndex?.includes(currentIncludes)) {
          // 防止刚刚到达某个季度没有数据
          setDefaultScreenChanged(defaultScreenChanged ? defaultScreenChanged - 1 : 3);
        } else {
          setScreenChange(true);
        }
      }
    },
    onError() {
      // 出现错误也需要设为true，防止一直loading
      setScreenChange(true);
    },
  });

  useEffect(() => {
    if (JSON.stringify(dataRef.current) !== JSON.stringify(params) && params.regionCode) {
      run({ ...params });
      dataRef.current = { ...params };
    }
  }, [params, run]);

  useEffect(() => {
    if (data?.data) {
      setFormattedData(getFormattedTableData(data?.data));
    }
  }, [data]);

  return {
    data: formattedData,
    originData: data?.data,
    loading,
    run,
    error,
    defaultScreenChanged,
    screenNotMoreChange: screenChange,
    setScreenChange,
  };
};

// 具体的指标，如果通过中台的指标目录接口获取也需要做判断处理，所以直接写死
const quotaContent = [
  {
    quotaCode: '10001050',
    value: '地区社会融资规模增量(亿元)',
  },
  {
    quotaCode: '10001050',
    value: '地区社会融资规模增量同比(%)',
  },
  {
    isTitle: true,
    value: '表内融资',
  },
  {
    quotaCode: '10001082',
    value: '人民币贷款(亿元)',
  },
  {
    quotaCode: '10001114',
    value: '外币贷款(亿元)',
  },
  {
    isTitle: true,
    value: '表外融资',
  },
  {
    quotaCode: '10001146',
    value: '委托贷款(亿元)',
  },
  {
    quotaCode: '10001178',
    value: '信托贷款(亿元)',
  },
  {
    quotaCode: '10001210',
    value: '未贴现银行承兑汇票(亿元)',
  },
  {
    isTitle: true,
    value: '直接融资',
  },
  {
    quotaCode: '10001242',
    value: '企业债券(亿元)',
  },
  {
    quotaCode: '10001274',
    value: '政府债券(亿元)',
  },
  {
    quotaCode: '10001306',
    value: '非金融企业境内股票融资(亿元)',
  },
  {
    isTitle: true,
    value: '其他',
  },
  {
    quotaCode: null,
    value: '其他融资(亿元)',
  },
];

// 格式化处理得到表格可以直接使用的数据
const getFormattedTableData = (data: any) => {
  let columnsData: Array<any> = [];
  let resourceData: Array<any> = [];
  // 获取到表格标题
  columnsData = data?.map((dataInfo: any) => dataInfo?.dateIndex?.substring(0, 4) + '年');

  // 通过具体的指标格式类处理表格数据
  quotaContent.forEach((item: any, idx: number) => {
    data?.forEach((dataInfo: any) => {
      const date = dataInfo?.dateIndex?.substring(0, 4) + '年';
      const dataInfoValue = dataInfo?.value?.[0]?.value;
      if (!resourceData[idx]) {
        resourceData[idx] = {
          key: shortid(),
        };
      }
      // 前两个指标用的是同一条数据，取值不同
      if (idx === 0 || idx === 1) {
        (resourceData[idx] as any)[date] = idx === 0 ? dataInfoValue?.[0]?.mValue : dataInfoValue?.[0]?.yearOnYear;
        (resourceData[idx] as any)['quota'] = {
          ...item,
        };
      } else {
        // 筛选出其他指标项，其他融资的pCode为null
        const matchedDataInfo = dataInfoValue?.filter((info: any) => info?.pCode === item.quotaCode)?.[0];
        (resourceData[idx] as any)[date] = item.isTitle ? '' : matchedDataInfo?.mValue;
        (resourceData[idx] as any)['quota'] = {
          ...item,
        };
      }
    });
  });

  return {
    columnsData: columnsData,
    resourceData: resourceData,
  };
};

export default useSocialFinanceData;
