import { RowItem } from '@/components/screen';

export const getTextWidth = (txt: string, font: string): number => {
  let canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d'),
    result = 0;

  if (ctx) {
    ctx.font = font;
    return ctx.measureText(txt).width;
  }

  return result;
};

export const removeSpecialChar = (str: string) => str.split(/[(,)]/g).join('');

export const getStyleText = (arr: { name: string; children?: { name: string }[] }[]) => {
  const getStyle = (d: string) => {
    let s = removeSpecialChar(d);

    return `
        .${s} .${s} dd{  max-height: 0!important; border-top: none!important; border-bottom: none!important; padding-top: 0!important; padding-bottom: 0!important;}

        .${s} .${s} dt a i {  transform: rotate(180deg)!important;}
        `;
  };

  return arr
    .map((o) => {
      let result = getStyle(o.name);

      if (o.children) {
        o.children.forEach((d) => {
          result += getStyle(d.name);
        });
      }

      return result;

      // return `
      //   .${s} .${s} dd{  max-height: 0!important; border-top-width: 0!important; padding-top: 0!important; padding-bottom: 0!important;}
      //
      //   .${s} .${s} dt a:after {  transform: translate(-50%,-50%) scale(0.6,0.5) rotate(180deg)!important;}
      //   `;
    })
    .join('');
};

/** 处理常用指标和其他指标，添加关联key */
export const formatIndicator = (defaultData: Record<string, any>[], list: Record<string, any>[]) => {
  list.forEach((item: Record<string, any>) => {
    if (item?.children?.length) {
      formatIndicator(defaultData, item.children);
    } else {
      // 常用指标
      let associatedItem = defaultData.find((d: Record<string, any>) => d.indexId === item.indexId);
      item.key = item.indexId;
      item.hasVipIcon = item.needPrivilege === 1;

      if (associatedItem) {
        associatedItem.hasVipIcon = associatedItem.needPrivilege === 1;
        associatedItem.ignoreIndicator = true;
        // 常用指标添加关联key
        const keys = associatedItem?.associatedKey || [];
        associatedItem.associatedKey = [...keys, item.indexId];

        item.active = true;
        // 普通指标添加关联key
        item.associatedKey = [associatedItem.key];
      }
    }
  });
};

const YEAT = 'year';
const y = new Date().getFullYear();
/** 2013-至今的年份 */
export const getYears = (): RowItem[] => {
  const length = y - 2012;
  return Array.from({ length }).map((_, i) => {
    const year = String(y - i);
    return {
      name: year,
      value: year,
      key: YEAT,
    };
  });
};
