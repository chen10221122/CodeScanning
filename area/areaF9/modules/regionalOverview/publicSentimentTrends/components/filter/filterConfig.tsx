import { useMemo } from 'react';

import { DatePicker } from '@dzh/components';
import Screen, { ScreenType, Options } from '@dzh/screen';
import dayJs, { Dayjs } from 'dayjs';
import { isEmpty, compact } from 'lodash';

import DateRangePicker from '@/components/antd/rangePicker';
import { initJurisdictionsOption } from '@/pages/area/areaCompany/utils/filter';
import { useSelector } from '@/pages/area/areaF9/context';
import { useParams } from '@/pages/area/areaF9/hooks';
import { EllipsisSpan } from '@/pages/enterprise/EstablishRevokeEnterprises/components/filter/screenStatusConfig';

import { ModuleEnum, STARTHMS, ENDHMS } from '../../constant';

const curHour = dayJs().format('YYYYMMDDHHmmss'); //当前时间
const twentyFourHour = dayJs().subtract(1, 'd').format('YYYYMMDDHHmmss'); //近24小时
const curDate = dayJs().format('YYYYMMDD'); //当前日期
const oneWeek = dayJs().subtract(1, 'w').format('YYYYMMDD'); //近一周
const oneMonth = dayJs().subtract(1, 'M').format('YYYYMMDD'); //近一月
const oneYear = dayJs().subtract(1, 'y').format('YYYYMMDD'); //近一年

interface FilterConfigProps {
  moduleType?: string;
}
const { WithExpand } = Screen;
const { RangePicker } = DatePicker;

const sourceScreenConfig: Options = {
  title: '来源',
  option: {
    type: ScreenType.MULTIPLE,
    hasAll: true,
    children: [
      {
        name: '核心媒体',
        value: '2',
        key: 'sourceType',
      },
      {
        name: '政府及监管机构',
        value: '1',
        key: 'sourceType',
      },
      {
        name: '财汇AI',
        value: '6',
        key: 'sourceType',
      },
      {
        name: '一般媒体',
        value: '3',
        key: 'sourceType',
      },
      {
        name: '自媒体',
        value: '5',
        key: 'sourceType',
      },
      {
        name: '其他',
        value: '4',
        key: 'sourceType',
      },
    ],
  },
};

