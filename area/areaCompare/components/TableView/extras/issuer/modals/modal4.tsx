import { useEffect, useMemo, useRef, useState } from 'react';

import { useMemoizedFn, useRequest } from 'ahooks';
import { message } from 'antd';
import { SorterResult } from 'antd/lib/table/interface';
import cn from 'classnames';
import dayJs from 'dayjs';
import { isNil, omit } from 'lodash';

import { Modal, Spin, Table } from '@/components/antd';
import ExportDoc from '@/components/exportDoc';
import { toFixed } from '@/utils/format';

import { Modal4RowItem, requestModal4 } from './api';

import type { DetailModalProps } from './type';
import type { TableColumnsType } from 'antd';

import style from '@dataView/components/cellDetailModal/style.module.less';

export default function Modal3({ visible, title, onClose, params, getContainer, extraProperties }: DetailModalProps) {
  const [data, setData] = useState<Modal4RowItem[]>([]);
  const requestParamsRef = useRef<Record<string, any> | undefined>(params);

  const { run, loading } = useRequest(requestModal4, {
    manual: true,
    onSuccess: ({ data: resData }) => {
      if (resData) {
        setData(resData);
      }
    },
    onError: (e: any) => {
      message.error({ content: e.info || '请求异常，请稍后再试', duration: 3 });
    },
  });

  useEffect(() => {
    if (visible && params) {
      requestParamsRef.current = { ...params, pagesize: 1000, skip: 0 };
      run(requestParamsRef.current);
    }
  }, [params, run, visible]);

  const handleSortChange = useMemoizedFn((_, __, { field, order }: SorterResult<Modal4RowItem>) => {
    const sortType = {
      ascend: 'asc',
      descend: 'desc',
    };
    requestParamsRef.current = order
      ? {
          ...params,
          pagesize: 1000,
          skip: 0,
          sortField: field,
          sortRule: sortType[order],
        }
      : {
          ...params,
          pagesize: 1000,
          skip: 0,
        };
    run(requestParamsRef.current);
  });

  const columns = useMemo<TableColumnsType>(
    () =>
      (
        [
          {
            title: '序号',
            render: (_, __, i) => i + 1,
            width: 40,
          },
          {
            title: '授信机构',
            width: 230,
            align: 'left',
            dataIndex: 'creditOrgName',
          },
          {
            title: '授信额度(亿)',
            width: 80,
            align: 'right',
            dataIndex: 'creditLine',
            sorter: true,
            defaultSortOrder: 'descend',
            render: (value) => (!isNil(value) && value !== '' ? toFixed(value, 2) : '-'),
          },
          {
            title: '已使用(亿)',
            width: 80,
            align: 'right',
            dataIndex: 'creditLineUsed',
            sorter: true,
            render: (value) => (!isNil(value) && value !== '' ? toFixed(value, 2) : '-'),
          },
          {
            title: '未使用(亿)',
            width: 80,
            align: 'right',
            dataIndex: 'creditLineUnused',
            sorter: true,
            render: (value) => (!isNil(value) && value !== '' ? toFixed(value, 2) : '-'),
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
    [],
  );

  return (
    <Modal
      getContainer={getContainer}
      type="titleWidthBgAndMaskScroll"
      title="授信额度"
      visible={visible}
      onCancel={onClose}
      footer={null}
      destroyOnClose={true}
      width={860}
      wrapClassName={style.modalWrapper}
      centered
    >
      <Spin type={'thunder'} spinning={loading}>
        <div className={style.innerWrapper}>
          <div className={cn(style.blank, style.flexCenter)}>
            <div className={style.endDate}>
              {extraProperties?.endDate ? `截止日期：${extraProperties.endDate}` : null}
            </div>
            <div className={cn(style.moduleExport, style.moduleExportBetween)}>
              <div className={style.countWrapper}>
                共<span className={style.count}>{data.length}</span>条
              </div>
              <ExportDoc
                condition={{
                  module_type: 'credit_line',
                  ...omit(requestParamsRef.current, ['pagesize', 'skip']),
                }}
                filename={`${title}${dayJs().format('YYYYMMDD')}`}
              />
            </div>
          </div>
          <Table
            type={'stickyTable'}
            sticky={{ offsetHeader: 35 }}
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
