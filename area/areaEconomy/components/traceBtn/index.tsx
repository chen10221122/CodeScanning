import { memo, FC } from 'react';

import dayjs from 'dayjs';
import styled from 'styled-components';

import { Switch, Checkbox } from '@/components/antd';
import ExportDoc from '@/components/exportDoc';

import MoreBtn from './moreBtn';
import SourceText from './sourceText';
type Props = {
  title: any;
  code: any;
  year: any;
  checked: any;
  onChange: any;
  placement: string;
  hideExport: boolean;
  isHiddenColumn?: boolean;
  hiddenChecked?: boolean;
  onChangeHidden?: () => void;
  showMoreBtn?: boolean;
  linkTo?: any;
};

const TraceBtn: FC<Props> = ({
  title,
  code,
  year,
  checked,
  onChange,
  placement,
  hideExport,
  showMoreBtn,
  linkTo,
  isHiddenColumn,
  hiddenChecked,
  onChangeHidden,
}) => {
  return (
    <Wrap>
      {isHiddenColumn ? (
        <Checkbox checked={hiddenChecked} onChange={onChangeHidden}>
          隐藏空行
        </Checkbox>
      ) : null}
      <SourceText placement={placement} />
      <Switch size="small" checked={checked} onChange={onChange} />
      {hideExport ? null : title === '区域经济' ? (
        <ExportDoc
          condition={{
            code,
            year: '5',
            module_type: 'web_pro_area_economy',
          }}
          filename={`区域经济速览${dayjs(new Date()).format('YYYYMMDD')}`}
          style={{
            marginLeft: '24px',
          }}
        />
      ) : (
        <ExportDoc
          condition={{
            code,
            module_type: 'web_fregional_economy',
            date: String(year),
          }}
          filename={`辖区经济${dayjs(new Date()).format('YYYYMMDD')}`}
          style={{
            marginLeft: '24px',
          }}
        />
      )}
      {showMoreBtn && (
        <MoreBtn
          linkTo={linkTo}
          style={{
            marginLeft: '24px',
          }}
        />
      )}
    </Wrap>
  );
};
export default memo(TraceBtn);
const Wrap = styled.div`
  display: flex;
  align-items: center;
  .ant-switch {
    margin-top: -3px;
  }
  .ant-checkbox-wrapper {
    align-items: flex-start;
  }
  .ant-checkbox-inner {
    width: 12px;
    height: 12px;
  }
  .ant-checkbox {
    margin-top: 2px;
  }
  .ant-checkbox + span {
    padding-left: 6px;
    padding-right: 24px;
    color: #434343;
  }
  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: #0171f6;
    border-color: #0171f6;
    &::after {
      width: 4px;
      height: 6.5px;
      margin-top: -0.4px;
    }
  }
`;
