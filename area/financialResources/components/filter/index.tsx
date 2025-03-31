import { FC, memo, useCallback, useRef } from 'react';

import cn from 'classnames';
import dayjs from 'dayjs';
import { isUndefined } from 'lodash';
import styled from 'styled-components';

import ExportDoc from '@/components/exportDoc';
import { Options, Screen } from '@/components/screen';
import TopicSearch from '@/components/topicSearch';
import { useImmer } from '@/utils/hooks';

import { AddDataView, HideRank } from '..';
import { PLATFORM } from '../const';

type IProps = {
  renderScreen?: boolean;
  menuOption: any;
  handleMenuChange: any;
  // 列表数量
  total: number;
  condition: any;
  // 添加至数据浏览器必要参数
  dataView?: {
    platform: keyof typeof PLATFORM;
    handleAddToEnterpriseDataView: Function;
  };
  // 导出用参数
  exportConfig?: {
    module_type: string;
    exportOtherCondition: any;
    // 地区
    regionName: string;
    // 页面名称-导出用
    title: string;
  };
  isHiddenRank?: boolean;
  isHiddenColumn?: boolean;
  hiddenChecked?: { hiddenBlankRow: boolean; hiddenRanking: boolean };
  onChangeHidden?: (key: 'hiddenBlankRow' | 'hiddenRanking') => void;
  handleSearch: (text: string) => void;
  dataKey: string;
  placeholder?: string;
  bordered?: boolean;
  screenInfo?: string;
  lastBorder?: boolean;
};

const Index: FC<IProps> = ({
  renderScreen = true,
  menuOption,
  handleMenuChange,
  total,
  condition,
  dataView,
  exportConfig,
  isHiddenColumn,
  isHiddenRank,
  hiddenChecked,
  onChangeHidden,
  handleSearch,
  dataKey,
  placeholder,
  bordered,
  screenInfo,
  lastBorder,
}) => {
  const keywordRef = useRef('');
  const initValRef = useRef<string>('');
  // 这里应该是拆成单独的筛选组件来做，但是需求做的时候没有提，所以整个用了一个筛选组件来做。导致控制筛选组件的选中状态比较麻烦
  const [changed, setChanged] = useImmer({
    first: false,
    last: false,
  });
  const { regionName, title, module_type, exportOtherCondition } = exportConfig || {};
  const { handleAddToEnterpriseDataView, platform } = dataView || {};
  const screenChange = useCallback(
    (args) => {
      handleMenuChange?.apply(this, args);
      const allValues = args[1] || [];
      if (!initValRef.current) {
        initValRef.current = allValues.map((o: { value: string }) => o.value);
      } else {
        setChanged((draft) => {
          draft.first = allValues?.[0]?.value !== initValRef.current?.[0];
          draft.last = lastBorder ? allValues?.[1]?.value !== initValRef.current?.[1] : false;
        });
      }
    },
    [handleMenuChange, setChanged, lastBorder],
  );
  return (
    <FilterWrapper className="area-financialResources-common-filter">
      {renderScreen ? (
        <FilterLeft className="seleft-left">
          <div
            className={cn(
              'screen',
              `${changed.first && bordered ? 'screen-form-item-changed-first' : 'screen-form-item-unchanged-first'}`,
              `${changed.last && bordered ? 'screen-form-item-changed-last' : 'screen-form-item-unchanged-last'}`,
            )}
          >
            {screenInfo && <span className="screen-info">{screenInfo}</span>}
            <Screen
              options={menuOption as Options[]}
              onChange={(a, b, c) => {
                screenChange([a, b]);
              }}
              bordered={bordered}
            />
          </div>
          <div className="search">
            <TopicSearch
              placeholder={placeholder || '请输入关键字'}
              onClear={() => {
                keywordRef.current = '';
                handleSearch('');
              }}
              onChange={(value: string) => {
                keywordRef.current = value;
              }}
              onSearch={handleSearch}
              dataKey={dataKey}
              style={{}}
              cref={keywordRef}
              focusedWidth={200}
            />
          </div>
        </FilterLeft>
      ) : null}
      <FilterRight className="select-right">
        {isHiddenRank ? (
          <HideRank
            tipText={`“排名”是指报告期内披露该指标的同类型银行全国排名`}
            showText="隐藏排名"
            checked={hiddenChecked?.hiddenRanking}
            onChange={() => onChangeHidden?.('hiddenRanking')}
            className={'hidden-rank'}
          />
        ) : null}
        {isHiddenColumn ? (
          <HideRank
            showText="隐藏空行"
            checked={hiddenChecked?.hiddenBlankRow}
            onChange={() => onChangeHidden?.('hiddenBlankRow')}
            className={'hidden-column'}
          />
        ) : null}
        {!isUndefined(dataView) ? (
          <AddDataView
            platform={platform!}
            total={total}
            handleAddToEnterpriseDataView={handleAddToEnterpriseDataView}
          />
        ) : null}
        {/* 统计 */}
        <div className="count">
          共<span className="num">{total || '0'}</span>条
        </div>
        {/* 导出 */}
        {isUndefined(exportConfig) ? null : (
          <ExportDoc
            condition={{
              module_type,
              ...condition,
              ...exportOtherCondition,
              isPost: '',
            }}
            filename={`${regionName}-${title}-${dayjs(new Date()).format('YYYYMMDD')}`}
          />
        )}
      </FilterRight>
    </FilterWrapper>
  );
};

export default memo(Index);

const FilterWrapper = styled.div`
  padding: 8px 0 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  background: white;
  top: 0;
  z-index: 9;
  .select-right {
    font-size: 13px;
    font-weight: 400;
    color: #434343;
  }
`;

const FilterLeft = styled.div`
  height: 24px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  .screen {
    display: flex;
    align-items: center;
    .screen-info {
      font-size: 12px;
      height: 17px;
      padding-top: 1px;
      margin-right: 6px;
    }
    .screen-wrapper {
      align-items: center;
    }
  }
  .screen-form-item-changed-first .screen-wrapper {
    > div:first-child {
      background: #f5faff;
    }
  }
  .screen-form-item-changed-last .screen-wrapper {
    > div:nth-child(2) {
      background: #f5faff;
    }
  }
  .screen-form-item-unchanged-first .screen-wrapper {
    > div:first-child {
      background: #fff;
    }
  }
  .screen-form-item-unchanged-last .screen-wrapper {
    > div:nth-child(2) {
      background: #fff;
    }
  }
  .search {
    margin-left: 0;
  }
`;

const FilterRight = styled.div`
  height: 20px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  & > div {
    margin-left: 24px;
  }
  div:first-child {
    margin-left: 0;
  }
  .count {
    color: #8c8c8c;
    .num {
      padding: 0 4px;
      color: #333333;
    }
  }
  .ant-switch-small {
    height: 13px;
    line-height: 13px;
    .ant-switch-handle {
      width: 9px;
      height: 9px;
    }
  }
  .ant-switch-small.ant-switch-checked .ant-switch-handle {
    left: calc(100% - 9px - 2px);
  }
  .export-xls-btn {
    height: 20px;
    line-height: 20px;
    > i {
      top: 0;
    }
  }
`;
