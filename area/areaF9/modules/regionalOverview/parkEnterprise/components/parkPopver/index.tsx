import { memo, useState } from 'react';

import { useMemoizedFn } from 'ahooks';

import { Popover } from '@/components/antd';
import { Image } from '@/components/layout/index';
import type { TableData } from '@/pages/area/areaF9/modules/regionalOverview/industrialPark/modules/modal/type';

import styles from './style.module.less';

interface Props {
  row: TableData;
  targetSelector: string;
}

const ParkPopver = ({ row, targetSelector }: Props) => {
  const [showLesseePopover, setShowLesseePopover] = useState(false);
  const handleVisibleChange = useMemoizedFn((visible: boolean) => {
    setShowLesseePopover(visible);
  });
  return (
    <Popover
      placement="bottom"
      destroyTooltipOnHide={true}
      title={null}
      content={
        <>
          <div>{`${row.industryLevel1}${row.industryLevel2 ? '>' + row.industryLevel2 : ''}${
            row.industryLevel3 ? '>' + row.industryLevel3 : ''
          }${row.industryLevel4 ? '>' + row.industryLevel4 : ''}`}</div>
        </>
      }
      // trigger="click"
      overlayClassName={styles['parkPopover']}
      onVisibleChange={handleVisibleChange}
      getPopupContainer={() => document.getElementById(targetSelector) || document.body}
    >
      <span className="arrow">
        {showLesseePopover ? (
          <Image
            src={require('@/assets/images/finance/ico_gengduo_hover@2x.png')}
            width={12}
            height={12}
            style={{ marginTop: -2, cursor: 'pointer' }}
          />
        ) : (
          <Image
            src={require('@/assets/images/finance/ico_gengduo@2x.png')}
            width={12}
            height={12}
            style={{ marginTop: -2, cursor: 'pointer' }}
          />
        )}
      </span>
    </Popover>
  );
};

export default memo(ParkPopver);
