import { memo, FC, useEffect } from 'react';

import { Modal } from 'antd';

import { Icon } from '@/components';

type PropType = {
  container: HTMLElement;
  show: boolean;
  closeDialog: (a: boolean) => void;
  submit: () => void;
};

const SaveDialog: FC<PropType> = ({ submit, container, show, closeDialog }) => {
  useEffect(() => {
    if (show) {
      Modal.confirm({
        title: '确认要保存为“我的指标”吗？',
        icon: <Icon symbol={`iconClose-Circle-Fill2x`} />,
        content: '点击“确定”保存至“我的指标”，实现自定义指标的一键筛选！',
        okText: '确定',
        width: 438,
        zIndex: 1051,
        centered: true,
        className: 'app-confirm-dialog',
        cancelText: '取消',
        getContainer: () => container,
        onOk(close) {
          submit();
          close();
          closeDialog(false);
        },
        onCancel: (close) => {
          closeDialog(true);
          close();
        },
      });
    }
  }, [show, container, submit, closeDialog]);

  return null;
};

export default memo(SaveDialog);
