import { ReactNode } from 'react';

import dayJs from 'dayjs';

import { DetailModalProps } from '@dataView/DataView/SheetView/TableView/extras/issuer/modals/type';

import { Modal } from '@/components/antd';
import ExportDoc from '@/components/exportDoc';

import style from './styles.module.less';

export default function BigModal({
  children,
  title,
  count,
  onClose,
  visible,
  params,
  getContainer,
}: DetailModalProps & { children?: ReactNode; count: number }) {
  return (
    <Modal
      type="maskScroll"
      title={
        <div className={style.modalTitleWrapper}>
          <div className={style.title}>{title}</div>
          <div className={style.exportWrapper}>
            <div className={style.countWrapper}>
              共<span className={style.count}>{count}</span>条
            </div>
            <ExportDoc condition={params} filename={`${title}${dayJs().format('YYYYMMDD')}`} />
          </div>
        </div>
      }
      visible={visible}
      onCancel={onClose}
      wrapClassName={style.modalWrapper}
      destroyOnClose={true}
      footer={null}
      width={1000}
      centered={false}
      bodyStyle={{ padding: '0 0 24px', position: 'relative' }}
      getContainer={getContainer}
      maskStyle={{
        zIndex: 18,
        background: 'rgba(0,0,0,.34)',
      }}
    >
      {children}
    </Modal>
  );
}
