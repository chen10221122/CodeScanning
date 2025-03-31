/**
 * 添加自选
 */
import { FC } from 'react';

import { useBoolean, useMemoizedFn } from 'ahooks';
import styled from 'styled-components';

import { getConfig } from '@/app';
import AddCombinationItemDialog from '@/components/dialog/combination/addItemDialog';
import { useCtx } from '@/pages/area/areaEconomy/modules/blackList/context';

export interface ItemProps {
  code: string;
  name: string;
  type: 'company';
}

interface AddCombinationProps {
  item: ItemProps[];
  hasSelected?: boolean;
  getContainer?: Function;
}

const AddCombination: FC<AddCombinationProps> = ({ hasSelected, item, getContainer }) => {
  const [visible, { setTrue: setVisibleTrue, setFalse: setVisibleFalse }] = useBoolean(false);

  const {
    state: { refresh },
  } = useCtx();

  const close = useMemoizedFn((res) => {
    setVisibleFalse();
    // 直接刷新会有问题，需要AddCombinationItemDialog内部抛出状态
    // 最好的情况是所有弹窗关闭之后再刷新
    res && refresh && refresh();
  });

  return !getConfig((d) => d.commons.hideOptionalButton) ? (
    <AddCombinationContainer hasSelected={hasSelected}>
      <AddCombinationItemDialog
        getContainer={getContainer}
        visible={visible}
        close={close}
        // allClose={handleResult}
        item={item}
      >
        <span className="pick-text" onClick={() => (hasSelected ? setVisibleTrue() : null)}>
          添加监控
        </span>
      </AddCombinationItemDialog>
    </AddCombinationContainer>
  ) : (
    <></>
  );
};

export default AddCombination;

const AddCombinationContainer = styled.div<{ hasSelected?: boolean }>`
  margin: 0 24px 0 14px;
  .pick-text {
    font-size: 13px;
    font-weight: 400;
    text-align: left;
    color: ${({ hasSelected }) => (hasSelected ? '#333333' : '#bfbfbf')};
    cursor: ${({ hasSelected }) => (hasSelected ? 'pointer' : 'no-drop')};
    line-height: 20px;
    position: relative;
    &::before {
      content: '';
      position: absolute;
      top: 2px;
      left: -14px;
      display: inline-block;
      width: 10px;
      height: 10px;
      background: ${({ hasSelected }) =>
        hasSelected
          ? `url(${require('@/pages/area/areaEconomy/modules/blackList/images/selectAdd.svg')}) no-repeat center`
          : `url(${require('@/pages/area/areaEconomy/modules/blackList/images/defaultAdd.svg')}) no-repeat center`};
      background-size: 14px 14px;
    }
  }
`;
