import { useRef, FC, useState, CSSProperties } from 'react';

import { useMemoizedFn } from 'ahooks';
import cn from 'classnames';
import dayjs, { Dayjs } from 'dayjs';
import { isEmpty } from 'lodash';
import styled from 'styled-components';

import { Checkbox } from '@/components/antd';
import ExportDoc, { EXPORT } from '@/components/exportDoc';
import { Screen } from '@/components/screen';
import ScreenForm, { Group, Item } from '@/components/screenForm';
import TopicSearch from '@/components/topicSearch';
import { ChangeFilter } from '@/pages/finance/financingLeaseNew/modules/censusAnalyse/config';
import { formatNumber } from '@/utils/format';
import { useMount } from '@/utils/hooks';

import RangeSelect from '../rangeSelect';
import { Picker as RangePickerWithSeason } from './rangePicker';

const season_start = ['', '01', '01', '01', '04', '04', '04', '07', '07', '07', '10', '10', '10'];

export interface TConf {
  /** 筛选是否改变 */
  changeFlag?: boolean;
  /** 是否显示label，如果两个筛选在一起，只显示一个label，那么第二个筛选的label不填 */
  label?: string;
  /** 对应字段的key/name */
  key?: any;
  /** 微调筛选项样式 */
  style?: React.CSSProperties;
  /** 该筛选项的配置，完全兼容screen */
  itemConfig?: any;
  /** 受控数据，配置同screen的受控 */
  values?: any[];
  /** 初始数据 */
  initValues?: any[];
  /** 自定义 */
  [k: string]: any;
}

interface Props {
  /** 地区筛选 */
  onAreaChange?: Function;
  /** 行业筛选 */
  onIndustryChange?: Function;
  /** 承租人分类筛选 */
  onLesseeClassifyChange?: Function;
  /** 出租人分类筛选 */
  onLessorTypeChange?: Function;
  /** 出租人性质筛选 */
  onLessorNatureChange?: Function;
  /** 上市/发债筛选 */
  onListingBondIssuanceChange?: Function;
  /** 筛选配置参数 */
  config?: TConf[];
  /** 是否需要搜索 */
  isSearch?: boolean;
  /** 筛选ref */
  screenRef?: any;
  /** 搜索ref */
  keywordRef?: any;
  /** 是否需要含到期时间 */
  isExpirationEvent?: boolean;
  /** 是否需要添加数据浏览器 */
  isAddDataView?: boolean;
  /** 数据总数 */
  total?: number;
  /** 表格数据 */
  tableData?: any[];
  /** 日期筛选 */
  onRangeDateChange?: Function;
  /** 含到期事件筛选 */
  onExpirationChange?: Function;
  /** 搜索 */
  onHandleSearch?: Function;
  /** 搜索记录key */
  searchKey?: string;
  /** 搜索清空 */
  onHandleSearchClear?: Function;
  /** 导出参数 */
  exportInfo?: any;
  /** 禁止勾选日期 */
  disabledDate?: (date: Dayjs) => boolean;
  /** 筛选自定义变更 */
  dispatchChange?: Function;
  /** 添加至数据浏览器 */
  onAddToEnterpriseDataView?: Function;
  /** style */
  style?: CSSProperties;
}

/**
 * 1、投放总量页面：最小可以设置到2000年，最大年份是最新的年度
 * 2、将到期页面：最小可以设置到最新年度，最大年份不限
 */
export const totalDisabledDate = (current: Dayjs) => {
  const minDate = dayjs('2000-01-01');
  const maxDate = dayjs();
  return current < minDate || current > maxDate;
};

export const willExpireDisabledDate = (current: Dayjs) => {
  const maxDate = dayjs();
  return current < maxDate;
};

const calculateDate = (date: Dayjs, years: number, days: number) => {
  return date.subtract(years, 'year').add(days, 'day');
};

export const DATE = {
  nowDate: dayjs(),
  nextYear: calculateDate(dayjs(), -1, -1),
  nextThreeYear: calculateDate(dayjs(), -3, -1),
  nextTenYear: calculateDate(dayjs(), -10, -1),
  prevYear: calculateDate(dayjs(), 1, 1),
  prevThreeYear: calculateDate(dayjs(), 3, 1),
  prevTenYear: calculateDate(dayjs(), 10, 1),
};

