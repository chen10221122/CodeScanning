import { useState } from 'react';

import { useMemoizedFn, useUpdateEffect } from 'ahooks';

import { Screen } from '@/components/screen';
import ScreenForm, { Group, Item } from '@/components/screenForm';

import S from './style.module.less';

function AreaForm({ areaConfig, onChange }: any) {
  // 用于切换地区类型时，更新地区组件，重置默认值
  const [key, setKey] = useState(1);
  const handleMenuChange = useMemoizedFn((o, allData) => {
    onChange?.(areaConfig[1].filterType, allData);
  });

  const handleAreaTypeChange = useMemoizedFn((o, allData) => {
    setKey(Math.random());
    onChange?.(areaConfig[0].filterType, allData);
  });
  useUpdateEffect(() => {
    if (areaConfig[1]) {
      setKey(Math.random());
    }
  }, [areaConfig]);

  return (
    <ScreenForm className={S.formWrapper}>
      <Group watchSizeChange={true} style={{ overflow: 'visible' }}>
        <Item label={areaConfig[0].label} name={areaConfig[0].label} className={S.formItem}>
          <Screen options={[areaConfig[0]]} onChange={handleAreaTypeChange} />
        </Item>
        <Item label={''} style={{ marginBottom: 0 }} key={key}>
          <Screen
            options={[{ ...areaConfig[1], overlayClassName: 'area-select-screen' }]}
            onChange={handleMenuChange}
          />
        </Item>
      </Group>
    </ScreenForm>
  );
}
export default AreaForm;
