import { useEffect, useMemo, useRef, useState } from 'react';

import { Modal, Table } from '@dzh/components';
import { useRequest } from 'ahooks';
import cn from 'classnames';
import dayjs from 'dayjs';
import styled from 'styled-components';

import { Spin } from '@/components/antd';
import ExportDoc from '@/components/exportDoc';
import Pagination from '@/components/Pagination';
// import { loadingTips } from '@/pages/area/areaF9/modules/regionalFinancialResources/common/style';
import useMemoizedFn from '@/pages/dataView/components/dzhTable/hooks/useMemoizedFn';
import { formatNumber } from '@/utils/format';
import { useImmer } from '@/utils/hooks';
import { CommonResponse } from '@/utils/utility-types';

import { useConditionCtx } from '../layout/context';
import S from './styles.module.less';

const sortMap = new Map<string, string>([
  ['ascend', 'asc'],
  ['descend', 'desc'],
]);

const TableNew = Table as any;

export default function DetailModal({ containerId }: { containerId?: string }) {
  const [tableInfo, setTableInfo] = useState<{ data: any[]; total: number; sortLoading?: boolean }>({
    data: [],
    total: 0,
    sortLoading: false,
  });
  const [firstLoading, setFirstLoading] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  // const [showScroll, setShowScroll] = useImmer(false);
  const [noPage, setNoPage] = useImmer(false);

  const {
    state: { visible, modalTitle, modalRequestParams, modalRequestApi, modalColumns, modalExport, sheetNames, area },
    update,
  } = useConditionCtx();

  const { run } = useRequest(modalRequestApi, {
    manual: true,
    onSuccess: (
      data: CommonResponse<{
        data: Record<string, string>[];
        total: number;
      }>,
    ) => {
      if (data.data) {
        setTableInfo({
          data: data.data.data.map((item: any, index) => ({ ...item, index: index + 1 + modalRequestParams.skip })),
          total: data.data.total,
          sortLoading: false,
        });
      }
      if (firstLoading) {
        setFirstLoading(false);
      }
    },
    onError: () => {
      setTableInfo({
        data: [],
        total: 0,
        sortLoading: false,
      });
    },
  });

  const handleChange = useMemoizedFn((pagination, filters, sorter, extra: { currentDataSource: []; action: any }) => {
    update((d) => {
      d.modalRequestParams.sort = sortMap.get(sorter.order) ? `${sorter.field}:${sortMap.get(sorter.order) || ''}` : '';
    });
    setTableInfo((d) => ({ ...d, sortLoading: true }));
  });

  const scrollTop = useMemoizedFn(() => {
    const scrollItem = document.getElementById('modal-scroll-item');
    if (scrollItem) {
      scrollItem.scrollIntoView();
    }
  });

  const handlePageChange = useMemoizedFn((cur) => {
    scrollTop();
    update((d) => {
      d.modalRequestParams.skip = (cur - 1) * 50;
    });
    setTableInfo((d) => ({ ...d, sortLoading: true }));
  });

  const exportName = useMemo(() => {
    return `${area ? `${area}-` : ''}${modalTitle}-${dayjs().format('YYYY.MM.DD')}`;
  }, [area, modalTitle]);

  const exportCondition = useMemo(
    () => ({
      module_type: modalExport,
      ...modalRequestParams,
      sheetNames: sheetNames,
    }),
    [modalExport, modalRequestParams, sheetNames],
  );

  useEffect(() => {
    if (visible && modalRequestParams) {
      run(modalRequestParams);
    }
  }, [modalRequestParams, visible, run]);

  // const resize = useCallback(() => {
  //   const wrapperH = ref?.current?.offsetHeight || 0;
  //   const contentH = (document.getElementsByClassName('areaFinanceModalTable')[0] as HTMLElement)?.offsetHeight || 0;
  //   const isShowScroll = wrapperH < contentH;
  //   setShowScroll(() => isShowScroll);
  // }, [setShowScroll]);

  // 判断页面是否出现滚动条
  useEffect(() => {
    // resize();
    // window.addEventListener('resize', resize);
    if (tableInfo.total <= 50) {
      setNoPage(() => true);
    } else {
      setNoPage(() => false);
    }

    // return () => window.removeEventListener('resize', resize);
  }, [firstLoading, setNoPage, tableInfo.sortLoading, tableInfo.total]);

  return (
    <>
      <ModalStyle
        style={{ top: 21 }}
        visible={visible}
        title={modalTitle}
        extra={
          <div className="headerRight">
            <div className="num">
              共 <span>{formatNumber(tableInfo.total, 0)}</span> 条
            </div>
            <div>
              <ExportDoc condition={exportCondition} filename={exportName} />
            </div>
          </div>
        }
        width={1000}
        footer={null}
        onCancel={() => {
          update((d) => {
            d.visible = false;
          });
          setFirstLoading(true);
          setTableInfo({
            total: 0,
            data: [],
          });
        }}
        destroyOnClose
        getContainer={() =>
          document.getElementById(`${containerId ? containerId : 'areaFinancingWrapper'}`) || document.body
        }
      >
        <div
          className={cn('content', { noPageHeight: noPage })}
          ref={ref}
          // style={{ paddingRight: showScroll ? 14 : 32 }}
        >
          <div id="modal-scroll-item"></div>
          {firstLoading ? (
            <SpinWrapper>
              <Spin spinning={firstLoading} type={'fullThunder'} tip="加载中" />
            </SpinWrapper>
          ) : (
            <TableNew
              className={cn(S.tableStyleWrapper, 'areaFinanceModalTable')}
              type={'stickyTable'}
              columnLayout="fixed"
              columns={modalColumns}
              dataSource={tableInfo.data}
              showSorterTooltip={false}
              scroll={{ x: 960 }}
              sticky={{
                offsetHeader: 0,
                getContainer: () => document.querySelector('.ant-modal-body>.dzh-modal-body-inner') || window,
              }}
              onChange={handleChange}
              pagination={false}
              onlyBodyLoading={tableInfo.sortLoading}
              loading={{
                spinning: !!tableInfo.sortLoading,
                translucent: true,
                type: 'square',
              }}
            />
          )}
        </div>
        <div className={cn({ pageWrap: tableInfo.sortLoading })}>
          <Pagination
            current={modalRequestParams?.skip / 50 + 1 || 1}
            pageSize={50}
            total={tableInfo.total}
            style={{ padding: '8px 32px 0px', position: 'relative', marginBottom: 0, justifyContent: 'flex-end' }}
            onChange={handlePageChange}
            align="right"
          />
        </div>
      </ModalStyle>
    </>
  );
}

const SpinWrapper = styled.div`
  /* 解决加载icon不居中 */
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .ant-spin-container {
    height: 100%;
  }
`;

const ModalStyle = styled(Modal.FullScreen)`
  .num {
    font-weight: 400;
    line-height: 20px;
    color: #8c8c8c;
    font-size: 12px;
    margin-right: 24px;
    span {
      color: #141414;
    }
  }
  .headerRight {
    display: flex;
    align-items: center;
  }
  .pageWrap {
    position: relative;
    &::before {
      content: ''; /* 伪元素的内容为空 */
      position: absolute; /* 使伪元素脱离文档流并相对于容器定位 */
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: #fff;
      opacity: 0.9;
      z-index: 1; /* 确保蒙层在内容之上 */
      pointer-events: none; /* 防止蒙层阻止用户与内容交互 */
    }
  }

  .dzh-table {
    .ant-table-thead > tr > th.textLeft {
      text-align: left !important;
      & .dzh-table-cell-ellipsis {
        padding-left: 10px;
      }
    }
  }
`;
