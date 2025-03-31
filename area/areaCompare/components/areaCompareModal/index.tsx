import React, { useState } from 'react';

import cn from 'classnames';
import styled from 'styled-components';

import Icon from '@/components/icon';
import Ellipsis from '@/components/textEllipsisUseTitle';

interface CheckboxOption {
  label: string;
  value: string | number;
}

interface CheckboxGroupProps {
  options: CheckboxOption[];
  value?: Array<string | number>;
  onChange?: (value: Array<string | number>) => void;
  className?: string;
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ options, value = [], onChange, className }) => {
  const [selectedValues, setSelectedValues] = useState<Array<string | number>>(value);

  const handleCheckboxChange = (optionValue: string | number, checked: boolean) => {
    let newSelectedValues: Array<string | number> = [];

    if (checked) {
      //添加选中项
      newSelectedValues = [...selectedValues, optionValue];
    } else {
      //移除取消选中项
      newSelectedValues = selectedValues.filter((value) => value !== optionValue);
    }
    setSelectedValues(newSelectedValues);

    if (onChange) {
      onChange(newSelectedValues);
    }
  };

  return (
    <AreaCompareCheckbox className={className}>
      {options.map((option) => (
        <label
          key={option.value}
          className={cn('item_box', { checked: selectedValues.includes(option.value) })}
          onClick={() => handleCheckboxChange(option.value, !selectedValues.includes(option.value))}
        >
          <Ellipsis text={option.label} hasHoverStyle={false} maxWidth={98} />
          <Icon
            image={require(selectedValues.includes(option.value)
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
    box-shadow: 0px 2px 9px 2px rgba(0, 0, 0, 0.09);
    margin: 10px 10px 0 0;
  }

  .checked {
    border: 1px solid rgba(1, 113, 246, 0.24);
  }
`;
