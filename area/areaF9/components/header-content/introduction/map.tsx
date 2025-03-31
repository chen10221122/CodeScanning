import { useRef } from 'react';

import { useThrottleEffect, useMemoizedFn } from 'ahooks';
import * as echarts from 'echarts';
import styled from 'styled-components';

import nanshaIslandsImg from '@/assets/images/bond/nanshaIslands.png';
import { jinmenxianMapJson } from '@/pages/bond/cityInvestMap/modules/mapAndIndic/leftMap/chinaMap/jinMenXian';
import MapChart from '@/pages/bond/cityInvestMap/modules/mapAndIndic/leftMap/chinaMap/mapChart';
import { formatNumber } from '@/utils/format';
import { getPrefixCls, getStyledPrefixCls } from '@/utils/getPrefixCls';

import { GraphItem } from './index';
import { Title } from './style';

interface Iprops {
  regionCode: string;
  indicGraph?: GraphItem[];
  indicYear?: string;
  regionName?: string;
  indicValue?: string;
  mapWrapperStyle?: any;
  chartsWrapperStyle?: any;
  mapConf?: any;
  isTitle?: boolean;
  visualMapBottom?: number;
}

const prefix = getPrefixCls('areaf9-header-map');
const css = getStyledPrefixCls('areaf9-header-map');

const chartDefaultStyle = { width: '100%', height: 360, marginTop: '22px' };
export default ({
  regionCode,
  indicGraph,
  indicYear,
  regionName,
  indicValue,
  chartsWrapperStyle = {},
  visualMapBottom = 60,
  isTitle = true,
  mapWrapperStyle = {},
}: Iprops) => {
  const chart = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<any>();

  const getOption = useMemoizedFn(
    ({ mapName, mapData, indicYear }: { mapName: string; mapData: any; indicYear: string }) => {
      const vals = indicGraph?.map((indic: GraphItem) => Number(parseFloat(indic?.indicValue).toFixed(2))) || [];
      let min = vals.length ? Math.min.apply(null, vals) : 0;
      let max = vals.length ? Math.max.apply(null, vals) : 0;

      if (min === max) {
        max++;
        min--;
      }

      let option = {
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderColor: 'transparent',
          textStyle: {
            color: '#3c3c3c',
            fontSize: 13,
            lineHeight: '18px',
          },
          extraCssText:
            'border-radius: 2px;padding: 10px 12px;box-sizing: border-box; box-shadow: 1px 1px 5px 0px rgba(0,0,0,0.20); z-index: 4 !important;',
          formatter: (params: any) => {
            const { name, value, year } = params?.data || {};
            const style = `style='display:inline-block;color: #3c3c3c;font-size: 12px;line-height: 16px;'`;
            const top = `<div ${style}><span>${name || params.name}</span><span style='margin-left:4px'>${
              year || `${indicYear ? indicYear + '年' : ''}`
            }</span></div>`;
            return (
              top +
              `<br/><div style='margin-top:4px;'/><span ${style}>GDP(亿元)：</span><span ${style}>${
                value ? formatNumber(value) : '-'
              }</span>`
            );
          },
          confine: true,
        },
        series: [
          {
            name: mapName,
            type: 'map',
            mapType: mapName,
            showLegendSymbol: false,
            roam: true,
            // 不让部分宽高比例特殊的地图超出画布
            layoutCenter: ['55%', '50%'],
            layoutSize: '70%',
            scaleLimit: {
              min: 0.4,
            },
            selectedMode: false,
            label: {
              show: false,
            },
            data: indicGraph?.map((indic: GraphItem) => ({
              name: indic.regionName,
              value: indic.indicValue?.replace('亿元', ''),
              year: indicYear ? `${indicYear}年` : '',
            })),
          },
        ],
        visualMap: [
          {
            type: 'continuous',
            precision: 2,
            inRange: {
              color: ['#daf2ff', '#94ddfd', '#38c0f5', '#0a7dcd'],
            },
            text: ['高', '低'],
            itemWidth: 13,
            itemHeight: 64,
            bottom: visualMapBottom,
            left: 0,
            min: isNaN(min) ? 0 : min,
            max: isNaN(max) ? 1 : max,
          },
        ],
      } as any;
      return option;
    },
  );

  useThrottleEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current?.echarts?.dispose();
    }
    const mapChart = (chartInstanceRef.current = new MapChart()
      .init({
        defaultAreaCode: regionCode,
        preCode: '',
      })
      .mount(chart.current!, false)
      .on('update', ({ mapName, mapData, registerMapJson, cityCode }) => {
        /** 金门县（350527）时用单独的json数据 */
        let mapJson = cityCode === '350527' ? jinmenxianMapJson : registerMapJson;
        /** 海南省时要把三沙市去掉 */
        if (String(cityCode) === '460000') {
          let hainanMapJson: { type: string; features: any[] } = {
            type: 'FeatureCollection',
            features: [],
          };
          mapJson.features.forEach((item: any) => {
            if (item?.properties?.name !== '三沙市') {
              hainanMapJson.features.push(item);
            }
          });
          mapJson = hainanMapJson;
        }
        echarts.registerMap(mapName, mapJson);
        const option = getOption({ mapData, mapName, indicYear: indicYear || '' });
        mapChart.setOption(option);
      }));
  }, [getOption, regionCode]);

  return (
    <MapWrapper mapWrapperStyle={mapWrapperStyle}>
      {isTitle ? (
        <Title width={2}>
          <div className={prefix('title')}>
            {`${regionName || ''}${indicYear ? indicYear + '年' : ''}`}
            <br />
            <span className={prefix('title-cur-data')}>{`GDP(亿元)：${
              indicValue ? formatNumber(indicValue) : '-'
            }`}</span>
          </div>
        </Title>
      ) : null}
      <div ref={chart} style={{ ...chartDefaultStyle, ...chartsWrapperStyle }} />
      {String(regionCode) === '460000' ? <div className="nansha-islands"></div> : null}
    </MapWrapper>
  );
};

const MapWrapper = styled.div<{ mapWrapperStyle: any }>`
  position: relative;
  width: 391px;
  height: 433px;
  background: #ffffff;
  padding: 12px 20px 23px 16px;
  border: 1px solid #efefef;

  ${({ mapWrapperStyle }) => {
    return mapWrapperStyle;
  }}
  ${css('title')} {
    width: 100%;
    height: auto;
    font-size: 14px;
    font-weight: 400;
    text-align: left;
    color: #141414;
    line-height: 23px;
    white-space: nowrap;
    padding-top: 23px;
  }
  ${css('title-cur-data')} {
    height: 18px;
    font-size: 13px;
    font-weight: 400;
    text-align: left;
    color: #141414;
    line-height: 18px;
    white-space: nowrap;
  }
  .nansha-islands {
    position: absolute;
    right: 24px;
    bottom: 27px;
    width: 48px;
    height: 72px;
    background-image: url('${nanshaIslandsImg}');
    background-repeat: no-repeat;
    background-size: contain;
  }
`;
