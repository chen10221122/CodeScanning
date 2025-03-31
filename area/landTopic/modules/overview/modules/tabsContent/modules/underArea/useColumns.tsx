import { useHistory } from 'react-router-dom';

import { useCreation } from 'ahooks';
import { ColumnsType } from 'antd/es/table';

import { SelectItem } from '@pages/area/landTopic/components/IndexTable';
import useIndicatorColumn from '@pages/area/landTopic/modules/overview/modules/cardTable/hooks/useIndicatorColumn';

import { LINK_AREA_F9 } from '@/configs/routerMap';
import { dynamicLink } from '@/utils/router';
import { urlJoin, urlQueriesSerialize } from '@/utils/url';

interface Props {
  indicator: SelectItem[];
  sortKey?: string;
  sortRule?: string;
}
const useColumns = ({ sortKey, sortRule, indicator }: Props) => {
  const history = useHistory();
  const { indicatorColumns } = useIndicatorColumn({
    sortKey,
    sortRule,
    indicator,
  });

  const columns: ColumnsType<any> = useCreation(
    () => [
      {
        title: '地区',
        dataIndex: 'areaName',
        key: 'areaName',
        width: 120,
        align: 'center',
        fixed: 'left',
        render: (text, record) => {
          const { areaCode } = record;
          return (
            <span
              className="ellipsis2 link-underline"
              onClick={() => {
                areaCode &&
                  history.push(
                    urlJoin(
                      dynamicLink(LINK_AREA_F9, { key: 'regionEconomy', code: areaCode }),
                      urlQueriesSerialize({
                        code: areaCode,
                      }),
                    ),
                  );
              }}
            >
              {text}
            </span>
          );
        },
      },
      ...indicatorColumns,
    ],
    [indicatorColumns],
  );

  return columns;
};

export default useColumns;
