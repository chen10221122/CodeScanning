import dayJs from 'dayjs';

import RangeInput from '@/components/antd/rangeInput';
import RangePicker from '@/components/antd/rangePicker';
import { ScreenType, Options, WithExpand } from '@/components/screen';
import TableTooltip from '@/pages/area/areaCompany/components/tableCpns/toolTip';
import { REGIONAL_PAGE } from '@/pages/area/areaCompany/configs';
import { formatTitle, formatInMoreTitle } from '@/pages/area/areaCompany/utils/filter';

const handleDefaultOption = (thirdOpt: Options[], moreOpt: Options[]) => {
  return [
    {
      title: '下属辖区',
      option: {
        type: ScreenType.MULTIPLE_THIRD_AREA,
        children: [],
      },
    },
    {
      title: '国标行业',
      option: {
        ellipsis: 8,
        type: ScreenType.MULTIPLE_THIRD,
        hasSelectAll: false,
        children: [],
        cascade: true,
        formatTitle: (rows: any) => {
          if (!rows.length) return '国标行业';
          return rows.map((row: any) => row.name).join(',');
        },
      },
    },
    ...thirdOpt,
    ...(moreOpt.length
      ? moreOpt
      : [
          {
            title: '更多筛选',
            overlayClassName: 'area-enterprise-screen-more-date',
            option: {
              type: ScreenType.MULTIPLE_TILING,
              ellipsis: 15,
              children: [],
            },
          },
        ]),
  ] as Options[];
};

/** 区域企业普通页注册资本筛选项 */
const RegisteredCapital = [
  {
    title: '注册资本',
    formatTitle: (rows: any) => formatTitle(rows, '万'),
    option: {
      type: ScreenType.MULTIPLE,
      children: [
        { name: '10亿及以上', value: '[1000000000,*)', key: 'amount' },
        { name: '1-10亿', value: '[100000000,1000000000)', key: 'amount' },
        { name: '5000万-1亿', value: '[50000000,100000000)', key: 'amount' },
        { name: '1000-5000万', value: '[10000000,50000000)', key: 'amount' },
        { name: '1000万以下', value: '(*,10000000)', key: 'amount' },
        {
          name: '自定义',
          key: 'amount',
          value: '',
          render: () => <RangeInput unit="万" />,
        },
      ],
    },
  },
] as unknown as Options[];

/** 黑名单节点下的三个页面的注册资本筛选项 */
const BlackRegisteredCapital = [
  {
    title: '注册资本',
    formatTitle: (rows: any) => formatTitle(rows, '万'),
    option: {
      type: ScreenType.MULTIPLE,
      children: [
        { name: '5000万及以上', value: '[50000000,*)', key: 'amount' },
        { name: '1000万-5000万', value: '[10000000,50000000)', key: 'amount' },
        { name: '500-1000万', value: '[5000000,10000000)', key: 'amount' },
        { name: '100-500万', value: '[1000000,5000000)', key: 'amount' },
        { name: '0-100万', value: '[0,1000000)', key: 'amount' },
        {
          name: '自定义',
          key: 'amount',
          render: () => <RangeInput unit="万" />,
        },
      ],
    },
  },
] as unknown as Options[];

/** 吊销/注销企业-企业状态筛选项 */
const CompanyStatus = [
  {
    title: '企业状态',
    option: {
      type: ScreenType.SINGLE,
      formatTitle: (rows: any) => {
        if (rows.length) {
          const { name } = rows[0];
          if (name === '不限') return '企业状态';
          return name;
        }
      },
      children: [
        { name: '不限', value: '不限', unlimited: true, key: 'status', inMore: true },
        { name: '注销', value: '3,22', key: 'status', inMore: true },
        { name: '吊销', value: '2,21,22', key: 'status', inMore: true },
      ],
      default: '不限',
    },
  },
] as unknown as Options[];

