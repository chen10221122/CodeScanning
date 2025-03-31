import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import dayjs from 'dayjs';
import { isEmpty } from 'lodash';

import { getNewAreaEconomy, getAreaEconomyInfo, getAreaModel } from '@/apis/area/areaEconomy';
import useTab from '@/libs/route/hooks/useTab';
import { useCtx } from '@/pages/area/areaEconomy/provider/getContext';
import useLimits from '@/pages/area/areaEconomy/useLimits';
import useRequest from '@/utils/ahooks/useRequest';
import { useQuery } from '@/utils/hooks';

const widthChartTitleArr = [
  'GDP(亿元)',
  'GDP增速(%)',
  '人口(万人)',
  '一般公共预算收入(亿元)',
  '地方政府债务余额(亿元)',
  '城投平台有息债务(亿元)',
];

const currentYear = new Date().getFullYear();

export default function useMainTop() {
  const history = useHistory();
  const {
    state: { code, regionData },
    update,
  } = useCtx();
  const { remove } = useTab();
  const { showPowerDialog } = useQuery();
  const [mainTopData, setMainTopData] = useState([]);
  const [areaDataInfo, setAreaDataInfo] = useState({});
  const [modelInfo, setModelInfo] = useState([]);
  const [hasGdpYear, setHasGdpYear] = useState('-');

  const { handleLimit } = useLimits();

  // 上方卡片的接口请求
  const { data, run: execute, loading: pending, error } = useRequest(getNewAreaEconomy, { manual: true }); // eslint-disable-line
  // const { data, run: execute, loading: pending, error } = useRequest(getAreaEconomy, { manual: true }); // eslint-disable-line
  const { data: areaInfo, run: getInfo, loading: infoPending } = useRequest(getAreaEconomyInfo, { manual: true });
  const {
    data: modelInfoData,
    run: getModelInfo,
    loading: modelInfoPending,
  } = useRequest(getAreaModel, {
    manual: true,
  });

  const havePay = useSelector((store) => store.user.info).havePay;
  const havePayRef = useRef(havePay);

  useEffect(() => {
    havePayRef.current = havePay;
  }, [havePay]);

  // const trialRef = useRef();
  const codeRef = useRef(code);

  useEffect(() => {
    codeRef.current = code;
  }, [code]);

  useEffect(() => {
    if (error) {
      if (error.returncode === 202) {
        // 如果超过权限范围，先将当前 tab 去掉，然后新开页面，解决从其他页面跳转到区域经济速览的问题
        // 不使用 true 作为变化的参数是因为如果已经打开了北京，再打开新地区，还是会定位在这个地址，下面的 useEffect 判断 showPowerDialog 就不起作用
        remove();
        history.replace(`/110000/area/regionEconomy?showPowerDialog=${Math.random().toFixed(2)}`);
      }
    }
  }, [error, update, history, remove]);

  // 如果是因为权限不足定位到北京，那么就默认打开权限不足的弹窗，只有上面的重定向才会带有showPowerDialog参数
  useEffect(() => {
    if (showPowerDialog) {
      handleLimit('110000', (info) => {
        if (info?.info === '该模块为VIP模块，已查询5/5个地区/天，提升等级可获更多权限') {
          update((o) => {
            o.showPowerDialog = true;
          });
        }
      });
    }
  }, [handleLimit, showPowerDialog, update]);

  useEffect(() => {
    // 当 code 存在的时候才去请求，否则就会请求到默认上海的数据，是有问题的
    if (codeRef.current) {
      getInfo({ regionCode: codeRef.current, underlingFlag: true });
      getModelInfo({ regionCode: codeRef.current });
    }
    //数据转换为chartCard所需格式
    let tempData = data ? data.data : [],
      result = widthChartTitleArr.map(() => {
        return { valueArr: [], latestValue: '', changedValue: '' };
      });
    //以GDP有数据的年份为基准
    let basicYear = '';
    const basicData =
      tempData?.length && tempData[0].child ? tempData[0].child.filter((o) => o.name === 'GDP(亿元)')[0].value : '';
    const basicDatakey = Object.keys(basicData);
    const lastYear = basicDatakey[basicDatakey?.length - 1];
    const newYear = basicDatakey[basicDatakey?.length - 2];
    basicYear = basicData ? (lastYear === currentYear.toString() ? newYear : lastYear) : '';
    setHasGdpYear(basicYear);

    tempData?.forEach?.((o) => {
      if (o?.child?.length) {
        o.child.forEach((item) => {
          const activeIndex = widthChartTitleArr.indexOf(item?.name);
          if (activeIndex > -1 && item?.value && item.value !== '{}') {
            result[activeIndex]['valueArr'] =
              item?.value && item.value !== '{}' ? Object.keys(item.value).map((o) => item.value[o].mValue) : [];
            //当前字段历年数据数组
            let currentValueArr = result[activeIndex]['valueArr'];
            const currentValueArrLength = currentValueArr.length;
            //取GDP年份为基准的数据计算显示值及变化值
            if (currentValueArrLength && item?.value[basicYear]) {
              result[activeIndex]['latestValue'] = item?.value[basicYear].mValue || '';
              if (
                currentValueArrLength > 1 &&
                item?.value[basicYear] &&
                item?.value[basicYear - 1] &&
                Object.prototype.hasOwnProperty.call(item?.value[basicYear], 'mValue') &&
                Object.prototype.hasOwnProperty.call(item?.value[basicYear - 1], 'mValue') &&
                item?.value[basicYear].mValue !== item?.value[basicYear - 1].mValue
              ) {
                const changedValue = parseFloat(
                  item?.value[basicYear].mValue - item?.value[basicYear - 1].mValue,
                ).toFixed(2);
                result[activeIndex]['changedValue'] = Math.abs(changedValue).toFixed(2);
                result[activeIndex]['changedType'] = changedValue > 0 ? 'up' : 'down';
              }
            }
          }
        });
      }
    });

    setMainTopData(result);
    if (isEmpty(regionData)) {
      update((d) => {
        return Object.assign(d, { regionData: tempData });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, update, getInfo, getModelInfo]);

  useEffect(() => {
    if (areaInfo?.data) {
      setAreaDataInfo(areaInfo?.data);
      update((d) => {
        Object.assign(d, {
          areaInfo: areaInfo?.data,
          lastYear: dayjs(areaInfo?.data.areaEconomyAndDebtDate).format('YYYY'),
        });
      });
    }
  }, [areaInfo, update]);

  useEffect(() => {
    if (modelInfoData?.data) {
      setModelInfo(modelInfoData.data);
    }
  }, [modelInfoData]);

  useEffect(() => {
    if (havePay && code) {
      getInfo({ regionCode: code });
      getModelInfo({ regionCode: code });
    }
  }, [havePay, code, getInfo, getModelInfo]);

  useEffect(() => {
    if (code) execute({ code });
  }, [code, execute]);

  useEffect(() => {
    update((d) => {
      const temp = modelInfoData?.data?.[0];
      const tempCode = temp?.country_code
        ? temp?.country_code
        : temp?.municipal_code
        ? temp?.municipal_code
        : temp?.province_code;
      d.topCode = String(tempCode);
      d.provinceCode = String(temp?.province_code);
    });
  }, [modelInfoData?.data, update]);

  return {
    code,
    pending: pending || infoPending || modelInfoPending,
    error,
    modelInfo: modelInfo.length ? modelInfo[0] : {},
    mainTopData,
    areaDataInfo,
    hasGdpYear,
    execute,
    modelInfoData,
  };
}
