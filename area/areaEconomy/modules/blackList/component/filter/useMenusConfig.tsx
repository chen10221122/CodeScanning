import { useMemo } from 'react';

import { isEmpty, cloneDeep, isNull } from 'lodash';

import { RangePicker } from '@/components/antd';
import { ScreenType } from '@/components/screen';
import type { RowItem } from '@/components/screen/items/types';

export const handleTreeData = (data: any[], { pathValue, pathNumber, pathName, pathAppName }: any, keys: any[]) => {
  if (Array.isArray(data)) {
    const newData = data.map((item, i) => {
      const child = item?.children;
      const hasChildren = Array.isArray(child);
      item.key = item.key || item.value; // 兼容老数据没有key，赋值value
      item.title = item.name;
      item.extra = true;
      item.pathValue = pathValue.length ? [...pathValue, item.value] : [item.value];
      item.values = item.pathValue.join('_');
      item.pathNumber = pathNumber.length ? [...pathNumber, i] : [i];
      item.pathName = pathName.length ? [...pathName, item.name] : [item.name];
      item.pathAppName = pathAppName.length ? [...pathAppName, item.appName] : [item.appName];
      item.checkable = !hasChildren;
      if (item.pathValue?.length > 2) {
        keys.push(item.pathValue);
      }
      if (hasChildren) {
        const hasSon = hasChildren && child.some((son) => Array.isArray(son?.children) && son?.children?.length);
        const allChildKeys = child.map((son) => son.value).join('***');

        if (!hasSon && child.length > 1) {
          child.forEach((item) => {
            item.hasAll = true;
            item.allKeys = allChildKeys;
          });
        }

        const obj =
          handleTreeData(
            item.children as any[],
            {
              pathValue: item.pathValue,
              pathNumber: item.pathNumber,
              pathName: item.pathName,
              pathAppName: item.pathAppName,
            },
            keys,
          ) || {};
        item.children = obj?.data || [];
      }
      return item;
    });

    return { data: newData, keys };
  }

  return {};
};

// 日期
function dateRangeTrans(data: any) {
  const { children } = data?.[0] || {};
  return children.map((item: any) => {
    if (item.value === 'customDate') {
      return {
        name: item.name,
        type: 'DATE',
        render: (wrapper: any) => (
          <RangePicker
            size="small"
            disabledDate={() => false}
            getPopupContainer={() => wrapper.current || document.body}
          />
        ),
        pathName: ['公告日期', item.name],
      };
    }
    return {
      name: item.name,
      value: item.value,
      type: data?.[0]?.value,
      pathName: ['公告日期', item.name],
    };
  });
}

function typeTrans(data: any) {
  const { children } = data?.[1] || {};
  return children.map((item: any) => {
    return {
      name: item.name,
      value: item.value,
      type: data?.[1]?.value,
      pathName: ['类型', item.value],
    };
  });
}

function companyTypeTrans(data: any) {
  const arr = data?.[2]?.children?.[3];
  const { children } = arr || {};
  return children.map((item: any) => {
    return {
      name: item.name,
      value: item.value,
      type: arr?.value,
      pathName: ['主体', '上市/发债', item.value],
    };
  });
}

function industryCodeTrans(data: any) {
  const arr = data?.[2]?.children?.[4];
  const { children } = arr || {};
  const newArr = handleTreeData(
    cloneDeep(children) || [],
    {
      pathValue: [],
      pathNumber: [],
      pathName: ['主体', '国标行业'],
      pathAppName: [],
    },
    [],
  );
  return newArr.data;
}

export default function useMenusConfig({ data }: any) {
  const menusConfig: any = useMemo(() => {
    if (!data || isEmpty(data)) return [];
    return [
      {
        title: '公告日期',
        option: {
          type: ScreenType.SINGLE,
          formatTitle: (items: RowItem[]) => {
            if (items.length) {
              const { name, value } = items[0];
              if (name === '自定义') {
                return isNull(value) ? '公告日期' : '自定义';
              }
              return name;
            }
          },
          children: dateRangeTrans(data),
        },
      },
      {
        title: '类型',
        option: {
          type: ScreenType.MULTIPLE,
          children: typeTrans(data),
        },
      },
      {
        title: '上市/发债',
        option: {
          type: ScreenType.MULTIPLE,
          children: companyTypeTrans(data),
        },
      },
      {
        title: '国标行业',
        option: {
          type: ScreenType.MULTIPLE_THIRD,
          cascade: true,
          hasSelectAll: false,
          ellipsis: 8,
          hideSearch: true,
          formatItem(item: any) {
            item.pathName = ['主体', '国标行业', ''];
          },
          children: industryCodeTrans(data),
        },
      },
    ];
  }, [data]);

  return { menusConfig };
}
