import { useContext, useMemo } from 'react';

import { useMemoizedFn } from 'ahooks';
import { Popover } from 'antd';
import { pick } from 'lodash';

import { Image } from '@/components/layout';
import { useSelector } from '@/pages/area/areaF9/context';
import { Left } from '@/pages/area/areaFinancingBoard/components/moduleWrapper/styles';
import { MODAL_TYPE } from '@/pages/area/areaFinancingBoard/config';
import { useConditionCtx } from '@/pages/area/areaFinancingBoard/context';
import { FinancingScaleContext } from '@/pages/area/areaFinancingBoard/modules/financingScale/index';
import { DetailModalTypeEnum } from '@/pages/area/areaFinancingBoard/modules/stockMarket/modal/type';
import type { FinancingScaleList } from '@/pages/area/areaFinancingBoard/types';

import styles from '../style.module.less';

const useColumns = (handleOpenModal: (row: FinancingScaleList, i: number) => void) => {
  const {
    state: { condition },
    update,
  } = useConditionCtx();

  const { year } = useContext(FinancingScaleContext);

  const { areaInfo } = useSelector((store) => ({ areaInfo: store.areaInfo }));

  const handleModalClick = useMemoizedFn(({ title, modalTital, modalType, defaultCondition, row }: any) => {
    update((d) => {
      d.visible = true;
      d.showTabs = true;
      d.type = MODAL_TYPE.FINANCINGSCALE;
      d.detailModalConfig.title = title;
      d.detailModalConfig.modalTitle = modalTital;
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
            year: year,
          });
          break;
        default:
          d.detailModalConfig.defaultCondition = Object.assign({
            sortRule: 'desc',
            sortKey: [DetailModalTypeEnum.StockADistribution].includes(modalType) ? 'listingDate' : 'listingDate',
            ...pick(condition, 'provinceCode', 'cityCode', 'countyCode'),
            ...defaultCondition,
            endYear: year,
          });
          break;
      }
    });
  });

  const columns = useMemo(
    () => [
      {
        title: '融资类型',
        dataIndex: 'financeType',
        width: 95,
        align: 'left',
        className: 'pdd-8',
        render: (text: string, obj: FinancingScaleList, i: number) => {
          return (
            <Left>
              <span className={i === 5 ? 'bold' : ''}>{text}</span>
              {i === 0 ? (
                <Popover
                  content={'不包含”国债“、”央行票据“、”政策性金融债“三种债券类型。'}
                  placement="bottom"
                  overlayClassName={styles['board-popover']}
                >
                  <Image
                    src={require('@/assets/images/area/small_question@2x.png')}
                    width={12}
                    height={12}
                    style={{ marginLeft: 2, cursor: 'pointer' }}
                  />
                </Popover>
              ) : null}
            </Left>
          );
        },
      },
      {
        title: '融资次数',
        dataIndex: 'financeNum',
        width: 68,
        align: 'right',
        className: 'pdd-8',
        render: (text: string | number, obj: FinancingScaleList, i: number) => {
          return (
            <span>
              {text === 0 || text === '0' ? (
                0
              ) : text ? (
                <span
                  className={i !== 4 ? 'link' : 'bold'}
                  onClick={() => {
                    if (i === 4) return;
                    if (i === 3) {
                      handleModalClick({
                        title: `${areaInfo?.regionName || ''}${year}年A股IPO融资明细`,
                        modalTital: `${areaInfo?.regionName || ''}${year}年股权融资明细`,
                        modalType: 'A股IPO融资明细',
                        defaultCondition: { equityType: 'IPO' },
                        row: obj,
                      });
                    } else {
                      handleOpenModal(obj, i);
                    }
                  }}
                >
                  {text}
                </span>
              ) : (
                '-'
              )}
            </span>
          );
        },
      },
      {
        title: '融资方数量',
        dataIndex: 'financierNum',
        width: 81,
        align: 'right',
        className: 'pdd-8',
        render: (text: string, obj: FinancingScaleList, i: number) => {
          return <span className={i === 5 ? 'bold' : ''}>{text || '-'}</span>;
        },
      },
      {
        title: '融资总额(亿元)',
        dataIndex: 'financeAmount',
        width: 104,
        align: 'right',
        className: 'pdd-8',
        render: (text: string, obj: FinancingScaleList, i: number) => {
          return <span className={i === 5 ? 'bold' : ''}>{text || '-'}</span>;
        },
      },
      {
        title: '较上年变动(亿元)',
        dataIndex: 'financeAmountCompare',
        width: 116,
        align: 'right',
        className: 'pdd-8',
        render: (text: string, obj: FinancingScaleList, i: number) => {
          return <span className={i === 5 ? 'bold' : ''}>{text || '-'}</span>;
        },
      },
      {
        title: '融资总额占比(%)',
        dataIndex: 'percent',
        width: 116,
        align: 'right',
        className: 'pdd-8',
        render: (text: string, obj: FinancingScaleList, i: number) => {
          return <span className={i === 5 ? 'bold' : ''}>{text || '-'}</span>;
        },
      },
    ],
    [handleOpenModal, areaInfo?.regionName, handleModalClick, year],
  );

  const x = columns.reduce((t, c) => (t += c.width), 0);

  return [columns, x];
};

export default useColumns;
