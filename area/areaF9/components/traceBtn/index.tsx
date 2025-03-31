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
  updateTip?: React.ReactDOM;
  exportCondition?: Record<string, any>;
  exportDisabled?: boolean;
  filename?: string;
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
  updateTip,
  exportCondition,
  exportDisabled,
  filename,
}) => {
  return (
    <Wrap isupdateTip={!!updateTip}>
      {isHiddenColumn ? (
        <Checkbox checked={hiddenChecked} onChange={onChangeHidden}>
          隐藏空行
        </Checkbox>
      ) : null}
      {updateTip ? (
        updateTip
      ) : (
        <>
          <SourceText placement={placement} />
          <Switch size="small" checked={checked} onChange={onChange} />
        </>
      )}
      {hideExport ? null : title === '区域经济' ? (
        <ExportDoc
          condition={
            exportCondition ?? {
              code,
              year: '5',
              module_type: 'web_pro_area_economy',
            }
          }
          usePost={true}
          filename={filename ?? `区域经济速览${dayjs(new Date()).format('YYYYMMDD')}`}
          disabled={exportDisabled ?? true}
          style={{
            marginLeft: updateTip ? '0' : '24px',
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
            marginLeft: updateTip ? '0' : '24px',
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
const Wrap = styled.div<{ isupdateTip: boolean }>`
  display: flex;
  align-items: center;
  .ant-switch {
    margin-left: ${({ isupdateTip }) => (isupdateTip ? 0 : 9)}px;
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
