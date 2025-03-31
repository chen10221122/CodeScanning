import { useMemo, useState, useEffect } from 'react';

import { useMemoizedFn, useMount } from 'ahooks';
import styled from 'styled-components';

import {
  useCtx,
  AreaItem,
  DEFAULT_CHECK_ROW_AREA,
  WHOLE_COUNTRY_OPTION,
  WHOLE_COUNTRY_CODE,
  AreaType,
} from '@pages/area/landTopic/modules/overview/provider';

import { Screen, ScreenType, Options, quickAreaOptions } from '@/components/screen';
import { getAreaLevel } from '@/pages/bond/cityInvestSpread/utils';

const { formatSelectAllTitle, hasAreaSelectAll, onSearch } = quickAreaOptions;

const areaTypeOptions: Options[] = [
  {
    title: '地区类型',
    option: {
      type: ScreenType.SINGLE,
      cancelable: false,
      children: [
        {
          name: '全国',
          key: 'areaType',
          value: AreaType.WHOLE,
          active: true,
        },
        {
          name: '省级',
          key: 'areaType',
          value: AreaType.PROVINCE,
        },
        { name: '市级', key: 'areaType', value: AreaType.CITY },
        { name: '区县级', key: 'areaType', value: AreaType.COUNTY },
        { name: '自定义', key: 'areaType', value: AreaType.CUSTOM },
      ],
    },
  },
];

