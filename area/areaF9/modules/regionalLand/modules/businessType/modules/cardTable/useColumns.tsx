import { useCallback } from 'react';

import { ColumnsType } from 'antd/es/table';

import { ScreeTimeType } from '@/pages/area/areaF9/modules/regionalLand/const';
import { useCtx } from '@/pages/area/areaF9/modules/regionalLand/modules/businessType/provider';
import { formatThreeNumber, formatTime } from '@/pages/area/areaF9/modules/regionalLand/utils';

import styles from '@/pages/area/areaF9/modules/regionalLand/modules/landTransfer/styles.module.less';
interface Props {
  setModalVisible: (visible: boolean) => void;
  setModalData: (data: any) => void;
}

const useColumns = ({ setModalVisible, setModalData }: Props) => {
  const {
    state: {
      currentPage,
      otherFilter: { timeStatisticsType },
    },
  } = useCtx();
  const handleOpenModal = useCallback(
    (data) => {
      if (data) {
        setModalData({
          titleYear: data.date || '-',
          total: data.total || '-',
          detailDate: data.detaildate || '-',
          countName: data.countName || '-',
          enterpriseType: data.enterpriseType || '',
        });
        setModalVisible(true);
      }
    },
    [setModalData, setModalVisible],
  );
  const columns: ColumnsType<any> = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      className: 'index-col',
      width: Math.max(`${(currentPage - 1) * 50}`.length * 13, 42),
      align: 'center',
      fixed: 'left',
      render: (_, __, i) => i + 1 + (currentPage - 1) * 50,
    },
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      width:
        timeStatisticsType === ScreeTimeType.MONTH
          ? 80
          : timeStatisticsType === ScreeTimeType.QUARTER || timeStatisticsType === ScreeTimeType.HALF_YEAR
          ? 118
          : 68,
      align: 'center',
      fixed: 'left',
    },
    {
      title: '成交总金额(亿元)',
      dataIndex: 'landDealTotalPrice',
      key: 'landDealTotalPrice',
      width: 134,
      align: 'right',
      fixed: 'left',
      sorter: true,
      render(text: any, row: any) {
        const { date, landDealTotalPrice } = row;
        const detaildate = formatTime(date);
        const total = landDealTotalPrice;
        const countName = '成交总金额(亿元):';
        const modalDate = { date, detaildate, total, countName };
        return text === '0.00' ? (
          <span>{formatThreeNumber(text)}</span>
        ) : (
          <span className={styles['cancelOrPutoffIssuance-link']} onClick={() => handleOpenModal(modalDate)}>
            {formatThreeNumber(text) || '-'}
          </span>
        );
      },
    },
    {
      title: '城投企业',
      children: [
        {
          align: 'right',
          dataIndex: 'urbanLandDealAmount',
          key: 'urbanLandDealAmount',
          sorter: true,
          title: '拿地金额(亿元)',
          width: 122,
          render(text, row) {
            const { date, urbanLandDealAmount } = row;
            const detaildate = formatTime(date);
            const total = urbanLandDealAmount;
            const countName = '城投企业拿地金额(亿元):';
            const enterpriseType = '2';
            const modalDate = { date, detaildate, total, countName, enterpriseType };
            return text === '0.00' ? (
              <span>{formatThreeNumber(text)}</span>
            ) : (
              <span className={styles['cancelOrPutoffIssuance-link']} onClick={() => handleOpenModal(modalDate)}>
                {formatThreeNumber(text) || '-'}
              </span>
            );
          },
        },
        {
          align: 'right',
          dataIndex: 'urbanLandDealAmountRatio',
          key: 'urbanLandDealAmountRatio',
          sorter: true,
          title: '金额占比(%)',
          width: 110,
          render(text) {
            return text ? text : '-';
          },
        },
      ],
    },
    {
      title: '央企',
      children: [
        {
          align: 'right',
          dataIndex: 'centralLandDealAmount',
          key: 'centralLandDealAmount',
          sorter: true,
          title: '拿地金额(亿元)',
          width: 122,
          render(text, row) {
            const { date, centralLandDealAmount } = row;
            const detaildate = formatTime(date);
            const total = centralLandDealAmount;
            const countName = '央企拿地金额(亿元):';
            const enterpriseType = '4';
            const modalDate = { date, detaildate, total, countName, enterpriseType };
            return text === '0.00' ? (
              <span>{formatThreeNumber(text)}</span>
            ) : (
              <span className={styles['cancelOrPutoffIssuance-link']} onClick={() => handleOpenModal(modalDate)}>
                {formatThreeNumber(text) || '-'}
              </span>
            );
          },
        },
        {
          align: 'right',
          dataIndex: 'centralLandDealAmountRatio',
          key: 'centralLandDealAmountRatio',
          sorter: true,
          title: '金额占比(%)',
          width: 110,
          render(text) {
            return text ? text : '-';
          },
        },
      ],
    },
    {
      title: '国企',
      children: [
        {
          align: 'right',
          dataIndex: 'stateLandDealAmount',
          key: 'stateLandDealAmount',
          sorter: true,
          title: '拿地金额(亿元)',
          width: 122,
          render(text, row) {
            const { date, stateLandDealAmount } = row;
            const detaildate = formatTime(date);
            const total = stateLandDealAmount;
            const countName = '国企拿地金额(亿元):';
            const enterpriseType = '5';
            const modalDate = { date, detaildate, total, countName, enterpriseType };
            return text === '0.00' ? (
              <span>{formatThreeNumber(text)}</span>
            ) : (
              <span className={styles['cancelOrPutoffIssuance-link']} onClick={() => handleOpenModal(modalDate)}>
                {formatThreeNumber(text) || '-'}
              </span>
            );
          },
        },
        {
          align: 'right',
          dataIndex: 'stateLandDealAmountRatio',
          key: 'stateLandDealAmountRatio',
          sorter: true,
          title: '金额占比(%)',
          width: 110,
          render(text) {
            return text ? text : '-';
          },
        },
      ],
    },
    {
      title: '民企',
      children: [
        {
          align: 'right',
          dataIndex: 'privateLandDealAmount',
          key: 'privateLandDealAmount',
          sorter: true,
          title: '拿地金额(亿元)',
          width: 122,
          render(text, row) {
            const { date, privateLandDealAmount } = row;
            const detaildate = formatTime(date);
            const total = privateLandDealAmount;
            const countName = '民企拿地金额(亿元)';
            const enterpriseType = '6';
            const modalDate = { date, detaildate, total, countName, enterpriseType };
            return text === '0.00' ? (
              <span>{formatThreeNumber(text)}</span>
            ) : (
              <span className={styles['cancelOrPutoffIssuance-link']} onClick={() => handleOpenModal(modalDate)}>
                {formatThreeNumber(text) || '-'}
              </span>
            );
          },
        },
        {
          align: 'right',
          dataIndex: 'privateLandDealAmountRatio',
          key: 'privateLandDealAmountRatio',
          sorter: true,
          title: '金额占比(%)',
          width: 110,
          render(text) {
            return text ? text : '-';
          },
        },
      ],
    },
    {
      title: '房企',
      children: [
        {
          align: 'right',
          dataIndex: 'realEstateLandDealAmount',
          key: 'realEstateLandDealAmount',
          sorter: true,
          title: '拿地金额(亿元)',
          width: 122,
          render(text, row) {
            const { date, realEstateLandDealAmount } = row;
            const detaildate = formatTime(date);
            const total = realEstateLandDealAmount;
            const countName = '房企拿地金额(亿元):';
            const enterpriseType = '3';
            const modalDate = { date, detaildate, total, countName, enterpriseType };
            return text === '0.00' ? (
              <span>{formatThreeNumber(text)}</span>
            ) : (
              <span className={styles['cancelOrPutoffIssuance-link']} onClick={() => handleOpenModal(modalDate)}>
                {formatThreeNumber(text) || '-'}
              </span>
            );
          },
        },
        {
          align: 'right',
          dataIndex: 'realEstateLandDealAmountRatio',
          key: 'realEstateLandDealAmountRatio',
          sorter: true,
          title: '金额占比(%)',
          width: 110,
          render(text) {
            return text ? text : '-';
          },
        },
      ],
    },
    {
      title: '上市公司',
      children: [
        {
          align: 'right',
          dataIndex: 'listingLandDealAmount',
          key: 'listingLandDealAmount',
          sorter: true,
          title: '拿地金额(亿元)',
          width: 122,
          render(text, row) {
            const { date, listingLandDealAmount } = row;
            const detaildate = formatTime(date);
            const total = listingLandDealAmount;
            const enterpriseType = '1';
            const countName = '上市公司拿地金额(亿元):';
            const modalDate = { date, detaildate, total, countName, enterpriseType };
            return text === '0.00' ? (
              <span>{formatThreeNumber(text)}</span>
            ) : (
              <span className={styles['cancelOrPutoffIssuance-link']} onClick={() => handleOpenModal(modalDate)}>
                {formatThreeNumber(text) || '-'}
              </span>
            );
          },
        },
        {
          align: 'right',
          dataIndex: 'listingLandDealAmountRatio',
          key: 'listingLandDealAmountRatio',
          sorter: true,
          title: '金额占比(%)',
          width: 110,
          render(text) {
            return text ? text : '-';
          },
        },
      ],
    },
  ];

  return columns;
};

export default useColumns;
