import { useEffect, useState } from 'react';

import { useMemoizedFn } from 'ahooks';
import { isUndefined } from 'lodash';

/**
 * 控制dropdown显示与隐藏
 * @param options dropdown的配置项
 */
export default function useVisible({
  dropdownVisible,
  onDropdownVisibleChange,
}: {
  dropdownVisible?: boolean;
  onDropdownVisibleChange?: (visible: boolean) => void;
}) {
  const [visible, setVisible] = useState(!!dropdownVisible);

  const changeVisible = useMemoizedFn((v: boolean) => {
    if (!isUndefined(dropdownVisible)) onDropdownVisibleChange?.(v);
    else setVisible(v);
  });

  useEffect(() => {
    if (!isUndefined(dropdownVisible)) setVisible(dropdownVisible);
  }, [changeVisible, dropdownVisible]);

  const hide = useMemoizedFn(() => changeVisible(false));

  return {
    visible,
    changeVisible,
    hide,
  };
}
