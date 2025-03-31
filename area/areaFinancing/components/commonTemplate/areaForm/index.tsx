import { useEffect, useMemo, useRef, useState } from 'react';

import { useMemoizedFn } from 'ahooks';
import { cloneDeep } from 'lodash';

import { useConditionCtx } from '@pages/area/areaFinancing/components/commonLayout/context';
import { areaLevelOption } from '@pages/area/areaFinancing/hooks/useCommonScreen';
import { handleData } from '@pages/area/areaFinancing/utils';

import { Screen } from '@/components/screen';
import ScreenForm, { Group, Item } from '@/components/screenForm';
import { isCounty } from '@/pages/area/areaEconomy/common';

import S from './style.module.less';

function AreaForm({ onChange, areaData }: any) {
  const {
    state: { tabFilterCache },
    update,
  } = useConditionCtx();
  // 是否用户主动切换地区类型
  const isActivelyAreaChange = useRef(false);
  // const isFirstRef = useRef(true);
  const [key, setKey] = useState('0');
  const [areaOption, setAreaOption] = useState(cloneDeep(areaData));

  const area = useMemo(() => {
    const area = handleData(areaData.option.children, { pathValue: [], pathNumber: [], pathName: [] }) ?? [];
    // 省级
    const areaProvince = area?.filter((i) => i?.name !== '百强县')?.map((i: any) => ({ ...i, children: null })) ?? [];
    // 市级
    const areaCity =
      area
        ?.filter((i) => !'110000,120000,310000,500000,999999'.includes(i?.value) && i.name !== '百强县')
        .map((i: any) => {
          return {
            ...i,
            // 地区口径选择“市级”，地区筛选项不展示区县
            children: i?.children?.filter((i: any) => !isCounty(i?.value))?.map((i: any) => ({ ...i, children: null })),
          };
        }) ?? [];
    /** 区县级 */
    const areaCounty = area ?? [];
    // 百强县
    const specialArea = area?.filter((i) => i.name === '百强县')[0]?.value ?? '';
    return {
      areaProvince,
      areaCity,
      areaCounty,
      specialArea,
    };
  }, [areaData.option.children]);
  // 初始化地区类型默认选中
  useEffect(() => {
    if (areaData) {
      setAreaOption((base: any) => {
        base.option.children = area.areaProvince;
        return base;
      });
      setKey('1');
    }
  }, [area.areaProvince, areaData]);
  // 地区选中事件
  const handleMenuChange = useMemoizedFn((o, allData) => {
    // 选中地区，缓存
    update((d) => {
      d.tabFilterCache.areaValues = allData.map((o: Record<string, any>) => o.value).join(',');
    });
    onChange?.(o, allData);
  });
  // 地区类型主动切换时
  const handleTypeChange = useMemoizedFn((o: any, allData) => {
    // 选中区县级
    const isCounty = o[0].value === '3';
    const mapValueData: Record<string, any> = {
      '1': area.areaProvince,
      '2': area.areaCity,
      '3': area.areaCounty,
    };
    setAreaOption((base: any) => {
      base.option.children = mapValueData[o[0].value];
      // 区县级默认选中百强县
      base.option.hasSelectAll = !isCounty;
      base.option.children[0].active = isCounty;
      return base;
    });
    // console.log('地区类型主动切换时');
    // 将公用地区数据保存至
    update((d) => {
      d.tabFilterCache.regionLevel = o[0].value;
      d.tabFilterCache.areaValues = '';
      // d.tabFilterCache.countryCode = '';
    });
    setKey(o[0].value);
    /*  if (isFirstRef.current) {
      isFirstRef.current = false;
      return;
    }*/
    isActivelyAreaChange.current = true;
    onChange?.(o, isCounty ? [...allData, mapValueData['3'][0]] : allData);
  });

  useEffect(() => {
    // 地区类型变化，需要切换地区数据
    if (tabFilterCache.regionLevel) {
      // console.log('地区类型变化，需要切换地区数据isActivelyAreaChange.current', isActivelyAreaChange.current);
      const mapValueData: Record<string, any> = {
        '1': area.areaProvince,
        '2': area.areaCity,
        '3': area.areaCounty,
      };
      setAreaOption((base: any) => {
        // 区县级默认选中百强县
        base.option.hasSelectAll = tabFilterCache.regionLevel !== '3';
        base.option.children = mapValueData[tabFilterCache.regionLevel!];
        return base;
      });
      if (tabFilterCache.regionLevel === '3' && isActivelyAreaChange.current) {
        update((d) => {
          // 选中区县级，需要默认选中百强县
          d.tabFilterCache.areaValues = mapValueData['3']?.[0]?.value;
        });
      }
      isActivelyAreaChange.current = false;
    }
  }, [area.areaCity, area.areaCounty, area.areaProvince, tabFilterCache.regionLevel, update]);
  // 同步公用缓存区的地区筛选数据
  const syncArea = useMemo(() => {
    return {
      areaLevelValues: [tabFilterCache.regionLevel ? [tabFilterCache.regionLevel] : ['1']],
      areaValues: [tabFilterCache.areaValues ? tabFilterCache.areaValues.split(',') : []],
    };
  }, [tabFilterCache]);

  return (
    <div className={S.formWrapper}>
      <ScreenForm style={{ paddingLeft: 0, paddingRight: 24 }}>
        <Group watchSizeChange={true} style={{ overflow: 'visible' }}>
          <Item label={'地区口径'} name={'地区'} className={S.formItem}>
            <Screen options={[areaLevelOption as any]} onChange={handleTypeChange} values={syncArea.areaLevelValues} />
          </Item>
          <Item key={key}>
            <Screen options={[areaOption] as any} onChange={handleMenuChange} values={syncArea.areaValues} />
          </Item>
        </Group>
      </ScreenForm>
    </div>
  );
}
export default AreaForm;
