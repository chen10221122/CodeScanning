import { useCallback } from 'react';

// import { ColumnsType } from 'antd/es/table';

import { ColumnsParams } from '@/pages/area/areaF9/modules/regionalLand/const';
import { formatThreeNumber, formatTime } from '@/pages/area/areaF9/modules/regionalLand/utils';

import styles from '@/pages/area/areaF9/modules/regionalLand/modules/landTransfer/styles.module.less';

const useColumns = ({ setModalVisible, setModalData, currentPage, dateWidth }: ColumnsParams) => {
  const PAGESIZE = 50;
  const handleOpenModal = useCallback(
    (data) => {
      if (data) {
        setModalData({
          // 弹窗标题上的年
          titleYear: data.date,
          total: data.total,
          detailDate: data.detaildate,
          landCount: data.landCount,
          stage: data.stage || '',
          countName: data.countName || '',
        });
        setModalVisible(true);
      }
    },
    [setModalData, setModalVisible],
  );
  const columns: any = [
    {
      title: '序号',
      key: 'idx',
      dataIndex: 'idx',
      width: 50 + Math.max((String(currentPage * PAGESIZE).length - 2) * 13, 0),
      fixed: 'left',
      align: 'center',
      render: (_: any, __: any, idx: number) => (currentPage - 1) * PAGESIZE + idx + 1,
    },
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      width: dateWidth,
      align: 'center',
      fixed: 'left',
    },
    {
      title: '土地供应',
      children: [
        {
          align: 'right',
          dataIndex: 'landCount',
          key: 'landCount',
          resizable: false,
          sorter: true,
          tableTitle: '推出宗数(宗)',
          title: '推出宗数(宗)',
          unit: '宗',
          width: 128,
          render(text: any, row: any) {
            // return text ? formatThreeNumber(text)  : '-';
            const { date, landCount } = row;
            const detaildate = formatTime(date);
            const total = landCount;
            const countName = '推出宗数(宗):';
            const modalDate = { date, detaildate, total, countName };
            return text !== '0' && text !== '0.00' ? (
              <span className={styles['cancelOrPutoffIssuance-link']} onClick={() => handleOpenModal(modalDate)}>
                {formatThreeNumber(text) || '-'}
              </span>
            ) : (
              formatThreeNumber(text) || '-'
            );
          },
        },
        {
          align: 'right',
          dataIndex: 'builderArea',
          key: 'builderArea',
          resizable: false,
          sorter: true,
          tableTitle: '推出建面(万㎡)',
          title: '推出建面(万㎡)',
          unit: '万㎡',
          width: 124,
          render(text: any) {
            return text ? formatThreeNumber(text) : '-';
          },
        },
        {
          align: 'right',
          dataIndex: 'landArea',
          key: 'landArea',
          resizable: false,
          sorter: true,
          tableTitle: '推出面积(万㎡)',
          title: '推出面积(万㎡)',
          unit: '万㎡',
          width: 124,
          render(text: any) {
            return text ? formatThreeNumber(text) : '-';
          },
        },
        {
          align: 'right',
          dataIndex: 'startFloorPrice',
          key: 'startFloorPrice',
          resizable: false,
          sorter: true,
          tableTitle: '起始楼面均价(元/㎡)',
          title: '起始楼面均价(元/㎡)',
          unit: '元/㎡',
          width: 148,
          render(text: any) {
            return text ? formatThreeNumber(text) : '-';
          },
        },
      ],
    },
    {
      title: '土地成交',
      children: [
        {
          align: 'right',
          dataIndex: 'landDealTotalPrice',
          key: 'landDealTotalPrice',
          resizable: false,
          sorter: true,
          tableTitle: '土地成交总价(亿元)',
          title: '土地成交总价(亿元)',
          unit: '亿元',
          width: 146,
          render(text: any) {
            return text ? formatThreeNumber(text) : '-';
          },
        },
        {
          align: 'right',
          dataIndex: 'landDealTotalCount',
          key: 'landDealTotalCount',
          resizable: false,
          sorter: true,
          tableTitle: '土地成交宗数(宗)',
          title: '土地成交宗数(宗)',
          unit: '宗',
          width: 136,
          render(text: any, row: any) {
            const { date, landDealTotalCount } = row;
            // date用于构建参数日期口径字段，landCount用于弹窗宗数显示，stage区分推出宗数和成交宗数
            const stage = '2,3';
            const total = landDealTotalCount;
            const countName = '土地成交宗数(宗):';
            const detaildate = formatTime(date);
            const modalDate = { date, detaildate, total, stage, countName };
            return text !== '0' && text !== '0.00' ? (
              <span className={styles['cancelOrPutoffIssuance-link']} onClick={() => handleOpenModal(modalDate)}>
                {formatThreeNumber(text) || '-'}
              </span>
            ) : (
              formatThreeNumber(text) || '-'
            );
          },
        },
        {
          align: 'right',
          dataIndex: 'landDealTotalArea',
          key: 'landDealTotalArea',
          resizable: false,
          sorter: true,
          tableTitle: '成交总面积(万㎡)',
          title: '成交总面积(万㎡)',
          width: 136,
          render(text: string) {
            return text ? formatThreeNumber(text) : '-';
          },
        },
        {
          align: 'right',
          dataIndex: 'landDealPrice',
          key: 'landDealPrice',
          resizable: false,
          sorter: true,
          tableTitle: '成交土地均价(元/㎡)',
          title: '成交土地均价(元/㎡)',
          unit: '元/㎡',
          width: 148,
          render(text: string) {
            return text ? formatThreeNumber(text) : '-';
          },
        },
        {
          align: 'right',
          dataIndex: 'landDealFloorPrice',
          key: 'landDealFloorPrice',
          resizable: false,
          sorter: true,
          tableTitle: '成交楼面均价(元/㎡)',
          title: '成交楼面均价(元/㎡)',
          unit: '元/㎡',
          width: 148,
          render(text: string) {
            return text ? formatThreeNumber(text) : '-';
          },
        },
        {
          align: 'right',
          dataIndex: 'landDealAveragePremiumRate',
          key: 'landDealAveragePremiumRate',
          resizable: false,
          sorter: true,
          tableTitle: '平均溢价率(%)',
          title: '平均溢价率(%)',
          unit: '%',
          width: 124,
          render(text: string) {
            return text ? formatThreeNumber(text) : '-';
          },
        },
      ],
    },
    { title: '', width: '', dataIndex: 'blank', key: 'blank' },
  ];

  return columns;
};

export default useColumns;
