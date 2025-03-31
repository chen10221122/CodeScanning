import { memo } from 'react';

import { Popover } from '@/components/antd';
import { Image } from '@/components/layout/index';

interface Props {
  logoutDate: string;
  revocationDate: string;
  targetSelector: string;
}

/** 黑名单登记状态旁边的提示窗，跟企业f9分支机构-企业状态提示窗一样 */
const StatusPopver = ({ logoutDate, revocationDate, targetSelector }: Props) => {
  return (
    <Popover
      placement="bottom"
      destroyTooltipOnHide={true}
      title=""
      content={
        <>
          {revocationDate ? <div className="item">吊销时间：{revocationDate}</div> : null}
          {logoutDate ? <div className="item">注销时间：{logoutDate}</div> : null}
        </>
      }
      // trigger="click"
      overlayClassName="lessee-popover-content"
      getPopupContainer={() => document.getElementById(targetSelector) || document.body}
    >
      <span className="arrow">
        <Image src={require('@/assets/images/detail/wenhao@2x.png')} width={12} height={12} style={{ marginTop: -2 }} />
      </span>
    </Popover>
  );
};

export default memo(StatusPopver);
