import { memo, useRef } from 'react';

import dayjs, { Dayjs } from 'dayjs';
import styled from 'styled-components';

import { RangePicker, Checkbox } from '@/components/antd';
import ExportDoc from '@/components/exportDoc';
import { Screen, ScreenValues, Options, ScreenType } from '@/components/screen';
import TopicSearch from '@/components/topicSearch';
import { SearchFiled } from '@/pages/area/areaCompany/module/bondIssueList/constants';
import { formatNumber } from '@/utils/format';

type Iprop = {
  /** 清空筛选项时重置screenKey */
  screenKey: string;
  screenMenu: Options[];
  exportInfo: {
    total: number;
    pageParams: any;
    moduleType: string;
    usePost: boolean;
    filename?: string;
  };
  onFilterSearch?: Function;
  onFilterClear?: Function;
  onFilterChange: (_: any, filterInfo: any, idx: number) => void;
  /** 是否需要时间范围筛选 */
  rangeSelectInfo?: {
    title: string;
    /** 禁选时间 */
    disabledDate: (date: Dayjs) => boolean;
    defaultRange?: [Dayjs, Dayjs];
  };
  dynamicDropdownTop?: number;
  /** 是否包含跨市场债券 */
  isIncludeBondMarket?: boolean;
  /** 受控选项，区域融资筛选用 */
  screenValues?: ScreenValues;
  onRangeChange?: (range: any) => void;
  onIncludeBondMarketChange?: (bool: any) => void;
  filterSearchKey?: string;
};

const FilterInfo = ({
  screenKey,
  screenValues,
  filterSearchKey,
  onFilterChange,
  onFilterClear,
  onFilterSearch,
  onRangeChange,
  rangeSelectInfo,
  screenMenu,
  dynamicDropdownTop,
  isIncludeBondMarket,
  exportInfo: { total, pageParams, moduleType, usePost, filename },
  onIncludeBondMarketChange,
}: Iprop) => {
  const filterRef = useRef<HTMLDivElement>(null);

  return (
    <FilterStyle
      ref={filterRef}
      id="filterWrap"
      hasScreen={!!screenMenu.length}
      justSearch={!screenMenu.length && !rangeSelectInfo}
    >
      <div className="filter-left">
        {rangeSelectInfo ? (
          <div className="range-picker">
            <div className="pick-title">{rangeSelectInfo.title}</div>
            <RangePicker
              size="small"
              value={rangeSelectInfo?.defaultRange}
              onChange={onRangeChange}
              key={`${screenKey}-picker`}
              disabledDate={rangeSelectInfo.disabledDate}
              getPopupContainer={() => filterRef.current!}
            />
          </div>
        ) : null}
        <Screen
          key={screenKey}
          options={screenMenu}
          onChange={onFilterChange}
          values={screenValues}
          getPopContainer={() => filterRef.current!}
        />

        {isIncludeBondMarket ? (
          <CrossMarketBond>
            <Checkbox onChange={onIncludeBondMarketChange}>是否合并跨市场债券</Checkbox>
          </CrossMarketBond>
        ) : null}

        {filterSearchKey && (
          <div className="filter-search-wrapper">
            <TopicSearch
              prefix
              style={null}
              focusedWidth={280}
              onClear={onFilterClear}
              onChange={() => {}}
              onSearch={onFilterSearch}
              dataKey={filterSearchKey}
              dynamicDropdownTop={dynamicDropdownTop}
              placeholder={'发行人/债券简称/代码'}
              screenOption={{
                type: ScreenType.MULTIPLE,
                children: [
                  {
                    name: '债券简称及代码',
                    value: SearchFiled.BAND_NAME_CODE,
                  },
                  {
                    name: '发行人',
                    value: SearchFiled.ISSUER,
                  },
                ],
              }}
            />
          </div>
        )}
      </div>
      <Wrap>
        <div className="total">
          共<span>{formatNumber(total, 0) || 0}</span>条
        </div>
        <ExportDoc
          condition={{ ...pageParams, module_type: moduleType }}
          filename={`${filename || dayjs(new Date()).format('YYYYMMDD')}`}
          usePost={usePost}
        />
      </Wrap>
    </FilterStyle>
  );
};

export default memo(FilterInfo);

const FilterStyle = styled.div<any>`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  .area-enterprise-screen-more-date,
  .area-company-revoke-filter-more,
  .area-enterprise-screen-more-range {
    > div:last-child > div > div {
      align-items: center;
      > div:first-child {
        text-align: left !important;
        text-align-last: left !important;
      }
    }
    ul > li {
      color: #141414;
      .ant-picker-input > input {
        width: 63px !important;
      }
    }
  }

  .area-enterprise-screen-more-range {
    > div:last-child > div > div {
      align-items: flex-start !important;
    }
  }

  .ant-input-group > .ant-input-group-addon {
    height: 26px;
  }

  .areaCompany-filter-popover {
    .popover-content {
      > span {
        margin: 0 4px;
        color: #025cdc;
        cursor: pointer;
      }
    }
  }
  .filter-left {
    display: flex;
    flex-flow: wrap;
    line-height: 34px;

    > div:last-child > div:last-child {
      margin-left: 13px;
    }
    .topicSearch-wrapper {
      margin-left: 13px;
    }
    .search-wrapper,
    .custom {
      margin-left: ${({ justSearch }) => (justSearch ? -24 : 0)}px;
    }
    .screen-wrapper {
      & > div:last-child {
        margin-left: unset !important;
      }
      .filter-icon {
        margin-left: unset !important;
        > i {
          margin-left: unset !important;
        }
      }
      .why-icon {
        color: #878787;
      }
    }
    .range-picker {
      display: flex;
      align-items: center;
      margin-right: ${({ hasScreen }) => (hasScreen ? 24 : 0)}px;
      .pick-title {
        height: 17px;
        margin-right: 6px;
        font-size: 12px;
        font-weight: 400;
        color: #141414;
        line-height: 17px;
      }
      .ant-picker-input > input {
        width: 63px !important;
      }
    }
  }

  .filter-search-wrapper {
    > div {
      margin-left: unset !important;
      > div {
        margin-left: unset !important;
        margin-top: 2px;
      }
    }
  }
`;

const Wrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 200px;
  .more-indic {
    display: flex;
    align-items: center;
    margin-right: 24px;
    > span {
      display: inline-block;
      width: 52px;
      height: 20px;
      font-size: 13px;
      font-weight: 400;
      color: #262626;
      line-height: 21px;
      cursor: pointer;
    }

    .vip-icon {
      width: 12px;
      height: 11px;
      margin-left: 4px;
      background: url(${require('../../assets/vip.png')}) no-repeat;
      background-size: 100%;
      cursor: pointer;
    }
  }
  .total {
    margin-right: 24px;
    color: #8c8c8c;
    font-size: 13px;
    font-weight: 400;
    span {
      padding: 0 4px;
      color: #ff7500;
    }
  }
`;

const CrossMarketBond = styled.div`
  margin-left: 24px;
  transform: translateY(-1px);
  .ant-checkbox {
    transform: translateY(1px);
    .ant-checkbox-inner {
      transform: scale(${12 / 16});
      transform-origin: center center;
    }
    & + span {
      padding: 0 24px 0 6px;
      height: 20px;
      font-size: 12px;
      font-weight: 400;
      color: #434343;
      line-height: 20px;
    }
  }
  .ant-checkbox-wrapper:hover .ant-checkbox-inner,
  .ant-checkbox:hover .ant-checkbox-inner,
  .ant-checkbox-input:focus + .ant-checkbox-inner {
    border-color: #e0e0e0;
  }
`;
