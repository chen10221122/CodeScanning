import { memo, useMemo, useState, useRef, useEffect } from 'react';

import { LoadingOutlined } from '@ant-design/icons';
import { Switch } from '@dzh/components';
import { useMemoizedFn, useRequest } from 'ahooks';
import cn from 'classnames';
import dayjs, { Dayjs } from 'dayjs';
import { isEmpty } from 'lodash';
import { nanoid } from 'nanoid';
import styled from 'styled-components';

import { Spin } from '@/components/antd';
import RangePicker from '@/components/antd/rangePicker';
import ExportDoc from '@/components/exportDoc';
import { ScreenType, Options, Screen } from '@/components/screen';
import TopicSearch from '@/components/topicSearch';
import { AREA_F9_BANK_DISTRIBUTE_BY_BANK, AREA_F9_NONE_BANK } from '@/configs/localstorage';
import { formatNumber } from '@/utils/format';
import { CommonResponse } from '@/utils/utility-types';

import { getDistributionByBankFilter, getNoneBankFilter } from '../api';
import { useCtx } from '../context';
import { pageType } from '../type';
import useAddToDataView from './useAddToDataView';

const loadingIcon = <LoadingOutlined style={{ fontSize: 12 }} spin />;

const DEFAULY_DATE: [Dayjs, Dayjs] = [dayjs().subtract(10, 'year'), dayjs()];

type filterProps = {
  moduleId?: string | number;
};

