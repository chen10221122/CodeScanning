import { useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import cn from 'classnames';

import { Flex } from '@/components/layout';
import { LINK_DETAIL_BOND, LINK_DETAIL_ENTERPRISE } from '@/configs/routerMap';
import useCommonColumn, { RenderMode } from '@/pages/area/areaFinancing/hooks/useCommonColumn';
import { dynamicLink } from '@/utils/router';
import { urlJoin, urlQueriesSerialize } from '@/utils/url';

import { BondModalType } from '../type';

import S from '@pages/area/areaFinancing/style.module.less';

export interface ModalProps {
  columnType?: BondModalType;
  condition: any;
  page: number;
}

const useModalColumns = ({ columnType = BondModalType.NormalInventory, condition, page }: ModalProps) => {
  const history = useHistory();
  const sortInfo = useMemo(() => {
    return { sortKey: condition.sortKey, sortRule: condition.sortRule };
  }, [condition.sortKey, condition.sortRule]);
  const { makeColumns } = useCommonColumn(sortInfo);

  // 序号列
  const idxColumn = useMemo(() => {
    return {
      title: '序号',
      dataIndex: 'rowIndex',
      width: Math.max(`${Number(page * 50)}`.length > 3 ? `${Number(page * 50)}`.length * 12 : 42, 42),
      fixed: 'left',
      className: 'pdd-8',
      sorter: false,
    };
  }, [page]);

  // 地区列
  const areaInfoColumn = [
    {
      title: '省份',
      dataIndex: 'province',
      width: 102,
      sorter: false,
      align: 'left',
    },
    {
      title: '地级市',
      dataIndex: 'city',
      width: 88,
      sorter: false,
      align: 'left',
    },
    {
      title: '区县',
      dataIndex: 'district',
      width: 88,
      sorter: false,
      align: 'left',
    },
  ];
  const headCommonColumn = [
    idxColumn,
    {
      title: '债券简称',
      dataIndex: 'bondAbbreviation',
      width: 143,
      align: 'left',
      fixed: 'left',
      sorter: false,
      render: (text: string, row: Record<string, any>) => {
        return (
          <Flex>
            <div
              className={cn(S.cursorText, S.overflow)}
              style={{ textAlign: 'left' }}
              title={text}
              onClick={() => {
                history.push(
                  `${urlJoin(
                    dynamicLink(LINK_DETAIL_BOND, { key: 'overview' }),
                    urlQueriesSerialize({ code: row.trCode, type: 'co' }),
                  )}`,
                );
              }}
            >
              {text}
            </div>
          </Flex>
        );
      },
    },
    {
      title: '债券代码',
      dataIndex: 'bondCode',
      width: 106,
      align: 'left',
      sorter: false,
    },
  ];
  const commonColumn = (isFinance?: boolean) => {
    const prevArr = [
      {
        title: '债项评级',
        dataIndex: 'debtRating',
        width: 75,
        sorter: false,
      },
      {
        title: '主体评级',
        dataIndex: 'subjectRating',
        width: 75,
        sorter: false,
      },
      {
        title: '上市市场',
        dataIndex: 'listedMarket',
        width: 88,
        align: 'left',
        sorter: false,
      },
      {
        title: '发行人',
        dataIndex: 'issuer',
        width: 220,
        align: 'left',
        sorter: false,
        render: (text: string, row: Record<string, any>) => {
          return (
            <Flex>
              <div
                className={cn(S.cursorText, S.overflow)}
                style={{ textAlign: 'left' }}
                title={text}
                onClick={() => {
                  history.push(
                    `${urlJoin(
                      dynamicLink(LINK_DETAIL_ENTERPRISE, { key: 'overview' }),
                      urlQueriesSerialize({ code: row.issuerItCode2, type: 'company' }),
                    )}`,
                  );
                }}
              >
                {text}
              </div>
            </Flex>
          );
        },
      },
    ];
    return isFinance
      ? [
          ...prevArr,
          ...areaInfoColumn,
          {
            title: '企业类型',
            dataIndex: 'enterpriseType',
            width: 154,
            sorter: false,
            align: 'left',
          },
        ]
      : [
          ...prevArr,
          {
            title: '企业性质',
            dataIndex: 'enterpriseNature',
            width: 102,
            align: 'left',
            sorter: false,
          },
          {
            title: '申万行业',
            dataIndex: 'industryName',
            width: 100,
            align: 'left',
            sorter: false,
          },
          {
            title: '是否城投',
            dataIndex: 'isCityInvestment',
            width: 90,
            sorter: false,
          },
          ...areaInfoColumn,
          {
            title: '平台归属地(城投)',
            dataIndex: 'pfAttribution',
            width: 130,
            sorter: false,
            align: 'left',
          },
          {
            title: '股东背景(城投)',
            dataIndex: 'shareholderBackground',
            width: 114,
            sorter: false,
            align: 'left',
          },
          {
            title: '股权关系(城投)',
            dataIndex: 'ctrlLevelProperties',
            width: 114,
            sorter: false,
            align: 'left',
          },
          {
            title: '平台类型(城投)',
            dataIndex: 'pfType',
            width: 114,
            sorter: false,
            align: 'left',
          },
          {
            title: '平台重要性(城投)',
            dataIndex: 'pfImportance',
            width: 130,
            align: 'left',
            sorter: false,
          },
          {
            title: '所属开发区(城投)',
            dataIndex: 'ownDevZone',
            width: 130,
            align: 'left',
            sorter: false,
          },
          {
            title: '开发区类别(城投)',
            dataIndex: 'devZoneCat',
            width: 130,
            align: 'left',
            sorter: false,
          },
        ];
  };
  const bondTypeColumn = (isFinancial?: boolean) => {
    return !isFinancial
      ? [
          {
            title: '债券类型',
            dataIndex: 'bondType',
            align: 'left',
            width: 114,
            sorter: false,
          },
        ]
      : [
          {
            title: '债券一级类型',
            dataIndex: 'firstBondType',
            align: 'left',
            width: 110,
            sorter: false,
          },
          {
            title: '债券二级类型',
            dataIndex: 'secondBondType',
            align: 'left',
            width: 118,
            sorter: false,
          },
        ];
  };
  // 存量
  const inventoryColumn = (isFinancial?: boolean) => [
    ...headCommonColumn,
    {
      title: '债券余额(亿)',
      dataIndex: 'bondBalance',
      width: 102,
      renderMode: RenderMode.NumberText,
      sorter: false,
    },
    {
      title: '到期日期',
      dataIndex: 'dateExpiry',
      width: 92,
      className: 'no-padding',
    },
    ...bondTypeColumn(isFinancial),
    {
      title: '发行日期',
      dataIndex: 'issueDate',
      width: 90,
      className: 'no-padding',
    },
    {
      title: '发行规模(亿)',
      dataIndex: 'issueAmount',
      width: 114,
      renderMode: RenderMode.NumberText,
    },
    {
      title: '债券期限(年)',
      dataIndex: 'bondMaturity',
      align: 'right',
      width: 114,
    },
    {
      title: '票面利率(%)',
      dataIndex: 'couponRate',
      width: 114,
      renderMode: RenderMode.NumberText,
    },
    ...commonColumn(isFinancial),
  ];
  // 净融资
  const financingColumn = (isFinancial?: boolean) => [
    ...headCommonColumn,
    {
      title: '变动日期',
      dataIndex: 'changeDate',
      width: 90,
      className: 'no-padding',
    },
    {
      title: '变动类型',
      dataIndex: 'changeType',
      width: 90,
      sorter: false,
      align: 'left',
    },
    {
      title: '净融资额(亿)',
      dataIndex: 'netFinancingAmount',
      width: 103,
      align: 'right',
      sorter: false,
    },
    {
      title: '发行额(亿)',
      dataIndex: 'issueAmount',
      width: 89,
      align: 'right',
      sorter: false,
    },
    {
      title: '偿还额(亿)',
      dataIndex: 'repayAmount',
      width: 89,
      renderMode: RenderMode.NumberText,
      sorter: false,
    },
    ...bondTypeColumn(isFinancial),
    {
      title: '债券期限(年)',
      dataIndex: 'bondMaturity',
      width: 114,
      renderMode: RenderMode.NumberText,
    },
    {
      title: '票面利率(%)',
      dataIndex: 'couponRate',
      width: 114,
      renderMode: RenderMode.NumberText,
    },
    {
      title: '到期日期',
      dataIndex: 'dateExpiry',
      width: 90,
      className: 'no-padding',
    },
    ...commonColumn(isFinancial),
  ];
  // 发行
  const issueColumn = (isFinancial?: boolean) => [
    ...headCommonColumn,
    {
      title: '发行日期',
      dataIndex: 'issueDate',
      width: 90,
      className: 'no-padding',
    },
    {
      title: '发行规模(亿)',
      dataIndex: 'issueAmount',
      width: 114,
      renderMode: RenderMode.NumberText,
    },
    ...bondTypeColumn(isFinancial),
    {
      title: '债券期限(年)',
      dataIndex: 'bondMaturity',
      width: 114,
      align: 'right',
    },
    {
      title: '票面利率(%)',
      dataIndex: 'couponRate',
      width: 114,
      renderMode: RenderMode.NumberText,
    },
    {
      title: '到期日期',
      dataIndex: 'dateExpiry',
      width: 90,
      className: 'no-padding',
    },
    {
      title: '发行价格(元)',
      dataIndex: 'issuingPrice',
      width: 114,
      align: 'right',
    },
    {
      title: '参考收益率(%)',
      dataIndex: 'referenceRate',
      width: 114,
      align: 'right',
    },
    ...commonColumn(isFinancial),
  ];
  // 非金融企业-偿还
  const returnColumn = (isFinancial?: boolean) => [
    ...headCommonColumn,
    {
      title: '变动日期',
      dataIndex: 'changeDate',
      width: 90,
      className: 'no-padding',
    },
    {
      title: '变动类型',
      dataIndex: 'changeType',
      width: 114,
      align: 'left',
      sorter: false,
    },
    {
      title: '变动金额(亿)',
      dataIndex: 'changeAmount',
      width: 114,
      renderMode: RenderMode.NumberText,
    },
    ...bondTypeColumn(isFinancial),
    {
      title: '债券期限(年)',
      dataIndex: 'bondMaturity',
      width: 114,
      align: 'right',
    },
    {
      title: '票面利率(%)',
      dataIndex: 'couponRate',
      width: 114,
      align: 'right',
    },
    {
      title: '到期日期',
      dataIndex: 'dateExpiry',
      width: 90,
      className: 'no-padding',
    },
    ...commonColumn(isFinancial),
  ];

  const columnMap = new Map([
    [BondModalType.NormalInventory, makeColumns(inventoryColumn())],
    [BondModalType.NormalFinancing, makeColumns(financingColumn())],
    [BondModalType.NormalIssue, makeColumns(issueColumn())],
    [BondModalType.NormalReturn, makeColumns(returnColumn())],
    [BondModalType.FinancialInventory, makeColumns(inventoryColumn(true))],
    [BondModalType.FinancialFinancing, makeColumns(financingColumn(true))],
    [BondModalType.FinancialIssue, makeColumns(issueColumn(true))],
    [BondModalType.FinancialReturn, makeColumns(returnColumn(true))],
  ]);
  return columnMap.get(columnType) || [];
};

export default useModalColumns;
