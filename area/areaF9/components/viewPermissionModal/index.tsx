import { PropsWithChildren, memo, useMemo, useRef } from 'react';
import { useHistory } from 'react-router-dom';

import { ProModalPermission } from '@dzh/pro-components';
import { useBoolean } from 'ahooks';

import { LINK_AUTHORITY_DETAIL } from '@/configs/routerMap';

import { useSelector } from '../../context';
import stl from './style.module.less';

const ViewPermissionModal = ({ children }: PropsWithChildren<{}>) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { viewPowerTip, viewTimesOver, outIn } = useSelector((store) => store);

  const { push } = useHistory();

  const [visible] = useBoolean(true);

  const modalConf = useMemo(
    () => ({
      visible,
      subtitle: viewPowerTip,
      mask: false,
      keyboard: false,
      centered: false,
      closable: false,
      wrapClassName: stl.modalWrapCls,
      getContainer: () => containerRef.current!,
      onDetailsClick: () => push(LINK_AUTHORITY_DETAIL),
    }),
    [push, viewPowerTip, visible],
  );

  if (!viewTimesOver && !outIn) return <>{children}</>;

  return (
    <div className={stl.container} ref={containerRef}>
      <div className={stl.blurWrap}></div>
      <ProModalPermission type="default" {...modalConf} />
    </div>
  );
};

export default memo(ViewPermissionModal);
