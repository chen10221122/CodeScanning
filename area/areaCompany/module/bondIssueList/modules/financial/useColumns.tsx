import { ReactNode, useMemo } from 'react';

import cn from 'classnames';

import { PAGESIZE } from '@/pages/area/areaCompany/const';
import TagNameTitle from '@/pages/area/areaCompany/module/bondIssueList/components/tagNameTitle';
import { SearchFiled } from '@/pages/area/areaCompany/module/bondIssueList/constants';
import { useDispatch } from '@/pages/area/areaF9/context';

export default ({
  curPage,
  keyword: { text, keyFiled },
}: {
  curPage: number;
  keyword: { text: string; keyFiled: string };
}) => {
  const dispatch = useDispatch();
  return useMemo(
    () =>
      [
        {
          title: '序号',
          key: 'idx',
          dataIndex: 'idx',
          width: 42 + Math.max((String(curPage * PAGESIZE).length - 2) * 13, 0),
          fixed: 'left',
          align: 'center',
          hideInSetting: true,
          render: (_: any, __: any, idx: number) => (curPage - 1) * PAGESIZE + idx + 1,
        },
        {
          dataIndex: 'bondAbbreviation',
          title: '债券简称',
          align: 'left',
          fixed: 'left',
          width: 165,
          getWidth() {
            return 10;
          },
          resizable: {
            /** 拖拽最大宽度 */
            max: 450,
          },
          render: (Text: string, row: Record<string, any>) => {
            return (
              <TagNameTitle
                type="co"
                code={row?.trCode}
                text={Text}
                keyword={keyFiled.includes(SearchFiled.BAND_NAME_CODE) ? text : ''}
              />
            );
          },
        },
        {
          dataIndex: 'bondCode',
          title: '债券代码',
          align: 'left',
          fixed: 'left',
          width: 101,
          resizable: {
            max: 450,
          },
          render: (Text: string) => {
            return <TagNameTitle text={Text} keyword={keyFiled.includes(SearchFiled.BAND_NAME_CODE) ? text : ''} />;
          },
        },
        {
          dataIndex: 'issueDateStart',
          title: '发行起始日',
          align: 'center',
          sorter: true,
          width: 110,
          defaultSortOrder: 'descend',
        },
        {
          dataIndex: 'planIssueAmount',
          title: '计划发行规模(亿元)',
          sorter: true,
          align: 'right',
          width: 160,
        },
        {
          dataIndex: 'realIssueAmount',
          title: '实际发行规模(亿元)',
          sorter: true,
          align: 'right',
          width: 160,
        },
        {
          dataIndex: 'issuer',
          title: '发行人',
          align: 'left',
          width: 220,
          getWidth() {
            return 30;
          },
          render(_: string, row: Record<string, any>) {
            return (
              <TagNameTitle
                code={row?.issuerItCode2}
                text={row?.issuer}
                tags={row?.issuerTags}
                keyword={keyFiled.includes(SearchFiled.ISSUER) ? text : ''}
              />
            );
          },
        },
        {
          dataIndex: 'firstBondType',
          title: '债券一级类型',
          align: 'left',
          width: 116,
        },
        {
          dataIndex: 'secondBondType',
          title: '债券二级类型',
          align: 'left',
          width: 146,
        },
        {
          dataIndex: 'bondMaturity',
          title: '债券期限(年)',
          width: 116,
          align: 'right',
          sorter: true,
        },
        {
          dataIndex: 'couponRate',
          title: '票面利率(%)',
          width: 116,
          align: 'right',
          sorter: true,
        },
        {
          dataIndex: 'issueDateEnd',
          title: '发行截止日',
          align: 'center',
          width: 108,
          sorter: true,
        },
        {
          dataIndex: 'startInterestDate',
          title: '起息日',
          align: 'center',
          width: 100,
          sorter: true,
        },
        {
          dataIndex: 'dateExpiry',
          title: '到期日期',
          width: 95,
          align: 'center',
          sorter: true,
        },
        {
          dataIndex: 'referenceRate',
          title: '参考收益率(%)',
          width: 128,
          align: 'right',
          sorter: true,
        },
        {
          dataIndex: 'debtRating',
          title: '债券评级',
          width: 78,
          align: 'center',
        },
        {
          dataIndex: 'subjectRating',
          title: '主体评级',
          width: 78,
          align: 'center',
        },
        {
          dataIndex: 'entitlementType',
          title: '含权类型',
          width: 130,
          align: 'left',
          render(text: string, record: Record<string, any>) {
            const isIncludeResale = record?.entitlementList?.length;
            return (
              <span
                className={cn({ ownershipType: isIncludeResale })}
                onClick={() => {
                  isIncludeResale &&
                    dispatch((draft) => {
                      draft.cumRightModalVisable = true;
                      draft.cumRightInfo = record?.entitlementList;
                    });
                }}
              >
                {text}
              </span>
            );
          },
        },
        {
          dataIndex: 'entitlementPeriod',
          title: '含权期限(年)',
          width: 180,
          align: 'center',
          getWidth() {
            return 15;
          },
          render: (text: string) => {
            return <TagNameTitle text={text} />;
          },
        },
        {
          dataIndex: 'listedMarket',
          title: '上市市场',
          width: 180,
          align: 'left',
        },
        {
          dataIndex: 'enterpriseType',
          title: '企业类型',
          width: 101,
          align: 'center',
        },
        {
          dataIndex: 'reportDate',
          title: '发行公告日',
          width: 102,
          align: 'center',
          sorter: true,
          checked: false,
        },
        {
          dataIndex: 'tenderDate',
          title: '招标日',
          width: 100,
          align: 'center',
          sorter: true,
          checked: false,
        },
        {
          dataIndex: 'listingDate',
          title: '上市日期',
          width: 100,
          align: 'center',
          sorter: true,
          checked: false,
        },
        {
          dataIndex: 'faceValue',
          title: '面值(元)',
          width: 86,
          align: 'right',
          sorter: true,
          checked: false,
        },
        {
          dataIndex: 'issuingPrice',
          title: '发行价格(元)',
          width: 112,
          align: 'right',
          sorter: true,
          checked: false,
        },
        {
          dataIndex: 'province',
          title: '省份',
          width: 101,
          align: 'left',
          checked: false,
        },
        {
          dataIndex: 'city',
          title: '地级市',
          width: 180,
          align: 'left',
          checked: false,
        },
        {
          dataIndex: 'district',
          title: '区县',
          width: 180,
          align: 'left',
          checked: false,
        },
        {
          dataIndex: 'isCrossMarket',
          title: '是否跨市场',
          width: 90,
          align: 'center',
          checked: false,
        },
        {
          dataIndex: 'allListedMarket',
          title: '全部上市市场',
          width: 104,
          align: 'left',
          checked: false,
        },
        {
          dataIndex: 'isEntitlement',
          title: '是否含权',
          width: 88,
          align: 'center',
          checked: false,
        },
        {
          dataIndex: 'isSubordinatedDebt',
          title: '是否次级债',
          width: 90,
          align: 'center',
          checked: false,
        },
        {
          dataIndex: 'isGuarantee',
          title: '是否担保',
          width: 88,
          align: 'center',
          checked: false,
        },
        {
          dataIndex: 'leadUnderwriterName',
          title: '主承销商',
          width: 101,
          align: 'left',
          checked: false,
          render: (text: string) => {
            return <TagNameTitle text={text} />;
          },
        },
        {
          dataIndex: 'deputyUnderwriterName',
          title: '副主承销商',
          width: 101,
          align: 'left',
          checked: false,
          render: (text: string) => {
            return <TagNameTitle text={text} />;
          },
        },
        {
          dataIndex: 'distributorName',
          title: '分销商',
          width: 101,
          align: 'left',
          checked: false,
          render: (text: string) => {
            return <TagNameTitle text={text} />;
          },
        },
        {
          dataIndex: 'guaranteeName',
          title: '担保人',
          width: 101,
          align: 'left',
          checked: false,
          render: (text: string) => {
            return <TagNameTitle text={text} />;
          },
        },
        {
          dataIndex: 'bookkeeperName',
          title: '簿记管理人',
          width: 101,
          align: 'left',
          checked: false,
          render: (text: string) => {
            return <TagNameTitle text={text} />;
          },
        },
      ].map((itemColumn, idx) => {
        return {
          ...itemColumn,
          resizable: itemColumn?.resizable ?? idx !== 0,
          // wrapLine: true,
          render: itemColumn?.render ? itemColumn?.render : (txt: ReactNode) => txt || '-',
        };
      }),
    [curPage, dispatch, keyFiled, text],
  );
};
