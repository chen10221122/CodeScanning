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
  const handleModalClick = useMemoizedFn(({ title, modalType, defaultCondition, row }: any) => {
    update((d) => {
      d.visible = true;
      d.type = MODAL_TYPE.PEVCFINANCING;
      d.detailModalConfig.title = title;
      d.detailModalConfig.modalType = modalType;
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
            // year: `[${condition?.startYear}0101,${condition?.endYear}1231]`,
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
          title: '日期',
          dataIndex: 'year',
          width: 48,
          align: 'left',
          className: 'pdd-8',
          render: (text: string, raw: any) => {
            return <span>{text || '-'}</span>;
          },
        },
        {
          title: 'PEVC事件数',
          dataIndex: 'pevcEvent',
          width: 125,
          align: 'right',
          className: 'pdd-8',
          modalType: DetailModalTypeEnum.VC,
          defaultCondition: {},
          render: (text: any, raw: any) => {
            return <>{text || '-'}</>;
          },
        },
        {
          title: '融资总额(亿元)',
          dataIndex: 'pevcAmount',
          width: 125,
          align: 'right',
          className: 'pdd-8',
          render: (text: any, raw: any) => {
            return <>{text || '-'}</>;
          },
        },
      ].map((column, index) => {
        return {
          ...column,
          render: (txt: any, raw: Record<string, any>) => {
            if (!txt) return <>-</>;
            const isHover = column.dataIndex === 'pevcEvent';
            return (
              <div
                className={isHover ? 'link' : ''}
                onClick={
                  isHover
                    ? () => {
                        handleModalClick({
                          title: `${areaInfo?.regionName}-${raw?.year}年-PEVC融资明细`,
                          modalType: column.modalType,
                          defaultCondition: column.defaultCondition,
                          row: raw,
                        });
                      }
                    : undefined
                }
              >
                {txt}
              </div>
            );
          },
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
