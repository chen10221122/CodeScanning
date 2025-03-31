import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { useMemoizedFn } from 'ahooks';

import { getAreaModel } from '@/apis/area/areaEconomy';
import useRequest from '@/utils/ahooks/useRequest';

import { getEconomyChoiceParam, getAreaEconomyAndDebtChequer } from './api';
import { CardMetricTips, CardMetricUnits } from './components/chartLayOutContainer/types';
import { ChartType, ModalType } from './types';
import { formatValue, getValueDes } from './utils';

// const widthChartTitleArr = [
//   'GDP(亿元)',
//   'GDP增速(%)',
//   '人口(万人)',
//   '一般公共预算收入(亿元)',
//   '地方政府债务余额(亿元)',
//   '城投平台有息债务(亿元)',
// ];

// const currentYear = new Date().getFullYear();

export default function useMainTop({ hiddenEmptyCard, sortMap, cardDefaultChoice }) {
  const hasPay = useSelector((store) => store.user.info).havePay;
  const [modelInfo, setModelInfo] = useState([]);
  const [firstLoading, setFirstLoading] = useState(true);
  // 手动限制初始请求次数
  const requestCountRef = useRef(0);
  // const [hasGdpYear, setHasGdpYear] = useState('-');
  const [cardParam, setCardParam] = useState({
    indexParamList: [],
    restoreDefault: 1,
  });
  const [formatCardData, setFormatCardData] = useState([]);
  const { code } = useParams();

  const [resetFlag, setResetFlag] = useState(false);
  const {
    data: paramData,
    run: getParam,
    loading: paramLoading,
  } = useRequest(getEconomyChoiceParam, {
    manual: true,
    params: {
      pageCode: 0,
    },
  });
  const {
    data: cardData,
    run: getCardData,
    runAsync: getCardDataAsync,
    loading: cardLoading,
    error,
  } = useRequest(getAreaEconomyAndDebtChequer, { manual: true });

  // 获取默认的指标数据
  const handleGetDefData = useMemoizedFn(() => {
    const cardDefList = Object.values(cardDefaultChoice);
    setCardParam({
      indexParamList: cardDefList,
      restoreDefault: 1,
    });
    getCardData({
      regionCode: code,
      indexParamList: cardDefList,
      restoreDefault: 1,
    });
    setResetFlag(false);
  });

  // 初次请求
  useEffect(() => {
    if (requestCountRef.current === 1 && !paramLoading) {
      // 有权限才用缓存
      if (paramData && hasPay) {
        requestCountRef.current++;
        const {
          data: { indicList, restoreDefault },
        } = paramData;
        setCardParam({
          indexParamList: indicList,
          restoreDefault,
        });
        getCardDataAsync({
          regionCode: code,
          indexParamList: indicList,
          restoreDefault: restoreDefault,
        }).finally(() => {
          setFirstLoading(false);
        });
        // restoreDefault 为是否默认参数，true 为是默认参数，无需恢复默认
        setResetFlag(!+restoreDefault);
      } else {
        const choiceParam = Object.values(cardDefaultChoice);
        if (choiceParam.length) {
          requestCountRef.current++;
          setCardParam({
            indexParamList: choiceParam,
            restoreDefault: 1,
          });
          getCardDataAsync({
            regionCode: code,
            indexParamList: choiceParam,
            restoreDefault: 1,
          }).finally(() => {
            setFirstLoading(false);
          });
          setResetFlag(false);
        }
      }
    }
  }, [cardDefaultChoice, code, getCardDataAsync, handleGetDefData, hasPay, paramData, paramLoading]);

  useEffect(() => {
    if (cardData?.data?.length) {
      const result = [];
      let count = 0;
      cardData.data.forEach(({ child }) => {
        child.forEach((item) => {
          const { isCustom, customValueType } = getValueDes(item?.indexId, item?.value);
          let hasBG = false;
          const cardItem = {
            data: {
              title: item.name,
              indexId: item?.indexId,
              unit: item?.unit || CardMetricUnits[item.name],
              smallUnit: true,
              isCustom,
              customValueType,
              // 1.有趋势图 2.趋势图类型不为null 3.不是自定义指标的布尔值
              hasChart: !!(+item?.detailFlag && item?.detailType) && (!isCustom || (isCustom && customValueType)),
              chartType: ChartType[item?.detailType],
            },
          };

          if (CardMetricTips[item?.indexId ? item.indexId : item.name]) {
            cardItem.data.tooltipText = CardMetricTips[item?.indexId ? item.indexId : item.name];
          }
          if (!+item?.detailFlag) {
            // cardItem.backgroundImg = CardMetricImg[item?.indexId ? item.indexId : item.name] ?? CardMetricImg.default;
            hasBG = true;
          }
          if (item?.nationalRank) {
            cardItem.data.nationalRank = item.nationalRank;
          }
          if (item?.provinceRank) {
            cardItem.data.provinceRank = item.provinceRank;
          }
          if (item?.comparison && !hasBG) {
            cardItem.data.changedValue = +item.comparison;
            cardItem.data.changedType = Number(item.comparison) > 0 ? 'up' : 'down';
          }

          if (item?.value) {
            const valueKeys = Object.keys(item.value);
            if (valueKeys.length) {
              // cardItem.data.text = item.value[valueKeys[valueKeys.length - 1]]['mValue'];
              cardItem.data.text = formatValue(item.unit, item.value[valueKeys[valueKeys.length - 1]]['mValue']);

              if (/*valueKeys.length > 1 &&*/ !hasBG) {
                // cardItem.data.lastYear = valueKeys[valueKeys.length - 1];
                cardItem.data.title = valueKeys[valueKeys.length - 1] + '年' + item.name;
                cardItem.data.chartTitle = item.name;
                cardItem.data.valueArr = valueKeys.map((year) => item.value[year]['mValue']);
                // cardItem.data.valueArr = valueKeys.map((year) => formatValue(item.unit, item.value[year]['mValue']));
                cardItem.data.chartValue = item.value;
                cardItem.data.colorType = item?.colorType ?? count % 3; // 3种颜色
                cardItem.widthChart = true;
                count++;
              }
            }
          }
          if (hiddenEmptyCard && cardItem.data.text) {
            result.push(cardItem);
          } else if (!hiddenEmptyCard) {
            result.push(cardItem);
          }
        });
      });
      if (sortMap.hasSort && !error) {
        result.sort((a, b) => sortMap[a.data.indexId] - sortMap[b.data.indexId]);
      }
      // console.log('九宫格处理后的数据:', result);
      setFormatCardData(result);
    }
  }, [cardData, hiddenEmptyCard, sortMap, error]);

  const {
    data: modelInfoData,
    run: getModelInfo,
    loading: modelInfoPending,
  } = useRequest(getAreaModel, {
    manual: true,
  });

  useEffect(() => {
    // 当 code 存在的时候才去请求，否则就会请求到默认上海的数据，是有问题的
    if (code) {
      // getInfo({ regionCode: code, underlingFlag: true });
      getModelInfo({ regionCode: code });
    }
  }, [code, getModelInfo]);
  useEffect(() => {
    if (modelInfoData?.data) {
      setModelInfo(modelInfoData.data);
    }
  }, [modelInfoData]);

  useEffect(() => {
    if (code && requestCountRef.current === 0) {
      getParam({ pageCode: ModalType.CARD });
      requestCountRef.current = 1;
    }
  }, [code, getParam]);

  const handGetDataAsync = useMemoizedFn((params) => {
    setResetFlag(!params.restoreDefault);
    setCardParam(params);
    return getCardDataAsync(params);
  });

  return {
    code,
    pending: paramLoading || cardLoading || modelInfoPending,
    firstLoading,
    error,
    modelInfo: modelInfo.length ? modelInfo[0] : {},
    resetFlag,
    getCardData,
    getCardDataAsync: handGetDataAsync,
    handleGetDefData,
    modelInfoData,
    formatCardData,
    paramData: {
      ...paramData,
      data: { indicList: cardParam.indexParamList, restoreDefault: cardParam.restoreDefault },
    },
    paramLoading,
    defaultChoice: cardDefaultChoice,
  };
}
