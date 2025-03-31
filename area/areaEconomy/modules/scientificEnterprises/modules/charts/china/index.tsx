import { memo, useMemo } from 'react';

import { isEmpty } from 'lodash';
import styled from 'styled-components';

import { Box } from '../../../components';
import { useGetChartsData } from '../../../hooks/useGetChartsData';
import { useCtx } from '../../../provider/ctx';
import { Charts } from '../../../types';
import ChinaMap from './Map';

/** 排名颜色策略 */
const colorMap = new Map<number, Record<'color' | 'bg', string>>([
  [0, { color: '#fff', bg: '#FA541C' }],
  [1, { color: '#fff', bg: '#FA8C16' }],
  [2, { color: '#fff', bg: '#FFC53D' }],
]);

const defaultColor = {
  color: '#8C8C8C',
  bg: '#FAFAFA',
};

export default memo(() => {
  const {
    state: { selectedAreaList, enterpriseStatus },
  } = useCtx();

  const { data, loading } = useGetChartsData({ requestModule: 'AREA' });

  const sortData = (d: Charts.AreaChartItem[]) => {
    return d.sort((a, b) => {
      return b.doc_count - a.doc_count;
    });
  };

  const max = useMemo(() => {
    if (!loading && data && !isEmpty(data)) {
      return Math.max(...data.map((i: Charts.AreaChartItem) => i.doc_count));
    }
  }, [data, loading]);

  const chinaMapProps = useMemo(() => {
    const regionLength = selectedAreaList.length;
    const curRegionCode = selectedAreaList[regionLength - 1].value;
    return {
      regionCode: curRegionCode,
      preRegionCode: regionLength === 1 ? curRegionCode : selectedAreaList[regionLength - 2].value,
      mapInfo: data && !isEmpty(data) ? sortData(data) : [],
    };
  }, [data, selectedAreaList]);

  const content = useMemo(() => {
    return (
      <IndustryChartsWapper enterpriseStatus={enterpriseStatus}>
        {/* <div className="charts"></div> */}
        <ChinaMap {...chinaMapProps} />
        {!isEmpty(selectedAreaList) && selectedAreaList[selectedAreaList.length - 1]?.key !== 3 ? (
          <div className="list">
            {data && !isEmpty(data) && max
              ? sortData(data).map((item, index) => {
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
                        <div className="pointer" style={{ width: `${(item.doc_count / max) * 100}%` }}></div>
                      </div>
                      <span className="count">{item?.doc_count?.toLocaleString()}</span>
                    </div>
                  );
                })
              : null}
          </div>
        ) : null}
      </IndustryChartsWapper>
    );
  }, [chinaMapProps, data, max, selectedAreaList, enterpriseStatus]);
  return (
    <Box
      cardTitle="地区分布"
      label={enterpriseStatus === 1 ? selectedAreaList?.[selectedAreaList.length - 1]?.shortName : ''}
      content={content}
    ></Box>
  );
});

const IndustryChartsWapper = styled.div<{ enterpriseStatus: number }>`
  width: 100%;
  height: 100%;
  display: flex;
  padding-left: 20px;

  .charts .list {
    height: 100%;
  }

  .charts {
    min-width: 262px;
    /* flex:none */
    flex: 1;
  }

  .list {
    flex: 1;
    min-width: 238px;
    max-width: 297px;
    margin-left: 6px;
    margin-bottom: 20px;
    margin-top: 20px;
    overflow: overlay;
    &:hover {
      ::-webkit-scrollbar,
      ::-webkit-scrollbar-thumb {
        width: 10px;
        visibility: visible;
      }
    }
    ::-webkit-scrollbar,
    ::-webkit-scrollbar-thumb {
      visibility: hidden;
    }
    .listItem {
      height: 17px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      overflow-x: hidden;
    }

    .listItem:not(:first-child) {
      margin-top: 6px;
    }

    .record {
      width: 14px;
      height: 14px;
      background: #fa541c;
      border-radius: 2px;
      text-align: center;
      line-height: 14px;
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
      width: 54px;
      height: 12px;
      color: #2874f9;
      line-height: 12px;
      font-size: 12px;
      text-align: left;
    }
  }
`;
