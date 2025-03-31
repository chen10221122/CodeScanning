import { ScreenAreaTreeData, ThirdSelectRowItem } from '@/components/screen';

// 几个特殊地区禁止选中
// （海南省直辖县级行政区-469000；新疆维吾尔自治区直辖县级行政区划-659000；河南省县级行政区划-419000；湖北省直辖县级行政区划-429000）
const disabledAreaArr = ['419000', '429000', '469000', '659000'];

/**
 * 将服务器生数据转换为 Screen 定义的 ThirdSelectRowItem[] 类型
 * @param data 服务器生数据
 */
export function convertRawAreas2ThirdSelectRowItem(data: ScreenAreaTreeData[]): ThirdSelectRowItem[] {
  // 递归生成 省-市-县 生成树
  function helper(list: ScreenAreaTreeData[] | undefined, deep: number): ThirdSelectRowItem[] | undefined {
    if (!list || !list.length) return;
    return list.map((item) => {
      let t: ThirdSelectRowItem = {
        name: item.name,
        value: item.value,
        children: item.children,
        disabled: disabledAreaArr.includes(item.regionCode),
      };
      return { ...item, t };
    });
  }
  return helper(data, 0) || [];
}
