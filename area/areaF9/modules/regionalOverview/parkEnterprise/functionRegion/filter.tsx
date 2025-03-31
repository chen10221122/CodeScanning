import { memo, useMemo, useContext, useRef } from 'react';

import { RangeInput } from '@dzh/components';
import Screen, { ScreenType, Options, RowItem, quickAreaOptions } from '@dzh/screen';
import styled from 'styled-components';

import { Icon } from '@/components';
import { handleInterfaceDataToSearchData } from '@/pages/area/areaF9/modules/regionalOverview/industrialPark/utils';
import { ScreenWrapper } from '@/pages/finance/stockIssuance/style';

import ParkEnterpriseContext from '../context';

export enum FliterType {
  SPECIALTY = 'parkIndustryCode',
  AREA = 'areaRange',
  TYPE = 'enterpriseNature',
  INDUSTRY = 'industry',
  CAPITAL = 'regCapital',
  STATUS = 'regStatus',
  TEL = 'havePhone',
}

const { WithExpand } = Screen;

const Filter = () => {
  const screenRef = useRef(null);
  const { option, handleMenuChange } = useContext(ParkEnterpriseContext);

  const screenOptions: Options[] = useMemo(() => {
    return [
      {
        title: '园区类型',
        overlayClassName: 'screen-more-config',
        option: {
          type: ScreenType.MULTIPLE_TILING,
          children: [
            {
              title: '特色产业',
              hasSelectAll: true,
              multiple: true,
              data: handleInterfaceDataToSearchData(option.industryAgg, FliterType.SPECIALTY),
            },
            {
              title: '园区面积',
              hasSelectAll: true,
              multiple: true,
              data: [
                ...handleInterfaceDataToSearchData(option.areaRange, FliterType.AREA),
                {
                  name: '范围输入',
                  value: null,
                  default: [
                    { value: '', unit: '亩' },
                    { value: '', unit: '亩' },
                  ],
                  key: FliterType.AREA,
                  render: () => {
                    return (
                      <WithExpand<[start: any, end: any]>
                        formatTitle={(value) => {
                          if (value[0] && value[1]) {
                            const value1 = parseFloat(value[0]);
                            const value2 = parseFloat(value[1]);
                            const max = Math.max(value1, value2);
                            const min = Math.min(value1, value2);
                            return (
                              <div>
                                {min}亩 - {max}亩
                              </div>
                            );
                          } else if (value[0] || value[1]) {
                            const temp = value[0] || value[1];
                            return <div>{temp}亩</div>;
                          } else {
                            return '自定义';
                          }
                        }}
                        foldNode={
                          <>
                            <Icon
                              image={require('@/pages/finance/stockIssuance/img/filter_icon.svg')}
                              width={13}
                              height={13}
                              style={{ color: '#888', lineHeight: '13px' }}
                            />
                            <CustomButton>自定义</CustomButton>
                          </>
                        }
                      >
                        <RangeInput unit="亩" />
                      </WithExpand>
                    );
                  },
                },
              ],
            },
          ],
        },
      },
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
    option.areaRange,
    option.enterpriseNature,
    option.havePhone,
    option.industryAgg,
    option.industryCodeAgg,
    option.capitalMapAgg,
    option.enterpriseStatus,
  ]);

  return (
    <ScreenWrapper>
      <div className="screen-wrap" ref={screenRef}>
        <Screen
          getPopContainer={() => screenRef.current || document.body}
          options={screenOptions}
          onChange={handleMenuChange}
        />
      </div>
    </ScreenWrapper>
  );
};

export default memo(Filter);

const CustomButton = styled.span`
  margin-left: 5px;
  margin-top: 3px;
  color: currentColor;
`;
