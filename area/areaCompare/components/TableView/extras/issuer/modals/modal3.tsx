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

import { Modal3RowItem, requestModal3 } from './api';
import style from './styles.module.less';
import useModal123Request from './useModal123Request';

import type { DetailModalProps } from './type';
import type { TableColumnsType } from 'antd';

export default function Modal3({ visible, title, onClose, getContainer, params }: DetailModalProps) {
  const { loading, data, pagination, onPageChange, onTableChange, wrapperRef, requestParamsRef } =
    useModal123Request<Modal3RowItem>({
      api: requestModal3,
      visible,
      params,
    });

  const columns = useMemo<TableColumnsType>(
    () =>
      (
        [
          {
            title: '序号',
            fixed: 'left',
            render: (_, __, i) => (pagination ? (pagination.current - 1) * pagination.pageSize + i + 1 : i + 1),
            width: 60,
          },
          {
            title: '债券简称',
            dataIndex: 'bondAbbreviation',
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
            title: '债券余额(亿)',
            dataIndex: 'bondBalance',
            width: 114,
            align: 'right',
          },
          {
            title: '到期日期',
            dataIndex: 'dateExpiry',
            width: 110,
            sorter: true,
          },
          {
            title: '债券类型',
            dataIndex: 'bondType',
            width: 124,
          },
          {
            title: '发行日期',
            dataIndex: 'issueDate',
            width: 90,
            sorter: true,
            className: 'no-padding',
            defaultSortOrder: 'descend',
          },
          {
            title: '发行规模(亿)',
            dataIndex: 'issueAmount',
            width: 104,
            align: 'right',
            sorter: true,
          },
          {
            title: '债券期限(年)',
            dataIndex: 'bondMaturity',
            width: 110,
            sorter: true,
            align: 'right',
          },
          {
            title: '票面利率(%)',
            dataIndex: 'couponRate',
            width: 113,
            align: 'right',
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
            dataIndex: '',
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
            width: 100,
            align: 'left',
          },
          {
            title: '申万行业',
            dataIndex: 'industryName',
            width: 90,
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
            align: 'left',
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
      title={title || '债券存量明细'}
      count={pagination.total}
      visible={visible}
      onClose={onClose}
      params={{
        module_type: 'non_financing_bond_stock_detail',
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
