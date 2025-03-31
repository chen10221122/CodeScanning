import { ScreenType } from '@/components/screen';
import CommonLayout from '@/pages/area/areaFinanceResource/components/layout';
import Template from '@/pages/area/areaFinanceResource/components/template';

import { getScaleList } from '../../api';
import useTableData from '../../hooks/useTableData';
import useCommonScreen from '../../useCommonScreen';
import useColumns from './useColumns';
import useScreen from './useScreen';

const areaLevelOption = [
  {
    title: '地区',
    option: {
      type: ScreenType.SINGLE,
      cancelable: false,
      children: [
        {
          name: '按省',
          value: 'province',
          key: 'regionLevel',
        },
        {
          name: '按市',
          key: 'regionLevel',
          value: 'city',
        },
        {
          name: '按区县',
          key: 'regionLevel',
          value: 'county',
        },
      ],
    },
  },
];

const Content = ({ containerId }: { containerId?: string }) => {
  const columns = useColumns();
  const { areaValue, options, value, handleScreen } = useScreen();
  const { screenConfig } = useCommonScreen();

  useTableData({ api: getScaleList });
  return (
    <Template
      pageConfig={{
        columns,
        screenConfig: options,
        screenValue: value,
        handleScreen,
        resizeTable: true,
        areaFormConfig: screenConfig,
        areaLevelOption: areaLevelOption,
        areaValue,
        containerId,
      }}
    />
  );
};

export default function LoanScale({ containerId }: { containerId?: string }) {
  return (
    <CommonLayout>
      <div style={{ flex: 1 }}>
        <Content containerId={containerId} />
      </div>
    </CommonLayout>
  );
}
