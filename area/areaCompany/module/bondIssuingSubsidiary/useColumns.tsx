import { useCreation } from 'ahooks';

import getIndustryRender from '@/pages/area/areaCompany/components/tableCpns/industry';
import ratioRender from '@/pages/area/areaCompany/components/tableCpns/ratioRender';
import { PAGESIZE } from '@/pages/area/areaCompany/const';

import { CoNameAndTags } from '../../components/tableCpns/coNameAndTag';
import TextWrap from '../../components/tableCpns/textWrap';

const TAG = [
  '央企',
  '央企子公司',
  '国企',
  '民企',
  '城投',
  '城投子公司',
  '主板',
  '创业板',
  '科创板',
  '北交所',
  '新三板',
  '港股',
  '中概股',
];

export default (handleOpenModal: Function, visible: boolean) => {
  return ({ curPage, restParams }: { curPage: number; restParams: any }) => {
    return useCreation(
      () => [
        {
          title: '序号',
          key: 'idx',
          dataIndex: 'idx',
          width: 42 + Math.max((String(curPage * PAGESIZE).length - 2) * 13, 0),
          fixed: 'left',
          align: 'center',
          render: (_: any, __: any, idx: number) => (curPage - 1) * PAGESIZE + idx + 1,
        },
        {
          title: '企业名称',
          key: 'enterpriseInfo.itName',
          dataIndex: 'enterpriseInfo',
          sorter: true,
          width: 233,
          fixed: 'left',
          align: 'left',
          render(_: string, all: Record<string, any>) {
            return (
              <CoNameAndTags
                code={all.enterpriseInfo.itCode}
                name={all.enterpriseInfo.itName}
                tag={all.enterpriseInfo.tags}
                keyword={restParams.text}
                standaryTagList={TAG}
              />
            );
          },
        },
        {
          title: '企业层级',
          key: 'enterpriseLevel',
          dataIndex: 'enterpriseLevel',
          sorter: true,
          sortDirections: ['descend', 'ascend'],
          width: 96,
          align: 'center',
          render: (text: string) => <TextWrap>{text || '-'}</TextWrap>,
        },
        {
          title: '所属发债企业',
          key: 'indirectControllerInfo',
          dataIndex: 'indirectControllerInfo',
          width: 309,
          align: 'left',
          render: ratioRender(handleOpenModal, restParams.text, visible),
        },
        {
          title: '法定代表人',
          key: 'legalRepresentative',
          dataIndex: 'legalRepresentative',
          width: 132,
          align: 'left',
          render: (text: string) => <TextWrap>{text || '-'}</TextWrap>,
        },
        {
          title: '注册资本',
          key: 'registeredCapital',
          dataIndex: 'registeredCapital',
          sorter: true,
          sortDirections: ['descend', 'ascend'],
          width: 134,
          align: 'right',
          render: (text: string) => <TextWrap>{text || '-'}</TextWrap>,
        },
        {
          title: '成立日期',
          key: 'establishmentDate',
          dataIndex: 'establishmentDate',
          sorter: true,
          sortDirections: ['descend', 'ascend'],
          width: 93,
          align: 'center',
          render: (text: string) => <TextWrap>{text || '-'}</TextWrap>,
        },
        {
          title: '国标行业',
          key: 'issuanceDate',
          dataIndex: 'issuanceDate',
          width: 220,
          align: 'left',
          render: getIndustryRender(['industryName1', 'industryName2', 'industryName3', 'industryName4']),
        },
        {
          title: '所属地区',
          key: 'area',
          dataIndex: 'area',
          width: 189,
          align: 'left',
          render: (text: string) => <TextWrap>{text || '-'}</TextWrap>,
        },
        {
          title: '实际控制人',
          key: 'actualController',
          dataIndex: 'actualController',
          width: 300,
          align: 'left',
          render: (text: string) => <TextWrap line={3}>{text || '-'}</TextWrap>,
        },
        {
          title: '第一大股东',
          key: 'firstShareholder',
          dataIndex: 'firstShareholder',
          width: 233,
          align: 'left',
          render: (text: string) => <TextWrap line={3}>{text || '-'}</TextWrap>,
        },
      ],
      [curPage, restParams, visible],
    );
  };
};