const FilterConfig = ({ moduleType }: FilterConfigProps) => {
  const { regionCode } = useParams();
  const { areaTree } = useSelector((state) => ({
    areaTree: state?.areaTree || [],
  }));
  const screenCfg: any[] = useMemo(() => {
    let dictionsOpt = !isEmpty(areaTree)
      ? initJurisdictionsOption({ list: areaTree, code: regionCode, isNewAreaScreen: true })
      : undefined;
    // 如果区域下面没有下属辖区，清空选项
    dictionsOpt = dictionsOpt?.option!.children!.length ? dictionsOpt : undefined;

    const commonFilterChildren = [
      /**更多筛选公共配置 */
      {
        title: '时间筛选',
        hasSelectAll: false,
        multiple: false,
        data: [
          {
            name: '不限',
            key: 'queryDate',
            value: '',
          },
          {
            name: '24小时',
            key: 'queryDate',
            value: `${twentyFourHour},${curHour}`,
          },
          {
            name: '近一周',
            key: 'queryDate',
            value: `${oneWeek},${curDate}`,
          },
          {
            name: '近一个月',
            key: 'queryDate',
            value: `${oneMonth},${curDate}`,
          },
          {
            name: '近一年',
            key: 'queryDate',
            value: `${oneYear},${curDate}`,
          },
          {
            name: '自定义日历',
            key: 'queryDate',
            value: null,
            render: (wrapper: any) => (
              <WithExpand<[start: Dayjs | null, end: Dayjs | null]>
                formatTitle={(value) => (
                  <div>
                    <span>{value[0]?.format('YYYY-MM-DD')}</span>
                    <span> 至 </span>
                    <span>{value[1]?.format('YYYY-MM-DD')}</span>
                  </div>
                )}
              >
                <RangePicker size="small" getPopupContainer={() => wrapper.current!} />
              </WithExpand>
            ),
          },
        ],
      },
    ];
    const companyFilterChildren = [
      /**更多筛选企业动态配置 */
      {
        title: '企业性质',
        hasSelectAll: true,
        multiple: true,
        data: [
          {
            name: '上市公司',
            value: '1',
            key: 'companyType',
          },
          {
            name: '发债人',
            value: '2',
            key: 'companyType',
          },
          {
            name: '城投企业',
            value: '7',
            key: 'companyType',
          },
          {
            name: '央企',
            value: '3',
            key: 'companyType',
          },
          {
            name: '国企',
            value: '4',
            key: 'companyType',
          },
          {
            name: '民企',
            value: '5',
            key: 'companyType',
          },
          {
            name: '金融机构',
            value: '6',
            key: 'companyType',
          },
        ],
      },
      /* {
        title: '所属行业',
        hasSelectAll: true,
        multiple: true,
        data: [
          {
            name: '农业',
            value: '133371',
            key: 'swBusinessType',
          },
          {
            name: '化工',
            value: '133372',
            key: 'swBusinessType',
          },
          {
            name: '钢铁',
            value: '133373',
            key: 'swBusinessType',
          },
          {
            name: '汽车',
            value: '133374',
            key: 'swBusinessType',
          },
          {
            name: '电子',
            value: '133375',
            key: 'swBusinessType',
          },
          {
            name: '传媒',
            value: '133376',
            key: 'swBusinessType',
          },
          {
            name: '信息技术',
            value: '133377',
            key: 'swBusinessType',
          },
          {
            name: '煤炭',
            value: '133385',
            key: 'swBusinessType',
          },
          {
            name: '环保',
            value: '133386',
            key: 'swBusinessType',
          },
          {
            name: '房地产',
            value: '133387',
            key: 'swBusinessType',
          },
          {
            name: '有色金属',
            value: '133388',
            key: 'swBusinessType',
          },
          {
            name: '建筑材料',
            value: '133389',
            key: 'swBusinessType',
          },
          {
            name: '建筑装饰',
            value: '133390',
            key: 'swBusinessType',
          },
          {
            name: '石油石化',
            value: '133391',
            key: 'swBusinessType',
          },
          {
            name: '交通运输',
            value: '133392',
            key: 'swBusinessType',
          },
          {
            name: '家用电器',
            value: '133393',
            key: 'swBusinessType',
          },
          {
            name: '食品饮料',
            value: '133394',
            key: 'swBusinessType',
          },
          {
            name: '纺织服饰',
            value: '133395',
            key: 'swBusinessType',
          },
          {
            name: '轻工制造',
            value: '133396',
            key: 'swBusinessType',
          },
          {
            name: '医药生物',
            value: '133397',
            key: 'swBusinessType',
          },
          {
            name: '公用事业',
            value: '133398',
            key: 'swBusinessType',
          },
          {
            name: '商贸零售',
            value: '133399',
            key: 'swBusinessType',
          },
          {
            name: '社会服务',
            value: '133400',
            key: 'swBusinessType',
          },
          {
            name: '银行',
            value: '133401',
            key: 'swBusinessType',
          },
          {
            name: '非银金融',
            value: '133402',
            key: 'swBusinessType',
          },
          {
            name: '综合',
            value: '133403',
            key: 'swBusinessType',
          },
          {
            name: '电力设备',
            value: '133404',
            key: 'swBusinessType',
          },
          {
            name: '机械设备',
            value: '133405',
            key: 'swBusinessType',
          },
          {
            name: '国防军工',
            value: '133406',
            key: 'swBusinessType',
          },
          {
            name: '计算机',
            value: '133407',
            key: 'swBusinessType',
          },
          {
            name: '通信',
            value: '133408',
            key: 'swBusinessType',
          },
          {
            name: '美容护理',
            value: '133409',
            key: 'swBusinessType',
          },
        ],
      }, */
    ];
    const commonNegative = [
      {
        title: '正负面',
        hasSelectAll: false,
        multiple: false,
        data: [
          {
            name: '不限',
            key: 'negative',
            value: '',
          },
          {
            name: '正面',
            value: '1',
            key: 'negative',
          },
          {
            name: '中性',
            value: '0',
            key: 'negative',
          },
          {
            name: '负面',
            value: '-1',
            key: 'negative',
          },
        ],
      },
    ];

    return compact([
      {
        title: moduleType === ModuleEnum.COMPANY ? '重要性' : '时间筛选',
        ellipsis: 8,
        option: {
          type: ScreenType.SINGLE,
          formatTitle: (rows: any) => {
            if (rows.length) {
              const { name, value } = rows[0];
              if (name === '不限') return '时间筛选';
              if (name === '自定义')
                return (
                  <EllipsisSpan
                    str={`${dayJs(value[0]).format('YYYY-MM-DD')}至${dayJs(value[1]).format('YYYY-MM-DD')}`}
                  />
                );
              return name;
            }
          },
          cancelable: true,
          children:
            moduleType === ModuleEnum.COMPANY
              ? [
                  { name: '重要', value: '1', key: 'importance' },
                  { name: '一般', value: '0', key: 'importance' },
                ]
              : [
                  {
                    name: '不限',
                    key: 'queryDate',
                    value: '',
                    unlimited: true,
                  },
                  {
                    name: '24小时',
                    key: 'queryDate',
                    value: `${twentyFourHour},${curHour}`,
                  },
                  {
                    name: '近一周',
                    key: 'queryDate',
                    value: `${oneWeek}${STARTHMS},${curDate}${ENDHMS}`,
                  },
                  {
                    name: '近一个月',
                    key: 'queryDate',
                    value: `${oneMonth}${STARTHMS},${curDate}${ENDHMS}`,
                  },
                  {
                    name: '近一年',
                    key: 'queryDate',
                    value: `${oneYear}${STARTHMS},${curDate}${ENDHMS}`,
                  },
                  {
                    name: '自定义',
                    key: 'queryDate',
                    render: () => <DateRangePicker size="small" />,
                  },
                ],
        },
      },
      {
        title: '正负面',
        ellipsis: 8,
        option: {
          type: ScreenType.SINGLE,
          cancelable: true,
          children: [
            // {
            //   unlimited: true,
            //   name: '全部',
            //   value: '',
            //   key: 'negative',
            // },
            {
              name: '正面',
              value: '1',
              key: 'negative',
            },
            {
              name: '负面',
              value: '-1',
              key: 'negative',
            },
          ],
        },
      },
      {
        title: '更多筛选',
        option: {
          type: ScreenType.MULTIPLE_TILING,
          ellipsis: 5,
          children: [...commonNegative, ...commonFilterChildren, ...companyFilterChildren],
          // children:
          //   moduleType === ModuleEnum.COMPANY
          //     ? [...commonFilterChildren, ...companyFilterChildren]
          //     : [...commonFilterChildren],
        },
      },
      dictionsOpt,
      sourceScreenConfig,
    ]);
  }, [areaTree, regionCode, moduleType]);

  return screenCfg;
};

export default FilterConfig;
