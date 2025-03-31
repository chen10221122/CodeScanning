import { useEffect, useMemo, useRef, useState } from 'react';

import { Table, Spin as DzhSpin, Modal } from '@dzh/components';
import Screen, { Options, ScreenType } from '@dzh/screen';
import { useRequest } from 'ahooks';
import cn from 'classnames';
import dayjs from 'dayjs';
import styled, { createGlobalStyle } from 'styled-components';

import { Spin } from '@/components/antd';
import ExportDoc from '@/components/exportDoc';
import Pagination from '@/components/Pagination';
import TopicSearch from '@/components/topicSearch';
import { AREA_BANK_TYPE } from '@/configs/localstorage';
import { useSelector } from '@/pages/area/areaF9/context';
import { TableWrapper, HeaderModalWrapper } from '@/pages/area/areaF9/modules/regionalFinancialResources/common/style';
import useMemoizedFn from '@/pages/dataView/components/dzhTable/hooks/useMemoizedFn';
import { formatNumber } from '@/utils/format';
import { CommonResponse } from '@/utils/utility-types';

import { getDistributionModal } from '../api';
import { useCtx } from '../context';
import S from './styles.module.less';

interface Props {
  columns: any[];
}

const list =
  '20-政策性银行，10-国有银行，30-股份制银行，40-城商行，51-农商行，52-农村信用社，61-村镇银行，80-民营银行，70-外资银行，53-农村合作银行，62-资金互助社'
    .split('，')
    .map((o) => ({ name: o.split('-')[1], value: o.split('-')[0], key: 'bankType' }));

const sortMap = new Map<string, string>([
  ['ascend', 'asc'],
  ['descend', 'desc'],
]);

