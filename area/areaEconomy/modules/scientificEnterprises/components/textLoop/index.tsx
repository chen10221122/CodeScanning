import { Fragment, useState } from 'react';
import TextLoop from 'react-text-loop';

import { useMemoizedFn } from 'ahooks';
import { isEmpty } from 'lodash';

import { Flex } from '@/components/layout';

import { useLoopData } from '../../hooks/useGetLoopList';
import { DetialModal } from '../detialModal';
import styles from './style.module.less';

const INTERVAL = 3_000;
const CLEAR_TIME = 0;

export const Loop = () => {
  /** loop interval state*/
  const [interval, changeInterval] = useState(INTERVAL);
  /** 当前点击 */
  const [tagCode, setTagCode] = useState<string>();
  /** get data */
  const { loading, data } = useLoopData();

  const [visible, setVisible] = useState(false);

  const openModal = useMemoizedFn((newRow) => {
    setTagCode(newRow);
    setVisible(true);
  });

  return (
    <>
      <div className={styles.container} id={'tech_enterprise_common_header_loop_text'}>
        {!loading && !isEmpty(data) ? (
          <Fragment>
            <span className={styles.iconBox}>
              <span className={styles['icon']} />
              <span className={styles['iconDiscription']}>新增榜单</span>
              <span className={styles['line']}></span>
            </span>
            <div className={styles['loopArea']}>
              <TextLoop interval={interval}>
                {data.map((newRow: any, index: number) => (
                  <Flex
                    align="center"
                    key={index}
                    className={styles.newsItem}
                    onMouseEnter={() => changeInterval(CLEAR_TIME)}
                    onMouseLeave={() => changeInterval(INTERVAL)}
                    onClick={() => void openModal(newRow)}
                  >
                    <span className={styles.relativeName}>{newRow.title ?? '-'}</span>
                    <span className={styles.relativeTime}>{newRow.declareDate ?? '-'}</span>
                  </Flex>
                ))}
              </TextLoop>
            </div>
          </Fragment>
        ) : null}
        <DetialModal
          visible={visible}
          setVisible={setVisible}
          mountedId={`tech_enterprise_common_header_loop_text`}
          currentInfo={tagCode}
        />
      </div>
    </>
  );
};
