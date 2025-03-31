import { useMemo } from 'react';

import { Popover } from 'antd';
import { find } from 'lodash';

import { CompanyName } from '@/pages/area/financialResources/components';
import { MIN_WIDTH, PADDING, sortDescend } from '@/pages/area/financialResources/module/common/const';
import { Pager } from '@/pages/area/financialResources/module/common/type';

import { PopoverWrapper, Rating, TextOverflow } from '../components';
import { ascColumns, columnsConfig, pageFlag } from '../const';
import { PageFlag } from '../type';

type ColumnType = {
  dataIndex: string;
  [x: string]: any;
};

// 根据配置生成各个页面的columns
const rebuildColumn = (config: string[], column: ColumnType[]) => {
  const finaleColumns = [];
  for (const dataIndex of config) {
    const col = find(column, (item) => item.dataIndex === dataIndex);
    if (col) finaleColumns.push(col);
  }
  finaleColumns.push({
    title: '',
    resizable: false,
  });
  return finaleColumns;
};

const useColumns = ({ pageFlag: flag, pager, keyWord }: { pageFlag: PageFlag; pager: Pager; keyWord?: string }) => {
  const rateConfig = useMemo(() => {
    if (flag === pageFlag.SEC) {
      return {
        title: '证监会评级',
        content: '证监会及其派出机构对证券公司的分类监管评级。',
      };
    }
    if (flag === pageFlag.FUTURES) {
      return {
        title: '证监会评级',
        content: '证监会对期货公司的分类监管评级。',
      };
    }
    if (flag === pageFlag.INSURANCEINSURANCE) {
      return {
        title: '风险综合评级',
        content: '银保监会(原)对保险公司法人机构的分类监管评级。',
      };
    }
    return {};
  }, [flag]);

  const column = useMemo(
    () =>
      [
        {
          title: '序号',
          dataIndex: 'index',
          width: Math.max(`${pager.current * pager.pageSize}`.length * 8 + PADDING, MIN_WIDTH),
          fixed: 'left',
          className: 'pdd-8',
          render: (text: string, obj: any, i: number) => {
            return <span>{(pager.current - 1) * pager.pageSize + i + 1}</span>;
          },
        },
        {
          title: <span>企业名称</span>,
          dataIndex: 'enterpriseInfo',
          align: 'left',
          fixed: 'left',
          width: 232,
          sorter: true,
          wrapLine: true,
          resizable: { max: 940 - Math.max(`${pager.current * pager.pageSize}`.length * 10 + 22, 42) },
          render: (enterpriseInfo?: any, raw?: any) => {
            const { itCode, itNameLight, itName, tags } = enterpriseInfo || {};
            return <CompanyName code={itCode} name={keyWord ? itNameLight : itName} tag={tags} maxWidth={207} />;
          },
        },
        {
          title: <span>最新基金只数</span>,
          dataIndex: 'latestFundNumber',
          align: 'right',
          width: 118,
          sorter: true,
          resizable: true,
          render: (text?: string) => <div>{text || '-'}</div>,
        },
        {
          title: <span>最新管理规模</span>,
          dataIndex: 'latestManageScale',
          align: 'right',
          width: 118,
          sorter: true,
          resizable: true,
          render: (text?: string) => <div>{text || '-'}</div>,
        },
        {
          title: <span>保险公司类型</span>,
          dataIndex: 'insureCompanyType',
          align: 'left',
          width: 118,
          sorter: true,
          resizable: true,
          render: (text?: string) => <div>{text || '-'}</div>,
        },
        {
          title: <span>股东类型</span>,
          dataIndex: 'stockholder',
          align: 'center',
          width: 92,
          sorter: true,
          resizable: true,
          render: (text?: string) => <div>{text || '-'}</div>,
        },
        {
          title: <span>法定代表人</span>,
          dataIndex: 'legalRepresentative',
          align: 'left',
          width: 132,
          sorter: true,
          resizable: true,
          wrapLine: true,
          render: (text?: string) => <TextOverflow row={3}>{text || '-'}</TextOverflow>,
        },
        {
          title: <span>注册资本</span>,
          dataIndex: 'registerCapital',
          align: 'right',
          width: 134,
          sorter: true,
          resizable: true,
          wrapLine: true,
          render: (text?: string) => <div>{text || '-'}</div>,
        },
        {
          title: <span>成立日期</span>,
          dataIndex: 'establishDate',
          align: 'left',
          width: 92,
          sorter: true,
          resizable: true,
          wrapLine: true,
          render: (text?: string) => <div>{text || '-'}</div>,
        },
        {
          title: <div style={{ textAlign: 'center' }}>注册地</div>,
          dataIndex: 'registerArea',
          align: 'left',
          width: 189,
          resizable: true,
          wrapLine: true,
          render: (text?: string) => <TextOverflow row={3}>{text || '-'}</TextOverflow>,
        },
        {
          title: (
            <PopoverWrapper>
              <span>{rateConfig.title}</span>
              <Popover
                overlayClassName={`regionalFinancialSource-${flag}-popover`}
                placement={'bottom'}
                align={{
                  offset: [0, -3],
                }}
                content={rateConfig.content}
                getPopupContainer={() => document.querySelector(`#area-regionalFinancialSource-${flag}`) as HTMLElement}
              >
                <img className="update-help-img" height={12} src={require('@/assets/images/common/help.png')} alt="" />
              </Popover>
            </PopoverWrapper>
          ),
          dataIndex: 'rate',
          align: 'center',
          width: 135,
          sorter: true,
          resizable: true,
          render: (text?: string, raw?: any) => (
            <Rating text={text || ''} fileUrl={raw?.url || ''} rateYear={raw?.rateYear} />
          ),
        },
        {
          title: <span>报告期</span>,
          dataIndex: 'reportPeriod',
          align: 'right',
          width: 87,
          sorter: true,
          resizable: true,
          render: (text?: string) => <div>{text || '-'}</div>,
        },
        {
          title: <span>营业收入</span>,
          dataIndex: 'operatingRevenue',
          align: 'right',
          width: 118,
          sorter: true,
          resizable: true,
          render: (text?: string) => <div>{text || '-'}</div>,
        },
        {
          title: <span>总资产</span>,
          dataIndex: 'totalAsset',
          align: 'right',
          width: 118,
          sorter: true,
          resizable: true,
          render: (text?: string) => <div>{text || '-'}</div>,
        },
        {
          title: <span>净利润</span>,
          dataIndex: 'netProfit',
          align: 'right',
          width: 118,
          sorter: true,
          resizable: true,
          render: (text?: string) => <div>{text || '-'}</div>,
        },
      ].map((item) => {
        if (!ascColumns.includes(item.dataIndex)) {
          return {
            ...item,
            sortDirections: sortDescend,
          };
        }
        return item;
      }),
    [pager, keyWord, flag, rateConfig],
  );

  return rebuildColumn(columnsConfig[flag], column);
};

export default useColumns;
