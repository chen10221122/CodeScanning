import { useMemo } from 'react';

import { useMemoizedFn } from 'ahooks';
import { Popover } from 'antd';
import { isEmpty } from 'lodash';
import styled from 'styled-components';

import { MIN_WIDTH, PADDING, sortAscend, sortDescend } from '@/pages/area/financialResources/module/common/const';
import { Pager } from '@/pages/area/financialResources/module/common/type';

import { CompanyName } from '../../components';
import { ColumnConfig, defaultColumnKey } from './const';

const useColumns = ({
  pager,
  hiddenRanking,
  keyWord,
  dataIndex,
}: {
  pager: Pager;
  hiddenRanking?: boolean;
  keyWord?: string;
  dataIndex: any[];
}) => {
  const checked = isEmpty(dataIndex) ? defaultColumnKey : dataIndex;

  const handleCheckAndDrag = useMemoizedFn((type: 'checked' | 'draggable', dataIndex: string) => {
    const checkedFlag = checked.includes(dataIndex) ? undefined : false;
    const draggableFlag = checked.includes(dataIndex) ? undefined : true;
    if (type === 'checked') {
      return checkedFlag;
    }
    if (type === 'draggable') {
      return draggableFlag;
    }
  });

  const restColumn = useMemo(() => {
    if (hiddenRanking) {
      return ColumnConfig.map((item, index) => ({
        title: item.prompt ? (
          <PopoverWrapper key={index}>
            <span>{item.title}</span>
            <Popover
              overlayClassName={`${item.popName}-debtIssuerCount-popover`}
              placement={'bottom'}
              align={{
                offset: [0, -3],
              }}
              content={item?.content}
              destroyTooltipOnHide={true}
              getPopupContainer={() => document.querySelector('#area-mainIndicators') as HTMLElement}
            >
              <img className="update-help-img" height={12} src={require('@/assets/images/common/help.png')} alt="" />
            </Popover>
          </PopoverWrapper>
        ) : (
          item.title
        ),
        align: 'right',
        checked: handleCheckAndDrag('checked', item.dataIndex),
        draggable: handleCheckAndDrag('draggable', item.dataIndex),
        indicName: item.dataIndex,
        key: item.dataIndex,
        className: 'ant-table-cell-father',
        children: [
          {
            title: '数值',
            dataIndex: item.dataIndex,
            sortDirections: item.dataIndex === 'totalAsset' ? sortAscend : sortDescend,
            width: 146,
            sorter: true,
            align: 'right',
            render: (info: any) => <span>{info?.value || '-'}</span>,
          },
        ],
      }));
    }
    return ColumnConfig.map((item, index) => ({
      title: item.prompt ? (
        <PopoverWrapper key={index}>
          <span>{item.title}</span>
          <Popover
            overlayClassName={`${item.popName}-debtIssuerCount-popover`}
            placement={'bottom'}
            align={{
              offset: [0, -3],
            }}
            content={item?.content}
            destroyTooltipOnHide={true}
            getPopupContainer={() => document.querySelector('#area-mainIndicators') as HTMLElement}
          >
            <img className="update-help-img" height={12} src={require('@/assets/images/common/help.png')} alt="" />
          </Popover>
        </PopoverWrapper>
      ) : (
        item.title
      ),
      align: 'right',
      width: 180,
      indicName: item.dataIndex,
      key: item.dataIndex,
      checked: handleCheckAndDrag('checked', item.dataIndex),
      draggable: handleCheckAndDrag('draggable', item.dataIndex),
      className: 'ant-table-cell-father',
      children: [
        {
          title: '数值',
          dataIndex: item.dataIndex,
          key: `${item.dataIndex}_value`,
          width: 90,
          sorter: true,
          align: 'right',
          sortDirections: sortDescend,
          render: (info: any) => <span>{info?.value || '-'}</span>,
        },
        {
          title: '排名',
          dataIndex: item.dataIndex,
          key: `${item.dataIndex}_rank`,
          width: 90,
          align: 'right',
          render: (info: any) => <span>{info?.ranking || '-'}</span>,
        },
      ],
    }));
  }, [hiddenRanking, handleCheckAndDrag]);

  const column = useMemo(
    () => [
      {
        title: '序号',
        dataIndex: 'index',
        width: Math.max(`${pager.current * pager.pageSize}`.length * 8 + PADDING, MIN_WIDTH),
        fixed: 'left',
        className: 'pdd-8',
        render: (text: string, obj: any, i: number) => {
          return <span>{(pager.current - 1) * pager.pageSize + i + 1}</span>;
        },
        hideInSetting: true,
      },
      {
        title: '银行名称',
        dataIndex: 'enterpriseInfo',
        fixed: 'left',
        sorter: true,
        align: 'left',
        width: 232,
        sortDirections: sortDescend,
        render: (enterpriseInfo: any) => (
          <CompanyName
            code={enterpriseInfo?.itCode}
            name={keyWord ? enterpriseInfo?.itNameLight : enterpriseInfo?.itName}
            tag={enterpriseInfo?.tags}
            maxWidth={220}
          />
        ),
      },
      {
        title: '银行类型',
        dataIndex: 'bankType',
        sorter: true,
        width: 92,
        sortDirections: sortAscend,
        render: (bankType?: string) => <div>{bankType || '-'}</div>,
      },
      ...restColumn,
    ],
    [pager, restColumn, keyWord],
  );
  return column;
};

export default useColumns;

const PopoverWrapper = styled.span`
  display: flex;
  align-items: center;
  > span:first-child {
    margin-right: 2px;
  }
`;
