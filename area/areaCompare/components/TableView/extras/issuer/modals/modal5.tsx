import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { useMemoizedFn, useRequest } from 'ahooks';
import { message } from 'antd';
import { SorterResult } from 'antd/lib/table/interface';
import cn from 'classnames';
import dayJs from 'dayjs';
import { isNil, omit } from 'lodash';

import { Modal, Spin, Table } from '@/components/antd';
import ExportDoc from '@/components/exportDoc';
import { LINK_DETAIL_ENTERPRISE } from '@/configs/routerMap';
import { dynamicLink } from '@/utils/router';
import { urlQueriesSerialize } from '@/utils/url';

import { Modal5RowItem, requestModal5 } from './api';

import type { DetailModalProps } from './type';
import type { TableColumnsType } from 'antd';

import style from '@dataView/components/cellDetailModal/style.module.less';

export default function Modal3({ visible, title, onClose, params, getContainer }: DetailModalProps) {
  const requestParamsRef = useRef<Record<string, any> | undefined>(params);
  const [data, setData] = useState<Modal5RowItem[]>([]);

  const scrollWrapper = useRef<HTMLDivElement>(null);

  const { run, loading } = useRequest(requestModal5, {
    manual: true,
    onSuccess: ({ data: resData }) => {
      if (resData) {
        setData(resData.list);
      }
    },
    onError: (e: any) => {
      message.error({ content: e.info || '请求异常，请稍后再试', duration: 3 });
    },
  });

  useEffect(() => {
    if (visible && params) {
      requestParamsRef.current = { ...params, pageSize: 1000, skip: 0 };
      run(requestParamsRef.current);
    }
  }, [params, run, visible]);

  const handleSortChange = useMemoizedFn((_, __, { field, order }: SorterResult<Modal5RowItem>) => {
    const sortType = {
      ascend: 'asc',
      descend: 'desc',
    };
    const sortField: Record<string, string> = {
      // 融资余额
      financingBalance: 'Fvalue',
      // 融资利率
      financingRate: 'UpperRate',
      // 起始日期
      startDate: 'LoanStartDate',
      // 到期日
      dueDate: 'LoanEndDate',
      // 披露日期
      declareDate: 'NoticeDate',
    };
    requestParamsRef.current = {
      ...params,
      pageSize: 1000,
      skip: 0,
      sort: order ? `${sortField[field as string]}:${sortType[order]}` : undefined,
    };
    run(requestParamsRef.current);
  });

  const columns = useMemo<TableColumnsType<Modal5RowItem>>(
    () =>
      (
        [
          {
            title: '序号',
            fixed: 'left',
            render: (_, __, i) => i + 1,
            width: 60,
          },
          {
            title: '融资方',
            width: 250,
            fixed: 'left',
            align: 'left',
            render: (_, row: any) => (
              <Link
                className={style.link}
                to={{
                  pathname: dynamicLink(LINK_DETAIL_ENTERPRISE, { key: 'overview' }),
                  search: urlQueriesSerialize({ code: row.financingParty.itCode, type: 'company' }),
                }}
              >
                {row.financingParty.name}
              </Link>
            ),
          },
          {
            title: '与城投平台的关系',
            width: 130,
            dataIndex: 'relation',
          },
          {
            title: '非标类型',
            width: 100,
            dataIndex: 'nonStandardType',
          },
          {
            title: '债权人/项目',
            width: 260,
            align: 'left',
            render: (_, row: any) =>
              row.creditorInfo.itCode ? (
                <Link
                  className={style.link}
                  to={{
                    pathname: dynamicLink(LINK_DETAIL_ENTERPRISE, { key: 'overview' }),
                    search: urlQueriesSerialize({ code: row.creditorInfo.itCode, type: 'company' }),
                  }}
                >
                  {row.creditorInfo.name}
                </Link>
              ) : (
                row.creditorInfo.name
              ),
          },
          {
            title: '融资余额(亿元)',
            width: 120,
            align: 'right',
            dataIndex: 'financingBalance',
            sorter: true,
            defaultSortOrder: 'descend',
          },
          {
            title: '融资利率(%)',
            width: 110,
            align: 'right',
            dataIndex: 'financingRate',
            sorter: true,
          },
          {
            title: '期限',
            width: 100,
            align: 'right',
            dataIndex: 'term',
          },
          {
            title: '起始日期',
            width: 100,
            dataIndex: 'startDate',
            sorter: true,
          },
          {
            title: '到期日',
            width: 100,
            dataIndex: 'dueDate',
            sorter: true,
          },
          {
            title: '融资金额(亿元)',
            width: 120,
            align: 'right',
            dataIndex: 'financingAmount',
            sorter: true,
          },
          {
            title: '科目',
            width: 180,
            align: 'left',
            dataIndex: 'subject',
          },
          {
            title: '信源',
            width: 100,
            dataIndex: 'source',
          },
          {
            title: '披露日期',
            width: 100,
            dataIndex: 'declareDate',
            sorter: true,
          },
        ] as TableColumnsType<Modal5RowItem>
      ).map((d) => {
        return !d.render
          ? {
              ...d,
              render: (value) => (isNil(value) || value === '' ? '-' : value),
            }
          : d;
      }),
    [],
  );

  return (
    <Modal
      getContainer={getContainer}
      type="titleWidthBgAndMaskScroll"
      title={title || '非标余额明细'}
      visible={visible}
      onCancel={onClose}
      footer={null}
      destroyOnClose={true}
      width={860}
      wrapClassName={style.modalWrapper}
      centered
    >
      <Spin type={'thunder'} spinning={loading}>
        <div className={style.innerWrapper} ref={scrollWrapper}>
          <div className={cn(style.blank, style.flexCenter)}>
            <div />
            <div className={cn(style.moduleExport, style.moduleExportBetween)}>
              <div className={style.countWrapper}>
                共<span className={style.count}>{data.length}</span>条
              </div>
              <ExportDoc
                condition={{
                  module_type: 'web_nonStandard_financing',
                  ...omit(params, ['pageSize', 'skip']),
                }}
                filename={`${title}${dayJs().format('YYYYMMDD')}`}
              />
            </div>
          </div>
          <Table
            type={'stickyTable'}
            scroll={{ x: 'max-content' }}
            sticky={{ offsetHeader: 35, getContainer: () => scrollWrapper.current || document.body }}
            showSorterTooltip={false}
            columns={columns}
            dataSource={data}
            onChange={handleSortChange}
          />
        </div>
      </Spin>
    </Modal>
  );
}
