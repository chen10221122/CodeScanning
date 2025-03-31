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
          titleYear: data.date || '-',
          detailDate: data.detaildate || '',
          countName: data.countName || '-',
          landCount: data.landCount || '-',
          // 弹窗推出宗数
          total: data.total || '-',
          // 按土地用途传参
          landUsageFirstType: data.landUsageFirstType || '',
          landUsageSecondType: data.landUsageSecondType || '',
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
      title: '土地成交:全部',
      children: [
        {
          align: 'right',
          dataIndex: 'landDealTotalPrice',
          key: 'landDealTotalPrice',
          resizable: false,
          sorter: true,
          tableTitle: '成交金额(亿元)',
          title: '成交金额(亿元)',
          unit: '亿元',
          width: 122,
          render(text: any, row: any) {
            // return text ? formatThreeNumber(text)  : '-';
            const { date, landCount, landDealTotalPrice } = row;
            // 此处传的成交宗数
            const total = landDealTotalPrice;
            // 明细弹窗顶部展示的名称
            const countName = '成交总金额(亿元):';
            const detaildate = formatTime(date);
            const modalDate = { date, detaildate, landCount, total, countName };
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
          tableTitle: '成交面积(万㎡)',
          title: '成交面积(万㎡)',
          unit: '万㎡',
          width: 124,
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
          tableTitle: '成交宗数',
          title: '成交宗数',
          width: 92,
          render(text: any) {
            return text ? formatThreeNumber(text) : '-';
          },
        },
      ],
    },
    {
      title: '土地成交:住宅用地',
      children: [
        {
          align: 'right',
          dataIndex: 'landDealTotalPriceResidential',
          key: 'landDealTotalPriceResidential',
          resizable: false,
          sorter: true,
          tableTitle: '成交金额(亿元)',
          title: '成交金额(亿元)',
          unit: '亿元',
          width: 122,
          render(text: any, row: any) {
            // return text ? formatThreeNumber(text)  : '-';
            const { date, landCount, landDealTotalPriceResidential } = row;
            const landUsageFirstType = '7';
            const landUsageSecondType = '0701,0702,0703';
            const total = landDealTotalPriceResidential;
            const countName = '住宅用地成交金额(亿元):';
            const detaildate = formatTime(date);
            const modalDate = {
              date,
              detaildate,
              landCount,
              countName,
              landUsageFirstType,
              landUsageSecondType,
              total,
            };
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
          dataIndex: 'landDealTotalAreaResidential',
          key: 'landDealTotalAreaResidential',
          resizable: false,
          sorter: true,
          tableTitle: '成交面积(万㎡)',
          title: '成交面积(万㎡)',
          unit: '万㎡',
          width: 124,
          render(text: any) {
            return text ? formatThreeNumber(text) : '-';
          },
        },
        {
          align: 'right',
          dataIndex: 'landDealTotalCountResidential',
          key: 'landDealTotalCountResidential',
          resizable: false,
          sorter: true,
          tableTitle: '成交宗数',
          title: '成交宗数',
          width: 92,
          render(text: string) {
            return text ? formatThreeNumber(text) : '-';
          },
        },
      ],
    },
    {
      title: '土地成交:商服用地',
      children: [
        {
          align: 'right',
          dataIndex: 'landDealTotalPriceBusiness',
          key: 'landDealTotalPriceBusiness',
          resizable: false,
          sorter: true,
          tableTitle: '成交金额(亿元)',
          title: '成交金额(亿元)',
          unit: '亿元',
          width: 122,
          render(text: any, row: any) {
            // return text ? formatThreeNumber(text)  : '-';
            const { date, landCount, landDealTotalPriceBusiness } = row;
            const landUsageFirstType = '5';
            const landUsageSecondType = '0501,0502,0503,0504,0505,0506,0507';
            const total = landDealTotalPriceBusiness;
            const countName = '商服用地成交金额(亿元):';
            const detaildate = formatTime(date);
            const modalDate = {
              date,
              detaildate,
              countName,
              landCount,
              landUsageFirstType,
              landUsageSecondType,
              total,
            };
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
          dataIndex: 'landDealTotalAreaBusiness',
          key: 'landDealTotalAreaBusiness',
          resizable: false,
          sorter: true,
          tableTitle: '成交面积(万㎡)',
          title: '成交面积(万㎡)',
          unit: '万㎡',
          width: 124,
          render(text: any) {
            return text ? formatThreeNumber(text) : '-';
          },
        },
        {
          align: 'right',
          dataIndex: 'landDealTotalCountBusiness',
          key: 'landDealTotalCountBusiness',
          resizable: false,
          sorter: true,
          tableTitle: '成交宗数',
          title: '成交宗数',
          width: 92,
          render(text: string) {
            return text ? formatThreeNumber(text) : '-';
          },
        },
      ],
    },
    {
      title: '土地成交:工矿仓储用地',
      children: [
        {
          align: 'right',
          dataIndex: 'landDealTotalPriceMining',
          key: 'landDealTotalPriceMining',
          resizable: false,
          sorter: true,
          tableTitle: '成交金额(亿元)',
          title: '成交金额(亿元)',
          unit: '亿元',
          width: 122,
          render(text: any, row: any) {
            // return text ? formatThreeNumber(text)  : '-';
            const { date, landCount, landDealTotalPriceMining } = row;
            const landUsageFirstType = '6';
            const landUsageSecondType = '0601,0602,0603,0604';
            const total = landDealTotalPriceMining;
            const countName = '工矿仓储用地成交金额(亿元):';
            const detaildate = formatTime(date);
            const modalDate = {
              date,
              detaildate,
              countName,
              landCount,
              landUsageFirstType,
              landUsageSecondType,
              total,
            };
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
          dataIndex: 'landDealTotalAreaMining',
          key: 'landDealTotalAreaMining',
          resizable: false,
          sorter: true,
          tableTitle: '成交面积(万㎡)',
          title: '成交面积(万㎡)',
          unit: '万㎡',
          width: 124,
          render(text: string) {
            return text ? formatThreeNumber(text) : '-';
          },
        },
        {
          align: 'right',
          dataIndex: 'landDealTotalCountMining',
          key: 'landDealTotalCountMining',
          resizable: false,
          sorter: true,
          tableTitle: '成交宗数',
          title: '成交宗数',
          width: 92,
          render(text: string) {
            return text ? formatThreeNumber(text) : '-';
          },
        },
      ],
    },
    {
      title: '土地成交:其他用地',
      children: [
        {
          align: 'right',
          dataIndex: 'landDealTotalPriceOther',
          key: 'landDealTotalPriceOther',
          resizable: false,
          sorter: true,
          tableTitle: '成交金额(亿元)',
          title: '成交金额(亿元)',
          unit: '亿元',
          width: 122,
          render(text: any, row: any) {
            const { date, landCount, landDealTotalPriceOther } = row;
            const landUsageFirstType = '8,9,10';
            // 其他用地的筛选代码
            const landUsageSecondType = '0801,0802,0803,0804,0805,0806,0807,0901,0902,0903,0904,0905,0906,1001';
            const total = landDealTotalPriceOther;
            const countName = '其他用地成交金额(亿元):';
            const detaildate = formatTime(date);
            const modalDate = {
              date,
              detaildate,
              countName,
              landCount,
              landUsageFirstType,
              landUsageSecondType,
              total,
            };
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
          dataIndex: 'landDealTotalAreaOther',
          key: 'landDealTotalAreaOther',
          resizable: false,
          sorter: true,
          tableTitle: '成交面积(万㎡)',
          title: '成交面积(万㎡)',
          unit: '万㎡',
          width: 124,
          render(text: string) {
            return text ? formatThreeNumber(text) : '-';
          },
        },
        {
          align: 'right',
          dataIndex: 'landDealTotalCountOther',
          key: 'landDealTotalCountOther',
          resizable: false,
          sorter: true,
          tableTitle: '成交宗数',
          title: '成交宗数',
          width: 92,
          render(text: string) {
            return text ? formatThreeNumber(text) : '-';
          },
        },
      ],
    },
  ];

  return columns;
};

export default useColumns;
