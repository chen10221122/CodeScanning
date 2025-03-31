import { useState, useMemo, FC } from 'react';

import { useMemoizedFn } from 'ahooks';

import Icon from '@/components/icon';
import { Screen, ScreenType } from '@/components/screen';

interface Props {
  areaData: any;
  replaceRef: any;
}

const ScreenItem: FC<Props> = ({ areaData, replaceRef }) => {
  const [dropdownVisible, setDropdownVisible] = useState([false]);

  const option = useMemo(
    () => [
      {
        title: '',
        option: {
          type: ScreenType.SINGLE_THIRD,
          children: areaData,
          isIncludingSameLevel: false,
          hideSearch: true,
          hasAreaSelectAll: false,
        },
        formatTitle: () => (
          <>
            <Icon image={require('../../imgs/replace.svg')} size={8} />
            <span className="replace-text">替换</span>
          </>
        ),
      },
    ],
    [areaData],
  );

  const onDropdownVisibleChange = useMemoizedFn((visible) => {
    setDropdownVisible([visible]);
  });

  return (
    <Screen
      options={option}
      dropdownVisible={dropdownVisible}
      onDropdownVisibleChange={onDropdownVisibleChange}
      onChange={() => {}}
      getPopContainer={() => replaceRef.current}
    />
  );
};

export default ScreenItem;
