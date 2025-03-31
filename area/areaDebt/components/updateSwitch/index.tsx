import { memo, FC, useMemo, useRef } from 'react';

import { Switch } from '@dzh/components';
import styled from 'styled-components';

import { Screen, ScreenType, Options, RowItem } from '@/components/screen';
import arrowIcon from '@/pages/area/areaDebt/images/icon_arrow.svg';

interface IProps {
  /** key值 */
  screenKey: string;
  /** 按钮开关 */
  openUpdate: boolean;
  /** 点击按钮 */
  onSwitchChange: (check: any) => void;
  /** 时间筛选 */
  onRangeChange: (current: RowItem[], allSelectedRows: RowItem[], index: number) => void;
}

const UpdateSwitch: FC<IProps> = (props) => {
  const { screenKey, openUpdate, onSwitchChange, onRangeChange } = props;

  const filterRef = useRef<HTMLDivElement | null>(null);

  const dateConfig: Options[] = useMemo(() => {
    let option = [
      { name: '近一周', value: 7, key: 'days' },
      { name: '近一月', value: 30, key: 'days' },
    ];
    return [
      {
        title: '',
        option: {
          type: ScreenType.SINGLE,
          children: option,
          default: option[1],
          cancelable: false,
        },
      },
    ];
  }, []);

  return (
    <UpdateSwitchWrapper ref={filterRef}>
      <Switch size={`small`} onChange={onSwitchChange} defaultChecked />
      <span className="update-text">更新提示</span>
      <div className="update-screen">
        {openUpdate ? (
          <Screen
            key={screenKey}
            options={dateConfig}
            onChange={onRangeChange}
            getPopContainer={() => filterRef.current || document.body}
          />
        ) : (
          <div className="last-week">近一月</div>
        )}
      </div>
    </UpdateSwitchWrapper>
  );
};

export default memo(UpdateSwitch);

const UpdateSwitchWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-right: 24px;
  .update-text {
    margin-right: 8px;
    color: #262626;
  }
  .last-week {
    width: 50px;
    height: 20px;
    line-height: 20px;
    font-size: 13px;
    color: #8c8c8c;
    position: relative;
    &::after {
      content: '';
      position: absolute;
      top: 5px;
      right: 0;
      width: 8px;
      height: 8px;
      background: url(${arrowIcon}) no-repeat center;
      background-size: contain;
    }
  }
`;
