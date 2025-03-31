import { memo, useRef } from 'react';
import { useSelector } from 'react-redux';

import { LoadingOutlined } from '@ant-design/icons';
import { Switch } from '@dzh/components';
import { useMemoizedFn, useRequest } from 'ahooks';
import { Service } from 'ahooks/lib/useRequest/src/types';
import { Spin } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import dayjs, { Dayjs } from 'dayjs';
import { isArray } from 'lodash';
import styled from 'styled-components';

import { Checkbox, Popover, RangePicker } from '@/components/antd';
import ExportDoc from '@/components/exportDoc';
import { Options, Screen, ScreenType, ScreenValues } from '@/components/screen';
import TopicSearch from '@/components/topicSearch';
import { LINK_ENTERPRISE_DATA_VIEW } from '@/configs/routerMap';
import { useOpenDataView } from '@/models/transmission';
import { SearchFiled } from '@/pages/area/areaCompany/module/bondIssueList/constants';
import { useDispatch } from '@/pages/area/areaF9/context';
import { formatNumberWithVIP } from '@/utils/format';

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
  onClearSearch?: (txt?: string) => void;
  onSearch?: (txt: string) => void;
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
  /** 请求表格数据的api,存在的话则展示跳转至企业数据浏览器的入口 */
  listApiFunction?: Service<Promise<Record<string, any>>, any[]>;
  /** 是否需要【含到期租赁】筛选 */
  isSwitch?: boolean;
  /** 是否需要【企业去重】筛选 */
  isRepeatSwitch?: boolean;
  /** 筛选状态 受控 */
  repeatSwitchChecked?: boolean;
  /** 是否包含跨市场债券 */
  isIncludeBondMarket?: boolean;
  /** 受控选项，区域融资筛选用 */
  screenValues?: ScreenValues;
  onRangeChange?: (range: [start: Dayjs, end: Dayjs] | any) => void;
  onSwitchChange?: (range: CheckboxChangeEvent) => void;
  onIncludeBondMarketChange?: (bool: any) => void;
  /** 保存搜索记录的key值 */
  searchDataKey?: string;
  filterSearchKey?: string;
};

const loadingIcon = <LoadingOutlined style={{ fontSize: 12 }} spin />;
const topicSearchStyle = { lineHeight: 26, height: 26, width: 220 };
const linkLoadingStyle = { marginRight: 4, display: 'inline-block' };

