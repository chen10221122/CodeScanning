import { memo, useRef, useMemo, useState } from 'react';

import { Empty, PaginationProps, Table, Spin } from '@dzh/components';
import { useMemoizedFn, useDebounceEffect } from 'ahooks';
import styled from 'styled-components';

import Chart from '@/pages/area/areaF9/modules/regionalLand/components/chart/chart';
import DescriptionIcon from '@/pages/area/areaF9/modules/regionalLand/components/descriptionIcon';
import DetailsModal from '@/pages/area/areaF9/modules/regionalLand/components/detailsModal';
import { StatisticsScopeType } from '@/pages/area/areaF9/modules/regionalLand/const';
import { useCtx } from '@/pages/area/areaF9/modules/regionalLand/modules/businessType/provider';
import { shortId, removeObjectNil } from '@/utils/share';

import useChart from './useChart';
import useColumns from './useColumns';
import useData from './useData';

import styles from '@/pages/area/areaF9/modules/regionalLand/modules/landTransfer/styles.module.less';
interface Props {
  areaCodeObj: { [x: string]: string | undefined };
  showLockLayer: boolean;
}

const CardTable = ({ areaCodeObj, showLockLayer }: Props) => {
  const {
    state: { total, dateFilter, currentPage, loading, otherFilter },
    update,
  } = useCtx();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [modalVisible, setModalVisible] = useState(false);
  /**弹窗的数据 */
  const [modalData, setModalData] = useState<any>();
  const DrawImgDomRef = useRef<HTMLDivElement>(null);

  const scrollTop = useMemoizedFn(() => {
    scrollRef.current?.scroll({ top: 0 });
  });
  const { dataSource, isFilterChange } = useData({
    scrollTop,
    areaCodeObj,
  });
  const date: string = Object.keys(dateFilter)[0] || 'transferDate';

  const columns = useColumns({
    setModalVisible,
    setModalData,
  });

  const modalPramas = removeObjectNil({
    [date]: `[${modalData?.detailDate}]`,
    ...areaCodeObj,
    statisticsScope: StatisticsScopeType.HAS_CHILDREN,
    enterpriseType: modalData?.enterpriseType,
    ...otherFilter,
  });

  const pagination: PaginationProps | false = useMemo(
    () =>
      !showLockLayer && total > 50
        ? {
            current: currentPage,
            total,
            pageSize: 50,
            size: 'small',
            showSizeChanger: false,
            onchange,
          }
        : false,
    [currentPage, showLockLayer, total],
  );
  const onTableChange = useMemoizedFn((pagination, _, sorter, { action }) => {
    if (action === 'paginate') {
      update((draft) => {
        draft.currentPage = pagination.current;
      });
    }
    if (action === 'sort') {
      const { field, order } = sorter;
      update((draft) => {
        draft.currentPage = 1;
        if (order) {
          draft.sortKey = field;
          draft.sortRule = order === 'ascend' ? 'asc' : 'desc';
        } else {
          draft.sortKey = '';
          draft.sortRule = '';
        }
      });
    }
  });
  const chartData = useChart({ dataSource });

  useDebounceEffect(
    () => {
      if (DrawImgDomRef.current && chartData) {
        let canvasList = DrawImgDomRef.current.querySelectorAll('canvas'),
          canvas = document.createElement('canvas'),
          ctx = canvas.getContext('2d');
        let height = 0,
          width = 0,
          len = canvasList.length;
        if (len) {
          const obj = getComputedStyle(canvasList[0]);

          height = parseInt(obj.height);
          width = parseInt(obj.width);
        }

        canvas.width = width + 20;
        canvas.height = height * len;

        if (ctx) {
          ctx.rect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = 'white';
          ctx.fill();

          canvasList.forEach((canvas, i) => {
            ctx && ctx.drawImage(canvas, 10, height * i, width, height);
          });
          update((draft) => {
            draft.fileBase64 = canvas.toDataURL('image/jpeg').replace('data:image/jpeg;base64,', '');
          });
        }
      }
    },
    [update, chartData],
    { wait: 100 },
  );

  const content = useMemo(
    () => (
      <>
        {dataSource.length ? (
          <div className={styles['social-finance-module-loading']}>
            <div className={styles['social-finance-chart-wrapper']} ref={DrawImgDomRef}>
              <Chart chartData={chartData} />
            </div>
            <div className="description-icon">
              <DescriptionIcon
                value={
                  '注：日期口径默认成交起始日，区域土地专题默认出让起始日。如需与区域土地专题对照数据，需统一日期口径。'
                }
              />
            </div>
            <div className={styles['social-finance-table-wrapper']}>
              <Table
                sticky={{
                  offsetHeader: 36,
                  getContainer: () => (document.getElementById('main-container') as HTMLDivElement) || document.body,
                }}
                pagination={pagination}
                loading={{ spinning: loading, type: 'square', translucent: true, keepCenter: true }}
                onlyBodyLoading
                scroll={{ x: '100%' }}
                onChange={onTableChange}
                columns={columns}
                dataSource={dataSource}
              />
            </div>
          </div>
        ) : (
          <Spin type="thunder" spinning={loading} className="empty-spin">
            <Empty
              type={isFilterChange ? Empty.NO_SCREEN_DATA : Empty.NO_DATA}
              onCleanClick={() => {
                if (isFilterChange) {
                  update((draft) => {
                    draft.screenKey = shortId();
                    draft.otherFilter = {};
                    draft.currentPage = 1;
                    draft.sortKey = '';
                    draft.sortRule = '';
                  });
                }
              }}
            />
          </Spin>
        )}
        {modalVisible ? (
          <DetailsModal
            show={modalVisible}
            modalPramas={modalPramas}
            otherData={modalData}
            setVisible={setModalVisible}
          />
        ) : null}
      </>
    ),
    [
      chartData,
      columns,
      dataSource,
      isFilterChange,
      loading,
      modalData,
      modalPramas,
      modalVisible,
      onTableChange,
      pagination,
      update,
    ],
  );
  return <Container>{content}</Container>;
};
export default memo(CardTable);

const Container = styled.div`
  .dzh-table-pagination {
    margin-top: 6px;
    margin-bottom: 0px;
  }
  margin-bottom: 12px;
  height: 100%;
  .ant-table-container {
    tr {
      .index-col {
        padding: 0px 8px !important;
      }
    }
  }
  .description-icon {
    margin: 0 0 6px 8px;
  }
`;
