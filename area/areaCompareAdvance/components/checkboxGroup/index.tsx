import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { useMemoizedFn } from 'ahooks';
import cn from 'classnames';
import styled from 'styled-components';

import ErrorMessage, { TipType } from '@/components/advanceSearch/components/extraModal/errorMessage';
import Icon from '@/components/icon';
import Ellipsis from '@/components/textEllipsisUseTitle';

interface CheckboxOption {
  label: string;
  value: string | number;
  defaultChecked: boolean;
}

interface CheckboxGroupProps {
  options: CheckboxOption[];
  value?: Array<string | number>;
  onChange?: (value: Array<string | number>) => void;
  className?: string;
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ options, value = [], onChange, className }) => {
  const havePay = useSelector((store: any) => store.user.info).havePay || false;
  const [selectedValues, setSelectedValues] = useState<Array<string | number>>(value);

  const [errorMsgVisible, setErrorMsgVisible] = useState(false);

  const handleCheckboxChange = useMemoizedFn((optionValue: string | number, checked: boolean) => {
    let newSelectedValues: Array<string | number> = [];

    if (checked) {
      //添加选中项
      newSelectedValues = [...selectedValues, optionValue];
      if ((!havePay && newSelectedValues?.length > 8) || (havePay && newSelectedValues?.length > 100)) {
        setErrorMsgVisible(true);
        setTimeout(() => {
          setErrorMsgVisible(false);
        }, 1500);
        return;
      }
    } else {
      //移除取消选中项
      newSelectedValues = selectedValues.filter((value) => value !== optionValue);
    }

    setSelectedValues(newSelectedValues);

    onChange?.(newSelectedValues);
  });

  return (
    <AreaCompareCheckbox className={className}>
      <ErrorMessage
        visible={errorMsgVisible}
        style={{ width: '140px', marginTop: '-32px' }}
        type={TipType.error}
        content="已达权限上限！"
      />

      {options.map((option) => (
        <label
          key={option.value}
          className={cn('item_box', {
            checked: selectedValues.includes(option.value),
            defaultChecked: option.defaultChecked,
          })}
          onClick={() =>
            !option.defaultChecked && handleCheckboxChange(option.value, !selectedValues.includes(option.value))
          }
        >
          <Ellipsis text={option.label} hasHoverStyle={false} maxWidth={98} />
          <Icon
            image={require(option.defaultChecked
              ? '../../imgs/defaultChecked.png'
              : selectedValues.includes(option.value)
              ? '../../imgs/checked.png'
              : '../../imgs/unchecked.png')}
            size={12}
          />
        </label>
      ))}
    </AreaCompareCheckbox>
  );
};

export default CheckboxGroup;

const AreaCompareCheckbox = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;

  .item_box {
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 8px;
    width: 118px;
    height: 32px;
    font-size: 13px;
    font-weight: 400;
    color: #262626;
    border: 1px solid #efefef;
    border-radius: 2px;
    margin: 10px 10px 0 0;
    cursor: pointer;
  }

  .defaultChecked {
    border: 1px solid rgba(1, 113, 246, 0.24) !important;
  }
  .checked {
    border: 1px solid #0171f6;
  }
`;
