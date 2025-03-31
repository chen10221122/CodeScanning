import { useCallback, useMemo, useState } from 'react';

import styled from 'styled-components';

import { RangePicker } from '@/components/antd';
import ExportDoc from '@/components/exportDoc';
import { Screen, Options, ScreenType } from '@/components/screen';
import TopicSearch from '@/components/topicSearch';
import { QUALITY_LIST_HISTORY_DETAIL } from '@/configs/localstorage';
import { ETagType } from '@/pages/detail/modules/enterprise/overview/modules/qualityList/constant';
import { getDate } from '@/pages/detail/modules/enterprise/overview/modules/qualityList/utils';
import { formatNumber } from '@/utils/format';
import { initUniqueKeyMenu } from '@/utils/topicCommon';

import { establishDate, registerCapital, blackListRegisterCapital, registerStatus } from './const';

interface FilterConditionProps {
  type: string;
  onChange: any;
  onSearch: any;
  cref: any;
}

const registerCapitalConfig: Options = {
  title: '注册资本',
  option: {
    type: ScreenType.MULTIPLE,
    children: [...registerCapital],
  },
};

const blankRegisterCapitalConfig: Options = {
  title: '注册资本',
  option: {
    type: ScreenType.MULTIPLE,
    children: [...blackListRegisterCapital],
  },
};

const basePlanMenuConfig: Options[] = [
  {
    title: '登记状态',
    option: {
      type: ScreenType.MULTIPLE,
      hideSearch: true,
      children: [...registerStatus],
    },
  },
  {
    title: '成立日期',
    option: {
      type: ScreenType.MULTIPLE,
      hideSearch: true,
      // children: [...region],
      children: [
        ...establishDate,
        {
          name: '自定义日历',
          field: 'establishDate',
          value: null,
          render: (wrapper) => <RangePicker size="small" getPopupContainer={() => wrapper.current!} />,
        },
      ],
    },
  },
];

export const FilterCondition: React.FC<FilterConditionProps> = ({ type, onChange, onSearch, cref }) => {
  const screenConfig: Options[] = useMemo(() => {
    if (type === ETagType.BLACKLIST) {
      return [blankRegisterCapitalConfig, ...basePlanMenuConfig];
    }
    return [registerCapitalConfig, ...basePlanMenuConfig];
  }, [type]);
  const [menuConfig] = useState(initUniqueKeyMenu([...screenConfig]));

  const onScreenChange = useCallback(
    (current, allSelectedRows) => {
      const values: Record<string, any> = {};
      const registerCapital: string[] = [];
      const registerStatus: string[] = [];
      let establishDate = '';
      // 自定义format参数
      allSelectedRows.forEach(({ value, field, name }: { name: string; value: any; field: string }) => {
        if (field === 'registerCapital') {
          registerCapital.push(value);
        } else if (field === 'registerStatus') {
          registerStatus.push(value);
        } else if (field === 'establishDate') {
          const [beginDate, endDate] = getDate(name, value, 'YYYY-MM-DD');
          establishDate += `,(${beginDate || '*'},${endDate || '*'}]`;
        } else {
          values[field] = value;
        }
      });
      values.registerCapital = registerCapital.join(',');
      values.registerStatus = registerStatus.join(',');
      values.establishDate = establishDate.substring(1);
      onChange && onChange(current, values);
    },
    [onChange],
  );

  const onSearchChange = useCallback(
    (value) => {
      onSearch && onSearch(value);
    },
    [onSearch],
  );

  const onClear = useCallback(() => {
    cref.current = '';
    onSearchChange('');
  }, [cref, onSearchChange]);

  const onSearchValueChange = useCallback(
    (value) => {
      cref.current = value;
    },
    [cref],
  );

  return (
    <ScreenWrapper>
      <Screen options={menuConfig} onChange={onScreenChange}></Screen>
      <div className="top-search">
        <TopicSearch
          focusedWidth={224}
          cref={cref}
          placeholder="请输入公司名称"
          onSearch={onSearchChange}
          onClear={onClear}
          onChange={onSearchValueChange}
          style={undefined}
          dataKey={QUALITY_LIST_HISTORY_DETAIL}
        />
      </div>
    </ScreenWrapper>
  );
};

export const FilterSummary: React.FC<any> = ({ sum, code, tagCode, module_type, exportName, condition = {} }: any) => {
  return (
    <SummaryWrapper>
      <div className="count">
        共 <span className="nums">{formatNumber(sum, 0) || 0}</span> 条
      </div>
      <ExportDoc
        condition={{ ...condition, module_type, exportFlag: true, skip: 0, pageSize: 10000 }}
        filename={`${exportName}_榜单明细`}
      />
    </SummaryWrapper>
  );
};

export const ScreenWrapper = styled.div`
  display: flex;
  flex: auto;
  align-self: stretch;
  align-items: center;
  .top-search {
    margin-left: 14px;
    font-size: 12px;
  }
`;

export const SummaryWrapper = styled.div`
  display: flex;
  align-items: center;
  .count {
    margin-right: 24px;
    font-size: 13px;
    color: #8c8c8c;
  }
  .nums {
    color: #3e3e3e;
  }
`;
