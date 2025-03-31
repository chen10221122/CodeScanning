import { useContext, useEffect, useState, useRef } from 'react';

import { Modal, Spin } from '@dzh/components';
import { useMemoizedFn } from 'ahooks';
import { isEqual } from 'lodash';
import styled from 'styled-components';

import IndustrialParkContext from '../../context';
import MapContainer from './MapContainer';
import Nearby from './nearby';
import useList from './useList';

import type { ForwardObject } from './MapContainer';

const Map = () => {
  const { isOpenMap, mapParams, setMapFalse } = useContext(IndustrialParkContext);
  const { devZoneName, devZoneSquare, devZoneArea } = mapParams;
  const [selected, setSelected] = useState();

  const { tableData, loading, error } = useList();

  const mapContainer = useRef<ForwardObject>(null);

  const handleClick = useMemoizedFn((o) => {
    setSelected(o);
    if (isEqual(o, selected)) {
      mapContainer.current?.handleMove();
    }
  });

  useEffect(() => {
    if (!isOpenMap) {
      setSelected(undefined);
    }
  }, [isOpenMap]);

  return (
    <Modal.FullScreen
      title={
        <span>
          {devZoneName}
          {devZoneArea ? <Subtitle style={{ marginLeft: 4 }}>位于{devZoneArea}</Subtitle> : null}
          {devZoneSquare ? (
            <Subtitle style={{ marginLeft: devZoneArea ? 0 : 4 }}>
              {devZoneArea ? '，' : null}面积约{devZoneSquare}亩
            </Subtitle>
          ) : null}
        </span>
      }
      visible={isOpenMap}
      onCancel={setMapFalse}
      destroyOnClose={true}
      getContainer={false}
    >
      {loading ? (
        <Spin type="thunder" direction="vertical" tip="加载中">
          <div style={{ height: 610 }}></div>
        </Spin>
      ) : (
        <>
          <MapContainer selected={selected} ref={mapContainer} />
          <Nearby {...{ tableData, error, handleClick, selected }} />
        </>
      )}
    </Modal.FullScreen>
  );
};

export default Map;

const Subtitle = styled.span`
  font-size: 13px;
  font-weight: 400;
  color: #3c3c3c;
`;