const Filter = ({ moduleId = '' }: filterProps) => {
  const {
    state: {
      page,
      isOpenSource,
      total,
      exportName,
      module_type,
      tableCondition,
      filterRequestParams,
      tableData,
      tableError,
      sheetNames,
    },
    update,
  } = useCtx();
  const [date, setDate] = useState<[Dayjs, Dayjs]>(DEFAULY_DATE);
  const keywordRef = useRef<any>();
  const [option, setOption] = useState<Options[]>([]);
  // 筛选组件选中值
  // const [screenValues, setScreenValues] = useState<any>([undefined, undefined, undefined, undefined]);
  // 筛选参数的key值
  const [screenKeys, setScreenKeys] = useState<string[]>([]);
  // 刷新screen
  const [reFresh, setRefresh] = useState(nanoid());

  const { handleAddToEnterpriseDataView, loading } = useAddToDataView(
    page === pageType.BYBANK || page === pageType.NONE,
  );

  const onRangeChange = useMemoizedFn((value) => {
    if (value) {
      update((d) => {
        d.tableCondition.year = `[${value[0].format('YYYY').split('+')[0]}, ${value[1].format('YYYY').split('+')[0]}]`;
        d.conditionChangeLoading = true;
      });
      setDate(value);
    } else {
      if (date !== DEFAULY_DATE) {
        setDate(DEFAULY_DATE);
        update((d) => {
          d.tableCondition.year = `[${dayjs().subtract(10, 'year').format('YYYY').split('+')[0]}, ${
            dayjs().format('YYYY').split('+')[0]
          }]`;
          d.conditionChangeLoading = true;
        });
      }
    }
  });

  const resetParams = useMemoizedFn(() => {
    // 先重置筛选参数
    update((d) => {
      for (const key of screenKeys) {
        // d.filterRequestParams[key] = '';
        d.tableCondition[key] = '';
      }
      d.conditionChangeLoading = true;
      d.tableCondition.text = '';

      if (moduleId) d.tableCondition.organizationType = moduleId;
    });
    // 不受控的情况下 刷新筛选组件
    setRefresh(nanoid());
    // setScreenValues([[], [], [], []]);
  });

  useEffect(() => {
    update((d) => {
      d.resetParams = resetParams;
    });
  });

  const handleScreenChange = useMemoizedFn((cur, total, index) => {
    // const value = cur.map((item: any) => item.value);
    // 先重置筛选参数
    update((d) => {
      for (const key of screenKeys) {
        // d.filterRequestParams[key] = '';
        d.tableCondition[key] = '';
      }
      if (moduleId) d.tableCondition.organizationType = moduleId;
    });
    const resultMap: any = {};
    for (const obj of total) {
      const optionValue = obj.value === '不限' ? '' : obj.value;
      if (resultMap[obj.key] === undefined) {
        resultMap[obj.key] = optionValue.split('-')[0];
      } else {
        resultMap[obj.key] += `,${optionValue.split('-')[0]}`;
      }
    }
    if (total.length !== 0) {
      update((d) => {
        for (const [key, value] of Object.entries(resultMap)) {
          // d.filterRequestParams[key] = value;
          d.tableCondition[key] = value;
        }
      });
    }
    update((d) => {
      d.conditionChangeLoading = true;
      d.tableCondition.skip = 0;
    });
    const containerRect = document.querySelector('.main-container')?.getBoundingClientRect(),
      elementRect = document.querySelector('.main-content-header')?.getBoundingClientRect();
    if (containerRect && elementRect) {
      // 判断标题是否在滚动容器的可视范围内
      const containerTop = containerRect.top;
      const containerBottom = containerRect.bottom;
      const elementTop = elementRect.top;
      const elementBottom = elementRect.bottom;

      const isElementVisible = elementTop >= containerTop && elementBottom <= containerBottom;
      if (isElementVisible) {
        (document.querySelector('.main-container') as HTMLElement).scrollTop = 0;
      } else {
        (document.querySelector('.main-container') as HTMLElement).scrollTop = 32;
      }
    }
  });

  const handleSearch = useMemoizedFn((value) => {
    update((d) => {
      d.tableCondition.text = value;
      d.conditionChangeLoading = true;
      d.searchRef = keywordRef.current;
    });
  });

  const screenApi = useMemo(() => {
    switch (page) {
      case pageType.BYBANK:
        return getDistributionByBankFilter;
      case pageType.NONE:
        return getNoneBankFilter;
      default:
        return () => Promise.resolve({ data: {} } as CommonResponse<Record<string, any[]>>);
    }
  }, [page]);

  const searchDataKey = useMemo(() => {
    switch (page) {
      case pageType.BYBANK:
        return AREA_F9_BANK_DISTRIBUTE_BY_BANK;
      case pageType.NONE:
        return AREA_F9_NONE_BANK;
    }
  }, [page]);

  useRequest(() => screenApi(filterRequestParams), {
    ready: !!page,
    refreshDeps: [filterRequestParams],
    onSuccess: (data: CommonResponse<Record<string, any[]>>) => {
      if (data.data) {
        setScreenKeys(Object.keys(data.data));
        // 格式化数据
        let [arr1, arr2] = [[] as Options[], [] as Options[]];
        switch (page) {
          case pageType.BYBANK:
            setOption([
              {
                title: '分类',
                option: {
                  type: ScreenType.SINGLE,
                  children: [
                    { name: '不限', value: '不限', unlimited: true, key: 'organizationType', oldName: '' },
                    ...data.data.organizationType.map((item) => ({
                      name: `${item.name}`,
                      value: `${item.key}`,
                      key: 'organizationType',
                    })),
                  ],
                },
              },
              {
                title: '银行类型',
                option: {
                  type: ScreenType.MULTIPLE,
                  children: [
                    ...data.data.bankType.map((item) => ({
                      name: `${item.name}`,
                      value: `${item.key}`,
                      key: 'bankType',
                      type: ScreenType.MULTIPLE,
                    })),
                  ],
                },
              },
            ]);
            break;
          case pageType.NONE:
            arr1 = [
              {
                title: '机构类型',
                option: {
                  type: ScreenType.MULTIPLE,
                  children: [
                    ...data.data.organizationType.map((item) => ({
                      name: `${item.name}`,
                      value: `${item.value}`,
                      key: 'organizationType',
                    })),
                  ],
                },
              },
            ];
            arr2 = [
              {
                title: '上市发债信息',
                option: {
                  type: ScreenType.MULTIPLE,
                  children: [
                    ...data.data.listAndBondIssueInfo.map((item) => ({
                      name: `${item.name}`,
                      value: `${item.value}`,
                      key: 'listAndBondIssueInfo',
                    })),
                  ],
                },
              },
              {
                title: '主体评级',
                option: {
                  type: ScreenType.MULTIPLE,
                  children: [
                    ...data.data.rate.map((item) => ({
                      name: `${item.name}`,
                      value: `${item.value}`,
                      key: 'rate',
                    })),
                  ],
                },
              },
              {
                title: '更多',
                option: {
                  type: ScreenType.MULTIPLE_TILING,
                  children: [
                    {
                      title: '注册资本',
                      data: [
                        { name: '不限', value: '-注册资本', key: 'registerCapital' },
                        ...data.data.registerCapital.map((item) => ({
                          name: `${item.name}`,
                          value: `${item.value}-注册资本`,
                          key: 'registerCapital',
                        })),
                      ],
                    },
                    {
                      title: '营业收入',
                      data: [
                        { name: '不限', value: '-营业收入', key: 'operatingRevenue' },
                        ...data.data.operatingRevenue.map((item) => ({
                          name: `${item.name}`,
                          value: `${item.value}-营业收入`,
                          key: 'operatingRevenue',
                        })),
                      ],
                    },
                    {
                      title: '总资产',
                      data: [
                        { name: '不限', value: '-总资产', key: 'totalAsset' },
                        ...data.data.totalAsset.map((item) => ({
                          name: `${item.name}`,
                          value: `${item.value}-总资产`,
                          key: 'totalAsset',
                        })),
                      ],
                    },
                    {
                      title: '净利润',
                      data: [
                        { name: '不限', value: '-净利润', key: 'netProfit' },
                        ...data.data.netProfit.map((item) => ({
                          name: `${item.name}`,
                          value: `${item.value}-净利润`,
                          key: 'netProfit',
                        })),
                      ],
                    },
                  ],
                },
              },
            ];
            if (moduleId) {
              setOption(arr2); //非银机构名录的各个下级节点屏蔽‘机构类型’
            } else {
              setOption([...arr1, ...arr2]);
            }
            break;
        }
      }
    },
    onError: () => {
      setOption([]);
    },
  });

  const rangePickerNode = useMemo(
    () => (
      <>
        年度
        <RangePicker size="small" picker="year" value={date} onChange={onRangeChange} keepValidValue />
      </>
    ),
    [date, onRangeChange],
  );

  const sourceNode = useMemo(
    () => (
      <div className="sourceNode">
        <Switch
          size="22"
          checked={isOpenSource}
          onClick={() => {
            update((d) => {
              d.isOpenSource = !isOpenSource;
            });
          }}
        />
        溯源
      </div>
    ),
    [isOpenSource, update],
  );

  const screenNode = useMemo(
    () => (
      <div className="screenNode" id="regionalResourceF9_Filter">
        <Screen
          options={option}
          onChange={handleScreenChange}
          initValues={[undefined, undefined, undefined, []]}
          getPopContainer={() => document.querySelector('.main-container') || document.body}
          key={reFresh}
        />
      </div>
    ),
    [handleScreenChange, option, reFresh],
  );

  const searchNode = useMemo(
    () => (
      <div className="searchNode">
        <TopicSearch
          placeholder={page === pageType.NONE ? '请输入机构名称' : '请输入银行名称'}
          onClear={() => {
            keywordRef.current = '';
            handleSearch('');
          }}
          onChange={(value: any) => {
            keywordRef.current = value;
          }}
          onSearch={handleSearch}
          cref={keywordRef}
          focusedWidth={224}
          dataKey={searchDataKey}
        />
      </div>
    ),
    [handleSearch, page, searchDataKey],
  );

  const dataViewNode = useMemo(
    () => (
      <AddDataView onClick={() => handleAddToEnterpriseDataView()}>
        {loading ? (
          <div style={{ marginLeft: -4, marginRight: 4, display: 'inline-block' }}>
            <Spin indicator={loadingIcon} />
          </div>
        ) : null}
        <span
          className={cn('pick-text pick-import', {
            'pick-no-bg': loading,
            'pick-disabled': isEmpty(tableData),
          })}
        >
          添加至数据浏览器
        </span>
      </AddDataView>
    ),
    [handleAddToEnterpriseDataView, loading, tableData],
  );

  return (
    <FilterWrap>
      {tableError === 1 ? null : (
        <>
          <div className="left">
            {page === pageType.SCALE ? rangePickerNode : null}
            {page === pageType.BYBANK || page === pageType.NONE ? screenNode : null}
            {page === pageType.BYBANK || page === pageType.NONE ? searchNode : null}
          </div>
          <div className="right">
            {page === pageType.SCALE ? sourceNode : null}
            {page === pageType.BYBANK || page === pageType.NONE ? dataViewNode : null}
            <div className="num">
              共 <span>{formatNumber(total, 0)}</span> 条
            </div>
            <div>
              <ExportDoc
                condition={{
                  module_type,
                  ...tableCondition,
                  sheetNames,
                }}
                filename={exportName}
              />
            </div>
          </div>
        </>
      )}
    </FilterWrap>
  );
};