export default function Area({ setIsAllNation }: { setIsAllNation: (v: boolean) => void }) {
  const {
    state: {
      areaLists: { areaProvince, areaCity, areaCounty, provinceCodes, cityCodes, countyCodes },
      areaFilter,
      areaType,
      resetArea,
    },
    update,
  } = useCtx();

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [areaChange, setAreaChange] = useState(false);
  const [tempAreaType, setTempAreaType] = useState('');

  const areaOptions: Options[] = useMemo(() => {
    const curAreaType = tempAreaType || areaType;
    const lists = [AreaType.WHOLE, AreaType.PROVINCE].includes(curAreaType as AreaType)
      ? areaProvince
      : curAreaType === AreaType.CITY
      ? areaCity
      : curAreaType === AreaType.COUNTY
      ? areaCounty
      : areaCounty.filter(({ name }) => name !== '百强县');
    const option: Options = {
      title: '地区',
      option: {
        type: ScreenType.MULTIPLE_THIRD,
        children: [WHOLE_COUNTRY_OPTION, ...lists],
        limit: 1000,
        /* @ts-ignore */
        cascade: curAreaType !== AreaType.CUSTOM,
        hasSelectAll: curAreaType !== AreaType.COUNTY,
      },
    };
    if (curAreaType === AreaType.CUSTOM) {
      //@ts-ignore
      option.option = {
        ...option.option,
        type: ScreenType.MULTIPLE_THIRD_AREA,
        hasSelectAll: undefined,
        hasAreaSelectAll,
        formatSelectAllTitle,
        isIncludingSameLevel: false,
        onSearch,
      };
    }
    return [option];
  }, [areaCity, areaCounty, areaProvince, areaType, tempAreaType]);

  const handleAreaFilter = useMemoizedFn((provinceCode = '', cityCode = '', countyCode = '') => {
    update((draft) => {
      draft.areaFilter = {
        // areaCode: [provinceCode, cityCode, countyCode].filter((item) => item).join(','),
        provinceCode,
        cityCode,
        countyCode,
      };
    });
  });

  const setDefaultArea = useMemoizedFn((curAreaType) => {
    if (curAreaType !== AreaType.CUSTOM) {
      handleAreaFilter(
        [AreaType.WHOLE, AreaType.PROVINCE].includes(curAreaType) ? provinceCodes : WHOLE_COUNTRY_CODE,
        [/* AreaType.WHOLE, */ AreaType.CITY].includes(curAreaType) ? cityCodes : '',
        [/* AreaType.WHOLE, */ AreaType.COUNTY].includes(curAreaType) ? countyCodes : '',
      );
    }
    if (curAreaType === AreaType.WHOLE) {
      update((draft) => {
        draft.checkRowArea = { ...DEFAULT_CHECK_ROW_AREA };
      });
    }
  });

  const onAreaTypeChange = useMemoizedFn((select) => {
    const curType = select[0].value;
    if (curType !== areaType) {
      setAreaChange(false);
      if (curType === AreaType.CUSTOM) {
        setDropdownVisible(true);
        setTempAreaType(curType);
      } else {
        setDefaultArea(curType);
        setIsAllNation(curType === AreaType.WHOLE);
        update((draft) => {
          draft.areaType = curType;
        });
      }
    }
  });

  useMount(() => {
    if (Object.values(areaFilter).length === 0) {
      setDefaultArea(areaType);
    }
  });

  useEffect(() => {
    resetArea && setAreaChange(false);
  }, [resetArea]);

  const onAreaChange = useMemoizedFn((select) => {
    if (tempAreaType) {
      update((draft) => {
        draft.areaType = tempAreaType as AreaType;
      });
      setTempAreaType('');
      setIsAllNation(false);
    }
    if (select.length) {
      const provinceCodes: string[] = [];
      const cityCodes: string[] = [];
      const countyCodes: string[] = [];
      const collectCodes = (lists: AreaItem[], collectChildren = false) => {
        lists.forEach(({ value, name, under, children }) => {
          const level = getAreaLevel(`${value}`);
          if (level === '1' && name !== '百强县') provinceCodes.push(value);
          if (level === '2') cityCodes.push(value);
          if (level === '3') countyCodes.push(value);
          if (collectChildren && (under || children)) {
            collectCodes(under || children || [], collectChildren);
          }
        });
      };
      /* 全国不要收集子级code */
      collectCodes(select /*  areaType === AreaType.WHOLE && tempAreaType === '' */);

      // 因为百强县的存在，countyCodes 可能会重复，所以去个重
      handleAreaFilter(provinceCodes.join(','), cityCodes.join(','), Array.from(new Set(countyCodes)).join(','));
      setAreaChange(true);
    } else {
      setDefaultArea(areaType);
      setAreaChange(false);
    }
  });

  const areaTypeValues = useMemo(() => [[tempAreaType || areaType]], [tempAreaType, areaType]);

  const areaValues = useMemo(
    () => [
      areaChange
        ? [areaFilter.provinceCode, areaFilter.cityCode, areaFilter.countyCode]
            .filter((item) => item)
            .join(',')
            ?.split(',')
        : [''],
    ],
    [areaChange, areaFilter],
  );
  const dropdownVisibleV = useMemo(() => [dropdownVisible], [dropdownVisible]);
  const onDropdownVisibleChange = useMemoizedFn((v) => {
    setDropdownVisible(v);
    tempAreaType && setTimeout(() => setTempAreaType(''), 100);
  });

  return (
    <Container>
      {provinceCodes.length ? (
        <div className={'item-wrapper'}>
          <Screen values={areaTypeValues} options={areaTypeOptions} onChange={onAreaTypeChange} />
        </div>
      ) : null}
      <div className={'item-wrapper'}>
        <Screen
          dropdownVisible={dropdownVisibleV}
          onDropdownVisibleChange={onDropdownVisibleChange}
          values={areaValues}
          options={areaOptions}
          onChange={onAreaChange}
        />
      </div>
    </Container>
  );
}

const Container = styled.div`
  display: inline-flex;
  > div:first-child {
    margin-right: 12px;
  }
  .item-wrapper {
    height: 24px;
    border: 1px solid #c4dcf5;
    border-radius: 2px;
    padding: 4px 8px;

    .screen-wrapper > div {
      font-size: 12px;
    }
  }
`;
