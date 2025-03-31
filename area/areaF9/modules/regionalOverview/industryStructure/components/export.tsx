import { memo } from 'react';

import dayjs from 'dayjs';
import styled from 'styled-components';

import { Checkbox } from '@/components/antd';
import ExportDoc from '@/components/exportDoc';
import { getLastYear } from '@/pages/area/areaF9/utils';

import { IndustryName } from '../industryStructure';

interface IProps {
  onChangeHidden: () => void;
  checked?: boolean;
  code: string;
  date: string;
  regionName: string;
  sortKeyMap: { [k: string]: string };
  traceCref: JSX.Element;
}
// 字符串末尾数字
const getNumber = (str?: string) => {
  const result = str && str.match(/\d+$/);
  return result ? result[0] : '';
};

const Export = ({ date, code, regionName, onChangeHidden, sortKeyMap, traceCref }: IProps) => {
  const indicName = Object.keys(IndustryName).join(',');
  let sortYear: string | number | undefined, sortRule: string | number | undefined;
  const sortKey = Object.keys(sortKeyMap)[0];
  const sortValue = sortKey && sortKeyMap[sortKey];
  if (sortValue) {
    sortYear = getNumber(Object.keys(sortKeyMap)[0]) === '0' ? date : getLastYear(date);
    sortRule = Object.values(sortKeyMap)[0] === 'ascend' ? 'asc' : 'desc';
  }

  return (
    <Wrap>
      <Checkbox onChange={onChangeHidden}>隐藏空行</Checkbox>
      {traceCref}
      {/* <SourceText placement={undefined} />
      <Switch size="small" onChange={onChange} /> */}
      <ExportDoc
        condition={{
          sortRule,
          sortYear,
          module_type: 'industry_structure',
          from: 0,
          keyword: '',
          size: 10000,
          sort: 'endDate:desc',
          indicName,
          endDate: `[${getLastYear(date)},${date}]`,
          regionCode: code,
          exportFlag: 'true',
        }}
        filename={`${regionName}产业结构${dayjs(new Date()).format('YYYYMMDD')}`}
      />
    </Wrap>
  );
};
export default memo(Export);
const Wrap = styled.div`
  display: flex;
  align-items: center;

  .ant-switch {
    margin-left: 9px;
    margin-top: -1px;
  }

  .ant-checkbox-wrapper {
    margin-top: -2px;
    // align-items: flex-start;
  }

  .ant-checkbox-inner {
    width: 12px;
    height: 12px;
  }

  .ant-checkbox {
    top: 2px;
    // margin-top: 2px;
  }

  .ant-checkbox + span {
    padding-left: 6px;
    padding-right: 24px;
    font-size: 12px;
    font-weight: 400;
    color: #434343;
  }

  .ant-switch-checked {
    margin-left: 0;
  }

  .export-xls-btn,
  .ant-switch {
    margin-left: 0 !important;
  }

  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: #0171f6;
    border-color: #0171f6;

    &::after {
      width: 4px;
      height: 6.5px;
      // margin-top: -0.4px;
    }
  }
`;