export default memo(Filter);

const FilterWrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 24px;
  .screen-range-picker-wrapper {
    margin-left: 6px;
    width: 136px;
  }
  .sourceNode {
    display: flex;
    align-items: center;
    .ant-switch.dzh-switch {
      margin-right: 4px;
    }
  }
  .left {
    display: flex;
    align-items: baseline;
  }
  .searchNode {
    margin-left: 17px;
  }
  .right {
    display: flex;
    align-items: center;
    div:not(:last-child) {
      margin-right: 24px;
    }
  }
  .num {
    font-size: 13px;
    color: #8c8c8c;
    span {
      color: #141414;
    }
  }
`;

const AddDataView = styled.div<any>`
  width: 120px;
  margin-right: 24px;
  .pick-text {
    font-size: 13px;
    font-weight: 400;
    text-align: left;
    color: ${({ selectRows }) => (selectRows?.length ? '#333333' : '#bfbfbf!important')};
    cursor: ${({ selectRows }) => (selectRows?.length ? 'pointer' : 'no-drop')};
    line-height: 20px;
    position: relative;
    &::before {
      content: '';
      display: inline-block;
      width: 10px;
      height: 10px;
      background: ${({ selectRows }) =>
        selectRows?.length
          ? `url(${require('@/pages/finance/financingLeaseNew/images/add-active.png')}) no-repeat center`
          : `url(${require('@/pages/finance/financingLeaseNew/images/add.png')}) no-repeat center`};
      background-size: 10px 10px;
      margin-right: 4px;
    }
  }
  .pick-import {
    color: #333 !important;
    cursor: pointer;
    &:before {
      background: url(${require('@/pages/finance/financingLeaseNew/images/add-active.png')}) no-repeat center;
      background-size: 10px 10px;
    }
    &.pick-no-bg {
      &:before {
        display: none;
      }
    }
    &.pick-disabled {
      color: #bfbfbf !important;
      cursor: not-allowed;
      &:before {
        background: url(${require('@/pages/finance/financingLeaseNew/images/add.png')}) no-repeat center;
        background-size: 10px 10px;
      }
    }
  }
`;
