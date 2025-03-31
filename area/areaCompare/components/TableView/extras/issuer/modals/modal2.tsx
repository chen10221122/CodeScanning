import { useMemo } from 'react';
import { Link } from 'react-router-dom';

import cn from 'classnames';
import { isNil, omit } from 'lodash';

import BigModal from '@dataView/DataView/SheetView/TableView/extras/issuer/modals/BigModal';

import { Spin, Table } from '@/components/antd';
import Pagination from '@/components/Pagination';
import { LINK_DETAIL_BOND, LINK_DETAIL_ENTERPRISE } from '@/configs/routerMap';
import { dynamicLink } from '@/utils/router';
import { urlQueriesSerialize } from '@/utils/url';

import { Modal2RowItem, requestModal2 } from './api';
import style from './styles.module.less';
import useModal123Request from './useModal123Request';

import type { DetailModalProps } from './type';
import type { TableColumnsType } from 'antd';

export default function Modal2({ visible, title, onClose, getContainer, params }: DetailModalProps) {
  const { loading, data, pagination, onPageChange, onTableChange, wrapperRef, requestParamsRef } =
    useModal123Request<Modal2RowItem>({
      api: requestModal2,
      visible,
      params,
    });

  const columns = useMemo<TableColumnsType>(
    () =>
      (
        [
          {
            title: '序号',
            width: 60,
            fixed: 'left',
            render: (_, __, i) => (pagination ? (pagination.current - 1) * pagination.pageSize + i + 1 : i + 1),
          },
          {
            title: '债券简称',
            width: 160,
            fixed: 'left',
            align: 'left',
            render: (_, row: any) => (
              <Link
                to={{
                  pathname: dynamicLink(LINK_DETAIL_BOND, { key: 'overview' }),
                  search: urlQueriesSerialize({ code: row.trCode, type: 'co' }),
                }}
              >
                {row.bondAbbreviation}
              </Link>
            ),
          },
          {
            title: '债券代码',
            dataIndex: 'bondCode',
            width: 90,
            align: 'left',
          },
          {
            title: '变动日期',
            dataIndex: 'changeDate',
            width: 100,
            sorter: true,
            defaultSortOrder: 'descend',
          },
          {
            title: '变动类型',
            dataIndex: 'changeType',
            width: 140,
          },
          {
            title: '变动金额(亿)',
            dataIndex: 'changeAmount',
            width: 120,
            align: 'right',
            sorter: true,
          },
          {
            title: '债券类型',
            dataIndex: 'bondType',
            align: 'left',
            width: 124,
          },
          {
            title: '债券期限(年)',
            dataIndex: 'bondMaturity',
            width: 108,
            sorter: true,
            align: 'right',
          },
          {
            title: '票面利率(%)',
            dataIndex: 'couponRate',
            width: 110,
            align: 'right',
            sorter: true,
          },
          {
            title: '到期日期',
            dataIndex: 'dateExpiry',
            width: 100,
            sorter: true,
          },
          {
            title: '债项评级',
            dataIndex: 'debtRating',
            width: 90,
          },
          {
            title: '主体评级',
            dataIndex: 'subjectRating',
            width: 75,
          },
          {
            title: '上市市场',
            dataIndex: 'listedMarket',
            width: 85,
            align: 'left',
          },
          {
            title: '发行人',
            width: 255,
            align: 'left',
            render: (_, row: any) => (
              <Link
                to={{
                  pathname: dynamicLink(LINK_DETAIL_ENTERPRISE, { key: 'overview' }),
                  search: urlQueriesSerialize({ code: row.issuerItCode2, type: 'company' }),
                }}
              >
                {row.issuer}
              </Link>
            ),
          },
          {
            title: '企业性质',
            dataIndex: 'enterpriseNature',
            width: 154,
            align: 'left',
          },
          {
            title: '申万行业',
            dataIndex: 'industryName',
            width: 154,
            align: 'left',
          },
          {
            title: '是否城投',
            dataIndex: 'isCityInvestment',
            width: 80,
          },
          {
            title: '省份',
            dataIndex: 'province',
            width: 70,
          },
          {
            title: '地级市',
            dataIndex: 'city',
            width: 80,
          },
          {
            title: '区县',
            dataIndex: 'district',
            width: 80,
          },
          {
            title: '平台归属地(城投)',
            dataIndex: 'pfAttribution',
            width: 130,
          },
          {
            title: '股东背景(城投)',
            dataIndex: 'shareholderBackground',
            width: 110,
          },
          {
            title: '股权关系(城投)',
            dataIndex: 'ctrlLevelProperties',
            width: 110,
          },
          {
            title: '平台类型(城投)',
            dataIndex: 'pfType',
            width: 110,
          },
          {
            title: '平台重要性(城投)',
            dataIndex: 'pfImportance',
            width: 120,
            align: 'left',
          },
          {
            title: '所属开发区(城投)',
            dataIndex: 'ownDevZone',
            width: 150,
            align: 'left',
          },
          {
            title: '开发区类别(城投)',
            dataIndex: 'devZoneCat',
            width: 120,
            align: 'left',
          },
        ] as TableColumnsType
      ).map((d) => {
        return !d.render
          ? {
              ...d,
              render: (value) => (isNil(value) || value === '' ? '-' : value),
            }
          : d;
      }),
    [pagination],
  );

  return (
    <BigModal
      title={title || '债券偿还明细'}
      count={pagination.total}
      visible={visible}
      onClose={onClose}
      params={{
        module_type: 'bond_not_financing_repay_detail',
        ...omit(requestParamsRef.current, ['from', 'size']),
      }}
      getContainer={getContainer}
    >
      <Spin type="thunder" spinning={loading}>
        <div className={style.modalContent}>
          <div className={style.tableWrapper} ref={wrapperRef}>
            <div className={style.container}>
              <Table
                type={'stickyTable'}
                scroll={{ x: 'max-content' }}
                sticky={{ getContainer: () => wrapperRef.current || document.body }}
                showSorterTooltip={false}
                columns={columns}
                dataSource={data}
                onChange={onTableChange}
              />
            </div>
          </div>
          {pagination ? (
            <div className={cn(style.paginate, style.container)}>
              <Pagination {...pagination} onChange={onPageChange} align="left" style={{ marginTop: 10 }} />
            </div>
          ) : null}
        </div>
      </Spin>
    </BigModal>
  );
}