const now_start = dayjs(`${dayjs().year()}-${season_start[Number(dayjs().format('MM'))]}`);

export const defaultValueDateBySeason = new Map([
  [
    '1',
    [
      [DATE.prevYear, DATE.nowDate],
      [DATE.nowDate, DATE.nextYear],
    ],
  ],
  [
    '2',
    [
      [now_start.subtract(3, 'year'), now_start],
      [now_start, now_start.add(3, 'year')],
    ],
  ],
  [
    '3',
    [
      [DATE.prevTenYear, DATE.nowDate],
      [DATE.nowDate, DATE.nextTenYear],
    ],
  ],
]);

export const _now_prev_default = [DATE.prevYear, DATE.nowDate];
export const _now_next_default = [DATE.nowDate, DATE.nextYear];

export const quarterFormatValue = new Map([
  ['01', '一季度'],
  ['04', '二季度'],
  ['07', '三季度'],
  ['10', '四季度'],
]);

export const CommonScreen: FC<Props> = ({
  config,
  total,
  tableData,
  exportInfo,
  isSearch = false,
  searchKey,
  keywordRef,
  screenRef,
  disabledDate,
  isExpirationEvent = false,
  isAddDataView = false,
  onAreaChange,
  onIndustryChange,
  onLesseeClassifyChange,
  onLessorTypeChange,
  onLessorNatureChange,
  onListingBondIssuanceChange,
  onRangeDateChange,
  onExpirationChange,
  onHandleSearchClear,
  onHandleSearch,
  dispatchChange,
  onAddToEnterpriseDataView,
  style,
}) => {
  /* 加这个是为了防止第一次切换模式二，展开收起按钮会闪烁 */
  const [watchSizeChange, setWatchSizeChange] = useState(false);
  const timeOutRef = useRef<NodeJS.Timeout>();
  const keyWordDomRef = useRef();
  useMount(() => {
    timeOutRef.current = setTimeout(() => setWatchSizeChange(true), 200);
    return () => timeOutRef.current && clearInterval(timeOutRef.current);
  });

  /** 在screen组件中列举所有可能的筛选情况，即可判断每一个筛选的情况及空值判定 */
  /** 根据各页面不同筛选自行追加 */
  const whichChange = useMemoizedFn((which, allSelectedRows) => {
    switch (which) {
      case ChangeFilter.AREA:
        onAreaChange?.(allSelectedRows);
        break;
      case ChangeFilter.INDUSTRY:
        onIndustryChange?.(allSelectedRows);
        break;
      case ChangeFilter.LESSEE_TYPE:
        onLesseeClassifyChange?.(allSelectedRows);
        break;
      case ChangeFilter.LESSOR_TYPE:
        onLessorTypeChange?.(allSelectedRows);
        break;
      case ChangeFilter.LESSOR_NATURE:
        onLessorNatureChange?.(allSelectedRows);
        break;
      case ChangeFilter.LISTING_BONDISSUANCE:
        onListingBondIssuanceChange?.(allSelectedRows);
        break;
      default:
        break;
    }
  });

  return (
    <ScreenMain ref={screenRef} style={style}>
      {config && (
        <Container>
          <ScreenWrapper style={{ width: isAddDataView ? '55%' : '80%' }}>
            <ScreenForm style={{ paddingLeft: 0 }}>
              <Group watchSizeChange={watchSizeChange} style={{ overflow: 'visible' }}>
                {config?.map((opt, idx) => {
                  if (opt?.type === 'rangePick') {
                    return (
                      <Item label={opt?.label} key={`${idx}_${opt?.domKey}`}>
                        <RangeSelect
                          containerRef={screenRef}
                          disabledDate={disabledDate}
                          defaultValue={opt?.defaultValueDate}
                          picker={opt?._type}
                          onChange={(date) => dispatchChange?.(opt?.type, date) ?? onRangeDateChange?.(date)}
                        />
                      </Item>
                    );
                  } else if (opt?.type === 'rangePicker') {
                    return (
                      <Item label={opt?.label ?? ''} key={`${idx}_${opt?.domKey}`}>
                        <RangePickerWithSeason
                          type={opt?._type}
                          disabledDate={disabledDate}
                          onChange={(_, date) => dispatchChange?.(opt?.type, date)}
                        />
                      </Item>
                    );
                  }
                  return (
                    <Item
                      label={opt?.label}
                      name={opt.key}
                      style={opt?.style}
                      className={cn(
                        'form-item',
                        `${opt?.changeFlag ? 'full-screen-form-item-changed' : 'full-screen-form-item-unchanged'}`,
                      )}
                      key={`${idx}_${opt?.domKey ?? ''}`}
                    >
                      <Screen
                        options={opt?.itemConfig}
                        values={[opt?.values]}
                        onChange={(allSelectedRows) =>
                          dispatchChange?.(opt?.key, allSelectedRows) ?? whichChange(opt?.key, allSelectedRows)
                        }
                        initValues={opt?.initValues ? [opt?.initValues] : undefined}
                        getPopContainer={() => screenRef?.current || document.body}
                      />
                    </Item>
                  );
                })}
                {isSearch ? (
                  <Item name="keyword" className={'form-item'}>
                    <TopicSearch
                      style={{ width: 160, height: 24 }}
                      cref={keyWordDomRef}
                      placeholder="请输入公司名称..."
                      onClear={onHandleSearchClear}
                      onChange={() => void 0}
                      onSearch={onHandleSearch}
                      dataKey={searchKey}
                    />
                  </Item>
                ) : (
                  /** ScreenForm组件问题，不返回tsx报错 */
                  <Item>
                    <span>{null}</span>
                  </Item>
                )}
              </Group>
            </ScreenForm>
          </ScreenWrapper>
          <SkipExportWrap>
            {isExpirationEvent ? (
              <ExpirationEvent>
                <Checkbox defaultChecked={true} onChange={(bool) => onExpirationChange?.(bool)}>
                  含到期事件
                </Checkbox>
              </ExpirationEvent>
            ) : null}

            {isAddDataView ? (
              <AddDataView onClick={() => onAddToEnterpriseDataView?.()}>
                <span
                  className={cn('pick-text pick-import', {
                    'pick-disabled': isEmpty(tableData),
                  })}
                >
                  添加至数据浏览器
                </span>
              </AddDataView>
            ) : null}
            <Operating style={{ alignItems: 'baseline' }}>
              <div className="total">
                共 <span>{formatNumber(total!, 0) || 0}</span> 条
              </div>
              <ExportDoc
                type={EXPORT}
                module_type={exportInfo?.exportCondition?.module_type}
                condition={{ ...exportInfo?.exportCondition }}
                filename={`${exportInfo?.fileName}-${dayjs(new Date()).format('YYYYMMDD')}`}
                disabled={exportInfo?.exportState}
                style={{ height: 25, fontSize: 13, fontWeight: 400 }}
              />
            </Operating>
          </SkipExportWrap>
        </Container>
      )}
    </ScreenMain>
  );
};

