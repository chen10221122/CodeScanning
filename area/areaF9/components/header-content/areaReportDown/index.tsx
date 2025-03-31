import { ReactNode, FC, memo, useRef } from 'react';

import { useMemoizedFn } from 'ahooks';

import TipDialog from '@pages/area/areaF9/components/header-content/areaReportDown/tipDialog';
import useDownload from '@pages/area/areaF9/components/header-content/areaReportDown/useDownLoad';

import { shortId } from '@/utils/share';

interface Props {
  code: string;
  children: ReactNode;
  className?: string;
}

const AreaReportDown: FC<Props> = ({ code, children, className }) => {
  const { onDownClick, noPayDialogVisible, limitDialogVisible, setNoPayDialogVisible, setLimitDialogVisible } =
    useDownload();

  const downIdRef = useRef(shortId());

  const onDown = useMemoizedFn(() => onDownClick(code, downIdRef.current));

  return (
    <>
      <div onClick={onDown} className={className}>
        {children}
      </div>
      <TipDialog
        noPayDialogVisible={noPayDialogVisible}
        limitDialogVisible={limitDialogVisible}
        setNoPayDialogVisible={setNoPayDialogVisible}
        setLimitDialogVisible={setLimitDialogVisible}
      />
    </>
  );
};
export default memo(AreaReportDown);
