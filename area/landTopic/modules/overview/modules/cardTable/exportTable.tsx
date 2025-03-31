import { FC, memo, useMemo } from 'react';
import { createPortal } from 'react-dom';

import dayjs from 'dayjs';
import { cloneDeep } from 'lodash';

import { SelectItem } from '@pages/area/landTopic/components/IndexTable';
import { LAND_TOPIC_OVERVIEW_MAIN_EXPORT } from '@pages/area/landTopic/modules/overview/provider';

import ExportDoc from '@/components/exportDoc';
import { formatNumber } from '@/utils/format';

interface Props {
  dataSource: Record<string, any>[];
  indicator: SelectItem[];
  expandedRows: string[];
}

const ExportTable: FC<Props> = ({ dataSource, indicator, expandedRows }) => {
  const { titles, flatIndicators } = useMemo(() => {
    const titles = [['省份'], ['地级市'], ['区县']];
    const flatIndicators = [
      { dataIndex: 'provinceName', format: false },
      { dataIndex: 'cityName', format: false },
      { dataIndex: 'countryName', format: false },
    ];
    const getIndicator = (list: any[]) => {
      list.forEach(({ dataIndex, tableTitle, unit, children }) => {
        if (children?.length) {
          getIndicator(children);
        } else {
          flatIndicators.push({ dataIndex, format: !!unit });
          titles.push([tableTitle]);
        }
      });
    };
    getIndicator(indicator);
    return { titles, flatIndicators };
  }, [indicator]);

  const condition = useMemo(() => {
    const colData = cloneDeep(titles);
    const getData = (list: any[]) => {
      list.forEach((item) => {
        const { children, key, isEmpty } = item;
        if (!isEmpty) {
          flatIndicators.forEach(({ dataIndex, format }, i) => {
            const value = item[dataIndex];
            colData[i].push(value ? (format ? formatNumber(value, value.includes('.') ? 2 : 0) : value) : '');
          });
        }
        if (children?.length && expandedRows.includes(key)) {
          getData(children);
        }
      });
    };
    getData(dataSource);
    return {
      module_type: 'land-land-info',
      sheetNames: { '0': '招拍挂_土地出让统计' },
      resJson: {
        data: {
          招拍挂_土地出让统计: [{ data: colData }],
        },
      },
    };
  }, [expandedRows, flatIndicators, titles, dataSource]);

  return createPortal(
    <ExportDoc isLargeParams condition={condition} filename={`招拍挂_土地出让统计_${dayjs().format('YYYYMMDD')}`} />,
    document.getElementById(LAND_TOPIC_OVERVIEW_MAIN_EXPORT) || document.body,
  );
};

export default memo(ExportTable);
