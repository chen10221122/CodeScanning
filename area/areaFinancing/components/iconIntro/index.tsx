import { Popover } from 'antd';

import { Icon } from '@/components';

import S from './style.module.less';

export default function IconIntro({ content }: any) {
  return (
    <Popover
      trigger={'hover'}
      placement="bottom"
      arrowPointAtCenter
      overlayClassName={S.wrapper}
      content={<div>{content}</div>}
    >
      <div className={S.icon}>
        <Icon unicode="&#xe714;" size={13} width={14} height={14} />
      </div>
    </Popover>
  );
}
