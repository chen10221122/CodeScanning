import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { Switch, SwitchProps } from '@dzh/components';
import { useMemoizedFn } from 'ahooks';
import styled from 'styled-components';

import { useModal } from '@/app/components/modal/NoPayNotice';
import { Icon } from '@/components';
import { Tooltip } from '@/components/antd';
import { IRootState } from '@/store';

import exampleImg from '../example.png';
import style from '../style.module.less';

const iconStyle = { width: 12, height: 12, marginLeft: '4px', verticalAlign: '-2px' };
/** 溯源 */
interface IProps {
  defaultSource?: boolean;
  /** 置灰溯源按钮 */
  disabled?: boolean;
  /** 样例图片 */
  exampleImage?: string;
  /** switch尺寸 */
  switchSize?: SwitchProps['size'];
}
export default ({ defaultSource, disabled, exampleImage, switchSize }: IProps) => {
  const [modal, contetHolder] = useModal();
  const hasPay = useSelector((store: IRootState) => store.user.info).havePay;
  const [traceSource, setTraceSource] = useState(false);

  useEffect(() => {
    if (defaultSource) {
      setTraceSource(true);
    }
  }, [defaultSource]);

  /** 11418新增：溯源权限控制 */
  const handleTraceSource = useMemoizedFn((isTrace: boolean) => {
    if (hasPay) {
      setTraceSource(isTrace);
    } else {
      modal.open({
        permission: {
          exampleImageUrl: exampleImage || exampleImg,
        },
      });
    }
  });

  const tooltip = useMemo(
    () => (
      <Tooltip
        color="#fff"
        title={() => (
          <TooltipContent>
            财汇资讯新增数据溯源功能，便于用户快速查询指标数据来源。目前部分指标可溯源，更多指标溯源将陆续上线。
          </TooltipContent>
        )}
      >
        <img className="update-help-img" src={require('@/assets/images/common/help.png')} alt="" />
      </Tooltip>
    ),
    [],
  );

  const traceCref = useMemo(
    () => (
      <div className={style.trace}>
        <Switch size={switchSize || 'small'} checked={traceSource} disabled={disabled} onChange={handleTraceSource} />
        <span
          className="source-text"
          style={{
            color: disabled ? '#333' : '#141414',
            opacity: disabled ? 0.7 : 1,
          }}
        >
          溯源
        </span>
        {tooltip}
        <Icon style={iconStyle} image={require('@/assets/images/power/vip.png')} />
        {contetHolder}
      </div>
    ),
    [switchSize, traceSource, disabled, handleTraceSource, tooltip, contetHolder],
  );

  return { traceSource, traceCref, setTraceSource };
};

export const TooltipContent = styled.div`
  color: #434343;
  font-size: 12px;
  line-height: 20px;
  padding: 0 8px;
`;