/** 吊销/注销企业-更多筛选项 */
const RevokeCompanyMore = [
  {
    title: '更多筛选',
    option: {
      type: ScreenType.MULTIPLE_TILING,
      ellipsis: 15,
      children: [
        {
          title: '吊销/注销日期',
          cancelable: true,
          calendar: {
            _key: 'revocationAndCancelledDate',
            inMore: true,
          },
          ranges: [
            { name: '不限', value: '', key: 'revocationAndCancelledDate', inMore: true },
            { name: '近一周', value: '1', key: 'revocationAndCancelledDate', inMore: true },
            { name: '近一个月', value: '2', key: 'revocationAndCancelledDate', inMore: true },
            { name: '近三个月', value: '3', key: 'revocationAndCancelledDate', inMore: true },
          ],
          customPicker: {
            disabledDate: () => false,
          },
        },
        {
          title: '注册资本',
          cancelable: true,
          multiple: true,
          hasSelectAll: true,
          data: [
            { name: '100万以内', value: '[0,1000000)', key: 'registerCapital', inMore: true },
            { name: '100-500万', value: '[1000000,5000000]', key: 'registerCapital', inMore: true },
            { name: '500-1000万', value: '[5000000,10000000]', key: 'registerCapital', inMore: true },
            { name: '1000-3000万', value: '[10000000,30000000]', key: 'registerCapital', inMore: true },
            { name: '3000-5000万', value: '[30000000,50000000]', key: 'registerCapital', inMore: true },
            { name: '5000万以上', value: '[50000000,*)', key: 'registerCapital', inMore: true },
            {
              name: '自定义',
              key: 'registerCapital',
              inMore: true,
              value: '',
              render: () => (
                <WithExpand<[start: string, end: string]>
                  formatTitle={(value: any) => <div>{formatInMoreTitle(value, '万')}</div>}
                >
                  <RangeInput unit="万" />
                </WithExpand>
              ),
            },
          ],
        },
      ],
    },
    overlayClassName: 'area-company-revoke-filter-more',
  },
] as unknown as Options[];

const disabledDate = (d: dayJs.Dayjs) => d && (dayJs().subtract(3, 'month').isAfter(d) || d.isAfter(dayJs()));

/** 新成立企业-成立日期筛选项 */
const EstablishDate = [
  {
    title: '成立日期',
    option: {
      type: ScreenType.SINGLE,
      formatTitle: (rows: any) => {
        if (rows.length) {
          const { name, value } = rows[0];
          if (name === '不限') return '成立日期';
          if (name === '自定义') {
            return `${dayJs(value[0]).format('YYYY-MM-DD')}至${dayJs(value[1]).format('YYYY-MM-DD')}`;
          }
          return name;
        }
      },
      children: [
        { name: '不限', value: '不限', unlimited: true, key: 'registerDate', inMore: true },
        { name: '近一周', value: '1', key: 'registerDate', inMore: true },
        { name: '近一个月', value: '2', key: 'registerDate', inMore: true },
        { name: '近三个月', value: '3', key: 'registerDate', inMore: true },
        {
          name: '自定义',
          key: 'registerDate',
          inMore: true,
          render: () => <RangePicker size="small" disabledDate={disabledDate} />,
        },
      ],
      default: '不限',
    },
  },
] as unknown as Options[];

/** 区域企业筛选项 */
export const screenOption = handleDefaultOption(RegisteredCapital, []);
/** 吊销/注销企业筛选项 */
export const revokeEnterpriseScreenOption = handleDefaultOption(CompanyStatus, RevokeCompanyMore);
/** 新成立企业筛选项 */
export const EstablishComanyScreenOption = handleDefaultOption(EstablishDate, []);
/** 黑名单节点筛选项 */
export const BlackListScreenOption = handleDefaultOption(BlackRegisteredCapital, []);
/** 区域融资筛选项 */
export const LeasingScreenOption = [
  {
    title: '承租人类型',
    option: {
      type: ScreenType.MULTIPLE,
      children: [
        { name: '不限', value: '', unlimited: true, key: 'lesseeType' },
        { name: '央企', value: '1', key: 'lesseeType' },
        { name: '央企子公司', value: '14', key: 'lesseeType' },
        { name: '国企', value: '2', key: 'lesseeType' },
        { name: '民企', value: '8', key: 'lesseeType' },
        { name: '城投', value: '6', key: 'lesseeType' },
        { name: '城投子公司', value: '9', key: 'lesseeType' },
        { name: '上市', value: '3,4,7', key: 'lesseeType' },
        { name: '发债人', value: '5', key: 'lesseeType' },
        { name: '高新技术企业', value: '10', key: 'lesseeType' },
        { name: '科技型中小企业', value: '11', key: 'lesseeType' },
        { name: '创新型中小企业', value: '19', key: 'lesseeType' },
        { name: '专精特新“小巨人”', value: '12', key: 'lesseeType' },
        { name: '专精特新中小企业', value: '13', key: 'lesseeType' },
      ],
    },
  },
  {
    title: '出租人类型',
    option: {
      type: ScreenType.MULTIPLE,
      children: [
        { name: '不限', value: '', unlimited: true, key: 'leaserType' },
        { name: '金租', value: '金融租赁', key: 'leaserType' },
        { name: '商租', value: '融资租赁', key: 'leaserType' },
      ],
    },
  },
  {
    title: '上市/发债',
    option: {
      type: ScreenType.MULTIPLE,
      children: [
        { name: '不限', value: '', unlimited: true, key: 'enterpriseType' },
        { name: '国企', value: '2', key: 'enterpriseType' },
        { name: '民企', value: '8', key: 'enterpriseType' },
        { name: '上市', value: '3,4,7', key: 'enterpriseType' },
        { name: '发债人', value: '5', key: 'enterpriseType' },
      ],
    },
  },
] as unknown as Options[];

