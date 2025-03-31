import { useEffect, useState, useMemo } from 'react';

import { useMemoizedFn, useRequest } from 'ahooks';
import cn from 'classnames';

import { ScreenType, Screen, Options } from '@/components/screen';
import { BondFicancialParams } from '@/pages/area/areaCompany/api/regionFinancingApi';
import { getBondFilterData } from '@/pages/area/areaCompany/api/screenApi';
import { getItems } from '@/pages/area/areaCompany/components/filterInfo/menuConf';
import TableTooltip from '@/pages/area/areaCompany/components/tableCpns/toolTip';
import { REGIONAL_PAGE, BondParamMap } from '@/pages/area/areaCompany/configs';
import ControlledScreenWrapper from '@/pages/bond/cityInvestMap/components/controlledScreenWrapper';
import { formatNumber } from '@/utils/format';

interface Props {
  id: string;
  pageType: REGIONAL_PAGE;
  // curPage: number;
  pageParams: BondFicancialParams;
  /** 接口返回有数据的一级表头 */
  titleArr: Record<string, string>[];
  updateParam?: Function;
  handleOpenModal: (row: Record<string, any>, pageParams: BondFicancialParams) => void;
}

/** 债券存量、发行、偿还 页面的二级表头 */
const secondType = [
  { name: '金额(亿)', code: 'amount' },
  { name: '数量(只)', code: 'quantity' },
];

/** 净融资页面的二级表头 */
const netSecondType = [
  { name: '净融资(亿)', code: 'netFinancingAmount' },
  { name: '发行量(亿)', code: 'issueAmount' },
  { name: '偿还量(亿)', code: 'repayAmount' },
];

/** 飘蓝可点开弹窗的列对应code */
const openModalCode = ['quantity', 'netFinancingAmount'];

/** 非金融企业 */
export default ({ id, pageType, pageParams, titleArr = [], handleOpenModal }: Props) => {
  /** 一级表头 */
  const titleList = titleArr.map((list) => ({
    title: list.name,
    titleCode: list.code,
    prompt: list.name === '产业债' ? '不包含利率债和金融债' : '',
  }));
  /** 二级表头 */
  let secondTitle = secondType;
  if (pageType === REGIONAL_PAGE.FINANCING_NOTFINANCIAL_NET_FINANCE) {
    secondTitle = netSecondType;
  }

  const columns = titleList.map((list: Record<string, any>) => {
    const { title, prompt, titleCode } = list;
    return {
      title: prompt ? (
        <span style={{ whiteSpace: 'nowrap' }}>
          {title}
          <TableTooltip
            title={prompt}
            getPopupContainer={() => document.getElementById(id) || document.body}
            placement="bottom"
          />
        </span>
      ) : (
        title
      ),
      children: secondTitle.map(({ name, code }) => ({
        title: name,
        key: `${title}_${code}`,
        dataIndex: `${title}_${code}`,
        align: 'right',
        width: 98,
        render: (text: string, record: Record<string, any>) => {
          if (openModalCode.includes(code)) {
            /** 净融资金额保留两位小数，只数只显示千分位 */
            const value = code === 'netFinancingAmount' ? formatNumber(text) : formatNumber(text, 0);
            return (
              <span className={cn({ 'numberModal': text })} onClick={() => { if (text) handleOpenModal({ ...record, title, titleCode }, pageParams) }}>
                {value || '-'}
              </span>
            );
          }
          return formatNumber(text) || '-';
        },
      }))
    }
  })
  return {
    originColumns: [
      {
        title: '日期',
        dataIndex: 'name',
        key: 'name',
        width: 96,
        fixed: 'left',
      },
      ...columns
    ]
  }
}

