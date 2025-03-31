import { useCallback, useRef, FC, useEffect } from 'react';

import { useSize, useThrottleEffect } from 'ahooks';
import * as echarts from 'echarts';
import styled from 'styled-components';

import nanshaIslandsImg from '@/assets/images/bond/nanshaIslands.png';
import chinaMapJson from '@/assets/map/json/china.json';
import { useTab } from '@/libs/route';
import { formatThreeNumber } from '@/pages/bond/bondIssuance/utils';
import { jinmenxianMapJson } from '@/pages/bond/cityInvestMap/modules/mapAndIndic/leftMap/chinaMap/jinMenXian';
import MapChart from '@/pages/bond/cityInvestMap/modules/mapAndIndic/leftMap/chinaMap/mapChart';

type Props = {
  regionCode: string; // 默认地区
  preRegionCode: string; // 父级地区
  mapInfo: any[]; //地图数据
};

const Map: FC<Props> = ({ regionCode, preRegionCode, mapInfo }) => {
  const chart = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<any>();
  const { width } = useSize(chart) || {}; //监听容器宽度resize

  //监听tab切换和宽度变化resize
  useTab({
    onActive() {
      if (chartInstanceRef) {
        chartInstanceRef?.current?.echarts?.resize();
      }
    },
  });
  useEffect(() => {
    if (chartInstanceRef) {
      chartInstanceRef?.current?.echarts?.resize();
    }
  }, [width]);

  const getOption = useCallback(
    ({ mapName, mapData, cityCode }: { mapName: string; mapData: any; cityCode: string }) => {
      let formatData: { name: string; value: number | '' }[] = mapInfo?.map((item) => ({
        name: cityCode === '100000' ? item.title : item.fullTitle,
        value: item.doc_count,
        proportion: item?.proportion,
      }));
      const dataLength = mapInfo.length;
      /* 获取最大最小值 */
      let min = dataLength ? mapInfo[dataLength - 1].doc_count : 0;
      let max = dataLength ? mapInfo[0].doc_count : 0;

      if (min === max) {
        max++;
        min--;
      }

      let series: any[] = [
        {
          name: '展示指标',
          type: 'map',
          geoIndex: '0',
          coordinateSystem: 'geo',
          data: formatData,
        },
      ];
      let option = {
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          textStyle: {
            color: '#3c3c3c',
            fontSize: 13,
            lineHeight: '18px',
          },
          extraCssText:
            'border-radius: 2px;padding: 10px 12px;box-sizing: border-box; box-shadow: 1px 1px 5px 0px rgba(0,0,0,0.20); z-index: 4 !important;',
          formatter: (params: any) => {
            const curData = params?.data;
            const name = `<span>${params?.name ?? '-'}</span>`;
            const content = `
            <span>占比：${curData?.proportion ? `${curData.proportion}` : '-'}</span>
            <span style='display: block;'>企业量：${
              curData?.value && !isNaN(+curData?.value)
                ? formatThreeNumber(curData?.value)?.replace('-', '') + '家'
                : '-'
            }
            </span>`;
            return `<div style="align-items: center; font-size: 12px;"><div>${name}</div><div style="flex: 1"></div><div>${content}</div></div>`;
          },
        },
        series: [
          {
            name: '',
            type: 'map',
            mapType: 'china',
            showLegendSymbol: false,
            data: formatData,
            selectedMode: false,
            label: {
              normal: {
                show: false,
              },
            },
          },
        ],
      } as any;
      option.visualMap = [
        {
          type: 'continuous',
          // precision: 2,
          inRange: {
            color: ['#daf2ff', '#94ddfd', '#38c0f5', '#0a7dcd'],
          },
          text: ['高', '低'],
          itemWidth: 11,
          itemHeight: 46,
          bottom: 20,
          left: 0,
          min: isNaN(min) ? 0 : min,
          max: isNaN(max) ? 0 : max,
        },
      ];
      //非全国时，用geo配置
      if (cityCode !== '100000') {
        option.geo = {
          map: mapName,
          label: {
            show: false,
          },
          // roam: cityCode === '460000',
          regions: mapData,
          top: 0,
          bottom: 12,
          id: 'cityInvestMap',
          // 不让部分宽高比例特殊的地图超出画布
          layoutCenter: ['50%', '50%'],
          layoutSize: '90%',
        };
        option.series = series;
      }
      return option;
    },
    [mapInfo],
  );

  useThrottleEffect(() => {
    /* 销毁原先的实例 */
    if (chartInstanceRef.current) {
      chartInstanceRef.current?.echarts?.dispose();
    }
    const mapChart = (chartInstanceRef.current = new MapChart()
      .init({
        defaultAreaCode: regionCode,
        // key: chinaMapKey,
        preCode: preRegionCode,
      })
      .mount(chart.current!, false)
      .on('update', ({ mapName, mapData, registerMapJson, cityCode }) => {
        const name = cityCode === '100000' ? 'china' : mapName;
        /* 全国（100000）时，用echarts的json数据，因为高德地图没找到南海诸岛靠右显示的办法
        金门县（350527）时也用单独的json数据 */
        let mapJson =
          cityCode === '100000' ? chinaMapJson : cityCode === '350527' ? jinmenxianMapJson : registerMapJson;
        //海南省时要把三沙市去掉
        if (cityCode === '460000') {
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
        echarts.registerMap(name, mapJson);
        const option = getOption({ mapData, mapName: name, cityCode });
        mapChart.setOption(option);
      }));
    // .off('click', () => void(0))
  }, [regionCode, preRegionCode, getOption]);

  return (
    <MapWrapper className="wrapper" width={width}>
      <div ref={chart} style={{ width: '100%', height: 218 }} />
      {/* 海南省时放一个南沙群岛的图 */}
      {regionCode === '460000' ? <div className="nansha-islands"></div> : null}
    </MapWrapper>
  );
};

export default Map;

const MapWrapper = styled.div<{ width: number | undefined }>`
  min-width: 262px;
  flex: 1;
  position: relative;
  .nansha-islands {
    height: 57px;
    width: 39px;
    position: absolute;
    right: 2%;
    top: 60%;
    background-image: url('${nanshaIslandsImg}');
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
`;
