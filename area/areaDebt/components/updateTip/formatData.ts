import { cloneDeep, isArray } from 'lodash';

export const flatData = (data: any[], key: string) => {
  return isArray(data)
    ? cloneDeep(data)
        .map((infoItem: any) => {
          return infoItem?.indicObj?.map((indicItem: any) => ({ ...indicItem, [key]: infoItem?.[key] }));
        })
        ?.flat()
    : [];
};

export const getIndicAndUnit = (indicNameWithUnit: string) => {
  return {
    indicName: indicNameWithUnit?.lastIndexOf('(')
      ? indicNameWithUnit.slice(0, indicNameWithUnit.lastIndexOf('('))
      : indicNameWithUnit,
    unit: indicNameWithUnit?.lastIndexOf('(') ? indicNameWithUnit.slice(indicNameWithUnit.lastIndexOf('(')) : '',
  };
};
