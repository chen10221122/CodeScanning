import { useMemo } from 'react';

import styled from 'styled-components';

import {
  EllipsisText,
  LinkToFile,
  StockText,
  Tag,
} from '@/pages/detail/modules/enterprise/overview/modules/qualityList/components';
import { ETagType, MIN_WIDTH, PADDING } from '@/pages/detail/modules/enterprise/overview/modules/qualityList/constant';
import { Pager } from '@/pages/detail/modules/enterprise/overview/modules/qualityList/types';
import useLinkToF9 from '@/pages/finance/financingLease/hooks/useLinkToF9';

interface IColumnsProps {
  tagType: string;
  pager: Pager;
  keyWord?: string;
}

export default function useColumns({ tagType, pager, keyWord }: IColumnsProps) {
  const linkToF9 = useLinkToF9();

  const moduleType = useMemo(() => {
    switch (tagType) {
      case ETagType.RANKLIST:
        return 'ranking_list_detail';
      case ETagType.SATI:
        return 'technical_innovation_detail';
      case ETagType.BLACKLIST:
      case '3,6':
        return 'blacklist_detail';
      default:
        return 'other_list_detail';
    }
  }, [tagType]);

  const baseColumns = useMemo(() => {
    return [
      {
        title: '序号',
        dataIndex: 'index',
        width: Math.max(`${pager.current * pager.pageSize}`.length * 8 + PADDING, MIN_WIDTH),
        fixed: 'left',
        className: 'pdd-8',
        render: (text: string, obj: any, i: number) => {
          return <span>{obj.skip + i + 1}</span>;
        },
      },
      {
        title: '公布日期',
        dataIndex: 'publicationDate',
        fixed: 'left',
        sorter: true,
        width: 103,
        render: (text: string) => <StockText text={text} />,
      },
      {
        title: '公司名称',
        dataIndex: 'name',
        fixed: 'left',
        sorter: true,
        align: 'left',
        width: 320,
        render: (text: string, obj: any) => {
          const tags: string[] = obj?.blueTags || [];
          return (
            <Leaserwrap>
              <EllipsisText
                text={text}
                clamp={1}
                showTitle={true}
                isF9={true}
                keyWord={keyWord}
                onClick={() => {
                  linkToF9(obj?.code);
                }}
              />
              <Tag data={tags} />
            </Leaserwrap>
          );
        },
      },
      {
        title: '排名',
        dataIndex: 'rank',
        sorter: true,
        width: 76,
        render: (text: string) => <StockText text={text} />,
      },
      {
        title: '登记状态',
        dataIndex: 'registerStatus',
        sorter: true,
        width: 92,
        render: (text: string) => <StockText text={text} />,
      },
      {
        title: '数据来源',
        dataIndex: 'dataSource',
        align: 'left',
        width: 194,
        render: (text: string) => <EllipsisText text={text} clamp={3} showTitle={true} />,
      },
      {
        title: '原文',
        dataIndex: 'fileList',
        width: 50,
        render: (_: any, record: any) => {
          return <>{record.fileList ? <LinkToFile originalText={record.fileList} /> : '-'}</>;
        },
      },
      {
        title: '法定代表人',
        dataIndex: 'legalPerson',
        width: 89,
        render: (text: string) => <StockText text={text} />,
      },
      {
        title: '成立日期',
        dataIndex: 'establishDate',
        sorter: true,
        width: 104,
        render: (text: string) => <StockText text={text} />,
      },
      {
        title: '注册资本',
        dataIndex: 'registerCapital',
        sorter: true,
        align: 'right',
        width: 141,
        render: (text: string) => <StockText text={text} />,
      },
      {
        title: '国标行业门类',
        dataIndex: 'category1',
        align: 'left',
        width: 184,
        render: (text: string) => <StockText text={text} />,
      },
      {
        title: '国标行业大类',
        dataIndex: 'category2',
        align: 'left',
        width: 144,
        render: (text: string) => <StockText text={text} />,
      },
      {
        title: '国标行业中类',
        dataIndex: 'category3',
        width: 184,
        align: 'left',
        render: (text: string) => <StockText text={text} />,
      },
      {
        title: '国标行业细类',
        dataIndex: 'category4',
        width: 144,
        align: 'left',
        render: (text: string) => <StockText text={text} />,
      },
      {
        title: '所在省',
        dataIndex: 'provinceName',
        width: 76,
        render: (text: string) => <StockText text={text} />,
      },
      {
        title: '所在市',
        dataIndex: 'cityName',
        width: 89,
        render: (text: string) => <StockText text={text} />,
      },
      {
        title: '所在区/县',
        dataIndex: 'countyName',
        width: 86,
        render: (text: string) => <StockText text={text} />,
      },
    ];
  }, [pager, linkToF9, keyWord]);

  const beginDate = {
    title: '列入日期',
    dataIndex: 'beginDate',
    sorter: true,
    width: 104,
    render: (text: string) => <StockText text={text} />,
  };

  const endDate = {
    title: '截止日期',
    dataIndex: 'endDate',
    sorter: true,
    width: 104,
    render: (text: string) => <StockText text={text} />,
  };

  // 针对不同的column处理column
  const columns = useMemo(() => {
    switch (tagType) {
      case ETagType.SATI: {
        const filter = ['rank', 'dataSource', 'fileList'];
        return baseColumns.filter((column) => !filter.includes(column.dataIndex));
      }
      case ETagType.BLACKLIST:
      case '3,6': {
        const filter = ['rank'];
        const filterBaseColumns = baseColumns.filter((column) => !filter.includes(column.dataIndex));
        const startIndex = filterBaseColumns.findIndex((column) => column.dataIndex === 'fileList');
        filterBaseColumns.splice(startIndex, 0, beginDate, endDate);
        return filterBaseColumns;
      }
      default: {
        // 评级/荣誉/政府资助/其他模块对应的tagType值
        const filterRank = ['3', '4', '9', '10'];
        if (filterRank.includes(tagType)) {
          const filter = ['rank'];
          return baseColumns.filter((column) => !filter.includes(column.dataIndex));
        }
        return baseColumns;
      }
    }
    // eslint-disable-next-line
  }, [baseColumns, tagType]);

  return { columns, moduleType };
}

const Leaserwrap = styled.div`
  display: flex;
  margin-bottom: 0;
  align-items: center;
`;
