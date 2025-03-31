import { useEffect, useRef, useContext, useState, forwardRef, useImperativeHandle } from 'react';

import { useMemoizedFn } from 'ahooks';
import { isEqual, last } from 'lodash';

import IndustrialParkContext from '../../context';

import type { TableData } from '../main/type';

//定义ref类型
export interface ForwardObject {
  handleMove: (params?: number[]) => void;
}

interface Props {
  selected: TableData | undefined;
}

/* 处理中心点 */
const handleCoordinate = (str: string | undefined) => {
  if (!str) return null;
  const temp = str.split(',');
  return [Number(temp[0]), Number(temp[1])];
};

/* 处理围栏 */
const handleClosureCoordinates = (str: string | undefined) => {
  if (!str) return null;
  const temp = str.split(';');
  return temp.map((item) => handleCoordinate(item));
};

const MapContainer = forwardRef<ForwardObject, Props>(({ selected }, ref) => {
  const { mapParams, aMap } = useContext(IndustrialParkContext);
  const { devZoneName, centerCoordinates, closureCoordinates } = mapParams;

  const [center, setCenter] = useState<number[]>([]);
  const [name, setName] = useState('');

  const map = useRef<any>();

  useImperativeHandle(ref, () => ({
    handleMove,
  }));

  /* 信息弹窗 */
  const handleInfoWindow = useMemoizedFn((devZoneName, center) => {
    var info = [];
    info.push(`<div style="padding:4px 0px 0px 4px;"><b>${devZoneName}</b>`);
    const infoWindow = new aMap.current.InfoWindow({
      anchor: 'bottom-center',
      offset: new aMap.current.Pixel(0, -34),
      content: info.join('<br/>'), //使用默认信息窗体框样式，显示信息内容
    });
    infoWindow.open(map.current, center);
  });

  /* Marker点击事件 */
  const handleMarkerClick = useMemoizedFn((e) => {
    const { position, title } = e.target._originOpts;
    handleInfoWindow(title, position);
  });

  /* 处理覆盖物 */
  const handleCovering = useMemoizedFn((centerCoordinates, closureCoordinates, devZoneName) => {
    const center = Array.isArray(centerCoordinates) ? centerCoordinates : handleCoordinate(centerCoordinates);
    const polylinePath = handleClosureCoordinates(closureCoordinates);

    if (aMap.current && map.current) {
      const marker = new aMap.current.Marker({
        title: devZoneName,
        position: center,
      });
      marker.on('click', handleMarkerClick);
      if (polylinePath) {
        if (polylinePath.length > 1) {
          const firstPoint = polylinePath[0];
          const lastPoint = last(polylinePath);
          let polyline = null;

          if (!isEqual(firstPoint, lastPoint)) {
            polylinePath.push(firstPoint);
          }

          polyline = new aMap.current.Polygon({
            path: polylinePath,
            strokeColor: '#0171f6',
            fillColor: '#0171f6',
            fillOpacity: 0.12,
          });
          map.current.add([polyline, marker]);
        } else {
          map.current.add([marker]);
        }
      } else {
        map.current.add([marker]);
      }

      map.current.setFitView();

      handleInfoWindow(devZoneName, center);
    }
  });

  /* 平移 */
  const handleMove = useMemoizedFn(() => {
    map.current.panTo(center);
    handleInfoWindow(name, center);
  });

  //初始化
  useEffect(() => {
    if (aMap.current) {
      const center = handleCoordinate(centerCoordinates);
      map.current = new aMap.current.Map('container', {
        resizeEnable: true,
        zoom: 17,
        center,
      });

      handleCovering(center, closureCoordinates, devZoneName);
      return () => {
        map.current.destroy();
      };
    }
  }, [aMap, centerCoordinates, closureCoordinates, devZoneName, handleCovering]);

  useEffect(() => {
    if (selected) {
      const { centerCoordinates, devZoneName, closureCoordinates } = selected;
      const center = handleCoordinate(centerCoordinates);
      if (center) {
        setCenter(center);
        setName(devZoneName);
        handleCovering(center, closureCoordinates, devZoneName);
        map.current.setCenter(center);
      }
    }
  }, [handleCovering, handleMove, selected]);

  return <div id="container" style={{ width: '100%', height: '100%' }}></div>;
});

export default MapContainer;
