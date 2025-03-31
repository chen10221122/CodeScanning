import { useMemo } from 'react';

import { useMemoizedFn } from 'ahooks';
import { pick } from 'lodash';

import { useSelector } from '@/pages/area/areaF9/context';
import { DetailModalTypeEnum } from '@/pages/area/areaFinancingBoard/modules/stockMarket/modal/type';

import { MODAL_TYPE } from '../../config';
import { useConditionCtx } from '../../context';

const useColumn = () => {
  const { areaInfo } = useSelector((store) => ({ areaInfo: store.areaInfo }));
  const {
    state: { condition },
    update,
  } = useConditionCtx();
  // 点击出弹窗
  const handleModalClick = useMemoizedFn(({ title, modalType, defaultCondition, row, enterpriseNumber }: any) => {
    update((d) => {
      d.visible = true;
      d.type = MODAL_TYPE.STOCKMARKET;
      d.detailModalConfig.title = title;
      d.detailModalConfig.modalType = modalType;
      d.detailModalConfig.enterpriseNumber = enterpriseNumber;
      // 各列详情默认入参不同
      switch (modalType) {
        case DetailModalTypeEnum.StockAIpo:
        case DetailModalTypeEnum.StockARefinance:
        case DetailModalTypeEnum.NewThirdAdd:
        case DetailModalTypeEnum.VC:
          d.detailModalConfig.defaultCondition = Object.assign({
            sortRule: 'desc',
            sortKey: modalType === DetailModalTypeEnum.VC ? 'publishDate' : 'issueDate',
            ...pick(condition, 'provinceCode', 'cityCode', 'countyCode', 'companyType'),
            ...defaultCondition,
            // year: row.year === '合计' ? `[${condition?.startYear}0101,${condition?.endYear}1231]` : row.year,
            year: row.year,
          });
          break;
        default:
          d.detailModalConfig.defaultCondition = Object.assign({
            sortRule: 'desc',
            sortKey: [DetailModalTypeEnum.StockADistribution].includes(modalType) ? 'listingDate' : 'listingDate',
            ...pick(condition, 'provinceCode', 'cityCode', 'countyCode'),
            ...defaultCondition,
            endYear: row.year,
          });
          break;
      }
    });
  });

  const columns = useMemo(
    () =>
      [
        {
          title: '年度',
          dataIndex: 'year',
          width: 64,
          align: 'left',
          className: 'pdd-8',
          fixed: 'left',
          render: (text: string, raw: any) => {
            return <span>{text || '-'}</span>;
          },
        },
        {
          title: '融资总额（亿元）',
          dataIndex: 'year',
          width: 110,
          align: 'right',
          className: 'pdd-8',
          render: (text: string, item: Record<string, any>) => {
            return item.financingAmount?.financingAmount || '-';
          },
        },
        {
          title: 'A股IPO',
          width: 192,
          modalType: DetailModalTypeEnum.StockAIpo,
          dataIndex: 'aShareIPO',
          defaultCondition: { equityType: 'IPO' },
          children: [
            {
              title: '发行家数',
              dataIndex: 'index3',
              width: 96,
              align: 'right',
            },
            {
              title: '融资额(亿元)',
              dataIndex: 'index4',
              width: 96,
              align: 'right',
            },
          ],
        },
        {
          title: 'A股再融资',
          width: 192,
          dataIndex: 'aShareRefinance',
          modalType: DetailModalTypeEnum.StockARefinance,
          defaultCondition: { equityType: '公开增发,定向增发,配股' },
          children: [
            {
              title: '发行家数',
              dataIndex: 'index5',
              width: 96,
              align: 'right',
            },
            {
              title: '融资额(亿元)',
              dataIndex: 'index6',
              width: 96,
              align: 'right',
            },
          ],
        },
        {
          title: '新三板定增',
          width: 192,
          dataIndex: 'newThreeIncrease',
          modalType: DetailModalTypeEnum.NewThirdAdd,
          defaultCondition: { equityType: '公开增发,定向增发,配股' },
          children: [
            {
              title: '发行家数',
              dataIndex: 'index7',
              width: 96,
              align: 'right',
            },
            {
              title: '融资额(亿元)',
              dataIndex: 'index8',
              width: 96,
              align: 'right',
            },
          ],
        },
      ].map((column, index) => {
        if (index > 1) {
          return {
            ...column,
            children: column.children?.map((child, i) => {
              return {
                ...child,
                render: (txt: any, raw: Record<string, any>) => {
                  const { amount, financingAmount } = raw[column.dataIndex];
                  const v = !i ? amount : financingAmount;
                  const val = v ? v : '-';
                  if (i) {
                    return val;
                  }
                  const isCursor = val !== '-' && val !== '0';
                  return (
                    <div
                      className={isCursor ? 'link' : ''}
                      onClick={() => {
                        if (isCursor) {
                          handleModalClick({
                            title: `${areaInfo?.regionName}-${raw?.year}年-${column.modalType}`,
                            modalType: column.modalType,
                            defaultCondition: column.defaultCondition,
                            row: raw,
                            enterpriseNumber: val,
                          });
                        }
                      }}
                    >
                      {val}
                    </div>
                  );
                },
              };
            }),
          };
        }
        return {
          ...column,
        };
      }),
    [handleModalClick, areaInfo?.regionName],
  );

  const scrollX = useMemo(() => {
    return columns.reduce((acc, cur) => acc + cur.width, 0);
  }, [columns]);

  return { scrollX, columns };
};

export default useColumn;
