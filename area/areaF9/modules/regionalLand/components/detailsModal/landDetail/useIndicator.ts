import { useRequest } from 'ahooks';

import { useCtx } from '@pages/area/areaF9/modules/regionalLand/components/detailsModal/provider';
import { getIndexTree } from '@pages/area/landTopic/api';
import { SelectItem } from '@pages/area/landTopic/components/IndexTable';

import { getTextWidth } from '@/utils/share';

interface SpecialStyleItem {
  width: number;
  align?: string;
}

//1:表示的是招拍挂,2表示的是协议划拨
const SPECIAL_INDICATOR_STYLE = new Map<string, SpecialStyleItem>([
  [
    'landLocation', // 土地坐落
    {
      width: 280,
      align: 'left',
    },
  ],
  [
    'landCode', // 宗地编号
    {
      width: 200,
      align: 'left',
    },
  ],
  [
    'provinceName', // 所属省
    {
      width: 120,
    },
  ],
  [
    'plotRatio', // 容积率
    {
      width: 120,
    },
  ],
  [
    'greeningRatio', // 绿化率
    {
      width: 120,
    },
  ],
  [
    'industryClassification', // 行业分类
    {
      width: 120,
    },
  ],
  [
    'electronicSupervisionNo', // 电子监管号
    {
      width: 180,
    },
  ],
  [
    'partyType', // 当事人类型
    {
      width: 164,
    },
  ],
]);

export default function useIndicator() {
  const { update } = useCtx();

  const { run } = useRequest(getIndexTree, {
    manual: true,
    onSuccess: ({ data }: any, [type]) => {
      const params = type === '1' ? 'overview' : 'agreementTransfer';
      const detail = data?.landDetails || {};
      const statistics = data?.landStatistics || {};
      const detailTitle = Object.keys(detail)[0];
      const statisticsTitle = Object.keys(statistics)[0];
      const detailLists = detailTitle ? detail[detailTitle] : [];
      const statisticsLists = statisticsTitle ? statistics[statisticsTitle] : {};

      const getTree = (list: any[]) => {
        const minWidth = 100;
        return list?.reduce(
          (
            pre,
            {
              commonIndex,
              defaultDisplay,
              indexEnglishName,
              indicName,
              indicNameUnit,
              unit,
              sort,
              indexStatement,
              indicType,
            },
          ) => {
            const sorter = sort === '1';
            const width =
              Math.ceil(getTextWidth(indicNameUnit, '12px Arial')) + 26 + (indexStatement ? 16 : 0) + (sorter ? 15 : 0);
            const special = SPECIAL_INDICATOR_STYLE.get(indexEnglishName) || ({} as SpecialStyleItem);
            const item: SelectItem = {
              title: indicName,
              tableTitle: indicNameUnit,
              dataIndex: indexEnglishName,
              key: indexEnglishName,
              width: special.width ?? (width > minWidth ? width : minWidth),
              resizable: indicType === '1',
              sorter: sorter,
              description: indexStatement,
              align: special.align ?? (unit ? 'right' : 'center'),
              unit,
            };
            if (commonIndex === '1') {
              const associatedKey = `use_${indexEnglishName}`;
              item.associatedKey = [associatedKey];
              pre.commonList.push({
                title: indicName,
                key: associatedKey,
                associatedKey: [indexEnglishName],
                ignoreIndicator: true,
              });
            }
            if (defaultDisplay === '1') {
              item.active = true;
              pre.defaultList.push(item);
            }
            pre.resultLists.push(item);
            return pre;
          },
          { commonList: [] as SelectItem[], resultLists: [] as SelectItem[], defaultList: [] as SelectItem[] },
        );
      };
      const { commonList: detailCommon, resultLists: detailResult, defaultList: detailDefault } = getTree(detailLists);
      const statisticsDefault: SelectItem[] = []; // 默认选中
      const statisticsCommon: SelectItem[] = []; // 常用指标
      const statisticsResult: SelectItem[] = []; // 全量指标
      for (const key in statisticsLists) {
        if (Object.prototype.hasOwnProperty.call(statisticsLists, key)) {
          const element = statisticsLists[key];
          const { commonList: itemCommon, resultLists: itemResult, defaultList: itemDefault } = getTree(element);
          statisticsDefault.push({ title: key, children: itemDefault });
          statisticsCommon.push(...itemCommon);
          statisticsResult.push({ title: key, children: itemResult });
        }
      }
      update((draft) => {
        draft[params].detailDefault = detailDefault;
        draft[params].detailIndicators = [
          { title: '常用指标', children: detailCommon },
          {
            title: detailTitle,
            children: detailResult,
          },
        ];
        draft[params].statisticsDefault = statisticsDefault;
        draft[params].statisticsIndicators = [
          {
            title: '常用指标',
            children: statisticsCommon,
          },
          {
            title: statisticsTitle,
            children: statisticsResult,
          },
        ];
      });
    },
  });
  return { run };
}
