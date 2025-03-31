import { memo, FC } from 'react';

import dayjs from 'dayjs';
import styled from 'styled-components';

import { Switch, Checkbox } from '@/components/antd';
import ExportDoc from '@/components/exportDoc';
import SourceText from '@/pages/area/areaF9/components/traceBtn/sourceText';

type Props = {
  code: any;
  checked: any;
  onChange: any;
  placement: string;
  hiddenChecked?: boolean;
  hiddenEmptyCols?: boolean;
  handleChangeColsHidden?: () => void;
  onChangeHidden?: () => void;
  updateTip?: React.ReactDOM;
  exportCondition?: Record<string, any>;
  exportDisabled?: boolean;
  filename?: string;
  onlyQuarter?: {
    default: boolean;
    currentVal: boolean;
    onChange: (x: Record<string, any>) => void;
  };
};

const TraceBtn: FC<Props> = ({
  code,
  checked,
  onChange,
  placement,
  hiddenChecked,
  onChangeHidden,
  updateTip,
  exportCondition,
  exportDisabled,
  filename,
  hiddenEmptyCols,
  handleChangeColsHidden,
  onlyQuarter,
}) => {
  return (
    <Wrap isupdateTip={!!updateTip}>
      {onlyQuarter ? (
        <Checkbox
          defaultChecked={onlyQuarter?.default}
          value={onlyQuarter?.currentVal}
          onChange={onlyQuarter?.onChange}
        >
          只看季度
        </Checkbox>
      ) : null}
      <Checkbox checked={hiddenEmptyCols} onChange={handleChangeColsHidden}>
        隐藏空列
      </Checkbox>

      <Checkbox checked={hiddenChecked} onChange={onChangeHidden}>
        隐藏空行
      </Checkbox>

      {updateTip ? (
        updateTip
      ) : (
        <>
          <SourceText placement={placement} />
          <Switch size="small" checked={checked} onChange={onChange} />
        </>
      )}
      <ExportDoc
        condition={
          exportCondition ?? {
            code,
            year: '5',
            module_type: 'web_pro_area_economy',
          }
        }
        filename={filename ?? `区域经济速览${dayjs(new Date()).format('YYYYMMDD')}`}
        disabled={exportDisabled ?? true}
        style={{
          marginLeft: updateTip ? '0' : '24px',
        }}
      />
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
    margin-left: 0px;
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