// export const useColumns = ({ curPage, restParams }: { curPage: number; restParams: any }) => {
//   return useCreation(
//     () => [
//       {
//         title: '序号',
//         key: 'idx',
//         dataIndex: 'idx',
//         width: 42 + Math.max((String(curPage * PAGESIZE).length - 2) * 13, 0),
//         fixed: 'left',
//         align: 'center',
//         render: (_: any, __: any, idx: number) => (curPage - 1) * PAGESIZE + idx + 1,
//       },
//       {
//         title: '企业名称',
//         key: 'enterpriseInfo.itName',
//         dataIndex: 'enterpriseInfo',
//         sorter: true,
//         width: 233,
//         fixed: 'left',
//         align: 'left',
//         render(_: string, all: Record<string, any>) {
//           return (
//             <CoNameAndTags
//               code={all.enterpriseInfo.itCode}
//               name={all.enterpriseInfo.itName}
//               tag={all.enterpriseInfo.tags}
//               keyword={restParams.text}
//             />
//           );
//         },
//       },
//       {
//         title: '企业层级',
//         key: 'enterpriseLevel',
//         dataIndex: 'enterpriseLevel',
//         sorter: true,
//         width: 96,
//         align: 'center',
//         render: (text: string) => <span>{text || '-'}</span>,
//       },
//       {
//         title: '所属发债企业',
//         key: 'indirectControllerInfo',
//         dataIndex: 'indirectControllerInfo',
//         sorter: true,
//         width: 232,
//         align: 'left',
//         render: ratioRender(() => {}, restParams.text, true),
//       },
//       {
//         title: '持股链路',
//         key: 'stockCode',
//         dataIndex: 'stockCode',
//         width: 76,
//         align: 'center',
//         render: (text: string) => {
//           return <ShowDetails onTrigger={() => {}} text={'查看'} disableWrap={true}/>
//         },
//       },

//       {
//         title: '法定代表人',
//         key: 'legalRepresentative',
//         dataIndex: 'legalRepresentative',
//         width: 132,
//         align: 'left',
//         render: (text: string) => <span>{text || '-'}</span>,
//       },
//       {
//         title: '注册资本',
//         key: 'registeredCapital',
//         dataIndex: 'registeredCapital',
//         sorter: true,
//         width: 134,
//         align: 'right',
//         render: (text: string) => <span>{text || '-'}</span>,
//       },
//       {
//         title: '成立日期',
//         key: 'establishmentDate',
//         dataIndex: 'establishmentDate',
//         sorter: true,
//         width: 93,
//         align: 'center',
//         render: (text: string) => <span>{text || '-'}</span>,
//       },
//       {
//         title: '国标行业',
//         key: 'issuanceDate',
//         dataIndex: 'issuanceDate',
//         width: 220,
//         align: 'left',
//         render: getIndustryRender(['industryName1', 'industryName2', 'industryName3', 'industryName4']),
//       },
//       {
//         title: '所属地区',
//         key: 'area',
//         dataIndex: 'area',
//         width: 189,
//         align: 'left',
//         render: (text: string) => <TextWrap>{text || '-'}</TextWrap>,
//       },
//       {
//         title: '实际控制人',
//         key: 'actualController',
//         dataIndex: 'actualController',
//         width: 300,
//         align: 'left',
//         render: (text: string) => <span>{text || '-'}</span>,
//       },
//       {
//         title: '第一大股东',
//         key: 'firstShareholder',
//         dataIndex: 'firstShareholder',
//         width: 233,
//         align: 'left',
//         render: (text: string) => <span>{text || '-'}</span>,
//       },
//     ],
//     [curPage],
//   );
// };
