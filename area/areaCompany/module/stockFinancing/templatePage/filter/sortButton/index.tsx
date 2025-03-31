import { useState } from 'react';

import { Icon } from '@/components';
import { Button } from '@/components/antd';

import S from './style.module.less';

interface SwitchBtnProps {
  text?: string;
  onChange: (v: boolean) => void;
}
export default function SortButton({ text = '年度', onChange }: SwitchBtnProps) {
  const [order, setOrder] = useState(false);
  return (
    <Button
      size="small"
      className={S.buttonWrapper}
      onClick={(e: any) => {
        setOrder((o) => !o);
        onChange(!order);
      }}
    >
      {text}
      {order ? '正' : '倒'}序
      <Icon symbol={order ? 'iconzhengxu' : 'iconjiangxu'} />
    </Button>
  );
}
