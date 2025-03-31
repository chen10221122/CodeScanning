import { memo, useMemo, useContext, useRef } from 'react';

import { RangeInput } from '@dzh/components';
import Screen, { ScreenType, Options, RowItem } from '@dzh/screen';
import { isEmpty } from 'lodash';

import { handleInterfaceDataToSearchData } from '../../../utils';
import MainContext from '../context';

export enum FliterType {
  REGION = 'areaCode',
  INDUSTRY = 'industryCode',
  AREA = 'areaRange',
}

const Filter = () => {
  const screenRef = useRef(null);
  const { filterFirstLoading, option, handleMenuChange } = useContext(MainContext);

  const screenOptions: Options[] = useMemo(() => {
    if (filterFirstLoading) return [];

    const arr = [];

    const areaCode = {
      title: '下属辖区',
      option: {
        type: ScreenType.MULTIPLE,
        formatTitle: (rows: RowItem[]) => {
          if (rows.length) {
            return rows.map((item) => item.name).join(',');
          }
        },
        children: handleInterfaceDataToSearchData(option.lowerAgg, FliterType.REGION),
      },
    };

    const industryCode = {
      title: '特色产业',
      option: {
        type: ScreenType.MULTIPLE,
        formatTitle: (rows: RowItem[]) => {
          if (rows.length) {
            return rows.map((item) => item.name).join(',');
          }
        },
        children: handleInterfaceDataToSearchData(option.industryAgg, FliterType.INDUSTRY),
      },
    };

    const areaRange = {
      title: '园区面积',
      option: {
        type: ScreenType.MULTIPLE,
        formatTitle: (rows: RowItem[]) => {
          if (rows.length) {
            return rows
              .map((item) => {
                if (item.name === '范围输入') {
                  const { value } = item;
                  if (!value[0]) {
                    return `${value[1]}亩以下`;
                  } else if (!value[1]) {
                    return `${value[0]}亩以上`;
                  } else {
                    return `${value[0]}-${value[1]}亩`;
                  }
                }
                return item.name;
              })
              .join(',');
          }
        },
        children: [
          ...handleInterfaceDataToSearchData(option.areaAgg, FliterType.AREA),
          {
            name: '范围输入',
            value: null,
            key: FliterType.AREA,
            render: () => <RangeInput unit="亩" />,
          },
        ],
      },
    };

    if (!isEmpty(option.lowerAgg)) arr.push(areaCode);
    arr.push(industryCode);
    arr.push(areaRange);

    return arr;
  }, [filterFirstLoading, option.lowerAgg, option.industryAgg, option.areaAgg]);

  return (
    <div className="screen-wrap" ref={screenRef}>
      <Screen
        getPopContainer={() => screenRef.current || document.body}
        options={screenOptions}
        onChange={handleMenuChange}
      />
    </div>
  );
};

export default memo(Filter);