/** 金融企业 */
export const useFinanceColumns = ({ id, pageType, pageParams, titleArr = [], updateParam, handleOpenModal }: Props) => {
  const [filterData, setFilterData] = useState([]);

  const { run: runBondFinancial, loading: headLoading } = useRequest(getBondFilterData, {
    manual: true,
    onSuccess(res: any) {
      /** 表头筛选项 */
      const filterData = res?.data?.map((opt: Record<string, any>) => {
        return {
          title: opt.name,
          formatTitle: (row: any) => {
            const len = row?.length || '';
            return (<>{opt.name} <span style={{ marginLeft: len ? '0px' : '-3px' }}>{len}</span></>);
          },
          option: {
            type: opt.multiple ? ScreenType.MULTIPLE : ScreenType.SINGLE,
            hasSelectAll: opt.hasSelectAll,
            children: getItems(opt.children, opt.value),
          },
        }
      }) || [];
      setFilterData(filterData);
    },
    onError() {
      setFilterData([]);
    },
  });

  // 表头筛选项接口
  useEffect(() => {
    const params = BondParamMap.get(pageType);
    if (params) runBondFinancial({ ...params, tabType: '3', titleFilter: '1' });
  }, [pageType, runBondFinancial]);

  const titleList = useMemo(() => {
    if (titleArr.length && filterData.length) {
      /** 一级表头 */
      return titleArr.map(list => {
        // 给有数据的表头替换成对应的筛选项
        const filterItem: any = filterData.find((item: Record<string, any>) => item.title === list.name)

        if (filterItem) return { ...filterItem, titleCode: list.code };
        return {
          title: list.name,
          titleCode: list.code,
        }
      })
    }
    return []
  }, [titleArr, filterData])

  /** 表头筛选操作 */
  const onHeadChange = useMemoizedFn((title: string, curMenu: Record<string, any>[]) => {
    const keyValueObj = curMenu.reduce((pre: Record<string, any>, cur: Record<string, any>,) => {
      const value = pre[cur.key] ? ',' + cur.code : cur.code;
      return {
        ...pre,
        [cur.key]: `${pre[cur.key] || ''}${value}`
      }
    }, {})
    updateParam?.(() => ({
      ...pageParams,
      commercialBankBonds: title === '商业银行债' ? keyValueObj?.commercialBankBonds : pageParams?.commercialBankBonds,
      nonBankFinancialBonds: title === '非银行金融债' ? keyValueObj?.nonBankFinancialBonds : pageParams?.nonBankFinancialBonds,
    }))
  })

  const columns = useMemo(() => {
    /** 二级表头 */
    let secondTitle = secondType;
    if (pageType === REGIONAL_PAGE.FINANCING_FINANCIAL_NET_FINANCE) {
      secondTitle = netSecondType;
    }

    const column = titleList.map((list, idx) => {
      const { title, titleCode, option } = list;

      const newTitle = option ? (
        <ControlledScreenWrapper>
          <Screen
            key={idx + title}
            options={[list] as Options[]}
            onChange={(cur) => onHeadChange(title, cur)}
            getPopContainer={() => document.getElementById(id) || document.body}
          />
        </ControlledScreenWrapper>
      ) : title;

      return {
        title: newTitle,
        children: secondTitle.map(({ name, code }) => ({
          title: name,
          key: `${title}_${code}`,
          dataIndex: `${title}_${code}`,
          width: 98,
          align: 'right',
          render: (text: string, record: Record<string, any>) => {
            if (openModalCode.includes(code)) {
              /** 净融资金额保留两位小数，只数只显示千分位 */
              const value = code === 'netFinancingAmount' ? formatNumber(text) : formatNumber(text, 0);
              return (
                <span className={cn({ 'numberModal': text })} onClick={() => { if (text) handleOpenModal({ ...record, title, titleCode }, pageParams) }}>
                  {value || '-'}
                </span>
              );
            }
            return formatNumber(text) || '-';
          },
        }))
      }
    })
    return [
      {
        title: '日期',
        dataIndex: 'name',
        key: 'name',
        width: 96,
        fixed: 'left',
      },
      ...column
    ]
  }, [titleList, id, pageType, pageParams, handleOpenModal, onHeadChange])

  return { originColumns: columns, headLoading };

}
