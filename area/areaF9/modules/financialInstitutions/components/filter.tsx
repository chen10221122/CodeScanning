import { memo, useCallback, useMemo, useRef } from 'react';

import styled from 'styled-components';

import { Options, Screen } from '@/components/screen';
import TopicSearch from '@/components/topicSearch';
import { groupBy, keyMap } from '@/pages/full/financingInstitution/utils';
import { shortId } from '@/utils/share';

import config from '../config/filterConfig';

interface IProps {
  onChange: (params: any) => void;
  currTabkey: string;
}

const Filter = ({ onChange, currTabkey }: IProps) => {
  const keywordRef = useRef('');
  const searchRef = useRef();
  const conditionRef = useRef<{ [key: string]: any }>({});
  // 通知父组件筛选条件变化
  const handleChange = useCallback(() => {
    onChange && onChange({ ...conditionRef.current, keyword: keywordRef.current });
  }, [onChange]);
  // 筛选项改变时触发
  const handleChangeMenu = useCallback(
    (v1, v2) => {
      let keyValueObj = keyMap(groupBy(v2, 'key'));
      conditionRef.current = keyValueObj;
      handleChange();
    },
    [handleChange],
  );

  const handleSearch = useCallback(
    (value) => {
      keywordRef.current = value;
      handleChange();
    },
    [handleChange],
  );
  const menuConfig = useMemo(() => {
    return config[currTabkey] ? config[currTabkey] : [];
  }, [currTabkey]) as Options[];

  const handleClear = useCallback(() => {
    keywordRef.current = '';
    handleSearch('');
  }, [handleSearch]);

  const handleChangeValue = useCallback((value: any) => (keywordRef.current = value), []);

  return (
    <Content className="filter">
      <Screen key={shortId()} options={menuConfig} onChange={handleChangeMenu} />
      <TopicSearch
        cref={searchRef}
        placeholder="请输入公司名称..."
        onClear={handleClear}
        onChange={handleChangeValue}
        onSearch={handleSearch}
        dataKey="name"
        style={undefined}
      />
    </Content>
  );
};

export default memo(Filter);

const Content = styled.div`
  display: flex;
  align-items: center;
  padding-right: 8px;
  height: 22px;
  .screen-wrapper {
    margin-right: 12px;
  }
`;
