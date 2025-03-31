import { FC, memo } from 'react';

import { Modal } from '@dzh/components';
import { ExportDoc } from '@dzh/pro-components';
import dayjs from 'dayjs';

import LandDetail from '@pages/area/areaF9/modules/regionalLand/components/detailsModal/landDetail';
import { Provider } from '@pages/area/areaF9/modules/regionalLand/components/detailsModal/provider';

import { useCtx } from '@/pages/area/areaF9/modules/regionalLand/modules/landTransfer/provider';

import styles from '@/pages/area/areaF9/modules/regionalLand/components/detailsModal/style.module.less';

const DetailsModal: FC<any> = ({ show, modalPramas, setVisible, otherData }) => {
  const {
    state: { conditionDetails },
  } = useCtx();
  return (
    <ExportDoc.Provider>
      <Modal.FullScreen
        width={1000}
        title={
          <span>
            {otherData?.titleYear
              ? /^\d{4}$/.test(otherData.titleYear)
                ? `${otherData.titleYear}年`
                : /^\d{4}-\d{2}$/.test(otherData.titleYear)
                ? `${otherData.titleYear.replace('-', '年')}月`
                : otherData.titleYear
              : '-'}
            招拍挂土地明细
          </span>
        }
        visible={show}
        onCancel={() => setVisible(false)}
        getContainer={document.querySelector('.main-container') as HTMLElement}
        extra={
          <div className={styles['right-title']}>
            <div className={styles['right-title-content']}>
              <span>{`${otherData?.countName}`}</span>
              <span className={styles['right-title-content-count']}>{`${otherData?.total}` || '-'}</span>
            </div>
            <ExportDoc
              condition={conditionDetails}
              getContainer={(document.getElementById('main-container') as HTMLDivElement) || window}
              filename={`招拍挂_土地出让明细_${dayjs().format('YYYYMMDD')}`}
            />
          </div>
        }
      >
        <Provider>
          <LandDetail modalPramas={modalPramas} />
        </Provider>
      </Modal.FullScreen>
    </ExportDoc.Provider>
  );
};

export default memo(DetailsModal);