const FilterInfo = ({
  searchDataKey = '',
  screenKey,
  screenValues,
  filterSearchKey,
  onFilterChange,
  onClearSearch,
  onSearch,
  onFilterClear,
  onFilterSearch,
  onRangeChange,
  rangeSelectInfo,
  screenMenu,
  isSwitch,
  isRepeatSwitch,
  repeatSwitchChecked,
  isIncludeBondMarket,
  exportInfo: { total, pageParams, moduleType, usePost, filename },
  onSwitchChange,
  onIncludeBondMarketChange,
  listApiFunction,
}: Iprop) => {
  const dispatch = useDispatch();
  const havePay = useSelector((store: any) => store.user.info).havePay;

  const filterRef = useRef<HTMLDivElement>(null);

  const openDataView = useOpenDataView();

  const { run: handleRequest1wData, loading: importLoading } = useRequest(listApiFunction as any, {
    manual: true,
    onSuccess: (res: any) => {
      /** 区域企业大部分页面 & 区域融资-除租赁融资页面*/
      const list = isArray(res?.data?.groupItems?.list)
        ? res.data.groupItems.list
        : /** 吊销/注销 | 新成立 */
        isArray(res?.data)
        ? res.data
        : /** 科创 */
        isArray(res?.data?.list)
        ? res?.data?.list
        : isArray(res?.data?.data)
        ? res?.data?.data
        : [];

      openDataView(LINK_ENTERPRISE_DATA_VIEW, {
        indicators: [],
        rows: list?.map((d: any) => {
          return {
            key: d?.itCode || d?.enterpriseCode || d?.ITCode2 || d?.code || '',
            type: 'company',
            name: (d?.companyName || d?.enterpriseName || d?.itName || d?.ITName || d?.name)?.replace(
              /<em>(.*?)<\/em>/g,
              '$1',
            ), // 去除高亮标签,
          };
        }),
      });
    },
  });

  const LinkToDataView = useMemoizedFn(() => {
    if (havePay) {
      handleRequest1wData({
        ...pageParams,
        skip: 0,
        from: 0,
        size: 1e4,
        pageSize: 1e4,
        pagesize: 1e4,
        moreFlag: true,
      });
    } else {
      dispatch((d) => {
        d.showMoreIndicDialog = true;
      });
    }
  });

  return (
    <FilterStyle
      ref={filterRef}
      id="filterWrap"
      hasScreen={!!screenMenu.length}
      hasSearch={filterSearchKey || searchDataKey}
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
          options={screenMenu.length ? screenMenu : undefined}
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
              style={null}
              prefix={true}
              focusedWidth={280}
              onClear={onFilterClear}
              onChange={() => {}}
              onSearch={onFilterSearch}
              dataKey={filterSearchKey}
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

        {searchDataKey ? (
          <TopicSearch
            key={`${screenKey}-search`}
            onClear={onClearSearch}
            style={topicSearchStyle}
            maxSaveLen="20"
            placeholder="请输入公司名称"
            onSearch={onSearch}
            hasHistory={true}
            focusedWidth={220}
            dataKey={searchDataKey}
          />
        ) : null}
      </div>
      <Wrap>
        {isSwitch ? (
          <div className="filter-switch">
            <ExpirationEvent>
              <Checkbox defaultChecked={true} onChange={onSwitchChange}>
                含到期事件
              </Checkbox>
            </ExpirationEvent>
          </div>
        ) : null}

        {listApiFunction ? (
          <Popover
            trigger="hover"
            placement="bottom"
            overlayClassName="areaCompany-filter-popover"
            arrowPointAtCenter={true}
            color="rgba(255,255,255,1)"
            getPopupContainer={() => filterRef.current!}
            content={
              <div className="popover-content" onClick={LinkToDataView}>
                导入当前列表企业至<span>企业数据浏览器</span>支持查询更多指标
              </div>
            }
          >
            <div className="more-indic" onClick={LinkToDataView}>
              {importLoading ? (
                <div style={linkLoadingStyle}>
                  <Spin indicator={loadingIcon} />
                </div>
              ) : null}
              <span>更多指标</span>
              <div className="vip-icon" />
            </div>
          </Popover>
        ) : null}

        {isRepeatSwitch ? (
          <RepeatSwitchStyle>
            <Switch size="22" checked={repeatSwitchChecked} defaultChecked={false} onChange={onSwitchChange as any} />
            <span>企业去重</span>
          </RepeatSwitchStyle>
        ) : null}

        <div className="total">
          共<span>{formatNumberWithVIP(total, 0) || 0}</span>条
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
  min-height: 32px;
  display: flex;
  align-items: center;
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
    .ant-popover-inner-content {
      width: 250px;
      height: 54px;
      padding: 8px 10px;
      box-shadow: 0px 2px 9px 2px rgba(0, 0, 0, 0.09), 0px 1px 2px -2px rgba(0, 0, 0, 0.16);
    }
    .popover-content {
      font-size: 13px;
      font-family: PingFang SC, PingFang SC-Regular;
      font-weight: 400;
      text-align: left;
      color: #434343;
      > span {
        margin: 0 16px 0 6px;
        color: #025cdc;
        cursor: pointer;
      }
    }
  }
  .filter-left {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    flex: 1;
    // UI校对，距离右侧至少40
    margin-right: 40px;
    > div:last-child > div:last-child {
      margin-left: 13px;
    }
    .topicSearch-wrapper {
      margin-left: 0 !important;
      height: 34px;
    }
    .search-wrapper,
    .custom {
      margin-left: ${({ justSearch }) => (justSearch ? -24 : 0)}px;
    }
    .screen-wrapper {
      margin-right: 13px;
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
      margin-right: ${({ hasScreen, hasSearch }) => (hasScreen ? 24 : hasSearch ? 13 : 0)}px;
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
      }
    }
  }
`;

const Wrap = styled.div`
  display: flex;
  align-items: center;
  align-self: baseline;
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

const RepeatSwitchStyle = styled.div`
  display: flex;
  align-items: center;
  margin-right: 24px;
  span {
    font-size: 13px;
    color: #141414;
  }
  .ant-switch {
    margin-right: 4px;
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
