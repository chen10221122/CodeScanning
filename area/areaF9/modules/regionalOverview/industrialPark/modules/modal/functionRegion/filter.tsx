import { memo, useMemo, useContext, useRef } from 'react';

import { RangeInput } from '@dzh/components';
import Screen, { ScreenType, Options, RowItem, quickAreaOptions } from '@dzh/screen';

import { handleInterfaceDataToSearchData } from '../../../utils';
import MainContext from '../context';

export enum FliterType {
  TYPE = 'enterpriseNature',
  INDUSTRY = 'industry',
  CAPITAL = 'regCapital',
  STATUS = 'regStatus',
  TEL = 'havePhone',
}

const Filter = () => {
  const screenRef = useRef(null);
  const { option, handleMenuChange } = useContext(MainContext);

  const screenOptions: Options[] = useMemo(() => {
    return [
      {
        title: '企业类型',
        option: {
          type: ScreenType.MULTIPLE,
          formatTitle: (rows: RowItem[]) => {
            if (rows.length) {
              return rows.map((item) => item.name).join(',');
            }
          },
          children: handleInterfaceDataToSearchData(option.enterpriseNature, FliterType.TYPE),
        },
      },
      {
        title: '行业',
        formatTitle(rows: RowItem[]) {
          const rowsLen = rows.length;
          let cascadeData: any[] = [];
          let allValues: string[] = [];

          const { getRootSelected } = quickAreaOptions;

          cascadeData = getRootSelected(
            option.industryCodeAgg,
            rows.map((d: any) => d.value),
          ).filter((item) => {
            if (allValues.indexOf(item.value) > -1) {
              return false;
            }

            allValues.push(item.value);
            return true;
          });

          let newTitle = rowsLen ? cascadeData.map((item) => item.name).join(',') : '行业';

          return newTitle;
        },
        option: {
          type: ScreenType.MULTIPLE_THIRD,
          hasSelectAll: false,
          hideSearch: false,
          cascade: true,
          ellipsis: 9,
          children: handleInterfaceDataToSearchData(option.industryCodeAgg, FliterType.INDUSTRY),
        },
      },
      {
        title: '注册资本',
        option: {
          type: ScreenType.MULTIPLE,
          formatTitle: (rows: RowItem[]) => {
            if (rows.length) {
              return rows
                .map((item) => {
                  if (item.name === '范围输入') {
                    const { value } = item;
                    if (!value[0]) {
                      return `${value[1]}万以下`;
                    } else if (!value[1]) {
                      return `${value[0]}万以上`;
                    } else {
                      return `${value[0]}-${value[1]}万`;
                    }
                  }
                  return item.name;
                })
                .join(',');
            }
          },
          children: [
            ...handleInterfaceDataToSearchData(option.capitalMapAgg, FliterType.CAPITAL),
            {
              name: '范围输入',
              value: null,
              key: FliterType.CAPITAL,
              render: () => <RangeInput unit="万" />,
            },
          ],
        },
      },
      {
        title: '更多筛选',
        overlayClassName: 'screen-more-config',
        option: {
          type: ScreenType.MULTIPLE_TILING,
          children: [
            {
              title: '企业状态',
              hasSelectAll: true,
              multiple: true,
              data: handleInterfaceDataToSearchData(option.enterpriseStatus, FliterType.STATUS),
            },
            {
              title: '联系电话',
              hasSelectAll: false,
              multiple: false,
              data: handleInterfaceDataToSearchData(option.havePhone, FliterType.TEL),
            },
          ],
        },
      },
    ];
  }, [
    option.enterpriseNature,
    option.havePhone,
    option.industryCodeAgg,
    option.capitalMapAgg,
    option.enterpriseStatus,
  ]);

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
