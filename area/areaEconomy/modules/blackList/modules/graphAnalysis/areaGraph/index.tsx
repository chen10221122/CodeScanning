import { memo, useMemo, useEffect } from 'react';

import styled from 'styled-components';

import Icon from '@/components/icon';
import GraphCardContainer from '@/pages/area/areaEconomy/modules/blackList/component/graphCardContainer';
import { DEFAULTAREACODE } from '@/pages/area/areaEconomy/modules/blackList/constant';
import { useCtx } from '@/pages/area/areaEconomy/modules/blackList/context';
import { useGetGraphData } from '@/pages/area/areaEconomy/modules/blackList/hooks/useGetGraphData';
import Top10 from '@/pages/area/areaEconomy/modules/blackList/images/TOP10@2x.png';
import { useImmer } from '@/utils/hooks';

import useCommonStatus, { GraphModuleName } from '../useCommonStatus';
import ChinaMap from './Map';

import styles from '@/pages/area/areaEconomy/modules/blackList/style.module.less';

const colorMap = new Map<number, Record<'color' | 'bg', string>>([
  [0, { color: '#fff', bg: '#FA541C' }],
  [1, { color: '#fff', bg: '#FA8C16' }],
  [2, { color: '#fff', bg: '#FFC53D' }],
]);

const defaultColor = {
  color: '#8C8C8C',
  bg: '#FAFAFA',
};

interface MapAreaCodeTypes {
  regionCode: string;
  preRegionCode: string;
}

const defaultParams = {
  statisticType: 1,
};

export default memo(() => {
  const {
    state: { searchParams, areaCodeTotalAndList, areaNoTopTen, activeTab },
  } = useCtx();
  const [condition, updateCondition] = useImmer<Record<string, any>>(defaultParams);
  const [mapAreaCode, updateMapAreaCode] = useImmer<MapAreaCodeTypes>({
    regionCode: DEFAULTAREACODE,
    preRegionCode: DEFAULTAREACODE,
  });

  const { data, error, isLoadEnd, noData } = useGetGraphData(condition, activeTab);

  // 状态存到ctx中
  useCommonStatus({ name: GraphModuleName.Area, isLoadEnd, error, empty: noData });

  useEffect(() => {
    if (areaCodeTotalAndList) {
      let regionCodeTemp = DEFAULTAREACODE;
      let preRegionCodeTemp = DEFAULTAREACODE;
      const [totalArea, areaCodeList] = areaCodeTotalAndList;
      const len = areaCodeList.length;
      if (!len) {
        regionCodeTemp = DEFAULTAREACODE;
      } else if (len === 1) {
        regionCodeTemp = areaCodeList[0];
      } else {
        // 单选地区地图需要父级code, 此时areaCodeList经过特殊处理只有自身和父级code
        if (totalArea === 1 && areaCodeList.length === 2) {
          regionCodeTemp = areaCodeList[0];
          preRegionCodeTemp = areaCodeList[1];
        } else {
          // 找出每个共有的父级元素即重复个数等于选中个数的，否则为全国
          const record = new Map();
          // 多个县级可能有多个目标，需要特殊处理
          const prepareRegionCodeList: number[] = [];
          for (let i = 0; i < len; i++) {
            let current = areaCodeList[i];
            if (record.has(current)) {
              record.set(current, record.get(current) + 1);
            } else {
              record.set(current, 1);
            }
          }
          // @ts-ignore
          for (const [code, frequence] of record) {
            if (frequence === totalArea) {
              prepareRegionCodeList.push(+code);
            }
          }
          // 县级特殊处理
          regionCodeTemp = prepareRegionCodeList.length ? String(Math.max(...prepareRegionCodeList)) : DEFAULTAREACODE;
        }
      }

      updateMapAreaCode((d: MapAreaCodeTypes) => {
        d.regionCode = regionCodeTemp;
        d.preRegionCode = preRegionCodeTemp;
      });
    }
  }, [areaCodeTotalAndList, updateMapAreaCode]);

  useEffect(() => {
    if (searchParams) {
      updateCondition((d: Record<string, any>) => {
        d = {
          ...defaultParams,
          ...searchParams,
        };
        return d;
      });
    }
  }, [searchParams, updateCondition]);

  const content = useMemo(() => {
    const targetData = data ? data.slice(0, 10) : [];
    const max = Math.max(...targetData.map((i: any) => i.num.value));
    return (
      <AreaGraphContainer className={styles.chartContainerBorder}>
        <ChinaMap {...mapAreaCode} mapInfo={data || []} />
        {!areaNoTopTen ? (
          <div className="list">
            {/* <div className="topTitle">TOP10</div> */}
            <Icon image={Top10} style={{ width: '40px', height: '12px' }} />
            {targetData && targetData.length && max
              ? targetData.map((item: any, index: number) => {
                  const colorInfo = colorMap.get(index);
                  return (
                    <div className="listItem" key={index}>
                      <span
                        className="record"
                        style={{
                          color: colorInfo?.color ?? defaultColor.color,
                          backgroundColor: colorInfo?.bg ?? defaultColor.bg,
                        }}
                      >
                        {index + 1}
                      </span>
                      <span className="areaName">{item.title}</span>
                      <div className="label">
                        <div className="pointer" style={{ width: `${(item.num.value / max) * 100}%` }}></div>
                      </div>
                      <span className="count">{item.count}</span>
                    </div>
                  );
                })
              : null}
          </div>
        ) : null}
      </AreaGraphContainer>
    );
  }, [data, mapAreaCode, areaNoTopTen]);

  return (
    <GraphCardContainer
      header="地区分布"
      style={{ padding: '0 27px 16px 0', flex: 6, marginRight: '6px' }}
      error={error}
      noData={noData}
    >
      {content}
    </GraphCardContainer>
  );
});

const AreaGraphContainer = styled.div`
  width: 100%;
  display: flex;

  .charts .list {
    height: 100%;
  }

  .charts {
    min-width: 270px;
    flex: 7;
  }

  .list {
    flex: 3;
    min-width: 238px;
    margin: 16px 0 15px 6px;
    .topTitle {
      height: 17px;
      font-size: 14px;
      font-family: DINPro, DINPro-Medium;
      font-weight: 500;
      color: #262626;
      line-height: 17px;
      margin-bottom: 8px;
    }
    .listItem {
      height: 17px;
      display: flex;
      /* justify-content: flex-end; */
      align-items: center;
      overflow-x: hidden;
    }

    .listItem:not(:first-child) {
      margin-top: 6px;
    }

    .record {
      font-size: 11px;
      width: 14px;
      height: 14px;
      background: #fa541c;
      border-radius: 2px;
      text-align: center;
      /* ui觉得14px时向上偏了1px */
      line-height: 15px;
    }

    .areaName {
      width: 48px;
      height: 12px;
      font-size: 12px;
      font-weight: 400;
      text-align: left;
      color: #434343;
      line-height: 12px;
      word-break: keep-all; /* 不换行 */
      white-space: nowrap; /* 不换行 */
      overflow: hidden;
      text-overflow: ellipsis;
      margin-left: 10px;
    }

    .label {
      width: 92px;
      height: 6px;
      border-radius: 4px;
      display: block;
      background-color: #eceef5;
      margin-left: 8px;
      margin-right: 6px;
      text-align: left;
      .pointer {
        height: 6px;
        background-color: #3986fe;
        border-radius: 4px;
      }
    }

    .count {
      width: 44px;
      height: 12px;
      color: #2874f9;
      line-height: 12px;
      font-size: 12px;
      text-align: right;
    }
  }
`;