export default function DetailModal({ columns }: Props) {
  const [tableInfo, setTableInfo] = useState<{ data: any[]; total: number; sortLoading?: boolean }>({
    data: [],
    total: 0,
    sortLoading: false,
  });
  const [firstLoading, setFirstLoading] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const areaInfo = useSelector((store) => store.areaInfo);

  const {
    state: { modalTitle, modalVisible, modalRequestParams, sheetNames },
    update,
  } = useCtx();

  const isTotalModal = useMemo(() => modalTitle.includes('总计'), [modalTitle]);

  const { run } = useRequest(getDistributionModal, {
    manual: true,
    onSuccess: (
      data: CommonResponse<{
        data: Record<string, string>[];
        total: number;
      }>,
    ) => {
      if (data.data) {
        setTableInfo({
          data: data.data.data.map((item: any, index) => ({ ...item, index: index + 1 + modalRequestParams?.skip })),
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
      if (firstLoading) {
        setFirstLoading(false);
      }
    },
  });

  const handleChange = useMemoizedFn((pagination, filters, sorter) => {
    update((d) => {
      d.modalRequestParams.sort = sortMap.get(sorter.order) ? `${sorter.field}:${sortMap.get(sorter.order) || ''}` : '';
    });
    setTableInfo((d) => ({ ...d, sortLoading: true }));
  });

  const handlePageChange = useMemoizedFn((cur) => {
    if (ref.current) {
      ref.current.scrollTop = 0;
    }
    update((d) => {
      d.modalRequestParams.skip = (cur - 1) * 50;
    });
    setTableInfo((d) => ({ ...d, sortLoading: true }));
  });

  const exportName = useMemo(() => {
    const regionName = areaInfo?.regionName || '';
    return `${regionName}-${modalTitle}-${dayjs().format('YYYY.MM.DD')}`;
  }, [areaInfo?.regionName, modalTitle]);

  const exportCondition = useMemo(
    () => ({
      module_type:
        modalRequestParams?.branchType === 1
          ? 'regionalFinancialResource_areabank_corporation_info'
          : 'regionalFinancialResource_areabank_branch_info',
      ...modalRequestParams,
      sheetNames: sheetNames,
      exportTotal: isTotalModal,
    }),
    [isTotalModal, modalRequestParams, sheetNames],
  );

  useEffect(() => {
    if (modalVisible && modalRequestParams) {
      run(modalRequestParams);
    }
  }, [modalRequestParams, modalVisible, run]);

  const config: Options[] = [
    {
      title: modalRequestParams?.branchType === 1 ? '银行类型' : '所属总行类型',
      formatTitle: (rows: any[]) => {
        return rows.map((item) => item.name).join(',');
      },
      option: {
        type: ScreenType.MULTIPLE,
        children: list,
      },
    },
  ];

  const onChange = useMemoizedFn((current, allSelectedRows) => {
    update((d) => {
      d.modalRequestParams.bankType = current.map((o: any) => o.value).join(',');
    });
    setTableInfo((d) => ({ ...d, sortLoading: true }));
  });

  const handleSearch = useMemoizedFn((value: string) => {
    update((d) => {
      d.modalRequestParams.text = value;
    });
    setTableInfo((d) => ({ ...d, sortLoading: true }));
  });

  // 解决双滚动条处理
  useEffect(() => {
    window.dispatchEvent(new Event('resize'));
  }, [tableInfo.data]);

  return (
    <>
      <ModalWrapper isTotalModal={isTotalModal}></ModalWrapper>
      <Modal.FullScreen
        open={modalVisible}
        title={modalTitle}
        extra={
          <HeaderModalWrapper>
            <div className="num">
              共 <span>{formatNumber(tableInfo.total, 0)}</span> 条
            </div>
            <div>
              <ExportDoc condition={exportCondition} filename={exportName} />
            </div>
          </HeaderModalWrapper>
        }
        footer={null}
        onCancel={() => {
          update((d) => {
            d.modalVisible = false;
          });
          setFirstLoading(true);
          setTableInfo({
            total: 0,
            data: [],
          });
        }}
        destroyOnClose
        getContainer={() => document.querySelector('.main-container') as HTMLElement}
        scrollRef={ref}
        wrapClassName="area-bankDistributionByType-modal"
      >
        {isTotalModal ? (
          <SearchWrapper>
            <Screen options={config} onChange={onChange} size="small" />
            <div className="search">
              <TopicSearch
                placeholder={'请输入关键字'}
                onClear={() => {
                  handleSearch('');
                }}
                onSearch={handleSearch}
                dataKey={AREA_BANK_TYPE}
                focusedWidth={200}
                size="small"
              />
            </div>
          </SearchWrapper>
        ) : null}
        <>
          {firstLoading ? (
            <SpinWrapper>
              <Spin spinning={firstLoading} type={'thunder'} tip="加载中" />
            </SpinWrapper>
          ) : (
            <TableWrapper>
              <Table
                columnLayout="fixed"
                columns={columns}
                className={cn(S.modalTable, 'areaF9FinanceModalTable')}
                dataSource={tableInfo.data}
                showSorterTooltip={false}
                scroll={{ x: '100%' }}
                sticky={{
                  offsetHeader: 0,
                  getContainer: () => ref.current!,
                }}
                onChange={handleChange}
                pagination={false}
                loading={{
                  spinning: tableInfo.sortLoading,
                  translucent: true,
                  indicator: <DzhSpin type="square" tip="加载中" />,
                }}
              />
            </TableWrapper>
          )}
        </>
        <Pagination
          current={modalRequestParams?.skip / 50 + 1 || 1}
          pageSize={50}
          total={tableInfo.total}
          style={{
            padding: '4px 0px 0px',
            position: 'relative',
            marginBottom: 0,
            justifyContent: 'flex-end',
            right: '-6px',
            opacity: 0.9,
            background: '#fff',
          }}
          onChange={handlePageChange}
          align="right"
        />
      </Modal.FullScreen>
    </>
  );
}

const ModalWrapper = createGlobalStyle<{ isTotalModal: boolean }>`
  .area-bankDistributionByType-modal {
    .ant-modal-body {
      padding-top: ${({ isTotalModal }) => (isTotalModal ? '4px' : '12px')} !important;
    }
  }
`;

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

const SearchWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 22px;
  padding-left: 8px;
  .search {
    margin-left: 13px;
  }
`;
