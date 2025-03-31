import { useState, FC } from 'react';

import { useMemoizedFn } from 'ahooks';
import styled from 'styled-components';

import { Checkbox } from '@/components/antd';
import { Screen, ScreenType, Options } from '@/components/screen';

interface Props {
  onSelectCheckBoxChange: Function;
  /** 是否显示复选框 */
  disabled: boolean;
}

const calcMethodConfig: Options[] = [
  {
    title: '计算',
    option: {
      type: ScreenType.SINGLE,
      children: [
        { name: '显示最高项', value: 'max', active: true },
        { name: '显示最低项', value: 'min' },
      ],
      cancelable: false,
    },
  },
];

export const SingleSelectCheckbox: FC<Props> = ({ disabled, onSelectCheckBoxChange }) => {
  /** 单选选中内容 */
  const [selectValue, setSelectValue] = useState<string[]>([]);
  /** 复选框选中状态 */
  const [isCheck, setCheck] = useState<boolean>(false);

  const onChange = useMemoizedFn((e) => {
    const isChecked = e.target.checked;
    onSelectCheckBoxChange(isChecked ? [selectValue] : []);
    setCheck(isChecked);
  });

  const onCalcMethodChange = useMemoizedFn((selects) => {
    const selection = selects[0].value;
    setSelectValue([selection]);
    isCheck && onSelectCheckBoxChange([selection]);
  });
  return (
    <CheckboxStyle disabled={disabled} onChange={onChange}>
      <Screen options={calcMethodConfig} onChange={onCalcMethodChange} />
    </CheckboxStyle>
  );
};

const CheckboxStyle = styled(Checkbox)`
  .ant-checkbox {
    transform: scale(${12 / 16});
    transform-origin: left center;
    margin-left: 2px;
    overflow: hidden;

    &:after {
      display: none;
    }

    ~ span {
      font-size: 13px;
      color: #434343;
      padding-left: 5px;
    }

    &.ant-checkbox-disabled + span {
      color: #aaa;
    }
  }

  .ant-dropdown-trigger {
    font-size: 12px;
    font-weight: 400;
    color: #595959;
  }
`;
