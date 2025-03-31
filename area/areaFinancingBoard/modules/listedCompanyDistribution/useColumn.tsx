import { useMemo } from 'react';

import { useMemoizedFn } from 'ahooks';
import classNames from 'classnames';
import { pick } from 'lodash';

import { useSelector } from '@/pages/area/areaF9/context';
import { Left } from '@/pages/area/areaFinancingBoard/components/moduleWrapper/styles';
import { DetailModalTypeEnum } from '@/pages/area/areaFinancingBoard/modules/stockMarket/modal/type';

import { MODAL_TYPE } from '../../config';
import { useConditionCtx } from '../../context';
import { TabType } from './useTab';

const industryTypeMap = new Map<string, number | string>([
  ['第一产业', 1],
  ['第二产业', 2],
  ['第三产业', 3],
  ['总计', ''],
]);

const colors = ['#3986fe', '#F57F50', '#F9D237', '#35CACA', '#73E6BF'];

const useColumn = (type: TabType) => {
  const {
    state: { condition },
    update,
  } = useConditionCtx();

  const { areaInfo } = useSelector((store) => ({ areaInfo: store.areaInfo }));

  const handleModalClick = useMemoizedFn(({ title, modalType, defaultCondition, row }: any) => {
    update((d) => {
      d.visible = true;
      d.type = MODAL_TYPE.COMPANYDISTRIBUTION;
      d.detailModalConfig.title = title;
      d.detailModalConfig.modalType = modalType;
      // 各列详情默认入参不同
      switch (modalType) {
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

  const isTotal = useMemoizedFn((index: number) => {
    if (type === TabType.ENTERPRISE || type === TabType.INDUSTRY) return index === 3;
    return index === 4;
  });

  const columns = useMemo(
    () => [
      {
        title: '类型',
        dataIndex: 'type',
        width: 80,
        align: 'left',
        className: 'pdd-8',
        render: (text: string, obj: any, i: number) => {
          return (
            <Left>
              {!isTotal(i) ? <div className="circle" style={{ background: colors[i] }}></div> : null}
              <span className={isTotal(i) ? 'bold' : ''}>{text}</span>
            </Left>
          );
        },
      },
      {
        title: '公司家数',
        dataIndex: 'count',
        width: 74,
        align: 'right',
        className: 'pdd-8',
        render: (txt: any, raw: Record<string, any>, i: number) => {
          if (!txt) return <>-</>;
          const isHover = !!txt;
          return (
            <div
              className={classNames({ link: isHover, bold: isTotal(i) })}
              onClick={
                isHover
                  ? () => {
                      let listingSector,
                        companyType,
                        industryType = {};
                      switch (type) {
                        case TabType.PLATE:
                          listingSector =
                            raw.type === '主板'
                              ? { listingSector: '沪市主板,深市主板' }
                              : { listingSector: raw.type === '总计' ? '' : raw.type };
                          break;
                        case TabType.ENTERPRISE:
                          companyType =
                            raw.type === '民企'
                              ? { companyType: '民营企业' }
                              : { companyType: raw.type === '总计' ? '' : raw.type };
                          break;
                        case TabType.INDUSTRY:
                          industryType = { industryType: industryTypeMap.get(raw.type) };
                          break;
                        default:
                          break;
                      }
                      handleModalClick({
                        title: `${areaInfo?.regionName}${raw.type === '总计' ? '' : raw.type}上市公司明细`,
                        modalType: 'A股上市公司分布明细',
                        defaultCondition: { ...listingSector, ...companyType, ...industryType },
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
      },
      {
        title: '总市值(亿元)',
        dataIndex: 'amount',
        width: 97,
        align: 'right',
        className: 'pdd-8',
        render: (text: string, obj: any, i: number) => {
          return <span className={isTotal(i) ? 'bold' : ''}>{text || '-'}</span>;
        },
      },
    ],
    [handleModalClick, type, areaInfo?.regionName, isTotal],
  );

  const scrollX = useMemo(() => {
    return columns.reduce((acc, cur) => acc + cur.width, 0);
  }, [columns]);

  return { scrollX, columns };
};

export default useColumn;