/** 债券融资 - 统计频率 */
export const frequencyOption = {
  title: '统计频率',
  formatTitle: (row: any) => {
    return (
      <>
        <TableTooltip title="默认统计近十年数据,统计频率默认为年" placement="bottomLeft" />
        <span style={{ color: '#878787' }}>统计频率：</span>
        {row[0].name}
      </>
    );
  },
  option: {
    type: ScreenType.SINGLE,
    cancelable: false,
    children: [
      { name: '年', value: '1', key: 'changeDate', active: true },
      { name: '半年', value: '2', key: 'changeDate' },
      { name: '季', value: '3', key: 'changeDate' },
      { name: '月', value: '4', key: 'changeDate' },
    ],
  },
};
export const issueDateOption = {
  title: '发行日期',
  option: {
    type: ScreenType.SINGLE,
    children: [
      { name: '不限', value: '不限', unlimited: true, key: 'changeDate' },
      { name: '今天', value: '1', key: 'changeDate' },
      { name: '明天', value: '2', key: 'changeDate' },
      { name: '近一周', value: '3', key: 'changeDate' },
      {
        name: '自定义',
        key: 'changeDate',
        render: () => <RangePicker size="small" disabledDate={() => false} />,
      },
    ],
  },
};

/** 债券融资-非金融企业-筛选 */
export const notFinancialFilter = [{ title: '统计频率', formatTitle: true }, { title: '债券类型' }, { title: '行业' }];

/** 债券融资-金融企业-筛选 */
export const financialFilter = [
  { title: '统计频率', formatTitle: true },
  { title: '企业类型', cascade: true },
];

/** 债券融资 - 非金融企业 - 更多筛选 */
export const moreNotFinancialFilter: { title: string; explain?: string }[] = [
  { title: '企业性质' },
  { title: '主体评级' },
  { title: '债项评级' },
];

/** 债券融资 - 非金融企业-债券偿还、企业偿债压力 - 更多筛选 */
export const moreDebtRepayFilter: { title: string; explain?: string }[] = [
  { title: '统计口径', explain: '不考虑行权代表根据公告确定的偿还信息。考虑行权代表根据行权条款预估的偿还信息。' },
  { title: '是否城投' },
  { title: '是否上市' },
];

/** 债券融资 - 金融企业 - 更多筛选 */
export const moreFinancialFilter: { title: string; explain?: string }[] = [
  { title: '主体评级' },
  { title: '债项评级' },
];

/** 债券融资筛选项 */
export const getBondOption = ({ baseList = [], moreList = [] }: { baseList?: any; moreList?: any }) => {
  return [
    ...baseList,
    {
      title: '更多筛选',
      option: {
        type: ScreenType.MULTIPLE_TILING,
        children: moreList,
      },
    },
  ];
};

/** 配置筛选项 */
export const getItems = (data: Record<string, any>[], key: string): any => {
  let newKey = key;

  return data.map((item: Record<string, any>, idx: number) => {
    if (key === 'firstBondType') {
      // 债券类型要区分一级类型和二级类型
      newKey = item.level === 2 ? 'secondBondType' : 'firstBondType';
    } else if (key === 'enterpriseType') {
      // 企业类型要区分一级类型和二级类型
      newKey = item.level === 2 ? 'secondEnterpriseType' : 'firstEnterpriseType';
    }
    return {
      key: newKey,
      name: item?.name || '',
      // value 用于找到默认项
      value: item?.value + idx || '',
      // code用于取值
      code: item?.value || '',
      children: item?.children ? getItems(item.children, key) : null,
    };
  });
};

/** 配置筛选项 */
export const getOptionItem = (data: Record<string, any>[], key: string): any[] => {
  let Tkey = key;
  return data.map((item) => {
    if (key === 'enterpriseType') Tkey = item.level === 2 ? 'secondEnterpriseType' : 'firstEnterpriseType';
    if (key === 'firstBondType') Tkey = item.level === 2 ? 'secondBondType' : 'firstBondType';
    return {
      key: Tkey,
      name: item?.name || '',
      value: item?.value || '',
      children: item?.children ? getOptionItem(item.children, key) : null,
    };
  });
};

/** 默认筛选，其他页面都是 screenOption */
export const CompanySpecialDefaultOptionMap = new Map<REGIONAL_PAGE, Options[]>([
  [REGIONAL_PAGE.COMPANY_ESTABLISH, EstablishComanyScreenOption],
  [REGIONAL_PAGE.COMPANY_BLACKLISTED, BlackListScreenOption],
]);
