import { TableColumnsType, Image } from '@dzh/components';

import Amount from '@/pages/area/areaF9/modules/regionalOverview/industrialPark/components/amount';
import Area from '@/pages/area/areaF9/modules/regionalOverview/industrialPark/components/area';
import Company from '@/pages/area/areaF9/modules/regionalOverview/industrialPark/components/company';
import LineEllipsis from '@/pages/area/areaF9/modules/regionalOverview/industrialPark/components/lineEllipsis';
import { formatNumber } from '@/utils/format';

import type { TableData } from '../type';

interface Props {
  mapStatus: boolean;
  skip: number;
  keywords: string;
  handleOpenEnterpriseModal: (row: TableData) => void;
  handleOpenMapModal: (row: TableData) => void;
}

const useColumn = ({ mapStatus, skip, keywords, handleOpenEnterpriseModal, handleOpenMapModal }: Props) => {
  const columns: TableColumnsType<TableData> = [
    {
      title: '序号',
      key: 'renderIndex',
      className: 'pdd-8',
      width: Math.max(skip.toString().length * 4 + 42, 42),
      align: 'center',
      fixed: 'left',
      render: (_, __, index) => index + 1 + skip,
    },
    {
      title: '园区名称',
      dataIndex: 'devZoneName',
      key: 'devZoneName',
      width: 240,
      align: 'left',
      fixed: 'left',
      sorter: true,
      resizable: { max: 781 - Math.max(skip.toString().length * 4 + 42, 42) },
      render: (text, row) => (
        <Company
          name={text}
          keywords={keywords}
          external={
            row.centerCoordinates && mapStatus ? (
              <Image
                src={require('@/assets/images/area/ditu@2x.png')}
                width={14}
                height={14}
                style={{ cursor: 'pointer' }}
                onClick={() => handleOpenMapModal(row)}
              />
            ) : null
          }
        />
      ),
    },
    {
      title: '入驻企业',
      dataIndex: 'settledNum',
      key: 'settledNum',
      width: 90,
      align: 'right',
      sorter: true,
      resizable: true,
      render: (text, row) => <Amount text={text} handleClick={() => handleOpenEnterpriseModal(row)} />,
    },
    {
      title: '园区面积(亩)',
      dataIndex: 'devZoneSquare',
      key: 'devZoneSquare',
      width: 110,
      align: 'right',
      sorter: true,
      resizable: true,
      render: (text) => formatNumber(text) || '-',
    },
    {
      title: '特色产业',
      dataIndex: 'devZoneIndustry',
      key: 'devZoneIndustry',
      width: 140,
      align: 'left',
      resizable: true,
      render: (text) => <LineEllipsis text={text} />,
    },
    {
      title: '园区位置',
      dataIndex: 'devZoneArea',
      key: 'devZoneArea',
      width: 260,
      align: 'left',
      resizable: true,
      render: (text) => <LineEllipsis text={text} />,
    },
    {
      title: '所属地区',
      dataIndex: 'province',
      key: 'province',
      width: 188,
      align: 'left',
      resizable: true,
      render: (text, row) => <Area province={row.province} city={row.city} county={row.county} />,
    },
    { title: '', width: '', dataIndex: 'blank', key: 'blank' }, //插入空白列
  ];

  return columns;
};

export default useColumn;
