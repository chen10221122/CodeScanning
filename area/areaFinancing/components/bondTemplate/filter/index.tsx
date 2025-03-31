import { useRef } from 'react';

import { useMemoizedFn } from 'ahooks';

import { FilterEnum } from '@pages/area/areaFinancing/components/bondTemplate/useBondScreen';

import { Screen } from '@/components/screen';

import AreaForm from '../areaForm';
import S from './style.module.less';

export default function Filter({ screenConfig, handleMenuChange }: any) {
  const containerRef = useRef(null);
  const handleScreenChange = useMemoizedFn((filterType, allData) => {
    handleMenuChange(filterType, allData);
  });
  return (
    <div className={S.filterWrapper} ref={containerRef}>
      {screenConfig.map((o: any, i: number) => {
        if (o.filterType === FilterEnum.AreaGroup) {
          return <AreaForm key={i} areaConfig={o.config} onChange={handleMenuChange} />;
        }
        return (
          <Screen
            getPopContainer={() => containerRef.current || document.body}
            key={i}
            options={[o]}
            onChange={(option, allData) => {
              handleScreenChange(o.filterType, allData);
            }}
          />
        );
      })}
    </div>
  );
}
