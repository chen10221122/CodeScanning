import { useMemo } from 'react';

import CompanyWithTags from '@/pages/area/areaCompany/components/tableCpns/companyWithTags';
import { PAGESIZE } from '@/pages/area/areaCompany/const';
import type { DetailColumnsProps } from '@/pages/area/areaFinancingBoard/types';

function emptyContent(text: any) {
  return text ? text : '-';
}

//判断逻辑参考：src\pages\area\areaF9\modules\regionalFinancialResources\bankDestributeByType\useColumns.tsx
const useDetailColumns = ({ curPage, type, branchType }: DetailColumnsProps) => {
  const columns = useMemo(() => {
    switch (branchType) {
      // 法人机构
      case 1:
        if (type !== '小型农村金融机构' && type !== '新型农村金融机构') {
          return [
            {
              title: '序号',
              dataIndex: 'index',
              className: 'pdd-8',
              fixed: 'left',
              width: Math.max(`${curPage * PAGESIZE}`.length * 10 + 22, 42),
              render: (_: any, __: any, i: number) => {
                return (curPage - 1) * PAGESIZE + i + 1;
              },
            },
            {
              title: '企业名称',
              dataIndex: 'itName',
              width: 206,
              fixed: 'left',
              resizable: { max: 940 - Math.max(`${curPage * PAGESIZE}`.length * 10 + 22, 42) },
              wrapLine: true,
              render: (text: string, row: any) => {
                return (
                  <CompanyWithTags
                    type={'company'}
                    data={{
                      ...row,
                      code: row.enterpriseInfo.itCode,
                      name: row.enterpriseInfo.itName,
                    }}
                  />
                );
              },
            },
            {
              title: '成立日期',
              dataIndex: 'establishDate',
              key: 'establishDate',
              sorter: true,
              width: 94,
              resizable: true,
              wrapLine: true,
              render: (text: string) => {
                return emptyContent(text);
              },
            },
            {
              title: '法定代表人',
              dataIndex: 'legalRepresentative',
              width: 128,
              resizable: true,
              wrapLine: true,
              render: (text: string) => {
                return emptyContent(text);
              },
            },
            {
              title: <div style={{ textAlign: 'center' }}>注册资本</div>,
              dataIndex: 'registerCapital',
              width: 134,
              align: 'right',
              resizable: true,
              wrapLine: true,
              render: (text: string) => {
                return emptyContent(text);
              },
            },
            {
              title: '金融许可编码',
              dataIndex: 'financialLicenseCode',
              width: 139,
              resizable: true,
              wrapLine: true,
              render: (text: string) => {
                return emptyContent(text);
              },
            },
            {
              title: '注册地',
              dataIndex: 'registerArea',
              width: 110,
              resizable: true,
              wrapLine: true,
              render: (text: string) => {
                return emptyContent(text);
              },
            },
          ];
        } else {
          return [
            {
              title: '序号',
              dataIndex: 'index',
              className: 'pdd-8',
              fixed: 'left',
              width: Math.max(`${curPage * PAGESIZE}`.length * 10 + 22, 42),
              render: (_: any, __: any, i: number) => {
                return (curPage - 1) * PAGESIZE + i + 1;
              },
            },
            {
              title: '企业名称',
              dataIndex: 'itName',
              width: 206,
              align: 'left',
              fixed: 'left',
              resizable: { max: 940 - Math.max(`${curPage * PAGESIZE}`.length * 10 + 22, 42) },
              wrapLine: true,
              render: (text: string, row: any) => {
                return (
                  <CompanyWithTags
                    type={'company'}
                    data={{
                      ...row,
                      code: row.enterpriseInfo.itCode,
                      name: row.enterpriseInfo.itName,
                    }}
                  />
                );
              },
            },
            {
              title: '类型',
              dataIndex: 'bankType',
              width: 92,
              resizable: true,
              wrapLine: true,
              render: (text: string) => {
                return emptyContent(text);
              },
            },
            {
              title: '成立日期',
              dataIndex: 'establishDate',
              key: 'establishDate',
              sorter: true,
              width: 94,
              resizable: true,
              wrapLine: true,
              render: (text: string) => {
                return emptyContent(text);
              },
            },
            {
              title: '法定代表人',
              dataIndex: 'legalRepresentative',
              width: 128,
              resizable: true,
              wrapLine: true,
              render: (text: string) => {
                return emptyContent(text);
              },
            },
            {
              title: <div style={{ textAlign: 'center' }}>注册资本</div>,
              dataIndex: 'registerCapital',
              width: 137,
              align: 'right',
              resizable: true,
              wrapLine: true,
              render: (text: string) => {
                return emptyContent(text);
              },
            },
            {
              title: '金融许可编码',
              dataIndex: 'financialLicenseCode',
              width: 139,
              resizable: true,
              wrapLine: true,
              render: (text: string) => {
                return emptyContent(text);
              },
            },
            {
              title: '注册地',
              dataIndex: 'registerArea',
              width: 83,
              resizable: true,
              wrapLine: true,
              render: (text: string) => {
                return emptyContent(text);
              },
            },
          ];
        }
      default:
        if (type === '小型农村金融机构' || type === '新型农村金融机构') {
          return [
            {
              title: '序号',
              dataIndex: 'index',
              className: 'pdd-8',
              fixed: 'left',
              width: Math.max(`${curPage * PAGESIZE}`.length * 10 + 22, 42),
              render: (_: any, __: any, i: number) => {
                return (curPage - 1) * PAGESIZE + i + 1;
              },
            },
            {
              title: '企业名称',
              dataIndex: 'itName',
              width: 193,
              fixed: 'left',
              resizable: { max: 940 - Math.max(`${curPage * PAGESIZE}`.length * 10 + 22, 42) },
              wrapLine: true,
              render: (text: string, row: any) => {
                return (
                  <CompanyWithTags
                    type={'company'}
                    data={{
                      ...row,
                      code: row.enterpriseInfo.itCode,
                      name: row.enterpriseInfo.itName,
                    }}
                  />
                );
              },
            },
            {
              title: '类型',
              dataIndex: 'bankType',
              width: 92,
              resizable: true,
              wrapLine: true,
              render: (text: string) => {
                return emptyContent(text);
              },
            },
            {
              title: '成立日期',
              dataIndex: 'establishDate',
              key: 'establishDate',
              sorter: true,
              width: 94,
              resizable: true,
              wrapLine: true,
              render: (text: string) => {
                return emptyContent(text);
              },
            },
            {
              title: <div style={{ textAlign: 'center' }}>负责人</div>,
              dataIndex: 'legalRepresentative',
              width: 128,
              align: 'left',
              resizable: true,
              wrapLine: true,
              render: (text: string) => {
                return emptyContent(text);
              },
            },
            {
              title: '金融许可编码',
              dataIndex: 'financialLicenseCode',
              width: 140,
              resizable: true,
              wrapLine: true,
              render: (text: string) => {
                return emptyContent(text);
              },
            },
            {
              title: <div style={{ textAlign: 'center' }}>注册地</div>,
              dataIndex: 'registerArea',
              width: 110,
              align: 'left',
              resizable: true,
              wrapLine: true,
              render: (text: string) => {
                return emptyContent(text);
              },
            },
            {
              title: '上级机构',
              width: 193,
              align: 'left',
              resizable: true,
              wrapLine: true,
              render: (text: string, row: any) => {
                return (
                  <CompanyWithTags
                    type={'company'}
                    data={{
                      ...row,
                      code: row.parentITCode,
                      name: row.parentITCodeName,
                    }}
                  />
                );
              },
            },
          ];
        }
        return [
          {
            title: '序号',
            dataIndex: 'index',
            className: 'pdd-8',
            fixed: 'left',
            width: Math.max(`${curPage * PAGESIZE}`.length * 10 + 22, 42),
            render: (_: any, __: any, i: number) => {
              return (curPage - 1) * PAGESIZE + i + 1;
            },
          },
          {
            title: '企业名称',
            dataIndex: 'itName',
            fixed: 'left',
            width: 214,
            resizable: { max: 940 - Math.max(`${curPage * PAGESIZE}`.length * 10 + 22, 42) },
            wrapLine: true,
            render: (text: string, row: any) => {
              return (
                <CompanyWithTags
                  type={'company'}
                  data={{
                    ...row,
                    code: row.enterpriseInfo.itCode,
                    name: row.enterpriseInfo.itName,
                  }}
                />
              );
            },
          },
          {
            title: '成立日期',
            dataIndex: 'establishDate',
            key: 'establishDate',
            sorter: true,
            width: 94,
            resizable: true,
            wrapLine: true,
            render: (text: string) => {
              const content = text ? text : '-';
              return content;
            },
          },
          {
            title: '负责人',
            dataIndex: 'legalRepresentative',
            width: 110,
            resizable: true,
            wrapLine: true,
            render: (text: string) => {
              const content = text ? text : '-';
              return content;
            },
          },
          {
            title: '金融许可编码',
            dataIndex: 'financialLicenseCode',
            width: 140,
            resizable: true,
            wrapLine: true,
            render: (text: string) => {
              const content = text ? text : '-';
              return content;
            },
          },
          {
            title: <div style={{ textAlign: 'center' }}>注册地</div>,
            dataIndex: 'registerArea',
            align: 'left',
            width: 110,
            resizable: true,
            wrapLine: true,
            render: (text: string) => {
              const content = text ? text : '-';
              return content;
            },
          },
          {
            title: '上级机构',
            dataIndex: 'registerArea',
            width: 214,
            resizable: true,
            wrapLine: true,
            render: (text: string, row: any) => {
              return (
                <CompanyWithTags
                  type={'company'}
                  data={{
                    ...row,
                    code: row.parentITCode,
                    name: row.parentITCodeName,
                  }}
                />
              );
            },
          },
        ];
    }
  }, [branchType, curPage, type]);

  const scrollX = useMemo(() => {
    return (columns as any).reduce((acc: any, cur: any) => acc + cur?.width || 0, 0) + columns.length - 1;
  }, [columns]);

  return { scrollX, columns };
};

export default useDetailColumns;