const ScreenMain = styled.div`
  position: sticky;
  top: 43px;
  z-index: 7;
  background-color: #ffffff;
  padding-top: 11px;
`;

const Container = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding-bottom: 3px;
  .no-border {
    margin-right: 16px;
    > div {
      background: #fff !important;
      border: none !important;
      padding-left: 0 !important;
      padding-right: 0 !important;
    }
  }
  .form-item {
    margin-right: 16px;
  }
`;

const ScreenWrapper = styled.div`
  > div {
    padding: 2px 0 0 0;
    width: 100%;
  }

  .ant-picker-small {
    padding: 0 6px 0;
  }
`;

const SkipExportWrap = styled.div`
  display: flex;
  align-items: center;
`;

export const Operating = styled.div`
  width: fit-content;
  display: flex;
  align-items: center;
  white-space: nowrap;
  .total {
    color: #8c8c8c;
    font-size: 13px;
    font-weight: 400;
    color: #8c8c8c;
    margin-right: 24px;
    span {
      color: rgb(51, 51, 51);
    }
  }
`;

const ExpirationEvent = styled.div`
  .ant-checkbox {
    transform: translateY(1px);
    .ant-checkbox-inner {
      transform: scale(${12 / 16});
      transform-origin: center center;
    }
    & + span {
      padding: 0 24px 0 4px;
      height: 20px;
      font-size: 13px;
      font-weight: 400;
      color: #262626;
      line-height: 20px;
    }
  }
  .ant-checkbox-wrapper:hover .ant-checkbox-inner,
  .ant-checkbox:hover .ant-checkbox-inner,
  .ant-checkbox-input:focus + .ant-checkbox-inner {
    border-color: #e0e0e0;
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
