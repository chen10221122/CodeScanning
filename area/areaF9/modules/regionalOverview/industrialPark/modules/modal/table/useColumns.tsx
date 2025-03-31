import { TableColumnsType } from '@dzh/components';

import Area from '@/pages/area/areaF9/modules/regionalOverview/industrialPark/components/area';
import LineEllipsis from '@/pages/area/areaF9/modules/regionalOverview/industrialPark/components/lineEllipsis';
import MultipleTag from '@/pages/area/areaF9/modules/regionalOverview/parkEnterprise/components/MultipleTag';
import ParkPopver from '@/pages/area/areaF9/modules/regionalOverview/parkEnterprise/components/parkPopver';

import type { TableData } from '../type';

const useColumn = (from: number, searchValue: string | undefined) => {
  const columns: TableColumnsType<TableData> = [
    {
      title: '序号',
      key: 'renderIndex',
      className: 'pdd-8',
      width: Math.max(from.toString().length * 4 + 42, 42),
      align: 'center',
      fixed: 'left',
      render: (_, __, index) => index + 1 + from,
    },
    {
      title: '园区企业名称',
      dataIndex: 'companyName',
      key: 'companyName',
      width: 249,
      align: 'left',
      fixed: 'left',
      sorter: true,
      resizable: { max: 781 - Math.max(from.toString().length * 4 + 42, 42) },
      render: (text, row) => {
        return <MultipleTag data={row} searchValue={searchValue} />;
      },
    },
    {
      title: '注册资本',
      dataIndex: 'regCapital',
      key: 'regCapital',
      width: 124,
      resizable: true,
      align: 'right',
      sorter: true,
      render: (text) => text || '-',
    },
    {
      title: '法定代表人',
      dataIndex: 'legalRepresent',
      key: 'legalRepresent',
      width: 101,
      resizable: true,
      align: 'left',
      sorter: true,
      render: (text) => <LineEllipsis text={text} line={2} />,
    },
    {
      title: '成立日期',
      dataIndex: 'establishDate',
      key: 'establishDate',
      width: 88,
      resizable: true,
      align: 'center',
      sorter: true,
      render: (text) => text || '-',
    },
    {
      title: '联系电话',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      width: 115,
      resizable: true,
      align: 'left',
      render: (text) => text || '-',
    },
    {
      title: '国标行业',
      dataIndex: 'industryCode',
      key: 'industryCode',
      width: 219,
      resizable: true,
      align: 'left',
      render: (_, row) => {
        const text = row.industryLevel4 || row.industryLevel3 || row.industryLevel2 || row.industryLevel1;
        return (
          <div>
            {text ? (
              <>
                <span style={{ marginRight: 4 }}>{text}</span>
                {row.industryLevel1 ? <ParkPopver row={row} targetSelector={'park_module'} /> : null}
              </>
            ) : (
              '-'
            )}
          </div>
        );
      },
    },
    {
      title: '所属地区',
      dataIndex: 'province',
      key: 'province',
      width: 140,
      resizable: true,
      align: 'left',
      render: (text, row) => <Area province={row.province} city={row.city} county={row.county} line={2} />,
    },
    { title: '', width: '', dataIndex: 'blank', key: 'blank' }, //插入空白列
  ];

  return columns;
};

export default useColumn;
