import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { Switch } from '@dzh/components';
import { useMemoizedFn } from 'ahooks';
import styled from 'styled-components';

import { useModal } from '@/app/components/modal/NoPayNotice';
import { Icon } from '@/components';
import { Tooltip, Checkbox } from '@/components/antd';
import exampleImg from '@/pages/area/monthlyEconomy/components/updateTip/example.png';
import { IRootState } from '@/store';

import style from '../style.module.less';

const iconStyle = { width: 12, height: 12, marginLeft: '4px', verticalAlign: '-2px' };
/** 溯源 */
interface IProps {
  defaultSource?: boolean;
  /** 置灰溯源按钮 */
  disabled?: boolean;
  /** 样例图片 */
  exampleImage?: string;
  /**主页面 */
  isMainPage?: boolean;
}
export default ({ defaultSource, disabled, exampleImage, isMainPage }: IProps) => {
  const [modal, contetHolder] = useModal();
  const hasPay = useSelector((store: IRootState) => store.user.info).havePay;
  const [traceSource, setTraceSource] = useState(false);
  const [hiddenEmptyCols, setHiddenEmptyCols] = useState(true);

  useEffect(() => {
    if (defaultSource !== undefined) {
      setTraceSource(defaultSource);
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

  /** 隐藏空列 */
  const handleChangeColsHidden = useMemoizedFn(() => {
    setHiddenEmptyCols((base) => !base);
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
      <>
        {isMainPage ? (
          <CheckBoxWrap>
            <Checkbox checked={hiddenEmptyCols} onChange={handleChangeColsHidden}>
              隐藏空列
            </Checkbox>
          </CheckBoxWrap>
        ) : null}
        <div className={style.trace}>
          <Switch size="22" checked={traceSource} disabled={disabled} onChange={handleTraceSource} />
          <span
            className="source-text"
            style={{
              color: disabled ? '#333' : '#262626',
              opacity: disabled ? 0.7 : 1,
              marginLeft: 4,
            }}
          >
            溯源
          </span>
          {tooltip}
          <Icon style={iconStyle} image={require('@/assets/images/power/vip.png')} />
          {contetHolder}
        </div>
      </>
    ),
    [
      handleTraceSource,
      contetHolder,
      traceSource,
      tooltip,
      disabled,
      isMainPage,
      hiddenEmptyCols,
      handleChangeColsHidden,
    ],
  );

  return { traceSource, traceCref, setTraceSource, hiddenEmptyCols };
};

const CheckBoxWrap = styled.div`
  .ant-checkbox-wrapper {
    margin-top: -2px;
    margin-left: 0px;
  }
  .ant-checkbox-inner {
    width: 13px;
    height: 13px;
  }
  .ant-checkbox {
    top: 2px;
  }
  .ant-checkbox + span {
    padding-left: 6px;
    padding-right: 0;
    font-size: 13px;
    font-weight: 400;
    color: #262626;
  }
  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: #0171f6;
    border-color: #0171f6;
    &::after {
      width: 4px;
      height: 6.5px;
      top: 49%;
    }
  }
`;

export const TooltipContent = styled.div`
  color: #434343;
  font-size: 12px;
  line-height: 20px;
  padding: 0 8px;
`;
