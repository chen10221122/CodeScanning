import cn from 'classnames';

import { BondFicancialParams } from '@/pages/area/areaCompany/api/regionFinancingApi';
import No1 from '@/pages/area/areaCompany/assets/No1.svg';
import No2 from '@/pages/area/areaCompany/assets/No2.svg';
import No3 from '@/pages/area/areaCompany/assets/No3.svg';
import CompanyWithTags from '@/pages/area/areaCompany/components/tableCpns/companyWithTags';
import PercentBar from '@/pages/area/areaCompany/components/tableCpns/percentBar';
import { REGIONAL_PAGE } from '@/pages/area/areaCompany/configs';
import { formatNumber } from '@/utils/format';
import { redirectToRisk } from '@/utils/redirectToRiskGlobal';

interface Props {
  id: string;
  pageType: REGIONAL_PAGE;
  pageParams: BondFicancialParams;
  /** 接口返回有数据的一级表头 */
  titleArr: Record<string, string>[];
  updateParam?: Function;
  handleOpenModal: (modalType: REGIONAL_PAGE, row: Record<string, any>, pageParams: BondFicancialParams) => void;
}

/** 二级表头 */
const secondTitle = [
  { name: '偿还金额(亿)', code: 'amount' },
  { name: '数量(只)', code: 'quantity' },
];

/** 飘蓝可点开弹窗的列对应code */
const openModalCode = ['quantity'];

/** 企业偿债压力 */
export default ({ pageParams, titleArr = [], handleOpenModal }: Props) => {
  const { sortKey, sortRule } = pageParams;

  /** 一级表头 */
  const titleList = titleArr.map((list) => ({
    title: list.name,
    changeDate: list.code,
  }));

  const columns = titleList.map((list: Record<string, any>, idx: number) => {
    const { title, changeDate } = list;
    return {
      title,
      children: secondTitle.map(({ name, code }) => ({
        title: !idx && code === 'amount' ? '存量金额(亿)' : name,
        key: `${title}_${code}`,
        dataIndex: `${title}_${code}`,
        align: 'right',
        width: code === 'amount' ? 118 : 98,
        sorter: true,
        sortOrder: sortKey === `${title}_${code}` ? `${sortRule}end` : null,
        render: (text: string, record: Record<string, any>) => {
          if (openModalCode.includes(code)) {
            // 存量列打开存量弹窗，偿还列打开偿还弹窗
            const modalType = idx
              ? REGIONAL_PAGE.FINANCING_NOTFINANCIAL_BOND_REPAY
              : REGIONAL_PAGE.FINANCING_NOTFINANCIAL_BOND_STOCK;
            return (
              <span
                className={cn({ numberModal: text })}
                onClick={() => {
                  if (text) handleOpenModal(modalType, { ...record, changeDate }, pageParams);
                }}
              >
                {text || '-'}
              </span>
            );
          }
          return formatNumber(text) || '-';
        },
      })),
    };
  });
  return {
    originColumns: [
      {
        title: '序号',
        dataIndex: 'sort',
        key: 'sort',
        width: Math.max(`${pageParams.from + 50}`.length * 16, 50),
        fixed: 'left',
        render: (text: string, record: Record<string, any>, index: number) => {
          const sort = pageParams.from + index + 1;
          if (sort > 3) {
            return sort;
          } else {
            let imgFile = No1;
            if (sort === 2) imgFile = No2;
            else if (sort === 3) imgFile = No3;

            return <img src={imgFile} alt="排名" />;
          }
        },
      },
      {
        title: '公司名称',
        dataIndex: 'name',
        key: 'name',
        width: 260,
        fixed: 'left',
        render: (text: string, record: Record<string, any>) => {
          return (
            <CompanyWithTags type="company" data={record} pageParams={pageParams} handleOpenModal={redirectToRisk} />
          );
        },
      },
      {
        title: '偿还趋势图',
        dataIndex: 'name',
        key: 'name',
        width: 106,
        render: (text: string, record: Record<string, any>, index: number) => {
          return <PercentBar data={record} handleOpenModal={handleOpenModal} pageParams={pageParams} />;
        },
      },
      ...columns,
    ],
  };
};
