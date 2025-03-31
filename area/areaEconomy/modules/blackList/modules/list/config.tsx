import styled from 'styled-components';

import Ellipsis from '@/pages/area/areaEconomy/modules/blackList/component/ellipsis';
import Tag from '@/pages/area/areaEconomy/modules/blackList/component/tag';
// 企业名称//enterpriseName
// 企业代码//enterpriseCode
// 企业标签-已移除//enterpriseLabel1
// 企业标签-国企/央企//enterpriseLabel2
// 企业标签-沪深京//enterpriseLabel3
// 企业标签-香港//enterpriseLabel4
// 企业标签-新三板//enterpriseLabel5
// 企业标签-债//enterpriseLabel6
// 企业标签-城投//enterpriseLabel7
// 黑榜榜单//blackList
// 认定单位/执行法院//identificationUnit
// 案号//caseNumber
// 列入日期//inclusionDate
// 截止日期//closingDate
// 法定代表人//legalRepresentative
// 上市/发债//listed
// 成立日期//establishmentTime
// 注册资本//registeredCapital
// 登记状态//registrationStatus
// 国标行业门类//industryName1
// 国标行业大类//industryName2
// 国标行业中类//industryName3
// 国标行业细类//industryName4
// 所属省//province
// 所属市//city
// 所属区县//country
// 高亮数据// highlight :{
//     "ITName": [
//       "青岛黄河铸造机械<em>集团</em>有限公司"
//     ]
//   }
// 公告日期//declareDate
// GUID//guId
// 榜单code//tagCode
// 原文//originalTextUrl
// 数据来源//dataSources
export const column: Record<string, any>[] = [
  {
    title: '公告日期',
    dataIndex: 'declareDate',
    key: 'DeclareDate',
    width: 102,
    sorter: true,
    sortDirections: ['descend', 'ascend'],
    fixed: true,
  },
  {
    title: '公司名称',
    dataIndex: 'enterpriseName',
    key: 'ITNamePinyinInitial',
    width: 340,
    sorter: true,
    fixed: true,
    align: 'left',
    render(record: string, row: any) {
      const tagData = [];
      for (let prop in row) {
        if (prop.includes('enterpriseLabel')) {
          tagData.push(row[prop]);
        }
      }
      let rowKeyword: string = row?.highlight?.ITName?.[0];
      if (rowKeyword) {
        rowKeyword = /(?:<em>)(.*)(?:<\/em>)/g.exec(rowKeyword)?.[1] || '';
      }
      return (
        <TagCon>
          <Ellipsis
            text={record}
            code={row?.enterpriseCode}
            hasHoverStyle={!!row?.enterpriseCode}
            keyword={rowKeyword}
            getContainer={() => document.getElementById('blackListContainer') || document.body}
          />
          <Tag data={tagData} />
        </TagCon>
      );
    },
  },
  {
    title: '黑榜榜单',
    dataIndex: 'blackList',
    key: 'TagDisplayName_sort',
    width: 230,
    sorter: true,
    align: 'left',
  },
  {
    title: '认定单位/执行法院',
    dataIndex: 'identificationUnit',
    key: 'Judge_sort',
    width: 218,
    sorter: true,
    align: 'left',
  },
  {
    title: '数据来源',
    dataIndex: 'dataSources',
    key: 'Source_sort',
    width: 218,
    sorter: true,
    align: 'left',
  },
  {
    title: '详情',
    dataIndex: 'detail',
    key: 'detail',
    width: 49,
  },
  {
    title: '案号',
    dataIndex: 'caseNumber',
    key: 'caseNumber',
    width: 191,
    align: 'left',
  },
  {
    title: '列入日期',
    dataIndex: 'inclusionDate',
    key: 'BeginDate',
    width: 102,
    sorter: true,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: '截止日期',
    dataIndex: 'closingDate',
    key: 'EndDate',
    width: 102,
    sorter: true,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: '上市/发债',
    dataIndex: 'listed',
    key: 'market_sort',
    width: 127,
    sorter: true,
  },
  {
    title: '法定代表人',
    dataIndex: 'legalRepresentative',
    key: 'CR0001_004_sort',
    width: 102,
    sorter: true,
    align: 'left',
  },
  {
    title: '成立日期',
    dataIndex: 'establishmentTime',
    key: 'RegDate',
    width: 102,
    sorter: true,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: '注册资本',
    dataIndex: 'registeredCapital',
    key: 'CR0001_005_sort',
    width: 90,
    sorter: true,
    sortDirections: ['descend', 'ascend'],
    align: 'right',
  },
  {
    title: '登记状态',
    dataIndex: 'registrationStatus',
    key: 'RegistrationStatus_sort',
    width: 87,
    sorter: true,
  },
  {
    title: '国标行业门类',
    dataIndex: 'industryName1',
    key: 'IndustryName_sort',
    width: 192,
    sorter: true,
    align: 'left',
  },
  {
    title: '国标行业大类',
    dataIndex: 'industryName2',
    key: 'IndustryName2_sort',
    width: 205,
    sorter: true,
    align: 'left',
  },
  {
    title: '国标行业中类',
    dataIndex: 'industryName3',
    key: 'IndustryName3_sort',
    width: 192,
    sorter: true,
    align: 'left',
  },
  {
    title: '国标行业细类',
    dataIndex: 'industryName4',
    key: 'IndustryName4_sort',
    width: 192,
    sorter: true,
    align: 'left',
  },
  {
    title: '所属省',
    dataIndex: 'province',
    key: 'RegionName_sort',
    width: 77,
    sorter: true,
  },
  {
    title: '所属市',
    dataIndex: 'city',
    key: 'RegionName2_sort',
    width: 114,
    sorter: true,
  },
  {
    title: '所属区县',
    dataIndex: 'country',
    key: 'RegionName3_sort',
    width: 114,
    sorter: true,
  },
];

const TagCon = styled.div`
  display: inline-flex;
  width: 100%;
`;
