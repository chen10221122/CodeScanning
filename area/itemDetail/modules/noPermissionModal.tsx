import { FC, memo } from 'react';

import { ProModalPermission } from '@dzh/pro-components';
import { useMemoizedFn } from 'ahooks';

import sampleImg from '../images/noPermissionSample.png';

interface NoPermissionModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  subtitle?: string;
}
const NoPermissionModal: FC<NoPermissionModalProps> = ({ visible, setVisible, subtitle }) => {
  const onCancel = useMemoizedFn(() => {
    setVisible(false);
  });
  return (
    <ProModalPermission
      getContainer={false}
      visible={visible}
      onCancel={onCancel}
      type="sample"
      subtitle={subtitle || '暂不支持查看信披文件，成为正式用户即可无限次查看'}
      sampleImage={sampleImg}
    />
  );
};

export default memo(NoPermissionModal);
